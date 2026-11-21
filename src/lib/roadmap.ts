/**
 * The roadmap. Statuses, not dates: a date would be a promise this practice
 * cannot keep, and the point of the page is to be trustworthy.
 */

export type RoadmapStatus = 'In development' | 'Draft' | 'Planned' | 'Live' | 'Not planned';

export type RoadmapItem = {
  title: string;
  status: RoadmapStatus;
  summary: string;
  points: string[];
  link?: { href: string; label: string };
};

export const ROADMAP_INTRO =
  'What is being worked on, what is only an intention, and what has been decided against. Nothing here has a date, because a date would be a guess dressed as a commitment.';

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
    title: 'Public documentation',
    status: 'Draft',
    summary:
      'Seven policy documents at version 0.2.0, published in full on this site, downloadable as files, and mirrored to a public GitHub repository.',
    points: [
      'Published: privacy, terms, acceptable use, community guidelines, moderation, data retention, security.',
      'Missing: legal review. That is why they are drafts rather than a 1.0.',
      'Every document is versioned, and the GitHub mirror makes each change visible.',
    ],
    link: { href: '/policies', label: 'Read the documents' },
  },
  {
    title: 'This website',
    status: 'Live',
    summary:
      'A static site with no accounts, no analytics and no third-party requests. It is the stable address for the studio, its work and its documents.',
    points: [
      'Done: full-text search, command reference, document exports, devlog and policy tooling.',
      'Done: every document readable, printable, downloadable and mirrored to GitHub.',
      'Next: keep it current as the bot changes.',
    ],
    link: { href: '/changelog', label: 'What changed, and when' },
  },
  {
    title: 'Games',
    status: 'Planned',
    summary:
      'Games are the direction the studio is heading in. There is no title to announce, no engine chosen and no date — saying otherwise would be inventing a project.',
    points: [
      'No game has been started.',
      'When one exists, it will get a project entry with the same honesty rules as the bot: Planned until it is real.',
    ],
    link: { href: '/projects', label: 'Projects' },
  },
  {
    title: 'Studio tools',
    status: 'Planned',
    summary:
      'Small software tools of the kind this studio would use itself. The category is real; the products are not.',
    points: [
      'No tool has been started.',
      'The planned entries on the projects page are placeholders for the category, not for a specific product.',
    ],
    link: { href: '/projects', label: 'Projects' },
  },
  {
    title: 'A light theme',
    status: 'Not planned',
    summary:
      'Tested and rejected. The site is art-directed dark, with one palette and no toggle to get out of sync.',
    points: [
      'A second palette would double the contrast surface to maintain.',
      'The dark design is not a default — it is the design.',
    ],
  },
  {
    title: 'Analytics and accounts',
    status: 'Not planned',
    summary:
      'Not now, and not quietly later. The privacy notice says none of this exists, and that has to stay true.',
    points: [
      'No analytics, no cookies, no accounts, no advertising.',
      'If that ever changes, the notice changes first and the claim is removed before the feature ships.',
    ],
    link: { href: '/website-privacy', label: 'Website privacy notice' },
  },
];
