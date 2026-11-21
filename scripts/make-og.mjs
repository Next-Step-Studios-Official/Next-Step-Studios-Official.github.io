/**
 * Composes the Open Graph share card (1200x630) from the studio logo.
 *
 * The logo is a white-background square, so it is placed in a rounded tile
 * instead of being cut out. Text is rendered as SVG, which keeps the card
 * reproducible from source rather than a one-off screenshot.
 *
 *   node scripts/make-og.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const LOGO = 'src/assets/brand/logo.png';
const OUT = 'public/og-image.png';

if (!fs.existsSync(LOGO)) {
  console.error(`Logo not found at ${LOGO}. Run npm run assets first.`);
  process.exit(1);
}

const rounded = (width, height, radius) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#ffffff"/>
</svg>`);

const tile = await sharp(LOGO)
  .resize(300, 300, { fit: 'cover' })
  .ensureAlpha()
  .composite([{ input: rounded(300, 300, 26), blend: 'dest-in' }])
  .png()
  .toBuffer();

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="rgba(126,156,208,0.075)" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="78%" cy="8%" r="70%">
      <stop offset="0%" stop-color="#4d8dff" stop-opacity="0.34"/>
      <stop offset="45%" stop-color="#a78bfa" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#07080b" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4d8dff" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#4d8dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#07080b"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="630" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2"/>
  <rect x="80" y="152" width="300" height="300" rx="26" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1.5"/>
</svg>`);

const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect x="440" y="196" width="36" height="1.5" fill="url(#rule2)"/>
  <defs>
    <linearGradient id="rule2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#4d8dff"/>
      <stop offset="100%" stop-color="#4d8dff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <text x="492" y="203" font-family="Consolas, ui-monospace, monospace" font-size="15" letter-spacing="5.5" fill="#8d99ab">INDEPENDENT STUDIO</text>
  <text x="440" y="300" font-family="Segoe UI Semibold, Segoe UI, Arial, sans-serif" font-size="58" font-weight="600" letter-spacing="-1.5" fill="#e9eef7">Games and software,</text>
  <text x="440" y="368" font-family="Segoe UI Semibold, Segoe UI, Arial, sans-serif" font-size="58" font-weight="600" letter-spacing="-1.5" fill="#e9eef7">built one careful</text>
  <text x="440" y="436" font-family="Segoe UI Semibold, Segoe UI, Arial, sans-serif" font-size="58" font-weight="600" letter-spacing="-1.5" fill="#e9eef7"><tspan fill="#8fb6ff">step</tspan> at a time.</text>
  <circle cx="448" cy="516" r="4.5" fill="#7ee0c0"/>
  <text x="468" y="522" font-family="Consolas, ui-monospace, monospace" font-size="14" letter-spacing="3.4" fill="#b7c1d1">NEXT STEP STUDIOS  ·  COMMANDS, POLICIES, DEVLOG</text>
  <rect x="80" y="494" width="300" height="1" fill="rgba(255,255,255,0.1)"/>
  <text x="80" y="520" font-family="Consolas, ui-monospace, monospace" font-size="13" letter-spacing="3" fill="#8b97a9">INDEPENDENT  ·  SMALL STUDIO</text>
</svg>`);

await sharp(background)
  .composite([
    { input: tile, left: 80, top: 152 },
    { input: overlay, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const size = fs.statSync(OUT).size;
console.log(`${OUT}  ${(size / 1024).toFixed(0)} KB`);
