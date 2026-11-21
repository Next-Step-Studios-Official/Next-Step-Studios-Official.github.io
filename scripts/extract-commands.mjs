/**
 * Reads the Discord bot's cogs and prints every slash command it finds.
 * One-off authoring tool: the website keeps a curated copy of the output.
 *
 *   node scripts/extract-commands.mjs "D:/.../NextStepStudioBot" src/data/commands.raw.json
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];
const outFile = process.argv[3] ?? 'src/data/commands.raw.json';

if (!root) {
  console.error('Usage: node scripts/extract-commands.mjs <bot-root> [out.json]');
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== '__pycache__') walk(full);
    } else if (entry.name.endsWith('.py')) {
      files.push(full);
    }
  }
})(path.join(root, 'bot', 'cogs'));

/** Find the closing paren for a call starting at `openIndex`. */
function matchParen(src, openIndex) {
  let depth = 0;
  let quote = null;
  for (let i = openIndex; i < src.length; i += 1) {
    const ch = src[i];
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === '(') depth += 1;
    else if (ch === ')') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Read the literal Python string(s) from an assignment, e.g. name="x" or name=A.B */
function literalArg(body, key) {
  const re = new RegExp(`\\b${key}\\s*=\\s*`, 'g');
  const match = re.exec(body);
  if (!match) return null;
  let i = match.index + match[0].length;
  const quote = body[i];
  if (quote === '"' || quote === "'") {
    let value = '';
    for (i += 1; i < body.length; i += 1) {
      if (body[i] === '\\') {
        value += body[i + 1];
        i += 1;
      } else if (body[i] === quote) break;
      else value += body[i];
    }
    return value;
  }
  // Constant reference: capture up to the next comma/newline.
  const raw = body.slice(i).split(/[,\n]/)[0].trim();
  return { constant: raw };
}

const results = [];

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const needle = /@app_commands\.(command|group)\s*\(/g;
  let hit;

  while ((hit = needle.exec(src))) {
    const open = hit.index + hit[0].length - 1;
    const close = matchParen(src, open);
    if (close < 0) continue;
    const decorator = src.slice(open + 1, close);

    // The function that follows, skipping any other decorators.
    const tail = src.slice(close + 1);
    const def = tail.match(/^\s*\)?[\s\S]*?(?:async\s+)?def\s+(\w+)\s*\(/);
    const func = def?.[1] ?? '';

    // Docstring directly under the function.
    const docMatch = tail.match(/def\s+\w+\s*\([^)]*\)\s*(?:->[^:]+)?:\s*(?:"""|''')([\s\S]*?)(?:"""|''')/);
    const doc = docMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '';

    const name = literalArg(decorator, 'name');
    const description = literalArg(decorator, 'description');

    results.push({
      path: file.replace(/\\/g, '/'),
      group: file.replace(/\\/g, '/').split('/bot/cogs/')[1]?.split('/')[0] ?? 'misc',
      kind: hit[1],
      func,
      name,
      description,
      doc,
    });
  }
}

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
console.log(`Wrote ${results.length} commands to ${outFile}`);
for (const entry of results) {
  const label = typeof entry.name === 'string' ? entry.name : entry.name?.constant ?? '?';
  console.log(`${entry.group.padEnd(12)} ${label}`);
}
