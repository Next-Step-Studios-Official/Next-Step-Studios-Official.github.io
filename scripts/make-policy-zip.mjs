#!/usr/bin/env node
/**
 * Builds one ZIP containing the complete public policy set.
 *
 *   npm run policies:zip
 *
 * The archive is assembled with node:zlib, so the build gains no dependency.
 * Every document keeps the same attribution header as its individual download;
 * the ZIP also contains a combined Markdown file and a README.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ROOT = path.resolve('src/content/policies');
const OUTPUT = path.resolve('public/downloads/next-step-studios-policies.zip');
const OPERATOR = 'Candler Shaw';
const CONTACT = 'nextstepstudiosofficial.contact@gmail.com';
const COPYRIGHT =
  'Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.';

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: source };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w]*):\s*(.*)$/);
    if (!field) continue;
    const [, key, raw] = field;
    const quoted = raw.match(/^["'](.*)["']$/);
    data[key] = quoted ? quoted[1] : raw;
  }
  return { data, body: match[2] };
}

const scopeRank = { bot: 0, website: 1, game: 2 };

const files = fs
  .readdirSync(ROOT, { recursive: true })
  .filter((file) => typeof file === 'string' && file.endsWith('.md'))
  .map((file) => {
    const full = path.join(ROOT, file);
    const source = fs.readFileSync(full, 'utf8');
    const { data, body } = parseFrontmatter(source);
    const relative = file.replace(/\\/g, '/');
    const scope = relative.startsWith('website/')
      ? 'website'
      : relative.startsWith('game/')
        ? 'game'
        : 'bot';
    const slug = path.basename(file, '.md');
    return {
      slug,
      key: scope === 'bot' ? slug : `${scope}-${slug}`,
      scope,
      scopeLabel:
        scope === 'bot' ? 'Discord bot' : scope === 'website' ? 'Website' : 'Places Left Behind',
      data,
      body,
      order: Number(data.order) || 100,
    };
  })
  .sort((a, b) => scopeRank[a.scope] - scopeRank[b.scope] || a.order - b.order);

if (files.length === 0) {
  console.error('No policy documents found.');
  process.exit(1);
}

const updated = files
  .map((file) => String(file.data.updated ?? ''))
  .filter(Boolean)
  .sort()
  .at(-1);
const generated = updated || new Date().toISOString().slice(0, 10);
const generatedDate = new Date(`${generated}T12:00:00Z`);

const documentMarkdown = (file) => {
  const data = file.data;
  const draft = /draft/i.test(data.docStatus ?? '');
  const header = [
    '<!--',
    `  ${data.title ?? file.slug}`,
    `  Next Step Studios - ${file.scopeLabel} documentation`,
    '',
    `  Version:    ${data.version ?? '—'}`,
    `  Status:     ${data.docStatus ?? 'Draft'}`,
    `  Applies to: ${data.appliesTo ?? file.scopeLabel}`,
    '',
    `  Downloaded from: /policies/${file.scope}/${file.slug}`,
    '',
    ...(draft
      ? ['  This document is a draft for review and is not yet effective.', '']
      : []),
    '  This is an offline copy. The version published at the address above is',
    '  the authoritative one, and this copy may become out of date.',
    '',
    `  ${COPYRIGHT}`,
    `  Contact: ${CONTACT}`,
    '-->',
    '',
    `# ${data.title ?? file.slug}`,
    '',
    `> ${data.summary ?? ''}`,
    '',
    `**Plain-language summary:** ${data.plainSummary ?? ''}`,
    '',
    `**Version ${data.version ?? '—'}** · ${data.docStatus ?? 'Draft'} · Applies to: ${data.appliesTo ?? file.scopeLabel}`,
    '',
  ].join('\n');

  return `${header}\n${(file.body ?? '').trim()}\n`;
};

const combinedHeader = [
  '<!--',
  '  Next Step Studios — complete public document set',
  '',
  `  ${files.length} documents across the published policy scopes,`,
  '  all at the versions listed in each section.',
  '  This is an offline copy. The versions published on the website are',
  '  authoritative, and this file may become out of date.',
  '',
  `  ${COPYRIGHT}`,
  `  Contact: ${CONTACT}`,
  '-->',
  '',
  '# Next Step Studios — Policies',
  '',
  `${files.length} public documents in two separate scopes. Drafts and current`,
  'documents are labelled individually.',
  '',
  '## Contents',
  '',
  ...files.map(
    (file, index) =>
      `${index + 1}. [${file.scopeLabel}] ${file.data.title ?? file.slug} — v${file.data.version ?? '—'}`,
  ),
  '',
].join('\n');

const combined = `${combinedHeader}${files
  .map((file) => `\n---\n\n${documentMarkdown(file).trim()}\n`)
  .join('')}`;

const readme = `Next Step Studios — complete policy set
Generated ${generated}

WHAT IS IN HERE

  README.txt              This file.
  all-policies.md         Every document in one file, in publishing order.
  bot/<slug>.md           The Discord bot documents.
  website/<slug>.md       The website documents.
  game/<slug>.md          The Places Left Behind documents, when published.

DOCUMENTS

${files.map((file) => `  ${file.scope.padEnd(8)} ${file.slug.padEnd(24)} ${file.data.shortTitle ?? file.data.title ?? file.slug} — v${file.data.version ?? '—'}`).join('\n')}

STATUS

${files.filter((file) => /draft/i.test(file.data.docStatus ?? '')).length} of ${files.length} documents are drafts for review and are not yet effective.
The website privacy notice and security overview describe the published site
and are current. Downloading this archive does not change any status, and
nothing in this archive claims legal compliance.

SCOPES

These documents cover separate things. The bot set covers the Next Step
Studios Discord bot operating in one private server. The website set covers
this public site. Places Left Behind has its own game scope in preparation;
no game document is included here until the real document is published.
They are not interchangeable, and one is not a substitute for another.

The authoritative version of each document is the page at
https://next-step-studios-official.github.io/policies/<scope>/<slug>, and
the individual downloads are available from /downloads. A copy in this ZIP
can become out of date.

${COPYRIGHT}
Contact: ${CONTACT}
`;

/* ------------------------------------------------------------------- crc32 */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

