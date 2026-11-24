/**
 * Import the Places Left Behind documentation from the read-only game folder.
 *
 * The game repository remains authoritative. This script:
 *   1. refuses to import if documentation files have uncommitted changes,
 *      while tolerating unrelated source-code edits in the worktree;
 *   2. requires every licensing Markdown file to be tracked by Git;
 *   3. copies the wording into the website content collection;
 *   4. rewrites relative links to website pages while leaving the prose alone;
 *   5. records the exact source commit and a hash-ready inventory.
 *
 * It never writes to the game folder and does not use the network.
 *
 * Usage:
 *   npm run docs:sync -- "C:\path\to\Places Left Behind"
 *   PLACES_LEFT_BEHIND_DIR="C:\path\to\Places Left Behind" npm run docs:sync
 */
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const gameDirectory = process.argv[2] ?? process.env.PLACES_LEFT_BEHIND_DIR;

if (!gameDirectory) {
  console.error('Pass the game folder as an argument, or set PLACES_LEFT_BEHIND_DIR.');
  console.error('Example: npm run docs:sync -- "C:\\Users\\Panda\\Documents\\CustomGames\\Places Left Behind"');
  process.exit(1);
}

const gameRoot = resolve(gameDirectory);
const contentDirectory = join(projectRoot, 'src/content/places-left-behind-docs');
const sourceDataPath = join(projectRoot, 'src/data/places-left-behind-docs-source.json');
const categoryPath = join(projectRoot, 'src/data/places-left-behind-categories.json');
const docsIndex = '/docs/places-left-behind';
const sourceOnlyUrl = `${docsIndex}/#source-only-files`;

const categoryByDirectory = {
  'Documentation/Licensing': 'foundations',
  'Documentation/Licensing/Assets': 'assets',
  'Documentation/Licensing/Commercial': 'commercial',
  'Documentation/Licensing/Compliance': 'compliance',
  'Documentation/Licensing/Contributors': 'contributors',
  'Documentation/Licensing/Future': 'future',
  'Documentation/Licensing/Modding': 'modding',
  'Documentation/Licensing/Privacy': 'privacy',
  'Documentation/Licensing/Prototype': 'prototype',
  'Documentation/Licensing/ThirdParty': 'third-party',
};

const technicalDocuments = [
  {
    source: 'Documentation/Architecture.md',
    category: 'engineering',
    version: 'Not versioned',
    docStatus: 'Reference',
    summary: "The solution's engine and game split, world and entity architecture, rendering direction and asset pipeline.",
    order: 10,
  },
  {
    source: 'Documentation/Development.md',
    category: 'engineering',
    version: 'Not versioned',
    docStatus: 'Reference',
    summary: 'Naming, asset and general development rules used in the game repository.',
    order: 20,
  },
  {
    source: 'Documentation/Git-Conventions.md',
    category: 'engineering',
    version: '0.1.0',
    docStatus: 'Reference',
    summary: 'Commit message structure, commit types, and the Git workflow used for the game.',
    order: 30,
  },
];

const foundationOrder = new Map([
  ['Documentation/Licensing/README.md', 10],
  ['Documentation/Licensing/Project-Licensing.md', 20],
  ['Documentation/Licensing/Game-Licensing.md', 30],
  ['Documentation/Licensing/Engine-Licensing.md', 40],
  ['Documentation/Licensing/Website-Policy-Integration.md', 50],
]);

const excluded = [
  {
    path: 'LICENSE',
    reason: 'Standalone project licence; not a documentation entry.',
  },
  {
    path: 'LICENSE.md',
    reason: 'Markdown copy of the standalone project licence; not a documentation entry.',
  },
  {
    path: 'Source/Engine/LICENSE',
    reason: 'Standalone engine licence; not a documentation entry.',
  },
  {
    path: 'Source/Engine/LICENSE.md',
    reason: 'Markdown copy of the standalone engine licence; not a documentation entry.',
  },
  {
    path: 'Source/Game/LICENSE',
    reason: 'Standalone game-scope licence notice; not a documentation entry.',
  },
  {
    path: 'Source/Game/LICENSE.md',
    reason: 'Markdown copy of the standalone game-scope notice; not a documentation entry.',
  },
  {
    path: 'THIRD-PARTY-NOTICES.txt',
    reason: 'Third-party attribution file. The Third-Party Licenses document is published instead.',
  },
  {
    path: 'Scripts/Build.ps1',
    reason: 'Build script. Referenced by the packaging checklist; not documentation.',
  },
  {
    path: 'Scripts/Run.ps1',
    reason: 'Run script. Referenced by the packaging checklist; not documentation.',
  },
  {
    path: 'README.md',
    reason: 'Repository overview; the public project page carries the current summary.',
  },
  {
    path: 'Assets/Fonts/README.md',
    reason: 'Asset-folder note; font licensing is covered by the published asset documents.',
  },
];

