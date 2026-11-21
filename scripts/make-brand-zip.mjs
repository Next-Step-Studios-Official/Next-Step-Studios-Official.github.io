#!/usr/bin/env node
/**
 * Zips the brand kit with node:zlib only, so the build gains no dependency.
 *
 *   npm run brand:zip
 *
 * The manifest that make-brand-assets.mjs writes is the single list of files,
 * so the ZIP can never fall out of step with the press page. A README is
 * generated into the archive from the same manifest.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const MANIFEST = 'src/data/brand-assets.json';
const OUTPUT = 'public/downloads/next-step-studios-brand-kit.zip';

if (!fs.existsSync(MANIFEST)) {
  console.error(`${MANIFEST} is missing. Run npm run brand first.`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

/**
 * The kit is two folders, not the site's own tree: the live mark in `current/`
 * and retired marks in `archive/`. The folder is derived from where the file
 * actually lives, so the ZIP can never label an archived mark as current.
 */
const zipFolder = (file) => (file.path.includes('/archive/') ? 'archive' : 'current');

/** The date a retired mark carries in its filename, as a UTC noon timestamp. */
const fileDate = (file) => {
  const match = path.basename(file.path).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12));
  return Number.isNaN(date.getTime()) ? null : date;
};

const generatedDate = new Date(`${manifest.generated}T12:00:00Z`);

/**
 * Files outside the logo matrix that belong in the kit anyway: the favicons the
 * site actually serves, and the superseded white-tile artwork kept in the
 * archive. They follow the same folder rule as the marks.
 */
