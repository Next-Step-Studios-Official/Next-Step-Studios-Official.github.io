import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import docCategories from './data/places-left-behind-categories.json';

const placesDocCategoryIds = docCategories.map((category) => category.id) as [
  string,
  ...string[],
];

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

const projectCategory = z.enum(['Discord bot', 'Games', 'Apps & tools', 'Website']);

const projectGalleryImage = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    status: projectStatus,
    category: projectCategory,
    summary: z.string(),
    /** Shown on the home page when true. Only one project should set this. */
    featured: z.boolean().default(false),
    /** Used for ordering the projects index. */
    order: z.number().default(100),
    /** Optional cover art, relative to /public. */
    cover: z.string().optional(),
    /** Optional pictures shown in the project gallery, in display order. */
    gallery: z.array(projectGalleryImage).default([]),
    /** Last date the status or copy was reviewed. */
    updated: z.coerce.date().optional(),
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
    /** Plain-language summary shown above the full document. */
    plainSummary: z.string().max(600),
    /** Date this version was recorded, used for version history. */
    updated: z.coerce.date(),
  }),
});

/**
 * Places Left Behind's own documentation, imported verbatim from the game
 * repository by `npm run docs:sync`. These are intentionally not in the
 * general policy collection: the game's documents have their own page, status
 * labels and navigation.
 */
const placesDocs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/places-left-behind-docs' }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    docStatus: z.string(),
    summary: z.string(),
    sourceId: z.string(),
    sourcePath: z.string(),
    category: z.enum(placesDocCategoryIds),
    order: z.number().default(100),
    lastRevised: z.coerce.date().optional(),
    sourceCommit: z.string(),
    legal: z.boolean().default(true),
  }),
});

export const collections = { projects, devlog, policies, placesDocs };
