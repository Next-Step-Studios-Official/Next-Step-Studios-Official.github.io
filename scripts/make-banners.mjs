#!/usr/bin/env node
/**
 * Rebuilds the two page banners from the studio's own artwork.
 *
 *   npm run banners
 *
 * The old banners had text baked into the JPEG and used a geometric emblem
 * that matched neither the current mark nor the retired one. These versions use
 * the real light-outline mark on a dark technical background, with no text:
 * the page heading already carries the message, and text in an image cannot
 * reflow, translate or be read reliably by a screen reader.
 *
 * Outputs, keeping the existing filenames and directory:
 *   src/assets/banners/links.jpg    1600 × 618
 *   src/assets/banners/support.jpg  1600 × 894
 */
import fs from 'node:fs/promises';
import sharp from 'sharp';

const DARK = '#07080B';
const BLUE = '#4D8DFF';
const VIOLET = '#A78BFA';
const INK = '#E9EEF7';

const MARK = 'src/assets/brand/logo-mark.png';
const FULL_MARK = 'public/brand/press/logo-light-512.png';

const exists = async (file) => {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};

if (!(await exists(MARK)) || !(await exists(FULL_MARK))) {
  console.error('Banner sources are missing. Run npm run brand first.');
  process.exit(1);
}

/** A soft technical background shared by both banners. */
const background = (width, height) => `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#07080B"/>
      <stop offset="0.55" stop-color="#0A1020"/>
      <stop offset="1" stop-color="#10162B"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.72" cy="0.38" r="0.55">
      <stop offset="0" stop-color="${BLUE}" stop-opacity="0.28"/>
      <stop offset="0.5" stop-color="${VIOLET}" stop-opacity="0.10"/>
      <stop offset="1" stop-color="${DARK}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${BLUE}" stop-opacity="0"/>
      <stop offset="0.35" stop-color="${BLUE}" stop-opacity="0.9"/>
      <stop offset="0.65" stop-color="${VIOLET}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M64 0H0V64" fill="none" stroke="#9DB7E8" stroke-opacity="0.055" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${width}" height="3" fill="url(#line)"/>
</svg>`;

/** A small constellation of nodes, drawn behind or beside the mark. */
const constellation = (points, width, height) => {
  const nodes = points
    .map(
      ([x, y, r, color, opacity]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" fill-opacity="${opacity}"/>` +
        `<circle cx="${x}" cy="${y}" r="${r * 3.2}" fill="${color}" fill-opacity="0.08"/>`,
    )
    .join('');
  const links = points
    .slice(1)
    .map(
      ([x, y], index) =>
        `<line x1="${points[index][0]}" y1="${points[index][1]}" x2="${x}" y2="${y}" stroke="${BLUE}" stroke-opacity="0.22" stroke-width="1"/>`,
    )
    .join('');
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
    xmlns="http://www.w3.org/2000/svg">${links}${nodes}</svg>`;
};

const round = (value) => Math.round(value);

async function makeBanner({ out, width, height, mark, markWidth, left, top, points }) {
  const trimmed = await sharp(mark).trim().resize({ width: markWidth }).png().toBuffer();
  const { width: markW, height: markH } = await sharp(trimmed).metadata();
  const base = await sharp(Buffer.from(background(width, height))).png().toBuffer();
  const overlay = await sharp(Buffer.from(constellation(points, width, height))).png().toBuffer();

  await sharp(base)
    .composite([
      { input: overlay, left: 0, top: 0 },
      { input: trimmed, left: round(left), top: round(top) },
    ])
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(out);

  console.log(`${out} — ${width} × ${height}, mark ${markW} × ${markH}`);
}

await fs.mkdir('src/assets/banners', { recursive: true });

await makeBanner({
  out: 'src/assets/banners/links.jpg',
  width: 1600,
  height: 618,
  mark: FULL_MARK,
  markWidth: 560,
  left: 150,
  top: 128,
  points: [
    [1110, 146, 5, BLUE, 0.95],
    [1288, 104, 4, VIOLET, 0.9],
    [1452, 236, 6, BLUE, 0.95],
    [1196, 430, 4, VIOLET, 0.9],
    [1370, 508, 5, BLUE, 0.9],
    [1500, 382, 4, INK, 0.8],
    [1058, 500, 3, BLUE, 0.8],
  ],
});

await makeBanner({
  out: 'src/assets/banners/support.jpg',
  width: 1600,
  height: 894,
  mark: FULL_MARK,
  markWidth: 540,
  left: 160,
  top: 190,
  points: [
    [1080, 210, 5, BLUE, 0.9],
    [1320, 150, 4, VIOLET, 0.85],
    [1450, 360, 6, BLUE, 0.9],
    [1190, 560, 4, VIOLET, 0.85],
    [1390, 690, 5, BLUE, 0.85],
    [1010, 680, 3, INK, 0.7],
  ],
});

console.log('Banners are text-free; the page heading supplies the words.');
