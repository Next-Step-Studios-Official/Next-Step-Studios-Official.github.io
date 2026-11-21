import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);

  return new Response(
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        source: `${SITE.url}/projects`,
        count: projects.length,
        projects: projects.map((project) => ({
          id: project.id,
          title: project.data.title,
          tagline: project.data.tagline,
          status: project.data.status,
          category: project.data.category,
          summary: project.data.summary,
          updated: project.data.updated?.toISOString().slice(0, 10) ?? null,
          url: `${SITE.url}/projects/${project.id}`,
        })),
      },
      null,
      2,
    ),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
};
