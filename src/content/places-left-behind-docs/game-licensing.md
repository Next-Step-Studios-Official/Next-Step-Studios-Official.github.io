---
title: "Game Intellectual Property and Licensing Policy"
version: "1.0"
docStatus: "Current"
summary: "Game code, game content, and game-related intellectual property"
sourceId: "PLB-LEG-005"
sourcePath: "Documentation/Licensing/Game-Licensing.md"
category: "foundations"
order: 30
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-005 |
| Version | 1.0 |
| Status | Current |
| Scope | Game code, game content, and game-related intellectual property |
| Applies to | `Source/Game/`, `Assets/`, `Configuration/`, and all future game content |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 (describes existing ownership and current practice) |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. Purpose

This policy defines what constitutes the intellectual property of Places Left Behind, who owns it, and how it may be used. It exists so that decisions about the game's content do not have to be re-litigated each time a new file, asset, or collaboration appears.

## 2. Ownership

All original intellectual property in Places Left Behind is owned by **Candler Shaw**, an individual.

- Next Step Studios is the public-facing name under which Candler Shaw operates the studio.
- Next Step Studios is not a registered company, partnership, or other legal entity.
- Next Step Studios does not own intellectual property independently of Candler Shaw.
- Any future transfer of ownership to a legal entity would require a written assignment and a recorded update to this policy.

Where this policy says "the owner", it means Candler Shaw.

## 3. What the Game's Intellectual Property Includes

| Category | Examples in this repository |
| --- | --- |
| Game source code | `Source/Game/Program.cs`, `PlacesLeftBehindGame.cs`, `Player/` |
| Game mechanics as implemented | Player movement, camera control, scene use, planned investigation systems |
| Original 3D content | `Assets/Scenes/Locations/TestMap/Source/TestMap.blend`, `TestMap.glb` |
| Shaders | `Assets/Shaders/clear.vert`, `clear.frag` |
| Materials and textures | Any original material and texture authored for the game |
| Audio and music | Any original ambience, music, sound effect, or voice recording |
| Writing and narrative | Location histories, documents, notes, item descriptions, dialogue |
| Interface design | Menus, HUD layout, document presentation, iconography |
| World and level design | Location layouts, puzzle and clue placement, environmental storytelling |
| Names and branding | "Places Left Behind", location names, in-game organisation names |
| Configuration | `Configuration/game.settings.json` and future game data files |
| Documentation | Design notes and the licensing documents themselves |

This list is descriptive, not exhaustive. Original creative material created for the game is owned by the owner whether or not it appears here.

## 4. Licensing Status

The game is proprietary. All rights are reserved.

