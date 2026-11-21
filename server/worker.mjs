/**
 * The contact service, as a Cloudflare Worker.
 *
 * `server/index.mjs` is the same service for a plain Node host. This file is
 * the deployed one: there is no server to keep alive, messages live in D1, and
 * the static site posts to it from another origin.
 *
 * Routes
 *   POST   /api/contact             receive a validated, rate-limited message
 *   GET    /dashboard               password-protected inbox (also `/`)
 *   GET    /api/state               { configured, signedIn } for the dashboard
 *   POST   /api/setup               first run only: choose the admin password
 *   POST   /api/login  /api/logout  signed HttpOnly session cookie
 *   GET    /api/messages            list messages (session required)
 *   PATCH  /api/messages/:id        { status: "new" | "read" | "done" }
 *   GET    /healthz                 liveness and configuration report
 *
 * Configuration (all optional except the D1 binding)
 *   DB                    D1 binding, created by the host
 *   SESSION_SECRET        random string; signs cookies and hashes IPs
 *   ADMIN_PASSWORD_HASH   optional `pbkdf2:<iterations>:<salt>:<hash>`
 *   ALLOWED_ORIGINS       extra comma-separated origins allowed to post
 *   CONTACT_WEBHOOK_URL   optional Discord/Slack webhook for new messages
 *   CONTACT_RATE_LIMIT    messages per IP per 15 minutes (default 5)
 *
 * If no password hash is configured the dashboard offers a one-time setup
 * screen, so the deployed inbox is never left with a password anybody knows.
 */

const SESSION_COOKIE = 'nss_admin';
const SESSION_MS = 8 * 60 * 60 * 1000;
const WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_RATE_LIMIT = 5;
/**
 * Cloudflare's production runtime refuses PBKDF2 above 100,000 iterations;
 * `wrangler dev` does not enforce the cap, so this value must stay at or below
 * it. Raising it produces a 500 on the first password hash and nowhere else.
 */
const PBKDF2_ITERATIONS = 100_000;
const SUBJECTS = new Set(['general', 'privacy', 'security', 'bug', 'partnership', 'other']);
const DEFAULT_ORIGINS = ['https://next-step-studios-official.github.io'];
const NO_STORE = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

const encoder = new TextEncoder();

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...NO_STORE, ...headers },
  });

const html = (body, status = 200, headers = {}) =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', ...NO_STORE, ...headers },
  });

/* ── crypto helpers ────────────────────────────────────────────────────── */

const toBase64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromBase64 = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
const toBase64Url = (value) =>
  btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromBase64Url = (value) => atob(value.replace(/-/g, '+').replace(/_/g, '/'));

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return difference === 0;
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return toBase64Url(String.fromCharCode(...new Uint8Array(signature)));
}

async function createPasswordHash(password, iterations = PBKDF2_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256,
  );
  return `pbkdf2:${iterations}:${toBase64(salt)}:${toBase64(bits)}`;
}

async function verifyPassword(password, stored) {
  const [scheme, iterations, salt, expected] = String(stored ?? '').split(':');
  if (scheme !== 'pbkdf2' || !iterations || !salt || !expected) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: fromBase64(salt), iterations: Number(iterations), hash: 'SHA-256' },
    key,
    256,
  );
  return constantTimeEqual(toBase64(bits), expected);
}

/* ── storage ───────────────────────────────────────────────────────────── */

let schemaPromise;

const ensureSchema = (env) => {
  if (!env.DB) return Promise.resolve(false);
  if (!schemaPromise) {
    schemaPromise = env.DB.batch([
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        received_at TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'new',
        ip_hash TEXT NOT NULL
      )`),
      env.DB.prepare('CREATE INDEX IF NOT EXISTS messages_received ON messages (received_at DESC)'),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`),
      env.DB.prepare(`CREATE TABLE IF NOT EXISTS rate (
        key TEXT NOT NULL,
        at INTEGER NOT NULL
      )`),
      env.DB.prepare('CREATE INDEX IF NOT EXISTS rate_key_at ON rate (key, at)'),
    ]).catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  return schemaPromise.then(() => true);
};

