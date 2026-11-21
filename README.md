# Next Step Studios — Official Website

The public website of **Next Step Studios**, an independent creative and software
studio. The site introduces the studio, documents the Discord bot it is building,
publishes the bot's policies, and collects its official links, development notes and
downloadable files in one place.

- **Website:** <https://next-step-studios-official.github.io/>
- **Official links:** <https://next-step-studios-official.github.io/links>
- **GitHub organisation:** <https://github.com/Next-Step-Studios-Official>

## What the site is for

The site has four jobs:

1. Describe the studio honestly, including what is still in development.
2. Publish the Discord bot's public policies, commands and module information.
3. Act as the official link hub for the studio's social accounts, community spaces,
   projects and contact routes.
4. Record the work through projects, devlog entries, a roadmap and a changelog.

It is a static site. There is no account system, no analytics, no advertising and no
third-party tracking. The contact form is the only interactive service, and it is kept
separate from the pages themselves.

## What you will find

### The studio and its work

- **Home** — a short introduction, the current project and recent writing.
- **About** — what Next Step Studios is, who runs it, and what it is not.
- **Team** — the people who contribute, with their roles and focus.
- **Projects** — current work, each with its real status rather than a marketing label.
- **Devlog** — notes from building the website, bot and brand.
- **Roadmap and changelog** — what is planned and what has changed.
- **Status** — the latest bot status when a feed is available.
- **Stack, FAQ and glossary** — the tools used and plain-language explanations.
- **Press kit, brand guidelines and archive** — downloadable marks and usage rules.

### Bot documentation

- **Commands** — the slash commands defined in the bot's source, plus planned commands.
- **Modules** — the bot's modules and their honest implementation status.
- **Policies** — the public Terms, Privacy, Acceptable Use, Community Guidelines,
  Moderation, Data Retention and Security documents.
- **Trust centre** — data, security and privacy information in one place.
- **Downloads** — every public document as a page, Markdown file, text file and PDF.

### Community and contact

- **Official links** — the same official destinations as the Discord bot's `/links`
  command: social media, Discord, Roblox, GitHub, the website, policies and email.
- **Contact** — a message form and the public email address.
- **Website privacy** — the privacy notice for this site, separate from the bot policies.
- **Search** — a client-side search across the site's pages and sections.

## Design and technology

The site is built with [Astro](https://astro.build/) and rendered to static HTML. It
uses hand-written CSS, self-hosted fonts and no client-side framework. The pages are
served by GitHub Pages.

The visual identity is built around the current pixel-art ninja mark. The full lockup is
used where the wordmark can be read; the head alone is used in the header and footer,
and a tighter face crop is used for the browser-tab icons so the bandana and eyes stay
readable at 16px. The press kit contains the transparent and light-outline versions,
the favicons and the retired marks.

The contact form posts to a small separate service because GitHub Pages cannot run
server code. Messages are stored so they can be answered; the website itself does not
create accounts or keep user profiles.

## Project structure

```text
src/
├─ assets/       Source images used by Astro
├─ components/   Header, footer, cards and shared UI
├─ content/      Policies, projects and devlog entries
├─ data/         Download and brand catalogues
├─ layouts/      Shared page shell and metadata
├─ lib/          Typed site data: links, commands, modules, team
├─ pages/        Every public route
└─ styles/       Design tokens, theme and print styles

public/          Images, brand files and downloadable PDFs
scripts/         Build and asset-generation scripts
server/          The separate contact service
```

## Official links

The website's official links are kept in one place and mirror the public part of the
Discord bot's links configuration. The **Official Policies** entry points to this
site's `/policies` page. The GitHub policy repository is a secondary mirror for readers
who want the raw Markdown.

If a platform does not yet have an official account, its entry is omitted rather than
shown as a dead button. The site does not invent URLs or claim accounts that do not
exist.

## Privacy

- No analytics, advertising, tracking pixels or third-party embeds.
- No accounts, registration or login for visitors.
- The contact form sends the name, email address, subject and message needed to reply.
  The contact service stores that message with a timestamp and a hashed IP address used
  for rate limiting; the website privacy notice explains how it is handled.
- The contact service is separate from the static pages and has its own access controls.

## Related

- [Next Step Studios on GitHub](https://github.com/Next-Step-Studios-Official)
- [Official links](https://next-step-studios-official.github.io/links)
- [Bot policies](https://next-step-studios-official.github.io/policies)
- [Contact](https://next-step-studios-official.github.io/contact)

The repository contains the website source. The Discord bot and its private
configuration are maintained separately.
