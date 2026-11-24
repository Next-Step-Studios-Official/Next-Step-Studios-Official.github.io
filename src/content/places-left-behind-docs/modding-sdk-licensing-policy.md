---
title: "Modding SDK Licensing Policy"
version: "1.0"
docStatus: "Future Draft — Requires Legal Review"
summary: "Licensing of a future modding SDK, editor, and official modding tools"
sourceId: "PLB-LEG-027"
sourcePath: "Documentation/Licensing/Modding/Modding-SDK-Licensing-Policy.md"
category: "modding"
order: 50
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-027 |
| Version | 1.0 |
| Status | Future Draft — Requires Legal Review |
| Scope | Licensing of a future modding SDK, editor, and official modding tools |
| Applies to | Mod authors using official tools |
| Feature status | No SDK, editor, loader, or modding tool exists |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not applicable — no SDK exists |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Future Draft.** No modding SDK has been built or promised. This policy records the intended licensing position so that a future SDK does not accidentally grant rights in the engine or the game.

---

## 1. Purpose

A modding SDK is the most likely place for a licensing mistake: tools that expose game structures can look like a grant of source-code rights.

This policy separates four things that must stay separate:

1. the engine,
2. the game,
3. the SDK and tools,
4. the content a mod author creates with them.

## 2. Intended SDK Scope

If an SDK is built, it would be expected to include:

- documentation of supported modding interfaces;
- sample Mods and example content;
- a manifest schema and validation tool;
- asset export or conversion helpers;
- a local test harness for loading Mods;
- optionally, a limited scripting API surface.

It would **not** include:

- the engine's source code;
- the game's source code;
- the game's proprietary assets, other than clearly designated sample content;
- internal rendering or physics implementation details beyond what a Mod needs.

## 3. Licensing of the SDK Itself

The intended position:

1. The SDK is **proprietary software**, licensed for use in creating Mods for Places Left Behind.
2. The licence would be **free of charge**, unless a separate commercial arrangement is adopted.
3. The licence would permit use of the SDK to create, test, and distribute Mods, subject to the [Modding License](/docs/places-left-behind/modding-license).
4. It would **not** permit using the SDK or its components to build another game, engine, or tool.
5. It would **not** permit redistributing the SDK itself, in whole or in part.
6. It would **not** grant any rights in the engine or the game's source code.
7. It would **not** be an open-source licence, and the SDK would not be described as open source.

An alternative worth considering later is releasing the SDK under a permissive licence while keeping the engine and game proprietary. That decision is not made, and no licence is applied now.

## 4. What Mod Authors May Do With the SDK

Subject to the licence that would accompany it, a mod author would be able to:

1. install and use the SDK locally;
2. create Mods and distribute them under the [Mod Distribution Policy](/docs/places-left-behind/mod-distribution-policy);
3. include SDK-generated metadata and manifests in their Mods;
4. share screenshots and documentation of their use of the SDK;
5. write tutorials about the SDK.

A mod author would not be able to:

1. redistribute the SDK;
2. modify and redistribute the SDK;
3. use the SDK to create a competing tool or engine;
4. remove notices from the SDK;
5. present the SDK as their own work.

## 5. Sample Content

1. Sample content shipped with an SDK is intended as a learning aid.
2. Sample content should be licensed for use **inside Mods**, and should not be redistributed as a standalone asset pack.
3. Where sample content is intended to be freely reusable, that should be stated explicitly — for example under CC0 — rather than left ambiguous.
4. Sample content must not contain third-party material with restrictive terms, and any third-party content must be attributed.

## 6. Relationship to the Engine

1. The SDK is not a distribution of the engine.
2. The SDK may link against compiled engine assemblies, but this does not grant any licence to the engine's source code.
3. The engine's separate licensing position is stated in [`../Engine-Licensing.md`](/docs/places-left-behind/engine-licensing) and in [`../../../Source/Engine/LICENSE`](/docs/places-left-behind/#source-only-files).
4. A future open-source release of the engine would not automatically open-source the SDK, and vice versa. Each decision is independent.

## 7. Relationship to the Game

1. The SDK does not grant a licence to the game.
2. A user still needs a legitimate copy of the game to play Mods.
3. The SDK must not be usable to bypass ownership checks.

## 8. Third-Party Components in the SDK

If the SDK bundles third-party libraries:

1. each component's licence must be recorded in the [Third-Party Licenses inventory](/docs/places-left-behind/third-party-licenses);
2. notices must ship with the SDK;
3. no copyleft component may be included in a way that would require releasing the SDK's own source;
4. a separate notice file may be needed for the SDK, distinct from the game's.

## 9. Support and Changes

1. The SDK would be provided "as is", without warranty.
2. Interfaces may change between versions, including in incompatible ways.
3. No support commitment is made.
4. A version of the SDK may be withdrawn if it becomes unsafe or unmaintained.

## 10. Open Items

1. Whether the SDK will exist, and in what form.
2. Whether the SDK licence will be a click-through, a bundled text, or both.
3. Whether the SDK's documentation is licensed separately from the SDK itself. Documentation is currently proprietary project-wide, and that should continue unless a deliberate decision is made.
4. Whether sample content will be CC0, proprietary-but-reusable, or reference-only.
5. Whether a scripting API will be exposed, and its licensing.
6. Legal review of the SDK licence before release.
7. Confirmation of the intended jurisdiction, Georgia, United States.

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial future draft of the modding SDK licensing policy |

## Related Documents

- [Modding-License.md](/docs/places-left-behind/modding-license)
- [Modder-Guidelines.md](/docs/places-left-behind/modder-guidelines)
- [Mod-Distribution-Policy.md](/docs/places-left-behind/mod-distribution-policy)
- [`../Engine-Licensing.md`](/docs/places-left-behind/engine-licensing)
- [`../ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses)
- [`../Project-Licensing.md`](/docs/places-left-behind/project-licensing)
