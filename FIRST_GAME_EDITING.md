# First Game page — how to edit it

This guide is only about the **First Game** project page and its picture gallery. It is kept
separate from the main editing guide so the game page can grow without making the site guide
harder to use.

- Public page: `https://next-step-studios-official.github.io/projects/first-game/`
- Main content file: `D:\NextStepStudios\next-step-studios-website\src\content\projects\first-game.md`
- Last updated: 24 November 2026

## The short version

1. Put new pictures in `D:\NextStepStudios\next-step-studios-website\public\images\first-game\`.
2. Open `src\content\projects\first-game.md`.
3. Add one block per picture under `gallery:` in the frontmatter.
4. Run `npx astro dev` and open `/projects/first-game/` to check it.
5. Run `npx astro build` before publishing.

The page counts the pictures automatically, so you do not edit the counter by hand.

## What the gallery does

The gallery is the picture section below the written part of the First Game page. It gives
visitors:

- a large view of the selected picture;
- previous and next buttons when there is more than one picture;
- a thumbnail for each picture, in order;
- a `1 / 3` counter under the set;
- a **Full screen** view when the large picture is clicked;
- arrow-key movement and Escape to close in the full-screen viewer.

It works without a third-party image service. The pictures are ordinary files in this project.

## Files you will edit

All paths are complete Windows paths.

| File | What it is for |
| --- | --- |
| `D:\NextStepStudios\next-step-studios-website\src\content\projects\first-game.md` | The page text, status, cover and the list of gallery pictures. This is the normal file to edit. |
| `D:\NextStepStudios\next-step-studios-website\public\images\first-game\` | Put the gallery image files here. The folder already exists. |
| `D:\NextStepStudios\next-step-studios-website\src\content.config.ts` | Defines the allowed `gallery:` shape. Usually you do not need to change it. |
| `D:\NextStepStudios\next-step-studios-website\src\components\ProjectGallery.astro` | The gallery component: thumbnails, arrows, counter and full-screen dialog. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\projects\[slug].astro` | The project page template that places the gallery after the page text. |
| `D:\NextStepStudios\next-step-studios-website\src\lib\changelog.ts` | Optional: add a changelog line when the page changes materially. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\assistant-facts.json.ts` | Step's written answers. Update this if the game's status or facts change. |
| `D:\NextStepStudios\next-step-studios-website\src\lib\roadmap.ts` | The Games entry on the roadmap. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\now.astro` | The dated Now page. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\about.astro` | The About page's studio facts and "where it's going" copy. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\index.astro` | The home-page description and introduction. |
| `D:\NextStepStudios\next-step-studios-website\src\pages\press.astro` | Press boilerplate and quick facts. |

If you only change pictures or captions, you only need the first two rows.

## Add or replace pictures

### 1. Put the files in the image folder

Use:

`D:\NextStepStudios\next-step-studios-website\public\images\first-game\`

Recommended:

- **Format:** WebP for photographs and screenshots; PNG only where transparency is needed.
- **Width:** 1600–2000px is plenty. The page displays them much smaller.
- **Shape:** 16:9 works best, but the viewer does not crop the picture; it fits the whole
  image inside the frame.
- **Size:** aim for under 300 KB per picture.
- **Names:** lowercase, no spaces, for example `screenshot-01.webp`.
- **Alt text:** describe what the picture actually shows. Do not write "screenshot" if it is
  concept art.

The two current visual studies live at:

```text
D:\NextStepStudios\next-step-studios-website\public\images\first-game\visual-study-02.webp
D:\NextStepStudios\next-step-studios-website\public\images\first-game\visual-study-03.webp
```

The first picture is the existing cover at:

```text
D:\NextStepStudios\next-step-studios-website\public\images\project-first-game.webp
```

### 2. List the pictures in the page frontmatter

Open:

`D:\NextStepStudios\next-step-studios-website\src\content\projects\first-game.md`

At the top, between the two `---` lines, the `gallery:` list controls the order. The first
entry is the large picture; the rest are thumbnails. This is the current shape:

```yaml
gallery:
  - src: /images/project-first-game.webp
    alt: Concept art of a glowing blue and violet wireframe mountain on a dark starfield.
    caption: Visual study 01 — the current cover image. Concept art, not a gameplay screenshot.
    width: 1100
    height: 594
  - src: /images/first-game/visual-study-02.webp
    alt: Concept art of a wireframe mountain valley surrounded by dark, glowing mountain ridges under a starfield.
    caption: Visual study 02 — a wider pass over the same wireframe landscape. Concept art, not a gameplay screenshot.
    width: 1392
    height: 752
```

To add a fourth picture, add another block at the end:

```yaml
  - src: /images/first-game/screenshot-01.webp
    alt: The player character standing on a ridge at dusk, with the route ahead visible.
    caption: First playable screenshot. Replaces a visual study when a build is ready.
    width: 1600
    height: 900
