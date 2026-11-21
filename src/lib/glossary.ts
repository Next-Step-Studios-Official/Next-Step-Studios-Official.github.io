export type GlossaryTerm = {
  term: string;
  definition: string;
  /** Where in the policies or commands this term is used. */
  see?: string;
};

export type GlossaryGroup = {
  letter: string;
  terms: GlossaryTerm[];
};

/**
 * Plain-language definitions for the words the policies and the bot use.
 * Deliberately short: a glossary entry explains a term, it does not restate a
 * policy. Where a policy is the authority, `see` points at it.
 */
export const GLOSSARY: GlossaryGroup[] = [
  {
    letter: 'A',
    terms: [
      {
        term: 'Application',
        definition:
          'A form a member submits to be considered for a staff or community role. Applications are stored with their answers, their status and any review notes.',
        see: '/policies/bot/privacy',
      },
      {
        term: 'Audit trail',
        definition:
          'A record of who changed an application or staff record and when. Used so a decision can be explained later, and so clean-up commands have something to check.',
      },
    ],
  },
  {
    letter: 'B',
    terms: [
      {
        term: 'Ban appeal',
        definition:
          'A request from a banned member to have the ban reviewed. The flowchart exists in the bot source; no working appeal flow is claimed yet.',
        see: '/projects/next-step-bot',
      },
    ],
  },
  {
    letter: 'C',
    terms: [
      {
        term: 'Claim',
        definition:
          'A staff member taking responsibility for a ticket so two people do not answer the same request.',
        see: '/policies/bot/moderation',
      },
      {
        term: 'Cooldown',
        definition:
          'A short wait before the same command can be run again, used to stop accidental spam and repeated API calls.',
      },
    ],
  },
  {
    letter: 'D',
    terms: [
      {
        term: 'Data retention',
        definition:
          'How long a category of data is kept before it is deleted. Retention is defined per record type in the Data Retention and Deletion Policy, not as one blanket period.',
        see: '/policies/bot/data-retention',
      },
      {
        term: 'Deletion request',
        definition:
          'A request to erase data held about you. Sent by email; identity is confirmed before anything is removed.',
        see: '/contact#privacy-requests',
      },
    ],
  },
  {
    letter: 'E',
    terms: [
      {
        term: 'Ephemeral',
        definition:
          'A Discord reply only the person who ran the command can see. Used for application status and other private answers.',
      },
      {
        term: 'Escalation',
        definition:
          'Handing a ticket to a higher level of staff when it needs a decision the original handler cannot make.',
        see: '/policies/bot/moderation',
      },
    ],
  },
  {
    letter: 'I',
    terms: [
      {
        term: 'Infraction',
        definition:
          'A recorded rule break with a type, a reason and a date. Moderation and infractions are listed as planned, not working.',
        see: '/policies/bot/moderation',
      },
    ],
  },
  {
    letter: 'L',
    terms: [
      {
        term: 'Least privilege',
        definition:
          'Giving the bot, and staff, only the permissions needed for the task. The security overview describes how this is applied.',
        see: '/policies/bot/security',
      },
      {
        term: 'LOA',
        definition:
          'Leave of absence: a period a staff member is excused from duties. The module exists in source and is unverified in the server.',
      },
    ],
  },
  {
    letter: 'M',
    terms: [
      {
        term: 'Moderation action',
        definition:
          'A warning, timeout, kick or ban applied to a member, with a reason recorded where the feature exists.',
        see: '/policies/bot/moderation',
      },
    ],
  },
  {
    letter: 'O',
    terms: [
      {
        term: 'Operator',
        definition:
          'The single person who runs Next Step Studios and is responsible for the bot and this site.',
        see: '/about',
      },
    ],
  },
  {
    letter: 'P',
    terms: [
      {
        term: 'Panel',
        definition:
          'A persistent message with buttons or a dropdown, such as the ticket panel or the links panel. Panels are posted once and acted on repeatedly.',
      },
      {
        term: 'Purge',
        definition:
          'Bulk deletion of messages in a channel. Staff-only, and limited in scope.',
        see: '/commands',
      },
    ],
  },
  {
    letter: 'R',
    terms: [
      {
        term: 'Retention window',
        definition:
          'The specific period a record type is kept — for example the time a transcript is stored before deletion. Different record types have different windows.',
        see: '/policies/bot/data-retention',
      },
    ],
  },
  {
    letter: 'S',
    terms: [
      {
        term: 'Slash command',
        definition:
          'A command invoked in Discord with a leading slash, such as /ticket-panel. The bot defines 51 of them.',
        see: '/commands',
      },
      {
        term: 'Staff profile',
        definition:
          'A small record about a staff member used by the applications module: role, availability and interview notes.',
      },
    ],
  },
  {
    letter: 'T',
    terms: [
      {
        term: 'Ticket',
        definition:
          'A private channel that holds one support conversation, from creation to closure, so it does not clutter public channels.',
        see: '/policies/bot/privacy',
      },
      {
        term: 'Transcript',
        definition:
          'A file containing a ticket conversation. Generation exists in source but has not been verified end to end.',
        see: '/policies/bot/data-retention',
      },
    ],
  },
  {
    letter: 'V',
    terms: [
      {
        term: 'Verification',
        definition:
          'A statement that a feature has been exercised end to end, including storage, access and failure handling — not merely that code exists.',
        see: '/status',
      },
    ],
  },
];

export const GLOSSARY_COUNT = GLOSSARY.reduce((total, group) => total + group.terms.length, 0);
