# Next Step Studios — website

The public website for Next Step Studios: the studio, its Discord bot, the bot's
policy documents, a devlog and the downloads catalogue.

The site itself is static: Astro builds plain HTML into `dist/`, and GitHub
Pages serves it. The contact form is the one exception — GitHub Pages cannot run
server code, so the form posts to the contact service in `server/`. That service
is live as a Cloudflare Worker with a D1 database; `server/index.mjs` is the
same API for a plain Node host if you would rather run it yourself.

Live at **https://next-step-studios-official.github.io/**.

## Run it

```bash
npm install
npm run dev       # local preview with hot reload
npm run build     # releases → content guard → PDFs → static build into dist/
npm run preview   # serve the built dist/
```

`npm run build` runs five things:

1. `scripts/fetch-releases.mjs` — records GitHub Releases (skipped when no
   repositories are configured).
2. `scripts/verify-content.mjs` — refuses to build if internal material has
   leaked into `src/content`.
3. `scripts/make-pdfs.mjs` and `scripts/make-cheatsheet.mjs` — regenerate the
   PDF editions.
4. `scripts/make-brand-zip.mjs` — rebuilds the downloadable brand kit from the
   committed logo files, so the ZIP always matches them.
5. `astro build` — the pages, the search index, sitemap, RSS and robots.

Other commands:

```bash
npm run releases      # refresh src/data/releases.json from GitHub
npm run contact       # run the contact service locally
npm run hash-password # hash the dashboard password (add -- --worker for the deployed one)
npm run pdfs          # policy PDFs + the command cheatsheet
npm run cheatsheet    # the printable command cheatsheet only
npm run og            # regenerate the per-page share cards
npm run brand         # rebuild the transparent logo matrix, favicons and ZIP
npm run brand:zip     # rebuild only the brand kit ZIP
npm run status        # publish one status check (see below)
npm run snapshot      # record the current policy bodies as version snapshots
npm run assets        # alias for npm run brand
```

---

## What you need to add or replace

Everything below is a placeholder, an environment value or a piece of content
that only you can supply. Nothing in this list is invented in the code.

| Placeholder | Where it lives | What to put there |
| --- | --- | --- |
| `BREVO_API_KEY`, `NOTIFY_EMAIL`, `MAIL_FROM` | Worker secrets, and `.env` for the Node host | Brevo API key, the inbox that receives copies, the verified sender |
| `BOT_STATUS_URL` | Actions **repository variable** | The bot's public health URL |
| `@contributor-1` … `@contributor-4` | `src/lib/contributors.ts` | Real handles, roles and focus |
| `PUBLIC_CONTACT_ENDPOINT` | `.env` (optional) | Another contact service URL |
| `RELEASE_REPOS`, `GITHUB_TOKEN` | `.env` or the workflow | Repositories to list releases from |

### 1. The contact service

The form posts JSON to `CONTACT_ENDPOINT` in `src/lib/contact.ts`, which
defaults to the deployed service:

| What | Where |
| --- | --- |
| Form endpoint | `https://next-step-studios-contact-wqep7k.freebuff.site/api/contact` |
| Inbox | `https://next-step-studios-contact-wqep7k.freebuff.site/dashboard` |
| Health check | `https://next-step-studios-contact-wqep7k.freebuff.site/healthz` |

**Set the inbox password on your first visit.** Open the inbox link, choose a
password of 12 characters or more, and it is stored as a PBKDF2 hash in the D1
database. The setup screen refuses to run once a password exists. Nothing is
emailed, and no password is written down anywhere.

The service is `server/worker.mjs`, deployed from `server/sites.manifest.json`
with a D1 binding named `DB` and a `SESSION_SECRET` secret. The secret signs
session cookies and hashes IP addresses; rotating it signs every session out.

Optional settings, set as secrets on the worker:

| Value | Effect |
| --- | --- |
| `ADMIN_PASSWORD_HASH` | Fixes the password instead of using the setup screen. Print one with `npm run hash-password -- --worker 'your password'`. |
| `CONTACT_WEBHOOK_URL` | Discord/Slack webhook notified on each message (`{content, text}`). |
| `CONTACT_RATE_LIMIT` | Messages per IP per 15 minutes (default 5). |
| `ALLOWED_ORIGINS` | Extra comma-separated origins allowed to post, beyond the GitHub Pages origin. |
| `BREVO_API_KEY` | Brevo API key; the free plan sends 300 emails a day. Empty means no email. |
| `NOTIFY_EMAIL` | Inbox that receives each message. Defaults to the published contact address. |
| `MAIL_FROM` | A sender Brevo has verified. Defaults to `NOTIFY_EMAIL`. |

#### Email copies (free)

Messages are stored first, so email is optional and best effort: if a send
fails, the message is still in the inbox and the visitor still sees success.

