#!/usr/bin/env node
/**
 * Record the current body of every policy as a version snapshot.
 *
 * The snapshot filename is the version in the document's frontmatter, so
 * running this after a version bump creates a new file and leaves the old one
 * untouched. If the text changes without a version bump, the existing snapshot
 * is left alone on purpose: the versions page then shows a diff, which is the
 * signal that a version needs publishing.
 *
 * Both scopes are recorded. Bot documents keep their existing snapshot folder
 * (`privacy/`); website documents are prefixed (`website-privacy/`) so two
 * documents called "privacy" cannot collide.
 */
import { readFile, writeFile, mkdir, access, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const SOURCES = ['bot', 'website'];
const TARGET = 'src/data/policy-snapshots';

let recorded = 0;
let skipped = 0;

for (const scope of SOURCES) {
  const source = join('src/content/policies', scope);

  let files;
  try {
    files = (await readdir(source)).filter((file) => file.endsWith('.md'));
  } catch {
    console.warn(`  skip ${source}: directory not found`);
    continue;
  }

  for (const file of files) {
    const raw = await readFile(join(source, file), 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
      console.warn(`  skip ${scope}/${file}: no frontmatter`);
      continue;
    }

    const versionLine = match[1].match(/^version:\s*(.+)$/m);
    const version = (versionLine?.[1] ?? '').trim().replace(/^["']|["']$/g, '');
    if (!version) {
      console.warn(`  skip ${scope}/${file}: no version`);
      continue;
    }

    const slug = file.replace(/\.md$/, '');
    const key = scope === 'bot' ? slug : `${scope}-${slug}`;
    const directory = join(TARGET, key);
    const target = join(directory, `${version}.md`);

    try {
      await access(target);
      skipped += 1;
      console.log(`  exists ${key} ${version}`);
      continue;
    } catch {
      // Not recorded yet, which is the normal case for a new version.
    }

    await mkdir(directory, { recursive: true });
    await writeFile(target, `${match[2].trim()}\n`, 'utf8');
    recorded += 1;
    console.log(`  recorded ${key} ${version}`);
  }
}

console.log(`\n${recorded} recorded, ${skipped} already present.`);
