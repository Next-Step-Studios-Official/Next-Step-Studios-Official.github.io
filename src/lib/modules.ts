/**
 * The Discord bot's modules, read from its source tree.
 *
 * Source: D:\NextStepStudios\DiscordBots\PrivateBots\NextStepStudioBot\bot\cogs
 *
 * Status vocabulary — deliberately separate from the project statuses on the
 * website, because a module existing as files is not the same as a feature
 * being verified in the server:
 *
 *   in-source  The module exists in the bot's source with commands defined.
 *              It has not been independently verified end to end on the server.
 *   partial    Part of the module is implemented; the rest is not.
 *   planned    The area is intended but is not a working feature yet.
 */

export type ModuleStatus = 'in-source' | 'partial' | 'planned';

export type BotModule = {
  id: string;
  name: string;
  group: string;
  summary: string;
  status: ModuleStatus;
  /** Command names exactly as they appear in the source, where defined. */
  commands?: string[];
};

export const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  'in-source': 'In source · unverified',
  partial: 'Partially implemented',
  planned: 'Planned',
};

export const MODULE_GROUPS = [
  'Community operations',
  'Moderation and roles',
  'Utilities',
  'Entertainment',
  'Platform',
] as const;

export const BOT_MODULES: BotModule[] = [
  // ---------------------------------------------------------------- community
  {
    id: 'tickets',
    name: 'Support tickets',
    group: 'Community operations',
    summary:
      'Turns support conversations into private ticket channels with claim, waiting, ready and close states, plus transcripts. Transcript generation exists but has not been verified end to end.',
    status: 'in-source',
    commands: [
      '/ticket-panel',
      '/ticket-claim',
      '/ticket-unclaim',
      '/ticket-waiting',
      '/ticket-ready',
      '/ticket-close',
      '/ticket-close-now',
      '/ticket-transcript',
      '/escalate',
      '/reset-counter',
    ],
  },
  {
    id: 'applications',
    name: 'Applications and staff review',
    group: 'Community operations',
    summary:
      'Application forms, review decisions, interview scheduling, staff profiles and an audit trail, with owner-confirmed clean-up and reset commands.',
    status: 'in-source',
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
      'A staff announcement composer with modals and a published embed. Described on the project page as partially implemented.',
    status: 'partial',
    commands: ['/announce'],
  },
  {
    id: 'welcome',
    name: 'Welcome and onboarding',
    group: 'Community operations',
    summary:
      'Member join events, onboarding flows and staff commands for adjusting how new members are greeted.',
    status: 'in-source',
  },
  {
    id: 'loa',
    name: 'Leave of absence',
    group: 'Community operations',
    summary:
      'Staff leave requests with eligibility rules, lifecycle handling, permissions and storage.',
    status: 'in-source',
  },

  // ------------------------------------------------------------- moderation
  {
    id: 'moderation',
    name: 'Moderation and infractions',
    group: 'Moderation and roles',
    summary:
      'The project page lists moderation and infractions as planned rather than working: the modules exist in the source, but no verification of behaviour is claimed here.',
    status: 'planned',
  },
  {
    id: 'appeals',
    name: 'Ban appeals',
    group: 'Moderation and roles',
    summary:
      'Listed as planned on the project page. No working appeal flow is claimed.',
    status: 'planned',
  },
  {
    id: 'roles',
    name: 'Role management',
    group: 'Moderation and roles',
    summary: 'Staff-facing role controls kept separate from day-to-day moderation.',
    status: 'in-source',
  },
  {
    id: 'logging',
    name: 'Logging and diagnostics',
    group: 'Moderation and roles',
    summary:
      'Log management plus a developer diagnostics module used while testing the bot locally.',
    status: 'in-source',
  },

  // -------------------------------------------------------------- utilities
  {
    id: 'links',
    name: 'Official links',
    group: 'Utilities',
    summary:
      'The panel behind the website\'s /links page: one config file defines six sections and every entry, and the command publishes an embed plus a dropdown.',
    status: 'in-source',
    commands: ['/links'],
  },
  {
    id: 'rules',
    name: 'Rules',
    group: 'Utilities',
    summary: 'Publishes the server rules from configuration.',
    status: 'in-source',
  },
  {
    id: 'faq',
    name: 'FAQ',
    group: 'Utilities',
    summary:
      'A configurable FAQ with its own data, views and error handling, so answers can be edited without touching command code.',
    status: 'in-source',
  },
  {
    id: 'suggestions',
    name: 'Suggestions',
    group: 'Utilities',
    summary:
      'Member suggestions with staff search, status changes and record clean-up.',
    status: 'in-source',
    commands: ['/suggest', '/suggestion-search', '/suggestion-status', '/suggestion-cleanup'],
  },
  {
    id: 'giveaways',
    name: 'Giveaways',
    group: 'Utilities',
    summary:
      'Giveaway hosting with its own models, storage and views, including entry handling.',
    status: 'in-source',
  },
  {
    id: 'polls',
    name: 'Polls',
    group: 'Utilities',
    summary: 'Simple polls posted by staff.',
    status: 'in-source',
  },
  {
    id: 'reminders',
    name: 'Reminders',
    group: 'Utilities',
    summary: 'Personal reminders, stored per user.',
    status: 'in-source',
  },
  {
    id: 'purge',
    name: 'Message purge',
    group: 'Utilities',
    summary: 'Bulk message removal with configuration and its own error messages.',
    status: 'in-source',
  },
  {
    id: 'server-stats',
    name: 'Server statistics',
    group: 'Utilities',
    summary: 'Counter channels and server figures driven by a config file.',
    status: 'in-source',
  },
  {
    id: 'versioning',
    name: 'Version reporting',
    group: 'Utilities',
    summary: 'Reports which version of the bot is running.',
    status: 'in-source',
  },
  {
    id: 'about',
    name: 'About and ping',
    group: 'Utilities',
    summary:
      'Studio information and a latency check, including a general help entry point.',
    status: 'in-source',
    commands: ['/ping'],
  },

  // ------------------------------------------------------------ entertainment
  {
    id: 'fun',
    name: 'Fun commands',
    group: 'Entertainment',
    summary:
      'Small social commands, each defined in one config file: eightball, coinflip, dice, choose, jokes and roasts.',
    status: 'in-source',
  },
  {
    id: 'minigames',
    name: 'Minigames',
    group: 'Entertainment',
    summary: 'Small in-Discord games kept apart from the utility modules.',
    status: 'in-source',
  },
  {
    id: 'economy',
    name: 'Economy',
    group: 'Entertainment',
    summary:
      'Balances, an inventory and a shop — separated into three modules rather than one.',
    status: 'in-source',
  },

  // ----------------------------------------------------------------- platform
  {
    id: 'administration',
    name: 'Administration',
    group: 'Platform',
    summary:
      'Channels, roles, permissions and configuration, split across modules so each concern has one home.',
    status: 'in-source',
  },
  {
    id: 'automation',
    name: 'Automation',
    group: 'Platform',
    summary: 'Workflow commands for repeatable server tasks.',
    status: 'in-source',
  },
  {
    id: 'information',
    name: 'Server and user information',
    group: 'Platform',
    summary: 'The information commands that describe the server and its members.',
    status: 'in-source',
  },
  {
    id: 'activity',
    name: 'Member activity checks',
    group: 'Platform',
    summary: 'Membership checks used by other modules before acting on a member.',
    status: 'in-source',
  },
];

export const modulesByGroup = () =>
  MODULE_GROUPS.map((group) => ({
    group,
    modules: BOT_MODULES.filter((module) => module.group === group),
  })).filter((entry) => entry.modules.length > 0);

export const moduleCommandCount = () =>
  BOT_MODULES.reduce((total, module) => total + (module.commands?.length ?? 0), 0);
