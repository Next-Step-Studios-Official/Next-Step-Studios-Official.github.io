# Places Left Behind page — how to edit it

This guide covers the **Places Left Behind** project page, its picture gallery, its copyright
line and its separate documentation section. It is kept separate from the main editing guide so
the game page can grow without making the whole site manual harder to use.

- Public page: `https://next-step-studios-official.github.io/projects/places-left-behind/`
- Previous address (redirects): `https://next-step-studios-official.github.io/projects/first-game/`
- Main content file: `D:\NextStepStudios\next-step-studios-website\src\content\projects\places-left-behind.md`
- Image folder: `D:\NextStepStudios\next-step-studios-website\public\images\places-left-behind\`
- This guide: `D:\NextStepStudios\next-step-studios-website\PLACES_LEFT_BEHIND_EDITING.md`
- Last updated: 24 November 2026

## The short version

1. Put new pictures in `D:\NextStepStudios\next-step-studios-website\public\images\places-left-behind\`.
2. Open `src\content\projects\places-left-behind.md`.
3. Add one block per picture under `gallery:` in the frontmatter.
4. Run `npx astro dev` and open `/projects/places-left-behind/` to check it.
5. To refresh the game documentation, run
   `npm run docs:sync -- "C:\Users\Panda\Documents\CustomGames\Places Left Behind"`.
6. Run `npx astro build` before publishing.

The page counts the pictures automatically. Do not edit the `1 / 3` counter by hand.

## Where the pictures appear now

The picture gallery is the **first block under the project title and status row**, before the
written sections. There is no separate “A closer look” heading any more. The first picture is the
large image; the thumbnails and the `1 / N` counter sit underneath it.

The gallery gives visitors:

- a 16:9 preview of the selected picture;
- previous and next buttons when there is more than one picture;
- compact, square thumbnails for every picture, in order;
- a `1 / 3` counter under the set;
- a **View larger** dialog when the preview is clicked;
- arrow-key movement and Escape to close in the larger viewer;
- focus returning to the gallery when the viewer closes.

The thumbnails keep their square shape because the component sets `aspect-ratio: 1 / 1` and
`height: 100%`. HTML `height` attributes only supply the image's real dimensions; they must not
override the thumbnail layout.

It works without a third-party image service. The pictures are ordinary files in this project.

## Files you will edit

All paths are complete Windows paths.

| File | What it is for |
| --- | --- |
| `D:\NextStepStudios\next-step-studios-website\src\content\projects\places-left-behind.md` | The page text, status, cover, gallery list and copyright block. This is the normal file to edit. |
| `D:\NextStepStudios\next-step-studios-website\public\images\places-left-behind\` | Put gallery image files here. The folder already exists. |
| `D:\NextStepStudios\next-step-studios-website\src\content.config.ts` | Defines the allowed `gallery:` shape. Usually you do not need to change it. |
| `D:\NextStepStudios\next-step-studios-website\src\components\ProjectGallery.astro` | The shared gallery component: preview, square thumbnails, arrows, counter and larger viewer. Every project gallery uses it. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\projects\[slug].astro` | The project page template that places the gallery under the title and adds the documentation callout. |
| `D:\NextStepStudios\next-step-studios-website\src\content\places-left-behind-docs\` | The 43 imported game documents. Regenerate with `npm run docs:sync`; do not hand-edit. |
| `D:\NextStepStudios\next-step-studios-website\src\data\places-left-behind-categories.json` | The 11 documentation categories and their descriptions. |
| `D:\NextStepStudios\next-step-studios-website\src\data\places-left-behind-docs-source.json` | The recorded source commit, counts, excluded files and source-only links. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\docs\places-left-behind\` | The documentation index and the page for each document. |
| `D:\NextStepStudios\next-step-studios-website\scripts\sync-places-left-behind-docs.mjs` | The read-only importer. |
| `D:\NextStepStudios\next-step-studios-website\src\lib\site.ts` | The shared `SITE` values, including the exact copyright line. |
| `D:\NextStepStudios\next-step-studios-website\src\components\Footer.astro` | The site-wide footer copyright display. |
| `D:\NextStepStudios\next-step-studios-website\src\content\policies\website\copyright.md` | The website copyright and takedown notice. It owns website content only. |
| `D:\NextStepStudios\next-step-studios-website\src\lib\documents.ts` | Headers for downloaded policy documents. |
| `D:\NextStepStudios\next-step-studios-website\scripts\make-pdfs.mjs` | PDF page footers, including the copyright line. |
| `D:\NextStepStudios\next-step-studios-website\scripts\make-policy-zip.mjs` | The combined policy ZIP and its README. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\downloads\print\[slug].astro` | The printable policy edition footer. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\policies\index.astro` | The website and bot policy index, with a link to the separate game documentation section. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\assistant-facts.json.ts` | Step's written answers about the game and policies. |
| `D:\NextStepStudios\next-step-studios-website\src\lib\roadmap.ts` | The Places Left Behind roadmap entry. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\now.astro` | The dated Now page. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\about.astro` | The About page and its studio facts. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\index.astro` | The home-page description and introduction. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\press.astro` | Press boilerplate and quick facts. |
| `D:\NextStepStudios\next-step-studios-website\src\lib\changelog.ts` | Optional: add a changelog line when the page changes materially. |

