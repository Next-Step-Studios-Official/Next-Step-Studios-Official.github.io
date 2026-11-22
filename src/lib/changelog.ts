/**
 * A changelog for the website itself. Dates are real build dates; versions are
 * this site's own, not the bot's.
 */

export type ChangelogEntry = {
  date: string;
  version: string;
  title: string;
  summary: string;
  changes: string[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-11-22',
    version: '3.1',
    title: 'The local guide edition',
    summary:
      'Step becomes easier to use and easier to understand: follow-ups, a topic menu, page-aware starters, copyable answers, a guide page and a home-page demo. Search gains typo suggestions, policy pages gain plain-language summaries, and the complete policy set gains a ZIP.',
    changes: [
      'Step now offers up to three curated follow-up questions after an answer, with a Topics menu for browsing the full range.',
      'Starter questions change with the page: commands on the command reference, policies on a policy page, and the studio basics elsewhere.',
      'Answers have a Copy button, and Step controls and message text are larger and easier to tap.',
      'A new /step page explains what Step can answer, how matching works, and why there is no model, API, account or stored conversation.',
      'The home page has a Step demo that opens the panel with a sample question, and the guide is linked from the footer, search and command palette.',
      'Search suggests a corrected phrase when a query has no matches, with a one-click retry.',
      'All seven policy pages now start with a plain-language summary, and the policy index links to it.',
      'The complete policy set is downloadable as one ZIP containing every Markdown document, a combined file and a README.',
      'Mobile spacing between Step and the home-page system panel is corrected.',
    ],
  },
  {
    date: '2026-11-21',
    version: '3.0',
    title: 'The live edition',
    summary:
      'The mark becomes transparent at four sizes in three formats, the archive gets its own page and a ZIP, the status page reads checks the bot publishes, and the studio is described as five people.',
    changes: [
      'Logo cut out from the outside in: transparent PNG and SVG at 1024, 512, 256 and 128, plus JPG and a light treatment for dark surfaces.',
      'Transparent favicons and Apple touch icon; the old white-tile artwork is kept only as a labelled archive copy.',
      'A standalone /archive page with every current and retired mark, and one ZIP containing the whole brand kit.',
      'A live /status page: current state, response time, version, a 24-hour strip and incidents, read from a JSON feed the bot publishes.',
      'The studio is described as five people; four contributor placeholders sit alongside Candler Shaw, and the About page has a contact block under its facts.',
      'The social page is removed. Official links is the single list, and /social redirects there.',
      'Module register corrected to 23 modules and 51 commands, with Platform, Reminders and Welcome removed; /help is listed as planned.',
    ],
  },
  {
    date: '2026-11-21',
    version: '2.1',
    title: 'The archive edition',
    summary:
      'The reference becomes an archive: 27 module pages, recorded policy versions with diffs, a press kit that keeps retired marks, and a trust centre to hold it together.',
    changes: [
      'A page for each of the 27 bot modules, with commands, data touchpoints and governing policies.',
      'Policy version history: every document now records a snapshot and shows a diff when the text moves.',
      'Trust centre, glossary, press kit and brand guidelines.',
      'Logos supplied as PNG, JPG, WebP and an embedded-raster SVG, with a permanent archive for retired marks.',
      'Per-page Open Graph cards, FAQ and Article structured data, and a human sitemap.',
      'Reading controls, copy-link headings, a keyboard shortcut reference and site-wide print styles.',
      'Public JSON for commands, policies, projects and modules; a policy RSS feed.',
      'Latin-only font subsets, generated hero artwork and project covers.',
      'A printable command cheatsheet PDF.',
    ],
  },
  {
    date: '2026-11-21',
    version: '2.0',
    title: 'The reference edition',
    summary:
      'The site grows from a set of pages into a reference: every command, every document in four formats, and search that covers the actual text.',
    changes: [
      'Full command reference for all 51 slash commands, read from the bot’s cogs.',
      'Full-text search across policies, devlog and project pages, with a dedicated search page.',
      'Policy documents in Markdown, plain text, print layout and PDF, plus one combined file.',
      'New pages: roadmap, FAQ, changelog, status and stack.',
      'Studio logo integrated as the brand mark, favicon and social card.',
      'Devlog tags, series grouping and an RSS feed.',
      'Structured data, sitemap, robots and Open Graph metadata.',
      'Accessibility pass: contrast, focus, landmarks and keyboard operability.',
    ],
  },
  {
    date: '2026-11-21',
    version: '1.2',
    title: 'Every document, twice',
    summary:
      'The policies became downloadable files as well as pages, and the public copies were mirrored to GitHub so the record is not only on this site.',
    changes: [
      'Downloads index and a Markdown file for each of the seven documents.',
      'GitHub mirror of the public documents, linked from every policy page.',
      'Link and social pages rebuilt around real, verified accounts.',
      'A quiet design pass over the whole site: fewer colours, tighter type, no utility CSS framework.',
    ],
  },
  {
    date: '2026-11-19',
    version: '1.0',
    title: 'First public build',
    summary:
      'The studio had no website, which meant there was no single place to point at. This was the first answer to that.',
    changes: [
      'Home, projects, devlog, about, contact and policies.',
      'The seven draft policy documents in full.',
      'Static output: no accounts, no analytics, no third-party requests.',
      'Command palette, reduced-motion support and keyboard navigation from the first version.',
    ],
  },
];