const runGit = (...args) =>
  execFileSync('git', ['-C', gameRoot, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();

const fail = (message) => {
  console.error(`[docs:sync] ${message}`);
  process.exit(1);
};

let tracked = [];
try {
  tracked = runGit('ls-files').split(/\r?\n/).filter(Boolean);
} catch (error) {
  fail(`Could not read the game repository at ${gameRoot}: ${error.message}`);
}

const commit = runGit('rev-parse', 'HEAD');
const commitDate = runGit('show', '-s', '--format=%cI', 'HEAD');
// Keep the leading status column: `.trim()` would eat the first path's first
// character when a line starts with a space.
const dirty = execFileSync('git', ['-C', gameRoot, 'status', '--porcelain'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});
const dirtyPaths = dirty
  ? dirty.split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).trim())
  : [];
const dirtyDocumentation = dirtyPaths.filter(
  (path) => path.startsWith('Documentation/') || path === 'README.md' || path === 'Assets/Fonts/README.md',
);
if (dirtyDocumentation.length > 0) {
  fail(
    `The game documentation has uncommitted changes: ${dirtyDocumentation.join(', ')}. Commit them before syncing so the website records a real source revision.`,
  );
}
if (dirtyPaths.length > 0) {
  console.warn(
    `[docs:sync] The game worktree has unrelated changes (${dirtyPaths.join(', ')}). The documentation itself is clean at ${commit.slice(0, 7)}; only the committed document text is imported.`,
  );
}

const licensingFiles = tracked
  .filter((path) => path.startsWith('Documentation/Licensing/') && path.endsWith('.md'))
  .sort();
const technicalPaths = technicalDocuments.map((document) => document.source);
const allVerifiedPaths = [...licensingFiles, ...technicalPaths];

if (licensingFiles.length === 0) fail('No Markdown documents were found under Documentation/Licensing.');

for (const path of technicalPaths) {
  if (!tracked.includes(path)) fail(`Expected source file is not tracked: ${path}`);
}

const categories = JSON.parse(await readFile(categoryPath, 'utf8'));
const categoryIds = new Set(categories.map((category) => category.id));

const rows = [];
const slugSet = new Set();

const titleFor = (text) => text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';
const tableValue = (text, label) => {
  const line = text
    .split(/\r?\n/)
    .find((candidate) => new RegExp(`^\\|\\s*${label}\\s*\\|`).test(candidate));
  return line ? (line.split('|')[2] ?? '').trim() : '';
};
const slugFor = (source) => {
  if (source === 'Documentation/Licensing/README.md') return 'licensing-index';
  return posix
    .basename(source, '.md')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const applyLinks = (markdown, source, docPathBySource) => {
  const unmapped = new Set();

  const rewritePart = (part) =>
    part.replace(/\]\(([^)\s]+)([^)]*)\)/g, (whole, destination, tail) => {
      if (/^(?:https?:|mailto:|tel:|#|\/)/i.test(destination)) return whole;

      const [target, anchor] = destination.split('#');
      if (!target) return whole;

      const resolved = posix.normalize(posix.join(posix.dirname(source), target));
      const mapped = docPathBySource.get(resolved);
      const url = mapped ?? sourceOnlyUrl;
      if (!mapped) unmapped.add(resolved);

      return `](${url}${anchor ? `#${anchor}` : ''}${tail})`;
    });

  const body = markdown
    .split(/(```[\s\S]*?```)/g)
    .map((part, index) => (index % 2 === 0 ? rewritePart(part) : part))
    .join('');

  return { body, unmapped };
};

