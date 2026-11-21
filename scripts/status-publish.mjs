#!/usr/bin/env node
/**
 * Appends one bot status check and writes it to public/status.json.
 *
 * Run this from the bot's host on a five-minute schedule:
 *
 *   STATUS_ONLINE=1 STATUS_LATENCY_MS=42 STATUS_VERSION=1.0.0 \
 *     node scripts/status-publish.mjs --publish
 *
 * Environment
 *   STATUS_ONLINE       1 / 0 / true / false        (required)
 *   STATUS_LATENCY_MS   round-trip milliseconds    (optional)
 *   STATUS_VERSION      running bot version        (optional)
 *   STATUS_TIMESTAMP    ISO timestamp              (default: now)
 *   GITHUB_TOKEN        token with contents:write  (required for --publish)
 *   STATUS_REPO         owner/repo                 (default: the site repo)
 *   STATUS_BRANCH       branch                     (default: main)
 *
 * Without --publish it only updates the local public/status.json, which is
 * useful for testing. With --publish it reads the current file through the
 * GitHub API, appends the check, trims the window to 24 hours and writes it
 * back. The deploy workflow ignores this file, so a status write does not
 * trigger a site rebuild.
 */
import fs from 'node:fs/promises';

const FILE = 'public/status.json';
const WINDOW_MS = 24 * 60 * 60 * 1000;

const REPO = process.env.STATUS_REPO ?? 'Next-Step-Studios-Official/Next-Step-Studios-Official.github.io';
const BRANCH = process.env.STATUS_BRANCH ?? 'main';
const API_PATH = 'public/status.json';

const raw = (process.env.STATUS_ONLINE ?? '').trim().toLowerCase();
if (!['1', '0', 'true', 'false'].includes(raw)) {
  console.error('STATUS_ONLINE must be 1, 0, true or false.');
  process.exit(1);
}

const online = raw === '1' || raw === 'true';
const latency = Number(process.env.STATUS_LATENCY_MS ?? '');
const timestamp = process.env.STATUS_TIMESTAMP ?? new Date().toISOString();

if (!Number.isFinite(new Date(timestamp).getTime())) {
  console.error(`STATUS_TIMESTAMP is not a valid date: ${timestamp}`);
  process.exit(1);
}

const empty = {
  schema: 1,
  generatedAt: timestamp,
  bot: { online, latencyMs: Number.isFinite(latency) ? Math.round(latency) : null, version: process.env.STATUS_VERSION ?? null },
  checks: [],
};

const normalise = (feed) => {
  const checks = Array.isArray(feed?.checks) ? feed.checks : [];
  return {
    schema: 1,
    generatedAt: timestamp,
    bot: {
      online,
      latencyMs: Number.isFinite(latency) ? Math.round(latency) : null,
      version: process.env.STATUS_VERSION ?? feed?.bot?.version ?? null,
    },
    checks: [
      ...checks,
      { t: timestamp, online, ms: Number.isFinite(latency) ? Math.round(latency) : null },
    ]
      .filter((check) => Number.isFinite(new Date(check.t).getTime()))
      .filter((check) => Date.now() - new Date(check.t).getTime() <= WINDOW_MS)
      .sort((a, b) => new Date(a.t).getTime() - new Date(b.t).getTime()),
  };
};

const publish = process.argv.includes('--publish');

if (!publish) {
  const feed = await fs
    .readFile(FILE, 'utf8')
    .then((body) => JSON.parse(body))
    .catch(() => empty);
  const next = normalise(feed);
  await fs.writeFile(FILE, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Updated ${FILE}: ${next.checks.length} checks, bot ${online ? 'online' : 'offline'}.`);
  process.exit(0);
}

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN is required with --publish.');
  process.exit(1);
}

const api = `https://api.github.com/repos/${REPO}/contents/${API_PATH}`;
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'next-step-studios-status-publisher',
};

const currentResponse = await fetch(`${api}?ref=${encodeURIComponent(BRANCH)}`, { headers });
let sha;
let current = empty;

if (currentResponse.ok) {
  const payload = await currentResponse.json();
  sha = payload.sha;
  current = JSON.parse(Buffer.from(payload.content, 'base64').toString('utf8'));
} else if (currentResponse.status !== 404) {
  console.error(`Could not read ${API_PATH}: ${currentResponse.status} ${currentResponse.statusText}`);
  process.exit(1);
}

const next = normalise(current);
const body = {
  message: `chore(status): bot ${online ? 'online' : 'offline'} at ${timestamp}`,
  content: Buffer.from(`${JSON.stringify(next, null, 2)}\n`).toString('base64'),
  branch: BRANCH,
  ...(sha ? { sha } : {}),
};

const writeResponse = await fetch(api, {
  method: 'PUT',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

if (!writeResponse.ok) {
  console.error(`Could not write ${API_PATH}: ${writeResponse.status} ${await writeResponse.text()}`);
  process.exit(1);
}

console.log(`Published ${next.checks.length} checks to ${REPO}@${BRANCH}.`);
