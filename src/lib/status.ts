/**
 * The live status feed.
 *
 * The site is static, so nothing here can probe the bot from the server. The
 * bot publishes a small JSON file to the repository every five minutes; this
 * page reads that file in the browser. The feed is served straight from the
 * repository's raw URL so a status write does not trigger a rebuild.
 *
 * Shape of status.json:
 * {
 *   "schema": 1,
 *   "generatedAt": "2026-11-21T12:00:00.000Z",
 *   "bot": { "online": true, "latencyMs": 42, "version": "1.0.0" },
 *   "checks": [ { "t": "2026-11-21T12:00:00.000Z", "online": true, "ms": 42 } ]
 * }
 *
 * `checks` is a rolling 24-hour window. The page derives uptime and incidents
 * from it, so a gap or an outage is visible rather than merely asserted.
 */

export type StatusCheck = {
  /** ISO timestamp of the check. */
  t: string;
  online: boolean;
  /** Round-trip time in milliseconds, if measured. */
  ms?: number | null;
};

export type StatusFeed = {
  schema: number;
  generatedAt: string;
  bot: {
    online: boolean | null;
    latencyMs?: number | null;
    version?: string | null;
  };
  checks: StatusCheck[];
};

export const STATUS_FEED_URL =
  'https://raw.githubusercontent.com/Next-Step-Studios-Official/Next-Step-Studios-Official.github.io/main/public/status.json';

export const STATUS_FALLBACK_URL = '/status.json';

/** How often the publisher is expected to write a check. */
export const STATUS_INTERVAL_MS = 5 * 60 * 1000;

/** After this long without a write, the feed is shown as stale. */
export const STATUS_STALE_MS = 10 * 60 * 1000;

/** The history window the bar strip covers. */
export const STATUS_WINDOW_MS = 24 * 60 * 60 * 1000;

export const STATUS_SLOTS = Math.round(STATUS_WINDOW_MS / STATUS_INTERVAL_MS);
