#!/usr/bin/env node
/**
 * The contact service.
 *
 * GitHub Pages serves the static site and cannot run server code, so this
 * small Node process handles the three things a static build cannot do:
 *
 *   POST /api/contact      receive a validated message, rate-limited, stored
 *   /dashboard             password-protected inbox, server-side authorised
 *   GET  /api/messages     read messages (session cookie required)
 *
 * It uses only the Node standard library: no framework, no database package,
 * no third-party service. Messages are appended to a newline-delimited JSON
 * file under DATA_DIR. That is deliberately boring; it is also easy to back up
 * and easy to move to a real database later without changing the API.
 *
 * Required for the dashboard:
 *   SESSION_SECRET        random string, at least 32 characters
 *   ADMIN_PASSWORD_HASH   output of `node server/hash-password.mjs`
 * Optional:
 *   PORT (default 8787), DATA_DIR, CONTACT_ALLOWED_ORIGIN,
 *   CONTACT_WEBHOOK_URL, CONTACT_RATE_LIMIT (default 5 per 15 minutes)
 */
import { createServer } from 'node:http';
import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const PORT = Number(process.env.PORT ?? 8787);
const DATA_DIR = process.env.DATA_DIR ?? 'server-data';
const MESSAGES_FILE = join(DATA_DIR, 'messages.ndjson');
const ALLOWED_ORIGIN = (process.env.CONTACT_ALLOWED_ORIGIN ?? '').replace(/\/$/, '');
const SESSION_SECRET = process.env.SESSION_SECRET ?? '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? '';
const WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL ?? '';
const RATE_LIMIT = Number(process.env.CONTACT_RATE_LIMIT ?? 5);
const WINDOW_MS = 15 * 60 * 1000;
const SESSION_MS = 8 * 60 * 60 * 1000;
const SUBJECTS = new Set(['general', 'privacy', 'security', 'bug', 'partnership', 'other']);

const dashboardReady = Boolean(SESSION_SECRET && ADMIN_PASSWORD_HASH);

await mkdir(DATA_DIR, { recursive: true });

/* ── small helpers ─────────────────────────────────────────────────────── */

const send = (res, status, body, headers = {}) => {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': typeof body === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  res.end(payload);
};

const readJson = (req, limit = 64 * 1024) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });

const clientIp = (req) =>
  (req.headers['x-forwarded-for']?.split(',')[0] ?? req.socket.remoteAddress ?? 'unknown').trim();

const fingerprint = (req) =>
  createHmac('sha256', SESSION_SECRET || 'contact-rate-limit')
    .update(clientIp(req))
    .digest('hex')
    .slice(0, 24);

const hits = new Map();
const rateLimited = (key, max = RATE_LIMIT) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= max) {
    hits.set(key, recent);
    return Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [entry, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(entry);
    }
  }
  return 0;
};

const sign = (value) =>
  createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');

const sessionCookie = () => {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + SESSION_MS })).toString('base64url');
  const secure = ALLOWED_ORIGIN.startsWith('https://') ? ' Secure;' : '';
  return `nss_admin=${payload}.${sign(payload)}; HttpOnly;${secure} SameSite=Lax; Path=/; Max-Age=${SESSION_MS / 1000}`;
};

const clearCookie = () => 'nss_admin=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0';

const cookies = (req) =>
  Object.fromEntries(
    (req.headers.cookie ?? '')
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return [part.slice(0, index), part.slice(index + 1)];
      }),
  );

const authorised = (req) => {
  if (!dashboardReady) return false;
  const token = cookies(req).nss_admin;
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return false;
  }
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
};

const verifyPassword = (password) => {
  const [scheme, saltHex, keyHex] = ADMIN_PASSWORD_HASH.split(':');
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;
  const expected = Buffer.from(keyHex, 'hex');
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return timingSafeEqual(actual, expected);
};

const crossOrigin = (req) => {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    return new URL(origin).host !== req.headers.host;
  } catch {
    return true;
  }
};

