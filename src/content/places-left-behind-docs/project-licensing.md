---
title: "Project Licensing Overview"
version: "1.0"
docStatus: "Current"
summary: "The whole Places Left Behind repository and its licensing boundaries"
sourceId: "PLB-LEG-004"
sourcePath: "Documentation/Licensing/Project-Licensing.md"
category: "foundations"
order: 20
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-004 |
| Version | 1.0 |
| Status | Current |
| Scope | The whole Places Left Behind repository and its licensing boundaries |
| Applies to | Every directory, file, and future addition in the repository |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 (describes existing ownership and current practice) |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. Purpose

This document explains how licensing is organized across Places Left Behind. It is the entry point for the licensing system and the reference for deciding which license applies to a given file.

It records what is true today. It does not create rights, and it does not adopt any draft agreement found elsewhere in `Documentation/Licensing/`.

## 2. Current Status

| Item | Current state |
| --- | --- |
| Repository visibility | Private |
| Repository purpose | Version control for an early prototype |
| Copyright owner | Candler Shaw, an individual |
| Public-facing studio name | Next Step Studios, not a registered company |
| Copyright registration | None claimed |
| Trademark registration | None claimed |
| Game licensing | Proprietary; all rights reserved |
| Engine licensing | Proprietary; all rights reserved; separately licensable in future |
| Open-source licenses applied | None |
| Distribution | None. No build has been distributed. |
| Prototype programme | None. No tester terms are in force. |
| External contributions | Not accepted |

## 3. Licensing Map

| Path | Contents | Governing license | Recorded in |
| --- | --- | --- | --- |
| `LICENSE`, `LICENSE.md` | Project-wide proprietary license | Proprietary, all rights reserved | `LICENSE` / `LICENSE.md` (PLB-LEG-001) |
| `Source/Engine/` | Custom engine code | Proprietary engine license | `Source/Engine/LICENSE` (PLB-LEG-002) |
| `Source/Game/` | Game-specific code | Project proprietary license | `Source/Game/LICENSE` (PLB-LEG-003) |
| `Assets/` (original content) | Models, textures, materials, audio, writing, shaders | Project proprietary license | `LICENSE` (PLB-LEG-001) and Asset Licensing Register (PLB-LEG-021) |
| `Assets/` (third-party content) | Any externally sourced asset | The asset's own license | Asset Licensing Register (PLB-LEG-021) |
| `Configuration/` | Game settings | Project proprietary license | `LICENSE` (PLB-LEG-001) |
| `Scripts/` | Build and run scripts | Project proprietary license | `LICENSE` (PLB-LEG-001) |
| `Documentation/` | Project and licensing documentation | Proprietary; not open-source licensed | Section 4 of this document |
| `Tests/`, `Tools/` | Reserved directories | Project proprietary license | `LICENSE` (PLB-LEG-001) |
| Third-party software | NuGet packages, GLFW binaries | Their own licenses | `THIRD-PARTY-NOTICES.txt` (PLB-NOT-001) and Third-Party Licenses (PLB-LEG-018) |

## 4. Documentation Licensing

Project documentation is proprietary.

- It is not licensed under Creative Commons, the GNU Free Documentation License, or any other open content license.
- It may not be republished, mirrored, translated, or distributed without a separate written agreement.
- The licensing documents under `Documentation/Licensing/` are themselves proprietary and are subject to the project license.
- The single exception is third-party license text reproduced verbatim, such as the MIT and zlib texts in `THIRD-PARTY-NOTICES.txt`. Those texts remain the property of their owners and are present only to satisfy attribution requirements.

Do not add a documentation license to this repository unless it is a deliberate, recorded decision by the copyright owner. A documentation license would also need to be reconciled with the project license so the two do not conflict.

## 5. The Licensing Layers

The project uses deliberately separate layers. Each layer can change without silently changing the others.

1. **Project layer.** The repository-wide proprietary license. Grants nothing by default.
2. **Engine layer.** A separate proprietary license for `Source/Engine/`, which preserves the option of an independent future decision about the engine.
3. **Game layer.** A scope notice for `Source/Game/` that incorporates the project license and prevents the engine and game from being treated as one licensing unit.
4. **Third-party software layer.** Upstream licenses for NuGet packages and native libraries. Never absorbed into the project license.
5. **Third-party creative asset layer.** Per-asset licenses recorded in the Asset Licensing Register.
6. **Community layer.** Draft terms for mods, submissions, and contributions. Not in force.
7. **Distribution layer.** Draft prototype and end-user terms for builds. Not in force.

