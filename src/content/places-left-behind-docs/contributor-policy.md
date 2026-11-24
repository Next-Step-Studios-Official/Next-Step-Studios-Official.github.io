---
title: "Contributor Policy"
version: "1.0"
docStatus: "Current — policy of not accepting contributions, with a draft process for the future"
summary: "External contributions to Places Left Behind and its engine"
sourceId: "PLB-LEG-028"
sourcePath: "Documentation/Licensing/Contributors/Contributor-Policy.md"
category: "contributors"
order: 20
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-028 |
| Version | 1.0 |
| Status | Current — policy of not accepting contributions, with a draft process for the future |
| Scope | External contributions to Places Left Behind and its engine |
| Applies to | Anyone who wishes to contribute code, assets, documentation, or testing |
| Current position | External contributions are not accepted. No CLA has been executed. |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 (for the current position of not accepting contributions) |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. Current Position

**External contributions are not accepted at this time.**

- The repository is private.
- No contributor licence agreement has been signed by anyone.
- No contribution terms are in force.
- The draft CLA in [Contributor-License-Agreement.md](/docs/places-left-behind/contributor-license-agreement) is not adopted.
- Unsolicited code, assets, or documents should not be sent, and if sent, create no obligation on the owner.

This is a deliberate position, not an oversight. It keeps the ownership position simple while the engine and game are being established, and preserves the option to license the engine independently later.

## 2. Why Contributions Are Paused

1. **Ownership clarity.** Contributions from others create shared rights that must be tracked, credited, and respected in every future licensing decision.
2. **Engine relicensing.** The owner intends to keep the option of releasing the engine under a different licence. That requires the right to relicense every line of code in it.
3. **Prototype stage.** The architecture is changing quickly. Outside work would likely need rewriting, which is unfair to the contributor.
4. **Legal capacity.** The owner is currently under 18. Agreements with contributors raise capacity questions that should be resolved before any are signed.
5. **No process yet.** There is no review, no test suite to gate contributions, and no agreement in force.

## 3. Is a CLA Appropriate?

**Assessment: yes, a CLA would be appropriate — but only when contributions are opened, and only in the form drafted here or a reviewed equivalent.**

Reasoning:

| Consideration | Assessment |
| --- | --- |
| The project is proprietary | A CLA is needed, because without one the project cannot accept code without implied licence ambiguity |
| The engine may be relicensed | A broad, irrevocable licence with sublicensing and relicensing rights is required; a simple "contribution is MIT" statement would not preserve that option |
| Ownership transfer is not wanted | A licence-based CLA is preferable to a copyright assignment. Assignment would move ownership away from contributors unnecessarily, and is a harder ask |
| Contributors may be minors | Any CLA must address capacity and guardian involvement |
| Small project, few contributors | A lightweight CLA, plus a Developer Certificate of Origin for trivial changes, may be proportionate. Both options are described in section 5 |
| Patent risk | A patent grant is prudent if the engine is ever released under Apache 2.0 or used commercially |
| Moral rights | Contributors in some jurisdictions have moral rights that cannot be waived. The CLA must acknowledge this rather than pretend otherwise |

## 4. What a Future Contribution Process Would Require

1. A signed or click-through CLA covering the specific contribution.
2. A statement that the contributor has the right to submit the work.
3. Disclosure of any third-party material and its licence.
4. Adherence to the project's coding and commit conventions.
5. Review by the owner before merging.
6. A record of the contribution, the CLA version accepted, and the date.

## 5. CLA Versus DCO

| Approach | What it does | Fit for this project |
| --- | --- | --- |
| Contributor License Agreement (CLA) | Contributor grants the project broad rights, including sublicensing and relicensing | Best fit. Preserves independent engine licensing and does not take ownership |
| Developer Certificate of Origin (DCO) | Contributor certifies they have the right to submit under the project's existing licence | Insufficient alone for a proprietary project that may relicense, because it grants no rights beyond the project's current licence |
| Copyright assignment | Contributor transfers ownership to the project | Not wanted. Unnecessary, a harder ask, and it removes the contributor's ownership without a clear benefit |

The recommended path, when contributions open, is a CLA based on the draft in this folder, optionally combined with a DCO sign-off for commit-level provenance.

## 6. What Contributors Would Keep

Under the draft CLA:

- contributors keep ownership of their contribution;
- contributors may use their own contribution elsewhere;
- contributors are credited, unless they ask not to be;
- contributors are not asked to give up rights beyond what the project needs to develop, distribute, and relicense the work.

## 7. What the Project Would Need

- a perpetual, irrevocable, worldwide, royalty-free licence;
- the right to modify and create derivative works;
- the right to distribute and sublicense;
- the right to relicense, including under an open-source licence, if the owner chooses;
- a patent licence covering the contribution;
- warranties that the contribution is original or properly licensed.

These are the minimum rights needed to keep the engine independently licensable. Without them, a single contribution could permanently block a future licensing decision.

## 8. Contributions the Project Would Not Accept

- Code copied from a project with an incompatible licence.
- Code with no clear licence.
- Assets with unclear provenance or non-commercial terms.
- Anything that would force the project to disclose its source.
- Changes that break the engine/game separation.
- Anything that adds a dependency without a verified licence.

## 9. Reporting Security Issues

A security issue should be reported privately to the owner rather than as a public contribution. No formal security policy is in force; the [Community Reporting Policy](/docs/places-left-behind/community-reporting-policy) draft describes the intended process.

## 10. Legal Review

This policy and the draft CLA require review before use. Points to resolve:

1. Whether a licence-based CLA is enforceable as drafted in Georgia, United States.
2. How moral rights are handled for contributors in other jurisdictions.
3. Whether minors can validly accept a CLA, and what guardian involvement is needed.
4. Whether a separate corporate CLA is needed if a company ever contributes.
5. Whether click-through acceptance is sufficient, or a signature is required.
6. Whether the patent clause is proportionate.
7. Capacity issues arising from the owner being under 18 when agreements are signed.

## 11. Related Documents

- [Contributor-License-Agreement.md](/docs/places-left-behind/contributor-license-agreement) — draft CLA
- [External-Contribution-Guidelines.md](/docs/places-left-behind/external-contribution-guidelines) — draft process
- [Engine-Relicensing-Policy.md](/docs/places-left-behind/engine-relicensing-policy) — relicensing rights
- [`../Engine-Licensing.md`](/docs/places-left-behind/engine-licensing)
- [`../../Git-Conventions.md`](/docs/places-left-behind/git-conventions) — commit conventions
- [`../../Development.md`](/docs/places-left-behind/development) — development conventions

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial contributor policy and CLA assessment |
