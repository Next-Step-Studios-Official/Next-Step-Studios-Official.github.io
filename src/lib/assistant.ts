/**
 * The local reasoning layer for Step, the site assistant.
 *
 * This is deliberately not a language model and it makes no network calls.
 * It scores the visitor's question against a small curated fact file and the
 * same build-time search index the Search page uses, then answers using the
 * matching text. That keeps every claim traceable to a public page.
 */

export type AssistantLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type AssistantFact = {
  id: string;
  title: string;
  aliases: string[];
  answer: string;
  links?: AssistantLink[];
  /** Higher wins when two facts are equally relevant. */
  priority?: number;
};

export type AssistantEntry = {
  type: string;
  title: string;
  url: string;
  section?: string;
  text: string;
};

export type AssistantReply = {
  text: string;
  links: AssistantLink[];
  confidence: 'fact' | 'index' | 'unknown' | 'smalltalk';
};

const STOP_WORDS = new Set([
  'a',
  'about',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'been',
  'being',
  'but',
  'by',
  'can',
  'could',
  'did',
  'do',
  'does',
  'for',
  'from',
  'had',
  'has',
  'have',
  'he',
  'her',
  'here',
  'hers',
  'him',
  'his',
  'how',
  'i',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'just',
  'me',
  'my',
  'of',
  'on',
  'or',
  'our',
  'ours',
  'she',
  'should',
  'so',
  'some',
  'tell',
  'than',
  'that',
  'the',
  'their',
  'them',
  'then',
  'there',
  'these',
  'they',
  'this',
  'those',
  'to',
  'too',
  'us',
  'was',
  'we',
  'were',
  'what',
  'when',
  'where',
  'which',
  'who',
  'why',
  'will',
  'with',
  'would',
  'you',
  'your',
  'yours',
]);

const WORD_ALIASES: Record<string, string> = {
  whats: 'what is',
  whos: 'who is',
  wheres: 'where is',
  hows: 'how is',
  dont: 'do not',
  doesnt: 'does not',
  cant: 'cannot',
  im: 'i am',
  ur: 'your',
  u: 'you',
  r: 'are',
  pls: 'please',
  plz: 'please',
  thx: 'thanks',
};

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s/+.#-]/g, ' ')
    .split(' ')
    .flatMap((word) => (WORD_ALIASES[word] ?? word).split(' '))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

const rawWords = (value: string): string[] => normalize(value).split(' ').filter(Boolean);

const queryWords = (value: string): string[] => {
  const raw = rawWords(value);
  const meaningful = raw.filter((word) => word.length > 1 && !STOP_WORDS.has(word));
  return meaningful.length > 0 ? meaningful : raw;
};

const stem = (word: string): string => {
  if (['status', 'analysis', 'business', 'address'].includes(word)) return word;
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  if (word.length > 5 && word.endsWith('ed')) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith('ses')) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
};

/**
 * A small, explicit thesaurus. It lets “creator” reach the operator fact and
 * “pricing” reach the pricing answer without pretending to understand
 * arbitrary language. Synonyms score below a direct word match.
 */
const SYNONYM_GROUPS = [
  ['owner', 'creator', 'created', 'founder', 'founded', 'runs', 'run', 'started', 'made', 'operator'],
  ['cost', 'price', 'pricing', 'fee', 'free', 'paid'],
  ['contact', 'email', 'reach', 'message', 'enquire', 'inquiry'],
  ['delete', 'remove', 'erase', 'deletion', 'access', 'correct'],
  ['rules', 'rule', 'guideline', 'guidelines', 'policy', 'policies', 'terms'],
  ['team', 'staff', 'people', 'contributors', 'employees', 'members'],
  ['game', 'games', 'title', 'platform', 'engine'],
  ['bot', 'discord', 'commands'],
  ['download', 'downloads', 'pdf', 'file', 'markdown'],
  ['privacy', 'data', 'tracking', 'cookies', 'analytics'],
  ['start', 'begin', 'first', 'explore'],
  ['apply', 'application', 'applications', 'interview', 'hiring'],
  ['suggest', 'suggestion', 'suggestions', 'feedback', 'idea'],
  ['release', 'released', 'launch', 'date', 'dates', 'timeline'],
  ['help', 'support', 'issue', 'problem'],
];

const SYNONYM_STEMS = new Map<string, Set<string>>();
for (const group of SYNONYM_GROUPS) {
  const stems = group.map(stem);
  for (const value of stems) {
    const set = SYNONYM_STEMS.get(value) ?? new Set<string>();
    stems.forEach((other) => other !== value && set.add(other));
    SYNONYM_STEMS.set(value, set);
  }
}

const editDistance = (a: string, b: string): number => {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let row = 1; row <= a.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= b.length; column += 1) {
      const saved = previous[column];
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + (a[row - 1] === b[column - 1] ? 0 : 1),
      );
      diagonal = saved;
    }
  }
  return previous[b.length];
};

const isNearWord = (a: string, b: string): boolean => {
  if (a === b) return true;
  if (a.length < 5 || b.length < 5) return false;
  const allowed = Math.max(a.length, b.length) >= 8 ? 2 : 1;
  return editDistance(a, b) <= allowed;
};

