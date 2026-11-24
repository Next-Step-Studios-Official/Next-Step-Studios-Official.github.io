/**
 * Builds the PDF editions of the public policy documents.
 *
 * The site is static and this machine has no browser that can print to PDF,
 * so the documents are typeset directly: A4, one column, real page numbers.
 * Output goes to `public/downloads/<slug>.pdf` and is served as a static file.
 *
 *   npm run pdfs
 */
import fs from 'node:fs';
import path from 'node:path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const ROOT = path.resolve('src/content/policies');
const OUT = path.resolve('public/downloads');
const COPYRIGHT =
  'Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.';

const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = { top: 66, bottom: 62, left: 58, right: 58 };
const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;

const INK = rgb(0.08, 0.1, 0.13);
const MUTED = rgb(0.36, 0.4, 0.46);
const RULE = rgb(0.82, 0.85, 0.89);
const ACCENT = rgb(0.11, 0.31, 0.85);

const clean = (value) =>
  value
    // Inline Markdown: keep the words, drop the syntax.
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(^|\s)\*([^*]+)\*/g, '$1$2')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u00B7\u2022]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    // Keep the copyright sign; WinAnsi (used by Helvetica) supports it.
    .replace(/[^\x20-\x7E\u00A9\n]/g, '')
    .replace(/[ \t]+/g, ' ');

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

/** Turn Markdown into a small block list the typesetter understands. */
function toBlocks(markdown) {
  const lines = markdown
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .split(/\r?\n/);

  const blocks = [];
  let paragraph = [];

  const flush = () => {
    if (paragraph.length === 0) return;
    blocks.push({ type: 'p', text: clean(paragraph.join(' ')) });
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flush();
      continue;
    }

    if (/^#{1,4}\s+/.test(line)) {
      flush();
      const depth = line.match(/^#+/)[0].length;
      blocks.push({ type: `h${depth}`, text: clean(line.replace(/^#{1,4}\s+/, '')) });
      continue;
    }

    if (/^(-{3,}|\*{3,})$/.test(line.trim())) {
      flush();
      blocks.push({ type: 'rule' });
      continue;
    }

    const bullet = line.match(/^\s*[-*+]\s+(.*)$/);
    if (bullet) {
      flush();
      blocks.push({ type: 'li', text: clean(bullet[1]) });
      continue;
    }

    const numbered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (numbered) {
      flush();
      blocks.push({ type: 'li', text: clean(numbered[1]), ordered: true });
      continue;
    }

    if (/^\s*>/.test(line)) {
      flush();
      blocks.push({ type: 'quote', text: clean(line.replace(/^\s*>\s?/, '')) });
      continue;
    }

    paragraph.push(line.trim());
  }

  flush();
  return blocks;
}

async function buildPdf(document, outputPath) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);

  pdf.setTitle(document.title);
  pdf.setAuthor('Candler Shaw');
  pdf.setSubject(`${document.docStatus} · version ${document.version}`);
  pdf.setCreator('Next Step Studios website build');
  pdf.setProducer('pdf-lib');

  let page = pdf.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - MARGIN.top;

  const newPage = () => {
    page = pdf.addPage([PAGE.width, PAGE.height]);
    y = PAGE.height - MARGIN.top;
  };

  const wrap = (text, font, size, width) => {
    const words = text.split(' ').filter(Boolean);
    const lines = [];
    let current = '';

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= width) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        if (font.widthOfTextAtSize(word, size) > width) {
          // Break a single very long token (a URL, usually).
          let chunk = '';
          for (const char of word) {
            if (font.widthOfTextAtSize(chunk + char, size) > width) {
              lines.push(chunk);
              chunk = char;
            } else {
              chunk += char;
            }
          }
          current = chunk;
        } else {
          current = word;
        }
      }
    }

    if (current) lines.push(current);
    return lines;
  };

  const draw = (text, { font = regular, size = 10.4, color = INK, x = MARGIN.left, leading = 15 } = {}) => {
    for (const line of wrap(text, font, size, CONTENT_WIDTH - (x - MARGIN.left))) {
      if (y - leading < MARGIN.bottom) newPage();
      page.drawText(line, { x, y: y - size, size, font, color });
      y -= leading;
    }
  };

  // Title block
  page.drawText(`NEXT STEP STUDIOS - ${document.scopeLabel.toUpperCase()} DOCUMENTATION`, {
    x: MARGIN.left,
    y,
    size: 7.5,
    font: bold,
    color: ACCENT,
  });
  y -= 22;

  for (const line of wrap(document.heading, bold, 21, CONTENT_WIDTH)) {
    page.drawText(line, { x: MARGIN.left, y: y - 21, size: 21, font: bold, color: INK });
    y -= 25;
  }

  y -= 4;
  const meta = `Version ${document.version}  -  ${document.docStatus}  -  Applies to: ${document.appliesTo}`;
  draw(clean(meta), { size: 8.5, color: MUTED, leading: 12 });
  y -= 6;

  page.drawLine({
    start: { x: MARGIN.left, y },
    end: { x: PAGE.width - MARGIN.right, y },
    thickness: 0.8,
    color: RULE,
  });
  y -= 20;

  draw(document.summary, { font: italic, size: 11, color: MUTED, leading: 16 });
  y -= 12;

  for (const block of document.blocks) {
    if (block.type === 'h1' || block.type === 'h2') {
      y -= 16;
      if (y < MARGIN.bottom + 90) newPage();
      for (const line of wrap(block.text, bold, 13.5, CONTENT_WIDTH)) {
        page.drawText(line, { x: MARGIN.left, y: y - 13.5, size: 13.5, font: bold, color: INK });
        y -= 18;
      }
      y -= 4;
      continue;
    }

    if (block.type === 'h3' || block.type === 'h4') {
      y -= 8;
      if (y < MARGIN.bottom + 70) newPage();
      draw(block.text, { font: bold, size: 11, leading: 15 });
      y -= 3;
      continue;
    }

    if (block.type === 'rule') {
      y -= 6;
      if (y < MARGIN.bottom) newPage();
      page.drawLine({
        start: { x: MARGIN.left, y },
        end: { x: PAGE.width - MARGIN.right, y },
        thickness: 0.6,
        color: RULE,
      });
      y -= 12;
      continue;
    }

    if (block.type === 'li') {
      const marker = block.ordered ? '-' : '-';
      const x = MARGIN.left + 14;
      if (y - 15 < MARGIN.bottom) newPage();
      page.drawText(marker, { x: MARGIN.left + 2, y: y - 10.4, size: 10.4, font: regular, color: ACCENT });
      draw(block.text, { x, size: 10.4, leading: 15 });
      y -= 2;
      continue;
    }

    if (block.type === 'quote') {
      y -= 2;
      draw(block.text, { font: italic, size: 10.4, color: MUTED, leading: 15 });
      y -= 4;
      continue;
    }

    y -= 4;
    draw(block.text, { size: 10.4, leading: 15 });
    y -= 2;
  }

  // Footers
  const pages = pdf.getPages();
  pages.forEach((item, index) => {
    item.drawLine({
      start: { x: MARGIN.left, y: 50 },
      end: { x: PAGE.width - MARGIN.right, y: 50 },
      thickness: 0.6,
      color: RULE,
    });
    item.drawText(clean(COPYRIGHT), {
      x: MARGIN.left,
      y: 40,
      size: 6.4,
      font: regular,
      color: MUTED,
    });
    item.drawText(clean(`Next Step Studios  -  ${document.shortTitle}  -  v${document.version} ${document.docStatus.toLowerCase()}`), {
      x: MARGIN.left,
      y: 28,
      size: 7,
      font: regular,
      color: MUTED,
    });
    item.drawText(`${index + 1} / ${pages.length}`, {
      x: PAGE.width - MARGIN.right - 30,
      y: 28,
      size: 7,
      font: regular,
      color: MUTED,
    });
  });

  const bytes = await pdf.save();
  fs.writeFileSync(outputPath, bytes);
  return { pages: pages.length, bytes: bytes.length };
}

