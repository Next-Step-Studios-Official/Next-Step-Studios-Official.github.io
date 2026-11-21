/**
 * The official links, in one configuration file.
 *
 * This mirrors `bot/cogs/utilities/links/links_config.py` in the Discord bot
 * (D:\NextStepStudios\DiscordBots\PrivateBots\NextStepStudioBot). The section
 * ids, entry ids, names, descriptions and URLs are kept deliberately identical
 * to the bot's config so the website and the `/links` command can be compared
 * line for line.
 *
 * Rules this file keeps:
 *  - It is a copy, not a link to the bot's disk. The site builds on its own.
 *  - If a link is not official, it does not belong here.
 *  - A disabled entry is kept in the file but never rendered. That is how a
 *    platform can be supported before an account exists, without a dead button.
 *  - `accent` is the brand colour used by the bot's selection embed.
 */

import { DISCORD } from './discord';

export const DOCS_REPO_URL = 'https://github.com/Next-Step-Studios-Official/bot-documentation';
/** The GitHub policies directory, kept as a secondary reference. */
export const DOCS_POLICIES_URL = `${DOCS_REPO_URL}/tree/main/policies`;

/** Alias used by older documentation links; the site's own page is primary. */
export const DOCS_MIRROR_URL = DOCS_POLICIES_URL;

export type LinkSectionId =
  | 'website'
  | 'social'
  | 'community'
  | 'development'
  | 'policies'
  | 'contact';

export type LinkSection = {
  id: LinkSectionId;
  /** Same heading the bot uses in its embed field. */
  title: string;
  description: string;
};

/** The bot's SECTION_ORDER, in the same order. */
export const LINK_SECTIONS: LinkSection[] = [
  {
    id: 'website',
    title: 'Official Website',
    description: 'Our official website and online presence.',
  },
  {
    id: 'social',
    title: 'Social Media',
    description: 'Follow Next Step Studios on our social platforms.',
  },
  {
    id: 'community',
    title: 'Gaming Community',
    description: 'Join our gaming community and Roblox group.',
  },
  {
    id: 'development',
    title: 'Development',
    description: 'Explore our development work and projects.',
  },
  {
    id: 'policies',
    title: 'Policies',
    description:
      'Review the official Next Step Studios policies, including our Terms of Service and Privacy Policy.',
  },
  {
    id: 'contact',
    title: 'Business Contact',
    description: 'Contact Next Step Studios for inquiries.',
  },
];

export type LinkEntryType = 'link' | 'email' | 'notice';

export type LinkEntry = {
  /** Same id as the bot's config. Keep these stable. */
  id: string;
  name: string;
  section: LinkSectionId;
  type: LinkEntryType;
  description: string;
  /** HTTPS URL for links, a site-relative path for internal pages, or the address for email entries. */
  url?: string;
  /** Informational text; no URL. */
  notice?: string;
  /** Brand colour, as used by the bot's selection embed. */
  accent?: string;
  enabled: boolean;
};

/**
 * The bot's LINKS list, minus the private Discord channel URL.
 *
 * The social entries were added from the bot's real configuration. Do not
 * invent a URL for a platform that does not have an official account: leave
 * `enabled: false` and no URL, and the page omits it.
 */
