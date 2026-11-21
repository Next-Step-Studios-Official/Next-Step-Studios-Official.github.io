#!/usr/bin/env node
/**
 * Record the latest GitHub Releases for the repositories named in
 * `RELEASE_REPOS` (comma-separated, e.g. "Next-Step-Studios-Official/games").
 *
 * The site never hosts build artefacts itself: this script only writes
 * download links into `src/data/releases.json`, and the downloads page reads
 * that manifest. With no repositories configured the script leaves the file
 * alone, so a fresh clone builds without network access.
 *
 * Optional: GITHUB_TOKEN raises the GitHub API rate limit.
 */
import { writeFile } from 'node:fs/promises';

const MANIFEST = 'src/data/releases.json';
const repos = (process.env.RELEASE_REPOS ?? '')
  .split(',')
  .map((repo) => repo.trim())
  .filter(Boolean);

if (repos.length === 0) {
  console.log('fetch-releases: RELEASE_REPOS is not set, keeping the existing manifest.');
  process.exit(0);
}

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const releases = [];

for (const repo of repos) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=10`, {
      headers,
    });
    if (!response.ok) {
      console.warn(`fetch-releases: ${repo} returned HTTP ${response.status}; skipping.`);
      continue;
    }
    const body = await response.json();
    for (const release of body) {
      releases.push({
        repo,
        tag: release.tag_name,
        name: release.name ?? undefined,
        url: release.html_url,
        publishedAt: release.published_at ?? undefined,
        assets: (release.assets ?? [])
          .filter((asset) => asset.browser_download_url)
          .map((asset) => ({
            name: asset.name,
            size: asset.size,
            url: asset.browser_download_url,
          })),
      });
    }
  } catch (error) {
    console.warn(`fetch-releases: could not read ${repo} (${error.message}); skipping.`);
  }
}

await writeFile(
  MANIFEST,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), releases }, null, 2)}\n`,
);
console.log(`fetch-releases: ${releases.length} release(s) written to ${MANIFEST}.`);
