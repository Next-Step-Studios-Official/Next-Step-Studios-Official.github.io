import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';
import { BOT_MODULES } from '../lib/modules';
import { downloadKey, policyPath } from '../lib/documents';

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

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL(SITE.url)).toString();
  const policies = await getCollection('policies');
  const posts = await getCollection('devlog');
  const projects = await getCollection('projects');

  const tags = [...new Set(posts.flatMap((post) => post.data.tags))];

  const routes = [
    ...STATIC_ROUTES,
    ...projects.map((project) => `/projects/${project.id}`),
    ...BOT_MODULES.map((module) => `/modules/${module.id}`),
    ...policies.map((policy) => policyPath(policy.id)),
    ...policies.map((policy) => `/policies/versions/${downloadKey(policy.id)}`),
    ...posts.map((post) => `/devlog/${post.id}`),
    ...tags.map((tag) => `/devlog/tag/${encodeURIComponent(tag)}`),
    ...policies.map((policy) => `/downloads/${downloadKey(policy.id)}.md`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${new URL(route, base).toString()}</loc>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