const getSetting = async (env, key) =>
  (await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first())?.value ??
  null;

const setSetting = (env, key, value) =>
  env.DB.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  )
    .bind(key, value)
    .run();

/** The configured hash, from a host secret first and D1 second. */
async function adminHash(env) {
  const injected = String(env.ADMIN_PASSWORD_HASH ?? '').trim();
  if (injected) return injected;
  return String((await getSetting(env, 'admin_password_hash')) ?? '').trim();
}

async function rateLimit(env, key, max) {
  const now = Date.now();
  await env.DB.prepare('DELETE FROM rate WHERE at < ?').bind(now - WINDOW_MS).run();
  const row = await env.DB.prepare(
    'SELECT COUNT(*) AS count, MIN(at) AS oldest FROM rate WHERE key = ?',
  )
    .bind(key)
    .first();
  if (Number(row?.count ?? 0) >= max) {
    const oldest = Number(row?.oldest ?? now);
    return Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000));
  }
  await env.DB.prepare('INSERT INTO rate (key, at) VALUES (?, ?)').bind(key, now).run();
  return 0;
}

/* ── request helpers ───────────────────────────────────────────────────── */

const readCookie = (request, name) => {
  for (const part of (request.headers.get('Cookie') ?? '').split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return value.join('=');
  }
  return '';
};

const clientIp = (request) =>
  (request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0] ??
    'unknown').trim();

async function fingerprint(env, request) {
  return (await sign(clientIp(request), env.SESSION_SECRET ?? 'contact-rate-limit')).slice(0, 24);
}

async function sessionCookie(env) {
  const payload = toBase64Url(JSON.stringify({ exp: Date.now() + SESSION_MS }));
  const signature = await sign(payload, env.SESSION_SECRET ?? '');
  return `${SESSION_COOKIE}=${payload}.${signature}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_MS / 1000}`;
}

