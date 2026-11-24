---
title: "Engine Licensing Policy"
version: "1.0"
docStatus: "Current"
summary: "The custom Places Left Behind engine under `Source/Engine/`"
sourceId: "PLB-LEG-006"
sourcePath: "Documentation/Licensing/Engine-Licensing.md"
category: "foundations"
order: 40
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-006 |
| Version | 1.0 |
| Status | Current |
| Scope | The custom Places Left Behind engine under `Source/Engine/` |
| Applies to | Engine code, engine dependencies, and any future engine release |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 (describes existing ownership and current practice) |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. Purpose

The Places Left Behind engine is a custom game engine written in C# for .NET 10, using Vulkan through Silk.NET. It is developed alongside the game but maintained as a separate project so that the two can be licensed independently.

This policy states the engine's current licensing position and the conditions under which that position could change. It does not change it.

## 2. Current Position

| Item | Current state |
| --- | --- |
| Engine name | Places Left Behind engine (working name) |
| Location | `Source/Engine/` |
| Language and runtime | C# on .NET 10 |
| Graphics | Vulkan, via Silk.NET bindings |
| Windowing and input | Silk.NET Windowing and Silk.NET Input on GLFW |
| Project type | Library (`PlacesLeftBehind.Engine.csproj`) |
| Licensing | Proprietary, all rights reserved, under `Source/Engine/LICENSE` |
| Open-source licenses applied | None |
| Published separately | No |
| Documented API | No |
| Independent downloads or releases | None |

The engine has not been released, distributed, or licensed to anyone. No evaluation license exists.

## 3. Engine Scope

The engine covers reusable technical functionality:

- Application lifecycle, frame timing, and game loop (`Core/`)
- Window creation and the main loop (`Windowing/`)
- Vulkan initialization, devices, swapchains, render passes, pipelines, buffers, depth buffers, synchronization, and shaders (`Graphics/Vulkan/`)
- Rendering abstractions, meshes, and vertex data (`Graphics/Rendering/`)
- Materials, textures, and shader management directories (`Graphics/Materials/`, `Graphics/Textures/`, `Graphics/Shaders/`)
- Input handling (`Input/`)
- Scenes, entities, components, transforms, and cameras (`World/`)
- Reserved subsystems: physics, platform, audio, assets, utilities, and UI

## 4. Boundary Between Engine and Game

The boundary is maintained deliberately, because it determines what could be licensed separately in future.

**Belongs in the engine:** mechanisms that any game could use without knowing anything about Places Left Behind — a component system, a render pass, a camera, an input map, an asset loader, a save serialisation layer.

**Belongs in the game:** anything that depends on this game's content or design — the player controller's specific feel, investigation logic, photograph scoring, clue definitions, document rendering for this game's notes, location scripts, and the user interface for this game.

**Rules:**

1. Do not move engine code into `Source/Game/` to avoid the engine license, and do not move game code into `Source/Engine/` to make it part of a future engine release.
2. A component that starts in the game may later be generalised into the engine. When that happens, record the move and confirm it contains no game-specific content or third-party material with incompatible terms.
3. The game references the engine through `PlacesLeftBehind.Engine.csproj`. A future independent engine release would need a stable public API; none is documented today.

## 5. Future Licensing Options

The owner has not decided how the engine will be licensed. The following options remain open and are not applied:

| Option | Status | Notes |
| --- | --- | --- |
| MIT | Not applied | Simplest permissive release; compatible with current dependencies |
| Apache License 2.0 | Not applied | Adds an express patent grant and patent termination |
| BSD (2-clause or 3-clause) | Not applied | Permissive; 3-clause adds a non-endorsement clause |
| Commercial license | Not applied | Paid, per-project, royalty, or support-based terms |
| Dual licensing | Not applied | Open-source plus commercial, a common engine pattern |
| Partial release | Not applied | Release some modules, keep others proprietary |
| Remain proprietary | Current | The engine stays closed |

No open-source license is applied to the engine now. Any future license takes effect only when the owner publishes it explicitly in writing, and applies from that point forward unless the owner states otherwise.

## 6. Conditions Before Any Open-Source Release

Before releasing any part of the engine under an open-source license, the owner should confirm:

1. **Ownership and contribution rights.** All code to be released must be owned outright or covered by terms that permit relicensing. Today all engine code was written by the owner, and no outside contributions have been accepted. If contributions are accepted first, the draft CLA in [`Contributors/Contributor-License-Agreement.md`](/docs/places-left-behind/contributor-license-agreement) would be needed so that relicensing remains possible.
2. **Dependency compatibility.** Every bundled dependency must permit redistribution under the chosen license. The verified position is favourable: Silk.NET packages are MIT and the GLFW binaries are zlib-licensed, both compatible with MIT, Apache 2.0, and BSD releases. See [`ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses).
3. **No copyleft contamination.** No GPL, LGPL, AGPL, or other copyleft code may be linked into or derived into engine code intended for permissive release. None is present today.
4. **Notice obligations.** The chosen license and the third-party notices must ship with the release, and [`../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files) must be kept current.
5. **Game separation.** The release must not include game content, game-specific logic, or material the owner does not wish to publish.
6. **Naming.** A public engine release should not imply that the game is open source, and should not use the game's name in a way that confuses the two.
7. **A written decision record.** The decision, its date, its scope, and the exact license text must be recorded in the decision log of [`Project-Licensing.md`](/docs/places-left-behind/project-licensing).

## 7. Third-Party Components and the Engine

- Silk.NET assemblies and the GLFW native library remain under their own licenses in any engine distribution.
- The MIT and zlib licenses permit commercial use, modification, and redistribution, provided their notices are retained.
- Nothing in the engine's proprietary license restricts rights that those licenses grant in those components.
- The engine's own code must never be described as MIT-licensed merely because it depends on MIT-licensed packages.

## 8. What the Engine License Does Not Do

The engine being separately licensable does not mean:

- that the engine is currently available to anyone;
- that the game may be redistributed with it;
- that engine code may be reused in another project today;
- that a future open-source release is promised;
- that the game's content becomes available if the engine is released.

## 9. Evaluation and Licensing Requests

Any request to evaluate, license, or use the engine must be made in writing to the owner and is effective only if granted in writing. There is no public evaluation programme, no download, and no trial license.

## 10. Legal Review

The intended jurisdiction is Georgia, United States, subject to legal review and confirmation. The owner is currently under 18, so any engine licence or commercial agreement may require guardian involvement and a capacity review before it is relied upon. No attorney has reviewed this policy.

## 11. Related Documents

- [`../../Source/Engine/LICENSE`](/docs/places-left-behind/#source-only-files) — engine proprietary license (plain text)
- [`../../Source/Engine/LICENSE.md`](/docs/places-left-behind/#source-only-files) — engine proprietary license (Markdown)
- [`Contributors/Engine-Relicensing-Policy.md`](/docs/places-left-behind/engine-relicensing-policy) — relicensing and contribution rights
- [`Contributors/Contributor-License-Agreement.md`](/docs/places-left-behind/contributor-license-agreement) — draft CLA
- [`ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses) — dependency inventory
- [`Game-Licensing.md`](/docs/places-left-behind/game-licensing) — game intellectual property policy
- [`Project-Licensing.md`](/docs/places-left-behind/project-licensing) — project-wide licensing overview

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial engine licensing policy |
