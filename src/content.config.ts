import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The only status labels a project may carry. Anything not yet real must use
 * "Planned"; nothing here allows a claim of being released.
 */
const projectStatus = z.enum([
  'In development',
  'Prototype',
  'Testing',
  'Planned',
  'On hold',
]);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    status: projectStatus,
    category: z.string(),
    summary: z.string(),
    /** Shown on the home page when true. Only one project should set this. */
    featured: z.boolean().default(false),
    /** Used for ordering the projects index. */
    order: z.number().default(100),
  }),
});

const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    /** Short topical tags, used for the tag pages and the RSS feed. */
    tags: z.array(z.string()).default([]),
    /** Optional series name; entries in a series link to each other. */
    series: z.string().optional(),
  }),
});

const policies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/policies' }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    version: z.string(),
    docStatus: z.string(),
    appliesTo: z.string(),
    order: z.number().default(100),
    summary: z.string(),
  }),
});

export const collections = { projects, devlog, policies };