const extraFiles = Object.values(manifest.favourites ?? {}).map((file) => ({
  zipPath: `current/${path.basename(file)}`,
  source: path.join('public', file.replace(/^\//, '')),
  zipDate: generatedDate,
}));
const whiteTile = 'public/brand/archive/logo-white-tile-2026-11-21.png';
if (fs.existsSync(whiteTile)) {
  extraFiles.push({
    zipPath: `archive/${path.basename(whiteTile)}`,
    source: whiteTile,
    zipDate: fileDate({ path: whiteTile }) ?? generatedDate,
  });
}

const files = manifest.marks.flatMap((mark) =>
  mark.files.map((file) => {
    const folder = zipFolder(file);
    return {
      ...file,
      folder,
      zipPath: `${folder}/${path.basename(file.path)}`,
      // Archived files keep their retirement date in the ZIP metadata too, so
      // the date survives a filename being copied somewhere else.
      zipDate: folder === 'archive' ? fileDate(file) ?? generatedDate : generatedDate,
    };
  }),
);

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

/** MS-DOS date and time, the only timestamps a ZIP entry carries. */
const dosStamp = (date) => ({
  date: ((Math.max(1980, date.getUTCFullYear()) - 1980) << 9) |
    ((date.getUTCMonth() + 1) << 5) |
    date.getUTCDate(),
  time: (date.getUTCHours() << 11) | (date.getUTCMinutes() << 5) | Math.floor(date.getUTCSeconds() / 2),
});

const localParts = [];
const centralParts = [];
let offset = 0;

const addFile = (name, content, date = generatedDate) => {
  const nameBuffer = Buffer.from(name, 'utf8');
  const data = Buffer.isBuffer(content) ? content : Buffer.from(content, 'utf8');
  const compressed = zlib.deflateRawSync(data, { level: 9 });
  const checksum = crc32(data);
  const stamp = dosStamp(date);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6); // UTF-8 names
  local.writeUInt16LE(8, 8); // deflate
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

/* -------------------------------------------------------------------- readme */

const sizesLine = manifest.sizes.join(', ');
const rows = manifest.marks
  .map((mark) => {
    const png = mark.files.filter((file) => file.format === 'png').length;
    const jpg = mark.files.filter((file) => file.format === 'jpg').length;
    const svg = mark.files.filter((file) => file.format === 'svg').length;
    return `  ${mark.name}  →  ${zipFolder(mark.files[0])}/\n    ${png} PNG, ${jpg} JPG, ${svg} SVG\n    ${mark.note}`;
  })
  .join('\n\n');

const readme = `Next Step Studios — brand kit
Generated ${manifest.generated}

WHAT IS IN HERE

  README.txt    This file.
  current/      The live mark and the site's four favicons. Use the mark files
                unless you specifically need an old one.
  archive/      Retired marks, kept because old posts and documents still use
                them. Each filename carries its retirement date, and the ZIP
                stores that date as the file's metadata too.

${rows}

Every mark is supplied at ${sizesLine} pixels, as:

  .png   Transparent. This is the file to use when the background is not known.
  .svg   An SVG wrapper around the transparent PNG at that size. It scales in
         layout without a blurry browser resize, but it is not a vector redraw
         of the artwork.
  .jpg   Flattened on the studio's dark base ${manifest.baseColour}. JPG cannot store
         transparency, so these use the light-outline treatment: the black
         ninja and the black "STUDIOS" line would otherwise disappear.

The current mark also ships a "light" PNG and SVG for the same reason: on a
near-black surface the standard transparent mark loses its black areas. Use the
light treatment on dark, the standard transparent files on light.

WHICH FILE IS WHICH

  current/logo-<size>.png / .svg          Live logo, transparent, standard treatment.
  current/logo-<size>.jpg                 Live logo on ${manifest.baseColour}, light outline.
  current/logo-light-<size>.png / .svg    Live logo, transparent, light outline.
  archive/logo-white-tile-2026-11-21.png  Superseded white-tile artwork, kept as a record.
  archive/neon-emblem-2026-07-25-<size>.* Retired mark, kept for old posts and documents.

FAVICONS (included in current/)

  ${manifest.favourites.favicon128}
  ${manifest.favourites.favicon64}
  ${manifest.favourites.favicon32}
  ${manifest.favourites.appleTouch}

USAGE

Use the mark to refer to Next Step Studios in editorial work. Do not alter,
recolour, stretch, rotate or crop it, and do not add effects. Leave clear space
of at least one quarter of the mark's height on every side. Do not use it to
imply endorsement, partnership or sponsorship.

The full rules are at /brand. Retired marks are never overwritten or deleted;
they live at /archive with the retirement date in the filename.

HOW THIS KIT IS BUILT

This ZIP is generated from the website repository; editing the ZIP by hand only
lasts until the next build. To change it:

  npm run brand       rebuild every logo size and the ZIP from the artwork
  npm run brand:zip   rebuild only the ZIP from the files already in the repo

The folder comes from the file's home in the repository: public/brand/press
ships as current/, public/brand/archive ships as archive/. The favicons and the
white-tile edition are added from src/data/brand-assets.json and
public/brand/archive. The step-by-step
instructions are in README.md, under "The brand kit ZIP".
`;

addFile('README.txt', readme, generatedDate);
for (const file of files) {
  // The manifest path is the source on disk; zipPath is the folder inside the kit.
  const source = path.join('public', file.path.replace(/^\//, ''));
  if (!fs.existsSync(source)) {
    console.error(`Missing asset: ${source}`);
    process.exit(1);
  }
  addFile(file.zipPath, fs.readFileSync(source), file.zipDate);
}

for (const file of extraFiles) {
  if (!fs.existsSync(file.source)) {
    console.error(`Missing asset: ${file.source}`);
    process.exit(1);
  }
  addFile(file.zipPath, fs.readFileSync(file.source), file.zipDate);
}

const central = Buffer.concat(centralParts);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(0, 4);
end.writeUInt16LE(0, 6);
end.writeUInt16LE(files.length + extraFiles.length + 1, 8);
end.writeUInt16LE(files.length + extraFiles.length + 1, 10);
end.writeUInt32LE(central.length, 12);
end.writeUInt32LE(offset, 16);
end.writeUInt16LE(0, 20);

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, Buffer.concat([...localParts, central, end]));

const bytes = fs.statSync(OUTPUT).size;
console.log(`${OUTPUT} — ${files.length + extraFiles.length + 1} files, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
