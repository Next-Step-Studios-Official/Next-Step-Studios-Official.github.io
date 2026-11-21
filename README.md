# Next Step Studios — website

The public website for Next Step Studios: a studio, its Discord bot, the bot's
policy documents and a devlog. Static output, no accounts, no analytics, no
third-party requests.

Live at **https://next-step-studios-official.github.io/**.

## Run it

```bash
npm install
npm run dev       # local preview with hot reload
npm run build     # content guard → PDFs → static build into dist/
npm run preview   # serve the built dist/
```

`npm run build` runs three things:

1. `scripts/verify-content.mjs` — refuses to build if internal material has
   leaked into `src/content`.
2. `scripts/make-pdfs.mjs` — regenerates the seven PDF editions.
3. `astro build` — 41 pages, the search index, sitemap, RSS and robots.

Other authoring commands:

```bash
npm run pdfs      # PDFs only
npm run assets    # re-derive logo, favicons and banners from the bot repo
node scripts/make-og.mjs   # regenerate the 1200×630 share card
```

`npm run assets` expects the bot repository at the path in
`scripts/brand-assets.mjs`; override it with `BRAND_SOURCE`.

## Where things live

| Path | What it is |
| --- | --- |
| `src/pages/` | Every route: pages, print layouts and static endpoints |
| `src/lib/` | Site data: commands, FAQ, roadmap, changelog, links, documents |
| `src/content/policies/bot/` | The seven public policy documents |
| `src/content/devlog/` | Devlog entries, with tags and series |
| `src/content/projects/` | Project entries and their honest statuses |
| `src/styles/global.css` | Tokens and shared components |
| `src/styles/pages.css` | Page-level layouts added with the reference edition |
| `public/downloads/` | Generated PDFs, served as static files |
| `scripts/` | Content guard, PDF generator, brand and share-card tools |

## Editing content

- **Policies** are Markdown with frontmatter. The page, the Markdown download,
  the plain-text download, the print edition and the PDF all come from the same
  file, so there is one wording to maintain.
- **Devlog** entries take `tags` and an optional `series`; tag pages and the RSS
  feed are generated from them.
- **Commands** live in `src/lib/commands.ts`, read from the bot's cogs. A command
  listed there exists in source; that is not a claim that it has been verified
  end to end.
- **Links** live in `src/lib/links.ts` and mirror the bot's links panel.
- **Social accounts** live in `src/lib/social.ts`.

## Deployment

Pushing to `main` builds and publishes the site through
`.github/workflows/deploy.yml` (GitHub Pages, Actions source).

The site's internal links are absolute, so it must be served from a domain root.
That is why the repository is the organisation site repository
(`Next-Step-Studios-Official.github.io`) rather than a project repository.

`astro.config.mjs` reads `SITE_URL` and `BASE_PATH`; the workflow supplies both
from the Pages configuration, so the canonical URL always matches the host.

## Invariants

These are product decisions, not defaults:

- No analytics, cookies, accounts, forms or third-party requests.
- Nothing claims to be released that is not released. Drafts say draft,
  unverified says unverified, planned says planned.
- Public documents are mirrored to
  [bot-documentation](https://github.com/Next-Step-Studios-Official/bot-documentation).

Internal source material (`documentation-source/`, `docs/`, working captures) is
excluded from this repository by `.gitignore` and must stay that way.
