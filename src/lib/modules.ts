/**
 * The Discord bot's modules, read from its source tree and updated from what
 * the studio has actually confirmed about each one.
 *
 * Source: D:\\NextStepStudios\\DiscordBots\\PrivateBots\\NextStepStudioBot\\bot\\cogs
 *
 * Status vocabulary — deliberately separate from the project statuses on the
 * website, because a module existing as files is not the same as a feature
 * being verified in the server:
 *
 *   tested            Working in the server, with behaviour confirmed.
 *   testing           Working, but still being tested.
 *   wip               Work in progress. It runs, but not well enough to call done.
 *   planned           Intended, but not a working feature yet.
 *   not-implemented   The files exist but there is nothing in them.
 *
 * Nothing is marked tested unless the studio has said so. Where a module was
 * not discussed, it stays at `testing` rather than borrowing a stronger claim.
 */

export type ModuleStatus = 'tested' | 'testing' | 'wip' | 'planned' | 'not-implemented';

export type BotModule = {
  id: string;
  name: string;
  group: string;
  summary: string;
  status: ModuleStatus;
  /** Command names exactly as they appear in the source, where defined. */
  commands?: string[];
  /** A caveat worth showing next to the status. */
  note?: string;
};

export const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  tested: 'Working · tested',
  testing: 'Working · in testing',
  wip: 'Work in progress',
  planned: 'Planned',
  'not-implemented': 'Not implemented',
};

export const MODULE_STATUS_CLASS: Record<ModuleStatus, string> = {
  tested: 'status status--testing',
  testing: 'status status--dev',
  wip: 'status status--draft',
  planned: 'status status--planned',
  'not-implemented': 'status status--planned',
};

export const MODULE_STATUS_NOTE: Record<ModuleStatus, string> = {
  tested: 'Exercised in the server and confirmed working.',
  testing: 'It works, but testing is not finished.',
  wip: 'Built far enough to run, not far enough to call finished.',
  planned: 'Intended. Not a working feature yet.',
  'not-implemented': 'Files exist, but they contain nothing usable.',
};

export const MODULE_GROUPS = [
  'Community operations',
  'Moderation and roles',
  'Utilities',
  'Entertainment',
] as const;

