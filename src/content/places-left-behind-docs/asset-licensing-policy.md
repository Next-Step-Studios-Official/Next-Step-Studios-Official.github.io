---
title: "Asset Licensing Policy"
version: "1.0"
docStatus: "Current"
summary: "Every creative asset used in Places Left Behind"
sourceId: "PLB-LEG-020"
sourcePath: "Documentation/Licensing/Assets/Asset-Licensing-Policy.md"
category: "assets"
order: 20
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-020 |
| Version | 1.0 |
| Status | Current |
| Scope | Every creative asset used in Places Left Behind |
| Applies to | `Assets/` and any asset added later, including models, textures, audio, fonts, and writing |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. Purpose

All original creative content in Places Left Behind is proprietary. Any asset the project did not create needs a documented right to use it, in a form that survives commercial distribution.

This policy sets the standards for acquiring, recording, and using creative assets. The per-asset record lives in the [Asset Licensing Register](/docs/places-left-behind/asset-licensing-register).

## 2. Asset Types Covered

- 3D models and scenes (`.blend`, `.glb`, `.gltf`, `.fbx`)
- Textures and texture maps (base colour, normal, roughness, metallic, ambient occlusion, emissive, height)
- Materials and material definitions
- Audio: ambience, sound effects, voice
- Music
- Fonts and typefaces
- Images, photographs, and reference imagery
- User-interface assets: icons, frames, document backgrounds
- Animations and rigs
- Writing: documents, notes, letters, item descriptions, location histories
- Game data files that embed creative content

## 3. Default Position

1. **Original assets are proprietary.** Models, textures, materials, audio, music, writing, interface artwork, and animations created for the game are owned by Candler Shaw and are not open source.
2. **An asset's own licence always governs third-party assets.** Nothing in the project licence overrides a third-party asset licence, and nothing in a third-party asset licence gives rights in the project's original assets.
3. **Every external asset must have a register entry before it is committed.** No asset without a recorded licence.
4. **No asset may be committed whose licence is unknown, unverifiable, or incompatible with commercial distribution.**

## 4. Preferred Licences

| Asset type | Preferred | Acceptable with care |
| --- | --- | --- |
| 3D models | CC0 | CC-BY with manageable attribution; a paid asset licence permitting commercial use |
| Textures | CC0 | CC-BY with manageable attribution |
| Materials | CC0 | CC-BY |
| Audio and sound effects | CC0 | CC-BY; royalty-free paid licences permitting commercial use |
| Music | CC0 | CC-BY; a paid licence with documented commercial terms |
| Fonts | SIL Open Font License 1.1 | Apache License 2.0; a paid font licence permitting embedding and distribution |
| Images and reference | CC0 | CC-BY |
| UI assets | CC0 | CC-BY |
| Animations | CC0 | CC-BY |
| Software dependencies | Permissive: MIT, Apache 2.0, BSD, zlib | See the third-party policy |

## 5. Licences to Avoid

| Licence feature | Why it is avoided |
| --- | --- |
| NonCommercial (NC) | The game is intended for commercial distribution. NC terms would prohibit sale. |
| NoDerivatives (ND) | The project must be able to edit, remap, resize, and integrate assets. |
| ShareAlike on assets intended for a proprietary game | Would require releasing derivative assets under the same licence, undermining the asset's proprietary status. |
| Unclear or absent ownership | No documented right means no right to use. |
| Unverifiable licence | Cannot be relied on. |
| "Free for personal use only" | Incompatible with commercial distribution. |
| Educational or evaluation-only licences | Incompatible with distribution. |
| Licences that forbid use in games, or that cap revenue | Incompatible with the project's plans. |
| Marketplace licences that forbid redistribution as a standalone file | Often acceptable *inside* a game, but must be read carefully; some forbid use in a game where the asset is the main value. |

## 6. Attribution

1. If a licence requires attribution, the attribution must appear where users can reasonably find it — in the credits, an in-game about screen, or an accompanying notices file.
2. Attribution text must be reproduced as the licence requires; do not shorten a required attribution.
3. Keep the attribution in the register so the credits can be generated and checked.
4. Attribution does not transfer ownership. A credited asset remains the creator's work.

## 7. Fonts

Fonts need particular care because they are embedded in builds.

1. Use SIL Open Font License 1.1 fonts where possible. The OFL permits embedding in software and commercial distribution, with conditions on naming and on redistributing modified versions.
2. Keep the font's licence file next to the font files in `Assets/Fonts/`.
3. Do not rename or modify an OFL font without following the OFL's reserved-font-name rules.
4. Do not assume a font found online is free. Check the foundry's or platform's terms.
5. Record the exact font file, version, source, and licence in the register.

## 8. Audio and Music

1. Record whether a licence covers music, ambience, effects, and voice separately.
2. Paid royalty-free licences often restrict use in broadcast, monetised video, or resale; check and record the terms.
3. Keep proof of purchase for paid licences.
4. Do not assume a track found on a video platform is usable.

## 9. Generated and AI-Assisted Assets

Do not assume that an asset generated with a tool is unrestricted.

1. The tool's own terms govern what may be done with its output, and those terms change over time. Record the tool, its version or date, and the applicable terms.
2. A generated asset may reproduce material owned by others, or may not be protectable by copyright. Both affect the project.
3. Generated assets must still have a register entry, marked as generated, with the tool recorded.
4. Where the tool's terms are unclear about commercial use, treat the asset as **Requires Verification** and do not ship it until resolved.
5. Generated assets must not be used to imitate a living artist's style in a way the project cannot defend.

## 10. Writing and Narrative

Writing created for the game is owned by the project.

1. Do not copy text from other sources into game documents without permission.
2. Quotations from third-party works require a documented basis — public domain, a licence, or a defensible fair use assessment.
3. Real people, real businesses, and real addresses must not be used in a way that identifies or defames them.
4. Historical material about real places must be checked for accuracy and for rights in any photographs or documents reproduced.

## 11. Storage and Provenance

1. Keep the source file where a source exists: `Assets/Scenes/<Location>/Source/` for Blender files and `Assets/Scenes/<Location>/Export/` for exported `.glb`.
2. Export settings should be documented where they matter to appearance or performance.
3. Keep the licence text alongside the asset when a register entry references it.
4. Do not rely on a memory of where an asset came from; record the URL, the author, and the date obtained.

## 12. Removal and Replacement

If an asset's licence turns out to be unsuitable:

1. Remove it from the build and from the repository.
2. Remove or replace references in scenes and materials.
3. Update the register with the removal.
4. Note whether the asset appeared in any distributed build, which may require a notice correction.

## 13. Verification

- No external asset has been added at the time of writing.
- `TestMap.blend` and `TestMap.glb` are original project assets authored in Blender.
- `clear.vert` and `clear.frag` are original project shaders.
- The four recommended fonts have not been downloaded; no font files are present.

## 14. Related Documents

- [Asset-Licensing-Register.md](/docs/places-left-behind/asset-licensing-register) — per-asset records
- [Asset-Acquisition-Guidelines.md](/docs/places-left-behind/asset-acquisition-guidelines) — how to source and verify
- [`../ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses) — software dependencies
- [`../Game-Licensing.md`](/docs/places-left-behind/game-licensing) — game intellectual property
- [`../../../Assets/Fonts/README.md`](/docs/places-left-behind/#source-only-files) — font recommendations

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial asset licensing policy |
