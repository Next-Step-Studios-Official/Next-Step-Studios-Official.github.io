/**
 * The bot's slash-command register, read from its cogs.
 *
 * Names and descriptions are the ones in the source, not marketing copy.
 * Nothing is marked as released: these are commands that exist in the code,
 * which is a different claim from commands that have been exercised end to end.
 */

export type CommandGroupId = 'announcements' | 'fun' | 'tickets' | 'utilities';

export type BotCommand = {
  /** The command as typed in Discord, without the slash. */
  name: string;
  group: CommandGroupId;
  description: string;
  /** A caveat worth showing next to the command. */
  note?: string;
};

export const COMMAND_GROUPS: { id: CommandGroupId; label: string; blurb: string; icon: string }[] = [
  {
    id: 'announcements',
    label: 'Announcements',
    blurb: 'Composing and publishing staff announcements.',
    icon: '◈',
  },
  {
    id: 'fun',
    label: 'Community fun',
    blurb: 'Small, low-stakes commands for a server to play with.',
    icon: '◇',
  },
  {
    id: 'tickets',
    label: 'Support tickets',
    blurb: 'The full ticket lifecycle: creation, claiming, waiting, escalation and transcripts.',
    icon: '▣',
  },
  {
    id: 'utilities',
    label: 'Studio utilities',
    blurb: 'Applications, staff review, suggestions, links and the bot’s own documentation commands.',
    icon: '◆',
  },
];

export const COMMANDS: BotCommand[] = [
  // Announcements
  { name: 'announce', group: 'announcements', description: 'Create and publish an announcement.' },

  // Community fun
  { name: 'eightball', group: 'fun', description: 'Ask the magic 8-ball a question.' },
  { name: 'coinflip', group: 'fun', description: 'Flip a coin.' },
  { name: 'dice', group: 'fun', description: 'Roll one or more dice.' },
  { name: 'choose', group: 'fun', description: 'Randomly choose from a list of options.' },
  { name: 'joke', group: 'fun', description: 'Get a joke from the built-in joke collection.' },
  { name: 'roast', group: 'fun', description: 'Give someone a playful roast.' },
  { name: 'compliment', group: 'fun', description: 'Give someone a compliment.' },
  { name: 'fortune', group: 'fun', description: 'Receive a random fortune.' },
  { name: 'fact', group: 'fun', description: 'Search the web for an interesting fact.' },
  { name: 'quote', group: 'fun', description: 'Find an interesting quote.' },
  { name: 'riddle', group: 'fun', description: 'Get a riddle and reveal its answer privately.' },
  { name: 'gif', group: 'fun', description: 'Search for a GIF.' },
  { name: 'meme', group: 'fun', description: 'Generate a meme using Imgflip.' },
  { name: 'cat', group: 'fun', description: 'Get a random cat picture.' },
  { name: 'dog', group: 'fun', description: 'Get a random dog picture.' },
  { name: 'photo', group: 'fun', description: 'Search for a photograph.' },
  { name: 'trivia', group: 'fun', description: 'Play a multiple-choice trivia question.' },
  { name: 'wyr', group: 'fun', description: 'Play Would You Rather with the server.' },

  // Support tickets
  { name: 'ticket-panel', group: 'tickets', description: 'Post the public ticket creation panel.' },
  { name: 'create', group: 'tickets', description: 'Create a new support ticket.' },
  { name: 'ticket-claim', group: 'tickets', description: 'Claim the current ticket.' },
  { name: 'ticket-unclaim', group: 'tickets', description: 'Unclaim the current ticket.' },
  {
    name: 'ticket-waiting',
    group: 'tickets',
    description: 'Start a 24-hour deadline for the ticket creator to respond.',
  },
  {
    name: 'ticket-ready',
    group: 'tickets',
    description: 'Compatibility alias: mark a ticket as waiting for its creator.',
  },
  {
    name: 'ticket-close',
    group: 'tickets',
    description: 'Request closure of this ticket, with a configured grace period.',
  },
  {
    name: 'ticket-close-now',
    group: 'tickets',
    description: 'Immediately close the current ticket (staff only).',
    note: 'Staff only',
  },
  { name: 'ticket-reopen', group: 'tickets', description: 'Reopen a closed ticket.' },
  {
    name: 'ticket-transcript',
    group: 'tickets',
    description: 'Generate a transcript for a ticket.',
    note: 'Generation exists; not verified end to end',
  },
  { name: 'escalate', group: 'tickets', description: 'Escalate the current ticket to a designated team.' },
  {
    name: 'reset-counter',
    group: 'tickets',
    description: 'Reset ticket numbering. Owner only.',
    note: 'Owner only',
  },

  // Studio utilities
  { name: 'about-us', group: 'utilities', description: 'Publish or synchronize the official Next Step Studios About Us message.' },
  { name: 'rules', group: 'utilities', description: 'Publish or synchronize the official Next Step Studios rules.' },
  { name: 'versioning', group: 'utilities', description: 'Publish or check the official NSS Versioning Standard.' },
  { name: 'links', group: 'utilities', description: 'View the official Next Step Studios links.' },
  { name: 'ping', group: 'utilities', description: 'Check the bot’s response time.' },
  { name: 'purge', group: 'utilities', description: 'Delete messages from a selected server channel.' },
  { name: 'suggest', group: 'utilities', description: 'Submit a suggestion to the server.' },
  { name: 'suggestion-search', group: 'utilities', description: 'Search suggestions by title or description.' },
  { name: 'suggestion-status', group: 'utilities', description: 'Change a suggestion’s status.' },
  { name: 'suggestion-cleanup', group: 'utilities', description: 'Permanently remove suggestion records.' },
  { name: 'status', group: 'utilities', description: 'Privately check the status of your application.' },
  { name: 'list', group: 'utilities', description: 'List recent applications for authorized staff.' },
  { name: 'audit', group: 'utilities', description: 'View audit history for an application.' },
  { name: 'cleanup', group: 'utilities', description: 'Remove application records after owner confirmation.' },
  { name: 'reset', group: 'utilities', description: 'Reset application records after owner confirmation.' },
  { name: 'interview_request', group: 'utilities', description: 'Submit availability for an application interview.' },
  { name: 'interview_confirm', group: 'utilities', description: 'Confirm a proposed interview slot.' },
  { name: 'interview_publish_slot', group: 'utilities', description: 'Publish a proposed interview slot for an application.' },
  { name: 'staff_profile', group: 'utilities', description: 'Create, update, or view your staff profile.' },
  { name: 'staff_profile_delete', group: 'utilities', description: 'Delete your staff profile.' },
];

export const commandsByGroup = (): { group: (typeof COMMAND_GROUPS)[number]; commands: BotCommand[] }[] =>
  COMMAND_GROUPS.map((group) => ({
    group,
    commands: COMMANDS.filter((command) => command.group === group.id),
  }));

export const commandCountByGroup = (id: CommandGroupId): number =>
  COMMANDS.filter((command) => command.group === id).length;
