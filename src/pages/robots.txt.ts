import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL(SITE.url)).toString();

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', base).toString()}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
