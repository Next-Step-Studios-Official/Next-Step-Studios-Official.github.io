---
title: "Website Policy Integration"
version: "1.0"
docStatus: "Draft — plan only. No website change has been made."
summary: "How the Places Left Behind policies should be published through the studio website"
sourceId: "PLB-LEG-042"
sourcePath: "Documentation/Licensing/Website-Policy-Integration.md"
category: "foundations"
order: 50
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-042 |
| Version | 1.0 |
| Status | Draft — plan only. No website change has been made. |
| Scope | How the Places Left Behind policies should be published through the studio website |
| Applies to | The studio website and its policy index |
| Website | <https://next-step-studios-official.github.io/> |
| Policy index | <https://next-step-studios-official.github.io/policies/> |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not applicable — nothing has been published |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Plan only.** No website code or content was changed for this task. This document explains what to do once the policies have been reviewed, so that the integration is a deliberate step rather than an afterthought.

---

## 1. Purpose

The studio website already publishes policies for two separate scopes: the website itself, and the Discord bot. Places Left Behind needs a third, independent scope.

This document describes that scope, what belongs in it, and how to publish it without merging it into the existing scopes.

## 2. Existing Scopes

The website currently has separate policy scopes for:

1. the website,
2. the Discord bot.

The website also has its own privacy notice, terms of use, copyright and takedown notice, and security overview, all attached to the website scope.

## 3. Why the Game Needs Its Own Scope

1. **Different subject.** The website policies describe a website. The Discord bot policies describe a bot. The game policies describe a piece of software the user installs and runs offline.
2. **Different obligations.** The game raises licensing, warranty, and distribution questions that do not apply to a website or a bot.
3. **Different audiences.** A player looking for the game's EULA should not have to read website terms to find it.
4. **Independent change.** The game's terms will change on a different schedule from the website's.
5. **Independent licensing.** The game is proprietary and separately licensed from the website's content. Merging the policies would blur that boundary.

**Do not merge game policies into the website or Discord bot scopes.** Cross-link, do not combine.

## 4. Proposed Scope Structure

A scope root, for example:

```text
/policies/places-left-behind/
    index.html            Scope landing page: what applies, in plain language
    eula.html             End User License Agreement
    privacy.html          Game privacy policy
    data.html             Data collection and retention
    saves.html            Save data and user data
    prototype.html        Prototype access terms
    tester.html           Prototype tester agreement
    updates.html          Updates and patches
    warranty.html         Warranty and liability notice
    modding.html          Modding license and community content
    mod-distribution.html Mod distribution policy
    copyright.html        Copyright and takedown
    credits.html          Third-party notices and asset attribution
    changelog.html        Policy version history for this scope
```

The exact file names are a suggestion. What matters is that the scope is visibly separate and that each page maps to exactly one repository document.

## 5. Mapping from Repository Documents

| Website page | Repository document |
| --- | --- |
| Scope landing page | `Documentation/Licensing/README.md` (adapted for the public) |
| `eula.html` | `Commercial/EULA-Draft.md` |
| `privacy.html` | `Privacy/Game-Privacy-Policy-Draft.md` |
| `data.html` | `Privacy/Game-Data-Policy.md` |
| `saves.html` | `Privacy/Game-Save-Data-Policy.md` |
| `prototype.html` | `Prototype/Prototype-Distribution-License.md` |
| `tester.html` | `Prototype/Prototype-Tester-Agreement.md` |
| `updates.html` | `Commercial/Game-Updates-Policy.md` |
| `warranty.html` | `Commercial/Game-Warranty-and-Liability.md` |
| `modding.html` | `Modding/Modding-License.md` and `Modding/Community-Content-Policy.md` |
| `mod-distribution.html` | `Modding/Mod-Distribution-Policy.md` |
| `copyright.html` | `Future/Copyright-and-Takedown.md` |
| `credits.html` | `THIRD-PARTY-NOTICES.txt` and `Assets/Asset-Licensing-Register.md` |

The repository remains the source of truth. The website is a rendering of it.

## 6. Publication Gate

**Nothing should be published as active until it is true.**

| State of the document | What to publish |
| --- | --- |
| Draft, not adopted | Nothing — or a clearly labelled "draft, not in force" preview, if the studio wants to show work in progress |
| Future draft for a feature that does not exist | Nothing |
| Adopted and accurate | Publish as active, with version and review date |
| Requires legal review | Do not publish as active |

