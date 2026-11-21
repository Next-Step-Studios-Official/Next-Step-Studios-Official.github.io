/**
 * Generates the brand derivatives from the studio's source artwork.
 *
 * The source files live in the bot repository, which is private, so the
 * optimised copies this site needs are generated here and committed with the
 * site. Run it again only if the source artwork changes.
 *
 *   npm run assets
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_ROOT =
  process.env.BRAND_SOURCE ??
  'D:/NextStepStudios/DiscordBots/PrivateBots/NextStepStudioBot';

const logoSource = path.join(SOURCE_ROOT, 'images/server_logo/Next_StepStudios_Logo.png');
const linksSource = path.join(SOURCE_ROOT, 'embeds/links/links_banner.jpg');
const supportSource = path.join(SOURCE_ROOT, 'embeds/NextStepStudiosSupportBanner.jpg');

if (!fs.existsSync(logoSource)) {
  console.error(`Source artwork not found at ${logoSource}`);
  console.error('Set BRAND_SOURCE to the bot repository root and try again.');
  process.exit(1);
}

const outputs = [
  { file: 'src/assets/brand/logo.png', build: () => sharp(logoSource).resize(512, 512, { fit: 'contain' }).png({ compressionLevel: 9 }) },
  { file: 'public/brand/favicon-64.png', build: () => sharp(logoSource).resize(64, 64, { fit: 'contain' }).png() },
  { file: 'public/brand/apple-touch-icon.png', build: () => sharp(logoSource).resize(180, 180, { fit: 'contain' }).png() },
  { file: 'src/assets/banners/links.jpg', build: () => sharp(linksSource).resize({ width: 1200 }).jpeg({ quality: 76, mozjpeg: true }) },
  { file: 'src/assets/banners/support.jpg', build: () => sharp(supportSource).resize({ width: 1200 }).jpeg({ quality: 76, mozjpeg: true }) },
];

for (const output of outputs) {
  fs.mkdirSync(path.dirname(output.file), { recursive: true });
  await output.build().toFile(output.file);
  const size = fs.statSync(output.file).size;
  console.log(`${output.file.padEnd(40)} ${(size / 1024).toFixed(0)} KB`);
}
