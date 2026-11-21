/**
 * The people who contribute to Next Step Studios.
 *
 * This is the only place the team is defined. The About page summary, the
 * /team page, the footer and the home page all read this list, so a change
 * here reaches every mention.
 *
 * ── Before this goes live ─────────────────────────────────────────────
 * The four entries below are placeholders, alongside Candler Shaw, who runs
 * the studio and is not listed here. Replace each handle with the
 * person's real Discord username, write their role and what they work on,
 * then set CONTRIBUTORS_CONFIRMED to true. While it is false, every page
 * showing the list says the details are still being confirmed, so the
 * placeholder text never reads as a claim about a real person.
 */
import { numberWord } from './words';

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
];

export const CONTRIBUTOR_COUNT = CONTRIBUTORS.length;

/** Lowercase word for the count, e.g. "four"; digits above ten. */
export const CONTRIBUTOR_WORD = numberWord(CONTRIBUTOR_COUNT);

/**
 * Everyone in the studio, including the operator, who is not listed as a
 * contributor. The studio is five people in total: Candler plus four others.
 */
export const TEAM_SIZE = CONTRIBUTOR_COUNT + 1;

/** Lowercase word for the team size, e.g. "five". */
export const TEAM_WORD = numberWord(TEAM_SIZE);

/** The public credit for a person: a full name if given, otherwise the handle. */
export const contributorName = (person: Contributor) => person.name ?? person.handle;
