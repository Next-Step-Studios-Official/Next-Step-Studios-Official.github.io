import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { SITE } from './site';
import { DOCS_POLICIES_URL, DOCS_REPO_URL } from './links';

/**
 * Downloadable editions of the public policy documents.
 *
 * Every policy page is generated from a Markdown file, so the site can also
 * serve that document as a plain `.md` file at a stable address. One helper
 * builds the file body so the download page, the endpoints and the page sizes
 * all agree.
 *
 * Documents live in separate sets:
 *   - `bot/`     — the Discord bot, at /policies/bot/<slug>
 *   - `website/` — this website, at /policies/website/<slug>
 *   - `game/`    — Places Left Behind, at /policies/game/<slug>
 *
 * The game set is supported by the publishing system but has no published
 * documents yet. Nothing may be added there until the actual game documents
 * exist; the policy index presents the scope as in preparation.
 *
 * File downloads and version snapshots use one flat key. Bot documents keep
 * their existing filenames (`privacy.md`); other scopes are prefixed
 * (`website-privacy.md`, `game-privacy.md`) so documents called "privacy"
 * cannot collide.
 */

export type PolicyScope = 'bot' | 'website' | 'game';

export const POLICY_SCOPES: PolicyScope[] = ['bot', 'website', 'game'];

export const POLICY_SCOPE_LABELS: Record<PolicyScope, string> = {
  bot: 'Discord bot',
  website: 'Website',
  game: 'Places Left Behind',
};

export const POLICY_SCOPE_DESCRIPTIONS: Record<PolicyScope, string> = {
  bot: 'The bot operating in one private Discord server, and the records it keeps.',
  website: 'This public site: what it collects, the rules for using it, copyright and security.',
  game: 'The game as a separate product: licensing, EULA, privacy, modding and distribution. No game policy is published yet.',
};

/** The directory in `src/content/policies` a document belongs to. */
export const scopeOf = (id: string): PolicyScope => {
  const prefix = id.split('/')[0];
  return POLICY_SCOPES.includes(prefix as PolicyScope) ? (prefix as PolicyScope) : 'bot';
};

/** The document's own slug, without its scope directory. */
export const slugOf = (id: string) => id.split('/').filter(Boolean).pop() ?? id;

/** The public page for a document. */
export const policyPath = (id: string) => `/policies/${scopeOf(id)}/${slugOf(id)}`;

/** A flat, collision-free key for downloads and version snapshots. */
export const downloadKey = (id: string) => {
  const scope = scopeOf(id);
  const slug = slugOf(id);
  return scope === 'bot' ? slug : `${scope}-${slug}`;
};

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

/**
 * The GitHub copy of a bot document, or the policies directory if it is
 * unknown. Website documents are written for this repository, so they have no
 * mirror in the bot-documentation repository.
 */
export const githubUrlForSlug = (slug: string): string => {
  const file = REPO_FILE_BY_SLUG[slug];
  return file ? `${DOCS_REPO_URL}/blob/main/policies/${file}` : DOCS_POLICIES_URL;
};

export const githubUrlForPolicy = (id: string): string | null =>
  scopeOf(id) === 'bot' ? githubUrlForSlug(slugOf(id)) : null;

export type PolicyEntry = CollectionEntry<'policies'>;

export type DownloadableDocument = {
  /** Flat key used by downloads and version snapshots. */
  key: string;
  slug: string;
  scope: PolicyScope;
  scopeLabel: string;
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
  /** This document's file in the GitHub repository, when it has one. */
  githubUrl: string | null;
  bytes: number;
  markdown: string;
};

export const isDraftDocument = (docStatus: string) => /draft/i.test(docStatus);

/**
 * The exact contents of the downloadable file: a short attribution header,
 * then the document body as written in `src/content/policies/`. No frontmatter
 * is emitted, so the file reads cleanly in any Markdown viewer or editor.
 */
export function buildDocumentFile(entry: PolicyEntry): string {
  const scope = scopeOf(entry.id);
  const data = entry.data;
  const draft = isDraftDocument(data.docStatus);

  const header = [
    '<!--',
    `  ${data.title}`,
    `  ${SITE.name} - ${POLICY_SCOPE_LABELS[scope]} documentation`,
    '',
    `  Version:    ${data.version}`,
    `  Status:     ${data.docStatus}`,
    `  Applies to: ${data.appliesTo}`,
    '',
    `  Downloaded from: ${policyPath(entry.id)}`,
    '',
    ...(draft
      ? [
          '  This document is a draft for review and is not yet effective.',
          '',
        ]
      : []),
    '  This is an offline copy. The version published at the address above is',
    '  the authoritative one, and this copy may become out of date.',
    '',
    `  ${SITE.copyright}`,
    `  Contact: ${SITE.contactEmail}`,
    '-->',
    '',
    `# ${data.title}`,
    '',
    `> ${data.summary}`,
    '',
    `**Plain-language summary:** ${data.plainSummary}`,
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
  const draft = isDraftDocument(document.docStatus);

  return [
    rule,
    document.title.toUpperCase(),
    `${SITE.name} — ${document.scopeLabel} documentation`,
    rule,
    '',
    `Version:    ${document.version}`,
    `Status:     ${document.docStatus}`,
    `Applies to: ${document.appliesTo}`,
    '',
    `Downloaded from: ${document.pagePath}`,
    '',
    ...(draft
      ? ['This document is a draft for review and is not yet effective.', '']
      : []),
    'This is an offline copy. The version published on the website is the',
    'authoritative one, and this copy may become out of date.',
    '',
    SITE.copyright,
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
  const scopeRank: Record<PolicyScope, number> = { bot: 0, website: 1, game: 2 };

  return policies
    .sort(
      (a, b) =>
        scopeRank[scopeOf(a.id)] - scopeRank[scopeOf(b.id)] || a.data.order - b.data.order,
    )
    .map((entry) => {
      const scope = scopeOf(entry.id);
      const slug = slugOf(entry.id);
      const key = downloadKey(entry.id);
      const markdown = buildDocumentFile(entry);

      return {
        key,
        slug,
        scope,
        scopeLabel: POLICY_SCOPE_LABELS[scope],
        fileName: `${key}.md`,
        title: entry.data.title,
        shortTitle: entry.data.shortTitle,
        version: entry.data.version,
        docStatus: entry.data.docStatus,
        summary: entry.data.summary,
        order: entry.data.order,
        pagePath: policyPath(entry.id),
        downloadPath: `/downloads/${key}.md`,
        githubUrl: githubUrlForPolicy(entry.id),
        bytes: new TextEncoder().encode(markdown).length,
        markdown,
      };
    });
}
