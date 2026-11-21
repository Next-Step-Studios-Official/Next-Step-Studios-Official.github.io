import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { buildDocumentFile, slugOf } from '../../lib/documents';

/**
 * `/downloads/<slug>.md` — the raw Markdown for a Bot policy document.
 *
 * Statically generated, so the file exists as a plain asset after the build:
 * no server, no database, no form and no email address required.
 */
export const getStaticPaths = (async () => {
  const policies = await getCollection('policies');

  return policies.map((entry) => ({
    params: { file: `${slugOf(entry.id)}.md` },
    props: {
      markdown: buildDocumentFile(entry),
      fileName: `${slugOf(entry.id)}.md`,
    },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { markdown, fileName } = props as { markdown: string; fileName: string };

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
};
