import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../lib/site';
import {
  CONTRIBUTORS,
  CONTRIBUTORS_CONFIRMED,
  CONTRIBUTOR_WORD,
  TEAM_WORD,
  contributorName,
} from '../lib/contributors';
import { enabledLinks } from '../lib/links';
import { COMMANDS, COMMAND_GROUPS } from '../lib/commands';
import { BOT_MODULES, MODULE_STATUS_LABEL } from '../lib/modules';
import { FAQ } from '../lib/faq';
import { ROADMAP } from '../lib/roadmap';
import { DISCORD, discordInvite } from '../lib/discord';
import type { AssistantFact, AssistantLink } from '../lib/assistant';
import {
  POLICY_SCOPE_LABELS,
  isDraftDocument,
  policyPath,
  scopeOf,
} from '../lib/documents';

export const prerender = true;

const link = (href: string, label: string, external = false): AssistantLink => ({
  href,
  label,
  external,
});

/**
 * Follow-up questions are curated beside the facts they belong to. Each one
 * must be answerable from the public site, so a visitor never follows a chip
 * into a dead end. Generic fallbacks live in src/lib/assistant.ts.
 */
const FOLLOW_UPS: Record<string, string[]> = {
  studio: ['What projects are in development?', 'Who runs the studio?', 'How do I contact the studio?'],
  operator: ['Who is on the team?', 'What are you building?', 'How do I contact the studio?'],
  team: ['Who runs the studio?', 'Are there open roles?', 'What are you building?'],
  company: ['Who runs the studio?', 'What is Next Step Studios?', 'How do I contact the studio?'],
  careers: ['Who is on the team?', 'Can I volunteer?', 'How do I contact the studio?'],
  projects: ['What is Next Step Bot?', 'What games are planned?', 'What is on the roadmap?'],
  bot: ['Is the bot public?', 'Which modules does it have?', 'What policies cover the bot?'],
  tickets: ['How do I contact support?', 'Which modules are tested?', 'What data does the bot store?'],
  'bot-public': ['What is Next Step Bot?', 'When will it be released?', 'Can I join the Discord?'],
  games: ['What projects are planned?', 'Is there a release date?', 'What is on the roadmap?'],
  tools: ['What projects are planned?', 'What is Next Step Bot?', 'What is on the roadmap?'],
  policies: ['What does the Privacy Policy cover?', 'Why are the policies still drafts?', 'How do I request my data?'],
  'privacy-overview': ['Does the website track me?', 'Does Step store my questions?', 'How do I request data deletion?'],
  'privacy-website': ['Does Step store my questions?', 'What about the bot privacy policy?', 'How do I contact the studio?'],
  'privacy-bot': ['How do I delete my data?', 'What does the retention policy say?', 'How do I contact the studio?'],
  'data-deletion': ['What data does the bot store?', 'What does the retention policy say?', 'How do I contact the studio?'],
  appeals: ['What is the moderation policy?', 'How do I open a ticket?', 'How do I contact the studio?'],
  security: ['What data does the bot store?', 'Why are the policies drafts?', 'How do I contact the studio?'],
  location: ['How do I contact the studio?', 'Who runs the studio?', 'What is Next Step Studios?'],
  contact: ['What policies do you have?', 'Where is the studio located?', 'Where are your official links?'],
  start: ['What is Next Step Bot?', 'What policies do you have?', 'What is on the roadmap?'],
  rules: ['How do I appeal a moderation decision?', 'Can I join the Discord?', 'How do I contact the studio?'],
  applications: ['Which modules are tested?', 'Can I suggest a feature?', 'How do I contact the studio?'],
  suggestions: ['How do I contact the studio?', 'Which modules are tested?', 'What is on the roadmap?'],
  pricing: ['Is the bot public?', 'What projects exist?', 'How do I contact the studio?'],
  'release-dates': ['What is on the roadmap?', 'What projects are planned?', 'Is the bot public?'],
  discord: ['What are the server rules?', 'What is Next Step Bot?', 'Where are your official links?'],
  socials: ['Where are your official links?', 'How do I join the Discord?', 'How do I contact the studio?'],
  'official-links': ['What social accounts are official?', 'How do I join the Discord?', 'How do I contact the studio?'],
  commands: ['What modules does the bot have?', 'Why are some commands not verified?', 'What is Next Step Bot?'],
  modules: ['Which modules are tested?', 'What commands does the bot have?', 'What policies cover the bot?'],
  downloads: ['What policies are available?', 'Is there a press kit?', 'How do I read the policies?'],
  brand: ['Where is the press kit?', 'What are the brand guidelines?', 'How do I contact the studio?'],
  'site-tech': ['Does the website track me?', 'Does Step store my questions?', 'Where is the source code?'],
  status: ['Is the website live?', 'What is the status?', 'What is on the roadmap?'],
  roadmap: ['What is the release date?', 'What projects are planned?', 'What are you working on now?'],
  now: ['What is Next Step Bot?', 'What is on the roadmap?', 'What changed recently?'],
  search: ['What can you do?', 'What policies do you have?', 'Where should I start?'],
  assistant: ['Do you save my messages?', 'What can you do?', 'Are you an AI model?'],
  'assistant-storage': ['What can you do?', 'Does the website track me?', 'How do I contact the studio?'],
  devlog: ['What changed recently?', 'What is on the roadmap?', 'What is the status?'],
  changelog: ['What is the latest devlog?', 'What is on the roadmap?', 'What is the status?'],
  source: ['What is this site built with?', 'Why are the policies drafts?', 'What can you do?'],
  'project-next-step-bot': ['Is the bot public?', 'Which modules does it have?', 'What policies cover the bot?'],
  'project-first-game': ['What games are planned?', 'What is on the roadmap?', 'What projects exist?'],
  'project-studio-tools': ['What projects are planned?', 'What is on the roadmap?', 'What is Next Step Bot?'],
};

