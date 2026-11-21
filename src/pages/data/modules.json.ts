import type { APIRoute } from 'astro';
import { BOT_MODULES, MODULE_STATUS_LABEL } from '../../lib/modules';
import { SITE } from '../../lib/site';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        source: `${SITE.url}/modules`,
        count: BOT_MODULES.length,
        statusVocabulary: MODULE_STATUS_LABEL,
        modules: BOT_MODULES.map((module) => ({
          id: module.id,
          name: module.name,
          group: module.group,
          status: module.status,
          statusLabel: MODULE_STATUS_LABEL[module.status],
          summary: module.summary,
          commands: module.commands ?? [],
          url: `${SITE.url}/modules/${module.id}`,
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