Brevo's free plan sends 300 emails a day with no card and no custom domain:

1. Create an account at <https://app.brevo.com>, then open **SMTP & API → API
   keys** and create a key.
2. Add and verify the address you want copies sent to under **Senders**.
3. Set these on the deployed Worker (and in `.env` for the Node version):

   | Name | Value |
   | --- | --- |
   | `BREVO_API_KEY` | the key from step 1 |
   | `NOTIFY_EMAIL` | the inbox from step 2 — defaults to the published contact address |
   | `MAIL_FROM` | the verified sender — defaults to `NOTIFY_EMAIL` |

The notification is sent from `MAIL_FROM` with `Reply-To` set to the visitor, so
replying answers them directly. Until a key is set, `GET /healthz` reports
`"email": "not configured"` and the form works as before. The deployed Worker
must be redeployed after adding the key for the change to take effect.

Building the site with an empty `PUBLIC_CONTACT_ENDPOINT` puts the form back in
its "not connected" state: it renders, says it cannot send, and points at the
email address instead. It never claims a message was sent somewhere it wasn't.

#### Running the Node version instead

`server/index.mjs` is the same API for a host that runs Node 20+ — Render,
Railway, Fly.io, a VPS. GitHub Pages **cannot** run it. It stores messages in
`DATA_DIR/messages.ndjson` and reads `CONTACT_ALLOWED_ORIGIN`, `SESSION_SECRET`,
`ADMIN_PASSWORD_HASH` (a `scrypt:` hash from
`npm run hash-password -- 'your password'`), `PORT`, `DATA_DIR` and the optional
webhook and rate limit. Start it with `npm run contact`; the inbox is
`https://<host>/dashboard`. Point the site at it with
`PUBLIC_CONTACT_ENDPOINT=https://contact.example.com/api/contact` at build time.

### 2. The contributors list

`src/lib/contributors.ts` holds four placeholder entries (`@contributor-1` …
`@contributor-4`) alongside Candler Shaw, who runs the studio. Replace each
`handle`, `role` and `focus` with the real details, add `name:` where someone
wants their full name shown, then set:

```ts
export const CONTRIBUTORS_CONFIRMED = true;
```

Until that flag is true, the About and Team pages show a "Being confirmed"
notice. The count in the copy is derived from the list, so it stays correct.

### 3. Downloads

Two sources, both editable without touching a page:

- **Manual entries** — `src/data/downloads.json`. Each item takes `slug`,
  `title`, `summary`, `href`, and optionally `category` (`files`, `games`,
  `apps`, `other`), `platforms` (`windows`, `linux`, `macos`, `android`,
  `any`), `kinds` (`installer`, `archive`, `document`, `source`, `media`),
  `version`, `size`, `releaseUrl` and `formats`.
- **GitHub Releases** — set `RELEASE_REPOS` to a comma-separated list
  (`Owner/repo,Owner/repo2`) and run `npm run releases`. Every asset in the ten
  most recent releases is recorded in `src/data/releases.json`; platforms and
  file types are inferred from the filename. Add `GITHUB_TOKEN` to avoid the
  anonymous rate limit.

Builds should live in GitHub Releases, not in this repository. The site links to
the release asset and never re-hosts it.

### 4. Discord

`src/lib/discord.ts` is the single place for the invite and channel links.
The invite and the server id are set, and the ticket panel channel is linked
from the contact page. The other channel ids (announcements, development,
updates, support) are still empty and fall back to `null`, so the site omits
those links instead of showing dead buttons. Paste an id beside its name and
every component that reads it starts linking — Discord cannot resolve a channel
by name, so the id is the only way to deep-link one.

### 5. The contact email

`src/lib/site.ts` holds `contactEmail`. It is currently the temporary Gmail
address used on every policy page; replace it there and every mention updates.

### 6. The live status feed

`/status` reads `public/status.json` from this repository's raw GitHub URL.
The bot writes that file after each check and publishes it with
`scripts/status-publish.mjs --publish`, using a `GITHUB_TOKEN` with
`contents: write`. Until it runs on a schedule, the page shows an empty
history rather than an invented uptime figure. The deploy workflow ignores
status-only pushes, so a feed update does not trigger a rebuild.

#### Publishing checks from GitHub Actions (free)

`.github/workflows/status-probe.yml` probes one URL every five minutes and
commits the result, so the status page becomes live without a server. Set a
repository **variable** — not a secret, because the URL is public:

**Settings → Secrets and variables → Actions → Variables → New repository variable**

| Name | Value |
| --- | --- |
| `BOT_STATUS_URL` | The bot's public health URL, e.g. `https://bot.example.com/health` |

