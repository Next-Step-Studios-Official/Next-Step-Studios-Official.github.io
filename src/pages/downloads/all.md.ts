import type { APIRoute } from 'astro';
import { getDocuments } from '../../lib/documents';
import { SITE } from '../../lib/site';

export const prerender = true;

/**
 * `/downloads/all.md` — every public document in one file, for archiving or
 * reading offline. Order matches the policies index: bot, then website.
 */
export const GET: APIRoute = async () => {
  const documents = await getDocuments();

  const header = [
    '<!--',
    '  Next Step Studios — complete public document set',
    '',
    `  ${documents.length} documents across the Discord bot and website sets,`,
    '  all at the versions listed in each section.',
    '  This is an offline copy. The versions published on the website are',
    '  authoritative, and this file may become out of date.',
    '',
    `  Next Step Studios, operated by ${SITE.operator}.`,
    `  Contact: ${SITE.contactEmail}`,
    '-->',
    '',
    '# Next Step Studios — Policies',
    '',
    `${documents.length} public documents in two separate scopes. Drafts and current`,
    'documents are labelled individually.',
    '',
    '## Contents',
    '',
    ...documents.map(
      (document, index) =>
        `${index + 1}. [${document.scopeLabel}] ${document.title} — v${document.version}`,
    ),
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
