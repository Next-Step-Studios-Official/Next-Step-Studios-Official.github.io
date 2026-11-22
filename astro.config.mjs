import { defineConfig } from 'astro/config';

/**
 * Static output: every route is pre-rendered to plain HTML at build time.
 * No server, no database, no client-side framework.
 *
 * `site` is the canonical origin. It defaults to the GitHub Pages address this
 * repository is set up for; the deploy workflow overrides it through SITE_URL so
 * the real repository address is always the one published.
 */
const site = process.env.SITE_URL ?? 'https://next-step-studios-official.github.io';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'ignore',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  redirects: {
    '/social': '/links',
  },
  build: {
    format: 'directory',
  },
});
