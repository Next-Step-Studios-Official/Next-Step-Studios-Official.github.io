/**
 * Frequently asked questions, answered only with things that are already true.
 * Where the honest answer is "not yet", the answer says so.
 */

import { CONTRIBUTORS_CONFIRMED, CONTRIBUTOR_WORD, TEAM_WORD } from './contributors';

export type FaqEntry = {
  question: string;
  answer: string;
  /** Optional deeper reading. */
  link?: { href: string; label: string };
};

export const FAQ: FaqEntry[] = [
  {
    question: 'Is the Discord bot public?',
    answer:
      'No. The bot is built for one community server and is not listed on any bot directory. There is no invite link for it on this site, and one will not be added until the release checklist is actually finished.',
    link: { href: '/projects/next-step-bot', label: 'The project and its current state' },
  },
  {
    question: 'Can I join the Discord server?',
    answer:
      'Yes. The server has a public invite, and it is the same one the bot publishes through its links panel. This site links to it rather than restating the rules, so there is only one authoritative copy.',
    link: { href: '/links', label: 'Official links' },
  },
  {
    question: 'What data does the bot store about me?',
    answer:
      'The Privacy Policy lists every category: ticket records, application records, staff profiles, suggestions, moderation and audit records. Data Retention says how long each one lasts and how deletion works. Both are drafts at version 0.2.0.',
    link: { href: '/policies/bot/privacy', label: 'Privacy Policy' },
  },
  {
    question: 'How do I ask for my data to be deleted?',
    answer:
      'Email the studio with the request and enough information to identify the records. The contact page explains what to include and what happens next. Some records — moderation and audit entries, for example — have a stated retention period and cannot be deleted early.',
    link: { href: '/contact#privacy-requests', label: 'Privacy requests' },
  },
  {
    question: 'How do I appeal a moderation decision?',
    answer:
      'Open a ticket in the server if you still have access to it, or email the studio if you do not. The Moderation and Enforcement Policy describes the grounds for appeal and what is reviewed. It is a draft, and it does not promise an outcome.',
    link: { href: '/policies/bot/moderation', label: 'Moderation policy' },
  },
  {
    question: 'Does this website track me?',
    answer:
      'No. There is no analytics, no advertising, no tracking cookie, and no font or script from a third party. There is a contact form, but it only stores what you type into it so the message can be answered. The website privacy notice lists exactly what is kept, where, and how to have it deleted.',
    link: { href: '/website-privacy', label: 'Website privacy notice' },
  },
  {
    question: 'Why are the policies still drafts?',
    answer:
      'Because they have not been through a legal review, and calling them final would claim something that is not true. They are versioned 0.2.0, published in full, downloadable, and mirrored to GitHub so every change is visible.',
    link: { href: '/policies', label: 'All documents' },
  },
  {
    question: 'Why do some commands say “not verified”?',
    answer:
      'Because the code exists but the behaviour has not been exercised end to end. The command reference and the project page mark those cases instead of quietly presenting them as finished. Anything not yet built is labelled Planned.',
    link: { href: '/commands', label: 'Command reference' },
  },
  {
    question: 'Can I see the bot’s source code?',
    answer:
      'Not at the moment. The bot repository is private. The public policy documents are mirrored to a separate public repository, and the website’s own source is separate again.',
    link: { href: '/stack', label: 'What this site is built with' },
  },
  {
    question: 'How do I report a security issue?',
    answer:
      'Email the studio with “security” in the subject and a description of the issue. Please do not test against the live server or against other members’ data. The Security and Data Protection Overview describes the intended posture.',
    link: { href: '/policies/bot/security', label: 'Security overview' },
  },
  {
    question: 'Is there a roadmap?',
    answer:
      'Yes — a short one, with statuses rather than dates. It lists what is in development, what is planned, and what has deliberately not been started.',
    link: { href: '/roadmap', label: 'Roadmap' },
  },
  {
    question: 'Who runs Next Step Studios?',
    answer: CONTRIBUTORS_CONFIRMED
      ? `Candler Shaw runs the studio and is its only legal operator, with ${CONTRIBUTOR_WORD} contributors helping across specific projects — ${TEAM_WORD} people in total, all voluntarily. Nobody is employed, contracted or paid. It is still a public-facing name rather than a registered company, and the team page lists everyone involved and what they work on.`
      : `Candler Shaw runs the studio and is its only legal operator. The contributor roster is still being confirmed: the team page currently labels ${CONTRIBUTOR_WORD} example entries so they are not mistaken for real people. Nobody is employed, contracted or paid, and it is still a public-facing name rather than a registered company.`,
    link: { href: '/team', label: 'The team' },
  },
];
