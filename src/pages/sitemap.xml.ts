import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';
import { BOT_MODULES } from '../lib/modules';
import { downloadKey, policyPath } from '../lib/documents';
import { PLACES_DOCS_INDEX, PLACES_DOCS_SOURCE, docPath, getPlacesDocs } from '../lib/placesDocs';

export const prerender = true;

const STATIC_ROUTES = [
  '/',
  '/projects',
  '/devlog',
  '/commands',
  '/now',
  '/links',
  '/about',
  '/team',
  '/policies',
  PLACES_DOCS_INDEX,
  '/downloads',
  '/roadmap',
  '/faq',
  '/changelog',
  '/status',
  '/stack',
  '/search',
  '/step',
  '/contact',
  '/modules',
  '/trust',
  '/press',
  '/glossary',
  '/sitemap',
];

type SitemapRoute = {
  path: string;
  lastmod?: Date;
};

/** The most recent date in a list, ignoring entries without a usable date. */
const newest = (dates: Array<Date | undefined>) =>
  dates
    .filter((date): date is Date => date instanceof Date && Number.isFinite(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime())[0];

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL(SITE.url)).toString();
  const policies = await getCollection('policies');
  const posts = await getCollection('devlog');
  const projects = await getCollection('projects');
  const placesDocs = await getPlacesDocs();
  const placesUpdated = new Date(PLACES_DOCS_SOURCE.commitDate);

  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];

  const latestPolicy = newest(policies.map((policy) => policy.data.updated));
  const latestPost = newest(posts.map((post) => post.data.date));
  const latestProject = newest(projects.map((project) => project.data.updated));
  const latestContent = newest([latestPolicy, latestPost, latestProject]);

  const sectionDates: Record<string, Date | undefined> = {
    '/': latestContent,
    '/projects': latestProject,
    '/policies': latestPolicy,
    [PLACES_DOCS_INDEX]: placesUpdated,
    '/downloads': latestPolicy,
    '/devlog': latestPost,
  };

  const routes: SitemapRoute[] = [
    ...STATIC_ROUTES.map((path) => ({ path, lastmod: sectionDates[path] })),
    ...projects.map((project) => ({
      path: `/projects/${project.id}`,
      lastmod: project.data.updated,
    })),
    ...BOT_MODULES.map((module) => ({ path: `/modules/${module.id}` })),
    ...policies.map((policy) => ({
      path: policyPath(policy.id),
      lastmod: policy.data.updated,
    })),
    ...placesDocs.map((doc) => ({
      path: docPath(doc),
      lastmod: placesUpdated,
    })),
    ...policies.map((policy) => ({
      path: `/policies/versions/${downloadKey(policy.id)}`,
      lastmod: policy.data.updated,
    })),
    ...posts.map((post) => ({ path: `/devlog/${post.id}`, lastmod: post.data.date })),
    ...tags.map((tag) => ({
      path: `/devlog/tag/${encodeURIComponent(tag)}`,
      lastmod: newest(
        posts.filter((post) => post.data.tags.includes(tag)).map((post) => post.data.date),
      ),
    })),
    ...policies.map((policy) => ({
      path: `/downloads/${downloadKey(policy.id)}.md`,
      lastmod: policy.data.updated,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${new URL(route.path, base).toString()}</loc>${
      route.lastmod ? `\n    <lastmod>${route.lastmod.toISOString()}</lastmod>` : ''
    }
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