A change to one layer does not change another. In particular, releasing the engine under an open-source license in the future would not change the licensing of the game, the assets, or the documentation.

## 6. Repository Visibility

The repository is private. Nothing in this licensing system depends on or authorizes a change of visibility.

If the repository becomes public:

- The public visibility is not a license grant. The proprietary license continues to apply.
- GitHub's platform terms apply to ordinary viewing and to forking performed through GitHub's service. Those terms are an agreement with GitHub, not a license from the copyright owner.
- A public fork made through GitHub does not grant the forking user permission to redistribute, sell, or reuse the project outside what GitHub's service itself permits.
- Any public-facing documentation should state that the project is proprietary and that viewing does not grant a license.

Changing visibility is a separate decision for the copyright owner and should be recorded in the decision log in section 9.

## 7. Rules for Adding New Material

When adding files to the repository:

1. **Original code** goes under the project license. Engine code goes under `Source/Engine/` and the engine license; game code goes under `Source/Game/` and the game notice.
2. **External code** must not be copied in unless its license permits the intended use and it is recorded in the Third-Party Licenses inventory.
3. **External assets** must not be added without a register entry recording creator, source, license, and attribution requirements.
4. **Fonts** require an entry in the Asset Licensing Register and their license file kept alongside them.
5. **Generated output** such as compiled shaders, build artifacts, and exports is not a separate licensing unit; it is derived from the source that produced it.
6. **Third-party license text** must be reproduced verbatim, never paraphrased.

## 8. Verification Notes

The following were checked while establishing this system:

- No `LICENSE` file existed before this task; the repository had no license statement.
- No open-source license is applied anywhere in the repository.
- `Directory.Packages.props` and both project files reference only Silk.NET 2.23.0 packages, which are MIT-licensed.
- The resolved dependency graph contains no copyleft-licensed component.
- No font files, third-party audio, third-party textures, or third-party models are present.
- `Assets/Scenes/Locations/TestMap/Source/TestMap.blend` and `TestMap.glb` are original project assets produced in Blender.
- `Assets/Shaders/clear.vert` and `clear.frag` are original project shaders.

## 9. Decision Log

Decisions that change the licensing system should be recorded here, with a date.

| Date | Decision | Status |
| --- | --- | --- |
| 2026-11-24 | Establish a proprietary licensing system with separate project and engine layers | Current |
| 2026-11-24 | No open-source license applied to the game, engine, assets, or documentation | Current |
| 2026-11-24 | Keep the repository private; visibility is not a licensing decision | Current |
| 2026-11-24 | Use closed, invitation-only prototype testing as the default distribution model | Proposed; no programme exists |
| 2026-11-24 | Mark all custom agreements as drafts pending legal review | Current |

Open items that require confirmation:

- Confirmation of Georgia, United States as the governing jurisdiction.
- Whether a legal entity will be formed for Next Step Studios.
- Guardian involvement and capacity considerations, because the copyright owner is currently under 18.
- Whether any registered trademark protection will be sought for the game or studio name.
- Whether copyright registration will be sought.

## 10. Versioning and Maintenance

All documents in the licensing system use the same version scheme and the same revision date convention.

- Documents start at version 1.0.
- A material change increments the minor version (1.0 → 1.1) and is recorded in the document's revision history.
- A change of substance that alters rights or obligations increments the major version (1.x → 2.0).
- Corrections of typos or links may be made without a version change, but must not alter meaning.
- `LICENSE` and `LICENSE.md`, and `Source/Engine/LICENSE` and `Source/Engine/LICENSE.md`, must always contain the same terms and be revised together.

## 11. Related Documents

- [README.md](/docs/places-left-behind/licensing-index) — licensing system index and document register
- [Game-Licensing.md](/docs/places-left-behind/game-licensing) — game intellectual property policy
- [Engine-Licensing.md](/docs/places-left-behind/engine-licensing) — engine licensing policy
- [Third-Party-Licenses.md](/docs/places-left-behind/third-party-licenses) — dependency inventory
- [Asset-Licensing-Policy.md](/docs/places-left-behind/asset-licensing-policy) — asset licensing rules
- [Distribution-Compliance.md](/docs/places-left-behind/distribution-compliance) — distribution obligations
- [`../../LICENSE`](/docs/places-left-behind/#source-only-files) — project proprietary license

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial project licensing overview |
