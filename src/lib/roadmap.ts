/**
 * The roadmap. Statuses, not dates: a date would be a promise this practice
 * cannot keep, and the point of the page is to be trustworthy.
 */

export type RoadmapStatus = 'In development' | 'Prototype' | 'Draft' | 'Planned' | 'Live' | 'Not planned';

export type RoadmapItem = {
  title: string;
  status: RoadmapStatus;
  summary: string;
  points: string[];
  link?: { href: string; label: string };
};

export const ROADMAP_INTRO =
  'What is being built, what is planned, and what is already live. Nothing here has a date, because a date would be a guess dressed as a commitment.';

export const ROADMAP: RoadmapItem[] = [
  {
    title: 'Next Step Bot',
    status: 'In development',
    summary:
      'The private Discord bot for the community server. Most of its surface exists in source; the release checklist is the thing standing between that and a release.',
    points: [
      'Ticket lifecycle, application review, staff profiles and suggestions exist in source.',
      'Transcript generation is written but has not been verified end to end.',
      'The release-readiness checklist is mostly unticked, and the project page says which items are open.',
    ],
    link: { href: '/projects/next-step-bot', label: 'Project state and module register' },
  },
  {
    title: 'Places Left Behind',
    status: 'In development',
    summary:
      'An independently developed first-person 3D exploration and mystery game, being built from scratch in C# with a custom Vulkan and Silk.NET engine. It is in development, not released.',
    points: [
      'The current build has a Vulkan swapchain, depth buffering, indexed mesh drawing, shader compilation, cube rendering and first-person camera and player movement.',
      'The environment-loading pipeline, investigation and photography mechanics, complete locations, saves and much of the gameplay remain to be built.',
      'The project page shows early concept studies, not in-game screenshots. No release date or storefront is promised.',
      '43 licensing, policy and engineering documents are published in their own section: 11 current, 29 draft or future draft, and 3 engineering references. None of the custom agreements has been reviewed by a lawyer.',
    ],
    link: { href: '/projects/places-left-behind', label: 'The game project' },
  },
  {
    title: 'Bot status feed',
    status: 'In development',
    summary:
      'The status page is built, but the bot\u2019s JSON publisher is not running yet. Until it does, the page shows the copy built with the site and no live history.',
    points: [
      'The page has a layout ready for current state, response time and a 24-hour strip of five-minute checks.',
      'If the feed cannot be read, the page says so and falls back to the copy built with the site.',
      'The publisher needs a GitHub token; until it runs, no live history is presented rather than inventing one.',
    ],
    link: { href: '/status', label: 'The status page' },
  },
  {
    title: 'Public documentation',
    status: 'Draft',
    summary:
      'Eleven policy documents in two published scopes \u2014 seven for the Discord bot and four for this website \u2014 published in full on this site, downloadable as files, with the bot set mirrored to a public GitHub repository.',
    points: [
      'Bot set: privacy, terms, acceptable use, community guidelines, moderation, data retention and security, all drafts for review.',
      'Website set: privacy and security are current; terms and copyright remain drafts for review.',
      'Missing: legal review. That is why the draft documents are drafts rather than a 1.0.',
      'Every document is versioned, and the GitHub mirror makes each bot-document change visible.',
      'Places Left Behind\u2019s documents are not part of this policy set; they now sit inside the game\u2019s roadmap entry.',
    ],
    link: { href: '/policies', label: 'Read the documents' },
  },
  {
    title: 'Studio tools',
    status: 'Planned',
    summary:
      'Small software tools of the kind this studio would use itself. The category is real; the products are not, and nothing is planned for the near future.',
    points: [
      'No tool has been started.',
      'The planned entries on the projects page are placeholders for the category, not for a specific product.',
      'There is no timeframe and no repository.',
    ],
    link: { href: '/projects', label: 'Projects' },
  },
  {
    title: 'Analytics and accounts',
    status: 'Planned',
    summary:
      'Planned eventually, but not anytime soon. No analytics, cookies, accounts or advertising exist today, and the website privacy notice must change before any of it ships.',
    points: [
      'No analytics, no cookies, no accounts, no advertising exist today.',
      'If that ever changes, the privacy notice changes first and the claim is removed before the feature ships.',
      'There is no timeframe; this is an intention, not scheduled work.',
    ],
    link: { href: '/policies/website/privacy', label: 'Website privacy notice' },
  },
  {
    title: 'This website',
    status: 'Live',
    summary:
      'A static site with no accounts and no analytics. Its one third-party request is the status page reading the bot\u2019s feed from GitHub. It is the stable address for the studio, its work and its documents.',
    points: [
      'Done: full-text search, command reference, document exports, devlog and policy tooling.',
      'Done: every document readable, printable, downloadable and mirrored to GitHub.',
      'Done: transparent marks, a permanent brand archive, a ZIP of every asset and a status page that falls back honestly when the feed is absent.',
      'Done: a light theme with a manual toggle; dark remains the default and the choice is stored in the browser only.',
      'Next: keep it current as the bot changes.',
    ],
    link: { href: '/changelog', label: 'What changed, and when' },
  },
];
