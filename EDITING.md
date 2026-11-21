# Editing this site

A map of the files that hold real content. Everything is in this repository; there is no
CMS and no database behind the pages. Change a file, run `npm run dev`, and the page
updates.

## The five-minute version

| What you want to change | Where it lives |
| --- | --- |
| Team names, handles, roles, order | `src/lib/contributors.ts` |
| Whether the team list is final | `CONTRIBUTORS_CONFIRMED` in the same file |
| Devlog entries | `src/content/devlog/*.md` |
| Roadmap items and statuses | `src/lib/roadmap.ts` |
| Changelog entries | `src/lib/changelog.ts` |
| Bot modules and their statuses | `src/lib/modules.ts` |
| Slash commands and planned commands | `src/lib/commands.ts` |
| Projects | `src/content/projects/*.md` |
| Bot policies | `src/content/policies/bot/*.md` |
| FAQ | `src/lib/faq.ts` |
| Official links | `src/lib/links.ts` |
| Contact form endpoint and topics | `src/lib/contact.ts` + `src/pages/contact.astro` |
| Live status feed | `public/status.json` + `scripts/status-publish.mjs` |
| Brand files | `public/brand/`, `src/data/brand-assets.json` (generated) |
| Brand rules and copy | `src/pages/brand.astro`, `src/pages/press.astro`, `src/pages/archive.astro` |
| The archive page | `src/pages/archive.astro` |
| Site-wide copy and facts | `src/lib/site.ts` |

## Team

`src/lib/contributors.ts` is the single source for the people list. It holds four
placeholders alongside Candler Shaw, who runs the studio and is not in the list:

```ts
export const CONTRIBUTORS_CONFIRMED = false;
export const CONTRIBUTORS = [
  { handle: '@contributor-1', role: 'Role to be confirmed', focus: '…' },
  // …
];
```

Replace each `handle`, `role` and `focus`; add `name:` only if that person wants their full
name shown instead of the handle. Then set `CONTRIBUTORS_CONFIRMED = true`. Until it is
true, the About and Team pages say the details are being confirmed, so a placeholder never
reads as a claim about a real person.

The studio is five people in total: Candler plus four contributors. `TEAM_SIZE` and
`TEAM_WORD` in the same file derive that total, and the About facts, press kit, footer and
home page read them. Adding or removing a contributor updates the count automatically; if
the total changes, the sentences that say "five people" will follow `TEAM_WORD`.

## Contact form

The form posts JSON to the contact service at `CONTACT_ENDPOINT` in `src/lib/contact.ts`.
The default is the deployed service:

- form: `https://next-step-studios-contact-wqep7k.freebuff.site/api/contact`
- private inbox: `https://next-step-studios-contact-wqep7k.freebuff.site/dashboard`
- health: `https://next-step-studios-contact-wqep7k.freebuff.site/healthz`

Messages are stored in the service's D1 database and read in the private inbox. An email copy
is optional and already wired: set `BREVO_API_KEY`, `NOTIFY_EMAIL` and, if you want a
specific sender, `MAIL_FROM` in the Worker's secrets. Brevo's free plan is 300 emails a day
with no card and no custom domain; the `MAIL_FROM` address must be verified in Brevo. The
notification sets `Reply-To` to the visitor, so replying answers them. Until a key is set no
email is sent, `/healthz` reports `"email": "not configured"`, and the form still works.
Redeploy the Worker after adding the key.

Set the inbox password on the first visit to the dashboard. Optional Worker secrets are
listed in the README: `ADMIN_PASSWORD_HASH`, `CONTACT_WEBHOOK_URL`, `CONTACT_RATE_LIMIT`
and `ALLOWED_ORIGINS`.

The inbox can delete a message permanently (with a confirmation) and export every stored
message as JSON for a backup: `DELETE /api/messages/:id` and `GET /api/messages/export`.
Neither touches an email copy already delivered, so remove those separately.

`CONTACT_WEBHOOK_URL` takes a Discord incoming webhook URL, which needs no bot code:
channel → Edit Channel → Integrations → Webhooks → New Webhook → Copy Webhook URL. The
same URL can go in the `DISCORD_WEBHOOK_URL` Actions secret to announce deploys. The
exact paths and sign-in pages are in README.md, "Discord without writing a bot".

Building with `PUBLIC_CONTACT_ENDPOINT=` (empty) puts the form in its not-connected state:
it renders, explains that it cannot send, and offers the email address instead.

## Live status

`/status` reads `public/status.json` from this repository's raw GitHub URL every five
minutes. The bot publishes the file; the site does not need a redeploy to show a new check.

Run the publisher from the bot host:

```bash
STATUS_ONLINE=1 \
STATUS_LATENCY_MS=42 \
STATUS_VERSION=1.4.0 \
GITHUB_TOKEN=… \
node scripts/status-publish.mjs --publish
```

Without `--publish` it only updates the local `public/status.json`, which is useful for
testing. The token needs `contents: write` on this repository. A scheduler that runs the
command every five minutes is enough — or let the site's own workflow do it:

`.github/workflows/status-probe.yml` probes `BOT_STATUS_URL` every five minutes and
publishes the check, so no server is needed. Set the URL as an Actions **repository
variable** (Settings → Secrets and variables → Actions → Variables); while it is empty the
workflow writes nothing and the page keeps its empty state.

The deploy workflow
ignores status-only pushes, because the page reads the raw file directly.

The seed file in the repository has an empty `checks` array. That is deliberate: until the
publisher runs, the page shows an empty history rather than an invented uptime number.

## Brand files

The transparent master, every size, the light treatment, favicons and the archive are
generated — do not hand-edit the files in `public/brand/`.

```bash
npm run brand      # regenerate the matrix, favicons, manifest and ZIP
npm run brand:zip  # rebuild only the ZIP from the existing files
```

`npm run brand` reads the source artwork from the bot repository. Set `BRAND_SOURCE` to its
path if it is not at the default location. It writes:

- `public/brand/press/logo-{1024,512,256,128}.{png,jpg,svg}` — the standard transparent
  mark, with JPG flattened onto `#07080B`;
- `public/brand/press/logo-light-{1024,512,256,128}.{png,svg}` — the light-outline
  treatment for dark surfaces;
- `public/brand/archive/neon-emblem-2026-07-25-{1024,512,256,128}.{png,jpg,svg}` — the
  retired mark;
- `public/brand/archive/logo-white-tile-2026-11-21.png` — the superseded white-tile
  artwork, kept and labelled as such;
- `public/brand/favicon-{128,64,32}.png`, `public/favicon.svg`,
  `public/brand/apple-touch-icon.png`;
- `src/data/brand-assets.json` — the file list the press kit and archive read;
- `public/downloads/next-step-studios-brand-kit.zip` — via the ZIP step. It contains
  `README.txt`, `current/` with the live mark and four favicons, and `archive/` with the
  retired marks and the white-tile edition.

When the logo changes, add the old mark to the `RETIRED` list in
`scripts/make-brand-assets.mjs` instead of deleting it, and link it from
`src/pages/archive.astro`. That is what keeps old links working.

## Build and deploy

```bash
npm run dev      # local preview
npm run build    # releases, content guard, PDFs, cheatsheet, brand ZIP, Astro build
npm run preview  # serve dist/
```

`npm run build` does not regenerate the brand matrix; those files are committed. It does
rebuild the ZIP so the download always matches the files in the repository.

Pushing to `main` publishes through `.github/workflows/deploy.yml`. The contact service is
deployed separately and is not built here.