If you only change pictures or captions, you only need the first two rows.

## Add or replace pictures

### 1. Put the files in the image folder

Use:

`D:\NextStepStudios\next-step-studios-website\public\images\places-left-behind\`

Recommended:

- **Format:** WebP for photographs and screenshots; PNG only where transparency is needed.
- **Width:** 1600–2000px is plenty. The page displays them much smaller.
- **Shape:** 16:9 works best, but the viewer does not crop the picture; it fits the whole image
  inside the frame.
- **Size:** aim for under 300 KB per picture.
- **Names:** lowercase, no spaces, for example `screenshot-01.webp`.
- **Alt text:** describe what the picture actually shows. Do not write “screenshot” if it is
  concept art, and do not label concept art as an in-game capture.

The current pictures are:

```text
D:\NextStepStudios\next-step-studios-website\public\images\project-places-left-behind.webp
D:\NextStepStudios\next-step-studios-website\public\images\places-left-behind\visual-study-02.webp
D:\NextStepStudios\next-step-studios-website\public\images\places-left-behind\visual-study-03.webp
```

They are **concept studies**, not screenshots. The current build does not have publishable
in-game screenshots. Do not relabel them as screenshots.

### 2. List the pictures in the page frontmatter

Open:

`D:\NextStepStudios\next-step-studios-website\src\content\projects\places-left-behind.md`

At the top, between the two `---` lines, the `gallery:` list controls the order. The first entry
is the large picture; the rest are thumbnails. This is the current shape:

```yaml
gallery:
  - src: /images/project-places-left-behind.webp
    alt: Concept study of a glowing blue and violet wireframe mountain on a dark starfield.
    caption: Early concept study 01 — not an in-game screenshot.
    width: 1100
    height: 594
  - src: /images/places-left-behind/visual-study-02.webp
    alt: Concept study of a wireframe mountain valley surrounded by dark, glowing ridges under a starfield.
    caption: Early concept study 02 — not an in-game screenshot.
    width: 1392
    height: 752
  - src: /images/places-left-behind/visual-study-03.webp
    alt: Concept study of a glowing wireframe mountain with a bright cyan route winding up its ridge.
    caption: Early concept study 03 — not an in-game screenshot.
    width: 1392
    height: 752
```

To add a fourth picture, add another block at the end:

```yaml
  - src: /images/places-left-behind/screenshot-01.webp
    alt: A first-person view of an abandoned room, with a document on a desk and a camera in hand.
    caption: Early prototype screenshot, captured from the current build.
    width: 1600
    height: 900
