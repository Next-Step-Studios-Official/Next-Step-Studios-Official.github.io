/**
 * A changelog for the website itself. Dates are real build dates; versions are
 * this site's own, not the bot's.
 */

export type ChangelogEntry = {
  date: string;
  version: string;
  title: string;
  summary: string;
  changes: string[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-11-24',
    version: '3.14',
    title: 'The Places Left Behind edition',
    summary:
      'The first-game page becomes Places Left Behind, with the gallery moved to the top, an early-prototype status, exact copyright attribution and a separate game policy scope in preparation.',
    changes: [
      'The project is renamed Places Left Behind and the old /projects/first-game address redirects to the new page. The page now describes the first-person exploration and mystery game, the custom C# engine, Vulkan, Silk.NET, .NET 10, Blender and the glTF 2.0 / GLB pipeline.',
      'The gallery now sits directly under the project title instead of in a separate “A closer look” section. The large picture, thumbnails, previous/next controls, count and full-screen viewer are unchanged in behaviour.',
      'The project is marked Prototype. The page states that WASD movement and mouse camera control work, while the environment pipeline, full rendering, investigation mechanics, complete locations and much gameplay remain under development.',
      'The exact attribution “Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.” now appears in the shared footer, the game page, the website copyright notice and generated document headers, PDF footers, print editions and the policy ZIP.',
      'The policy system now supports a separate Places Left Behind game scope. It is shown on /policies as in preparation, with no game document presented as effective. Website, Discord bot and game policies remain distinct.',
      'PLACES_LEFT_BEHIND_EDITING.md replaces the old first-game guide and explains the top gallery, the project facts, the copyright wording and how to add the real game documents later.',
    ],
  },
  {
    date: '2026-11-24',
    version: '3.13',
    title: 'The first-game gallery edition',
    summary:
      'First Game moves from planned to in development with its C# background and a three-picture gallery, plus a full-screen viewer and a separate editing guide.',
    changes: [
      'First Game now states that it is being written from scratch in C# and moves to In development. The page explains that C# is pronounced “C-sharp” and that the # is a musical sharp sign, not a hashtag.',
      'A reusable picture gallery now sits below the project text. It has a large image, thumbnails, previous/next controls, a 1 / N counter and a native full-screen viewer with arrow-key and Escape support.',
      'Three visual studies are live on the page. They are labelled concept art, not gameplay screenshots.',
      'The assistant, roadmap, Now page, About page, home page and press facts now agree that the first game is in development rather than planned.',
      'The separate editing guide in the project root explains how to add pictures, edit the gallery, update the C# copy, test the viewer and keep the other pages in step. It is now PLACES_LEFT_BEHIND_EDITING.md.',
    ],
  },
  {
    date: '2026-11-24',
    version: '3.12',
    title: 'The applied-styles edition',
    summary:
      'Several styles were silently not applying: two undefined tokens, the generated status strip and incident rows, and the search typo button. This pass makes those rules real and records where the theme tokens live.',
    changes: [
      'The live status banner and the press asset table header now use defined surface tokens; their previous `--color-panel` was never declared, so both backgrounds were transparent.',
      'The press type specimen now uses the Inter token instead of an undefined `--font-body`, so the sample renders in the face it names.',
      'The status 24-hour strip was effectively invisible: its slots are created in JavaScript, but the scoped CSS only matched elements present at build time. The slot rules are now scoped to the rendered strip, and empty slots follow the theme instead of a dark-only grey.',
      'Search typo suggestions now actually receive their button styling, including the 44px touch target; the button is created after load, so the scoped rule had been skipped.',
      'EDITING.md now records where the dark and light token sets live, why an undefined `var(--…)` fails silently, and how generated elements need `:global` styling.',
    ],
  },
  {
    date: '2026-11-23',
    version: '3.11',
    title: 'The touch edition',
    summary:
      'The search page no longer opens a keyboard on arrival, its type filters are named as a group, and the remaining small controls get room for a thumb.',
    changes: [
      'Search no longer autofocuses its field on load, so a phone does not open the keyboard and cover the page before the visitor chooses to search.',
      'The Search type chips are announced as a “Filter by type” group, like the filters on the other pages.',
      'Downloads reset, platform/file-type fields and legend summary now meet the 44px touch target, as do devlog tag links.',
      'Search typo suggestions now meet the same touch target, and the theme toggle has a matching tooltip alongside its screen-reader label.',
      'The search placeholder is shorter, so it is not clipped on a phone.',
      'EDITING.md lists the header and shared touch-target styles.',
    ],
  },
  {
    date: '2026-11-23',
    version: '3.10',
    title: 'The next-step edition',
    summary:
      'Project pages and the changelog stop being dead ends, the links page points back to the site, and Downloads explains why its Documents count is larger than the policy set.',
    changes: [
      'Every project page ends with a “Where this goes” panel linking the roadmap, devlog and contact page.',
      'The changelog ends with links to the devlog, Now page and status page.',
      'The official links page now points to the press & brand page, downloads and contact page as well as the policy index.',
      'The team page points to the contact page beside the direct email address.',
      'Downloads explains that its Documents category includes the individual policies, the complete-set ZIP and the command cheatsheet.',
      'EDITING.md lists the full path for the project detail page, changelog and links page.',
    ],
  },
  {
    date: '2026-11-23',
    version: '3.9',
    title: 'The count edition',
    summary:
      'Filter counts now describe what each click will show, Projects keeps its view in the address, and Search reports per-type matches instead of a misleading entry total.',
    changes: [
      'Policy scope and status counts are faceted: each group respects the search and the other active group, but not its own selection. With Draft selected, All scopes reports the nine drafts rather than all eleven documents.',
      'Downloads category counts now respect the platform, file type and search filters, including the All chip.',
      'Projects status and category counts respect the search and the other group; the search, both filters and the sort order are kept in the address, with a Clear filters control.',
      'Search type chips show how many results the current query has in each type. The result line now reports actual matches, including “40 of N matches” when the list is truncated, instead of counting the type’s whole index.',
      'Search gains a Clear search control that resets the query and type together.',
      'Each filter page now explains that its counts show what a choice would show with the other filters unchanged, so an active filter does not make the other numbers look wrong.',
      'EDITING.md lists the full path for each filter page and the shared filter note style.',
    ],
  },
  {
    date: '2026-11-23',
    version: '3.8',
    title: 'The breadcrumb edition',
    summary:
      'The policy hub can now separate current documents from drafts, every detail page shows its place in the site, and the editing guide records the full Windows paths for the files behind both changes.',
    changes: [
      'The policy hub adds a current/draft status filter alongside search and scope. All three are kept in the address (`?scope=website&status=current&q=privacy`), and a Clear filters control resets them.',
      'Visible breadcrumbs now sit above policy documents, policy version history, projects, bot modules and devlog entries. Each one links back through its section and marks the current page with aria-current.',
      'The breadcrumb component is shared by those detail pages, so its separator, spacing and type can be changed in one file.',
      'EDITING.md now starts with a full-path table, and section 11 names the policy hub file directly, so it is clear which file to open for each change.',
    ],
  },
  {
    date: '2026-11-23',
    version: '3.7',
    title: 'The label edition',
    summary:
      'Link names, share cards and sitemap dates get the same attention as the pages: every glossary link says what it opens, every main page has its own card, and the XML sitemap records when content changed.',
    changes: [
      'The glossary no longer uses sixteen identical “Read more” links; each one names the policy or page it opens.',
      'Policy index cards and download format links include the document name in their accessible label, so “Read” and “PDF” are not repeated without context.',
      'The text-size controls on policy pages are announced as “Smaller text”, “Default text size” and “Larger text”.',
      'Search shows a no-JavaScript notice with links to the policy index, command reference and sitemap.',
      'Share cards now cover Projects, Policies, About, Team, Now, Devlog and every devlog entry, Changelog, Status, Stack, Links, Downloads, Contact, Search and How Step works.',
      'Social card alt text uses the page title when a page has its own card, instead of the generic studio sentence.',
      'The XML sitemap now records last-modified dates for the home page, section indexes, projects, documents, devlog entries, tag pages, version history and generated downloads.',
    ],
  },
  {
    date: '2026-11-23',
    version: '3.6',
    title: 'The two-set catch-up',
    summary:
      'The site’s own copy catches up with the split policy collection, downloads and search gain filters that survive a reload, and the home page stops describing the documents as bot-only.',
    changes: [
      'The home page now describes the bot and website policy sets together, and the paragraph under “Where to find the official documents” no longer says the documents cover the bot only.',
      'The status table lists the real document mix — nine drafts and two current documents — instead of reporting every document at one bot version.',
      'The FAQ explains that the website privacy notice and security overview are current, while the rest of the collection is still draft.',
      'Downloads keeps the category, platform, file type and search in the address, with a reset control, so a filtered list can be linked or reloaded.',
      'Search keeps its type filter in the address and gains Projects and Roadmap filters, so a typed search can be shared as one link.',
      'The search index now includes the sitemap page. Tag, policy-version and print pages remain out of the index: they are alternate routes to current documents and entries, not separate topics.',
      'A new devlog entry records the policy split and the corrections that followed it.',
    ],
  },
  {
    date: '2026-11-23',
    version: '3.5',
    title: 'The two-set edition',
    summary:
      'The bot policies and the website policies become separate sets, downloads and projects gain categories that describe what is actually there, and a filtered policy list can be linked or reloaded.',
    changes: [
      'The policy collection is now seven Discord bot documents and four website documents, each set with its own address under /policies/bot and /policies/website.',
      'The policies hub lists both sets with totals, current and draft labels, scope filters and a note on future product sets. The old /website-privacy address redirects to the website privacy notice.',
      'Website privacy and security are marked current; website terms and copyright remain drafts for review. No document claims legal compliance.',
      'Downloads are grouped into Documents, Brand & press, Games, Apps, Tools and Media, with an honest empty state for categories that have no file yet.',
      'Projects use four categories — Discord bot, Games, Apps & tools and Website — and gain First App and This Website entries.',
      'The policy scope filter now removes documents from the other scope, and the chosen scope is kept in the address so a filtered list survives a reload and can be shared.',
      'Devlog entries declare their own canonical address; before this, every entry pointed search engines at /devlog instead of itself.',
      'The human sitemap groups policies, downloads and the trust centre under Documents rather than Discord bot.',
    ],
  },
  {
    date: '2026-11-22',
    version: '3.4',
    title: 'The one-page brand edition',
    summary:
      'The press kit, brand guidelines and mark archive become one Press & brand page, with working redirects, copy buttons, a Now page and a clearer example roster.',
    changes: [
      'The separate /press, /brand and /archive pages are now one page at /press. The old addresses redirect to the relevant sections, and every existing logo file keeps its address.',
      'The page combines the boilerplate, quick facts, every current logo file, the palette, type guidance, usage rules, the retired neon emblem and the superseded white-tile edition, with an on-page contents and one ZIP.',
      'Hex values and the studio boilerplate have copy buttons with a visible confirmation.',
      'The header, footer, search index, command palette, sitemap and Step now point at one brand destination instead of three.',
      'A new /now page records what is being worked on in November 2026, and what has deliberately not started.',
      'The About and Team pages label the four placeholder contributors as examples, and public copy no longer presents the unconfirmed roster as five real people.',
      'The home page gives the primary action to Projects and the bot instead of the policy shelf.',
      'The brand kit README now points at the combined page and the redirects.',
      'A new devlog entry records the merge; the old logo entry carries a correction about its embedded-raster SVGs. No policy text changed.',
    ],
  },
  {
    date: '2026-11-22',
    version: '3.3',
    title: 'The touch edition',
    summary:
      'A mobile and keyboard pass: the policy contents now works on a phone, search results can be walked without a mouse, and form fields no longer trigger iOS zoom.',
    changes: [
      'On a phone, each policy now opens with a collapsible “On this page” panel above the text instead of a contents list stranded after a twenty-minute document.',
      'On a wide screen the contents stays in view beside the document and marks the section being read with aria-current.',
      'Search results respond to ↑, ↓, Home, End and Escape, with a short keyboard hint under the field.',
      'Every form field uses 16px text so iOS does not zoom the page when it is focused; filter chips, reset controls and contents links reach 44px on touch screens.',
      'Header dropdowns open with ArrowDown or ArrowUp and move through their links with the arrow keys.',
      'Command results in search and the command palette now jump to the exact command and highlight its row, instead of returning to the top of a 51-command page.',
      'Each policy ends with a Back to top link.',
      'The Trust centre now points to a machine-readable security.txt at /.well-known/security.txt, and Pages publishes every file verbatim rather than running it through Jekyll.',
    ],
  },
  {
    date: '2026-11-22',
    version: '3.2',
    title: 'The finish pass',
    summary:
      'A site-wide quality pass: faster navigation, a correct devlog count, clearer team and contact wording, and cleaner markup for screen readers.',
    changes: [
      'Internal links prefetch on hover, so a page of plain HTML changes almost immediately without a client-side router.',
      'The home page counts every devlog entry instead of only the three shown below.',
      'Project and policy indexes give their card groups a real section heading for screen readers.',
      'The 404 page is marked noindex, so a missing address cannot appear in search results.',
      'Studio descriptions now say a five-person team, making clear the count includes the operator, and the contact page no longer implies the form and email share one inbox.',
      'The header mark loads eagerly, print editions declare en-GB, and styles left behind by the retired social page are removed.',
    ],
  },
  {
    date: '2026-11-22',
    version: '3.1',
    title: 'The local guide edition',
    summary:
      'Step becomes easier to use and easier to understand: follow-ups, a topic menu, page-aware starters, copyable answers, a guide page and a home-page demo. Search gains typo suggestions, policy pages gain plain-language summaries, and the complete policy set gains a ZIP.',
    changes: [
      'Step now offers up to three curated follow-up questions after an answer, with a Topics menu for browsing the full range.',
      'Starter questions change with the page: commands on the command reference, policies on a policy page, and the studio basics elsewhere.',
      'Answers have a Copy button, and Step controls and message text are larger and easier to tap.',
      'A new /step page explains what Step can answer, how matching works, and why there is no model, API, account or stored conversation.',
      'The home page has a Step demo that opens the panel with a sample question, and the guide is linked from the footer, search and command palette.',
      'Search suggests a corrected phrase when a query has no matches, with a one-click retry.',
      'All seven policy pages now start with a plain-language summary, and the policy index links to it.',
      'The complete policy set is downloadable as one ZIP containing every Markdown document, a combined file and a README.',
      'Mobile spacing between Step and the home-page system panel is corrected.',
    ],
  },
  {
    date: '2026-11-21',
    version: '3.0',
    title: 'The live edition',
    summary:
      'The mark becomes transparent at four sizes in three formats, the archive gets its own page and a ZIP, the status page reads checks the bot publishes, and the studio is described as five people.',
    changes: [
      'Logo cut out from the outside in: transparent PNG and SVG at 1024, 512, 256 and 128, plus JPG and a light treatment for dark surfaces.',
      'Transparent favicons and Apple touch icon; the old white-tile artwork is kept only as a labelled archive copy.',
      'A standalone /archive page with every current and retired mark, and one ZIP containing the whole brand kit.',
      'A live /status page: current state, response time, version, a 24-hour strip and incidents, read from a JSON feed the bot publishes.',
      'The studio is described as five people; four contributor placeholders sit alongside Candler Shaw, and the About page has a contact block under its facts.',
      'The social page is removed. Official links is the single list, and /social redirects there.',
      'Module register corrected to 23 modules and 51 commands, with Platform, Reminders and Welcome removed; /help is listed as planned.',
    ],
  },
  {
    date: '2026-11-21',
    version: '2.1',
    title: 'The archive edition',
    summary:
      'The reference becomes an archive: 27 module pages, recorded policy versions with diffs, a press kit that keeps retired marks, and a trust centre to hold it together.',
    changes: [
      'A page for each of the 27 bot modules, with commands, data touchpoints and governing policies.',
      'Policy version history: every document now records a snapshot and shows a diff when the text moves.',
      'Trust centre, glossary, press kit and brand guidelines.',
      'Logos supplied as PNG, JPG, WebP and an embedded-raster SVG, with a permanent archive for retired marks.',
      'Per-page Open Graph cards, FAQ and Article structured data, and a human sitemap.',
      'Reading controls, copy-link headings, a keyboard shortcut reference and site-wide print styles.',
      'Public JSON for commands, policies, projects and modules; a policy RSS feed.',
      'Latin-only font subsets, generated hero artwork and project covers.',
      'A printable command cheatsheet PDF.',
    ],
  },
  {
    date: '2026-11-21',
    version: '2.0',
    title: 'The reference edition',
    summary:
      'The site grows from a set of pages into a reference: every command, every document in four formats, and search that covers the actual text.',
    changes: [
      'Full command reference for all 51 slash commands, read from the bot’s cogs.',
      'Full-text search across policies, devlog and project pages, with a dedicated search page.',
      'Policy documents in Markdown, plain text, print layout and PDF, plus one combined file.',
      'New pages: roadmap, FAQ, changelog, status and stack.',
      'Studio logo integrated as the brand mark, favicon and social card.',
      'Devlog tags, series grouping and an RSS feed.',
      'Structured data, sitemap, robots and Open Graph metadata.',
      'Accessibility pass: contrast, focus, landmarks and keyboard operability.',
    ],
  },
  {
    date: '2026-11-21',
    version: '1.2',
    title: 'Every document, twice',
    summary:
      'The policies became downloadable files as well as pages, and the public copies were mirrored to GitHub so the record is not only on this site.',
    changes: [
      'Downloads index and a Markdown file for each of the seven documents.',
      'GitHub mirror of the public documents, linked from every policy page.',
      'Link and social pages rebuilt around real, verified accounts.',
      'A quiet design pass over the whole site: fewer colours, tighter type, no utility CSS framework.',
    ],
  },
  {
    date: '2026-11-19',
    version: '1.0',
    title: 'First public build',
    summary:
      'The studio had no website, which meant there was no single place to point at. This was the first answer to that.',
    changes: [
      'Home, projects, devlog, about, contact and policies.',
      'The seven draft policy documents in full.',
      'Static output: no accounts, no analytics, no third-party requests.',
      'Command palette, reduced-motion support and keyboard navigation from the first version.',
    ],
  },
];