const clearCookie = () =>
  `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;

async function signedIn(env, request) {
  if (!env.SESSION_SECRET) return false;
  const token = readCookie(request, SESSION_COOKIE);
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  if (!constantTimeEqual(signature, await sign(payload, env.SESSION_SECRET))) return false;
  try {
    const { exp } = JSON.parse(fromBase64Url(payload));
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

function originAllowed(env, request) {
  const origin = request.headers.get('Origin');
  if (!origin) return { origin: '', allowed: true };
  const allowed = new Set(DEFAULT_ORIGINS);
  for (const entry of String(env.ALLOWED_ORIGINS ?? '').split(',')) {
    const value = entry.trim().replace(/\/$/, '');
    if (value) allowed.add(value);
  }
  allowed.add(new URL(request.url).origin);
  return { origin, allowed: allowed.has(origin) };
}

async function readJson(request, limit = 64 * 1024) {
  const raw = await request.text();
  if (raw.length > limit) throw new Error('Request body too large');
  if (!raw) return {};
  return JSON.parse(raw);
}

/* ── dashboard ─────────────────────────────────────────────────────────── */

const dashboardHtml = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Contact inbox — Next Step Studios</title>
<style>
  :root { color-scheme: dark; --ink:#e9eef7; --muted:#9aa6b8; --line:#232a36; --panel:#0f131a; --accent:#4d8dff; }
  * { box-sizing: border-box; }
  body { margin:0; background:#07080b; color:var(--ink); font:16px/1.55 system-ui, -apple-system, Segoe UI, sans-serif; }
  header { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.25rem clamp(1rem,4vw,2.5rem); border-bottom:1px solid var(--line); }
  main { max-width: 60rem; margin: 0 auto; padding: 2rem 1rem 4rem; }
  h1 { font-size:1.4rem; margin:0; }
  .label { color:var(--muted); font:600 0.7rem/1.4 ui-monospace, monospace; letter-spacing:.12em; text-transform:uppercase; }
  .panel { background:var(--panel); border:1px solid var(--line); border-radius:.75rem; padding:1.25rem; }
  form { display:grid; gap:.75rem; max-width:22rem; margin-top:1rem; }
  input, button, select { font:inherit; }
  input { padding:.6rem .75rem; border:1px solid #5c6675; border-radius:.45rem; background:#0b0f15; color:var(--ink); }
  button { padding:.6rem 1rem; border:1px solid var(--accent); border-radius:.45rem; background:var(--accent); color:#06080c; font-weight:600; cursor:pointer; }
  button.ghost { background:transparent; color:var(--ink); border-color:#5c6675; }
  .msg { border-top:1px solid var(--line); padding:1.1rem 0; }
  .msg:first-child { border-top:0; }
  .msg-head { display:flex; flex-wrap:wrap; gap:.4rem 1rem; align-items:baseline; justify-content:space-between; }
  .msg h2 { font-size:1rem; margin:0; }
  .meta { color:var(--muted); font-size:.8rem; }
  .body { white-space:pre-wrap; margin:.6rem 0 0; }
  .actions { display:flex; flex-wrap:wrap; gap:.5rem; margin-top:.75rem; }
  .status { font:600 .7rem/1 ui-monospace, monospace; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); }
  .error { color:#ff9b9b; margin:0; }
  .hint { color:var(--muted); font-size:.8125rem; }
  [hidden] { display:none !important; }
  :focus-visible { outline:2px solid #9dc2ff; outline-offset:2px; }
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
  <section class="panel" id="setup" hidden>
    <p class="label">First run</p>
    <p>Choose the password for this inbox. It is stored as a PBKDF2 hash, so nobody — including the host — can read it back.</p>
    <form id="setup-form">
      <label class="label" for="new-password">New password (12 characters or more)</label>
      <input id="new-password" type="password" minlength="12" maxlength="200" autocomplete="new-password" required />
      <label class="label" for="confirm-password">Repeat password</label>
      <input id="confirm-password" type="password" minlength="12" maxlength="200" autocomplete="new-password" required />
      <button type="submit">Set password and open inbox</button>
      <p class="error" id="setup-error" role="alert"></p>
    </form>
  </section>

  <section class="panel" id="login" hidden>
    <p class="label">Staff only</p>
    <p>Sign in with the dashboard password. Sessions last eight hours and are held in an HttpOnly cookie.</p>
    <form id="login-form">
      <label class="label" for="password">Password</label>
      <input id="password" type="password" maxlength="200" autocomplete="current-password" required />
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
    <p id="empty" class="hint" hidden>No messages yet.</p>
  </section>
</main>
<script>
  const $ = (selector) => document.querySelector(selector);
  const list = $('#list');
  const panels = { setup: $('#setup'), login: $('#login'), app: $('#app') };
  const logout = $('#logout');
  const empty = $('#empty');
  const count = $('#count');

  const api = async (path, options = {}) => {
    const response = await fetch(path, { credentials: 'same-origin', ...options });
    const body = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, body };
  };

  const show = (name) => {
    Object.entries(panels).forEach(([key, panel]) => { panel.hidden = key !== name; });
    logout.hidden = name !== 'app';
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

      const status = document.createElement('span');
      status.className = 'status';
      status.textContent = message.status;

      head.append(title, status);

      const meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = message.name + ' · ' + message.email + ' · ' + new Date(message.receivedAt).toLocaleString('en-GB');

      const body = document.createElement('p');
      body.className = 'body';
      body.textContent = message.message;

      const actions = document.createElement('div');
      actions.className = 'actions';
      [['read', 'Mark read'], ['done', 'Mark done'], ['new', 'Mark new']].forEach(([next, label]) => {
        if (message.status === next) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ghost';
        button.textContent = label;
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
      show('login');
      return;
    }
    show('app');
    render(body.messages ?? []);
  };

  const start = async () => {
    const { ok, body } = await api('/api/state');
    if (!ok) {
      show('login');
      $('#login-error').textContent = 'The service is not reachable right now.';
      return;
    }
    if (!body.configured) {
      show('setup');
      return;
    }
    if (!body.signedIn) {
      show('login');
      return;
    }
    load();
  };

  $('#setup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const error = $('#setup-error');
    error.textContent = '';
    const password = $('#new-password').value;
    if (password !== $('#confirm-password').value) {
      error.textContent = 'The two passwords do not match.';
      return;
    }
    const { ok, body } = await api('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!ok) {
      error.textContent = body.error ?? 'That password could not be saved.';
      return;
    }
    load();
  });

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
    show('login');
  });

  $('#refresh').addEventListener('click', load);
  start();
</script>
</body>
</html>`;