```

Rules:

- `src` starts with `/images/` and points at a file inside `public/images/`.
- `alt` is required. It is read by screen readers and shown when the image fails to load.
- `caption` is optional. It appears under the large picture and in full screen.
- `width` and `height` are the real pixel dimensions. They stop the page jumping while the
  image loads. If you leave them out, the page assumes `1100 × 594`; that is safe but may be
  a little off for a different shape.
- YAML is indentation-sensitive. Two spaces before `-`, four spaces before each field under it.
- Keep the order you want people to see. The counter follows the list automatically.

### 3. Replace a picture without changing the layout

Replace the file in `public/images/first-game/` but keep the same filename, or update the
`src` line to the new filename. If the new picture has different dimensions, update `width`
and `height` too.

If you remove a gallery entry, the count and thumbnails update automatically. If you remove
every entry, the picture section disappears from the project page.

## The page text and status

The First Game page currently says:

- **Status:** In development
- **Language:** C#
- **Built:** from scratch, not from a ready-made game template
- **Still open:** title, genre, art direction, platforms and release date
- **Pictures:** early visual studies, not screenshots of a playable build

The allowed project statuses are:

`In development`, `Prototype`, `Testing`, `Planned`, `On hold`.

Change the status only when it is true:

- `In development` means work has started.
- `Prototype` means something runnable exists, even if it is rough.
- `Testing` means there is a build being tested.
- `Planned` means it has not started.
- `On hold` means work has paused.

The current page deliberately does **not** claim a release date or a finished game. Keep that
honesty when adding copy.

## What “C#” means

**C# is pronounced “C-sharp”.** The `#` is the musical sharp sign, not a hashtag. There is no
language called “C hashtag”; if someone writes “C hashtag”, they almost certainly mean C#.

C# is a general-purpose programming language developed by Microsoft. It is used for games,
desktop software and web services. It is often used with game engines such as Unity, but the
language and the engine are separate choices.

On this page, **“from scratch”** means the game's code is being written for this project
rather than starting from a ready-made game kit or template. The page does not name an engine;
do not add “Unity”, “Unreal” or another engine unless that becomes true.

## Test the page

From `D:\NextStepStudios\next-step-studios-website`:

```powershell
npx astro dev
```

Open `http://127.0.0.1:4321/projects/first-game/`.

Check:

- The large picture loads.
- The `1 / N` count matches the number of gallery entries.
- Previous/next buttons and thumbnails move through the set.
- Clicking the large picture opens the full-screen viewer.
- Escape and the close button close it.
- The caption changes with the picture.
- A narrow window still scrolls the thumbnails sideways instead of breaking the page.

Then build:

```powershell
npx astro build
```

The site builds into `dist/`. The build must finish with no errors. `npx astro build` is
preferred here because `npm run build` also regenerates PDFs and ZIPs with fresh timestamps.

## Accessibility notes

- Write real alt text for every picture. The thumbnail has an empty alt because the button
  already names the picture; the large image carries the description.
- The full-screen viewer is a native `<dialog>`, so Escape and focus handling are built in.
- The previous/next and close controls are at least 44px on touch screens.
- The counter and captions update as you move; the counter is announced politely.
- Do not remove the `aria-label` values on the controls.

## Troubleshooting

**The picture section is missing.**
Check that `gallery:` is inside the frontmatter, not in the Markdown body, and that it has at
least one entry with the correct indentation.

**A picture is broken.**
Check that the file exists in `public/images/...` and the `src` starts with `/images/`. Paths
are case-sensitive on the deployed site.

**The count is wrong.**
Count the `- src:` entries. The number is generated from that list; do not edit `1 / 3` in
the HTML, because it is replaced by the script.

**The full-screen viewer does not open.**
The large picture is also a normal link, so it opens the image directly if JavaScript is off.
With JavaScript on, clicking it should open the dialog. Check the browser console for an error.

**The page still shows an old picture.**
Hard-refresh, or check that you edited `src/content/projects/first-game.md` and not the built
copy in `dist/`. The source is in `src/`.

## Other places that mention the game

If the game's status changes, keep these in step:

- `src\content\projects\first-game.md` — the page itself
- `src\lib\roadmap.ts` — the Games / First Game entry
- `src\pages\now.astro` — the dated Now page
- `src\pages\about.astro` — the About page and its fact table
- `src\pages\index.astro` — the home-page description and lede
- `src\pages\press.astro` — press quick facts and boilerplate
- `src\pages\assistant-facts.json.ts` — Step's answers
- `src\lib\assistant.ts` — Step's page starter questions
- `src\lib\changelog.ts` — optional release note

Do not describe the game as released, playable or finished until there is a build you can
actually run and test.