```

Only call it a screenshot when it is actually captured from the prototype.

Rules:

- `src` starts with `/images/` and points at a file inside `public/images/`.
- `alt` is required. It is read by screen readers and shown when the image fails to load.
- `caption` is optional. It appears under the preview and in the larger viewer.
- `width` and `height` are the real pixel dimensions. They stop the page jumping while the image
  loads. If you leave them out, the page assumes `1100 × 594`; that is safe but may be a little
  off for a different shape.
- YAML is indentation-sensitive. Two spaces before `-`, four spaces before each field under it.
- Keep the order you want people to see. The counter follows the list automatically.

### 3. Replace a picture without changing the layout

Replace the file in `public/images/places-left-behind/` but keep the same filename, or update the
`src` line to the new filename. If the new picture has different dimensions, update `width` and
`height` too.

If you remove a gallery entry, the count and thumbnails update automatically. If you remove every
entry, the picture section disappears and the normal cover image is used instead.

## Page text, status and the current facts

The page currently says:

- **Status:** In Development — not released, and no demo is available.
- **Language:** C# and .NET 10.
- **Engine:** custom engine, not Unity, Unreal Engine or Godot.
- **Graphics:** Vulkan.
- **Bindings:** Silk.NET.
- **Assets:** Blender and a glTF 2.0 / GLB pipeline.
- **Current build:** Vulkan swapchain, depth buffering, indexed mesh drawing, shader compilation,
  cube rendering, and first-person camera and player movement.
- **Still to build:** the environment-loading pipeline, investigation and photography mechanics,
  complete locations, saves and much of the gameplay.
- **Pictures:** early concept studies, not in-game screenshots.
- **Release:** no release date, storefront, purchase option or download.
- **Documents:** 43 game documents in a separate section, 11 current, 29 draft or future draft.

The allowed project statuses are:

`In development`, `Prototype`, `Testing`, `Planned`, `On hold`.

Change the status only when it is true:

- `In development` means work has started; the site displays this status as **In Development**.
- `Prototype` means something runnable exists, even if it is rough.
- `Testing` means there is a build being tested.
- `Planned` means it has not started.
- `On hold` means work has paused.

Do not describe planned investigation mechanics, complete locations or other planned systems as
already implemented. Do not invent a release date, trailer, storefront or screenshot.

## What “C#” means

**C# is pronounced “C-sharp”.** The `#` is the musical sharp sign, not a hashtag. There is no
language called “C hashtag”; if someone writes “C hashtag”, they almost certainly mean C#.

C# is a general-purpose programming language developed by Microsoft. It is used for games,
desktop software and web services. Unity is one engine that can use C#, but this game does not use
Unity: it uses a custom engine with Vulkan and Silk.NET.

On this page, **“from scratch”** means the game's code and engine are being written for this
project rather than starting from a ready-made game kit or an existing game engine. Do not add
“Unity”, “Unreal”, “Godot” or another engine unless that becomes true.

## Copyright wording

The exact attribution for original studio-created work is:

> Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.

It is stored once in `SITE.copyright` at `src\lib\site.ts` and displayed in the shared footer.
The Places Left Behind page also includes it in its **Copyright** section. The website copyright
notice, downloaded policy headers, PDF footers, printable editions and the policy ZIP use the same
wording.

Do not apply this attribution to third-party material or community-created work that the studio
does not own. Credit those separately and accurately.

If the year or owner ever changes, update the single `SITE.copyright` value and the copies in the
policy content and document-generation scripts, then regenerate the downloads:

```powershell
npx astro build
npm run pdfs
npm run policies:zip
```

`npm run build` also regenerates the PDFs and policy ZIP, but it runs the full release pipeline.
For a quick check, `npx astro build` is enough.

## The separate documentation section

Places Left Behind does **not** use the website and bot policy system. Its documents live in their
own collection and route at `/docs/places-left-behind`:

- `src\content\places-left-behind-docs\` — the 43 imported Markdown files. These are generated;
  do not hand-edit them.
- `src\data\places-left-behind-categories.json` — the 11 display categories and descriptions.
- `src\data\places-left-behind-docs-source.json` — the source commit, counts, excluded files and
  source-only links.
- `src\lib\placesDocs.ts` — category, status, version, path and count helpers.
- `src\pages\docs\places-left-behind\index.astro` — the documentation index.
- `src\pages\docs\places-left-behind\[slug].astro` — one page for every document.
- `src\components\PlacesDocNotice.astro` — the status notice on each document.
- `scripts\sync-places-left-behind-docs.mjs` — the read-only importer.

The game repository is authoritative. To refresh the website copy:

1. Confirm the documentation itself is committed. The script refuses uncommitted changes under
   `Documentation/`; unrelated source changes are reported but do not block the import.
2. Run:

   ```powershell
   npm run docs:sync -- "C:\Users\Panda\Documents\CustomGames\Places Left Behind"
   ```

3. The script reads Git `HEAD`, requires all 40 licensing Markdown files and the three engineering
   references to be tracked, preserves their wording and rewrites only relative link addresses.
4. It writes the 43 pages and records the commit in the source data file. It never writes to the
   game folder and uses no network or API key.
5. Run `npx astro build` and open `/docs/places-left-behind`.

Do not copy game documents into `src\content\policies\game\`. That policy scope is intentionally
empty; the game's documents are a different collection with different status labels and
navigation. Root `LICENSE` and `LICENSE.md`, the engine and game-scope licence notices,
`THIRD-PARTY-NOTICES.txt`, the game repository README and asset-folder notes are not separate
entries. Their links return to the source-files note on the documentation index.

The website is a snapshot, not a live mirror: the game repository is private and the public site
has no credentials to read it. Keeping it current means running the sync deliberately. No
scheduled CI job is configured, and none can read the private repository without a separate
credential and checkout.

## Test the page

From `D:\NextStepStudios\next-step-studios-website`:

```powershell
npx astro dev
```

Open `http://127.0.0.1:4321/projects/places-left-behind/`.

