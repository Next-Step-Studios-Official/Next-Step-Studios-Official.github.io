---
title: "Engine Relicensing and Contribution Rights Policy"
version: "1.0"
docStatus: "Current"
summary: "The rights the project needs in order to relicense the engine independently"
sourceId: "PLB-LEG-031"
sourcePath: "Documentation/Licensing/Contributors/Engine-Relicensing-Policy.md"
category: "contributors"
order: 30
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-031 |
| Version | 1.0 |
| Status | Current |
| Scope | The rights the project needs in order to relicense the engine independently |
| Applies to | Engine contributions, third-party dependencies, and future licensing decisions |
| Current position | No contributions accepted. All engine code is owned outright by one individual. |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. Purpose

The engine's value as an independent asset depends on the owner being able to choose its licence later — proprietary, MIT, Apache 2.0, BSD, commercial, dual, or partial.

That freedom can be lost quietly: one contribution accepted without adequate rights, or one dependency with a copyleft licence, can permanently constrain the decision.

This policy states what must remain true so the choice stays open.

## 2. Current Position

| Item | State |
| --- | --- |
| Engine code authorship | Entirely Candler Shaw |
| External contributions | None. Not accepted. |
| Contributor agreements executed | None |
| Engine dependencies | Silk.NET 2.23.0 (MIT), GLFW 3.4 via `Ultz.Native.GLFW` (zlib), Microsoft assemblies (MIT) |
| Copyleft dependencies in the engine | None |
| Third-party creative assets inside the engine | None. The engine contains no game content. |
| Open-source licences applied to the engine | None |

The owner therefore holds all rights needed to relicense the engine today.

## 3. The Rights That Must Be Preserved

For any future contribution to the engine, the project would need:

1. **A broad copyright licence** — perpetual, irrevocable, worldwide, royalty-free.
2. **The right to modify** and to create derivative works.
3. **The right to distribute**, in source and binary form.
4. **The right to sublicense**, through multiple tiers.
5. **The right to relicense**, including under a different licence from the one the contribution arrived under.
6. **A patent licence**, covering claims necessarily infringed by the contribution.
7. **A warranty of originality**, or full disclosure of third-party material.
8. **A record of acceptance**, so provenance can be demonstrated later.

These are the rights in the draft [Contributor License Agreement](/docs/places-left-behind/contributor-license-agreement).

## 4. Why a Licence, Not an Assignment

The project uses a licence-based approach rather than requiring copyright assignment.

| Reason | Explanation |
| --- | --- |
| Proportionate | The project needs rights, not ownership |
| Fair to contributors | Contributors keep their work and can reuse it |
| Easier to obtain | More contributors will accept a licence than an assignment |
| Adequate | A broad, irrevocable, sublicensable licence is sufficient to relicense |

Assignment remains an option if a specific contribution requires it, but it should not be the default and would need a stated reason.

## 5. Inbound Equals Outbound, Where Possible

1. Where a contribution is made under the project's current proprietary terms, the licence granted back must be at least as broad as those terms, so the contribution can be distributed as part of the project.
2. Where the project may later relicense, the grant must be broader than the current terms — which is why the draft CLA includes relicensing rights.
3. A contributor who is unwilling to grant relicensing rights can still be credited for a design suggestion or a bug report, which does not require the same grant.

## 6. Dependency Constraints on Relicensing

| Dependency | Licence | Effect on relicensing |
| --- | --- | --- |
| Silk.NET packages | MIT | Compatible with proprietary, MIT, Apache 2.0, and BSD releases. Notices required. |
| GLFW binaries | zlib | Compatible with all of the above. Notices required. |
| Microsoft assemblies | MIT | Compatible. Notices required. |
| .NET runtime | MIT, prerequisite | Not redistributed in framework-dependent builds. Compatible if redistributed. |

No dependency would block an open-source release of the engine, and none would force the engine's own source to be disclosed under a copyleft licence.

This must be re-checked whenever a dependency is added. See the [Third-Party Compliance Policy](/docs/places-left-behind/third-party-compliance-policy).

## 7. Contamination Risks

The following would compromise the ability to relicense the engine:

1. Copying code from a GPL, AGPL, or LGPL project into the engine.
2. Accepting a contribution without a CLA.
3. Accepting a contribution that includes third-party material under incompatible terms.
4. Adding a dependency with a copyleft or source-available licence.
5. Including game content in the engine, which would entangle the engine's licensing with the game's.
6. Using an asset or font with restrictive terms inside the engine.

Each of these is a reason to stop and resolve the issue before merging.

## 8. Starting a Future Licensing Decision

When the owner decides to license the engine, the process would be:

1. **Confirm ownership.** Verify that every file in `Source/Engine/` is owned outright or covered by a CLA with relicensing rights.
2. **Confirm dependencies.** Re-audit the dependency set and confirm compatibility with the chosen licence.
3. **Choose the licence.** MIT, Apache 2.0, BSD, commercial, dual, or partial. Record the reasoning.
4. **Prepare the notices.** Keep the third-party notices; add the chosen licence text and a copyright line.
5. **Check the game boundary.** Ensure no game content, story, or asset is included.
6. **Publish deliberately.** A licence takes effect when published, not when contemplated.
7. **Record the decision.** Add it to the decision log in [`../Project-Licensing.md`](/docs/places-left-behind/project-licensing).
8. **Communicate clearly.** State what is licensed, from which version, and what remains proprietary.

Nothing in this policy obliges the owner to make that decision, and no third party may rely on it happening.

## 9. Version Boundaries

If the engine is ever relicensed, the decision should state:

1. which versions the licence applies to;
2. whether it applies retroactively to earlier versions;
3. whether the game remains proprietary;
4. whether the engine's documentation is included;
5. whether the engine's name may be used by others.

Without those statements, the scope of a future release would be ambiguous in exactly the way this policy exists to prevent.

## 10. Contributions to the Game

The game's position is simpler: it is intended to remain proprietary. Contributions to game code would still need a CLA for clarity, but relicensing rights are less critical. Using the same CLA for both keeps the process uniform and avoids a second document.

## 11. Record Keeping

The owner should maintain:

- a list of contributors and the CLA version each accepted;
- the date of acceptance;
- the commits or files covered;
- disclosure of any third-party material;
- any withdrawal requests and how they were handled.

This record is the evidence that the engine can lawfully be relicensed.

## 12. Legal Review

This policy requires review before contributions are accepted. Points to resolve:

1. Whether the relicensing grant is enforceable as drafted.
2. Whether a separate engine CLA is needed, or one combined CLA suffices.
3. How moral rights affect relicensing in contributors' jurisdictions.
4. Whether the owner, being under 18, can be bound by, and can enforce, these agreements, and what guardian involvement is required.
5. Confirmation of the intended jurisdiction, Georgia, United States.

## 13. Related Documents

- [Contributor-Policy.md](/docs/places-left-behind/contributor-policy)
- [Contributor-License-Agreement.md](/docs/places-left-behind/contributor-license-agreement)
- [External-Contribution-Guidelines.md](/docs/places-left-behind/external-contribution-guidelines)
- [`../Engine-Licensing.md`](/docs/places-left-behind/engine-licensing)
- [`../../../Source/Engine/LICENSE`](/docs/places-left-behind/#source-only-files)
- [`../ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses)
- [`../Project-Licensing.md`](/docs/places-left-behind/project-licensing)

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial engine relicensing and contribution rights policy |