fs.mkdirSync(OUT, { recursive: true });

const files = fs
  .readdirSync(ROOT, { recursive: true })
  .filter((file) => typeof file === 'string' && file.endsWith('.md'))
  .map((file) => path.join(ROOT, file));

if (files.length === 0) {
  console.error('No policy documents found.');
  process.exit(1);
}

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const { data, body } = parseFrontmatter(source);
  const relative = path.relative(ROOT, file).replace(/\\/g, '/');
  const scope = relative.startsWith('website/')
    ? 'website'
    : relative.startsWith('game/')
      ? 'game'
      : 'bot';
  const slug = path.basename(file, '.md');
  const key = scope === 'bot' ? slug : `${scope}-${slug}`;
  const scopeLabel =
    scope === 'bot' ? 'Discord bot' : scope === 'website' ? 'Website' : 'Places Left Behind';

  const document = {
    slug,
    key,
    scope,
    scopeLabel,
    title: data.title ?? slug,
    heading: data.shortTitle ?? data.title ?? slug,
    shortTitle: data.shortTitle ?? data.title ?? slug,
    version: data.version ?? '0.0.0',
    docStatus: data.docStatus ?? 'Draft',
    appliesTo: data.appliesTo ?? scopeLabel,
    summary: data.summary ?? '',
    blocks: toBlocks(body),
  };

  const result = await buildPdf(document, path.join(OUT, `${key}.pdf`));
  console.log(`${key.padEnd(24)} ${String(result.pages).padStart(2)} pages  ${(result.bytes / 1024).toFixed(0)} KB`);
}
