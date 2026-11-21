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
 *   DELETE /api/messages/:id   delete one message permanently
 *   GET  /api/messages/export  download every stored message as JSON
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
 *   CONTACT_WEBHOOK_URL, CONTACT_RATE_LIMIT (default 5 per 15 minutes),
 *   RESEND_API_KEY, NOTIFY_EMAIL, MAIL_FROM (email copies, free plan)
 */
import { createServer } from 'node:http';
import { createHmac, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { loadEnvFile } from 'node:process';

// `npm run contact` should read the project's .env automatically. A missing
// .env is normal (the service can run from real environment variables); any
// other error, such as a malformed line, is surfaced instead of hidden.
try {
  loadEnvFile();
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const PORT = Number(process.env.PORT ?? 8787);
const DATA_DIR = process.env.DATA_DIR ?? 'server-data';
const MESSAGES_FILE = join(DATA_DIR, 'messages.ndjson');
const ALLOWED_ORIGIN = (process.env.CONTACT_ALLOWED_ORIGIN ?? '').replace(/\/$/, '');
const SESSION_SECRET = process.env.SESSION_SECRET ?? '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? '';
const WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL ?? '';
const RESEND_API_KEY = (process.env.RESEND_API_KEY ?? '').trim();
const NOTIFY_EMAIL = (
  process.env.NOTIFY_EMAIL ?? ''
).trim() || 'nextstepstudiosofficial.contact@gmail.com';
const MAIL_FROM = (process.env.MAIL_FROM ?? '').trim() || 'onboarding@resend.dev';
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

/* ── email notification ─────────────────────────────────────────────── */

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character],
  );

/** True when an API key and a destination are configured. */
const emailReady = Boolean(RESEND_API_KEY && NOTIFY_EMAIL && MAIL_FROM);

/** Resend transaction email. Best effort: never throws into the request path. */
const sendEmail = async (record) => {
  if (!emailReady) return false;
  const text = [
    `New ${record.subject} message from ${record.name}`,
    `From: ${record.name} <${record.email}>`,
    `Received: ${record.receivedAt}`,
    `Message ID: ${record.id}`,
    '',
    record.message,
    '',
    'Reply to this email to answer directly.',
  ].join('\n');
  const html = [
    '<div style="font:16px/1.55 system-ui,sans-serif;color:#101520">',
    `<h2 style="margin:0 0 .75rem">New ${escapeHtml(record.subject)} message</h2>`,
    `<p style="margin:0 0 .35rem"><strong>From:</strong> ${escapeHtml(record.name)} &lt;${escapeHtml(record.email)}&gt;</p>`,
    `<p style="margin:0 0 .35rem"><strong>Received:</strong> ${escapeHtml(record.receivedAt)}</p>`,
    `<p style="margin:0 0 1rem"><strong>Message ID:</strong> ${escapeHtml(record.id)}</p>`,
    '<hr style="border:0;border-top:1px solid #d3d9e3;margin:1rem 0">',
    `<p style="white-space:pre-wrap;margin:0">${escapeHtml(record.message)}</p>`,
    '<p style="margin:1.25rem 0 0;color:#5a6678;font-size:13px">Reply to this email to answer directly.</p>',
    '</div>',
  ].join('');
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `Next Step Studios <${MAIL_FROM}>`,
      to: [NOTIFY_EMAIL],
      reply_to: record.email,
      subject: `New ${record.subject} message from ${record.name}`,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.warn('contact email failed:', response.status, detail.slice(0, 300));
    return false;
  }
  return true;
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
  .hint { color:var(--muted); font-size:.8125rem; }
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
    <p class="hint">This inbox manages contact messages only. Website pages are edited in the repository, not here.</p>
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
      <div style="display:flex; flex-wrap:wrap; gap:.5rem;">
        <a href="/api/messages/export" download style="padding:.6rem 1rem;border:1px solid #5c6675;border-radius:.45rem;color:inherit;text-decoration:none;">Export JSON</a>
        <button class="ghost" id="refresh" type="button">Refresh</button>
      </div>
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

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'ghost';
      remove.style.borderColor = '#7a2f2f';
      remove.style.color = '#ff9b9b';
      remove.textContent = 'Delete';
      remove.addEventListener('click', async () => {
        if (!window.confirm('Delete this message permanently? This cannot be undone.')) return;
        const result = await api('/api/messages/' + encodeURIComponent(message.id), {
          method: 'DELETE',
        });
        if (!result.ok) window.alert(result.body.error ?? 'The message could not be deleted.');
        load();
      });
      actions.append(remove);

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

      // Best effort, after the write: the message is already stored, so a
      // failed send is logged and the visitor still gets a success response.
      if (emailReady) sendEmail(record).catch((error) => console.warn('contact email failed:', error.message));

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

    if (path === '/api/messages/export' && method === 'GET') {
      if (!authorised(req)) {
        send(res, 401, { ok: false, error: 'Sign in required.' });
        return;
      }
      const messages = await readMessages();
      send(
        res,
        200,
        JSON.stringify({ exportedAt: new Date().toISOString(), count: messages.length, messages }, null, 2),
        {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="next-step-studios-messages-${new Date().toISOString().slice(0, 10)}.json"`,
        },
      );
      return;
    }

    const remove = path.match(/^\/api\/messages\/([^/]+)$/);
    if (remove && method === 'DELETE') {
      if (!authorised(req)) {
        send(res, 401, { ok: false, error: 'Sign in required.' });
        return;
      }
      if (crossOrigin(req)) {
        send(res, 403, { ok: false, error: 'Cross-origin request refused.' });
        return;
      }
      const messages = await readMessages();
      const remaining = messages.filter((entry) => entry.id !== decodeURIComponent(remove[1]));
      if (remaining.length === messages.length) {
        send(res, 404, { ok: false, error: 'Message not found.' });
        return;
      }
      // Stored oldest-first; readMessages reverses for display, so put it back.
      await rewriteMessages(remaining.reverse());
      send(res, 200, { ok: true });
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
      // readMessages returns newest-first; the file on disk stays oldest-first.
      await rewriteMessages(messages.reverse());
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