export const LINKS: LinkEntry[] = [
  {
    id: 'website',
    name: 'Official Website',
    section: 'website',
    type: 'link',
    description: 'The official Next Step Studios website — the site you are reading now.',
    url: '/',
    accent: '#5865F2',
    enabled: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    section: 'social',
    type: 'link',
    description: 'Follow Next Step Studios on TikTok.',
    url: 'https://www.tiktok.com/@next_step_studios',
    accent: '#25F4EE',
    enabled: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    section: 'social',
    type: 'link',
    description: 'Follow Next Step Studios on Instagram.',
    url: 'https://www.instagram.com/nextstepstudiosofficial',
    accent: '#E1306C',
    enabled: true,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    section: 'social',
    type: 'link',
    description: 'Visit the official Next Step Studios Facebook page.',
    url: 'https://www.facebook.com/share/151VGE88U9i/?mibextid=wwXIfr',
    accent: '#0866FF',
    enabled: true,
  },
  {
    id: 'x',
    name: 'X (formerly known as Twitter)',
    section: 'social',
    type: 'link',
    description: 'Follow Next Step Studios on X.',
    url: 'https://x.com/nextstepstudioo?s=11',
    accent: '#000000',
    enabled: true,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    section: 'social',
    type: 'link',
    description: 'Subscribe to Next Step Studios on YouTube.',
    url: 'https://www.youtube.com/channel/UCaZNwC-pgVxTDk654m7I33A',
    accent: '#FF0000',
    enabled: true,
  },
  {
    id: 'roblox',
    name: 'Roblox Group',
    section: 'community',
    type: 'link',
    description: 'Join the official Next Step Studios Roblox group.',
    url: 'https://www.roblox.com/share/g/35922994',
    accent: '#393B3D',
    enabled: true,
  },
  {
    id: 'discord',
    name: 'Discord Community',
    section: 'community',
    type: 'link',
    description: 'Join the official Next Step Studios Discord server.',
    /** Reads the single configured invite; never a hard-coded copy. */
    url: DISCORD.inviteUrl,
    accent: '#5865F2',
    enabled: true,
  },
  {
    id: 'github',
    name: 'GitHub Organization',
    section: 'development',
    type: 'link',
    description: "Explore Next Step Studios' official GitHub organization.",
    url: 'https://github.com/Next-Step-Studios-Official',
    accent: '#24292F',
    enabled: true,
  },
  {
    id: 'official_policies',
    name: 'Official Policies',
    section: 'policies',
    type: 'link',
    description: 'Read the official Next Step Studios policies on this site.',
    /**
     * The website is the primary destination. The bot config uses the absolute
     * version of this address; see EDITING.md, "Official links".
     */
    url: '/policies',
    accent: '#5865F2',
    enabled: true,
  },
  {
    id: 'email',
    name: 'Business Email',
    section: 'contact',
    type: 'email',
    description: 'Contact Next Step Studios via email.',
    url: 'nextstepstudiosofficial.contact@gmail.com',
    /**
     * The bot points at a private support channel here. That channel URL is
     * deliberately not published on the website; the instruction is kept.
     */
    notice:
      'This email address is a temporary contact point. Until further notice, please use the support ticket channel in the Discord server for all inquiries, and make sure to select the correct ticket type.',
    accent: '#393B3D',
    enabled: true,
  },
];

const isSitePath = (value: string) => value.startsWith('/') && !value.startsWith('//');
const isHttpsUrl = (value: string) => /^https:\/\/[^\s]+$/i.test(value);
const isEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

/**
 * An enabled entry is only rendered when it actually has a destination. This
 * keeps a half-finished entry from becoming a button that goes nowhere.
 */
const hasDestination = (entry: LinkEntry): boolean => {
  if (entry.type === 'notice') return Boolean(entry.notice?.trim());
  const value = entry.url?.trim() ?? '';
  if (entry.type === 'email') return isEmail(value);
  return isSitePath(value) || isHttpsUrl(value);
};

export const enabledLinks = (): LinkEntry[] =>
  LINKS.filter((entry) => entry.enabled && hasDestination(entry));

/**
 * Official external profiles for schema.org `sameAs`. Site-relative paths and
 * the policy page are excluded: they are pages on this site, not identities
 * elsewhere.
 */
export const sameAsLinks = (): string[] =>
  enabledLinks().flatMap((entry) =>
    entry.type === 'link' &&
    entry.id !== 'official_policies' &&
    entry.url &&
    isHttpsUrl(entry.url)
      ? [entry.url]
      : [],
  );
