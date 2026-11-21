import type { APIRoute, GetStaticPaths } from 'astro';
import { buildPlainTextFile, getDocuments } from '../../lib/documents';

export const prerender = true;

/** `/downloads/<slug>.txt` — the same document with no Markdown syntax at all. */
export const getStaticPaths = (async () => {
  const documents = await getDocuments();

  return documents.map((document) => ({
    params: { slug: document.slug },
    props: { body: buildPlainTextFile(document), fileName: `${document.slug}.txt` },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { body, fileName } = props as { body: string; fileName: string };

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
};
