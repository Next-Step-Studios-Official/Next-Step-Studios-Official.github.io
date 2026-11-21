#!/usr/bin/env node
/**
 * Record the current body of every policy as a version snapshot.
 *
 * The snapshot filename is the version in the document's frontmatter, so
 * running this after a version bump creates a new file and leaves the old one
 * untouched. If the text changes without a version bump, the existing snapshot
 * is left alone on purpose: the versions page then shows a diff, which is the
 * signal that a version needs publishing.
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { join } from 'node:path';

const SOURCE = 'src/content/policies/bot';
const TARGET = 'src/data/policy-snapshots';

const files = (await (await import('node:fs/promises')).readdir(SOURCE)).filter((file) =>
  file.endsWith('.md'),
);

let recorded = 0;
let skipped = 0;

for (const file of files) {
  const raw = await readFile(join(SOURCE, file), 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    console.warn(`  skip ${file}: no frontmatter`);
    continue;
  }

  const versionLine = match[1].match(/^version:\s*(.+)$/m);
  const version = (versionLine?.[1] ?? '').trim().replace(/^["']|["']$/g, '');
  if (!version) {
    console.warn(`  skip ${file}: no version`);
    continue;
  }

  const slug = file.replace(/\.md$/, '');
  const directory = join(TARGET, slug);
  const target = join(directory, `${version}.md`);

  try {
    await access(target);
    skipped += 1;
    console.log(`  exists ${slug} ${version}`);
    continue;
  } catch {
    // Not recorded yet, which is the normal case for a new version.
  }

  await mkdir(directory, { recursive: true });
  await writeFile(target, `${match[2].trim()}\n`, 'utf8');
  recorded += 1;
  console.log(`  recorded ${slug} ${version}`);
}

console.log(`\n${recorded} recorded, ${skipped} already present.`);
