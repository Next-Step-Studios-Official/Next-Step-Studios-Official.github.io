import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const policies = (await getCollection('policies')).sort((a, b) => a.data.order - b.data.order);

  return new Response(
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        source: `${SITE.url}/policies`,
        note: 'Markdown and plain-text editions are available under /downloads.',
        count: policies.length,
        policies: policies.map((policy) => ({
          slug: policy.id.replace(/^bot\//, ''),
          title: policy.data.title,
          shortTitle: policy.data.shortTitle,
          version: policy.data.version,
          status: policy.data.docStatus,
          updated: policy.data.updated.toISOString().slice(0, 10),
          summary: policy.data.summary,
          url: `${SITE.url}/policies/bot/${policy.id.replace(/^bot\//, '')}`,
          markdown: `${SITE.url}/downloads/${policy.id.replace(/^bot\//, '')}.md`,
          pdf: `${SITE.url}/downloads/${policy.id.replace(/^bot\//, '')}.pdf`,
        })),
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
