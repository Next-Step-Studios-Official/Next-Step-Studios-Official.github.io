/**
 * The one place Discord destinations are configured.
 *
 * Everything the website links to in Discord — the server invite, the support
 * destination, individual public channels — is read from here. Nothing else in
 * the site hard-codes a discord.gg or discord.com address, so changing the
 * invite once changes it everywhere.
 *
 * Rules this file keeps:
 *  - No bot tokens, webhooks or private channel IDs. This file is public.
 *  - A destination that has not been supplied stays empty, and the UI then
 *    renders nothing rather than a dead button.
 *  - Every URL is validated before it is offered for rendering.
 *
 * Channel entries are empty on purpose: the IDs have not been supplied yet.
 * Fill one in and every component that reads it starts rendering it; leave it
 * empty and the component omits it silently.
 */

/** Hosts a public Discord destination may live on. */
const ALLOWED_HOSTS = new Set(['discord.gg', 'discord.com', 'www.discord.com', 'ptb.discord.com']);

/**
 * True only for a well-formed https URL on a Discord host. Used as a type guard
 * so a component can render a link only when there is genuinely somewhere to go.
 */
export function isUsableDiscordUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  return url.protocol === 'https:' && ALLOWED_HOSTS.has(url.hostname);
}

/** A public channel link built from a guild and channel id, or null. */
function channelLink(guildId: string, channelId: string): string | null {
  if (!guildId || !channelId) return null;
  const url = `https://discord.com/channels/${guildId}/${channelId}`;
  return isUsableDiscordUrl(url) ? url : null;
}

/**
 * Guild and channel identifiers. These are not secrets; they are what makes a
 * deep link possible, because Discord cannot link to a channel by name.
 *
 * Only the ticket panel is supplied so far. The other entries stay empty on
 * purpose: a button that goes nowhere is worse than no button, so the UI omits
 * them until a real id is pasted here.
 */
const GUILD_ID = '1401664304763113562';
const CHANNEL_IDS = {
  announcements: '',
  development: '',
  updates: '',
  support: '',
  tickets: '1402293886088511579',
} as const;

export type DiscordChannelKey = keyof typeof CHANNEL_IDS;

export const DISCORD = {
  /** What the server is called in copy. */
  serverName: 'Next Step Studios',
  /** The public invite. One value, used by every call to action. */
  inviteUrl: 'https://discord.gg/KVnnEnsN3N',
  /**
   * Where someone should go for help. Falls back to the main invite while no
   * separate support destination exists.
   */
  supportUrl: 'https://discord.gg/KVnnEnsN3N',
  /** Channel links, resolved from the ids above. */
  channels: {
    announcements: channelLink(GUILD_ID, CHANNEL_IDS.announcements),
    development: channelLink(GUILD_ID, CHANNEL_IDS.development),
    updates: channelLink(GUILD_ID, CHANNEL_IDS.updates),
    support: channelLink(GUILD_ID, CHANNEL_IDS.support),
    tickets: channelLink(GUILD_ID, CHANNEL_IDS.tickets),
  } satisfies Record<DiscordChannelKey, string | null>,
} as const;

/** The invite, or null when it has not been configured with a usable URL. */
export const discordInvite = (): string | null =>
  isUsableDiscordUrl(DISCORD.inviteUrl) ? DISCORD.inviteUrl : null;

/** The support destination, or null. */
export const discordSupport = (): string | null =>
  isUsableDiscordUrl(DISCORD.supportUrl) ? DISCORD.supportUrl : null;

/** One channel link, or null when that channel has not been configured. */
export const discordChannel = (key: DiscordChannelKey): string | null => {
  const value = DISCORD.channels[key];
  return isUsableDiscordUrl(value) ? value : null;
};

/** The public ticket panel, where someone picks a ticket type. */
export const discordTicketPanel = (): string | null => discordChannel('tickets');
