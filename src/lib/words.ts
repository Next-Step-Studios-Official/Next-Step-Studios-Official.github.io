/**
 * Number words for small counts, so copy that mentions "five documents" or
 * "seven people" is derived from the lists rather than typed again.
 *
 * Above ten the digits are used: a page that says "twelve" by hand drifts the
 * moment a list grows, which is the problem this file exists to prevent.
 */
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** Lowercase word for a count, e.g. "four"; digits above ten. */
export const numberWord = (value: number): string => WORDS[value] ?? String(value);
