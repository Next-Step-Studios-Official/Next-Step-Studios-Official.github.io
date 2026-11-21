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

`npm run build` runs four things:

1. `scripts/fetch-releases.mjs` — records GitHub Releases (skipped when no
   repositories are configured).
2. `scripts/verify-content.mjs` — refuses to build if internal material has
   leaked into `src/content`.
3. `scripts/make-pdfs.mjs` and `scripts/make-cheatsheet.mjs` — regenerate the
   PDF editions.
4. `astro build` — the pages, the search index, sitemap, RSS and robots.

Other commands:

```bash
npm run releases      # refresh src/data/releases.json from GitHub
npm run contact       # run the contact service locally
npm run hash-password # hash the dashboard password (add -- --worker for the deployed one)
npm run pdfs          # policy PDFs + the command cheatsheet
npm run cheatsheet    # the printable command cheatsheet only
npm run og            # regenerate the per-page share cards
npm run logos         # rebuild PNG/JPG/SVG logo files and their sizes
npm run snapshot      # record the current policy bodies as version snapshots
npm run assets        # re-derive logo, favicons and banners from the bot repo
```

---

## What you need to add or replace

Everything below is a placeholder, an environment value or a piece of content
that only you can supply. Nothing in this list is invented in the code.

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

`src/lib/contributors.ts` holds five placeholder entries (`@contributor-1` …
`@contributor-5`). Replace each `handle`, `role` and `focus` with the real
details, add `name:` where someone wants their full name shown, then set:

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
The invite is already set; the guild and channel IDs are empty and fall back to
`null` (the site then links to `/social`). Fill them in when you want the site
to deep-link to channels.

### 5. The contact email

`src/lib/site.ts` holds `contactEmail`. It is currently the temporary Gmail
address used on every policy page; replace it there and every mention updates.

### 6. Optional: a custom domain

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
| `public/downloads/` | Generated PDFs, served as static files |
| `public/og/` | Per-page Open Graph cards |
| `scripts/` | Content guard, PDFs, cheatsheet, releases, share cards, snapshots |

## Editing content

- **Policies** are Markdown with frontmatter. The page, the Markdown download,
  the plain-text download, the print edition and the PDF all come from the same
  file, so there is one wording to maintain.
- **Devlog** entries take `tags` and an optional `series`; tag pages and the RSS
  feed are generated from them.
- **Commands** live in `src/lib/commands.ts`. A command listed there exists in
  source; that is not a claim that it has been verified end to end.
- **Links** live in `src/lib/links.ts` and mirror the bot's links panel.
- **Downloads** come from `src/data/downloads.json` and the release manifest.

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

- No analytics, advertising, advertising cookies or third-party requests.
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
