import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { COMMANDS, COMMAND_GROUPS } from '../lib/commands';
import { FAQ } from '../lib/faq';
import { ROADMAP } from '../lib/roadmap';
import { BOT_MODULES, MODULE_STATUS_LABEL } from '../lib/modules';
import { GLOSSARY } from '../lib/glossary';

export const prerender = true;

/**
 * A single flat index the search page reads once. Every entry keeps its own
 * text so results can show a real snippet rather than a title match.
 *
 * `strip` removes Markdown punctuation but keeps the words, which is what
 * matters for search.
 */
const strip = (markdown: string): string =>
  markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`>|]/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim();

type IndexEntry = {
  type: string;
  title: string;
  url: string;
  section?: string;
  text: string;
};

const PAGES: IndexEntry[] = [
  { type: 'Page', title: 'Home', url: '/', text: 'Next Step Studios independent creative and software studio Candler Shaw games software Discord bot. See the work, read the documents, official links.' },
  { type: 'Page', title: 'Projects', url: '/projects', text: 'Every project at the stage it is actually at. Status, category, sorting and filtering.' },
  { type: 'Page', title: 'Devlog', url: '/devlog', text: 'Notes from the work. Short entries about what is being built and what is unfinished.' },
  { type: 'Page', title: 'Command reference', url: '/commands', text: 'Every slash command in the Next Step Bot, grouped by area of the server.' },
  { type: 'Page', title: 'Social', url: '/social', text: 'Official accounts: YouTube, Instagram, TikTok, X, Facebook, Roblox, GitHub and the Discord invite.' },
  { type: 'Page', title: 'Official links', url: '/links', text: 'Every official link in one place, mirroring the bot links panel.' },
  { type: 'Page', title: 'About', url: '/about', text: 'The studio, the operator, how it works and what it is for.' },
  { type: 'Page', title: 'Policies', url: '/policies', text: 'Discord bot policy documents: privacy, terms, acceptable use, community guidelines, moderation, data retention and security.' },
  { type: 'Page', title: 'Downloads', url: '/downloads', text: 'Every policy document as Markdown, plain text, print layout and PDF, plus one combined file.' },
  { type: 'Page', title: 'Roadmap', url: '/roadmap', text: 'What is in development, what is planned and what has been decided against.' },
  { type: 'Page', title: 'FAQ', url: '/faq', text: 'Questions about the bot, the server, data, moderation, privacy and this website.' },
  { type: 'Page', title: 'Changelog', url: '/changelog', text: 'What changed on this website, version by version.' },
  { type: 'Page', title: 'Status', url: '/status', text: 'The current state of the website, the documents and the bot.' },
  { type: 'Page', title: 'Stack', url: '/stack', text: 'What the website and the bot are built with, and what is deliberately absent.' },
  { type: 'Page', title: 'Contact', url: '/contact', text: 'Email, privacy requests and support ticket guidance.' },
  { type: 'Page', title: 'Website privacy', url: '/website-privacy', text: 'What this website does and does not collect.' },
  { type: 'Page', title: 'Module register', url: '/modules', text: 'Every module in the Next Step Bot source with its commands, status and data touchpoints.' },
  { type: 'Page', title: 'Trust centre', url: '/trust', text: 'Policies, security, retention, data requests, status and how to verify the claims.' },
  { type: 'Page', title: 'Press kit', url: '/press', text: 'Logos in PNG, JPG, WebP and SVG, colours, typefaces, boilerplate and retired marks.' },
  { type: 'Page', title: 'Brand guidelines', url: '/brand', text: 'Clear space, minimum size, backgrounds, misuse and the palette.' },
  { type: 'Page', title: 'Glossary', url: '/glossary', text: 'Plain-language definitions of ticket, escalation, retention, transcript, infraction and more.' },
];

export const GET: APIRoute = async () => {
  const policies = await getCollection('policies');
  const posts = await getCollection('devlog');
  const projects = await getCollection('projects');

  const entries: IndexEntry[] = [
    ...PAGES,
    ...projects.map((project) => ({
      type: 'Project',
      title: project.data.title,
      url: `/projects/${project.id}`,
      section: project.data.category,
      text: strip(`${project.data.tagline} ${project.data.summary} ${project.body ?? ''}`),
    })),
    ...policies.map((policy) => ({
      type: 'Policy',
      title: policy.data.title,
      url: `/policies/bot/${policy.id.replace(/^bot\//, '')}`,
      section: policy.data.shortTitle,
      text: strip(`${policy.data.summary} ${policy.body ?? ''}`),
    })),
    ...posts.map((post) => ({
      type: 'Devlog',
      title: post.data.title,
      url: `/devlog/${post.id}`,
      section: post.data.tags.join(' · '),
      text: strip(`${post.data.summary} ${post.body ?? ''}`),
    })),
    ...COMMAND_GROUPS.flatMap((group) =>
      COMMANDS.filter((command) => command.group === group.id).map((command) => ({
        type: 'Command',
        title: `/${command.name}`,
        url: '/commands',
        section: group.label,
        text: `${command.description} ${command.note ?? ''}`,
      })),
    ),
    ...FAQ.map((entry) => ({
      type: 'FAQ',
      title: entry.question,
      url: '/faq',
      text: entry.answer,
    })),
    ...ROADMAP.map((item) => ({
      type: 'Roadmap',
      title: item.title,
      url: '/roadmap',
      section: item.status,
      text: `${item.summary} ${item.points.join(' ')}`,
    })),
    ...BOT_MODULES.map((module) => ({
      type: 'Module',
      title: module.name,
      url: `/modules/${module.id}`,
      section: MODULE_STATUS_LABEL[module.status],
      text: `${module.summary} ${(module.commands ?? []).join(' ')}`,
    })),
    ...GLOSSARY.flatMap((group) =>
      group.terms.map((term) => ({
        type: 'Glossary',
        title: term.term,
        url: `/glossary#${term.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        section: `Glossary · ${group.letter}`,
        text: term.definition,
      })),
    ),
  ];

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
