import type { APIRoute, GetStaticPaths } from 'astro';
import { getDocuments } from '../../lib/documents';

/**
 * `/downloads/<key>.md` — the raw Markdown for a policy document.
 *
 * Bot documents keep their existing filenames; website documents are prefixed
 * with `website-`. Statically generated, so the file exists as a plain asset
 * after the build: no server, no database, no form and no email address.
 */
export const getStaticPaths = (async () => {
  const documents = await getDocuments();

  return documents.map((document) => ({
    params: { file: `${document.key}.md` },
    props: {
      markdown: document.markdown,
      fileName: `${document.key}.md`,
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
