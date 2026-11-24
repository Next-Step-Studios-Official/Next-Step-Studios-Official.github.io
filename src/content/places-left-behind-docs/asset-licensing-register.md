---
title: "Asset Licensing Register"
version: "1.0"
docStatus: "Current — with items marked Requires Verification"
summary: "Every creative asset in the repository, original and third-party"
sourceId: "PLB-LEG-021"
sourcePath: "Documentation/Licensing/Assets/Asset-Licensing-Register.md"
category: "assets"
order: 30
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-021 |
| Version | 1.0 |
| Status | Current — with items marked Requires Verification |
| Scope | Every creative asset in the repository, original and third-party |
| Verified against | Repository contents at 2026-11-24 |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. How to Use This Register

Every asset gets a record. Only what can be verified from the repository is recorded here; nothing is assumed.

Fields recorded per asset:

- Name and type
- Creator
- Source (URL, or "authored in-house")
- Licence and SPDX identifier
- Version or date obtained
- Attribution required
- Modification permitted
- Commercial use permitted
- Local path
- Conditions or restrictions
- Verification status

Statuses used: **Verified**, **Requires Verification**, **Not acquired**, **In use**, **Removed**.

## 2. Summary

| # | Asset | Type | Provenance | Licence | Status |
| --- | --- | --- | --- | --- | --- |
| A-01 | TestMap | 3D scene, Blender source | Original | Proprietary | Verified, in use |
| A-02 | TestMap.glb | 3D scene, glTF/GLB export | Original | Proprietary | Verified, in use |
| A-03 | clear.vert | Shader source | Original | Proprietary | Verified, in use |
| A-04 | clear.frag | Shader source | Original | Proprietary | Verified, in use |
| F-01 | IBM Plex Sans | Font | Not present | Intended: SIL OFL 1.1 | Not acquired |
| F-02 | Source Serif 4 | Font | Not present | Intended: SIL OFL 1.1 | Not acquired |
| F-03 | DM Serif Display | Font | Not present | Intended: SIL OFL 1.1 | Not acquired |
| F-04 | Special Elite | Font | Not present | Requires Verification | Not acquired |

No third-party models, textures, audio, music, images, or interface assets are present in the repository.

## 3. Original Assets

### A-01 — TestMap (Blender source)

| Field | Value |
| --- | --- |
| Name | TestMap |
| Type | 3D scene, Blender source file |
| Creator | Candler Shaw |
| Source | Authored in-house in Blender |
| Licence | Proprietary — project licence |
| SPDX identifier | LicenseRef-Proprietary (no SPDX identifier exists for this work) |
| Version | Not versioned separately; tracked with the repository |
| Attribution required | No |
| Modification permitted | Yes, by the copyright owner |
| Commercial use | Yes, by the copyright owner; not permitted to third parties |
| Local path | `Assets/Scenes/Locations/TestMap/Source/TestMap.blend` |
| Conditions | Not to be distributed as a source asset. Not covered by Blender's GPL. |
| Status | Verified, in use |

### A-02 — TestMap.glb (export)

| Field | Value |
| --- | --- |
| Name | TestMap |
| Type | 3D scene, glTF 2.0 binary export |
| Creator | Candler Shaw |
| Source | Exported from A-01 |
| Licence | Proprietary — project licence |
| SPDX identifier | LicenseRef-Proprietary |
| Version | Not versioned separately |
| Attribution required | No |
| Modification permitted | Yes, by the copyright owner |
| Commercial use | Yes, by the copyright owner |
| Local path | `Assets/Scenes/Locations/TestMap/Export/TestMap.glb` |
| Conditions | Exported for world-loading development. World loading is not yet implemented, so this asset is not yet used by the runtime. |
| Status | Verified, present |

### A-03 — clear.vert

| Field | Value |
| --- | --- |
| Name | clear vertex shader |
| Type | Shader source (GLSL) |
| Creator | Candler Shaw |
| Source | Authored in-house |
| Licence | Proprietary — project licence |
| SPDX identifier | LicenseRef-Proprietary |
| Version | Not versioned separately |
| Attribution required | No |
| Modification permitted | Yes, by the copyright owner |
| Commercial use | Yes |
| Local path | `Assets/Shaders/clear.vert` |
| Conditions | Compiled to SPIR-V by `glslc` during build. Compiled output is derived from this source and carries the same ownership. |
| Status | Verified, in use |

### A-04 — clear.frag

| Field | Value |
| --- | --- |
| Name | clear fragment shader |
| Type | Shader source (GLSL) |
| Creator | Candler Shaw |
| Source | Authored in-house |
| Licence | Proprietary — project licence |
| SPDX identifier | LicenseRef-Proprietary |
| Version | Not versioned separately |
| Attribution required | No |
| Modification permitted | Yes, by the copyright owner |
| Commercial use | Yes |
| Local path | `Assets/Shaders/clear.frag` |
| Conditions | As A-03. |
| Status | Verified, in use |

