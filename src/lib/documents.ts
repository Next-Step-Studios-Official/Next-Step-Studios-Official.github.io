import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { SITE } from './site';
import { DOCS_POLICIES_URL, DOCS_REPO_URL } from './links';

/**
 * Downloadable editions of the Bot policy documents.
 *
 * Every policy page is generated from a Markdown file, so the site can also
 * serve that document as a plain `.md` file at a stable address
 * (`/downloads/<slug>.md`). One helper builds the file body so the download
 * page, the endpoint and the page sizes all agree.
 */

export const slugOf = (id: string) => id.replace(/^bot\//, '');

/**
 * Filenames of the published copies in the bot-documentation repository.
 * The keys are this site's slugs; the values are the files in `policies/`
 * on GitHub, which use longer kebab-case names.
 */
const REPO_FILE_BY_SLUG: Record<string, string> = {
  privacy: 'privacy-policy.md',
  terms: 'terms-of-service.md',
  'acceptable-use': 'acceptable-use-policy.md',
  'community-guidelines': 'community-guidelines.md',
  moderation: 'moderation-and-enforcement-policy.md',
  'data-retention': 'data-retention-and-deletion-policy.md',
  security: 'security-and-data-protection-overview.md',
};

/** The GitHub copy of a document, or the policies directory if it is unknown. */
export const githubUrlForSlug = (slug: string): string => {
  const file = REPO_FILE_BY_SLUG[slug];
  return file ? `${DOCS_REPO_URL}/blob/main/policies/${file}` : DOCS_POLICIES_URL;
};

export type PolicyEntry = CollectionEntry<'policies'>;

export type DownloadableDocument = {
  slug: string;
  fileName: string;
  title: string;
  shortTitle: string;
  version: string;
  docStatus: string;
  summary: string;
  order: number;
  /** The HTML page for this document. */
  pagePath: string;
  /** The `.md` file for this document. */
  downloadPath: string;
  /** This document's file in the GitHub repository. */
  githubUrl: string;
  bytes: number;
  markdown: string;
};

/**
 * The exact contents of the downloadable file: a short attribution header,
 * then the document body as written in `src/content/policies/`. No frontmatter
 * is emitted, so the file reads cleanly in any Markdown viewer or editor.
 */
export function buildDocumentFile(entry: PolicyEntry): string {
  const slug = slugOf(entry.id);
  const data = entry.data;

  const header = [
    '<!--',
    `  ${data.title}`,
    '  Next Step Studios - Discord bot documentation',
    '',
    `  Version:    ${data.version}`,
    `  Status:     ${data.docStatus}`,
    `  Applies to: ${data.appliesTo}`,
    '',
    `  Downloaded from: /policies/bot/${slug}`,
    '',
    '  This is an offline copy of a draft document. The version published at the',
    '  address above is the authoritative one, and this copy may become out of date.',
    '',
    `  Next Step Studios, operated by ${SITE.operator}.`,
    `  Contact: ${SITE.contactEmail}`,
    '-->',
    '',
    `# ${data.title}`,
    '',
    `> ${data.summary}`,
    '',
    `**Version ${data.version}** · ${data.docStatus} · Applies to: ${data.appliesTo}`,
    '',
  ].join('\n');

  return `${header}\n${(entry.body ?? '').trim()}\n`;
}

/** A readable plain-text rendition: no Markdown syntax, no HTML comments. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** The plain-text file for one document, with the same attribution header. */
export function buildPlainTextFile(document: DownloadableDocument): string {
  const rule = '='.repeat(72);
  return [
    rule,
    document.title.toUpperCase(),
    'Next Step Studios — Discord bot documentation',
    rule,
    '',
    `Version:    ${document.version}`,
    `Status:     ${document.docStatus}`,
    `Applies to: ${document.appliesTo}`,
    '',
    `Downloaded from: ${document.pagePath}`,
    '',
    'This is an offline copy of a draft document. The version published on the',
    'website is the authoritative one, and this copy may become out of date.',
    '',
    `Next Step Studios, operated by ${SITE.operator}.`,
    `Contact: ${SITE.contactEmail}`,
    '',
    rule,
    '',
    document.title,
    '',
    document.summary,
    '',
    toPlainText(document.markdown),
    '',
  ].join('\n');
}

export async function getDocuments(): Promise<DownloadableDocument[]> {
  const policies = await getCollection('policies');

  return policies
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => {
      const slug = slugOf(entry.id);
      const markdown = buildDocumentFile(entry);

      return {
        slug,
        fileName: `${slug}.md`,
        title: entry.data.title,
        shortTitle: entry.data.shortTitle,
        version: entry.data.version,
        docStatus: entry.data.docStatus,
        summary: entry.data.summary,
        order: entry.data.order,
        pagePath: `/policies/bot/${slug}`,
        downloadPath: `/downloads/${slug}.md`,
        githubUrl: githubUrlForSlug(slug),
        bytes: new TextEncoder().encode(markdown).length,
        markdown,
      };
    });
}
