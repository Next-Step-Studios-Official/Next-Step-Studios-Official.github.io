---
title: "Prototype Distribution and Sharing Policy"
version: "1.0"
docStatus: "Draft"
summary: "Operational policy for how prototype builds are distributed and shared"
sourceId: "PLB-LEG-010"
sourcePath: "Documentation/Licensing/Prototype/Prototype-Distribution-Policy.md"
category: "prototype"
order: 20
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-010 |
| Version | 1.0 |
| Status | Draft |
| Scope | Operational policy for how prototype builds are distributed and shared |
| Applies to | The owner, and any collaborator assisting with prototype distribution |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not yet applicable — no prototype programme exists |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Draft.** This policy describes a programme that does not yet exist. No build has been distributed. It is written now so that the first distribution decision starts from a considered position rather than an improvised one.

---

## 1. Default Distribution Model

**Closed, invitation-only prototype testing is the default.** The owner has not committed to publicly distributing prototype builds.

The intended model:

1. A small, named group of testers invited personally.
2. Individual, non-transferable access rather than a public download.
3. A written acceptance step before a build is made available.
4. Identifiable builds so a report can be traced to a version.
5. The ability to end access for a person or withdraw a build.

Public or open prototype distribution would be a separate decision, recorded in section 10, and would require different terms.

## 2. What May Be Shared

| Item | Sharing position |
| --- | --- |
| Built executable and its data files | Invited testers only, through a controlled channel |
| Source code | Not shared outside the owner. The repository is private. |
| Blender source files | Not shared, unless a specific collaboration requires it |
| Original assets | Not shared separately from a build |
| Screenshots and short gameplay footage | May be published by testers under the conditions in the distribution license |
| Written impressions and criticism | May be published freely |
| Build identifiers and patch notes | May be published when the owner chooses |

## 3. Access Control

1. Access is granted to named individuals, not to groups, communities, or organisations.
2. Invitations, download links, and access codes are personal and must not be forwarded.
3. Where a platform supports it, downloads should be limited to invited accounts.
4. The owner keeps a record of who was given access to which build, and when. This record is administrative, not public.
5. Access may be withdrawn at any time. Withdrawal should be recorded.

## 4. Build Identification

1. Each distributed build should carry a build identifier that the game can display and that appears in the download name.
2. The identifier should allow a bug report to be matched to an exact build.
3. Builds should record the source commit they were built from, so a defect can be reproduced.
4. Debug symbols, source maps, and internal documentation should not be distributed with a prototype build unless deliberately decided otherwise.

## 5. Build Expiration and Replacement

1. Prototype builds may be time-limited or launch-limited, and may be withdrawn.
2. A superseded build should be treated as obsolete; testers should delete it.
3. Saves may be incompatible between builds. Testers should be told when a build breaks save compatibility.
4. Expiry should be disclosed to testers before they install a build, not imposed silently.

## 6. What Must Accompany a Build

Before a build is provided to any tester, it should include or be accompanied by:

1. The applicable [Prototype Distribution License](/docs/places-left-behind/prototype-distribution-license) and [Prototype Tester Agreement](/docs/places-left-behind/prototype-tester-agreement), with an acceptance step.
2. The [Prototype Feedback and Bug Report Policy](/docs/places-left-behind/prototype-feedback-policy) and the designated feedback channel.
3. A short note on what the build does and does not contain, so testers do not report missing planned features as defects.
4. The third-party notices required by the licenses of included components. See [`../../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files) and the [Third-Party Redistribution Checklist](/docs/places-left-behind/third-party-redistribution-checklist).
5. Any hardware or software prerequisites, such as a Vulkan-capable GPU and driver.

## 7. Sharing Rules for Testers

Testers may, without asking:

- play and explore the build;
- take screenshots and record gameplay;
- publish short clips, screenshots, streams, impressions, and criticism;
- report bugs and give feedback.

Testers must not, without written permission:

- share, mirror, or re-upload the build or any download link;
- share access codes or invitations;
- publish source code, internal documents, or unreleased spoiler content;
- publish long, minimally transformative re-uploads of the game's content as a substitute for playing;
- distribute modified builds or extracted assets.

Full conditions are in sections 4 to 9 of the [Prototype Distribution License](/docs/places-left-behind/prototype-distribution-license).

## 8. Public Discussion, Reviews, and Press

1. Honest public discussion is permitted and useful. The distribution terms do not impose a gag order.
2. Testers should identify the game as an early prototype and should not present it as a release.
3. The owner may ask that specific spoiler-sensitive material be held back before a public reveal, for a stated period.
4. Any press, creator, or platform coverage should be coordinated with the owner if it involves early access to a build, so that expectations are accurate.
5. Reviews of a released game are governed by the released game's terms, not by this policy.

## 9. Removal of Access and Withdrawal of Builds

The owner may:

1. end an individual's access, with or without cause;
2. withdraw a build from distribution;
3. end the programme entirely;
4. require deletion of copies in a tester's possession.

Withdrawal of access does not require a refund, because prototype access is free unless a separate written arrangement says otherwise. Material already lawfully published remains published; the owner may still ask for it to be removed where it discloses confidential material or infringes rights.

## 10. Decisions Not Yet Made

The following are open and should be recorded here before a programme begins:

| Decision | Status |
| --- | --- |
| Whether any public prototype or demo will be released | Not decided; default is no |
| Which channel will deliver builds | Not decided |
| Whether builds will expire automatically | Not decided |
| Whether a click-through acceptance record will be used | Not decided |
| Whether a signed agreement will be required, or click-through alone | Not decided |
| Whether minors may test, and what guardian consent applies | Not decided |
| Whether coverage embargoes will be used before a reveal | Not decided |
| Whether testers will be credited publicly | Not decided |

## 11. Pre-Distribution Checklist

Before the first build is distributed:

- [ ] Prototype terms reviewed by a qualified lawyer.
- [ ] Acceptance mechanism chosen and tested.
- [ ] Feedback channel designated.
- [ ] Build identifier implemented and visible in-game.
- [ ] Third-party notices included in the build or its accompanying files.
- [ ] Prerequisites documented.
- [ ] Tester list created and kept private.
- [ ] Expiry or withdrawal behaviour decided and disclosed.
- [ ] Data handling confirmed: currently the game writes no telemetry and no saves.
- [ ] Distribution decision recorded in section 10.

## 12. Related Documents

- [Prototype-Distribution-License.md](/docs/places-left-behind/prototype-distribution-license)
- [Prototype-Tester-Agreement.md](/docs/places-left-behind/prototype-tester-agreement)
- [Prototype-Feedback-Policy.md](/docs/places-left-behind/prototype-feedback-policy)
- [`../Compliance/Distribution-Compliance.md`](/docs/places-left-behind/distribution-compliance)
- [`../Compliance/Third-Party-Redistribution-Checklist.md`](/docs/places-left-behind/third-party-redistribution-checklist)
- [`../Commercial/Game-Distribution-Terms.md`](/docs/places-left-behind/game-distribution-terms)

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial draft of the prototype distribution and sharing policy |