// First pass: metadata. Slugs are needed before relative links can be mapped.
for (const source of allVerifiedPaths) {
  const text = (await readFile(join(gameRoot, source), 'utf8')).replace(/^\uFEFF/, '');
  if (/^---\s*\r?\n/.test(text)) fail(`${source} already has frontmatter. This importer expects plain source Markdown.`);

  const technical = technicalDocuments.find((document) => document.source === source);
  const directory = posix.dirname(source);
  const category = technical?.category ?? categoryByDirectory[directory];
  if (!category || !categoryIds.has(category)) fail(`No public category is configured for ${source}.`);

  const slug = slugFor(source);
  if (slugSet.has(slug)) fail(`Two documents would use the slug "${slug}".`);
  slugSet.add(slug);

  const title = titleFor(text) || technical?.source;
  const version = technical?.version ?? tableValue(text, 'Version');
  const docStatus = technical?.docStatus ?? tableValue(text, 'Status');
  const summary = technical?.summary ?? tableValue(text, 'Scope');
  const sourceId = technical ? '' : tableValue(text, 'Document ID');
  const lastRevised = technical ? '' : tableValue(text, 'Last revised');

  if (!title) fail(`No level-one title found in ${source}.`);
  if (!version) fail(`No version found in ${source}.`);
  if (!docStatus) fail(`No status found in ${source}.`);
  if (!summary) fail(`No scope summary found in ${source}.`);
  if (lastRevised && !/^\d{4}-\d{2}-\d{2}$/.test(lastRevised)) {
    fail(`Unrecognised Last revised value in ${source}: ${lastRevised}`);
  }

  const order =
    technical?.order ??
    foundationOrder.get(source) ??
    (rows.filter((row) => row.category === category).length + 1) * 10;

  // The page renders the title from frontmatter. Removing the duplicate H1
  // keeps one document heading and gives the in-page contents a clean start.
  const body = text
    .replace(/^\uFEFF/, '')
    .replace(/^\s*#\s+[^\r\n]*\r?\n+/, '');

  rows.push({
    source,
    slug,
    title,
    version,
    docStatus,
    summary,
    sourceId,
    category,
    order,
    lastRevised,
    legal: !technical,
    body,
  });
}

const docPathBySource = new Map(rows.map((row) => [row.source, `${docsIndex}/${row.slug}`]));
const sourceOnlyLinks = new Set();

for (const row of rows) {
  const { body, unmapped } = applyLinks(row.body, row.source, docPathBySource);
  for (const target of unmapped) sourceOnlyLinks.add(target);
  row.body = body;
}

await rm(contentDirectory, { recursive: true, force: true });
await mkdir(contentDirectory, { recursive: true });

const quote = (value) => JSON.stringify(value);

for (const row of rows) {
  const frontmatter = [
    '---',
    `title: ${quote(row.title)}`,
    `version: ${quote(row.version)}`,
    `docStatus: ${quote(row.docStatus)}`,
    `summary: ${quote(row.summary)}`,
    `sourceId: ${quote(row.sourceId)}`,
    `sourcePath: ${quote(row.source)}`,
    `category: ${quote(row.category)}`,
    `order: ${row.order}`,
    ...(row.lastRevised ? [`lastRevised: ${quote(row.lastRevised)}`] : []),
    `sourceCommit: ${quote(commit)}`,
    `legal: ${row.legal}`,
    '---',
    '',
  ].join('\n');

  await writeFile(join(contentDirectory, `${row.slug}.md`), `${frontmatter}${row.body.trim()}\n`);
}

await writeFile(
  sourceDataPath,
  `${JSON.stringify(
    {
      repository: 'Pandagamerteen08/Places-Left-Behind',
      commit,
      shortCommit: commit.slice(0, 7),
      commitDate,
      syncedAt: new Date().toISOString(),
      sourceRoot: 'Documentation',
      documentCount: rows.length,
      licensingDocumentCount: licensingFiles.length,
      engineeringDocumentCount: technicalDocuments.length,
      excluded,
      sourceOnlyLinks: [...sourceOnlyLinks].sort(),
    },
    null,
    2,
  )}\n`,
);

console.log(`[docs:sync] Imported ${rows.length} documents from ${commit.slice(0, 7)}.`);
console.log(`[docs:sync] ${licensingFiles.length} licensing documents and ${technicalDocuments.length} engineering references.`);
console.log(`[docs:sync] ${sourceOnlyLinks.size} source-only link targets now point at the documentation index.`);