/* -------------------------------------------------------------- zip writer */

const dosStamp = (date) => ({
  date:
    ((Math.max(1980, date.getUTCFullYear()) - 1980) << 9) |
    ((date.getUTCMonth() + 1) << 5) |
    date.getUTCDate(),
  time:
    (date.getUTCHours() << 11) |
    (date.getUTCMinutes() << 5) |
    Math.floor(date.getUTCSeconds() / 2),
});

const localParts = [];
const centralParts = [];
let offset = 0;

const addFile = (name, content) => {
  const nameBuffer = Buffer.from(name, 'utf8');
  const data = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  const compressed = zlib.deflateRawSync(data, { level: 9 });
  const checksum = crc32(data);
  const stamp = dosStamp(generatedDate);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6);
  local.writeUInt16LE(8, 8);
  local.writeUInt16LE(stamp.time, 10);
  local.writeUInt16LE(stamp.date, 12);
  local.writeUInt32LE(checksum, 14);
  local.writeUInt32LE(compressed.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuffer.length, 26);
  local.writeUInt16LE(0, 28);
  localParts.push(local, nameBuffer, compressed);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(8, 10);
  central.writeUInt16LE(stamp.time, 12);
  central.writeUInt16LE(stamp.date, 14);
  central.writeUInt32LE(checksum, 16);
  central.writeUInt32LE(compressed.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuffer.length, 28);
  central.writeUInt16LE(0, 30);
  central.writeUInt16LE(0, 32);
  central.writeUInt16LE(0, 34);
  central.writeUInt16LE(0, 36);
  central.writeUInt32LE(0, 38);
  central.writeUInt32LE(offset, 42);
  centralParts.push(central, nameBuffer);

  offset += local.length + nameBuffer.length + compressed.length;
};

addFile('README.txt', readme);
addFile('all-policies.md', combined);
for (const file of files) addFile(`${file.scope}/${file.slug}.md`, documentMarkdown(file));

const central = Buffer.concat(centralParts);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(0, 4);
end.writeUInt16LE(0, 6);
end.writeUInt16LE(files.length + 2, 8);
end.writeUInt16LE(files.length + 2, 10);
end.writeUInt32LE(central.length, 12);
end.writeUInt32LE(offset, 16);
end.writeUInt16LE(0, 20);

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, Buffer.concat([...localParts, central, end]));

const bytes = fs.statSync(OUTPUT).size;
console.log(
  `${path.relative(process.cwd(), OUTPUT)} — ${files.length + 2} files, ${(bytes / 1024).toFixed(1)} KB`,
);
