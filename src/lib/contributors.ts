/**
 * The people who contribute to Next Step Studios.
 *
 * This is the only place the team is defined. The About page summary, the
 * /team page, the footer and the home page all read this list, so a change
 * here reaches every mention.
 *
 * ── Before this goes live ─────────────────────────────────────────────
 * The five entries below are placeholders. Replace each handle with the
 * person's real Discord username, write their role and what they work on,
 * then set CONTRIBUTORS_CONFIRMED to true. While it is false, every page
 * showing the list says the details are still being confirmed, so the
 * placeholder text never reads as a claim about a real person.
 */
export type Contributor = {
  /** Discord username, shown as the public credit. */
  handle: string;
  /** Full name, only if the person wants it shown instead of the handle. */
  name?: string;
  /** Two or three words, e.g. "Art and UI". */
  role: string;
  /** One sentence on what the person actually works on. */
  focus: string;
};

/** Flip to true once every entry below is a real, confirmed person. */
export const CONTRIBUTORS_CONFIRMED = false;

export const CONTRIBUTORS: Contributor[] = [
  {
    handle: '@contributor-1',
    role: 'Role to be confirmed',
    focus: 'What this person works on goes here.',
  },
  {
    handle: '@contributor-2',
    role: 'Role to be confirmed',
    focus: 'What this person works on goes here.',
  },
  {
    handle: '@contributor-3',
    role: 'Role to be confirmed',
    focus: 'What this person works on goes here.',
  },
  {
    handle: '@contributor-4',
    role: 'Role to be confirmed',
    focus: 'What this person works on goes here.',
  },
  {
    handle: '@contributor-5',
    role: 'Role to be confirmed',
    focus: 'What this person works on goes here.',
  },
];

export const CONTRIBUTOR_COUNT = CONTRIBUTORS.length;

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** Lowercase word for the count, e.g. "five"; digits above ten. */
export const CONTRIBUTOR_WORD = WORDS[CONTRIBUTOR_COUNT] ?? String(CONTRIBUTOR_COUNT);

/** The public credit for a person: a full name if given, otherwise the handle. */
export const contributorName = (person: Contributor) => person.name ?? person.handle;