export const BOT_MODULES: BotModule[] = [
  // ---------------------------------------------------------------- community
  {
    id: 'tickets',
    name: 'Support tickets',
    group: 'Community operations',
    summary:
      'Turns support conversations into private ticket channels with claim, waiting, ready and close states, reopening and escalation. Working in the server and still in testing; transcript generation has not been verified end to end.',
    status: 'testing',
    commands: [
      '/ticket-panel',
      '/create',
      '/ticket-claim',
      '/ticket-unclaim',
      '/ticket-waiting',
      '/ticket-ready',
      '/ticket-close',
      '/ticket-close-now',
      '/ticket-reopen',
      '/ticket-transcript',
      '/escalate',
      '/reset-counter',
    ],
    note: 'Transcripts unverified',
  },
  {
    id: 'applications',
    name: 'Applications and staff review',
    group: 'Community operations',
    summary:
      'Application forms, review decisions, interview scheduling, staff profiles and an audit trail, with owner-confirmed clean-up and reset commands. Working, and still in testing.',
    status: 'testing',
    commands: [
      '/status',
      '/list',
      '/audit',
      '/cleanup',
      '/reset',
      '/interview_request',
      '/interview_confirm',
      '/interview_publish_slot',
      '/staff_profile',
      '/staff_profile_delete',
    ],
  },
  {
    id: 'announcements',
    name: 'Announcements',
    group: 'Community operations',
    summary:
      'A staff announcement composer with modals and a published embed.',
    status: 'tested',
    commands: ['/announce'],
  },
  {
    id: 'loa',
    name: 'Leave of absence',
    group: 'Community operations',
    summary:
      'Staff leave requests with eligibility rules, lifecycle handling, permissions and storage. The workflow runs, but the studio describes it as not great yet.',
    status: 'wip',
  },

  // ------------------------------------------------------------- moderation
  {
    id: 'moderation',
    name: 'Moderation and infractions',
    group: 'Moderation and roles',
    summary:
      'Moderation actions and infraction records. Planned, with no working behaviour claimed on this site.',
    status: 'planned',
  },
  {
    id: 'appeals',
    name: 'Ban appeals',
    group: 'Moderation and roles',
    summary: 'An appeal route for moderation decisions. Planned.',
    status: 'planned',
  },
  {
    id: 'roles',
    name: 'Role management',
    group: 'Moderation and roles',
    summary:
      'Role controls including reaction roles, kept separate from day-to-day moderation. Planned.',
    status: 'planned',
  },
  {
    id: 'logging',
    name: 'Logging and diagnostics',
    group: 'Moderation and roles',
    summary:
      'Server logging plus developer diagnostics used while testing the bot locally. Planned.',
    status: 'planned',
  },

  // -------------------------------------------------------------- utilities
  {
    id: 'links',
    name: 'Official links',
    group: 'Utilities',
    summary:
      'The panel behind the website’s /links page: one config file defines every section and entry, and the command publishes an embed plus a dropdown.',
    status: 'tested',
    commands: ['/links'],
  },
  {
    id: 'rules',
    name: 'Rules',
    group: 'Utilities',
    summary: 'Publishes the server rules from configuration.',
    status: 'testing',
    commands: ['/rules'],
  },
  {
    id: 'faq',
    name: 'FAQ',
    group: 'Utilities',
    summary:
      'Questions for staff and members, with their own data, views and error handling. The studio reports it as done, and questions can be suggested.',
    status: 'tested',
  },
  {
    id: 'suggestions',
    name: 'Suggestions',
    group: 'Utilities',
    summary:
      'Member suggestions with staff search, status changes and record clean-up.',
    status: 'tested',
    commands: ['/suggest', '/suggestion-search', '/suggestion-status', '/suggestion-cleanup'],
  },
  {
    id: 'giveaways',
    name: 'Giveaways',
    group: 'Utilities',
    summary:
      'Giveaway hosting with its own models, storage and views, including entry handling. Nearly finished, and still a work in progress.',
    status: 'wip',
  },
  {
    id: 'purge',
    name: 'Message purge',
    group: 'Utilities',
    summary:
      'Bulk message removal with configuration and its own error messages. It works, but the studio describes the behaviour as odd, so it stays in testing.',
    status: 'testing',
    commands: ['/purge'],
    note: 'Behaviour is odd',
  },
  {
    id: 'about',
    name: 'About Us',
    group: 'Utilities',
    summary:
      'Publishes and synchronises the official About Us message. A separate command from ping, with its own configuration and permissions.',
    status: 'tested',
    commands: ['/about-us'],
  },
  {
    id: 'ping',
    name: 'Ping',
    group: 'Utilities',
    summary:
      'Reports the bot’s response time. Its own command, separate from About Us.',
    status: 'tested',
    commands: ['/ping'],
  },
  {
    id: 'versioning',
    name: 'Version reporting',
    group: 'Utilities',
    summary: 'Publishes and checks the official NSS Versioning Standard.',
    status: 'testing',
    commands: ['/versioning'],
  },
  {
    id: 'polls',
    name: 'Polls',
    group: 'Utilities',
    summary:
      'Simple polls posted by staff and server statistics counters. Not planned for the near future.',
    status: 'planned',
  },
  {
    id: 'server-stats',
    name: 'Server statistics',
    group: 'Utilities',
    summary:
      'Counter channels and server figures driven by a config file. Not planned for the near future.',
    status: 'planned',
  },
  {
    id: 'help',
    name: 'Bot information and commands',
    group: 'Utilities',
    summary:
      'A planned command that lists the bot’s commands and points at the website for the full reference. Not in source yet.',
    status: 'planned',
    commands: ['/help'],
    note: 'Not in source yet',
  },

  // ------------------------------------------------------------ entertainment
  {
    id: 'fun',
    name: 'Fun commands',
    group: 'Entertainment',
    summary:
      'Small social commands: eightball, coinflip, dice, choose, jokes, roasts, trivia, GIFs and more. Mostly verified.',
    status: 'tested',
    commands: [
      '/eightball',
      '/coinflip',
      '/dice',
      '/choose',
      '/joke',
      '/roast',
      '/compliment',
      '/fortune',
      '/fact',
      '/quote',
      '/riddle',
      '/gif',
      '/meme',
      '/cat',
      '/dog',
      '/photo',
      '/trivia',
      '/wyr',
    ],
  },
  {
    id: 'minigames',
    name: 'Minigames',
    group: 'Entertainment',
    summary:
      'Small in-Discord games kept apart from the utility modules. Present in source and mostly verified.',
    status: 'tested',
  },
  {
    id: 'economy',
    name: 'Economy',
    group: 'Entertainment',
    summary:
      'Balances, an inventory and a shop. Planned; not verified.',
    status: 'planned',
  },
];

export const modulesByGroup = () =>
  MODULE_GROUPS.map((group) => ({
    group,
    modules: BOT_MODULES.filter((module) => module.group === group),
  })).filter((entry) => entry.modules.length > 0);

export const moduleCommandCount = () =>
  BOT_MODULES.reduce((total, module) => total + (module.commands?.length ?? 0), 0);

export const moduleCountByStatus = () =>
  (Object.keys(MODULE_STATUS_LABEL) as ModuleStatus[]).map((status) => ({
    status,
    count: BOT_MODULES.filter((module) => module.status === status).length,
  }));
