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
