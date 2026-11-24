---
title: "Modder Guidelines"
version: "1.0"
docStatus: "Future Draft"
summary: "Practical guidance for creating modifications for Places Left Behind"
sourceId: "PLB-LEG-026"
sourcePath: "Documentation/Licensing/Modding/Modder-Guidelines.md"
category: "modding"
order: 30
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-026 |
| Version | 1.0 |
| Status | Future Draft |
| Scope | Practical guidance for creating modifications for Places Left Behind |
| Applies to | Mod authors |
| Feature status | No modding support exists. There is no loader, API, SDK, or editor. |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not applicable — modding is not supported |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Future Draft.** These guidelines describe how modding is intended to work once it exists. The game currently has no modding support, no asset loading pipeline for custom content, and no scripting layer. Nothing here is a description of existing capability.

---

## 1. What Modding Is Intended to Cover

The planned modding scope, in rough order of likely support:

| Content | Intended support | Notes |
| --- | --- | --- |
| Custom maps and locations | Planned | Requires the world loading pipeline, which is not implemented |
| Custom models and textures | Planned | Requires glTF/GLB loading, which is not implemented |
| Custom materials | Planned | Requires the material system |
| Custom audio and music | Planned | Requires the audio system |
| Documents and written content | Planned | Requires the document system |
| Gameplay changes | Under consideration | Would need a scripting or data-driven layer |
| Interface changes | Under consideration | Would need a UI system |
| Engine-level changes | Not planned | The engine is proprietary and not moddable |

## 2. Before You Start

1. There is nothing to mod yet. Wait for an official announcement that modding is supported.
2. Do not patch or modify the executable. A Mod that edits the binary will be unsupported and may be blocked.
3. Do not extract and redistribute the game's assets. Reference them instead.
4. Read the [Modding License](/docs/places-left-behind/modding-license) and the [Mod Distribution Policy](/docs/places-left-behind/mod-distribution-policy) before creating anything you intend to share.

## 3. Working With the Tools

When official tools are published:

1. Use the official versions. Modified or repackaged tools are not supported and their output may not load.
2. Keep your project files. Publish the built Mod, and your source alongside it if you choose.
3. Follow the tool's export settings. A wrong setting is the most common cause of a Mod that will not load.
4. Keep a clean, minimal Mod first — one room, one prop — before building something large.

## 4. Assets and Content

1. **Models:** use glTF 2.0 / GLB, the project's interchange format. Keep scale consistent with the game's world units.
2. **Textures:** follow the project's map naming — `BaseColor`, `Normal`, `Roughness`, `Metallic`, `AO`, `Emissive`, and optional `Height`. Reuse shared textures rather than duplicating them.
3. **Materials:** define them through the supported mechanism rather than relying on exported Blender node trees, which may not translate.
4. **Audio:** state the format and sample rate the game requires once the audio system exists. Avoid clipping and excessive loudness.
5. **Fonts:** if your Mod includes a font, include its licence and confirm it permits embedding and redistribution.
6. **Writing:** do not copy text from other sources without permission. Do not use real people's names or private information.

## 5. Performance

1. Keep geometry and texture sizes proportionate to what the location needs.
2. Avoid excessive draw calls in a single room; the renderer is still being developed and is not optimised for very large scenes.
3. Test on modest hardware, not only on the most powerful machine available.
4. Report performance problems with your Mod as Mod issues, not as base-game defects.

## 6. Compatibility

1. State the game version your Mod targets.
2. Declare dependencies explicitly, with version ranges.
3. Handle a missing dependency gracefully — a clear message, not a crash.
4. Keep a changelog so users know when to update.
5. Expect breakage after game updates. Update your Mod, or mark it incompatible.

## 7. Packaging

1. Include a manifest with name, id, version, author, target version, dependencies, licence, and credits.
2. Do not include game files.
3. Do not include files the Mod does not need.
4. Keep the package small enough to download comfortably, and avoid re-downloading unchanged content where the platform supports deltas.
5. Include a short README describing installation and known issues.

## 8. Safety

1. No code that contacts a remote server without the user's knowledge.
2. No installers that write outside the game's data directories.
3. No obfuscated binaries. If your Mod ships compiled code, it must be inspectable.
4. No bundled third-party downloaders, adware, or "offers".
5. No attempt to bypass licence checks or build identification.
6. Report a security concern in your own Mod or in another Mod to the studio privately.

## 9. Conduct and Credit

1. Credit everyone whose work you build on, including other Mod authors.
2. Ask before using another author's assets or code, even when their licence seems permissive.
3. Do not re-upload another author's Mod to another site without permission.
4. Do not present your Mod as official, or as endorsed, unless the studio has said so in writing.
5. Do not use the game's or studio's names as your Mod's branding in a confusing way.

## 10. Getting Help and Reporting Problems

1. Use the community space the studio designates, once one exists.
2. Report a base-game bug to the studio, and a Mod bug to the Mod's author.
3. Include the game version, Mod version, and steps to reproduce.
4. Do not post private download links or unreleased content in public spaces.

## 11. Monetisation

Free distribution is the default. See section 8 of the [Mod Distribution Policy](/docs/places-left-behind/mod-distribution-policy) before charging for anything.

## 12. What Is Not Supported

- Modifying the engine.
- Patching the game executable.
- Redistributing game assets.
- Bypassing ownership checks.
- Online or multiplayer Mods, because there is no online or multiplayer feature.
- Mods that require a service the studio does not operate.

## 13. Open Items

These are unresolved because the systems do not exist:

1. The scripting or data format for gameplay Mods.
2. The manifest schema and loader behaviour.
3. Supported texture formats and size limits.
4. Whether custom shaders will be allowed, and under what constraints.
5. Whether Mods can add new mechanics or only new content.
6. How Mods will be identified in crash reports and save files.

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial future draft of the modder guidelines |

## Related Documents

- [Modding-License.md](/docs/places-left-behind/modding-license)
- [Mod-Distribution-Policy.md](/docs/places-left-behind/mod-distribution-policy)
- [Modding-SDK-Licensing-Policy.md](/docs/places-left-behind/modding-sdk-licensing-policy)
- [Community-Content-Policy.md](/docs/places-left-behind/community-content-policy)
- [`../Assets/Asset-Acquisition-Guidelines.md`](/docs/places-left-behind/asset-acquisition-guidelines)
