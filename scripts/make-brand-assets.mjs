#!/usr/bin/env node
/**
 * Builds every downloadable brand file from the two source marks.
 *
 *   npm run brand
 *
 * Sources
 *   current logo  D:/…/NextStepStudioBot/images/server_logo/Next_StepStudios_Logo.png
 *   retired mark  public/brand/archive/neon-emblem-2026-07-25.png (already in-repo)
 *
 * The current logo is a raster drawn on a solid white tile and has no alpha
 * channel. The white is removed by flooding inward from the edges only, so
 * white details enclosed by the artwork (the eyes, highlights inside the
 * letters) are preserved. The matte is unpremultiplied afterwards, which is
 * what stops a pale halo appearing around the cut-out on a dark page.
 *
 * Outputs, for each mark, size {1024,512,256,128}:
 *   <name>-<size>.png        transparent
 *   <name>-<size>.svg        SVG wrapper around the transparent PNG
 *   <name>-<size>.jpg        flattened on #07080B, light-outline treatment
 *   <name>-light-<size>.png  transparent light-outline treatment
 *   <name>-light-<size>.svg  SVG wrapper around that treatment
 *
 * The JPG uses the light-outline treatment because a JPG has no alpha: the
 * black ninja and the black "STUDIOS" line would vanish on the dark base
 * otherwise. The retired emblem is bright enough not to need the treatment.
 *
 * Plus the favicons and
 * src/data/brand-assets.json, which the press kit and archive read so no file
 * size or filename is ever typed by hand.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_ROOT =
  process.env.BRAND_SOURCE ?? 'D:/NextStepStudios/DiscordBots/PrivateBots/NextStepStudioBot';

const CURRENT_SOURCE = path.join(SOURCE_ROOT, 'images/server_logo/Next_StepStudios_Logo.png');
const RETIRED_SOURCE = 'public/brand/archive/neon-emblem-2026-07-25.png';

const SIZES = [1024, 512, 256, 128];
const DARK = '#07080B';
const OUTPUT = 'public/brand/press';
const ARCHIVE_OUTPUT = 'public/brand/archive';

const exists = async (file) => {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};

/**
 * Replace the edge-connected white with transparency.
 *
 * `threshold` is the minimum brightness that can still be walked through, so
 * a higher value is a more conservative cut. Pixels inside the artwork are
 * never visited, which is the whole point of flooding from the border rather
 * than keying every white pixel on the canvas.
 */
async function cutout(input, { threshold = 128, softness = 255 } = {}) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const push = (index) => {
    if (seen[index]) return;
    const offset = index * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    // Light and near-neutral: the white tile. Coloured pixels are artwork and
    // stop the flood, which protects red edges that touch the background.
    if (min < threshold || max - min > 26) return;
    seen[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = (index - x) / width;
    if (x > 0) push(index - 1);
    if (x < width - 1) push(index + 1);
    if (y > 0) push(index - width);
    if (y < height - 1) push(index + width);
  }

  for (let index = 0; index < seen.length; index += 1) {
    if (!seen[index]) continue;
    const offset = index * 4;
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    // How much of the original pixel was background: pure white → 0 opacity.
    const alpha = Math.max(0, Math.min(1, 1 - Math.min(r, g, b) / softness));
    if (alpha <= 0.004) {
      data[offset + 3] = 0;
      continue;
    }
    // Un-premultiply against white so the cut edge keeps its colour instead of
    // carrying a white fringe onto dark backgrounds.
    data[offset] = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - alpha)) / alpha)));
    data[offset + 1] = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - alpha)) / alpha)));
    data[offset + 2] = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - alpha)) / alpha)));
    data[offset + 3] = Math.round(alpha * 255);
  }

  return sharp(data, { raw: { width, height, channels: 4 } }).png();
}

/** A white outline grown from the mark's alpha, for use on dark surfaces. */
async function lightOutline(transparentPngBuffer, { radius = 7 } = {}) {
  const base = sharp(transparentPngBuffer);
  const { width, height } = await base.metadata();
  const alpha = await sharp(transparentPngBuffer)
    .extractChannel('alpha')
    .blur(radius)
    .threshold(6)
    .raw()
    .toBuffer();

  const halo = await sharp({
    create: { width, height, channels: 3, background: '#ffffff' },
  })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();

  return sharp(halo).composite([{ input: transparentPngBuffer }]).png();
}

