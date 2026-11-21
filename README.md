# Next Step Studios — website

The public website for Next Step Studios: the studio, its Discord bot, the bot's
policy documents, a devlog and the downloads catalogue.

The site itself is static: Astro builds plain HTML into `dist/`, and GitHub
Pages serves it. The contact form is the one exception — GitHub Pages cannot run
server code, so the form posts to a small Node service in `server/`. Nothing
else needs a backend.

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
npm run hash-password # hash the dashboard password
npm run pdfs          # policy PDFs + the command cheatsheet
npm run cheatsheet    # the printable command cheatsheet only
npm run og            # regenerate the per-page share cards
npm run snapshot      # record the current policy bodies as version snapshots
npm run assets        # re-derive logo, favicons and banners from the bot repo
```

---

## What you need to add or replace

Everything below is a placeholder, an environment value or a piece of content
that only you can supply. Nothing in this list is invented in the code.

### 1. The contact service

The form posts JSON to whatever URL you set in `PUBLIC_CONTACT_ENDPOINT`. The
included server (`server/index.mjs`) is that endpoint. It needs a host that can
run Node 20+ — Render, Railway, Fly.io, a VPS or any similar host. GitHub Pages
**cannot** run it.

```bash
# on the host
PUBLIC_CONTACT_ENDPOINT=https://contact.example.com   # build-time, for the site
CONTACT_ALLOWED_ORIGIN=https://next-step-studios-official.github.io
PORT=8787
DATA_DIR=/var/lib/nss-contact
SESSION_SECRET=<64 random hex characters>
ADMIN_PASSWORD_HASH=scrypt:<salt>:<hash>
CONTACT_WEBHOOK_URL=            # optional
CONTACT_RATE_LIMIT=5            # messages per IP per 15 minutes
```

| Value | How to get it |
| --- | --- |
| `SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_PASSWORD_HASH` | `npm run hash-password -- 'a long password'` |
| `DATA_DIR` | Any writable directory. Messages go to `messages.ndjson`. |
| `CONTACT_WEBHOOK_URL` | Optional Discord/Slack webhook. Each message posts `{content, text}`. |

Start it with `npm run contact`. Check `GET /healthz`; it reports whether the
dashboard is configured. The inbox is at `https://<host>/dashboard`.

Set the same endpoint in the Pages build so the deployed form knows where to
post. Add it as a repository secret/variable and pass it into the build step in
`.github/workflows/deploy.yml`, or set it in your local `.env` for a test build.

If `PUBLIC_CONTACT_ENDPOINT` is empty, the form still renders but says it is not
connected and points at the email address. It never claims to have sent
anything.

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

The server checks the password with scrypt, signs sessions with HMAC-SHA256,
refuses cross-origin `PATCH` requests, rate-limits contact posts and login
attempts, hashes IP addresses before storing them, and sends `no-store` on every
API response.

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
| `server/` | The contact API and admin dashboard (Node, no dependencies) |
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

The contact service is deployed separately, on a host that runs Node. Back up
`DATA_DIR/messages.ndjson`; it is the only copy of the inbox. The file-backed
store assumes a single instance — if you ever run several, move storage to a
database first.

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
