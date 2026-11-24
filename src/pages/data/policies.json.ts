import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/site';
import {
  POLICY_SCOPE_LABELS,
  downloadKey,
  isDraftDocument,
  policyPath,
  scopeOf,
  slugOf,
} from '../../lib/documents';

export const prerender = true;

export const GET: APIRoute = async () => {
  const scopeRank = { bot: 0, website: 1, game: 2 } as const;
  const policies = (await getCollection('policies')).sort(
    (a, b) => scopeRank[scopeOf(a.id)] - scopeRank[scopeOf(b.id)] || a.data.order - b.data.order,
  );

  return new Response(
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        source: `${SITE.url}/policies`,
        note: 'Separate policy scopes. Markdown, plain-text, PDF and print editions are available under /downloads. Places Left Behind documents are published separately at /docs/places-left-behind.',
        count: policies.length,
        scopes: {
          bot: policies.filter((policy) => scopeOf(policy.id) === 'bot').length,
          website: policies.filter((policy) => scopeOf(policy.id) === 'website').length,
          game: policies.filter((policy) => scopeOf(policy.id) === 'game').length,
        },
        policies: policies.map((policy) => {
          const scope = scopeOf(policy.id);
          const key = downloadKey(policy.id);
          return {
            slug: slugOf(policy.id),
            key,
            scope,
            scopeLabel: POLICY_SCOPE_LABELS[scope],
            title: policy.data.title,
            shortTitle: policy.data.shortTitle,
            version: policy.data.version,
            status: policy.data.docStatus,
            draft: isDraftDocument(policy.data.docStatus),
            updated: policy.data.updated.toISOString().slice(0, 10),
            summary: policy.data.summary,
            url: `${SITE.url}${policyPath(policy.id)}`,
            markdown: `${SITE.url}/downloads/${key}.md`,
            plainText: `${SITE.url}/downloads/${key}.txt`,
            pdf: `${SITE.url}/downloads/${key}.pdf`,
          };
        }),
      },
      null,
      2,
    ),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
};