const readMessages = async () => {
  try {
    const raw = await readFile(MESSAGES_FILE, 'utf8');
    return raw
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line))
      .reverse();
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
};

const rewriteMessages = async (messages) => {
  const temp = `${MESSAGES_FILE}.tmp`;
  await writeFile(temp, messages.map((message) => JSON.stringify(message)).join('\n') + '\n');
  await rename(temp, MESSAGES_FILE);
};

/* ── dashboard page ───────────────────────────────────────────────────── */

const dashboardHtml = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Contact inbox — Next Step Studios</title>
<style>
  :root { color-scheme: dark; --ink:#e9eef7; --muted:#8b97a9; --line:#232a36; --panel:#0f131a; --accent:#4d8dff; }
  * { box-sizing: border-box; }
  body { margin:0; background:#07080b; color:var(--ink); font:16px/1.55 system-ui, -apple-system, Segoe UI, sans-serif; }
  header { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem clamp(1rem,4vw,2.5rem); border-bottom:1px solid var(--line); }
  main { max-width: 60rem; margin: 0 auto; padding: 2rem 1rem 4rem; }
  h1 { font-size:1.4rem; margin:0; }
  .label { color:var(--muted); font:600 0.7rem/1.4 ui-monospace, monospace; letter-spacing:.12em; text-transform:uppercase; }
  .panel { background:var(--panel); border:1px solid var(--line); border-radius:.75rem; padding:1.25rem; }
  form { display:grid; gap:.75rem; max-width:22rem; margin-top:1rem; }
  input, button, select { font:inherit; }
  input { padding:.6rem .75rem; border:1px solid var(--line); border-radius:.45rem; background:#0b0f15; color:var(--ink); }
  button { padding:.6rem 1rem; border:1px solid var(--accent); border-radius:.45rem; background:var(--accent); color:#06080c; font-weight:600; cursor:pointer; }
  button.ghost { background:transparent; color:var(--ink); border-color:var(--line); }
  .msg { border-top:1px solid var(--line); padding:1.1rem 0; }
  .msg:first-child { border-top:0; }
  .msg-head { display:flex; flex-wrap:wrap; gap:.4rem 1rem; align-items:baseline; justify-content:space-between; }
  .msg h2 { font-size:1rem; margin:0; }
  .meta { color:var(--muted); font-size:.8rem; }
  .body { white-space:pre-wrap; margin:.6rem 0 0; }
  .actions { display:flex; gap:.5rem; margin-top:.75rem; }
  .status { font:600 .7rem/1 ui-monospace, monospace; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); }
  .error { color:#ff8f8f; }
  [hidden] { display:none !important; }
</style>
</head>
<body>
<header>
  <div>
    <p class="label">Next Step Studios</p>
    <h1>Contact inbox</h1>
  </div>
  <button class="ghost" id="logout" hidden>Sign out</button>
</header>
<main>
  <section class="panel" id="login">
    <p class="label">Staff only</p>
    <p>Sign in with the dashboard password. Sessions last eight hours and are held in an HttpOnly cookie.</p>
    <form id="login-form">
      <label class="label" for="password">Password</label>
      <input id="password" type="password" autocomplete="current-password" required />
      <button type="submit">Sign in</button>
      <p class="error" id="login-error" role="alert"></p>
    </form>
  </section>

  <section id="app" hidden>
    <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; margin-bottom:1rem;">
      <p class="label" id="count">Messages</p>
      <button class="ghost" id="refresh" type="button">Refresh</button>
    </div>
    <div id="list"></div>
    <p id="empty" class="meta" hidden>No messages yet.</p>
  </section>
</main>
<script>
  const $ = (selector) => document.querySelector(selector);
  const list = $('#list');
  const loginPanel = $('#login');
  const app = $('#app');
  const logout = $('#logout');
  const empty = $('#empty');
  const count = $('#count');

  const api = async (path, options = {}) => {
    const response = await fetch(path, { credentials: 'same-origin', ...options });
    const body = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, body };
  };

  const showLogin = () => {
    loginPanel.hidden = false;
    app.hidden = true;
    logout.hidden = true;
  };

  const showApp = () => {
    loginPanel.hidden = true;
    app.hidden = false;
    logout.hidden = false;
  };

  const render = (messages) => {
    list.replaceChildren();
    empty.hidden = messages.length > 0;
    count.textContent = messages.length + (messages.length === 1 ? ' message' : ' messages');

    messages.forEach((message) => {
      const article = document.createElement('article');
      article.className = 'msg';

      const head = document.createElement('div');
      head.className = 'msg-head';

      const title = document.createElement('h2');
      title.textContent = message.subject;
      head.append(title);

      const status = document.createElement('span');
      status.className = 'status';
      status.textContent = message.status;
      head.append(status);

      const meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = message.name + ' · ' + message.email + ' · ' + new Date(message.receivedAt).toLocaleString('en-GB');
      const body = document.createElement('p');
      body.className = 'body';
      body.textContent = message.message;

      const actions = document.createElement('div');
      actions.className = 'actions';
      ['read', 'done'].forEach((next) => {
        if (message.status === next) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ghost';
        button.textContent = next === 'read' ? 'Mark read' : 'Mark done';
        button.addEventListener('click', async () => {
          await api('/api/messages/' + encodeURIComponent(message.id), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: next }),
          });
          load();
        });
        actions.append(button);
      });

      article.append(head, meta, body, actions);
      list.append(article);
    });
  };

  const load = async () => {
    const { ok, body } = await api('/api/messages');
    if (!ok) {
      showLogin();
      return;
    }
    showApp();
    render(body.messages ?? []);
  };

  $('#login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = $('#login-error');
    error.textContent = '';
    const { ok, body } = await api('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: $('#password').value }),
    });
    if (!ok) {
      error.textContent = body.error ?? 'Sign-in failed.';
      return;
    }
    $('#password').value = '';
    load();
  });

  logout.addEventListener('click', async () => {
    await api('/api/logout', { method: 'POST' });
    showLogin();
  });

  $('#refresh').addEventListener('click', load);
  load();
