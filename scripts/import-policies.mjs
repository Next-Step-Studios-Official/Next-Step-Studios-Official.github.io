/**
 * One-time import of the seven PUBLIC Discord Bot policy documents.
 *
 * The documents' substance is copied verbatim. Only the leading metadata block
 * (title, version, status, prepared date, applies-to) is lifted out of the body
 * and into structured frontmatter, because the site renders that information as
 * metadata above the document instead of as duplicate prose.
 *
 * Source: the documentation package supplied by the Operator (PUBLIC folder only).
 * Run with: node scripts/import-policies.mjs <path-to-PUBLIC-folder>
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error('Usage: node scripts/import-policies.mjs <path-to-PUBLIC-folder>');
  process.exit(1);
}

const documents = [
  {
    file: 'TERMS_OF_SERVICE.md',
    slug: 'terms',
    title: 'Discord Bot Terms of Service',
    shortTitle: 'Terms of Service',
    order: 1,
    summary: 'The terms governing use of the Next Step Studios Discord bot.',
  },
  {
    file: 'PRIVACY_POLICY.md',
    slug: 'privacy',
    title: 'Discord Bot Privacy Policy',
    shortTitle: 'Privacy Policy',
    order: 2,
    summary: 'What information the Discord bot processes and stores, and how to submit a privacy request.',
  },
  {
    file: 'ACCEPTABLE_USE_POLICY.md',
    slug: 'acceptable-use',
    title: 'Discord Bot Acceptable Use Policy',
    shortTitle: 'Acceptable Use Policy',
    order: 3,
    summary: 'What is and is not permitted when using the Discord bot.',
  },
  {
    file: 'COMMUNITY_GUIDELINES.md',
    slug: 'community-guidelines',
    title: 'Discord Bot Community Guidelines',
    shortTitle: 'Community Guidelines',
    order: 4,
    summary: 'Expected conduct in the Next Step Studios Discord server.',
  },
  {
    file: 'MODERATION_AND_ENFORCEMENT_POLICY.md',
    slug: 'moderation',
    title: 'Discord Bot Moderation and Enforcement Policy',
    shortTitle: 'Moderation and Enforcement Policy',
    order: 5,
    summary: 'How moderation decisions are made and enforced.',
  },
  {
    file: 'DATA_RETENTION_AND_DELETION_POLICY.md',
    slug: 'data-retention',
    title: 'Discord Bot Data Retention and Deletion Policy',
    shortTitle: 'Data Retention and Deletion Policy',
    order: 6,
    summary: 'How long the Discord bot retains information, and how it is deleted.',
  },
  {
    file: 'SECURITY_AND_DATA_PROTECTION_OVERVIEW.md',
    slug: 'security',
    title: 'Discord Bot Security and Data Protection Overview',
    shortTitle: 'Security and Data Protection Overview',
    order: 7,
    summary: 'The security and data protection practices described for the Discord bot.',
  },
];

const outDir = join('src', 'content', 'policies', 'bot');
await mkdir(outDir, { recursive: true });

/** Pull a `**Field:** value` line out of the document header. */
function readField(header, label) {
  const match = header.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*(.+)`));
  return match ? match[1].replace(/\s+$/, '') : '';
}

for (const document of documents) {
  const raw = await readFile(join(sourceDir, document.file), 'utf8');

  // The header block ends at the first horizontal rule.
  const ruleIndex = raw.indexOf('\n---\n');
  if (ruleIndex === -1) {
    console.error(`Could not find the header block in ${document.file}`);
    process.exit(1);
  }
  const header = raw.slice(0, ruleIndex);
  const body = raw.slice(ruleIndex + 5).trimStart();

  const version = readField(header, 'Document version');
  const status = readField(header, 'Status');
  const appliesTo = readField(header, 'Applies to');

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(document.title)}`,
    `shortTitle: ${JSON.stringify(document.shortTitle)}`,
    `version: ${JSON.stringify(version)}`,
    `docStatus: ${JSON.stringify(status)}`,
    `appliesTo: ${JSON.stringify(appliesTo)}`,
    `order: ${document.order}`,
    `summary: ${JSON.stringify(document.summary)}`,
    '---',
    '',
    '',
  ].join('\n');

  await writeFile(join(outDir, `${document.slug}.md`), frontmatter + body, 'utf8');
  console.log(`Imported ${document.file} -> ${outDir}/${document.slug}.md (v${version})`);
}