const queryTerms = (value: string): { direct: string[]; related: string[] } => {
  const direct = [...new Set(queryWords(value).map(stem))];
  const related = new Set<string>();
  direct.forEach((term) => {
    SYNONYM_STEMS.get(term)?.forEach((synonym) => {
      if (!direct.includes(synonym)) related.add(synonym);
    });
  });
  return { direct, related: [...related] };
};

const uniqueLinks = (links: AssistantLink[]): AssistantLink[] => {
  const seen = new Set<string>();
  return links.filter((link) => {
    if (!link.href || seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
};

const phraseScore = (query: string, phrases: string[]): number => {
  const normal = normalize(query);
  if (!normal) return 0;
  return phrases.reduce((best, phrase) => {
    const target = normalize(phrase);
    if (!target) return best;
    if (target === normal) return Math.max(best, 30);
    if (normal.length > 4 && target.startsWith(`${normal} `)) return Math.max(best, 16);
    if (normal.length > 4 && target.includes(normal)) return Math.max(best, 8);
    return best;
  }, 0);
};

const factScore = (fact: AssistantFact, query: string): number => {
  const { direct, related } = queryTerms(query);
  const targetStems = new Set(
    rawWords(`${fact.title} ${fact.aliases.join(' ')}`).map(stem),
  );
  const directHits = direct.filter((word) => targetStems.has(word));
  const relatedHits = related.filter((word) => targetStems.has(word));
  const nearHits = direct.filter(
    (word) => !targetStems.has(word) && [...targetStems].some((target) => isNearWord(word, target)),
  );
  if (directHits.length === 0 && relatedHits.length === 0 && nearHits.length === 0) return 0;

  let score = directHits.length * 8 + relatedHits.length * 4 + nearHits.length * 10;
  score += phraseScore(query, [fact.title, ...fact.aliases]);
  if (fact.priority) score += fact.priority;
  if (direct.length > 1) score -= (direct.length - directHits.length) * 2;
  return score;
};

const bestFact = (facts: AssistantFact[], query: string): { fact: AssistantFact; score: number } | null => {
  let best: { fact: AssistantFact; score: number } | null = null;
  for (const fact of facts) {
    const score = factScore(fact, query);
    if (score < 8) continue;
    if (!best || score > best.score) best = { fact, score };
  }
  return best;
};

const snippet = (text: string, terms: string[], limit = 300): string => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return '';
  const lower = clean.toLowerCase();
  let at = -1;
  for (const term of terms) {
    const found = lower.indexOf(term.toLowerCase());
    if (found >= 0 && (at < 0 || found < at)) at = found;
  }
  if (at < 0) return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean;
  const start = Math.max(0, at - Math.round(limit * 0.35));
  const end = Math.min(clean.length, start + limit);
  return `${start > 0 ? '…' : ''}${clean.slice(start, end).trim()}${end < clean.length ? '…' : ''}`;
};

const searchReply = (query: string, entries: AssistantEntry[]): AssistantReply | null => {
  const queryStems = queryTerms(query).direct;
  if (queryStems.length === 0) return null;
  const normal = normalize(query);

  const scored = entries
    .map((entry) => {
      const title = normalize(entry.title);
      const section = normalize(entry.section ?? '');
      const text = normalize(entry.text);
      let score = 0;
      let matched = 0;
      let titleMatch = false;
      let sectionMatch = false;
      let textHits = 0;

      for (const term of queryStems) {
        let found = false;
        if (title.includes(term)) {
          score += 12;
          titleMatch = true;
          found = true;
        } else if (section.includes(term)) {
          score += 5;
          sectionMatch = true;
          found = true;
        } else if (text.includes(term)) {
          const count = text.split(term).length - 1;
          textHits += Math.min(3, count);
          score += Math.min(6, count * 2);
          found = true;
        }
        if (found) matched += 1;
      }

      if (matched === 0) return null;
      if (matched === queryStems.length && (titleMatch || sectionMatch || textHits >= 2)) {
        score += 8;
      }
      if (normal.length > 4 && text.includes(normal)) score += 15;
      return { entry, score };
    })
    .filter((value): value is { entry: AssistantEntry; score: number } => value !== null)
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score < 12) return null;

  const bestText = best.entry.type === 'FAQ' ? best.entry.text : snippet(best.entry.text, queryWords(query));
  let text = bestText;
  if (best.entry.type === 'FAQ') {
    text = best.entry.text.replace(/\s+/g, ' ').trim();
    if (text.length > 620) text = `${text.slice(0, 620).trim()}…`;
  } else if (best.entry.type === 'Project') {
    text = `${best.entry.title} is listed as ${best.entry.section ?? 'a project'}. ${bestText}`;
  } else if (best.entry.type === 'Policy') {
    text = `The ${best.entry.title} covers this. From the document: ${bestText}`;
  } else if (best.entry.type === 'Command') {
    text = `${best.entry.title} is part of ${best.entry.section ?? 'the command reference'}. ${bestText}`;
  } else if (best.entry.type === 'Module') {
    text = `${best.entry.title} is described as ${best.entry.section ?? 'a module'}. ${bestText}`;
  } else if (best.entry.type === 'Devlog') {
    text = `The devlog entry “${best.entry.title}” says: ${bestText}`;
  } else if (best.entry.type === 'Roadmap') {
    text = `The roadmap lists “${best.entry.title}” as ${best.entry.section ?? 'an item'}. ${bestText}`;
  } else if (best.entry.type === 'Glossary') {
    text = `${best.entry.title}: ${bestText}`;
  } else {
    text = `The ${best.entry.title} page says: ${bestText}`;
  }

  const related = scored.find(
    (candidate) =>
      candidate.entry.url !== best.entry.url &&
      candidate.score >= best.score * 0.82 &&
      candidate.entry.type !== best.entry.type,
  );

  return {
    text,
    links: uniqueLinks([
      { href: best.entry.url, label: `Open ${best.entry.title}` },
      ...(related
        ? [{ href: related.entry.url, label: `Related: ${related.entry.title}` }]
        : []),
    ]),
    confidence: 'index',
  };
};

const unknownReply = (query: string): AssistantReply => {
  const search = `/search?q=${encodeURIComponent(query.trim())}`;
  return {
    text:
      "I don't have that in Next Step Studios' public pages, so I won't guess. " +
      'You can search the whole site, or send the studio a message and a person will read it.',
    links: [
      { href: search, label: 'Search the site' },
      { href: '/contact', label: 'Contact the studio' },
    ],
    confidence: 'unknown',
  };
};

const greeting = (): AssistantReply => ({
  text:
    "Hi — I'm Step, the local guide to Next Step Studios. I can answer from the studio's public " +
    'pages: the studio, the bot, projects, policies, team, links and contact. What would you like to know?',
  links: [],
  confidence: 'smalltalk',
});

const assistantIdentity = (): AssistantReply => ({
  text:
    "I'm Step, a local knowledge assistant built into this site. I answer from Next Step Studios' " +
    'public pages with local keyword matching, synonym handling and a little typo tolerance — not a ' +
    'cloud model, and no API key. The conversation stays in this tab and resets when you reload. ' +
    'If the public pages do not cover something, I say so.',
  links: [],
  confidence: 'smalltalk',
});

const capabilities = (): AssistantReply => ({
  text:
    'I can answer from the public site: the studio and team, Next Step Bot, projects, commands and ' +
    'modules, policies and privacy, community links, downloads, the roadmap and the devlog. I can ' +
    'also search the full site index when a question is worded differently. I cannot read private ' +
    'studio information, Discord messages or anything that is not on a public page.',
  links: [
    { href: '/projects', label: 'Projects' },
    { href: '/policies', label: 'Policies' },
    { href: '/search', label: 'Search the site' },
  ],
  confidence: 'smalltalk',
});

const thanks = (): AssistantReply => ({
  text: "You're welcome. Ask another question whenever you like.",
  links: [],
  confidence: 'smalltalk',
});

const farewell = (): AssistantReply => ({
  text: 'Thanks for stopping by. You can reopen Step from the bottom-right corner whenever you need it.',
  links: [],
  confidence: 'smalltalk',
});

/**
 * Answer one question. The component calls this only after the local fact file
 * and search index are loaded, so this function is synchronous and deterministic.
 */
export const answerQuestion = (
  query: string,
  facts: AssistantFact[],
  entries: AssistantEntry[],
): AssistantReply => {
  const trimmed = query.trim();
  if (!trimmed) return greeting();

  const normal = normalize(trimmed);
  if (
    /^(hi|hello|hey|hiya|yo|good morning|good afternoon|good evening)$/.test(normal) ||
    /^(hi|hello|hey)[, ]/.test(normal)
  ) {
    return greeting();
  }
  if (/^(thanks|thank you|thanks a lot|cheers|great|perfect|got it|okay|ok)$/.test(normal)) {
    return thanks();
  }
  if (/^(bye|goodbye|see you|see ya|good night)$/.test(normal)) {
    return farewell();
  }
  if (
    /^(who are you|what are you|who made you|who built you|are you (an? )?(ai|bot|human|person|real)|what model|how do you work)$/.test(
      normal,
    )
  ) {
    return assistantIdentity();
  }
  if (
    /^(help|help me|what can you do|what can i ask|what do you know|how can you help|what do you do)$/.test(
      normal,
    )
  ) {
    return capabilities();
  }

  const match = bestFact(facts, trimmed);
  if (match) {
    return {
      text: match.fact.answer,
      links: uniqueLinks(match.fact.links ?? []),
      confidence: 'fact',
    };
  }

  return searchReply(trimmed, entries) ?? unknownReply(trimmed);
};

/** Suggestions shown before the visitor has asked anything. */
export const STARTER_QUESTIONS = [
  'What is Next Step Studios?',
  'What is Next Step Bot?',
  'Who runs the studio?',
  'How do I contact the studio?',
  'What policies do you have?',
];
