/**
 * Every public social link the studio has.
 *
 * This is the only file to edit when a link is added, changed or removed.
 * The Social page and the footer both read from here, so nothing can drift
 * out of sync, and nothing is claimed that has not been linked.
 *
 * Rules this file keeps:
 *  - An empty `href` means "not linked yet". The page says so plainly and
 *    never invents a URL, handle or account that does not exist.
 *  - Never add a placeholder URL (example.com, #, "coming soon" links) —
 *    leave it empty instead, so the site stays honest.
 */

export type SocialLink = {
  /** Stable key, used for ordering and for the visible link text. */
  id: string;
  /** Display name of the platform or account. */
  label: string;
  /** Optional handle, shown next to the name. Leave empty if there isn't one. */
  handle?: string;
  /** One line explaining what lives there. */
  description: string;
  /** Full URL. Empty string = not linked yet. */
  href: string;
};

export type ChannelLink = {
  id: string;
  /** Channel name without the #, e.g. "announcements". */
  name: string;
  /** What happens in that channel. */
  purpose: string;
  /** Direct channel URL, if you want one. Empty string = shown without a link. */
  href: string;
};

export const DISCORD = {
  serverName: 'Next Step Studios',
  /**
   * The permanent invite link (Discord → Invite People → Edit invite link →
   * set to "Never expire"). Leave empty until the link exists.
   */
  inviteUrl: 'https://discord.gg/KVnnEnsN3N',
  description:
    'The server is the community side of the studio: where the Bot is discussed, where announcements land first, and where support happens.',
  /** Rename, reorder or delete these to match your real server. */
  channels: [
    {
      id: 'announcements',
      name: 'announcements',
      purpose: 'New projects, releases and devlog entries — posted once, never spammed.',
      href: '',
    },
    {
      id: 'devlog',
      name: 'devlog',
      purpose: 'Work in progress on Next Step Bot, including the parts that are not going well.',
      href: '',
    },
    {
      id: 'support',
      name: 'support',
      purpose: 'Questions about the Bot, and where privacy and data requests start.',
      href: '',
    },
    {
      id: 'bug-reports',
      name: 'bug-reports',
      purpose: 'Something broken? Report it here with what you expected and what happened.',
      href: '',
    },
    {
      id: 'general',
      name: 'general',
      purpose: 'Everything else — general chat with the people who hang around here.',
      href: '',
    },
  ] satisfies ChannelLink[],
} as const;

/**
 * Other accounts. Only the ones that genuinely exist should ever have a URL.
 * The Social page lists the slots so visitors know what is and is not official.
 */
export const ELSEWHERE: SocialLink[] = [
  {
    id: 'youtube',
    label: 'YouTube',
    description: 'Development videos and, eventually, project trailers.',
    href: 'https://www.youtube.com/channel/UCaZNwC-pgVxTDk654m7I33A',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Visual work and the occasional look at the process.',
    href: 'https://www.instagram.com/nextstepstudiosofficial',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    description: 'Short clips from the work and from the studio.',
    href: 'https://www.tiktok.com/@next_step_studios',
  },
  {
    id: 'x',
    label: 'X',
    description: 'Brief announcements, mirrored from the Discord server.',
    href: 'https://x.com/nextstepstudioo?s=11',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'The official Next Step Studios Facebook page.',
    href: 'https://www.facebook.com/share/151VGE88U9i/?mibextid=wwXIfr',
  },
  {
    id: 'roblox',
    label: 'Roblox Group',
    description: 'The official Next Step Studios Roblox group.',
    href: 'https://www.roblox.com/share/g/35922994',
  },
  {
    id: 'github',
    label: 'GitHub',
    description: 'Source code, documentation and issue trackers for anything that can be open.',
    href: 'https://github.com/Next-Step-Studios-Official',
  },
];

/** True when a link is real. Used to avoid rendering empty anchors. */
export const isLinked = (link: { href: string }) => link.href.trim().length > 0;

/** Every configured link that actually exists. */
export const activeElsewhere = ELSEWHERE.filter(isLinked);

export const activeChannels = DISCORD.channels.filter(isLinked);
