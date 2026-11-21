/**
 * Content guard, run before every build.
 *
 * The documentation package this site draws from has a PUBLIC folder and an
 * INTERNAL folder. Only PUBLIC documents may ever reach the website. This
 * script fails the build if anything that looks like internal documentation
 * ends up in the content collections.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const CONTENT_ROOT = 'src/content';

const FORBIDDEN_PATH_PARTS = ['internal', 'INTERNAL'];
const FORBIDDEN_MARKERS = [
  'DO NOT DISTRIBUTE TO SERVER MEMBERS OR THE PUBLIC',
  'Classification:** INTERNAL',
  'Classification: INTERNAL',
];
const FORBIDDEN_FILENAMES = [
  'README_FIRST',
  'CLAUDE_WEBSITE_BUILD_PROMPT',
  'POLICY_CHANGELOG',
  'POLICY_IMPLEMENTATION_CHECKLIST',
  'DATA_BREACH_RESPONSE_PLAN',
  'SECURITY_POLICY',
  'BOT_DATA_AND_FEATURE_REGISTER',
  'BOT_RELEASE_READINESS_CHECKLIST',
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (['.md', '.mdx'].includes(extname(entry.name))) files.push(full);
  }
  return files;
}

const problems = [];
let files = [];

try {
  files = await walk(CONTENT_ROOT);
} catch (error) {
  console.error(`[verify-content] Could not read ${CONTENT_ROOT}: ${error.message}`);
  process.exit(1);
}

for (const file of files) {
  const lower = file.toLowerCase();
  for (const part of FORBIDDEN_PATH_PARTS) {
    if (lower.includes(`/${part}/`)) problems.push(`${file}: lives under an internal-only path`);
  }
  const base = file.split('/').pop().replace(extname(file), '');
  if (FORBIDDEN_FILENAMES.some((name) => base.toUpperCase() === name)) {
    problems.push(`${file}: filename matches an internal-only document`);
  }
  const body = await readFile(file, 'utf8');
  for (const marker of FORBIDDEN_MARKERS) {
    if (body.includes(marker)) problems.push(`${file}: contains internal-only marker "${marker}"`);
  }
}

if (problems.length > 0) {
  console.error('[verify-content] Refusing to build. Internal material was found in public content:\n');
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error('\nOnly documents from the PUBLIC folder may be published.');
  process.exit(1);
}

console.log(`[verify-content] OK — ${files.length} content files checked, no internal material found.`);
