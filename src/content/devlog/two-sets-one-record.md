---
title: Two sets, one record
date: 2026-11-23
summary: The policy shelf used to describe the Discord bot only. It now holds two separate sets — seven bot documents and four website documents — and the rest of the site has been corrected to stop describing it as one.
tags: [policies, website, process]
series: Building the site
---

The policy shelf had seven documents, and every one of them was about the Discord bot.
That was accurate when the shelf was written: the bot was the only thing with users,
stored records and a moderation surface. It stopped being the whole picture when this
website gained a contact form, a local assistant and its own answers about what it keeps.

So the collection is now two sets. The bot documents stay together at `/policies/bot`; the
website documents live at `/policies/website`. There are four of those: a privacy notice, a
security overview, terms of use and a copyright and takedown notice.

## What belongs to what

The split is not cosmetic. Two documents called “Privacy Policy” would be a bad address to
share and a worse thing to search for. The scopes make the difference visible before a
document is opened, and they let each set describe a different system without one
document quietly standing in for both.

The downloads follow the same rule. Bot files keep their old names (`privacy.md`,
`privacy.pdf`); website files take a prefix (`website-privacy.md`,
`website-privacy.pdf`). Version history uses the same keys. Nothing in the two sets can
collide, and a link to an existing bot document still points at the same file.

## Status is per document

Before the split, “draft” described the whole collection. That is no longer true. The
website privacy notice and security overview describe the site as it is published, so they
are marked current. The website terms and copyright notice are still drafts, as are all
seven bot documents. The version numbers differ too: the bot set is 0.2.0, the current
website documents are 1.0.0, and the two website drafts are 0.1.0.

The policy index, the homepage, the status table and the FAQ now say that, instead of
rounding the whole shelf to one label. The status table previously reported every document
at version 0.2.0, which had stopped being true the moment the website set was added.

## The old address still works

The old `/website-privacy` address redirects to `/policies/website/privacy`. The two scope
indexes redirect to the relevant section of `/policies`. A split that breaks the addresses
people already have is not a tidy record; it is just a second place to look.

## What did not change

No policy text was rewritten to make the split work. The documents were moved and given
their own addresses, not renegotiated. None of them has been through a legal review, and
none of them claims compliance with anything. The website privacy notice is current
because it describes what the published site actually does, not because a lawyer approved
it.

## The site had to catch up

The documents were split in one pass; the copy that described them took another. The home
page still said the policies “cover the bot only — not this website” while listing the
website documents underneath. That sentence is gone. The status table and the FAQ were
corrected in the same pass.

Two smaller navigation fixes came with it. Downloads now keeps its category, platform, file
type and search in the address, so a filtered list can be linked or reloaded. Search keeps
its type filter in the address as well, and now has filters for projects and roadmap items
that were already in the index but had no chip. The sitemap page was also missing from the
search index; it is there now.

None of this changes what the collection is. It just makes the site describe it the same
way the addresses do.