Check:

- The gallery is directly under the title, before the written sections.
- The large picture loads.
- The `1 / N` count matches the number of gallery entries.
- Previous/next buttons and thumbnails move through the set.
- Clicking the preview opens the larger viewer.
- Escape, the close button and the backdrop close it.
- The caption changes with the picture.
- The thumbnails are square and compact at desktop, tablet and mobile widths.
- The copyright block at the bottom is exact.
- `/policies` shows the website and bot scopes and links to the separate game section.
- `/docs/places-left-behind` lists all 43 documents and every document page opens.
- The draft and future-draft notices are visible; nothing is presented as legally reviewed.
- `/projects/first-game/` redirects to `/projects/places-left-behind/`.

Then build:

```powershell
npx astro build
```

The site builds into `dist/`. The build must finish with no errors. `npx astro build` is preferred
for a quick check because `npm run build` also regenerates PDFs and ZIPs with fresh timestamps.

## Accessibility notes

- Write real alt text for every picture. The thumbnail has an empty alt because the link already
  names the picture; the large image carries the description.
- The larger viewer is a native `<dialog>`, so Escape and focus handling are built in.
- The previous/next and close controls are at least 44px on touch screens.
- The counter and captions update as you move; the counter is announced politely.
- Do not remove the `aria-label` values on the controls.

## Troubleshooting

**The gallery is missing.** Check that `gallery:` is inside the frontmatter, not in the Markdown
body, and that it has at least one entry with the correct indentation.

**A picture is broken.** Check that the file exists in `public/images/places-left-behind/` and the
`src` starts with `/images/`. Paths are case-sensitive on the deployed site.

**The count is wrong.** Count the `- src:` entries. The number is generated from that list; do not
edit `1 / 3` in the HTML, because it is replaced by the script.

**The larger viewer does not open.** The preview is also a normal link, so it opens the image
directly if JavaScript is off. With JavaScript on, clicking it should open the dialog. Check the
 browser console for an error.

**The page still shows an old picture.** Hard-refresh, or check that you edited
`src/content/projects/places-left-behind.md` and not the built copy in `dist/`. The source is in
`src/`.

**The old project address now redirects.** That is intentional. The page moved from
`/projects/first-game/` to `/projects/places-left-behind/`; the redirect is in `astro.config.mjs`.

## Other places that mention the game

If the game's facts or status change, keep these in step:

- `src\content\projects\places-left-behind.md` — the page itself
- `src\lib\roadmap.ts` — the Places Left Behind roadmap entry
- `src\pages\now.astro` — the dated Now page
- `src\pages\about.astro` — the About page and its fact table
- `src\pages\index.astro` — the home-page description and lede
- `src\pages\press.astro` — press quick facts and boilerplate
- `src\pages\assistant-facts.json.ts` — Step's answers
- `src\lib\assistant.ts` — Step's page starter questions
- `src\lib\changelog.ts` — optional release note
- `src\pages\policies\index.astro` — the link to the separate game documentation
- `src\pages\docs\places-left-behind\` — the documentation index and pages
- `src\data\places-left-behind-categories.json` — category names and descriptions
- `src\lib\site.ts` — the shared copyright line

Do not describe the game as released, finished, commercially available or using an engine it does
not use. Do not publish a game policy as effective until the actual document exists and has been
reviewed.
