# Places Left Behind page — how to edit it

This guide covers the **Places Left Behind** project page, its picture gallery, its copyright
line and its separate policy scope. It is kept separate from the main editing guide so the game
page can grow without making the whole site manual harder to use.

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
5. Run `npx astro build` before publishing.

The page counts the pictures automatically. Do not edit the `1 / 3` counter by hand.

## Where the pictures appear now

The picture gallery is the **first block under the project title and status row**, before the
written sections. There is no separate “A closer look” heading any more. The first picture is the
large image; the thumbnails and the `1 / N` counter sit underneath it.

The gallery gives visitors:

- a large view of the selected picture;
- previous and next buttons when there is more than one picture;
- a thumbnail for each picture, in order;
- a `1 / 3` counter under the set;
- a **Full screen** view when the large picture is clicked;
- arrow-key movement and Escape to close in the full-screen viewer;
- focus returning to the gallery when the viewer closes.

It works without a third-party image service. The pictures are ordinary files in this project.

## Files you will edit

All paths are complete Windows paths.

| File | What it is for |
| --- | --- |
| `D:\NextStepStudios\next-step-studios-website\src\content\projects\places-left-behind.md` | The page text, status, cover, gallery list and copyright block. This is the normal file to edit. |
| `D:\NextStepStudios\next-step-studios-website\public\images\places-left-behind\` | Put gallery image files here. The folder already exists. |
| `D:\NextStepStudios\next-step-studios-website\src\content.config.ts` | Defines the allowed `gallery:` shape. Usually you do not need to change it. |
| `D:\NextStepStudios\next-step-studios-website\src\components\ProjectGallery.astro` | The gallery component: pictures, thumbnails, arrows, counter and full-screen dialog. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\projects\[slug].astro` | The project page template that places the gallery directly under the title. |
| `D:\NextStepStudios\next-step-studios-website\src\lib\site.ts` | The shared `SITE` values, including the exact copyright line. |
| `D:\NextStepStudios\next-step-studios-website\src\components\Footer.astro` | The site-wide footer copyright display. |
| `D:\NextStepStudios\next-step-studios-website\src\content\policies\website\copyright.md` | The website copyright and takedown notice. It owns website content only. |
| `D:\NextStepStudios\next-step-studios-website\src\lib\documents.ts` | Headers for downloaded policy documents. |
| `D:\NextStepStudios\next-step-studios-website\scripts\make-pdfs.mjs` | PDF page footers, including the copyright line. |
| `D:\NextStepStudios\next-step-studios-website\scripts\make-policy-zip.mjs` | The combined policy ZIP and its README. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\downloads\print\[slug].astro` | The printable policy edition footer. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\policies\index.astro` | The policy index, including the Places Left Behind game scope in preparation. |
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

They are **concept studies**, not screenshots. The current early prototype does not have
publishable in-game screenshots. Do not relabel them as screenshots.

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
- `caption` is optional. It appears under the large picture and in full screen.
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

- **Status:** Prototype — an early prototype, not a finished game.
- **Language:** C# and .NET 10.
- **Engine:** custom engine, not Unity, Unreal Engine or Godot.
- **Graphics:** Vulkan.
- **Bindings:** Silk.NET.
- **Assets:** Blender and a glTF 2.0 / GLB pipeline.
- **Current build:** WASD movement and mouse camera control; basic engine, windowing, Vulkan
  initialization, input, scene, entity, transform and player foundations.
- **Still under development:** the environment-loading pipeline, full rendering system,
  investigation mechanics, complete locations and much of the gameplay.
- **Pictures:** early concept studies, not in-game screenshots.
- **Release:** no release date or storefront commitment.

The allowed project statuses are:

`In development`, `Prototype`, `Testing`, `Planned`, `On hold`.

Change the status only when it is true:

- `In development` means work has started.
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

## The separate game policy scope

Places Left Behind has a **separate game policy scope** in the publishing system. It is deliberately
empty today:

- The website keeps its own four website documents.
- The Discord bot keeps its own seven bot documents.
- The game scope is shown on `/policies` as **in preparation**.
- No game EULA, licence, privacy notice or prototype agreement is published or presented as
  effective until the real document exists in the Places Left Behind repository.

The scope is supported in:

- `src\lib\documents.ts` — `PolicyScope`, labels, descriptions and paths.
- `src\pages\policies\index.astro` — published scopes versus scopes in preparation.
- `src\pages\policies\[scope]\[slug].astro` — detail pages and game-only notices.
- `src\pages\data\policies.json.ts` and the RSS feed.
- `src\pages\downloads\index.astro`, `src\lib\downloads.ts` and the generated document headers.
- `scripts\make-pdfs.mjs`, `scripts\make-policy-zip.mjs` and `scripts\snapshot-policies.mjs`.

When the actual game documents are ready:

1. Put them under `src\content\policies\game\` using the existing policy frontmatter shape.
2. Give each one a version and a `docStatus`; do not call a draft effective.
3. Use `Places Left Behind` as the scope, not `Website` or `Discord bot`.
4. Run `npm run snapshot` to record the versions.
5. Run `npm run pdfs`, `npm run policies:zip` and then the build.
6. Check `/policies` — the game scope should become a published scope automatically; it should no
   longer be described as “in preparation”.
7. Check that the game privacy notice is clearly separate from the website privacy notice, and the
   game EULA is clearly separate from the website Terms of Use.

Do not merge the game documents into the website set, and do not copy website rules into the game
scope. The game's copyright and takedown process should be coordinated with the studio's existing
process, but the documents remain separate.

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
- Clicking the large picture opens the full-screen viewer.
- Escape, the close button and the backdrop close it.
- The caption changes with the picture.
- A narrow window still scrolls the thumbnails sideways instead of breaking the page.
- The copyright block at the bottom is exact.
- `/policies` shows the website and bot scopes and the game scope in preparation.
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
- The full-screen viewer is a native `<dialog>`, so Escape and focus handling are built in.
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

**The full-screen viewer does not open.** The large picture is also a normal link, so it opens the
image directly if JavaScript is off. With JavaScript on, clicking it should open the dialog. Check
the browser console for an error.

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
- `src\pages\policies\index.astro` — the game policy scope in preparation
- `src\lib\site.ts` — the shared copyright line

Do not describe the game as released, finished, commercially available or using an engine it does
not use. Do not publish a game policy as effective until the actual document exists and has been
reviewed.
