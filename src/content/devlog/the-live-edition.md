---
title: The logo stops pretending to be a white square
date: 2026-11-21
summary: The mark is cut out, published at four sizes in three formats, and given an archive. The status page now reads real checks, and the studio is described as five people.
tags: [brand, website, process]
series: Building the site
---

The logo was a black ninja on a white tile. That is fine as artwork and wrong as a brand
asset: put it on a dark page and the tile becomes a bright rectangle; put it in a document
and the white square is part of the mark whether you wanted it or not.

So the tile is gone. The artwork is cut out from the outside in, with the edge colour
unpremultiplied so no pale fringe survives on a dark background. The result is a
transparent master, and from it: PNG and SVG at 1024, 512, 256 and 128 pixels, JPG at the
same sizes flattened onto the site's near-black, and a second treatment with a light
outline for dark surfaces. The favicons and the Apple touch icon come from the same master.
Each file has a permanent address.

Two decisions are worth writing down. First, the SVG embeds the transparent PNG at each
size rather than being a vector redraw; a true vector master is still to be produced.
Second, the old white tile is not deleted. It is labelled as the superseded version and kept
on the Press & brand page at `/press#archive` (the old `/archive` address redirects there),
because links to it exist and pretending otherwise would break them. The archive lives
inside that page now, and the whole set is available as one ZIP, so nobody has to download
twenty files one at a time.

**Correction, 22 November 2026:** an earlier version of this entry called the SVGs real
vectors. They embed a PNG at each size, not a vector redraw. The brand page states this
plainly.

## The status page is actually live

The previous status page described the site honestly but statically. It could not say
whether the bot was up five minutes ago.

The bot now writes a small `status.json` after each check and publishes it to the public
repository. The status page reads that file in the browser, shows the current state,
response time, version and a 24-hour strip of five-minute checks, and lists incidents from
the same history. There is no monitoring company in the middle and no analytics. If the
feed cannot be read, the page says so and falls back to the copy built with the site — it
does not turn the lights green to be reassuring.

The honest limitation: until the publisher runs on a schedule with a GitHub token, the
history is empty. An empty history is the correct thing to show, not a fabricated uptime
percentage.

## Five people, not one

The studio has not been a solo practice for a while. The site now says five people: Candler
Shaw, who runs it, and four contributors whose names and roles are placeholders until each
person confirms how they want to be credited. The About page carries that list, a team page
explains how credits work, and the contact block sits directly under the studio facts.

The social page is gone. One official links page lists the website, the community, the
repository and the policies; `/social` redirects there. Fewer places to drift out of date.

The module register was also corrected: 23 modules and 51 commands, with Platform,
Reminders and Welcome removed, and `/help` listed as planned rather than implied. The
statuses now match what the bot's source actually does — including the parts that are still
only being tested.