const svgFor = (png, size) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img">\n  <image width="${size}" height="${size}" href="data:image/png;base64,${png.toString('base64')}"/>\n</svg>\n`;

/** Bounding box of the visible pixels, so crops are never guessed. */
async function alphaBox(buffer) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let left = info.width;
  let top = info.height;
  let right = 0;
  let bottom = 0;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * 4 + 3] < 12) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  return { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 };
}

const kb = (bytes) => Math.max(1, Math.round(bytes / 1024));

async function writeMatrix({ id, name, source, directory, softness, withLight = true }) {
  const cut = await cutout(source, { softness });
  const cutBuffer = await cut.toBuffer();
  const light = await lightOutline(cutBuffer);
  const lightBuffer = await light.toBuffer();

  const files = [];
  const add = async (file) => {
    files.push({
      mark: id,
      markName: name,
      size: file.size,
      format: file.format,
      variant: file.variant,
      variantLabel: file.variantLabel,
      path: file.path.replace(/^public/, ''),
      bytes: (await fs.stat(file.path)).size,
    });
  };

  for (const size of SIZES) {
    const standard = await sharp(cutBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
      .toBuffer();
    const lightSized = await sharp(lightBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
      .toBuffer();

    const pngPath = `${directory}/${id}-${size}.png`;
    const svgPath = `${directory}/${id}-${size}.svg`;
    const jpgPath = `${directory}/${id}-${size}.jpg`;
    await fs.writeFile(pngPath, standard);
    await fs.writeFile(svgPath, svgFor(standard, size));
    await sharp(lightSized)
      .flatten({ background: DARK })
      .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(jpgPath);

    await add({ size, format: 'png', variant: 'standard', variantLabel: 'Transparent', path: pngPath });
    await add({ size, format: 'svg', variant: 'standard', variantLabel: 'Transparent', path: svgPath });
    await add({
      size,
      format: 'jpg',
      variant: 'light',
      variantLabel: 'Flattened on #07080B',
      path: jpgPath,
    });

    if (withLight) {
      const lightPngPath = `${directory}/${id}-light-${size}.png`;
      const lightSvgPath = `${directory}/${id}-light-${size}.svg`;
      await fs.writeFile(lightPngPath, lightSized);
      await fs.writeFile(lightSvgPath, svgFor(lightSized, size));
      await add({
        size,
        format: 'png',
        variant: 'light',
        variantLabel: 'Light outline for dark surfaces',
        path: lightPngPath,
      });
      await add({
        size,
        format: 'svg',
        variant: 'light',
        variantLabel: 'Light outline for dark surfaces',
        path: lightSvgPath,
      });
    }
  }

  return { files, cutBuffer, lightBuffer };
}

/* ------------------------------------------------------------------ build */

if (!(await exists(CURRENT_SOURCE))) {
  console.error(`Current logo source not found: ${CURRENT_SOURCE}`);
  console.error('Set BRAND_SOURCE to the bot repository root and try again.');
  process.exit(1);
}

await fs.mkdir(OUTPUT, { recursive: true });
await fs.mkdir(ARCHIVE_OUTPUT, { recursive: true });

console.log('Current mark');
const current = await writeMatrix({
  id: 'logo',
  name: 'Next Step Studios logo',
  source: CURRENT_SOURCE,
  directory: OUTPUT,
  softness: 245,
});

console.log('Retired neon emblem');
const retired = await writeMatrix({
  id: 'neon-emblem-2026-07-25',
  name: 'Neon orbit emblem (retired 25 July 2026)',
  source: RETIRED_SOURCE,
  directory: ARCHIVE_OUTPUT,
  softness: 235,
  withLight: false,
});

/* ---------------------------------------------- site assets and white tile */

await sharp(current.cutBuffer)
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('src/assets/brand/logo.png');

await sharp(current.lightBuffer)
  .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile('src/assets/brand/logo-light.png');

// The white-tile original is superseded, not deleted: the archive keeps a
// flattened copy under a dated filename so the old appearance is recoverable.
await sharp(CURRENT_SOURCE)
  .resize(1024, 1024, { fit: 'contain', background: '#ffffff' })
  .flatten({ background: '#ffffff' })
  .png({ compressionLevel: 9 })
  .toFile('public/brand/archive/logo-white-tile-2026-11-21.png');

/* ---------------------------------------------------------------- OG card */

const ogMark = await sharp(current.lightBuffer)
  .resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const ogCard = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#07080b"/><stop offset="1" stop-color="#101426"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.85" cy="0.15" r="0.7">
      <stop offset="0" stop-color="#4d8dff" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#07080b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="4" fill="#4d8dff"/>
  <text x="86" y="120" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="21" letter-spacing="5" fill="#8fb6ff">NEXT STEP STUDIOS</text>
  <text x="86" y="210" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="23" letter-spacing="2" fill="#8d99ab">INDEPENDENT STUDIO</text>
  <text x="86" y="300" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="58" font-weight="650" letter-spacing="-1.5" fill="#f2f5fb">Games and software,</text>
  <text x="86" y="372" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="58" font-weight="650" letter-spacing="-1.5" fill="#f2f5fb">built one careful step</text>
  <text x="86" y="444" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="58" font-weight="650" letter-spacing="-1.5" fill="#f2f5fb">at a time.</text>
  <text x="86" y="560" font-family="Segoe UI, DejaVu Sans, Arial, sans-serif" font-size="22" fill="#b7c1d1">A five-person independent studio</text>
</svg>`;

await sharp(Buffer.from(ogCard))
  .composite([{ input: ogMark, left: 840, top: 190 }])
  .png({ compressionLevel: 9 })
  .toFile('public/og-image.png');

/* --------------------------------------------------------------- favicons */

const master = await sharp(current.cutBuffer).resize(1024, 1024).png().toBuffer();
const box = await alphaBox(master);

// The tab icon is the head of the mark, not the wordmark: the words are
// illegible at 32px. A square is taken from the top of the artwork, from the
// light-outline treatment so the tab stays visible in a dark browser.
const side = Math.min(box.width, Math.round(box.width * 0.56));
const centreX = box.left + box.width / 2;
const headLeft = Math.max(0, Math.min(1024 - side, Math.round(centreX - side / 2)));
const headTop = Math.max(0, Math.min(1024 - side, box.top - Math.round(side * 0.03)));

const head = await sharp(current.lightBuffer)
  .extract({ left: headLeft, top: headTop, width: side, height: side })
  .resize(128, 128)
  .png()
  .toBuffer();

const favicon128 = await sharp(head).resize(128, 128).png({ palette: true, quality: 96 }).toBuffer();
const favicon64 = await sharp(head).resize(64, 64).png({ palette: true, quality: 96 }).toBuffer();
const favicon32 = await sharp(head).resize(32, 32).png({ palette: true, quality: 96 }).toBuffer();

await fs.writeFile('public/brand/favicon-128.png', favicon128);
await fs.writeFile('public/brand/favicon-64.png', favicon64);
await fs.writeFile('public/brand/favicon-32.png', favicon32);
await fs.writeFile('public/favicon.svg', svgFor(favicon128, 128));

// iOS composites a transparent touch icon onto black, so this one is
// deliberately flattened on the studio's dark base rather than left clear.
const appleTouch = await sharp(master)
  .resize(148, 148, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 16, bottom: 16, left: 16, right: 16, background: DARK })
  .png()
  .toBuffer();
await fs.writeFile('public/brand/apple-touch-icon.png', appleTouch);

/* --------------------------------------------------------------- manifest */

const files = [...current.files, ...retired.files];
const manifest = {
  generated: '2026-11-21',
  baseColour: DARK,
  sizes: SIZES,
  formats: ['png', 'jpg', 'svg'],
  marks: [
    {
      id: 'logo',
      name: 'Current logo',
      note: 'Transparent master cut from the original white-tile artwork. The light outline treatment is for dark surfaces, where the black ninja would otherwise disappear.',
      files: current.files,
    },
    {
      id: 'neon-emblem-2026-07-25',
      name: 'Retired neon orbit emblem',
      note: 'Retired 25 July 2026. Kept at stable addresses because older posts and documents still use it.',
      files: retired.files,
    },
  ],
  favourites: {
    favicon128: '/brand/favicon-128.png',
    favicon64: '/brand/favicon-64.png',
    favicon32: '/brand/favicon-32.png',
    appleTouch: '/brand/apple-touch-icon.png',
  },
};

await fs.writeFile('src/data/brand-assets.json', `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`\n${files.length} files written.`);
console.log(`  ${files.filter((file) => file.format === 'png').length} PNG`);
console.log(`  ${files.filter((file) => file.format === 'jpg').length} JPG`);
console.log(`  ${files.filter((file) => file.format === 'svg').length} SVG`);
console.log(`  largest: ${kb(Math.max(...files.map((file) => file.bytes)))} KB`);
