/**
 * The downloads catalogue.
 *
 * Three sources feed it, in this order:
 *  1. The policy documents, generated from `src/content/policies` — both the
 *     Discord bot set and the website set.
 *  2. Hand-written entries in `src/data/downloads.json` (brand assets, sheets).
 *  3. GitHub Releases recorded in `src/data/releases.json` by
 *     `scripts/fetch-releases.mjs`. Releases are preferred over binaries
 *     committed to this repository — the site only links to them.
 *
 * Nothing here invents a file, a version or a size: an entry without one of
 * those simply does not show it.
 */
import downloadsFile from '../data/downloads.json';
import releasesFile from '../data/releases.json';
import { getDocuments } from './documents';

export type DownloadCategory = 'documents' | 'brand' | 'games' | 'apps' | 'tools' | 'media';
export type DownloadPlatform = 'windows' | 'linux' | 'macos' | 'android' | 'any';
export type DownloadKind = 'installer' | 'archive' | 'document' | 'source' | 'media';

export type DownloadFormat = { label: string; href: string; download?: boolean };

export type DownloadItem = {
  slug: string;
  title: string;
  summary: string;
  category: DownloadCategory;
  platforms: DownloadPlatform[];
  kinds: DownloadKind[];
  version?: string;
  size?: string;
  /** The primary file, page or release. */
  href: string;
  /** The GitHub release this asset belongs to, when there is one. */
  releaseUrl?: string;
  /** Extra formats, e.g. Markdown and plain text beside a PDF. */
  formats?: DownloadFormat[];
  /** Marks an entry that is listed but not downloadable yet. */
  planned?: boolean;
};

export const CATEGORY_LABELS: Record<DownloadCategory, string> = {
  documents: 'Documents',
  brand: 'Brand & press',
  games: 'Games',
  apps: 'Apps',
  tools: 'Tools',
  media: 'Media',
};

export const CATEGORY_DESCRIPTIONS: Record<DownloadCategory, string> = {
  documents: 'Policies, reference sheets and printable editions.',
  brand: 'The brand kit, logos and press artwork.',
  games: 'Game builds, demos and prototypes.',
  apps: 'Desktop and mobile applications.',
  tools: 'Utilities, scripts and companion tools.',
  media: 'Wallpapers, banners, screenshots and video.',
};

export const PLATFORM_LABELS: Record<DownloadPlatform, string> = {
  windows: 'Windows',
  linux: 'Linux',
  macos: 'macOS',
  android: 'Android',
  any: 'Any platform',
};

export const KIND_LABELS: Record<DownloadKind, string> = {
  installer: 'Installer',
  archive: 'Archive',
  document: 'Document',
  source: 'Source',
  media: 'Media',
};

type ManualEntry = Partial<DownloadItem> & {
  slug: string;
  title: string;
  summary: string;
  href: string;
};

type ReleaseAsset = {
  name: string;
  size?: number;
  url: string;
  category?: DownloadCategory;
  platform?: DownloadPlatform;
  kind?: DownloadKind;
};

type ReleaseRecord = {
  repo: string;
  tag: string;
  name?: string;
  url: string;
  publishedAt?: string;
  assets: ReleaseAsset[];
};

const manual = (downloadsFile as ManualEntry[]).map<DownloadItem>((entry) => ({
  category: 'documents',
  platforms: ['any'],
  kinds: ['archive'],
  ...entry,
}));

const platformFromName = (name: string): DownloadPlatform => {
  const lower = name.toLowerCase();
  if (/(win|windows|\.exe|\.msi)/.test(lower)) return 'windows';
  if (/(linux|\.appimage|\.deb|\.rpm)/.test(lower)) return 'linux';
  if (/(mac|macos|osx|\.dmg)/.test(lower)) return 'macos';
  if (/(android|\.apk|\.aab)/.test(lower)) return 'android';
  return 'any';
};

const kindFromName = (name: string): DownloadKind => {
  const lower = name.toLowerCase();
  if (/(\.exe|\.msi|\.dmg|\.apk|\.appimage|setup|installer)/.test(lower)) return 'installer';
  if (/(\.zip|\.7z|\.rar|\.tar|\.gz)/.test(lower)) return 'archive';
  if (/(\.md|\.txt|\.pdf|\.docx|\.csv|\.json)/.test(lower)) return 'document';
  if (/(\.png|\.jpg|\.webp|\.mp4|\.webm)/.test(lower)) return 'media';
  return 'source';
};

const formatSize = (bytes?: number) =>
  typeof bytes === 'number' && bytes > 0 ? `${(bytes / 1024).toFixed(1)} KB` : undefined;

const releaseItems = (releasesFile as { releases: ReleaseRecord[] }).releases.flatMap((release) =>
  release.assets.map<DownloadItem>((asset) => ({
    slug: `${release.repo}-${release.tag}-${asset.name}`.replace(/[^a-z0-9.-]+/gi, '-').toLowerCase(),
    title: asset.name,
    summary: `${release.name ?? release.tag} — published on GitHub Releases.`,
    category: asset.category ?? 'documents',
    platforms: [asset.platform ?? platformFromName(asset.name)],
    kinds: [asset.kind ?? kindFromName(asset.name)],
    version: release.tag,
    size: formatSize(asset.size),
    href: asset.url,
    releaseUrl: release.url,
  })),
);

/** Every item the catalogue can show, with the documents last. */
export async function getCatalogue(): Promise<DownloadItem[]> {
  const documents = await getDocuments();

  const documentItems: DownloadItem[] = documents.map((doc) => ({
    slug: doc.key,
    title: doc.shortTitle,
    summary: doc.summary,
    category: 'documents',
    platforms: ['any'],
    kinds: ['document'],
    version: doc.version,
    size: formatSize(doc.bytes),
    href: `/downloads/${doc.key}.pdf`,
    formats: [
      { label: 'PDF', href: `/downloads/${doc.key}.pdf`, download: true },
      { label: 'MD', href: doc.downloadPath, download: true },
      { label: 'TXT', href: `/downloads/${doc.key}.txt`, download: true },
      { label: 'Print', href: `/downloads/print/${doc.key}` },
    ],
  }));

  return [...manual, ...releaseItems, ...documentItems];
}
