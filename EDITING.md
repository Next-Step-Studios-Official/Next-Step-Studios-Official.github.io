# Editing the Next Step Studios website

> **Temporary internal working manual.** This file is for making changes to the
> repository; it is not part of the public website. `README.md` is the public-facing
> description of the site. This manual may be removed or replaced before the repository
> is presented publicly.

This is the practical manual. It assumes you are using **Visual Studio Code (VS Code)**
on Windows and that the project is at:

```text
D:\NextStepStudios\next-step-studios-website
```

Every path below is relative to that folder unless it starts with `D:\`.

**Full paths for the pages changed in these passes and this guide:**

| What you are editing | Full path on this computer |
| --- | --- |
| This guide | `D:\NextStepStudios\next-step-studios-website\EDITING.md` |
| Policy hub, including search, scope and status filters | `D:\NextStepStudios\next-step-studios-website\src\pages\policies\index.astro` |
| Downloads catalogue and its filters | `D:\NextStepStudios\next-step-studios-website\src\pages\downloads\index.astro` |
| Projects list, filters and sort | `D:\NextStepStudios\next-step-studios-website\src\pages\projects\index.astro` |
| Search page, result list and type filters | `D:\NextStepStudios\next-step-studios-website\src\pages\search.astro` |
| Changelog page | `D:\NextStepStudios\next-step-studios-website\src\pages\changelog.astro` |
| Official links page | `D:\NextStepStudios\next-step-studios-website\src\pages\links.astro` |
| Team page | `D:\NextStepStudios\next-step-studios-website\src\pages\team.astro` |
| Shared filter note style | `D:\NextStepStudios\next-step-studios-website\src\styles\global.css` |
| Shared touch-target styles | `D:\NextStepStudios\next-step-studios-website\src\styles\pages.css` |
| Theme tokens and light overrides | `D:\NextStepStudios\next-step-studios-website\src\styles\theme.css` |
| Header and theme toggle | `D:\NextStepStudios\next-step-studios-website\src\components\Header.astro` |
| Breadcrumb navigation used by detail pages | `D:\NextStepStudios\next-step-studios-website\src\components\Breadcrumbs.astro` |
| Project picture gallery | `D:\NextStepStudios\next-step-studios-website\src\components\ProjectGallery.astro` |
| Places Left Behind page and its gallery guide | `D:\NextStepStudios\next-step-studios-website\PLACES_LEFT_BEHIND_EDITING.md` |
| A policy document page | `D:\NextStepStudios\next-step-studios-website\src\pages\policies\[scope]\[slug].astro` |
| Policy version history | `D:\NextStepStudios\next-step-studios-website\src\pages\policies\versions\[slug].astro` |
| A project page | `D:\NextStepStudios\next-step-studios-website\src\pages\projects\[slug].astro` |
| A bot module page | `D:\NextStepStudios\next-step-studios-website\src\pages\modules\[id].astro` |
| A devlog entry | `D:\NextStepStudios\next-step-studios-website\src\pages\devlog\[slug].astro` |
| Changelog entries | `D:\NextStepStudios\next-step-studios-website\src\lib\changelog.ts` |

The square brackets in `[scope]`, `[slug]` and `[id]` are part of the real folder and
file names. Type them exactly.

> **GitHub only receives files inside the website folder.** The Discord bot and the
> original logo live elsewhere on the D: drive. Section 10 lists their full paths, what
> is already correct and what, if anything, still needs to be changed.

You do **not** need to understand Astro or TypeScript to make the changes here. You do
need to copy punctuation exactly: quotes, commas, braces and angle brackets all matter.
If a change makes the build fail, undo that one change and compare it with the example.

> **The most important rule:** edit the source file, never the generated copy.
> `dist/`, `public/downloads/*.pdf`, `public/og/` and `src/data/brand-assets.json` are
> build outputs. Change the script or the source file that produces them, then rebuild.

---

## Contents

1. [Open the project and start a preview](#1-open-the-project-and-start-a-preview)
2. [How to edit safely](#2-how-to-edit-safely)
3. [Change the studio facts and contact email](#3-change-the-studio-facts-and-contact-email)
4. [Change text on a page](#4-change-text-on-a-page)
5. [Add a new page](#5-add-a-new-page)
6. [Change navigation](#6-change-navigation)
7. [Replace images](#7-replace-images)
8. [Change the logo and favicon](#8-change-the-logo-and-favicon)
9. [Add or remove official and social links](#9-add-or-remove-official-and-social-links)
10. [Files on this computer and the Discord bot](#10-files-on-this-computer-and-the-discord-bot)
11. [Edit or add policies](#11-edit-or-add-policies)
12. [Edit projects, modules and commands](#12-edit-projects-modules-and-commands)
13. [Edit the team list](#13-edit-the-team-list)
14. [Edit the devlog, roadmap, changelog, FAQ and glossary](#14-edit-the-devlog-roadmap-changelog-faq-and-glossary)
15. [Edit downloads and releases](#15-edit-downloads-and-releases)
16. [The admin panel (contact inbox)](#16-the-admin-panel-contact-inbox)
17. [`.env` and secrets](#17-env-and-secrets)
18. [Run the contact service locally](#18-run-the-contact-service-locally)
19. [Test, build and publish](#19-test-build-and-publish)
20. [Troubleshooting](#20-troubleshooting)
21. [File map and commands](#21-file-map-and-commands)
22. [Future accounts and the game launcher](#22-future-accounts-and-the-game-launcher)
23. [Step, the local assistant](#23-step-the-local-assistant)

---

## 1. Open the project and start a preview

### Open the folder in VS Code

1. Open **Visual Studio Code**.
2. Choose **File → Open Folder…**.
3. Select `D:\NextStepStudios\next-step-studios-website`.
4. Click **Select Folder**. The Explorer on the left should show `src`, `public`,
   `scripts`, `server`, `package.json`, `README.md` and `EDITING.md`.

### Open a terminal inside VS Code

1. Choose **Terminal → New Terminal** (or press `` Ctrl+` ``).
2. The terminal opens at the project folder. Check it:

   ```powershell
   pwd
   ```

   It should print `D:\NextStepStudios\next-step-studios-website`.

3. Install the dependencies once (and again after `package.json` changes):

   ```powershell
   npm install
   ```

4. Start the local preview:

   ```powershell
   npm run dev
   ```

5. Open <http://localhost:4321> in your browser. Leave this terminal running while you
   edit. Astro reloads the page when a source file is saved.
6. To stop it, click the terminal and press `Ctrl+C`, then confirm with `Y` if asked.

If `npm` is not recognised, install the current Node.js LTS from
<https://nodejs.org/en/download>, close VS Code, reopen it, and try again. This project
needs Node **20.12 or newer**.

### Build before publishing

The development preview can hide a broken link or an invalid content entry. Before
publishing, always run:

```powershell
npm run build
```

A successful build ends with Astro reporting the pages and exits without a red error.
The output is in `dist/`. To look at the built site:

```powershell
npm run preview
```

Then open the address Astro prints (usually <http://localhost:4321>). Stop it with
`Ctrl+C`.

---

## 2. How to edit safely

### The basic loop

1. In VS Code, press `Ctrl+P`, type part of a filename, and press `Enter` to open it.
2. Press `Ctrl+F` to find text inside that file. Press `Ctrl+H` to replace text.
3. Press `Ctrl+Shift+F` to search the whole project. This is the fastest way to find a
   sentence that appears on several pages.
4. Change only the text between the quote marks, tags or braces. Do not rename variables
   unless this guide says to.
5. Save with `Ctrl+S`.
6. Look at <http://localhost:4321>. The page should refresh automatically.
7. When the page is right, run `npm run build`.

### If something goes wrong

- Press `Ctrl+Z` to undo the last edit.
- If the terminal shows a red error, read the **first** error line. It usually names the
  file and the line number.
- `npm run build` is the final check. A build that says “Complete!” has checked every
  content entry, route and local asset reference.
- Do not delete a file to “fix” a build error unless this guide tells you to. Most errors
  are a missing comma, a missing quote or a mistyped path.

### What not to commit

Never commit `.env`, `node_modules/`, `dist/`, `.astro/`, `server-data/` or any private
key. `.gitignore` already excludes them. Check with **Source Control** in VS Code before
committing.

---

## 3. Change the studio facts and contact email

**File:** `src/lib/site.ts`
**Open in VS Code:** yes.

This file holds the values used across the site.

1. Open `src/lib/site.ts`.
2. Find the `SITE` object near the top.
3. Change only the value after the colon:

   ```ts
   export const SITE = {
     name: 'Next Step Studios',
     operator: 'Candler Shaw',
     url: 'https://next-step-studios-official.github.io',
     contactEmail: 'nextstepstudiosofficial.contact@gmail.com',
     docsRepoUrl: 'https://github.com/Next-Step-Studios-Official/bot-documentation',
   } as const;
   ```

   - `name` — the public studio name.
   - `operator` — the person who runs the studio. This appears on About, the footer and
     the Press & brand page.
   - `contactEmail` — the public email address. It appears on Contact, the footer and the
     policy pages.
   - `url` — the canonical site address. The deploy workflow normally overrides it with
     `SITE_URL`; change it only if you are deliberately changing the canonical domain.
   - `docsRepoUrl` — the GitHub mirror of the policy documents, not the primary policy
     page.

4. Save. The dev preview updates.
5. **Restart needed?** No for the preview. **Rebuild?** Yes, before publishing.
6. **Verify:** open `/about`, `/contact` and `/policies`; the new value should appear in
   each place.

> The contact email is also used as the default `NOTIFY_EMAIL` fallback in the contact
> service. If you change it, change it here first, then set the Worker's `NOTIFY_EMAIL`
> explicitly if the new address is not the Resend account address.

---

## 4. Change text on a page

Every page is an `.astro` file in `src/pages/`. Most text is ordinary text between HTML
tags, so you can edit it directly.

### Find the right file

| Page | File | Open in VS Code |
| --- | --- | --- |
| Home | `src/pages/index.astro` | yes |
| About | `src/pages/about.astro` | yes |
| Team | `src/pages/team.astro` | yes |
| Projects index | `src/pages/projects/index.astro` | yes |
| One project | `src/pages/projects/[slug].astro` | yes |
| Devlog index | `src/pages/devlog/index.astro` | yes |
| One devlog entry | `src/content/devlog/*.md` | yes |
| Commands | `src/pages/commands.astro` | yes |
| Modules index | `src/pages/modules/index.astro` | yes |
| One module | `src/pages/modules/[id].astro` | yes |
| Policies index | `src/pages/policies/index.astro` | yes |
| One policy | `src/content/policies/bot/*.md` or `src/content/policies/website/*.md` | yes |
| Downloads | `src/pages/downloads/index.astro` | yes |
| Links | `src/pages/links.astro` | yes |
| Contact | `src/pages/contact.astro` | yes |
| FAQ | `src/pages/faq.astro` | yes |
| Glossary | `src/pages/glossary.astro` | yes |
| Roadmap | `src/pages/roadmap.astro` | yes |
| Changelog | `src/pages/changelog.astro` | yes |
| Status | `src/pages/status.astro` | yes |
| Stack | `src/pages/stack.astro` | yes |
| Trust centre | `src/pages/trust.astro` | yes |
| Press & brand | `src/pages/press.astro` | yes |
| Now | `src/pages/now.astro` | yes |
| Website privacy | `src/content/policies/website/privacy.md` | yes |
| Search | `src/pages/search.astro` | yes |
| 404 | `src/pages/404.astro` | yes |
| Sitemap page | `src/pages/sitemap/index.astro` | yes |

### Change a headline or paragraph

1. Open the page file.
2. Find the visible text, for example:

   ```astro
   <h1 class="display display--page">Every official link, in one place.</h1>
   ```

3. Change only the words between `>` and `</h1>`. Keep the tags exactly as they are.
4. For a paragraph, change the words between `<p ...>` and `</p>`. If the paragraph
   contains a link, keep the `<a>` tags and change the words around them.
5. Save and check the preview.
6. **Restart needed?** No. **Rebuild?** Yes, before publishing.
7. **Verify:** open the route, check the new wording, and check the page's browser tab
   title (the `title` prop near the top of the file).

### Change the page title or description

Near the top of each page there is a `<Base ...>` block:

```astro
<Base
  title="Official links"
  description="Every official Next Step Studios link in one place — the website, social media, the Discord community, the GitHub organization and the policy documents."
  path="/links"
>
```

- `title` is the browser-tab title; the layout appends “— Next Step Studios”.
- `description` is the search/social description. Keep it one clear sentence.
- `path` must match the route. Do not change it unless you are deliberately moving the
  page and adding a redirect.

Change the text inside the quotes, save, and check the browser tab and page source.

### Change a number that is calculated

Several counts are derived, not typed:

- The team count comes from `src/lib/contributors.ts`.
- The command count comes from `src/lib/commands.ts`.
- The policy count on the home page is calculated from the policy collection.
- The number of command groups on the home page comes from `COMMAND_GROUPS`.

Do not replace those numbers with a fixed number. Add or remove the underlying item, and
the page follows.

### Home page specifics

**File:** `src/pages/index.astro`
**Open in VS Code:** yes.

The home page has these editable areas:

- `<Base title=... description=... path="/">` — metadata at the top.
- The hero `<h1>` and lede paragraph — near the first `<section>`.
- The hero image — `public/images/hero.webp`, with `width="1392" height="752"` in the
  markup.
- The “current project” panel — reads the featured project from
  `src/content/projects/*.md`.
- The “Latest from the devlog” section — reads the three newest devlog entries.
- The “Policies” panel — the count and the list come from the policy collection.
- The closing contact panel — email and Discord invite.

Change the words in place; do not edit the generated counts.

---

## 5. Add a new page

You need three things: a page file, a route, and (if it belongs in the menu) a navigation
entry.

### Step 1 — create the page

1. In VS Code, right-click `src/pages` in the Explorer.
2. Choose **New File**.
3. Name it with a lowercase word and `.astro`, for example `support-hours.astro`.
   The filename becomes the URL: `/support-hours`.
4. Paste this starter, replacing the title, description, heading and paragraph:

   ```astro
   ---
   import Base from '../layouts/Base.astro';
   ---

   <Base
     title="Support hours"
     description="When the Next Step Studios support inbox is read."
     path="/support-hours"
   >
     <section class="page-head">
       <div class="container">
         <div class="page-head-stack">
           <p class="eyebrow">Support</p>
           <h1 class="display display--page">When we read messages.</h1>
           <p class="lede">
             Replace this with the real information. Do not promise a response time the
             studio cannot keep.
           </p>
         </div>
       </div>
     </section>

     <section class="section">
       <div class="container">
         <div class="prose">
           <h2>Heading</h2>
           <p>Your text goes here.</p>
         </div>
       </div>
     </section>
   </Base>
   ```

5. Save.
6. **Restart needed?** No. **Rebuild?** Yes.
7. **Verify:** open <http://localhost:4321/support-hours>. If it is a 404, check that the
   file is directly inside `src/pages/` and the filename ends in `.astro`.

### Step 2 — add it to navigation

See [Change navigation](#6-change-navigation). If the page is a one-off, you can link to
it from an existing page instead; it will still be built and appear in the sitemap.

### Step 3 — check the sitemap

The sitemap is generated from the routes. Open `/sitemap` after a rebuild to confirm the
new page is listed.

---

## 6. Change navigation

**File:** `src/components/Header.astro`
**Open in VS Code:** yes.

The header has three lists near the top:

- `navLinks` — the always-visible items on desktop: Home, Projects, Devlog, Commands.
- `navMenus` — the two dropdowns, **Studio** and **Community**.
- `navTail` — the final items: Policies and Contact.

Each entry looks like this:

```ts
{ href: '/about', label: 'About' }
```

### Add an item to an existing dropdown

1. Open `src/components/Header.astro`.
2. Find the `navMenus` block. Under `id: 'studio'` or `id: 'community'`, find `links: [`.
3. Add one line before the closing `]`:

   ```ts
   { href: '/support-hours', label: 'Support hours' },
   ```

4. Keep the comma at the end of the line.
5. Save.
6. **Restart needed?** No. **Rebuild?** Yes.
7. **Verify:** the desktop dropdown and the mobile drawer (the ☰ button) both show the
   new item; click it.

### Add an always-visible item

Add the same line to `navLinks` or `navTail`. Keep the list short: the desktop header has
limited space, and the mobile drawer is the fallback. A new top-level item is best added
to a dropdown unless it is a primary destination.

### Remove an item

Delete the whole `{ href: ..., label: ... },` line. Do not delete the page file unless you
also want the route gone.

### Footer navigation

**File:** `src/components/Footer.astro`

The footer has `studioLinks`, `referenceLinks` and `policyLinks`. Add or remove entries
the same way. The footer is not generated from the header, so a page can appear in one
and not the other; keep them intentional.

### Theme toggle

The sun/moon button sits in the header and is defined in `src/components/Header.astro`.
It carries both a screen-reader label and a hover tooltip; the small script updates both
when the theme changes. Keep the wording in step if you rename it.

**Full path:** `D:\NextStepStudios\next-step-studios-website\src\components\Header.astro`

### Breadcrumbs on detail pages

A breadcrumb is the small path above a page title: **Home / Projects / Project name**.
The last item is the current page. The shared component is:

**Full path:** `D:\NextStepStudios\next-step-studios-website\src\components\Breadcrumbs.astro`

Each detail page passes its own list, for example:

```astro
<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: title },
  ]}
/>
```

The last item has no `href` and is marked as the current page. To change a label, edit the
list in that page; to change the separator, spacing or type size, edit the component once.

---

## 7. Replace images

Keep the same filenames and directories unless there is a strong reason to move them.
The markup already expects these paths and dimensions.

### The home hero

**File:** `public/images/hero.webp`
**Markup:** `src/pages/index.astro`
**Open in VS Code:** yes, for the markup.

1. Export the replacement as **WebP**, **1392 × 752** pixels, sRGB.
2. In VS Code's Explorer, right-click `public/images/hero.webp` and choose
   **Delete** (or rename the old one if you want a backup outside the project).
3. Copy the new file into `public/images/` and name it exactly `hero.webp`.
4. If the new image has different dimensions, find this line in `src/pages/index.astro`:

   ```astro
   <img src="/images/hero.webp" alt="" width="1392" height="752" fetchpriority="high" decoding="async" />
   ```

   Change `width` and `height` to the real pixel dimensions. Do **not** leave the old
   numbers: the browser reserves the wrong space and the page jumps while loading.
5. Save and run `npm run build`.
6. **Verify:** open `/` and check the hero is sharp, not stretched, not cropped, and that
   the page does not jump while loading.

The hero is decorative, so `alt=""` is correct. Do not put the studio name in the alt
text; the heading already says it.

### Project covers

**Files:** `public/images/project-*.webp`
**Content:** `src/content/projects/*.md`
**Markup:** `src/components/ProjectCard.astro` and `src/pages/projects/[slug].astro`

Current covers are **1100 × 594**. Each project's frontmatter has:

```yaml
cover: /images/project-bot.webp
```

1. Replace the file in `public/images/` with the same filename, or change the `cover:`
   path in the project Markdown.
2. If every cover keeps 1100 × 594, no markup change is needed.
3. If a cover has different dimensions, update **both** files:
   - `src/components/ProjectCard.astro` — two `<img>` tags, currently `width={1100}`
     and `height={594}`.
   - `src/pages/projects/[slug].astro` — the cover `<Image>` or `<img>` block.
4. **Verify:** `/projects`, the home page's featured project, and the individual project
   page. The card and the detail page should use the same crop.

### The links and contact banners

**Files:** `src/assets/banners/links.jpg`, `src/assets/banners/support.jpg`
**Markup:** `src/pages/links.astro`, `src/pages/contact.astro`
**Generator:** `scripts/make-banners.mjs`

These are generated from the real logo by `npm run banners`. The current sizes are:

- `links.jpg` — **1600 × 618**
- `support.jpg` — **1600 × 894**

1. To change the composition, edit the coordinates in `scripts/make-banners.mjs`.
2. Run:

   ```powershell
   npm run banners
   ```

3. To replace the art with a supplied image, overwrite the JPEG with an image of the
   same dimensions. Keep the filename. Do not put important text in the image: the page
   heading already carries it, and text in an image cannot reflow or be read reliably by
   a screen reader.
4. If the composition changes, update the `alt` text in `src/pages/links.astro` and
   `src/pages/contact.astro` so it still describes what is visible.
5. **Verify:** open `/links` and `/contact`; the banner should be sharp, not stretched,
   and the page should not jump.

### General image rules

- Prefer WebP for photographs and JPEG for flat graphics. Use PNG only when transparency
  matters.
- Do not upscale a small image. A 600px image stretched to 1392px will look soft.
- Keep the existing aspect ratio unless the layout is being changed deliberately.
- Compress before committing. A hero over roughly 300 KB is usually too heavy; a project
  cover over roughly 150 KB is worth checking.
- Run `npm run build` after replacing an image. Astro optimises images imported from
  `src/assets/`; files in `public/` are served exactly as supplied.
- If a page shows a broken image, check the path is relative to `public/` (starts with
  `/`) and that the filename's capitalisation matches exactly. Windows ignores case;
  GitHub Pages does not.

---

## 8. Change the logo and favicon

The current pixel-art ninja mark is the official logo. It is not replaced by this guide;
this section explains how to use it correctly and what to do if it is ever changed.

### Where the logo is used

| Place | File | What is shown |
| --- | --- | --- |
| Header | `src/components/Header.astro` | `src/assets/brand/logo-mark.png` at 32 × 32 |
| Footer | `src/components/Footer.astro` | the same head mark at 34 × 34 |
| Browser tab | `src/layouts/Base.astro` | `public/brand/favicon-16.png`, `-32`, `-64`, `public/favicon.svg` |
| Apple device icon | `src/layouts/Base.astro` | `public/brand/apple-touch-icon.png` |
| Press & brand assets | `public/brand/press/` | full lockups at 128–1024px |
| Banners | `src/assets/banners/` | generated from the full lockup |
| Share cards | `public/og/` | generated by `npm run og` |

The header and footer use the **head** rather than the full lockup because the wordmark
is not legible at 32px. That is a presentation decision, not a second logo.

### Regenerate the brand files

1. Open the terminal in VS Code.
2. Run:

   ```powershell
   npm run brand
   npm run banners
   npm run og
   ```

   `npm run brand` regenerates the full matrix, the header head mark, the favicons and
   the manifest. The tab icons use a tighter face crop on a dark tile, generated
   separately from the header mark, so the bandana and eyes stay readable at 16px.
   `npm run banners` rebuilds the two page banners. `npm run og` rebuilds the share
   cards that use the logo.
3. **Restart needed?** No. **Rebuild?** Yes, before publishing.
4. **Verify:** open `/press`, `/links` and `/contact`. Check the favicon in a new
   incognito tab; browsers cache favicons aggressively. The combined page is the only
   brand route; `/brand` and `/archive` redirect into its sections.

The source artwork is read from:

```text
D:\NextStepStudios\DiscordBots\PrivateBots\NextStepStudioBot\images\server_logo\Next_StepStudios_Logo.png
```

If it is somewhere else, set `BRAND_SOURCE` before running the command:

```powershell
$env:BRAND_SOURCE = 'D:\path\to\Next_StepStudios_Logo.png'
npm run brand
```

### If the official logo is ever replaced

Do this only after the studio has approved a new official mark.

1. Put the new master artwork in the bot's `images/server_logo` folder, or set
   `BRAND_SOURCE`.
2. Open `scripts/make-brand-assets.mjs` and find the retired-mark block
   (`RETIRED_SOURCE` and the `writeMatrix` call below it). Copy the old master into
   `public/brand/archive/` under a dated filename, then update that block's
   `RETIRED_SOURCE`, `id` and `name` instead of deleting the old files. The current
   script archives one retired mark; keeping the old file in `archive/` preserves it.
3. Run `npm run brand`, `npm run banners`, `npm run og`.
4. Open `src/pages/press.astro` and update any sentence that describes the old mark's
   style or size. The retired mark and white-tile sections live on that page now.
5. Check `src/components/Header.astro`, `src/components/Footer.astro` and
   `src/layouts/Base.astro`: they import `logo-mark.png` and the generated favicons, so
   they normally need no code change.
6. Run `npm run build`.
7. **Verify:** every page that shows the logo, the browser tab, the Press & brand ZIP and
   the share card. Do not leave a page with the old mark.

### A note on the head crop

The header head crop is generated from the top of the full lockup. It stops where the
wordmark begins and fades the lower edge into transparency. That is why the header icon
shows the bandana and eyes rather than the whole wordmark. The browser-tab icons use a
separate, tighter face crop flattened on the dark base, so they stay readable at 16px.
Do not replace either with a hand-cropped file unless you also update
`scripts/make-brand-assets.mjs`, or the next `npm run brand` will overwrite it.

---

## 9. Add or remove official and social links

**File:** `src/lib/links.ts`
**Open in VS Code:** yes.

This file drives `/links`, the footer, the JSON-LD `sameAs` list and the “official
links” references across the site. The section order and ids match the Discord bot's
`links_config.py`.

### Add a social account

1. Open `src/lib/links.ts`.
2. Find the `LINKS` array.
3. Copy this block and place it in the `social` section, next to the other social
   entries:

   ```ts
   {
     id: 'threads',
     name: 'Threads',
     section: 'social',
     type: 'link',
     description: 'Follow Next Step Studios on Threads.',
     url: 'https://www.threads.net/@nextstepstudiosofficial',
     accent: '#000000',
     enabled: true,
   },
   ```

4. Change `id`, `name`, `description`, `url` and `accent`. The `id` must be unique and
   should match the bot's id if the bot has the same account.
5. Keep `type: 'link'` for a normal https URL.
6. Save.
7. **Restart needed?** No. **Rebuild?** Yes.
8. **Verify:** `/links` shows the new entry in the Social Media section, the link opens
   the right profile, and the footer's social block includes it if the footer renders
   that section.

### Add an account that does not exist yet

Use the same block but leave the URL out and set `enabled: false`:

```ts
{
  id: 'bluesky',
  name: 'Bluesky',
  section: 'social',
  type: 'link',
  description: 'Follow Next Step Studios on Bluesky.',
  enabled: false,
},
```

The page filters it out. When the account exists, add the `url`, set `enabled: true`,
and rebuild. This is the honest way to support a platform without a dead button.

### Disable or remove an entry

- To hide it without losing the details, set `enabled: false`.
- To remove it completely, delete the whole `{ ... },` block. Do not leave a dangling
  comma.
- Never invent a URL. If the studio has no account, leave it disabled.

### Change the official policies link

The entry is:

```ts
{
  id: 'official_policies',
  name: 'Official Policies',
  section: 'policies',
  type: 'link',
  description: 'Read the official Next Step Studios policies on this site.',
  url: '/policies',
  accent: '#5865F2',
  enabled: true,
},
```

`/policies` is a page on this site. Do not change it to the GitHub repository. The GitHub
mirror is `DOCS_MIRROR_URL` in the same file and is offered as a secondary reference on
the policy pages.

### Change the Discord invite or channels

**File:** `src/lib/discord.ts`

- `DISCORD.inviteUrl` — the permanent invite. While empty, components omit the invite.
- `DISCORD.channels` — channel ids for announcements, development, updates and support.
  An empty id becomes `null`; the UI omits that link rather than showing a dead one.

Channel ids are numeric snowflakes. To copy one in Discord, enable **Settings → Advanced
→ Developer Mode**, right-click the channel and choose **Copy Channel ID**. Do not guess
an id.

---

## 10. Files on this computer and the Discord bot

The bot is a separate project. The website does **not** read the bot's files at build
time; the two lists are kept in sync by hand.

### Files outside this repository

| What | Full path on this computer | Does GitHub receive it? |
| --- | --- | --- |
| Website project | `D:\NextStepStudios\next-step-studios-website` | Yes — only files you commit and push |
| Discord bot | `D:\NextStepStudios\DiscordBots\PrivateBots\NextStepStudioBot` | No — it is a separate project |
| Master logo | `D:\NextStepStudios\DiscordBots\PrivateBots\NextStepStudioBot\images\server_logo\Next_StepStudios_Logo.png` | No — the generated copies in `src/assets/brand/` and `public/brand/` are committed instead |
| Local `.env` | `D:\NextStepStudios\next-step-studios-website\.env` | No — Git ignores it; it is local only |

**You do not need to copy the bot folder or the master logo into the website.** The site
is built from `src/lib/links.ts` and the generated brand files that are already in the
repository. GitHub will not see a change made only to a bot file or to the logo on your
D: drive; those are separate local changes. A fresh clone of the website can be built
and published without the bot folder or the master logo. Those files are only needed
when you are editing the bot or regenerating the brand.

### Bot config file

**Full path:**

```text
D:\NextStepStudios\DiscordBots\PrivateBots\NextStepStudioBot\bot\cogs\utilities\links\links_config.py
```

Open it in VS Code only if you intend to change the bot. Changing the bot is a separate
deployment from publishing the website.

### What the bot already has

The config already contains the same six sections and the same five social accounts as
the website: TikTok, Instagram, Facebook, X and YouTube, plus the website, Roblox,
Discord, GitHub, policies and business email. The website was brought into line with it.

### The bot's policy link — currently correct

The bot's Official Policies link is already the website page. In the current 530-line
file, **lines 185–187** are:

```python
POLICIES_DIRECTORY_URL = (
    "https://next-step-studios-official.github.io/policies"
)
```

Do **not** change this to the GitHub repository. The bot is not running on the website,
so it needs the full absolute address; the website itself uses the relative `/policies`.
No edit is required when your copy looks like the block above.

If your copy still has the old block instead, at **lines 185–188**:

```python
POLICIES_DIRECTORY_URL = (
    "https://github.com/Next-Step-Studios-Official/"
    "bot-documentation/tree/main/policies"
)
```

replace those four lines with the three-line block above. Remove both old GitHub strings;
do not leave one as a fallback or a comment. If the line numbers have moved, search for
`POLICIES_DIRECTORY_URL` instead.

Then, only if you changed the file:

1. Save the file.
2. Restart the bot process (or reload the cog, if that is how the bot is run). Python
   reads the file at import/startup, so a running bot will not see the change until it
   restarts.
3. Run the bot's `/links` command and confirm the **Official Policies** option opens the
   website page, not GitHub.
4. Search the whole bot folder for `bot-documentation/tree/main/policies` (VS Code:
   `Ctrl+Shift+F`) and update any other copy you own. The current `links_config.py` has no
   such match.

### What to remove after a change

- When replacing the old policy block, remove **both** old GitHub strings in that block.
- When adding a social account, remove any disabled placeholder with the same `id`;
  duplicate ids are ignored by the bot.
- When you stop testing locally, remove a test `RESEND_API_KEY` from `.env`; never commit
  `.env` at all.
- Do **not** remove `DOCS_POLICIES_URL` from `src/lib/links.ts`. That is the intentional
  secondary GitHub mirror, not the bot's primary policy link.
- Do **not** delete the bot folder or the master logo after generating the website files;
  they are the source material outside this repository.

### Current checklist (22 November 2026)

| Item | What to do |
| --- | --- |
| Bot policy URL | Verify lines 185–187. If they already show the website URL, change nothing. |
| Bot social links | The five accounts and the other entries already match the website. No edit. |
| Bot restart | Only after editing the bot. Restart, then test `/links`. |
| Website files | Already built and pushed. No manual website edit is needed to publish this version. |
| Master logo | Only needed when replacing the logo or running `npm run brand`. |
| Contact Worker | Already deployed separately. A GitHub Pages push does not redeploy it. |
| Resend key | No D: file. Add it in Sites → Secrets; see section 17. |

### Adding a new social account to both places

1. Add the entry to `src/lib/links.ts` first (see section 9).
2. Copy the same block into `LINKS` in `links_config.py` under the social section. The
   bot uses Python dicts, not TypeScript:

   ```python
   {
       "id": "threads",
       "name": "Threads",
       "section": "social",
       "type": "link",
       "description": "Follow Next Step Studios on Threads.",
       "url": "https://www.threads.net/@nextstepstudiosofficial",
       "enabled": True,
       "show_in_embed": True,
       "show_in_dropdown": True,
       "selection_embed_color": 0x000000,
   },
   ```

3. The bot's colour is a hexadecimal number (`0x000000`); the website uses a CSS hex
   string (`'#000000'`). They describe the same colour.
4. Keep `MAX_LINKS = 25` in mind; the current list is well below it, but do not add
   dozens of entries.
5. Restart the bot and rebuild the website. Compare the two `/links` panels: same names,
   same order, same destinations.

### The email notice is deliberately different

The bot's business-email entry includes a link to a private support channel. The website
does not publish that channel URL. The website's entry keeps the same instruction to use
a support ticket and select the correct type, without exposing the private link. That is
intentional; do not “fix” it by copying the private URL into the website.

---

## 11. Edit or add policies

**Folders:** `src/content/policies/bot/` and `src/content/policies/website/`
**Open in VS Code:** yes.

Policies are split into two separate sets, because they cover different things:

| Folder | Covers | Pages are at | Documents |
| --- | --- | --- | --- |
| `src/content/policies/bot/` | The Discord bot and the one private server it runs in | `/policies/bot/<slug>` | 7 |
| `src/content/policies/website/` | This public website: privacy, terms, copyright and security | `/policies/website/<slug>` | 4 |

`/policies` is one hub page for both sets, with search, scope chips and a current/draft
status filter. The chosen values are kept in the address
(`/policies?scope=website&status=current&q=privacy`), so a filtered list can be linked or
reloaded. The **Clear filters** button resets all three. The status filter is derived from
each document's `docStatus` frontmatter: a value containing “draft” is a draft, and
everything else is current.

The chip counts are faceted: each group respects the search and the other active group,
but not its own selection. With **Draft** selected, **All scopes** shows the nine drafts,
not all eleven documents. The same rule is used on Downloads, Projects and Search. If you
change the counting logic on one page, review the others.

**Full path:** `D:\NextStepStudios\next-step-studios-website\src\pages\policies\index.astro`

There is no combined policy: a bot document never applies to the website and vice versa.
`src/lib/documents.ts` decides a document's scope from its folder, builds its public URL
and gives it a flat download key. Do not add a third folder without also teaching that
file about it.

Each policy is a Markdown file with frontmatter. The policy page, Markdown download,
plain-text download, print layout and PDF all come from the same file.

When the studio ships a game, app or other product, it gets its own folder and document
set the same way. The hub already says so under **Future products**; do not publish a
placeholder policy for a product that does not exist.

### Edit an existing policy

1. Open the file, for example `src/content/policies/bot/privacy.md` or
   `src/content/policies/website/privacy.md`.
2. The top block is frontmatter:

   ```yaml
   ---
   title: Privacy Policy
   shortTitle: Privacy
   version: 0.2.0
   docStatus: Draft for review
   appliesTo: Next Step Bot
   order: 2
   summary: What the bot stores, why, and how long it keeps it.
   plainSummary: A plain-language version shown above the full document.
   updated: 2026-11-21
   ---
   ```

   - `title` — full title on the page.
   - `shortTitle` — used in navigation and compact lists.
   - `version` — the document version. Change it when the wording changes materially.
   - `docStatus` — `Current` for a document that describes the site as it is now,
     `Draft for review` for one that is published for reading but **not yet effective**.
     Any value containing “draft” is treated as a draft by the site. Do not write “in
     force” unless it is.
   - `appliesTo` — what the document covers.
   - `order` — position in the policy index. Lower numbers come first.
   - `summary` — one or two sentences for cards and metadata.
   - `plainSummary` — a short, plain-language summary shown above the full document and
     linked from the policy index. It is a summary, not a replacement for the wording.
   - `updated` — the date this version was recorded (`YYYY-MM-DD`).

3. Edit the body below the second `---`. Use normal Markdown headings (`##`) and lists.
4. Update `version`, `updated` and, if needed, `summary`.
5. Save.
6. **Restart needed?** No. **Rebuild?** Yes. The build regenerates the PDFs, the policy
   ZIP and the downloads catalogue.
7. **Verify:** open `/policies`, the policy page (for example
   `/policies/website/privacy`), `/downloads` and the PDF link. Check the filter chips on
   `/policies`: each document must disappear when the other scope is selected. The PDF
   may be cached by the browser; open it in a new tab.

### Add a new policy

1. Decide which set it belongs to. If it describes the bot, use
   `src/content/policies/bot/`; if it describes this website, use
   `src/content/policies/website/`. Do not put a website document in the bot folder just
   to avoid a new folder.
2. Create a `.md` file with a lowercase name and hyphens, for example
   `src/content/policies/website/accessibility.md`.
3. Copy the frontmatter from an existing policy and change every field. Give it a unique
   `order` within its set.
4. Add the body.
5. Save and run `npm run build`.
6. **Verify:** the policy appears on `/policies`, in `/downloads`, and at
   `/policies/website/accessibility`. The filter chips must show the correct set and
   count. The PDF and text download links should work.
7. Add a link from any page that should mention it (for example `/trust` or the project
   page) if it is important.
8. Run `npm run snapshot` only if this version should be archived in the version history.

### Download names and version snapshots

Bot documents keep their plain filenames: `privacy.md`, `privacy.pdf`,
`/policies/versions/privacy`. Website documents are prefixed so the two sets cannot
collide: `website-privacy.md`, `website-privacy.pdf`,
`/policies/versions/website-privacy`. The prefix is applied automatically by
`downloadKey()`; do not rename the files in `public/downloads/` by hand.

If you rename a policy's Markdown file, its URL, PDF, text file and version history all
change with it. Add a redirect in `astro.config.mjs` for the old address, as the
`/website-privacy` redirect already does.

### Policy version history

`src/pages/policies/versions/[slug].astro` reads recorded snapshots for either set. The
snapshots are created by:

```powershell
npm run snapshot
```

Run this deliberately when a version is being archived, not on every edit. It records
the current bodies; it does not approve a draft.

### The policy guard

`scripts/verify-content.mjs` refuses to build if internal material has leaked into
`src/content/`. If it fails, remove the internal material. Do not bypass the guard.

### The Official Policies link

The website's `/policies` page is the primary destination. The GitHub repository is a
mirror. If you change the policy structure, update `src/lib/links.ts` only if the public
route changes; do not point the link at GitHub.

---

## 12. Edit projects, modules and commands

### Projects

**Folder:** `src/content/projects/`
**Open in VS Code:** yes.

Add a project by creating a `.md` file, for example `new-game.md`:

```yaml
---
title: New Game
tagline: One line shown under the title.
status: Planned
category: Games
summary: Two or three sentences for cards and page metadata.
featured: false
order: 4
cover: /images/project-new-game.webp
updated: 2026-11-21
---
```

`status` must be one of: `In development`, `Prototype`, `Testing`, `Planned`, `On hold`.
There is no “Released” status. If a project ships, that is a deliberate change to the
schema and the status styles, not a casual edit.

`category` must be one of exactly four values: `Discord bot`, `Games`, `Apps & tools`,
`Website`. The projects index groups and counts by these; an unknown category fails the
build. A new project that does not fit should use the closest existing category rather
than a new one.

Only one project should have `featured: true`; the home page uses it. The project index
sorts by `order` (lower first). If you add a cover, see section 7 for the dimensions.

Every project detail page ends with a **Where this goes** panel linking the roadmap,
devlog and contact page. The wording is shared by every project, so edit it once in:

**Full path:** `D:\NextStepStudios\next-step-studios-website\src\pages\projects\[slug].astro`

### Project picture galleries

A project can list pictures in its frontmatter under `gallery:`. The shared gallery component
shows the large image, thumbnails, previous/next controls, a count and a full-screen viewer.
The Places Left Behind page is the first project using it.

**Gallery component:** `D:\NextStepStudios\next-step-studios-website\src\components\ProjectGallery.astro`

**Places Left Behind content:** `D:\NextStepStudios\next-step-studios-website\src\content\projects\places-left-behind.md`

**Step-by-step guide:** `D:\NextStepStudios\next-step-studios-website\PLACES_LEFT_BEHIND_EDITING.md`

### Modules

**File:** `src/lib/modules.ts`
**Open in VS Code:** yes.

Modules are typed entries:

```ts
{
  id: 'tickets',
  name: 'Support tickets',
  group: 'Community operations',
  summary: 'One or two sentences.',
  status: 'testing',
  commands: ['/ticket-panel', '/create'],
  note: 'Transcripts unverified',
}
```

Statuses: `tested`, `testing`, `wip`, `planned`, `not-implemented`. Do not mark a module
`tested` unless the studio has confirmed it in the server. The status labels are defined
in the same file; changing a label changes every page that uses it.

To add a module, copy an entry, give it a unique `id`, put it in one of the existing
`MODULE_GROUPS`, and add its commands. To remove one, delete the whole `{ ... },` block.
The module count and group counts are derived.

### Commands

**File:** `src/lib/commands.ts`
**Open in VS Code:** yes.

A source command:

```ts
{ name: 'ping', group: 'utilities', description: 'Check the bot’s response time.' },
```

A planned command belongs in `PLANNED_COMMANDS`, not `COMMANDS`. The site's command count
uses `COMMANDS`; planned commands are shown separately and are not counted as existing.
Keep the `group` equal to one of `COMMAND_GROUPS` ids. If you add a command, add it to the
module entry too when it belongs to a module, and mirror the change in the bot source if
the bot actually has it.

**Do not** change the count by editing a sentence. Add or remove the command; the count
follows.

### Team

See section 13.

---

## 13. Edit the team list

**File:** `src/lib/contributors.ts`
**Open in VS Code:** yes.

The list currently has four placeholders plus Candler Shaw, who is the operator and is not
in the list. Replace each entry:

```ts
{
  handle: '@contributor-1',
  name: 'Optional full name',
  role: 'Art and UI',
  focus: 'What this person actually works on.',
},
```

- `handle` — the public Discord username. Keep the `@`.
- `name` — optional; use it only if the person wants their full name shown. If present,
  it replaces the handle in the public credit.
- `role` — two or three words.
- `focus` — one sentence.

After every entry is a real, confirmed person, change:

```ts
export const CONTRIBUTORS_CONFIRMED = false;
```

to:

```ts
export const CONTRIBUTORS_CONFIRMED = true;
```

Until then, About and Team show a “being confirmed” notice. The team count and the words
“five people” are derived from the list and the operator; adding or removing a contributor
updates them. If the count changes, check for any hard-coded sentence elsewhere with a
search for `five people` or `five-person`; the main pages use `TEAM_WORD`.

**Verify:** `/about`, `/team`, the footer and `/press` show the same people and the same
count. **Rebuild** before publishing.

---

## 14. Edit the devlog, roadmap, changelog, FAQ and glossary

### Devlog

**Folder:** `src/content/devlog/`
**Open in VS Code:** yes.

Create a `.md` file per entry:

```yaml
---
title: Entry title
date: 2026-11-21
summary: One or two sentences shown in the list.
tags: [website, release]
series: Building the website
---

## Heading

Body text.
```

- The filename becomes the URL: `my-entry.md` → `/devlog/my-entry`.
- `tags` creates `/devlog/tag/{tag}` pages.
- `series` is optional; entries in a series link to each other.
- Entries sort newest first.
- Do not change an old entry's date to move it to the top; that would rewrite history.
  Add a new entry instead.

### Roadmap

**File:** `src/lib/roadmap.ts`
**Open in VS Code:** yes.

Each item has a title, a status and a short description. Use the existing status values;
do not describe planned work as shipped. The page is a reading of the list.

### Changelog

**File:** `src/lib/changelog.ts`
**Open in VS Code:** yes.

Entries are historical. Add a new entry at the top for a new change; do not rewrite old
entries to match the current site. The current entry format is a date, a title and a list
of changes.

The changelog page ends with links to the devlog, Now page and status page. Change that
panel in:

**Full path:** `D:\NextStepStudios\next-step-studios-website\src\pages\changelog.astro`

### FAQ

**File:** `src/lib/faq.ts`
**Open in VS Code:** yes.

Each item is a question and an answer. Keep answers short and factual. If an answer
mentions a feature, make sure the feature exists; otherwise say “planned” or remove the
claim.

### Glossary

**File:** `src/lib/glossary.ts`
**Open in VS Code:** yes.

Each term has a name, a definition and optional related links. The command count in the
“slash command” definition is derived from `COMMANDS`; do not type a fixed number.

---

## 15. Edit downloads and releases

### Manual downloads

**File:** `src/data/downloads.json`
**Open in VS Code:** yes.

Each item looks like:

```json
{
  "slug": "privacy-policy",
  "title": "Privacy Policy",
  "summary": "The bot's privacy policy as a PDF.",
  "href": "/downloads/privacy-policy.pdf",
  "category": "documents",
  "platforms": ["any"],
  "kinds": ["document"],
  "version": "0.2.0",
  "size": "120 KB"
}
```

- `slug` must be unique; it becomes the print route `/downloads/print/{slug}`.
- `href` points at a file in `public/downloads/` or an external release.
- `category` must be one of `documents`, `brand`, `games`, `apps`, `tools` or `media`.
  The downloads page filters by these and explains each in its legend.
- `platforms` must use `windows`, `linux`, `macos`, `android` or `any`.
- `kinds` must use `installer`, `archive`, `document`, `source` or `media`.
- The downloads filters are held in the address (`category`, `platform`, `kind`, `q`)
  and restored on load. The Reset filters button clears them.
- `size` is display text, not calculated; check it is accurate.

This file is only for hand-written entries such as the complete policy ZIP, the brand
kit and the cheatsheet. Policy documents themselves are generated from
`src/content/policies/` and must not be duplicated here. An empty category is fine: the
page says so honestly instead of inventing a file.

### GitHub Releases

**Script:** `scripts/fetch-releases.mjs`
**Output:** `src/data/releases.json` (generated; do not hand-edit).

Set `RELEASE_REPOS` in `.env` to a comma-separated list such as
`Owner/repo,Owner/repo2`, and optionally `GITHUB_TOKEN` to avoid the anonymous rate limit.
Then run:

```powershell
npm run releases
```

The ten most recent releases are recorded. Builds should be attached to GitHub Releases,
not committed to this repository. `npm run build` refreshes the manifest automatically.

### PDFs, the cheatsheet and the policy ZIP

The policy PDFs and command cheatsheet are generated:

```powershell
npm run pdfs
```

The complete policy ZIP is generated separately from the Markdown sources:

```powershell
npm run policies:zip
```

Do not edit the PDFs, the cheatsheet or the policy ZIP by hand; the next build replaces
them. The ZIP contains a README, a combined Markdown file and one file per document.

---

## 16. The admin panel (contact inbox)

The admin panel is **not a page editor and not a CMS**. It is the private inbox for
messages sent through the website's contact form. Website text, images and policies are
edited in VS Code as described above.

### Where it is

```text
https://next-step-studios-contact-wqep7k.freebuff.site/dashboard
```

The same Worker serves `/` as a convenience; use `/dashboard` so the address is
unambiguous. The dashboard sends `noindex, nofollow` and is not linked from the public
site.

### First-time setup (deployed Worker)

1. Open the dashboard URL in a normal browser window.
2. If no password has been set, the page shows **First run** with two password fields.
3. Choose a password of **12 to 200 characters**. Use a password manager; do not reuse a
   Discord or email password.
4. Enter it twice and submit.
5. The hash is stored as a PBKDF2 hash in the D1 database. The password itself is not
   stored anywhere and cannot be read back by the host.
6. The setup screen refuses to run again once a password exists.

If the page says **“This inbox already has a password”**, setup has already been done. Use
the sign-in form.

### Sign in

1. Open the dashboard URL.
2. Enter the password in **Password** and submit.
3. A successful sign-in sets the `nss_admin` cookie: `HttpOnly`, `Secure`,
   `SameSite=Lax`, valid for **8 hours**.
4. The inbox lists messages newest first. Nothing is emailed to you by default; email
   copies are a separate optional setting.

### Sign out

Click **Sign out** in the top-right. The cookie is cleared. On a shared computer, sign out
and close the window; do not rely on the eight-hour expiry.

### What the inbox can do

- Read every stored message (name, email, subject, message, received time).
- Change a message's status to **new**, **read** or **done**.
- Delete one message permanently, after a confirmation. This cannot be undone; the JSON
  export is the backup.
- Download every stored message as a JSON attachment.
- Sign out.

It cannot edit pages, upload images, change policies, create users or reset its own
password through a screen.

### How to manage content safely

1. Edit the source file in VS Code (sections 3–15).
2. Run `npm run build` and check the preview.
3. Commit and push to `main`.
4. The public site updates; the inbox is unaffected.

Before deleting a message, consider whether it needs a reply or a retention obligation.
Deleting it does not delete an email copy that was already delivered; remove that from the
mailbox separately.

### If you cannot sign in

Work through these in order:

1. **Wrong URL?** It must be the `...freebuff.site/dashboard` address, not the GitHub
   Pages site and not `.../api/...`.
2. **Wrong password?** The service cannot recover it. Use the reset steps below.
3. **Too many attempts?** Login is limited to 10 attempts per 15 minutes per address.
   Wait 15 minutes and try again.
4. **Page says “The dashboard is not configured” or “incomplete”?** The Worker is missing
   its D1 binding or `SESSION_SECRET`. Open `/healthz` and check `storage`, `session` and
   `dashboard`. Fix the Worker configuration; do not add a bypass.
5. **Cookie does not stick?** The cookie is `Secure`, so the dashboard must be opened over
   HTTPS. Check that the browser is not blocking cookies for the site. Try a private
   window.
6. **Setup screen will not submit?** The password must be at least 12 characters and the
   two fields must match. If it still fails, the service may already have a password, or
   `SESSION_SECRET` is missing.
7. **Still locked out?** Use one of the reset methods below.

### Reset the deployed password

There are two supported ways. Neither requires weakening authentication.

**Option A — set a new hash as a Worker secret (recommended).**

1. In VS Code's terminal, run:

   ```powershell
   npm run hash-password -- --worker "your new password"
   ```

   This prints one line starting with `pbkdf2:`. Copy the **whole line**. Do not share it;
   it is a password hash, not a password, but it still controls access.

2. Open the Sites project **Next Step Studios Contact → Secrets**.
3. Set `ADMIN_PASSWORD_HASH` to the copied line.
4. Redeploy the Worker so the new secret is picked up.
5. Open the dashboard and sign in with the new password. The secret takes precedence over
   the hash in D1.

**Option B — clear the stored hash in D1.**

Only do this if you have access to the project's D1 database, Option A is unavailable,
and **no `ADMIN_PASSWORD_HASH` Worker secret is set** (a secret takes precedence, so
clearing D1 would do nothing while it exists). The setup screen will reappear, and you
can choose a new password.

```sql
DELETE FROM settings WHERE key = 'admin_password_hash';
```

This deletes only the password setting. It does **not** delete messages. Do not run
`DROP TABLE`, do not delete the database, and do not publish database credentials.

### Reset the local Node password

The Node service has no setup screen. It reads `SESSION_SECRET` and
`ADMIN_PASSWORD_HASH` from `.env`.

1. Generate a Node hash:

   ```powershell
   npm run hash-password -- "your new password"
   ```

2. Open `D:\NextStepStudios\next-step-studios-website\.env` in VS Code.
3. Replace the value after `ADMIN_PASSWORD_HASH=` with the printed `scrypt:` line.
4. Save and restart `npm run contact` (stop it with `Ctrl+C` first).
5. Open `http://localhost:8787/dashboard` and sign in.

### What not to do

- Do not remove the password, add a “secret” URL, put the dashboard behind only a hidden
  path, or disable the cookie checks to make access easier.
- Do not share the password in chat, screenshots, commits or issues.
- Do not put the password in `.env.example`, the website source or a public note.
- Do not create a second admin account; the design is one shared operator password on
  purpose.

---

## 17. `.env` and secrets

### What `.env.example` is

`.env.example` is a documented template. It contains variable **names** and safe example
values, not real credentials. It is committed so the project records which settings exist.

`.env` is your local copy. It is listed in `.gitignore` and must never be committed. The
two files have the same variable names; `.env` holds the real values.

### Create `.env` in VS Code

1. Open the project folder in VS Code.
2. Open the integrated terminal (**Terminal → New Terminal**).
3. Run one of these, depending on your shell:

   **PowerShell (the VS Code default on Windows):**

   ```powershell
   Copy-Item .env.example .env
   ```

   **Git Bash:**

   ```bash
   cp .env.example .env
   ```

4. In the Explorer, click `.env` (it may be hidden; if so, use **View → Explorer** and
   look for it). If it is not visible, use **File → Open File…** and paste the full path.
5. Edit the values after the `=` signs. Do not add spaces around `=`.
6. Save with `Ctrl+S`.
7. Confirm Git ignores it:

   ```powershell
   git status --short
   ```

   `.env` should not appear. If it does, stop and check `.gitignore` before committing.

### Which values to change

| Variable | What to put there | Can it stay empty? |
| --- | --- | --- |
| `PUBLIC_CONTACT_ENDPOINT` | The contact endpoint; the template uses the deployed service. Replace it with a local URL, or set it to an explicit empty value for the not-connected state. | No; an explicit empty value is a deliberate not-connected build |
| `PORT` | Local Node service port, default `8787` | No, but the default is fine |
| `DATA_DIR` | Local message folder, default `server-data` | No, but the default is fine |
| `CONTACT_ALLOWED_ORIGIN` | The exact origin allowed to post; default is the GitHub Pages origin | No for local form tests |
| `SESSION_SECRET` | A random 32+ character string; signs cookies and hashes IPs | Empty disables the local dashboard |
| `ADMIN_PASSWORD_HASH` | A `scrypt:` hash for the Node service, or `pbkdf2:` for the Worker | Empty disables local dashboard login |
| `CONTACT_WEBHOOK_URL` | Optional Discord/Slack webhook URL | Yes |
| `CONTACT_RATE_LIMIT` | Messages per IP per 15 minutes, default `5` | Yes |
| `RESEND_API_KEY` | Optional Resend key; without it messages are stored but not emailed | Yes |
| `NOTIFY_EMAIL` | Where email copies go; if empty, the published contact address is used | Yes |
| `MAIL_FROM` | Sender; empty means `onboarding@resend.dev` | Yes |

The variable **names** must stay exactly as written; do not rename them.

### Generate a session secret

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output after `SESSION_SECRET=`. Do not reuse a password. Rotating this value
signs every existing session out, which is the intended effect if a cookie may have
leaked.

### `.env` is not the deployed configuration

- **GitHub Pages** does not read `.env`. The deploy workflow supplies `SITE_URL` and
  `BASE_PATH`.
- **The deployed Worker** does not read `.env`. Its values are **Sites → Next Step
  Studios Contact → Secrets**.
- **The local Node service** reads `.env` when `npm run contact` starts. This loader was
  added so the file is actually used; a missing `.env` is fine if the real values are in
  the environment.
- **The website build** reads only `PUBLIC_CONTACT_ENDPOINT`.

Putting `RESEND_API_KEY` in `.env` alone will not make the live form send email. Set it
on the Worker and redeploy.

### Add the Resend key to the live form

The key is **not a file** and has no path on the D: drive. It is a secret on the contact
Worker. GitHub Pages only serves static files; it cannot run `server/worker.mjs` or send
email. The separate Worker does that. The live Worker is already deployed; publishing
the website does not redeploy it, and the live form does not need a Worker file on your
computer. The source already reads the key; no website file needs to change. The Worker
source is:

```text
D:\NextStepStudios\next-step-studios-website\server\worker.mjs
```

Do not put the key inside that file.

1. Open the Freebuff Sites project **Next Step Studios Contact → Secrets**.
2. Add a secret named exactly `RESEND_API_KEY`.
3. Paste the key as the value and save. Do not add quotes around it.
4. Redeploy the contact Worker from the Sites project. A saved secret does not change a
   Worker that is already running.
5. Open
   <https://next-step-studios-contact-wqep7k.freebuff.site/healthz> and check the `email`
   field. It should say `"configured"`. If it still says `"not configured"`, the secret
   name is wrong, the value is empty, or the Worker was not redeployed.

`NOTIFY_EMAIL` is optional: when empty, the published contact address is used.
`MAIL_FROM` is optional: when empty, Resend's `onboarding@resend.dev` sender is used.
Messages are stored even when email is not configured, so a missing key never loses a
message.

For **local Node testing only**, the exact file is:

```text
D:\NextStepStudios\next-step-studios-website\.env
```

Add the line `RESEND_API_KEY=` and paste the key after `=`. That file is ignored by Git
and is never part of the GitHub Pages build. Do not put the live key in `.env.example`,
`README.md`, `EDITING.md`, a commit or chat.

### If you accidentally commit a secret

1. Treat the secret as compromised. Revoke or rotate it immediately:
   - Resend: delete the key and create a new one.
   - Discord webhook: delete the webhook and create a new one.
   - `SESSION_SECRET`: generate a new one; all sessions are invalidated.
   - Admin password: reset it with the steps in section 16.
2. Remove the file from the working tree and from Git tracking:

   ```powershell
   git rm --cached .env
   git commit -m "Remove accidentally committed environment file"
   ```

3. Removing it from the latest commit does **not** remove it from history. If the
   repository is public, assume the value is public. For a thorough removal, use
   `git filter-repo` (or GitHub's secret-removal guidance) and force-push only after
   coordinating with everyone who has a clone. Rotating the secret is the step that
   actually protects the service.
4. Check GitHub → the repository → **Settings → Code security** for secret-scanning
   alerts. Follow their instructions.

### Never put real values in `.env.example`

`.env.example` is public. Keep placeholders or empty values there. The real values belong
in `.env` (local) or in the host's secret store (deployed).

---

## 18. Run the contact service locally

The deployed site uses the Cloudflare Worker. You only need the local Node service if you
are testing the form or the inbox on your own computer.

1. Create `.env` as in section 17.
2. Set these values:

   ```dotenv
   PUBLIC_CONTACT_ENDPOINT=http://localhost:8787/api/contact
   CONTACT_ALLOWED_ORIGIN=http://localhost:4321
   SESSION_SECRET=<a random 32+ character string>
   ADMIN_PASSWORD_HASH=<a scrypt: hash from npm run hash-password>
   ```

3. Start the service in one terminal:

   ```powershell
   npm run contact
   ```

   It prints the local address and whether the dashboard is configured. A message about a
   missing `RESEND_API_KEY` is expected; messages are still stored.

4. Start the website in a second terminal:

   ```powershell
   npm run dev
   ```

   The site reads `PUBLIC_CONTACT_ENDPOINT` when it starts, so restart it after changing
   that value.

5. Open `http://localhost:4321/contact`, send a test message, then open
   `http://localhost:8787/dashboard` and sign in with the password you hashed.
6. Stop both with `Ctrl+C`.

The local service stores messages in `server-data/messages.ndjson`. That folder is
gitignored and is the only copy of the local inbox; back it up if the messages matter.

---

## 19. Test, build and publish

### Before you build

- Save every changed file.
- Check the terminal for red errors from `npm run dev`.
- Check `git status` to see what changed. Do not stage `.env`, `server-data`, `dist` or
  `node_modules`.

### Build

```powershell
npm run build
```

This runs the release fetch, content guard, PDFs, cheatsheet, brand ZIP and Astro build.
It writes `dist/`. A successful build is the minimum check for every change.

If the build changes PDFs or the brand ZIP because their timestamps or inputs changed,
that is normal; commit the regenerated files with the source change. If the build changes
files you did not intend to touch, inspect the diff before committing.

### Preview the built site

```powershell
npm run preview
```

Open the printed address and check the changed page. Stop with `Ctrl+C`.

### Check mobile and icons

1. Open the site in your browser and press `F12` to open Developer Tools.
2. Press `Ctrl+Shift+M` to switch on the device toolbar, then choose a phone size
   such as **390 × 844**.
3. Check `/`, `/links`, `/contact` and `/press`. There should be no sideways scrolling,
   the ☰ menu should open, the banner should fit the column and the text should not be
   clipped.
4. Check the browser tab at normal size. Open a new incognito window if the old favicon
   is cached; the tab should show the ninja face, not the old full lockup.
5. Run `npm run build` again after any fix. Do not publish with a horizontal scrollbar or
   an image that is stretched.

### Publish to GitHub Pages

1. Open **Source Control** in VS Code (`Ctrl+Shift+G`).
2. Review the changed files. Stage only the files that belong to this change.
3. Write a short commit message, for example `Fix official links and favicon`.
4. Commit, then **Sync Changes** / **Push** to `main`.
5. Open the repository's **Actions** tab. The `Deploy` workflow should run.
6. Wait for the green check. Open <https://next-step-studios-official.github.io/> and
   check the changed page. Hard-refresh (`Ctrl+F5`) if a favicon or image looks old.

Only `main` publishes. A push to another branch runs no deployment.

### If the Actions build fails

1. Open the failed run and expand the failing step.
2. The error is usually the same one `npm run build` gives locally. Reproduce it locally
   first.
3. Common causes: a missing image path, invalid frontmatter, an unescaped apostrophe in a
   JavaScript string, or a Node version mismatch.
4. Fix the source, run `npm run build` again, commit, and push.

---

## 20. Troubleshooting

### `npm` is not recognised

Install Node.js LTS from <https://nodejs.org/en/download>, close VS Code, reopen it, and
run `node --version`. This project needs 20.12 or newer.

### `npm install` fails

- Check the internet connection.
- Delete `node_modules` and run `npm install` again. Do not delete `package-lock.json`.
- On Windows, close any program holding a file in `node_modules` (an editor or a running
  dev server) and retry.

### Port 4321 is already in use

Stop the other dev server with `Ctrl+C`. If you cannot find it, start on another port:

```powershell
npm run dev -- --port 4322
```

### The page is a 404

- Check the file is in `src/pages/` and the filename matches the URL.
- Dynamic routes need a matching content entry (for example `/projects/next-step-bot`
  needs `src/content/projects/next-step-bot.md`).
- `/social` intentionally redirects to `/links`.
- If it works locally but not on GitHub Pages, check the build output and the Actions log;
  a page that failed to build will not exist.

### An image is broken

- A path beginning with `/` is relative to `public/`.
- Check the exact filename and extension. GitHub Pages is case-sensitive.
- If the image is in `src/assets/`, it must be imported, not referenced as `/src/...`.
- Rebuild after adding a file; the dev server usually picks it up, but the production
  build is the real test.

### The layout jumps when an image loads

The `width` and `height` attributes do not match the real image. Update them to the actual
pixel dimensions. Do not remove them.

### The favicon did not change

Browsers cache favicons. Open a new incognito window, or hard-refresh. Check the generated
file directly at `/brand/favicon-32.png`. If that file is correct, the browser cache is
the problem.

### The contact form says it is not connected

`PUBLIC_CONTACT_ENDPOINT` is empty at build time. Set it to the deployed service URL (or
your local service), restart `npm run dev` / rebuild. The default when the variable is
unset is the deployed service; an explicitly empty value means “not connected”.

### The form returns an error

- Check `/healthz` on the contact service.
- `storage: missing` means the D1 binding is missing.
- `session: missing` means `SESSION_SECRET` is missing; the dashboard cannot work.
- `email: not configured` is not an error; messages are still stored.
- A CORS/origin error means the site's origin is not in `ALLOWED_ORIGINS` (Worker) or does
  not match `CONTACT_ALLOWED_ORIGIN` (Node).
- A 429 means the rate limit was reached; wait for the retry time.

### The dashboard will not load

Open `/healthz` and `/api/state` directly. `configured: false` means no admin hash has
been set; use the first-run screen. `dashboard: incomplete` means D1 or `SESSION_SECRET`
is missing. See section 16 for the full checklist.

### The build fails in `verify-content`

Internal material has leaked into `src/content/`. Remove it. Do not edit the guard to
make it pass.

### A policy PDF is stale

The build regenerates PDFs. If your PDF viewer shows an old copy, open it in a new tab or
clear the cache. Confirm the file timestamp under `public/downloads/` changed.

### `npm run brand` says the source is missing

The script reads the logo from the bot project. Check the path in
`scripts/make-brand-assets.mjs`, or set `BRAND_SOURCE` to the full path of
`Next_StepStudios_Logo.png` and run it again. Do not replace the source with a random
image.

### A change appears on one page but not another

The value is probably duplicated. Search the whole project with `Ctrl+Shift+F` for the old
text. Prefer changing the shared module (`src/lib/...`) so every page follows.

---

## 21. File map and commands

### Important files

Every path in this table is relative to `D:\NextStepStudios\next-step-studios-website`. The
full paths for the policy filter and breadcrumb files are at the top of this guide.

| Path | What it is |
| --- | --- |
| `src/pages/` | Every route |
| `src/layouts/Base.astro` | Page shell, metadata, favicons, schema |
| `src/styles/theme.css` | Light palette and light-only surface overrides |
| `src/components/Header.astro` | Desktop and mobile navigation |
| `src/components/Breadcrumbs.astro` | Breadcrumb path above policy, project, module and devlog detail pages |
| `src/pages/policies/index.astro` | Policy hub, search and scope/status filters |
| `src/pages/downloads/index.astro` | Download catalogue, category chips and platform/type/search filters |
| `src/pages/projects/index.astro` | Project list, search, status/category filters and sort |
| `src/pages/projects/[slug].astro` | Project detail page and gallery placement |
| `src/components/ProjectGallery.astro` | Project pictures, thumbnails, counter and full-screen viewer |
| `src/content/projects/places-left-behind.md` | Places Left Behind copy, status and gallery list |
| `PLACES_LEFT_BEHIND_EDITING.md` | Standalone guide to the Places Left Behind page and its pictures |
| `src/styles/global.css` | Base styles, dark tokens and the shared filter note |
| `src/styles/pages.css` | Page-specific layout and shared touch-target rules |
| `src/components/Footer.astro` | Footer navigation and contact |
| `src/components/Assistant.astro` | Floating Step launcher, chat panel and local loader |
| `src/lib/assistant.ts` | Step's local question matcher, topics and page starters |
| `src/pages/step.astro` | Public guide to what Step can and cannot answer |
| `src/pages/search.astro` | Full-text search, filters and typo suggestions |
| `src/pages/changelog.astro` | Changelog page and its onward links |
| `src/pages/links.astro` | Official links directory and its site links |
| `src/pages/team.astro` | Team list and contact links |
| `src/pages/assistant-facts.json.ts` | Curated public facts used by Step |
| `src/pages/search-index.json.ts` | Full-text index used by Search and Step |
| `src/lib/site.ts` | Studio name, operator, email, canonical URL |
| `src/lib/links.ts` | Official links and social accounts |
| `src/lib/discord.ts` | Discord invite and channel ids |
| `src/lib/commands.ts` | Slash commands and groups |
| `src/lib/modules.ts` | Bot modules and statuses |
| `src/lib/contributors.ts` | Team list and counts |
| `src/content/projects/` | Project Markdown |
| `src/content/devlog/` | Devlog Markdown |
| `src/content/policies/bot/` | Discord bot policy Markdown |
| `src/content/policies/website/` | Website policy Markdown |
| `src/data/downloads.json` | Manual download catalogue |
| `src/assets/brand/logo-mark.png` | Generated head mark for header/footer |
| `src/assets/banners/` | Page banners |
| `public/images/` | Hero and project covers |
| `public/brand/` | Generated logo matrix and favicons |
| `public/downloads/` | Generated PDFs, brand ZIP and policy ZIP |
| `public/og/` | Generated share cards |
| `server/worker.mjs` | Deployed contact service |
| `server/index.mjs` | Node contact service |
| `.env.example` | Local environment template |
| `astro.config.mjs` | Static output and canonical site |
| `.github/workflows/deploy.yml` | GitHub Pages deployment |

### Theme tokens

Dark values are defined once in `src/styles/global.css`; `src/styles/theme.css` restates every
colour for light mode. Use an existing token rather than a raw colour, and check the spelling:
an undefined `var(--…)` does not raise an error, it quietly makes that declaration invalid.
For surfaces, `--color-surface` is the main panel fill and `--color-surface-2` is the quieter
tint used for headers and nested areas. The body face is `--font-sans`.

Astro adds a scope attribute to elements it renders at build time. Elements created later
in JavaScript do not get that attribute, so a normal scoped selector will skip them. Use a
`:global(...)` selector inside a rendered wrapper, as the Status strip and Search suggestion
do; otherwise the styles silently do nothing.

**Full paths:** `D:\NextStepStudios\next-step-studios-website\src\styles\global.css` and
`D:\NextStepStudios\next-step-studios-website\src\styles\theme.css`

### Commands

```powershell
npm install          # once, and after package changes
npm run dev          # local preview at http://localhost:4321
npm run build        # full production build into dist/
npm run preview      # serve dist/
npm run brand        # regenerate logo matrix, favicons, manifest, ZIP
npm run banners      # regenerate the two page banners
npm run og           # regenerate share cards
npm run pdfs         # policy PDFs and command cheatsheet
npm run policies:zip # complete policy set ZIP
npm run snapshot     # record policy version snapshots
npm run releases     # refresh the GitHub Releases manifest
npm run contact      # local Node contact service
npm run hash-password -- "password"            # Node scrypt hash
npm run hash-password -- --worker "password"   # Worker PBKDF2 hash
```

---

## 22. Future accounts and the game launcher

These are plans, not features. Nothing in this section is implemented, and the site must
not advertise it as available.

### What is deliberately not here

- No registration, login, profile or user database on the website.
- No account system in the contact service.
- No tokens in browser storage.
- No OAuth client or identity provider.
- No game launcher or download authentication.

### Decisions worth making now

These keep the future option open without building it prematurely:

1. **Keep the static site and the API separate.** The website is static HTML; the contact
   service is a separate Worker. A future account service should be a third, separate
   service. Do not turn the Astro build into a server just to add accounts.
2. **Keep the `/api` boundary.** The contact form already talks to `/api/contact`. A
   future account API should use its own versioned path (`/api/v1/...`) rather than
   mixing sessions into page routes.
3. **Use opaque user IDs.** If accounts arrive, give each user a stable internal ID and
   never use an email address or a Discord handle as the database key. People change
   both.
4. **Hash passwords with a current algorithm.** The admin service already uses PBKDF2 in
   the Worker and scrypt in Node. A user account service should use Argon2id or the
   platform's recommended password hash, with a per-user salt and a sensible work factor.
5. **Use HttpOnly, Secure, SameSite cookies.** Do not put a session token in
   `localStorage`. The admin cookie is the model: signed, HttpOnly, eight-hour expiry.
6. **Separate the admin identity from user identities.** The operator's inbox password
   must never become a user account or a game-launcher login.
7. **Plan data ownership and deletion before storing user data.** Decide what is stored,
   why, where, for how long and how a deletion request is handled. The privacy notice must
   describe it before the feature ships.
8. **Do not trust the launcher.** A desktop launcher is a public client; anything shipped
   in it can be extracted. Authentication and entitlement checks belong on a server, not
   in client-side flags.
9. **Choose the account provider later.** A self-hosted email/password system, Discord
   OAuth, or a managed identity service are all viable. The decision can wait until the
   launcher's requirements are known; the boundary above keeps it reversible.
10. **Keep the domain stable.** Cookies, OAuth callbacks and launcher API URLs all depend
    on a stable origin. Decide on the final domain before launching accounts.

### What can safely wait

- The account database engine.
- The identity provider.
- Email verification and password reset flows.
- Profile fields and avatars.
- Launcher entitlement rules.
- Social login.

Do not add placeholder login buttons, “coming soon” account pages or fake user counts.
The honest state is that accounts do not exist yet, and the site already says so.

---

## 23. Step, the local assistant

**Name:** Step. **Where:** the floating button in the bottom-right corner of every page.
It answers questions about the studio from the site's public content.

Step is **not a neural language model**. It is a deterministic local retrieval assistant:
no API key, no cloud AI, no account, and no conversation storage. It is deliberately
built this way so the site can keep its “no tracking, no third parties” promise.

### How an answer is produced

1. Opening the panel fetches two same-origin static files:
   - `/assistant-facts.json` — curated facts about the studio, projects, policies, team
     and links, generated at build time;
   - `/search-index.json` — the same full-text index used by the Search page.
2. `src/lib/assistant.ts` normalises the question, handles common abbreviations and
   one-character typos, expands a small explicit synonym list, scores it against the
   facts, then searches the index for longer-tail questions.
3. The answer is displayed as plain text, with links to the relevant public page and a
   **Copy** button. After an answer, Step may show up to three **Continue with** chips.
   They are curated questions tied to that fact (or a sensible fallback), and clicking
   one submits it locally exactly as if it had been typed. They are not a separate
   service and are not stored.
4. Before a question, the panel shows starters chosen for the current page (commands on
   `/commands`, policies on a policy page, and the studio basics elsewhere). The
   **Topics** button opens the full curated topic menu. Neither list is stored.
5. If nothing is relevant, Step says it does not know and offers **Search** and
   **Contact** instead of inventing an answer.

The public `/step` page explains the same behaviour, and the home page has a small
demo that opens the panel with a sample question. Both are ordinary site pages; no
additional service is involved.

No question is sent to an AI service or an API. The only requests are for the two static
files above, and those requests contain no question text. There is no `localStorage` or
cookie for the conversation; it exists in the open tab and resets on reload.

### Files

| File | Purpose |
| --- | --- |
| `src/components/Assistant.astro` | Launcher, panel, messages, follow-up chips, loading and keyboard behaviour |
| `src/lib/assistant.ts` | Tokenising, fact scoring, index search, answer templates and fallback follow-ups |
| `src/pages/assistant-facts.json.ts` | The curated facts; generates `/assistant-facts.json` |
| `src/pages/search-index.json.ts` | The shared full-text index; generates `/search-index.json` |
| `src/layouts/Base.astro` | Renders `<Assistant />` once on every page |
| `src/pages/step.astro` | Public guide: topics, limits and local-only behaviour |
| `src/content/policies/website/privacy.md` | Explains the assistant's local-only behaviour |

### Add or change an answer

Open `src/pages/assistant-facts.json.ts` and find the `facts` array. A fact looks like:

```ts
fact(
  'studio',
  'Next Step Studios',
  ['what is next step studios', 'what is the studio'],
  'The answer shown to the visitor.',
  [link('/about', 'About the studio')],
  8,
),
```

- `id` — unique, lowercase and stable. Do not reuse an existing id.
- `title` — the short label; it is also used for matching.
- `aliases` — real questions a visitor might type. Add several.
- `answer` — plain text only. It is inserted with `textContent`, so HTML is not rendered.
- `links` — public site routes or public HTTPS URLs. Do not add a private channel,
  token, password or internal document.
- `priority` — 0–10; higher wins when two facts are equally relevant. Use 7–10 for
  important studio facts, 0–3 for narrow references.

Keep every answer traceable to a public page. If the underlying project, policy or team
fact changes, change the source content or the fact as well; never leave the assistant
claiming something the page no longer says. The full-text index already covers policies,
projects, devlog entries, commands, modules, FAQ entries, roadmap items and glossary
terms, so those do not need a separate fact unless the common answer needs a direct
summary.

Follow-up chips come from the `FOLLOW_UPS` object at the top of the same file, keyed by
the fact `id`. Keep two or three per important fact, phrase them as questions, and make
sure the public pages can answer each one. A link or claim that is not answerable is
worse than showing no chip. Dynamic facts (projects, policies, FAQ entries, devlog
entries and social accounts) use the generic fallback unless you add an entry for their
generated id.

### Test Step

1. Run `npm run dev` and open `http://localhost:4321/`.
2. Open **Ask Step** in the bottom-right. Ask the suggested questions.
3. Use **Topics** to open the menu, ask one of its questions, then close and reopen the
   menu. The starters should stay hidden after a question and return with **New**.
4. After an answer, click one of the **Continue with** chips. It should submit that
   question and replace the old chips. Check that every chip is answerable from the
   public site rather than a dead end. Use **Copy** and confirm the clipboard text is the
   answer, not the source label.
5. Ask something the public pages do not cover, for example “What is your favourite
   colour?”. It should say it does not know, with Search and Contact links.
6. Ask a policy question and a command question. Check the links open the right page.
7. Open DevTools → Network, clear the log, then open Step. The only new requests should
   be `/assistant-facts.json` and `/search-index.json`; there should be no external AI
   request.
8. Reload the page. The conversation should be gone. Check DevTools → Application →
   Local Storage: Step should not have added a key.
9. At a 390 × 844 viewport, the panel should fit without sideways scrolling, and
   `Escape` or the ✕ button should close it. Follow-up chips must wrap rather than
   overflow.
10. Switch to light theme. The panel must be white with dark text; the home hero must
    stay readable over its artwork; and the hero, HUD and footer must not use the
    dark-only surfaces.
11. On the home page at 390 and 320 wide, Step is a compact icon at the bottom right and
    the HUD labels, values and clock stay clear of it.
12. With Step closed, tap a footer link near the bottom edge. The `.step-root` wrapper
    deliberately has `pointer-events: none`; only the launcher and panel should receive
    taps.
13. Run `npm run build` before publishing. A successful build is the check for the facts
    route and the bundled script.

### What not to do

- Do not add an OpenAI, Anthropic, Google or other model API call. There is no API key
  for Step, and the site's privacy notice says there is no third-party AI request.
- Do not put the question in a URL, log it, or save it to `localStorage`, a cookie or the
  contact service.
- Do not render the answer with `innerHTML`; the current code uses `textContent` so page
  content cannot inject markup.
- Keep `Assistant.astro`'s style block marked `is:global`. Messages, copy buttons,
  follow-up chips and dynamically rendered starters are created after Astro adds its
  scoped-style attribute, so a normal scoped style would not reach them. Every selector
  in that block is namespaced with `step-`.
- Do not rely on the `hidden` attribute alone for an element whose CSS sets `display`;
  add a matching `[hidden] { display: none }` rule. The panel, starters, topic menu and
  search suggestions each have one for this reason.
- Do not include private bot configuration, private Discord channel URLs, credentials or
  internal notes in `assistant-facts.json.ts` or `search-index.json.ts`.

### If Step gives a stale or missing answer

- Rebuild with `npm run build`. The facts file is generated at build time.
- Hard-refresh the browser if the panel was already open; the loader requests both JSON
  files with `cache: 'no-cache'`.
- If a new topic is missing, add a fact with several aliases. If a page exists but the
  answer is vague, add a specific fact rather than making the search index larger.
