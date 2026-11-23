import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/site';
import {
  POLICY_SCOPE_LABELS,
  isDraftDocument,
  policyPath,
  scopeOf,
} from '../../lib/documents';

export const prerender = true;

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL(SITE.url)).toString().replace(/\/$/, '');
  const scopeRank = { bot: 0, website: 1 } as const;
  const policies = (await getCollection('policies')).sort(
    (a, b) => scopeRank[scopeOf(a.id)] - scopeRank[scopeOf(b.id)] || a.data.order - b.data.order,
  );

  const items = policies
    .map((policy) => {
      const scope = scopeOf(policy.id);
      return `    <item>
      <title>${escape(policy.data.title)} (v${escape(policy.data.version)})</title>
      <link>${base}${policyPath(policy.id)}</link>
      <guid isPermaLink="false">${base}${policyPath(policy.id)}@${escape(policy.data.version)}</guid>
      <pubDate>${policy.data.updated.toUTCString()}</pubDate>
      <description>${escape(policy.data.summary)}</description>
      <category>${escape(POLICY_SCOPE_LABELS[scope])} · ${isDraftDocument(policy.data.docStatus) ? 'draft' : 'current'}</category>
    </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Next Step Studios — Policies</title>
    <link>${base}/policies</link>
    <description>Changes to the public policy documents for the Next Step Studios Discord bot and website.</description>
    <language>en-GB</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