/* ── the handler ───────────────────────────────────────────────────────── */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const method = request.method.toUpperCase();

    try {
      if (path === '/healthz') {
        return json({
          ok: true,
          storage: env.DB ? 'd1' : 'missing',
          session: env.SESSION_SECRET ? 'configured' : 'missing',
          dashboard: env.DB && env.SESSION_SECRET ? 'configured' : 'incomplete',
        });
      }

      if ((path === '/' || path === '/dashboard') && method === 'GET') {
        return html(dashboardHtml);
      }

      if (path.startsWith('/api/')) {
        if (!env.DB) {
          return json({ ok: false, error: 'Contact storage is not connected.' }, 503);
        }
        await ensureSchema(env);
      }

      /* ── public form ─────────────────────────────────────────────────── */
      if (path === '/api/contact' && method === 'OPTIONS') {
        const { origin, allowed } = originAllowed(env, request);
        if (!allowed) return json({ ok: false, error: 'Origin not allowed.' }, 403);
        return new Response(null, {
          status: 204,
          headers: {
            ...(origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {}),
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      if (path === '/api/contact' && method === 'POST') {
        const { origin, allowed } = originAllowed(env, request);
        if (!allowed) return json({ ok: false, error: 'Origin not allowed.' }, 403);
        const cors = origin ? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' } : {};
        const reply = (body, status = 200, headers = {}) => json(body, status, { ...cors, ...headers });

        const limit = Number(env.CONTACT_RATE_LIMIT ?? DEFAULT_RATE_LIMIT) || DEFAULT_RATE_LIMIT;
        const wait = await rateLimit(env, `contact:${await fingerprint(env, request)}`, limit);
        if (wait > 0) {
          return reply({ ok: false, error: 'Too many messages. Try again later.', retryAfter: wait }, 429, {
            'Retry-After': String(wait),
          });
        }

        let body;
        try {
          body = await readJson(request);
        } catch {
          return reply({ ok: false, error: 'Invalid request.' }, 400);
        }

        const name = String(body.name ?? '').trim();
        const email = String(body.email ?? '').trim();
        const subject = String(body.subject ?? '').trim();
        const message = String(body.message ?? '').trim();
        const honeypot = String(body.website ?? '').trim();
        const elapsed = Number(body.elapsedMs ?? 0);

        if (honeypot) return reply({ ok: true, id: null }, 201);
        if (!Number.isFinite(elapsed) || elapsed < 1200) {
          return reply({ ok: false, error: 'That was submitted too quickly. Please try again.' }, 400);
        }
        if (name.length < 1 || name.length > 80) {
          return reply({ ok: false, error: 'Please give a name between 1 and 80 characters.' }, 400);
        }
        if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return reply({ ok: false, error: 'Please give a valid email address.' }, 400);
        }
        if (!SUBJECTS.has(subject)) {
          return reply({ ok: false, error: 'Please choose a subject.' }, 400);
        }
        if (message.length < 10 || message.length > 5000) {
          return reply({ ok: false, error: 'Please write between 10 and 5000 characters.' }, 400);
        }

        const record = {
          id: crypto.randomUUID(),
          receivedAt: new Date().toISOString(),
          name,
          email,
          subject,
          message,
          status: 'new',
          ip: await fingerprint(env, request),
        };

        await env.DB.prepare(
          'INSERT INTO messages (id, received_at, name, email, subject, body, status, ip_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        )
          .bind(
            record.id,
            record.receivedAt,
            record.name,
            record.email,
            record.subject,
            record.message,
            record.status,
            record.ip,
          )
          .run();

        if (env.CONTACT_WEBHOOK_URL) {
          const summary = `New contact message (${subject})\nFrom: ${name} <${email}>\n\n${message.slice(0, 1500)}`;
          ctx.waitUntil(
            fetch(env.CONTACT_WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: summary, text: summary }),
            }).catch(() => undefined),
          );
        }

        return reply({ ok: true, id: record.id }, 201);
      }

      /* ── dashboard session ───────────────────────────────────────────── */
      if (path === '/api/state' && method === 'GET') {
        const configured = Boolean(await adminHash(env));
        return json({
          ok: true,
          configured,
          signedIn: configured && (await signedIn(env, request)),
          session: env.SESSION_SECRET ? 'configured' : 'missing',
        });
      }

      if (path === '/api/setup' && method === 'POST') {
        if (!env.SESSION_SECRET) {
          return json({ ok: false, error: 'This inbox has no session secret configured.' }, 503);
        }
        if (await adminHash(env)) {
          return json({ ok: false, error: 'This inbox already has a password.' }, 409);
        }
        const { password } = await readJson(request).catch(() => ({}));
        if (typeof password !== 'string' || password.length < 12 || password.length > 200) {
          return json({ ok: false, error: 'Use a password of 12 characters or more.' }, 400);
        }
        await setSetting(env, 'admin_password_hash', await createPasswordHash(password));
        return json({ ok: true }, 200, { 'Set-Cookie': await sessionCookie(env) });
      }

      if (path === '/api/login' && method === 'POST') {
        if (!env.SESSION_SECRET) {
          return json({ ok: false, error: 'This inbox has no session secret configured.' }, 503);
        }
        const stored = await adminHash(env);
        if (!stored) {
          return json({ ok: false, error: 'No password has been set for this inbox yet.' }, 503);
        }
        const wait = await rateLimit(env, `login:${await fingerprint(env, request)}`, 10);
        if (wait > 0) {
          return json({ ok: false, error: 'Too many attempts. Try again later.', retryAfter: wait }, 429, {
            'Retry-After': String(wait),
          });
        }
        const { password } = await readJson(request).catch(() => ({}));
        if (typeof password !== 'string' || !(await verifyPassword(password, stored))) {
          return json({ ok: false, error: 'Incorrect password.' }, 401);
        }
        return json({ ok: true }, 200, { 'Set-Cookie': await sessionCookie(env) });
      }

      if (path === '/api/logout' && method === 'POST') {
        return json({ ok: true }, 200, { 'Set-Cookie': clearCookie() });
      }

      if (path === '/api/messages' && method === 'GET') {
        if (!(await signedIn(env, request))) {
          return json({ ok: false, error: 'Sign in required.' }, 401);
        }
        const { results } = await env.DB.prepare(
          'SELECT id, received_at, name, email, subject, body, status FROM messages ORDER BY received_at DESC LIMIT 500',
        ).all();
        return json({
          ok: true,
          messages: (results ?? []).map((row) => ({
            id: row.id,
            receivedAt: row.received_at,
            name: row.name,
            email: row.email,
            subject: row.subject,
            message: row.body,
            status: row.status,
          })),
        });
      }

      const patch = path.match(/^\/api\/messages\/([^/]+)$/);
      if (patch && method === 'PATCH') {
        if (!(await signedIn(env, request))) {
          return json({ ok: false, error: 'Sign in required.' }, 401);
        }
        const { origin, allowed } = originAllowed(env, request);
        if (origin && (!allowed || origin !== url.origin)) {
          return json({ ok: false, error: 'Cross-origin request refused.' }, 403);
        }
        const { status } = await readJson(request).catch(() => ({}));
        if (!['new', 'read', 'done'].includes(status)) {
          return json({ ok: false, error: 'Unknown status.' }, 400);
        }
        const id = decodeURIComponent(patch[1]);
        const result = await env.DB.prepare('UPDATE messages SET status = ? WHERE id = ?')
          .bind(status, id)
          .run();
        if (!result.meta || result.meta.changes === 0) {
          return json({ ok: false, error: 'Message not found.' }, 404);
        }
        return json({ ok: true });
      }

      if (path.startsWith('/api/')) {
        return json({ ok: false, error: 'Not found.' }, 404);
      }

      if (env.ASSETS) return env.ASSETS.fetch(request);
      return json({ ok: false, error: 'Not found.' }, 404);
    } catch (error) {
      console.error('contact worker error', error);
      return json({ ok: false, error: 'Request failed.' }, 500);
    }
  },
};