const fact = (
  id: string,
  title: string,
  aliases: string[],
  answer: string,
  links: AssistantLink[] = [],
  priority = 0,
): AssistantFact => ({ id, title, aliases, answer, links, followUps: FOLLOW_UPS[id], priority });

const projectPath = (id: string) => `/projects/${id}`;
const postPath = (id: string) => `/devlog/${id}`;
const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);

export const GET: APIRoute = async () => {
  const [policies, projects, posts] = await Promise.all([
    getCollection('policies'),
    getCollection('projects'),
    getCollection('devlog'),
  ]);

  projects.sort((a, b) => a.data.order - b.data.order);
  const scopeRank = { bot: 0, website: 1 } as const;
  policies.sort(
    (a, b) => scopeRank[scopeOf(a.id)] - scopeRank[scopeOf(b.id)] || a.data.order - b.data.order,
  );
  posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const socialLinks = enabledLinks().filter(
    (entry) => entry.section === 'social' && entry.type === 'link' && entry.url,
  );
  const socialNames = socialLinks.map((entry) => entry.name);
  const projectNames = projects.map(
    (project) => `${project.data.title} (${project.data.status.toLowerCase()})`,
  );
  const policyNames = policies.map(
    (policy) =>
      `${policy.data.shortTitle} (${POLICY_SCOPE_LABELS[scopeOf(policy.id)]}, v${policy.data.version}, ${isDraftDocument(policy.data.docStatus) ? 'draft' : 'current'})`,
  );
  const latestPosts = posts.slice(0, 3).map((post) => post.data.title);
  const moduleStatuses = (Object.keys(MODULE_STATUS_LABEL) as Array<keyof typeof MODULE_STATUS_LABEL>)
    .map((status) => `${MODULE_STATUS_LABEL[status]}: ${BOT_MODULES.filter((module) => module.status === status).length}`)
    .join('; ');

  const teamAnswer = CONTRIBUTORS_CONFIRMED
    ? `${SITE.operator} runs Next Step Studios. The team page lists the operator and ${CONTRIBUTOR_WORD} contributors, ${TEAM_WORD} people in total: ${CONTRIBUTORS.map((person) => `${contributorName(person)} (${person.role})`).join(', ')}.`
    : `${SITE.operator} runs Next Step Studios and is its only legal operator. The contributor roster is still being confirmed. The team page labels ${CONTRIBUTOR_WORD} example entries rather than presenting them as real people, and the site does not claim unconfirmed details as facts.`;

  const facts: AssistantFact[] = [
    fact(
      'studio',
      'Next Step Studios',
      [
        'what is next step studios',
        'what is the studio',
        'about the studio',
        'studio overview',
        'who is next step studios',
        'what does the studio do',
      ],
      `Next Step Studios is an independent creative and software studio run by ${SITE.operator}, with volunteer contributors whose credits are still being confirmed. It is a public-facing name rather than a registered company. The current work is Next Step Bot; games and studio tools are planned, not released.`,
      [link('/about', 'About the studio'), link('/team', 'Team')],
      8,
    ),
    fact(
      'operator',
      `Who runs Next Step Studios`,
      [
        'who runs the studio',
        'who owns the studio',
        'who created the studio',
        'who made the studio',
        'who started the studio',
        'who is candler shaw',
        'owner',
        'founder',
        'operator',
      ],
      `${SITE.operator} runs Next Step Studios and is its only legal operator. The studio is a public-facing name, not a registered company. Contributor credits are still being confirmed; no unconfirmed person is presented as a team member. Contributions are voluntary and unpaid.`,
      [link('/about', 'About the studio'), link('/team', 'Team')],
      7,
    ),
    fact(
      'team',
      'The Next Step Studios team',
      ['who works at next step studios', 'who is on the team', 'team', 'contributors', 'staff', 'employees'],
      teamAnswer,
      [link('/team', 'The team')],
      7,
    ),
    fact(
      'company',
      'Is Next Step Studios a company?',
      ['is next step studios a company', 'registered company', 'corporation', 'business', 'customers', 'clients', 'awards', 'partnerships'],
      `No. Next Step Studios is a public-facing name for an independent studio, not a registered company or corporation. The site also states that there are no employees, no paid staff, no published games or released products, and no customers, clients, awards or partnerships to cite.`,
      [link('/about', 'About the studio')],
      6,
    ),
    fact(
      'careers',
      'Jobs and working with the studio',
      ['jobs', 'careers', 'hiring', 'work for next step studios', 'can i work there', 'volunteer'],
      `The site does not list jobs or paid roles. Everyone who helps is a volunteer contributor, and nobody is employed, contracted or paid. For a general question about working together, use the contact page; do not assume a vacancy exists.`,
      [link('/about', 'About the studio'), link('/contact', 'Contact')],
      5,
    ),
    fact(
      'projects',
      'Projects',
      ['projects', 'what are you building', 'what is being built', 'current projects', 'all projects', 'portfolio'],
      `The site lists ${projects.length} projects: ${projectNames.join(', ')}. Next Step Bot and this website are in development; First Game, First App and Studio Tools are planned, with no started product.`,
      [link('/projects', 'All projects'), ...projects.map((project) => link(projectPath(project.id), project.data.title))],
      7,
    ),
    fact(
      'bot',
      'Next Step Bot',
      ['next step bot', 'the bot', 'discord bot', 'what is the bot', 'what does the bot do', 'bot project'],
      `Next Step Bot is a private Discord bot for one community server. It covers applications and staff review, support tickets, announcements, suggestions and administration. It is in development, tested against one server, and is not publicly installable.`,
      [link('/projects/next-step-bot', 'The bot project'), link('/commands', 'Command reference'), link('/modules', 'Module register')],
      8,
    ),
    fact(
      'tickets',
      'Support tickets',
      ['ticket', 'tickets', 'support ticket', 'support tickets', 'ticket panel', 'how do tickets work'],
      'Support tickets are private Discord channels for support conversations, with claim, waiting, ready and close states, reopening and escalation. The module is working in the server and still in testing; transcript generation has not been verified end to end.',
      [link('/modules/tickets', 'Support tickets module'), link('/commands', 'Command reference')],
      7,
    ),
    fact(
      'bot-public',
      'Is the Discord bot public?',
      ['is the bot public', 'can i invite the bot', 'invite the bot', 'public bot', 'bot directory', 'install the bot'],
      `No. Next Step Bot is built for one private community server and is not listed on any bot directory. There is no public invite link for the bot on this site, and the site will not add one until the release checklist is complete.`,
      [link('/projects/next-step-bot', 'The bot project'), link('/faq', 'FAQ')],
      8,
    ),
    fact(
      'games',
      'Games',
      ['games', 'game', 'first game', 'what game are you making', 'unreal', 'unity', 'roblox studio'],
      `Games are the direction the studio is heading in, but no game has been started. There is no title, genre, engine, platform or date yet. First Game is marked Planned so the intention is visible without pretending progress exists.`,
      [link('/projects/first-game', 'First Game'), link('/projects', 'Projects')],
      7,
    ),
    fact(
      'tools',
      'Studio Tools',
      ['studio tools', 'tools', 'software tools', 'utilities'],
      `Studio Tools is a planned category for small utilities that come out of building the bot and the site. No tool has been started, and the entry is a placeholder for the category rather than an announced product.`,
      [link('/projects/studio-tools', 'Studio Tools'), link('/projects', 'Projects')],
      6,
    ),
    fact(
      'policies',
      'Policies',
      ['policies', 'policy', 'documents', 'terms', 'terms of service', 'community guidelines', 'acceptable use', 'moderation policy', 'data retention', 'security overview'],
      `The site publishes ${policies.length} policy documents in two separate sets: ${policies.filter((policy) => scopeOf(policy.id) === 'bot').length} cover the Discord bot, and ${policies.filter((policy) => scopeOf(policy.id) === 'website').length} cover this website. The documents are: ${policyNames.join('; ')}. Drafts and current documents are labelled individually.`,
      [link('/policies', 'All policies'), ...policies.map((policy) => link(policyPath(policy.id), policy.data.shortTitle))],
      7,
    ),
    fact(
      'privacy-overview',
      'Privacy and personal data',
      ['privacy', 'personal data', 'data protection', 'what data do you collect', 'what data is collected', 'privacy policy'],
      `There are two separate privacy documents. The website privacy notice covers this site: no analytics, no advertising, no accounts, no tracking cookies, and one contact form. The Discord Bot Privacy Policy covers the bot and is a separate draft. This assistant does not store the conversation.`,
      [link('/policies/website/privacy', 'Website privacy notice'), link('/policies/bot/privacy', 'Bot Privacy Policy')],
      9,
    ),
    fact(
      'privacy-website',
      'Website privacy',
      ['website privacy', 'does this website track me', 'does the site track me', 'cookies', 'analytics', 'tracking', 'what does the website collect'],
      `This site has no accounts, analytics, advertising, tracking pixels, third-party embeds, tracking cookies or third-party fonts. The contact form records the name, email, subject, message, arrival time and a one-way hash of the network address for rate limiting. The theme choice is stored locally in the browser.`,
      [link('/policies/website/privacy', 'Website privacy notice'), link('/contact', 'Contact')],
      8,
    ),
    fact(
      'privacy-bot',
      'Discord Bot Privacy Policy',
      ['bot privacy', 'bot privacy policy', 'what data does the bot store', 'what does the bot store', 'discord privacy'],
      `The Discord Bot Privacy Policy describes ticket records, application records, staff profiles, suggestions, moderation and audit records. It is a draft at version 0.2.0. Data Retention explains how long each category lasts and how deletion works.`,
      [link('/policies/bot/privacy', 'Bot Privacy Policy'), link('/policies/bot/data-retention', 'Data Retention and Deletion Policy')],
      8,
    ),
    fact(
      'data-deletion',
      'Delete personal data',
      [
        'delete my data',
        'delete my information',
        'data deletion',
        'remove my data',
        'privacy request',
        'access my data',
        'correct my data',
        'request my data',
        'request data deletion',
      ],
      `Send a privacy request through the contact form or email, with the subject “Privacy Request” and your Discord user ID so the right records can be identified. Say whether you want access, correction or deletion. Some moderation and audit records have a stated retention period and cannot be deleted early.`,
      [link('/contact#privacy-requests', 'Privacy requests'), link('/policies/bot/data-retention', 'Data Retention and Deletion Policy')],
      9,
    ),
    fact(
      'appeals',
      'Appeals',
      ['appeal', 'appeal a moderation decision', 'ban appeal', 'moderation decision'],
      `Open a ticket in the Discord server if you still have access, or email the studio if you do not. The Moderation and Enforcement Policy describes the grounds for appeal and what is reviewed; it is a draft and does not promise an outcome.`,
      [link('/policies/bot/moderation', 'Moderation policy'), link('/contact', 'Contact')],
      7,
    ),
    fact(
      'security',
      'Report a security issue',
      ['security issue', 'report a security problem', 'security report', 'vulnerability', 'security'],
      `Email the studio with “security” in the subject and a description of the issue. Do not test against the live server or against other members' data. The Security and Data Protection Overview describes the intended posture.`,
      [link('/policies/bot/security', 'Security overview'), link('/contact', 'Contact')],
      8,
    ),
    fact(
      'location',
      'Location',
      ['where are you located', 'where is the studio', 'location', 'address', 'where are you based', 'office'],
      'The public site does not list a physical address, office or geographic location for Next Step Studios. Use the contact page if you need to ask the studio directly.',
      [link('/contact', 'Contact')],
      7,
    ),
    fact(
      'contact',
      'Contact',
      [
        'contact',
        'contact the studio',
        'how do i contact',
        'email',
        'get in touch',
        'send a message',
        'support',
        'speak to a human',
        'talk to a person',
        'real person',
      ],
      `Use the contact form or email ${SITE.contactEmail}. Both reach the studio operator. The form can mark privacy, security, bug, partnership or general messages. For a privacy request, include your Discord user ID.`,
      [link('/contact', 'Contact page'), link(`mailto:${SITE.contactEmail}`, 'Email the studio')],
      9,
    ),
    fact(
      'start',
      'Where to start',
      [
        'where do i start',
        'where should i start',
        'start here',
        'new here',
        'what should i read first',
        'how do i explore the site',
      ],
      'Start with the projects page for the current work, then the command reference or policy documents if you came for the bot. The search page covers every public page and section, and Step can point you to any of them.',
      [
        link('/projects', 'Projects'),
        link('/commands', 'Command reference'),
        link('/policies', 'Policies'),
        link('/search', 'Search the site'),
      ],
      6,
    ),
    fact(
      'rules',
      'Server rules and community guidelines',
      [
        'server rules',
        'what are the rules',
        'rules',
        'community guidelines',
        'guidelines',
        'how should i behave',
      ],
      'The server publishes its rules through its /rules command. The public Community Guidelines and Moderation and Enforcement Policy are on this site; both are drafts and cover the Discord bot and its community, not this website.',
      [
        link('/policies/bot/community-guidelines', 'Community Guidelines'),
        link('/policies/bot/moderation', 'Moderation and Enforcement Policy'),
      ],
      7,
    ),
    fact(
      'applications',
      'Staff applications',
      [
        'staff application',
        'apply for staff',
        'how do i apply',
        'applications',
        'staff review',
        'interview',
      ],
      'Applications and staff review cover application forms, review decisions, interview scheduling, staff profiles and an audit trail. The module works and is still in testing; it is used inside the private Discord server, not through this website.',
      [link('/modules/applications', 'Applications module'), link('/contact', 'Contact the studio')],
      7,
    ),
    fact(
      'suggestions',
      'Suggestions and feedback',
      [
        'suggest a feature',
        'suggestion',
        'suggestions',
        'feedback',
        'suggest something',
        'request a feature',
      ],
      'The server has a Suggestions module with member submissions, staff search, status changes and record clean-up. The module is tested. For a website or general studio suggestion, use the contact page.',
      [
        link('/modules/suggestions', 'Suggestions module'),
        link('/contact', 'Contact the studio'),
      ],
      6,
    ),
    fact(
      'pricing',
      'Pricing and cost',
      [
        'how much does it cost',
        'how much is it',
        'how much do you charge',
        'price',
        'pricing',
        'cost',
        'is it free',
        'paid plans',
        'subscription',
      ],
      'The public site does not list a price, subscription or paid plan. Next Step Bot is a private bot for one community server and is not publicly installable, so there is no public purchase or invite. Use the contact page for a business enquiry.',
      [link('/contact', 'Contact the studio'), link('/projects/next-step-bot', 'The bot project')],
      7,
    ),
    fact(
      'release-dates',
      'Release dates',
      [
        'when is the release',
        'release date',
        'when will it launch',
        'when is the game coming out',
        'when will the game release',
        'when will the game come out',
        'timeline',
        'dates',
        'roadmap dates',
      ],
      'The roadmap deliberately uses statuses, not dates. Next Step Bot and this website are in development, the policy set mixes drafts with current website documents, the live status page is live, games, apps and studio tools are planned, and analytics and accounts are not planned. No release date is published.',
      [link('/roadmap', 'Roadmap'), link('/projects/first-game', 'First Game')],
      7,
    ),
    fact(
      'discord',
      'Discord community',
      ['discord', 'discord server', 'join the discord', 'discord invite', 'community server'],
      `The official Discord server is at ${DISCORD.inviteUrl}. It is the same invite the bot publishes through its links panel. The links page is the authoritative list.`,
      [link(DISCORD.inviteUrl, 'Join the Discord server', true), link('/links', 'Official links')],
      7,
    ),
    fact(
      'socials',
      'Official social accounts',
      ['social media', 'socials', 'official accounts', 'where can i find you', 'follow', 'tiktok', 'instagram', 'facebook', 'x', 'youtube'],
      `The official social accounts listed on the site are ${socialNames.join(', ')}. The official links page is the only authoritative list; an account that is not there is not official.`,
      [link('/links', 'Official links'), ...socialLinks.map((entry) => link(entry.url!, entry.name, true))],
      6,
    ),
    fact(
      'official-links',
      'Official links',
      ['official links', 'links', 'all links', 'where are your links', 'official destinations'],
      `The official links page collects the website, five social accounts, Discord, Roblox, GitHub, policies and business email in one place. It mirrors the public part of the bot's links configuration.`,
      [link('/links', 'Official links')],
      7,
    ),
    fact(
      'commands',
      'Commands',
      ['commands', 'slash commands', 'command reference', 'what commands does the bot have'],
      `The command reference documents ${COMMANDS.length} slash commands in ${COMMAND_GROUPS.length} groups. Commands that are planned or not verified are labelled rather than presented as finished.`,
      [link('/commands', 'Command reference')],
      6,
    ),
    fact(
      'modules',
      'Bot modules',
      ['modules', 'bot modules', 'module register', 'what modules does the bot have'],
      `The module register lists ${BOT_MODULES.length} modules. Status counts: ${moduleStatuses}. The register separates something existing in source from a feature verified in the server.`,
      [link('/modules', 'Module register')],
      6,
    ),
    fact(
      'downloads',
      'Downloads',
      ['downloads', 'download', 'pdfs', 'markdown', 'plain text', 'policy files'],
      `Every public policy is available as a page, Markdown file, plain-text file, print layout and PDF, plus one combined file. The downloads page also lists the command cheatsheet and brand ZIP.`,
      [link('/downloads', 'Downloads')],
      5,
    ),
    fact(
      'brand',
      'Press & brand',
      ['brand', 'logo', 'logos', 'press kit', 'press', 'brand guidelines', 'brand archive', 'brand kit', 'can i use your logo', 'favicon', 'colours', 'boilerplate'],
      `The Press & brand page at /press has the boilerplate, quick facts, every current logo file, the palette and type guidance, the usage rules, the retired neon emblem and the superseded white-tile edition. One ZIP contains the complete kit. The old /brand and /archive addresses redirect into the page. The current mark is the pixel-art ninja.`,
      [link('/press', 'Press & brand'), link('/press#archive', 'Mark archive')],
      6,
    ),
    fact(
      'site-tech',
      'How this website works',
      ['how does this website work', 'what is this website built with', 'website tech', 'astro', 'github pages', 'static site', 'framework'],
      `The site is built with Astro and rendered to static HTML, served by GitHub Pages. It uses hand-written CSS, self-hosted fonts and no client-side framework, accounts, analytics or advertising. Search runs against a generated local JSON index.`,
      [link('/stack', 'Stack'), link('/policies/website/privacy', 'Website privacy')],
      5,
    ),
    fact(
      'status',
      'Status',
      ['status', 'is the bot online', 'is the site live', 'status page', 'uptime'],
      `The status page shows the current state of the website, documents and bot. The bot publishes a small JSON feed after each check; the page reads it in the browser and falls back to the copy built with the site if the feed cannot be read.`,
      [link('/status', 'Status page')],
      5,
    ),
    fact(
      'roadmap',
      'Roadmap',
      ['roadmap', 'what is next', 'future plans', 'planned', 'what are you working on next'],
      `The roadmap uses statuses, not dates. It lists Next Step Bot and the public documentation as in development or draft, this website and live status as live, games and studio tools as planned, and analytics and accounts as not planned.`,
      [link('/roadmap', 'Roadmap')],
      6,
    ),
    fact(
      'now',
      'Now',
      ['now', 'what are you working on now', 'current work', 'current focus', 'this month'],
      `The Now page is a dated snapshot of current work, not a promise. As of 22 November 2026: Next Step Bot is in development, the public policies are drafts, the website and status page are live, the Press & brand page has just been consolidated, and games and studio tools are planned rather than started.`,
      [link('/now', 'Now'), link('/roadmap', 'Roadmap')],
      6,
    ),
    fact(
      'search',
      'Search',
      ['search', 'site search', 'find something', 'where can i search'],
      `The Search page searches a generated local index of every policy, devlog entry, command, FAQ answer, roadmap item, module, glossary term and page. The query stays in the browser; there is no search service.`,
      [link('/search', 'Search the site')],
      4,
    ),
    fact(
      'assistant',
      'Step, the local assistant',
      ['step', 'assistant', 'ai', 'chatbot', 'what is your name', 'your name', 'how do you work', 'do you use an api', 'api key', 'do you remember', 'are you chatgpt'],
      `I'm Step, a local knowledge assistant built into this site. I answer from the public pages with keyword retrieval; there is no cloud model, API key, account or conversation storage. The chat resets when you reload, and I say when the public pages do not cover something.`,
      [link('/policies/website/privacy', 'Website privacy notice')],
      10,
    ),
    fact(
      'devlog',
      'Devlog',
      ['devlog', 'blog', 'development log', 'latest posts', 'recent writing'],
      `The devlog has ${posts.length} entries. The latest are: ${latestPosts.join('; ')}. Entries are written when there is something worth reporting, not to a schedule.`,
      [link('/devlog', 'Devlog'), ...posts.slice(0, 3).map((post) => link(postPath(post.id), post.data.title))],
      5,
    ),
    fact(
      'changelog',
      'Changelog',
      ['changelog', 'what changed', 'release notes', 'site history'],
      `The changelog records what changed on the website, version by version. It is separate from the devlog, which is a narrative record of the work.`,
      [link('/changelog', 'Changelog')],
      4,
    ),
    fact(
      'source',
      'Source code',
      ['source code', 'is the bot open source', 'github repository', 'can i see the code'],
      `The bot repository is private. The public policy documents are mirrored to a separate public GitHub repository, and this website's source is separate from the bot. The site does not publish private bot configuration.`,
      [link('/stack', 'Stack'), link('/faq', 'FAQ')],
      5,
    ),
    fact(
      'assistant-storage',
      'Does this assistant store anything?',
      [
        'does this assistant store anything',
        'do you save my messages',
        'conversation history',
        'do you log this chat',
        'what does step store',
        'does step store anything',
        'does step keep my messages',
        'does step store my questions',
      ],
      `No. The conversation exists only in this browser tab and is discarded on reload. The assistant loads two static files from this site when it opens; it sends no question to a server, uses no API key, and does not write to local storage.`,
      [link('/policies/website/privacy', 'Website privacy notice')],
      9,
    ),
    ...projects.map((project) =>
      fact(
        `project-${project.id}`,
        project.data.title,
        [project.data.title, `${project.data.title} project`, project.data.category],
        `${project.data.title} is listed as ${project.data.status.toLowerCase()} in ${project.data.category}. ${project.data.tagline} ${project.data.summary}`,
        [link(projectPath(project.id), `${project.data.title} project page`)],
        5,
      ),
    ),
    ...policies.map((policy) =>
      fact(
        `policy-${policy.id}`,
        policy.data.title,
        [policy.data.title, policy.data.shortTitle, 'policy'],
        `${policy.data.title} is version ${policy.data.version} and is marked “${policy.data.docStatus}”. ${policy.data.summary}`,
        [link(policyPath(policy.id), `${policy.data.shortTitle} policy`)],
        3,
      ),
    ),
    ...FAQ.map((entry, index) =>
      fact(
        `faq-${index}`,
        entry.question,
        [entry.question],
        entry.answer,
        entry.link ? [link(entry.link.href, entry.link.label)] : [],
        2,
      ),
    ),
    ...socialLinks.map((entry) =>
      fact(
        `social-${entry.id}`,
        entry.name,
        [entry.name, `${entry.name} account`, `official ${entry.name}`],
        `${entry.name} is an official Next Step Studios account: ${entry.url}. The official links page is the authoritative list.`,
        [link(entry.url!, `Open ${entry.name}`, true), link('/links', 'Official links')],
        3,
      ),
    ),
    ...posts.map((post) =>
      fact(
        `devlog-${post.id}`,
        post.data.title,
        [post.data.title, 'devlog entry'],
        `The devlog entry “${post.data.title}” was published ${formatDate(post.data.date)}. ${post.data.summary}`,
        [link(postPath(post.id), 'Read the devlog entry')],
        1,
      ),
    ),
  ];

  return new Response(JSON.stringify({ generated: new Date().toISOString(), facts }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
};
