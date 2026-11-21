#!/usr/bin/env node
/**
 * Builds the press-kit logo set: PNG, JPG and SVG at 128, 256, 512 and 1024.
 *
 * The source of truth is the existing 1024px PNG in `public/brand/press/`.
 * There is no vector master yet, so each SVG embeds its PNG — it scales in
 * layout, but it is not a redraw.
 *
 * Also writes `src/data/logo-files.json`, so the press page lists real file
 * sizes and never an invented number.
 *
 *   node scripts/make-logo-sets.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'public/brand/press';
const MASTER = path.join(DIR, 'logo-1024.png');
const SIZES = [128, 256, 512, 1024];

if (!fs.existsSync(MASTER)) {
  console.error(`Master artwork not found at ${MASTER}`);
  process.exit(1);
}

const master = fs.readFileSync(MASTER);

for (const size of SIZES) {
  const png = path.join(DIR, `logo-${size}.png`);
  const jpg = path.join(DIR, `logo-${size}.jpg`);
  const svg = path.join(DIR, `logo-${size}.svg`);

  await sharp(master)
    .resize(size, size, { fit: 'contain', background: '#ffffff' })
    .png({ compressionLevel: 9 })
    .toFile(png);

  await sharp(master)
    .resize(size, size, { fit: 'contain', background: '#ffffff' })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(jpg);

  const embedded = fs.readFileSync(png).toString('base64');
  fs.writeFileSync(
    svg,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<image width="${size}" height="${size}" href="data:image/png;base64,${embedded}"/>` +
      '</svg>\n',
  );

  console.log(`logo-${size}.png / .jpg / .svg`);
}

const notes = (file) => {
  if (file === 'logo-on-dark.jpg') return '1024 × 1024 · JPG · dark background';
  if (file === 'logo-on-light.jpg') return '1024 × 1024 · JPG · white background';
  if (file === 'logo-embedded.svg') return 'Embedded PNG · SVG · not vector';
  if (file.endsWith('.png')) {
    const size = file.match(/logo-(\d+)\.png/)?.[1];
    return `${size} × ${size} · PNG · white tile`;
  }
  if (file.endsWith('.jpg')) {
    const size = file.match(/logo-(\d+)\.jpg/)?.[1];
    return `${size} × ${size} · JPG · flattened white`;
  }
  if (file.endsWith('.svg')) {
    const size = file.match(/logo-(\d+)\.svg/)?.[1];
    return `${size} × ${size} · SVG · embedded PNG, not vector`;
  }
  if (file === 'logo-512.webp') return '512 × 512 · WebP · web';
  return '';
};

const order = (file) => {
  const type = file.endsWith('.png') ? 0 : file.endsWith('.jpg') ? 1 : file.endsWith('.svg') ? 2 : 3;
  const size = Number(file.match(/logo-(\d+)/)?.[1] ?? 0);
  return type * 10000 + size;
};

const files = fs
  .readdirSync(DIR)
  .filter((file) => file.startsWith('logo-'))
  .sort((a, b) => order(a) - order(b))
  .map((file) => ({
    name: file,
    href: `/brand/press/${file}`,
    size: `${Math.round(fs.statSync(path.join(DIR, file)).size / 1024)} KB`,
    note: notes(file),
  }));

fs.writeFileSync('src/data/logo-files.json', `${JSON.stringify(files, null, 2)}\n`);
console.log(`${files.length} files recorded in src/data/logo-files.json`);
