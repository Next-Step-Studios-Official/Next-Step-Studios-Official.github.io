---
title: "Asset Acquisition and Attribution Guidelines"
version: "1.0"
docStatus: "Current"
summary: "Practical steps for sourcing, verifying, and attributing creative assets"
sourceId: "PLB-LEG-022"
sourcePath: "Documentation/Licensing/Assets/Asset-Acquisition-Guidelines.md"
category: "assets"
order: 10
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-022 |
| Version | 1.0 |
| Status | Current |
| Scope | Practical steps for sourcing, verifying, and attributing creative assets |
| Applies to | Anyone adding a model, texture, material, audio file, music track, font, image, or UI asset |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. Purpose

These guidelines turn the [Asset Licensing Policy](/docs/places-left-behind/asset-licensing-policy) into a sequence of steps. They exist so an asset cannot enter the project without a right to use it.

## 2. Before Downloading

1. Decide whether the asset is really needed, or whether a similar asset already exists in `Assets/`.
2. Identify the licence at the source, before downloading. If the licence is not visible, do not proceed.
3. Check that the licence permits: commercial use, modification, and distribution inside a game.
4. Note the author name and the source URL.

## 3. Verifying a Licence

1. **Prefer the licence file in the download.** A page description can be outdated; the licence file that ships with the asset is stronger evidence.
2. **Identify the exact licence version.** "Creative Commons" is not enough; CC BY 4.0 and CC BY-SA 4.0 behave very differently.
3. **Check for extra terms.** Marketplace licences often add restrictions on resale, on use in templates, or on redistribution as a standalone file.
4. **Check whether the asset itself embeds third-party material.** A model may include textures from another source with a different licence.
5. **For fonts, check the embedding permission as well as the licence.** OFL permits embedding; some free font licences do not.
6. **For AI-generated assets, read the tool's terms** and record the tool and date. Do not assume the output is unrestricted.

## 4. Recording

Add a record to the [Asset Licensing Register](/docs/places-left-behind/asset-licensing-register) containing:

- name, type, creator, source URL, date obtained;
- licence name and SPDX identifier;
- attribution requirement, with the exact text to reproduce;
- modification and commercial-use permissions;
- local path;
- any conditions — for example "credit required in the credits screen";
- verification status.

## 5. Attribution Format

Where an attribution is required, use a consistent format so the credits can be assembled mechanically:

```text
<Asset name> by <Creator>
Source: <URL>
Licence: <Licence name> (<SPDX identifier>)
Changes: <none, or a short description>
```

Example of the pattern:

```text
Wooden crate by Example Artist
Source: https://example.org/asset/wooden-crate
Licence: Creative Commons Attribution 4.0 (CC-BY-4.0)
Changes: resized textures to 1024x1024, rebaked normals
```

Rules:

1. Reproduce the required attribution text exactly. Do not reword a legally required credit.
2. State changes where the licence asks for it — Creative Commons licences commonly require an indication of modifications.
3. Keep the attribution in one place in the register so the credits can be regenerated.
4. A credit is not a substitute for a licence; it is a condition of one.

## 6. Where Attribution Appears

1. **In-game credits** — the primary location for asset credits.
2. **An accompanying notices file** — for longer lists, shipped with the build.
3. **The register** — the internal source of truth.
4. **The website** — optional, and only if the studio chooses to publish credits there.

Third-party software attribution is handled separately by [`../../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files).

## 7. File Placement

| Asset | Location |
| --- | --- |
| Models, source | `Assets/Models/<Category>/` |
| Scene sources | `Assets/Scenes/Locations/<Location>/Source/` |
| Scene exports | `Assets/Scenes/Locations/<Location>/Export/` |
| Textures by object | `Assets/Textures/Objects/<Category>/<Object>/` |
| Shared tiling textures | `Assets/Textures/Shared/<Material>/` |
| Environment textures | `Assets/Textures/Environment/` |
| Materials | `Assets/Materials/` |
| Audio | `Assets/Audio/Ambience/`, `Music/`, `SoundEffects/`, `Voice/` |
| Fonts | `Assets/Fonts/`, with the licence file beside the font |
| UI | `Assets/UI/Icons/`, `Assets/UI/Images/` |
| Data | `Assets/Data/` |

Texture naming follows the project convention: `<Object>_BaseColor.png`, `<Object>_Normal.png`, and so on.

Licence text for an asset should live beside the asset, or in a `Licences` file in the same directory, when the licence requires it to accompany the work.

## 8. Paid Asset Licences

1. Keep the receipt or invoice, and the licence terms, with the asset record.
2. Record the purchaser, the date, and the order reference.
3. Check whether the licence is per-seat, per-project, or transferable.
4. Check whether it survives a change of studio name or a transfer of the project.
5. Do not share the purchased files publicly, including in a public repository.

## 9. Assets That Must Be Rejected

- No visible licence, or a licence that cannot be verified.
- NonCommercial or NoDerivatives terms.
- "Free for personal use only."
- Rip or extraction from another game or from a commercial product.
- Attribution that cannot reasonably be provided.
- Provenance that cannot be traced, including an untraceable file passed on from someone else.
- Material that identifies a real private individual without consent.

## 10. When in Doubt

1. Do not commit the asset.
2. Record it as **Requires Verification** with a note of what must be checked.
3. Prefer a CC0 alternative.
4. Ask before assuming. An unresolved licence is a reason to wait, not a reason to proceed.

## 11. Maintenance

1. When an asset is replaced, update its record rather than deleting it; keep a short note of the replacement.
2. When an asset is removed, mark it **Removed** and note whether it appeared in any distributed build.
3. Re-check the register before each build that ships assets, so the credits are complete.

## 12. Related Documents

- [Asset-Licensing-Policy.md](/docs/places-left-behind/asset-licensing-policy)
- [Asset-Licensing-Register.md](/docs/places-left-behind/asset-licensing-register)
- [`../ThirdParty/Third-Party-Compliance-Policy.md`](/docs/places-left-behind/third-party-compliance-policy)
- [`../../Development.md`](/docs/places-left-behind/development) — naming conventions

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial asset acquisition and attribution guidelines |
