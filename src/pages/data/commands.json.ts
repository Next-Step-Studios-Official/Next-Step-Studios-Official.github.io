import type { APIRoute } from 'astro';
import { COMMANDS, COMMAND_GROUPS } from '../../lib/commands';
import { SITE } from '../../lib/site';

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        source: `${SITE.url}/commands`,
        count: COMMANDS.length,
        groups: COMMAND_GROUPS.map((group) => ({ id: group.id, label: group.label })),
        commands: COMMANDS,
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