While it is empty the workflow exits without writing anything, and `/status`
keeps its honest empty state. A 2xx or 3xx response counts as online; anything
else, including a ten-second timeout, counts as offline. If the bot exposes no
HTTP endpoint, keep using `scripts/status-publish.mjs` on the bot's host.

### 7. Optional: a custom domain

`astro.config.mjs` reads `SITE_URL` and `BASE_PATH`; the deploy workflow supplies
both. Change them in the Pages settings rather than hard-coding a domain.

---

## The contact API

`POST /api/contact`

```json
{
  "name": "…", "email": "…", "subject": "general",
  "message": "…", "website": "", "elapsedMs": 4200
}
```

`subject` is one of `general`, `privacy`, `security`, `bug`, `partnership`,
`other`. `website` is a honeypot and must be empty; `elapsedMs` must be at least
1200. Responses: `201 {ok, id}`, `400 {ok, error}`, `429 {ok, error, retryAfter}`.

Dashboard routes, all requiring the signed session cookie:

- `POST /api/login` `{password}` → sets `nss_admin`, HttpOnly, SameSite=Lax.
- `POST /api/logout`
- `GET /api/messages`
- `PATCH /api/messages/:id` `{status: "new" | "read" | "done"}`

Both versions check the password with a slow hash (scrypt on the Node host,
PBKDF2 in the Worker), sign sessions with HMAC-SHA256, refuse cross-origin
`PATCH` requests, rate-limit contact posts and login attempts, hash IP addresses
before storing them, and send `no-store` on every API response. The Worker adds
`GET /api/state` and `POST /api/setup` for the first-run password screen.

## Where things live

| Path | What it is |
| --- | --- |
| `src/pages/` | Every route: pages, print layouts and static endpoints |
| `src/lib/` | Site data: commands, FAQ, roadmap, downloads, contributors, links |
| `src/data/` | Catalogue and release manifests filled at build time |
| `src/content/policies/bot/` | The seven public policy documents |
| `src/content/devlog/` | Devlog entries, with tags and series |
| `src/content/projects/` | Project entries and their honest statuses |
| `src/styles/` | Tokens, theme, shared components and page layouts |
| `server/` | The contact API and inbox: `worker.mjs` (deployed), `index.mjs` (Node host) |
| `public/brand/` | Generated transparent logo matrix, favicons and archived marks |
| `public/downloads/` | Generated PDFs and the brand kit ZIP, served as static files |
| `public/og/` | Per-page Open Graph cards |
| `scripts/` | Content guard, PDFs, cheatsheet, releases, share cards, snapshots, brand build and ZIP |

## Editing content

- **Policies** are Markdown with frontmatter. The page, the Markdown download,
  the plain-text download, the print edition and the PDF all come from the same
  file, so there is one wording to maintain.
- **Devlog** entries take `tags` and an optional `series`; tag pages and the RSS
  feed are generated from them.
- **Commands** live in `src/lib/commands.ts`. A command listed there exists in
  source; that is not a claim that it has been verified end to end.
- **Team** entries live in `src/lib/contributors.ts`; the About and Team pages
  and the footer read the same list.
- **Links** live in `src/lib/links.ts` and mirror the public subset of the bot's
  links panel. There is no separate social page.
- **Downloads** come from `src/data/downloads.json` and the release manifest.
- **Brand files** are generated by `scripts/make-brand-assets.mjs`; run
  `npm run brand` rather than editing `public/brand/` by hand.

A fuller map, including the status publisher and the contact service, is in
[`EDITING.md`](EDITING.md).

## Deployment

Pushing to `main` builds and publishes the site through
`.github/workflows/deploy.yml` (GitHub Pages, Actions source). Pushing any other
branch runs nothing and publishes nothing.

The site's internal links are absolute, so it must be served from a domain root.
That is why the repository is the organisation site repository
(`Next-Step-Studios-Official.github.io`) rather than a project repository.

The contact service is deployed separately. The live one is a Cloudflare Worker
whose messages live in D1, so back it up by exporting the `messages` table
rather than a file. If you run the Node version instead, back up
`DATA_DIR/messages.ndjson`; it is the only copy of the inbox, and the
file-backed store assumes a single instance.

## Invariants

These are product decisions, not defaults:

- No analytics, advertising, advertising cookies or third-party scripts. On
  page load, the only request to another host is the status page reading its
  JSON feed from GitHub; the contact form posts only when submitted.
- The contact form stores a message only so it can be answered, and the privacy
  notice says what, where and for how long.
- Nothing claims to be released that is not released. Drafts say draft,
  unverified says unverified, planned says planned.
- Builds are published through GitHub Releases, never committed to this
  repository.
- Public documents are mirrored to
  [bot-documentation](https://github.com/Next-Step-Studios-Official/bot-documentation).

Internal source material (`documentation-source/`, `docs/`, working captures) is
excluded from this repository by `.gitignore` and must stay that way.
