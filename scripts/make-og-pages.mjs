#!/usr/bin/env node
/**
 * Build per-page Open Graph cards at 1200×630.
 *
 * Reads frontmatter directly rather than through astro:content, so the script
 * runs with plain node. Text is rendered by libvips through SVG, which means it
 * uses a system sans-serif: the card must render identically on a build machine
 * with no network and no webfonts.
 */
import sharp from 'sharp';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const OUTPUT = 'public/og';
const POLICY_DIR = 'src/content/policies/bot';
const PROJECT_DIR = 'src/content/projects';

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const field = (frontmatter, name) => {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^["']|["']$/g, '') : '';
};

const wrap = (text, max = 26) => {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if ((`${line} ${word}`).trim().length > max && line) {
      lines.push(line.trim());
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line);
  return lines;
};

const card = (title, eyebrow, index) => {
  const lines = wrap(title).slice(0, 3);
  const titleSvg = lines
    .map(
      (line, i) =>
        `<text x="78" y="${300 + i * 76}" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="66" font-weight="650" fill="#f2f5fb" letter-spacing="-1.5">${escape(line)}</text>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#07080b"/>
      <stop offset="0.55" stop-color="#0a0e17"/>
      <stop offset="1" stop-color="#101426"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.18" r="0.75">
      <stop offset="0" stop-color="#4d8dff" stop-opacity="0.34"/>
      <stop offset="0.55" stop-color="#a78bfa" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#07080b" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
      <path d="M46 0H0V46" fill="none" stroke="#1b2436" stroke-width="1" stroke-opacity="0.55"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.5"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="4" fill="#4d8dff"/>
  <text x="78" y="120" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="22" letter-spacing="5" fill="#8fb6ff">NEXT STEP STUDIOS</text>
  <text x="78" y="205" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="24" letter-spacing="2" fill="#8d99ab">${escape(eyebrow.toUpperCase())}</text>
  ${titleSvg}
  <line x1="78" y1="520" x2="560" y2="520" stroke="#2a3550" stroke-width="1"/>
  <text x="78" y="565" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="24" fill="#b7c1d1">Games and software, one careful step at a time.</text>
  <text x="1122" y="575" text-anchor="end" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="20" fill="#6c7a90">${String(index).padStart(2, '0')}</text>
</svg>`;
};

const policies = [];
for (const file of (await readdir(POLICY_DIR)).filter((name) => name.endsWith('.md'))) {
  const raw = await readFile(join(POLICY_DIR, file), 'utf8');
  const frontmatter = raw.split('---')[1] ?? '';
  policies.push({
    slug: file.replace(/\.md$/, ''),
    shortTitle: field(frontmatter, 'shortTitle'),
    version: field(frontmatter, 'version'),
  });
}

const projects = [];
for (const file of (await readdir(PROJECT_DIR)).filter((name) => name.endsWith('.md'))) {
  const raw = await readFile(join(PROJECT_DIR, file), 'utf8');
  const frontmatter = raw.split('---')[1] ?? '';
  projects.push({
    id: file.replace(/\.md$/, ''),
    title: field(frontmatter, 'title'),
    status: field(frontmatter, 'status'),
  });
}

await mkdir(OUTPUT, { recursive: true });

const pages = [
  { file: 'commands.png', title: 'Every command, named exactly as it runs', eyebrow: 'Command reference' },
  { file: 'modules.png', title: 'The bot, module by module', eyebrow: 'Module register' },
  { file: 'trust.png', title: 'Everything that answers “is this safe?”', eyebrow: 'Trust centre' },
  { file: 'press.png', title: 'Press, brand and every mark', eyebrow: 'Press & brand' },
  { file: 'glossary.png', title: 'The words, defined once', eyebrow: 'Glossary' },
  { file: 'roadmap.png', title: 'What is next, without invented dates', eyebrow: 'Roadmap' },
  { file: 'faq.png', title: 'Questions, answered without spin', eyebrow: 'FAQ' },
  ...policies.map((policy) => ({
    file: `policy-${policy.slug}.png`,
    title: policy.shortTitle,
    eyebrow: `Policy · v${policy.version} · draft`,
  })),
  ...projects.map((project) => ({
    file: `project-${project.id}.png`,
    title: project.title,
    eyebrow: `Project · ${project.status}`,
  })),
];

let index = 0;
for (const page of pages) {
  index += 1;
  await sharp(Buffer.from(card(page.title, page.eyebrow, index)))
    .png({ compressionLevel: 9 })
    .toFile(`${OUTPUT}/${page.file}`);
  console.log(`  ${page.file}`);
}

await writeFile(`${OUTPUT}/index.json`, JSON.stringify(pages.map((page) => page.file), null, 2));
console.log(`\n${pages.length} share cards written to ${OUTPUT}.`);