</script>
</body>
</html>`;

/* ── routing ───────────────────────────────────────────────────────────── */

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const path = url.pathname;
  const method = req.method ?? 'GET';

  if (ALLOWED_ORIGIN && req.headers.origin === ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }

  try {
    if (method === 'OPTIONS' && path === '/api/contact') {
      res.writeHead(204, { 'Access-Control-Max-Age': '86400' });
      res.end();
      return;
    }

    if (path === '/healthz') {
      send(res, 200, { ok: true, dashboard: dashboardReady });
      return;
    }

    if (path === '/' || path === '/dashboard') {
      send(res, 200, dashboardHtml, { 'Content-Type': 'text/html; charset=utf-8' });
      return;
    }

    if (path === '/api/contact' && method === 'POST') {
      if (ALLOWED_ORIGIN && req.headers.origin && req.headers.origin !== ALLOWED_ORIGIN) {
        send(res, 403, { ok: false, error: 'Origin not allowed.' });
        return;
      }

      const wait = rateLimited(`contact:${fingerprint(req)}`);
      if (wait > 0) {
        send(res, 429, { ok: false, error: 'Too many messages. Try again later.', retryAfter: wait }, {
          'Retry-After': String(wait),
        });
        return;
      }

      const body = await readJson(req);
      const name = String(body.name ?? '').trim();
      const email = String(body.email ?? '').trim();
      const subject = String(body.subject ?? '').trim();
      const message = String(body.message ?? '').trim();
      const honeypot = String(body.website ?? '').trim();
      const elapsed = Number(body.elapsedMs ?? 0);

      if (honeypot) {
        // Pretend success so a bot cannot tune its behaviour.
        send(res, 201, { ok: true, id: null });
        return;
      }
      if (elapsed < 1200) {
        send(res, 400, { ok: false, error: 'That was submitted too quickly. Please try again.' });
        return;
      }
      if (name.length < 1 || name.length > 80) {
        send(res, 400, { ok: false, error: 'Please give a name between 1 and 80 characters.' });
        return;
      }
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        send(res, 400, { ok: false, error: 'Please give a valid email address.' });
        return;
      }
      if (!SUBJECTS.has(subject)) {
        send(res, 400, { ok: false, error: 'Please choose a subject.' });
        return;
      }
      if (message.length < 10 || message.length > 5000) {
        send(res, 400, { ok: false, error: 'Please write between 10 and 5000 characters.' });
        return;
      }

      const record = {
        id: randomUUID(),
        receivedAt: new Date().toISOString(),
        name,
        email,
        subject,
        message,
        status: 'new',
        ip: fingerprint(req),
      };

      await appendFile(MESSAGES_FILE, `${JSON.stringify(record)}\n`);

      if (WEBHOOK_URL) {
        const summary = `New contact message (${subject})\nFrom: ${name} <${email}>\n\n${message.slice(0, 1500)}`;
        fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: summary, text: summary }),
        }).catch((error) => console.warn('contact webhook failed:', error.message));
      }

      send(res, 201, { ok: true, id: record.id });
      return;
    }

    if (path === '/api/login' && method === 'POST') {
      if (!dashboardReady) {
        send(res, 503, { ok: false, error: 'The dashboard is not configured on this server.' });
        return;
      }
      const wait = rateLimited(`login:${fingerprint(req)}`, 10);
      if (wait > 0) {
        send(res, 429, { ok: false, error: 'Too many attempts. Try again later.', retryAfter: wait }, {
          'Retry-After': String(wait),
        });
        return;
      }
      const { password } = await readJson(req);
      if (typeof password !== 'string' || !verifyPassword(password)) {
        send(res, 401, { ok: false, error: 'Incorrect password.' });
        return;
      }
      send(res, 200, { ok: true }, { 'Set-Cookie': sessionCookie() });
      return;
    }

    if (path === '/api/logout' && method === 'POST') {
      send(res, 200, { ok: true }, { 'Set-Cookie': clearCookie() });
      return;
    }

    if (path === '/api/messages' && method === 'GET') {
      if (!authorised(req)) {
        send(res, 401, { ok: false, error: 'Sign in required.' });
        return;
      }
      const messages = await readMessages();
      send(res, 200, { ok: true, messages });
      return;
    }

    const patch = path.match(/^\/api\/messages\/([^/]+)$/);
    if (patch && method === 'PATCH') {
      if (!authorised(req)) {
        send(res, 401, { ok: false, error: 'Sign in required.' });
        return;
      }
      if (crossOrigin(req)) {
        send(res, 403, { ok: false, error: 'Cross-origin request refused.' });
        return;
      }
      const { status } = await readJson(req);
      if (!['new', 'read', 'done'].includes(status)) {
        send(res, 400, { ok: false, error: 'Unknown status.' });
        return;
      }
      const messages = await readMessages();
      const target = messages.find((entry) => entry.id === decodeURIComponent(patch[1]));
      if (!target) {
        send(res, 404, { ok: false, error: 'Message not found.' });
        return;
      }
      target.status = status;
      await rewriteMessages(messages);
      send(res, 200, { ok: true });
      return;
    }

    send(res, 404, { ok: false, error: 'Not found.' });
  } catch (error) {
    console.error(error);
    send(res, 400, { ok: false, error: error.message === 'Invalid JSON' ? 'Invalid request.' : 'Request failed.' });
  }
});

server.listen(PORT, () => {
  console.log(`contact service listening on http://0.0.0.0:${PORT}`);
  console.log(`dashboard: ${dashboardReady ? 'configured' : 'DISABLED — set SESSION_SECRET and ADMIN_PASSWORD_HASH'}`);
  if (ALLOWED_ORIGIN) console.log(`accepting form posts from ${ALLOWED_ORIGIN}`);
});

// Exported for tests or a future serverless adapter; harmless when unused.
export { server };
