#!/usr/bin/env node
/**
 * Build a printable command cheatsheet from src/lib/commands.ts.
 *
 * The register is TypeScript, so this reads it as text rather than importing
 * it: one object per line, which is how the file is maintained. If the shape
 * changes, the check at the end fails loudly instead of shipping an empty PDF.
 */
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile('src/lib/commands.ts', 'utf8');
const groupLabels = Object.fromEntries(
  [...source.matchAll(/\{\s*\n\s*id:\s*'([^']+)',\s*\n\s*label:\s*'([^']+)'/g)].map((match) => [
    match[1],
    match[2],
  ]),
);

const commands = [...source.matchAll(
  /name:\s*'([^']+)',\s*group:\s*'([^']+)',\s*description:\s*'([^']*)'/g,
)].map((match) => ({ name: match[1], group: match[2], description: match[3] }));

if (commands.length < 40) {
  throw new Error(`Only parsed ${commands.length} commands — the register format changed.`);
}

const pdf = await PDFDocument.create();
pdf.setTitle('Next Step Bot command cheatsheet');
pdf.setAuthor('Candler Shaw');
pdf.setCreator('Next Step Studios');
const regular = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const mono = await pdf.embedFont(StandardFonts.Courier);

const A4 = [595.28, 841.89];
const margin = 36;
const columns = 3;
const columnWidth = (A4[0] - margin * 2) / columns;
const gutter = 10;
const ink = rgb(0.08, 0.09, 0.12);
const muted = rgb(0.36, 0.39, 0.45);
const accent = rgb(0.24, 0.47, 0.86);

const wrap = (text, font, size, width) => {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const groups = [...new Set(commands.map((command) => command.group))];
const orderedGroups = ['announcements', 'fun', 'tickets', 'utilities'].filter((id) => groups.includes(id));

let page = pdf.addPage(A4);
let column = 0;
let y = A4[1] - margin;

const drawHeader = (pageNumber) => {
  page.drawText('NEXT STEP STUDIOS', {
    x: margin, y: A4[1] - 48, size: 9, font: bold, color: accent,
  });
  page.drawText('NEXT STEP BOT · COMMAND CHEATSHEET', {
    x: margin, y: A4[1] - 64, size: 8, font: regular, color: muted,
  });
  page.drawText(`v1 · page ${pageNumber}`, {
    x: A4[0] - margin - 60, y: A4[1] - 48, size: 8, font: regular, color: muted,
  });
  page.drawLine({
    start: { x: margin, y: A4[1] - 74 },
    end: { x: A4[0] - margin, y: A4[1] - 74 },
    thickness: 0.6,
    color: rgb(0.82, 0.84, 0.88),
  });
};

const newColumn = () => {
  column += 1;
  if (column >= columns) {
    column = 0;
    page = pdf.addPage(A4);
    drawHeader(pdf.getPageCount());
    y = A4[1] - margin - 56;
  } else {
    y = A4[1] - margin - 56;
  }
};

drawHeader(1);
y = A4[1] - margin - 56;

for (const groupId of orderedGroups) {
  const list = commands.filter((command) => command.group === groupId);
  const label = (groupLabels[groupId] ?? groupId).toUpperCase();
  const needed = 22 + list.length * 20;

  if (y - needed < margin + 26) newColumn();

  page.drawText(label, {
    x: margin + column * columnWidth,
    y,
    size: 7.5,
    font: bold,
    color: accent,
  });
  y -= 5;
  page.drawLine({
    start: { x: margin + column * columnWidth, y },
    end: { x: margin + column * columnWidth + columnWidth - gutter, y },
    thickness: 0.5,
    color: rgb(0.82, 0.84, 0.88),
  });
  y -= 12;

  for (const command of list) {
    const x = margin + column * columnWidth;
    page.drawText(`/${command.name}`, { x, y, size: 7.2, font: mono, color: ink });
    y -= 8.6;
    for (const line of wrap(command.description, regular, 5.8, columnWidth - gutter - 2)) {
      page.drawText(line, { x: x + 4, y, size: 5.8, font: regular, color: muted });
      y -= 7;
    }
    y -= 4.2;

    if (y < margin + 20) newColumn();
  }

  y -= 6;
}

page.drawText('Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.', {
  x: margin, y: margin - 6, size: 5.5, font: regular, color: muted,
});
page.drawText('Command names and descriptions are read from the bot source. Existing in source is not the same as verified.', {
  x: margin, y: margin - 14, size: 5.5, font: regular, color: muted,
});
page.drawText('next-step-studios-official.github.io/commands', {
  x: margin, y: margin - 22, size: 5.5, font: regular, color: muted,
});

const bytes = await pdf.save();
await writeFile('public/downloads/command-cheatsheet.pdf', bytes);
console.log(`Cheatsheet written: ${commands.length} commands, ${pdf.getPageCount()} pages.`);