Today, no custom agreement in this system has been adopted or signed. The ownership and policy documents marked **Current** describe existing practice, so they can be published; the EULA, prototype terms, modding terms, and contribution terms cannot. Publishing one of those as though it were in force would misrepresent the studio's position.

## 7. Page Content Requirements

Each published page should show:

1. **Title** — the document's title.
2. **Scope** — what the page applies to, in one line.
3. **Version** — matching the repository document.
4. **Status** — active, draft, or future draft.
5. **Last revised** — a date, not a vague "recently".
6. **Effective date** — only when one exists. Do not invent one.
7. **Copyright line** — exactly: `Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.`
8. **Contact route** — how to ask a question or report a problem.
9. **Links to related pages** within the same scope, and to the scope landing page.

## 8. The Copyright Line and Studio Description

Use the exact attribution wherever copyright is stated:

> Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.

When describing the studio, state accurately that Next Step Studios is the public-facing name under which Candler Shaw operates, and that it is not a registered company. Do not add a company number, a registered address, a legal representative, or a trademark symbol that does not exist.

## 9. Cross-Linking Rules

1. The game scope may link to the website's privacy notice, terms of use, and takedown notice where relevant.
2. The website scope may add a single link to the game scope, labelled clearly as game policies.
3. Do not copy website policy text into game pages, or game policy text into website pages. Duplicated text drifts out of sync.
4. Do not present the game's policies as applying to the website, or the reverse.
5. Where a document genuinely spans both — for example a general takedown process — state explicitly which scope governs which material.

## 10. In-Game Links

When the game ships, it should link to the published policies:

1. from an about or legal screen;
2. from the first-run terms presentation;
3. from the credits, alongside the third-party notices.

If the game is offline, the terms must also be available locally, because a player may never open the website. A link alone is not sufficient for an offline product.

## 11. Accessibility and Readability

1. Policies should be readable without JavaScript.
2. Headings should nest correctly, and long documents should have an in-page contents list.
3. Text should meet reasonable contrast requirements and be resizable.
4. Dates should be written out, not only numeric, where ambiguity is possible.
5. Each page should be reachable from the scope landing page and from the policy index.

## 12. Versioning and Change History

1. Keep the website's version number identical to the repository document's version.
2. Publish a change note when a page's version changes.
3. Never silently rewrite a published policy. Publish the new version and note what changed.
4. Keep the previous version available, or at least note what it said, where the change affects rights.

## 13. Integration Checklist

- [ ] Policies reviewed by a lawyer, at least the EULA, prototype terms, privacy policy, and liability notice.
- [ ] Each page's status reflects reality; drafts are not published as active.
- [ ] Version and revision dates match the repository.
- [ ] Copyright line is exact on every page.
- [ ] No invented entity, address, registration, or representative appears.
- [ ] Scope is visibly separate from the website and Discord bot scopes.
- [ ] Policy index links to the new scope.
- [ ] Cross-links go only where they belong.
- [ ] In-game links planned, with local copies for offline use.
- [ ] Change history page created.
- [ ] All pages reachable and readable without JavaScript.

## 14. What This Task Did Not Do

- No website repository files were created or modified.
- No page was published.
- No policy was adopted.
- No visibility change was made to the game repository.

## 15. Open Questions

1. Whether drafts should be visible on the website at all, labelled as drafts.
2. Whether the scope should live under `/policies/places-left-behind/` or at a dedicated subdomain.
3. Whether the credits page should be static text or generated from the register.
4. Whether the website's existing takedown notice can cover the game, or whether a separate process is needed.
5. How the in-game terms will be stored for offline players.
6. Who reviews updates to the published pages.

## 16. Related Documents

- [README.md](/docs/places-left-behind/licensing-index) — licensing system index
- [Commercial/EULA-Draft.md](/docs/places-left-behind/eula-draft)
- [Privacy/Game-Privacy-Policy-Draft.md](/docs/places-left-behind/game-privacy-policy-draft)
- [Future/Copyright-and-Takedown.md](/docs/places-left-behind/copyright-and-takedown)
- [`../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files)

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial website policy integration plan |