- The game is not open source.
- No source-available license, source-available grant, or "fair source" arrangement applies.
- No permission is granted to copy, redistribute, sell, reuse, modify, publish modified versions, or incorporate the game into another product, except under a separate written agreement.
- The binding terms are in [`../../LICENSE`](/docs/places-left-behind/#source-only-files) and [`../../LICENSE.md`](/docs/places-left-behind/#source-only-files), and in the game-scope notice at [`../../Source/Game/LICENSE`](/docs/places-left-behind/#source-only-files).

This policy describes the licensing position. It does not grant rights itself.

## 5. Separation from the Engine

The engine and the game are separate works with a common owner.

- Engine technology belongs in `Source/Engine/` and is governed by the engine license.
- Game-specific implementation belongs in `Source/Game/` and is governed by the project license.
- Original creative content belongs in `Assets/` and is governed by the project license.
- Engine code must not be moved into `Source/Game/` merely to change its licensing treatment, and game code must not be moved into `Source/Engine/` to make it part of the engine.

The practical test: if a system could be reused by an unrelated game without any Places Left Behind content, it belongs in the engine. If it depends on this game's story, locations, items, clues, or presentation, it belongs in the game.

## 6. Prototype Stage

The game is an early prototype of both the engine and the game.

Currently implemented:

- Application lifecycle and window creation.
- Vulkan initialization, swapchain, depth buffering, indexed mesh drawing, shader compilation.
- Input handling.
- Scene, entity, component, and transform systems.
- A first-person camera and player controller.
- Rendering of a test cube.

Not implemented: world loading from glTF/GLB, physics and collision, investigation systems, photography, documents, saving, audio, user interface, and actual game locations.

This policy applies to the prototype as it stands and to all future development. It does not represent the prototype as a finished game, and it does not describe planned systems as existing.

## 7. Third-Party Material Inside the Game

Third-party software and assets are not part of the game's owned intellectual property.

- Third-party software licenses are recorded in [`ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses) and attributed in [`../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files).
- Third-party creative assets are recorded in the Asset Licensing Register.
- Third-party material must never be described as owned by the studio, and the studio must never grant rights in it that its own license does not allow.
- Where an asset license requires attribution, that attribution must survive into the shipped product.

## 8. Community-Created Content

Community modifications are a planned future feature, not an existing one.

- Mod authors retain ownership of their original creations.
- The owner does not claim ownership of community-created content.
- Any permission the owner needs in order to host or distribute mods through official channels is limited to what is necessary for that purpose and is described in the draft modding documents.
- No modding terms are in force, and no modding system exists.

See [`Modding/Modding-License.md`](/docs/places-left-behind/modding-license) and [`Modding/Community-Content-Policy.md`](/docs/places-left-behind/community-content-policy), both drafts.

## 9. Uses That Are Not Permitted

Without a separate written agreement, the following are not permitted:

- Redistributing game files, builds, or assets.
- Publishing modified builds or "fixed" versions.
- Selling the game, its assets, or derivative works.
- Using game content to train or build a competing product.
- Using the game's names, logo, or branding in a way that suggests endorsement or affiliation.
- Republishing the game's documentation or the licensing documents.

Permitted without an agreement: personal, private use of a lawfully obtained build in the ordinary way that the accompanying end-user terms allow; discussion, commentary, criticism, and other uses that applicable law permits regardless of contract.

## 10. Enforcement Posture

The owner intends to protect the game's intellectual property, but proportionately.

- Ordinary discussion, fan commentary, screenshots shared in conversation, and critical writing are not enforcement targets.
- Redistribution of builds, sale of assets, and commercial reuse are the primary concerns.
- Any enforcement action must be based on an identified right and a documented basis, not on a general assertion.
- The draft procedures are in [`Future/Copyright-and-Takedown.md`](/docs/places-left-behind/copyright-and-takedown) and [`Future/IP-Enforcement-Policy.md`](/docs/places-left-behind/ip-enforcement-policy). They are drafts and no process is currently operating.

## 11. Capacity and Legal Review

The copyright owner is currently under 18.

- Contracts, licenses, and enforcement actions involving the owner may raise questions of contractual capacity under applicable law.
- A parent or legal guardian may need to be involved in agreements, registrations, or formal enforcement steps.
- Nothing in this policy or in any draft agreement should be assumed to be enforceable until it has been reviewed with that in mind.
- The intended jurisdiction is Georgia, United States. This is subject to legal review and confirmation, and no attorney has reviewed these documents.

## 12. Related Documents

- [`../../LICENSE`](/docs/places-left-behind/#source-only-files) — project proprietary license
- [`../../LICENSE.md`](/docs/places-left-behind/#source-only-files) — Markdown version of the project license
- [`../../Source/Game/LICENSE`](/docs/places-left-behind/#source-only-files) — game-scope notice
- [`Engine-Licensing.md`](/docs/places-left-behind/engine-licensing) — engine licensing policy
- [`Assets/Asset-Licensing-Policy.md`](/docs/places-left-behind/asset-licensing-policy) — asset rules
- [`Commercial/EULA-Draft.md`](/docs/places-left-behind/eula-draft) — draft end-user terms
- [`Modding/Community-Content-Policy.md`](/docs/places-left-behind/community-content-policy) — draft community terms

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial game intellectual property and licensing policy |
