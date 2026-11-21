import type { APIRoute } from 'astro';
import { getDocuments } from '../../lib/documents';
import { SITE } from '../../lib/site';

export const prerender = true;

/**
 * `/downloads/all.md` — every public document in one file, for archiving or
 * reading offline. Order matches the policies index.
 */
export const GET: APIRoute = async () => {
  const documents = await getDocuments();

  const header = [
    '<!--',
    '  Next Step Studios — Discord bot documentation, complete set',
    '',
    `  ${documents.length} documents, all at the versions listed in each section.`,
    '  This is an offline copy of draft documents. The versions published on the',
    '  website are authoritative, and this file may become out of date.',
    '',
    `  Next Step Studios, operated by ${SITE.operator}.`,
    `  Contact: ${SITE.contactEmail}`,
    '-->',
    '',
    '# Next Step Studios — Bot documentation',
    '',
    `${documents.length} public documents. All drafts, versioned individually.`,
    '',
    '## Contents',
    '',
    ...documents.map((document, index) => `${index + 1}. ${document.title} — v${document.version}`),
    '',
  ].join('\n');

  const body = documents
    .map((document) => {
      const rule = '\n\n---\n\n';
      return `${rule}${document.markdown.trim()}\n`;
    })
    .join('');

  return new Response(`${header}${body}`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="next-step-studios-policies.md"',
    },
  });
};