### Noted build artifacts

- `triangle.vert.spv` and `triangle.frag.spv` exist only in build output directories under `Source/Game/bin/`. No matching shader source was found in `Assets/Shaders/` at the time of this audit. These are derived build artifacts and are excluded from version control. **Requires Verification** if any scene still depends on them: confirm whether their source exists and should be tracked.

## 4. Fonts

`Assets/Fonts/README.md` recommends four font families and instructs the developer to download them from their official Google Fonts pages. **No font files are present.** The register records them so that the licence is captured before any file is added.

Font files are not to be downloaded as part of this licensing task.

### F-01 — IBM Plex Sans

| Field | Value |
| --- | --- |
| Name | IBM Plex Sans |
| Type | Font family |
| Creator | IBM |
| Source | <https://fonts.google.com/specimen/IBM+Plex+Sans> |
| Licence | Intended: SIL Open Font License 1.1 — **must be confirmed when the files are obtained** |
| SPDX identifier | OFL-1.1 (expected) |
| Attribution required | OFL requires the copyright notice and licence to accompany the font |
| Modification permitted | Yes, with OFL conditions, including reserved font names |
| Commercial use | Permitted under the OFL |
| Local path | `Assets/Fonts/` (not yet populated) |
| Conditions | Keep the OFL text next to the files. Renaming requires OFL reserved-name compliance. |
| Status | Not acquired — Requires Verification on download |

### F-02 — Source Serif 4

| Field | Value |
| --- | --- |
| Name | Source Serif 4 |
| Type | Font family |
| Creator | Adobe |
| Source | <https://fonts.google.com/specimen/Source+Serif+4> |
| Licence | Intended: SIL Open Font License 1.1 — **must be confirmed when the files are obtained** |
| SPDX identifier | OFL-1.1 (expected) |
| Attribution required | OFL notice and licence |
| Modification permitted | Yes, with OFL conditions |
| Commercial use | Permitted under the OFL |
| Local path | `Assets/Fonts/` (not yet populated) |
| Conditions | As F-01. |
| Status | Not acquired — Requires Verification on download |

### F-03 — DM Serif Display

| Field | Value |
| --- | --- |
| Name | DM Serif Display |
| Type | Font family |
| Creator | Colophon Foundry / Google |
| Source | <https://fonts.google.com/specimen/DM+Serif+Display> |
| Licence | Intended: SIL Open Font License 1.1 — **must be confirmed when the files are obtained** |
| SPDX identifier | OFL-1.1 (expected) |
| Attribution required | OFL notice and licence |
| Modification permitted | Yes, with OFL conditions |
| Commercial use | Permitted under the OFL |
| Local path | `Assets/Fonts/` (not yet populated) |
| Conditions | As F-01. |
| Status | Not acquired — Requires Verification on download |

### F-04 — Special Elite

| Field | Value |
| --- | --- |
| Name | Special Elite |
| Type | Font family |
| Creator | Astigmatic |
| Source | <https://fonts.google.com/specimen/Special+Elite> |
| Licence | **Requires Verification.** Do not assume a licence. Read the licence shown on the font's own page and include its text with the files. |
| SPDX identifier | To be recorded on verification |
| Attribution required | To be recorded on verification |
| Modification permitted | To be recorded on verification |
| Commercial use | To be recorded on verification; must be confirmed before shipping |
| Local path | `Assets/Fonts/` (not yet populated) |
| Conditions | Intended for short typewritten accents only. |
| Status | Not acquired — Requires Verification |

## 5. Third-Party Assets Not Permitted in This Register

Third-party software, including `glfw3.dll`, is not a creative asset and is recorded in the [Third-Party Licenses inventory](/docs/places-left-behind/third-party-licenses).

Compiled build output, IDE state, and generated files are not assets and are not registered.

## 6. Rules for Adding Entries

1. Add the entry before committing the asset.
2. Record the URL, author, and date obtained.
3. Reproduce the licence name exactly, and record the SPDX identifier where one exists.
4. State whether attribution is required, and copy the required attribution text into the record.
5. Mark anything unconfirmed as **Requires Verification** and do not ship it.
6. Keep the licence file in the repository next to the asset where the licence requires it.

## 7. Audit Notes

- Every file under `Assets/` was listed during this audit. Apart from the four assets above and `.gitkeep` placeholders, the directories are empty.
- `Assets/Fonts/README.md` is project documentation, not an asset, and is covered by the project licence.
- No image, audio, or model file with an unknown origin was found.

## 8. Related Documents

- [Asset-Licensing-Policy.md](/docs/places-left-behind/asset-licensing-policy)
- [Asset-Acquisition-Guidelines.md](/docs/places-left-behind/asset-acquisition-guidelines)
- [`../ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses)
- [`../../../Assets/Fonts/README.md`](/docs/places-left-behind/#source-only-files)

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial register, created from a full audit of `Assets/` |
