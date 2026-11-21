import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';

export const prerender = true;

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL(SITE.url)).toString();
  const posts = (await getCollection('devlog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const items = posts
    .map((post) => {
      const url = new URL(`/devlog/${post.id}`, base).toString();
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.summary)}</description>
${post.data.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n')}
    </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)} — Devlog</title>
    <link>${new URL('/devlog', base).toString()}</link>
    <description>Notes from the work at ${escapeXml(SITE.name)}.</description>
    <language>en-gb</language>
    <atom:link href="${new URL('/rss.xml', base).toString()}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
