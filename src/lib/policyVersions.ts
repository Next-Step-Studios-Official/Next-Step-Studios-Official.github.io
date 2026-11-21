/**
 * Recorded policy snapshots.
 *
 * `scripts/snapshot-policies.mjs` copies the body of each policy into
 * `src/data/policy-snapshots/<slug>/<version>.md` when a version is recorded.
 * The versions page compares the newest snapshot with the text currently
 * published, so a change made without recording a new version is visible
 * rather than hidden.
 */
const modules = import.meta.glob('../data/policy-snapshots/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export type Snapshot = {
  version: string;
  body: string;
};

const compareVersions = (a: string, b: string) => {
  const parse = (value: string) => value.split('.').map((part) => Number.parseInt(part, 10) || 0);
  const left = parse(a);
  const right = parse(b);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (right[index] ?? 0) - (left[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
};

export function snapshotsFor(slug: string): Snapshot[] {
  return Object.entries(modules)
    .map(([path, body]) => {
      const match = path.match(new RegExp(`/policy-snapshots/${slug}/(.+)\\.md$`));
      return match ? { version: match[1], body } : null;
    })
    .filter((entry): entry is Snapshot => Boolean(entry))
    .sort((a, b) => compareVersions(a.version, b.version));
}

export function latestSnapshot(slug: string): Snapshot | undefined {
  return snapshotsFor(slug)[0];
}

export type DiffLine = { kind: 'same' | 'add' | 'remove'; text: string };

/** Line diff by longest common subsequence. Policies are short enough for this. */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.replace(/\r\n/g, '\n').trim().split('\n');
  const b = after.replace(/\r\n/g, '\n').trim().split('\n');
  const table: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      result.push({ kind: 'same', text: a[i] });
      i += 1;
      j += 1;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      result.push({ kind: 'remove', text: a[i] });
      i += 1;
    } else {
      result.push({ kind: 'add', text: b[j] });
      j += 1;
    }
  }
  while (i < a.length) {
    result.push({ kind: 'remove', text: a[i] });
    i += 1;
  }
  while (j < b.length) {
    result.push({ kind: 'add', text: b[j] });
    j += 1;
  }
  return result;
}

export function diffSummary(lines: DiffLine[]) {
  return {
    added: lines.filter((line) => line.kind === 'add').length,
    removed: lines.filter((line) => line.kind === 'remove').length,
    unchanged: lines.filter((line) => line.kind === 'same').length,
  };
}
