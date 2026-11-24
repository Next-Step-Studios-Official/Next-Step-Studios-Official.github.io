import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import categoriesData from '../data/places-left-behind-categories.json';
import sourceData from '../data/places-left-behind-docs-source.json';

export const PLACES_DOCS_INDEX = '/docs/places-left-behind';

export type PlacesDocCategory = {
  id: string;
  label: string;
  description: string;
  order: number;
};

export const PLACES_DOC_CATEGORIES = [...(categoriesData as PlacesDocCategory[])].sort(
  (a, b) => a.order - b.order,
);

export const PLACES_DOCS_SOURCE = sourceData as {
  repository: string;
  commit: string;
  shortCommit: string;
  commitDate: string;
  syncedAt: string;
  sourceRoot: string;
  documentCount: number;
  licensingDocumentCount: number;
  engineeringDocumentCount: number;
  excluded: { path: string; reason: string }[];
  sourceOnlyLinks: string[];
};

export type PlacesDocEntry = CollectionEntry<'placesDocs'>;

export const categoryFor = (id: string): PlacesDocCategory => {
  const category = PLACES_DOC_CATEGORIES.find((item) => item.id === id);
  if (!category) throw new Error(`Unknown Places Left Behind documentation category: ${id}`);
  return category;
};

export const docPath = (entry: PlacesDocEntry) => `${PLACES_DOCS_INDEX}/${entry.id}`;

// A status such as “Current — … with a draft process for the future” is still
// current. Only statuses that begin with Draft or Future Draft are drafts.
export const isDraftDocStatus = (docStatus: string) => /^(?:future\s+)?draft\b/i.test(docStatus);

export type DocStatusTone = 'current' | 'draft' | 'future' | 'reference';

export const docStatusTone = (docStatus: string): DocStatusTone => {
  if (/^current/i.test(docStatus)) return 'current';
  if (/^future/i.test(docStatus)) return 'future';
  if (/^draft/i.test(docStatus)) return 'draft';
  return 'reference';
};

export const docStatusClass = (docStatus: string) => {
  switch (docStatusTone(docStatus)) {
    case 'current':
      return 'status status--testing';
    case 'future':
      return 'status status--prototype';
    case 'draft':
      return 'status status--draft';
    default:
      return 'status status--planned';
  }
};

export const versionLabel = (version: string) =>
  version === 'Not versioned' ? 'Unversioned' : `v${version}`;

export const formatDocDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

export const getPlacesDocs = async (): Promise<PlacesDocEntry[]> => {
  const docs = await getCollection('placesDocs');
  return docs.sort(
    (a, b) =>
      categoryFor(a.data.category).order - categoryFor(b.data.category).order ||
      a.data.order - b.data.order,
  );
};

export const groupPlacesDocs = (docs: PlacesDocEntry[]) =>
  PLACES_DOC_CATEGORIES.map((category) => ({
    category,
    docs: docs.filter((doc) => doc.data.category === category.id),
  })).filter((group) => group.docs.length > 0);

export const countPlacesDocs = (docs: PlacesDocEntry[]) => {
  const current = docs.filter((doc) => docStatusTone(doc.data.docStatus) === 'current').length;
  const draft = docs.filter((doc) => isDraftDocStatus(doc.data.docStatus)).length;
  const reference = docs.filter((doc) => docStatusTone(doc.data.docStatus) === 'reference').length;
  return {
    total: docs.length,
    current,
    draft,
    reference,
    categories: new Set(docs.map((doc) => doc.data.category)).size,
  };
};
