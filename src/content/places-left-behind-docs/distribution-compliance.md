---
title: "Game Distribution Compliance Policy"
version: "1.0"
docStatus: "Draft — process not yet exercised"
summary: "Compliance requirements that apply to any distribution of Places Left Behind"
sourceId: "PLB-LEG-032"
sourcePath: "Documentation/Licensing/Compliance/Distribution-Compliance.md"
category: "compliance"
order: 20
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-032 |
| Version | 1.0 |
| Status | Draft — process not yet exercised |
| Scope | Compliance requirements that apply to any distribution of Places Left Behind |
| Applies to | Prototype builds, demos, and released builds on any platform |
| Current position | Nothing has been distributed |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not applicable — no build has been distributed |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Draft.** No build has been distributed, so none of these steps has been performed. This policy defines what "ready to distribute" would mean.

---

## 1. Purpose

Distribution is where licensing obligations become real: notices must ship, terms must be presented, prerequisites must be stated, and platform rules must be honoured.

This policy lists those obligations in one place and defines when a build may leave the studio.

## 2. The Three Categories of Software

Every file in a build falls into one of three categories, and each is treated differently.

| Category | Examples | Obligation |
| --- | --- | --- |
| Original project software | `PlacesLeftBehind.exe`, engine assemblies, compiled shaders, game content | Covered by the project's proprietary licence. No third-party notice. |
| Redistributed third-party software | Silk.NET assemblies, `glfw3.dll`, Microsoft assemblies | Must carry the notices in `THIRD-PARTY-NOTICES.txt`. |
| Development-only software | `glslc`, ILLink, Blender, the SDK | Not redistributed. Must not appear in the build. |

A build that mixes these up — for example by shipping a development tool, or by omitting a notice for a shipped library — is not compliant.

## 3. Current Build Facts

Verified from the repository:

| Fact | Current state |
| --- | --- |
| Runtime | .NET 10, framework-dependent (`--self-contained false`) |
| Target platform | Windows 11, `win-x64` |
| Publish mode | Single file with native libraries extracted (`PublishSingleFile=true`, `IncludeNativeLibrariesForSelfExtract=true`) |
| Shader compilation | `glslc` runs as an MSBuild target; the compiler is not redistributed, only `.spv` output |
| Configuration | `Configuration/game.settings.json` is copied to output |
| Redistributed native library | `glfw3.dll` from `Ultz.Native.GLFW` |
| Vulkan loader | Not bundled; supplied by the system or GPU driver |
| Save data | None written; no save system |

Consequences:

1. The .NET runtime is a **prerequisite**, and the download page must say so.
2. A Vulkan-capable GPU and driver is a **prerequisite**.
3. Notices must accompany the single-file executable, because the third-party assemblies are embedded inside it and are not separately visible.
4. Because the executable is a single file, the notices cannot rely on a visible `Silk.NET.*.dll` sitting next to it.

## 4. Required Items in Every Distribution

1. **Third-party notices.** `THIRD-PARTY-NOTICES.txt`, shipped beside the executable or reachable from an in-game about screen.
2. **End-user terms or prototype terms.** Whichever applies, presented before or at first use.
3. **Prerequisites.** .NET 10 runtime, a Vulkan-capable GPU and driver, and the supported operating system.
4. **Version identification.** A build identifier visible in the game or in the file name.
5. **Attribution for any third-party creative asset**, if one is ever added.
6. **A contact route** for support and for rights complaints.
7. **No development tooling.** No `glslc`, no debug symbols, no source maps, no internal documentation.

## 5. Platform Obligations

Each distribution channel adds its own requirements, which must be reviewed before signing up. Typical items:

- accurate store description that does not claim unimplemented features;
- age rating questionnaire and resulting rating;
- privacy disclosures consistent with the actual build;
- refund policy alignment;
- controller, achievement, and cloud-save expectations;
- accessibility disclosures where required by the platform or by local law.

None of these has been completed, and no platform has been selected.

## 6. Windows-Specific Considerations

1. **Code signing.** Unsigned executables trigger SmartScreen warnings. Whether a certificate will be obtained is undecided; without one, the warning is expected and should be explained on the download page.
2. **Installer behaviour.** If an installer is used, it must not install unrelated software and must allow a clean uninstall.
3. **Antivirus false positives.** A new unsigned single-file executable may be flagged. Keep a submission process in mind if it happens.
4. **Save location.** Saves should go to the user's application-data directory, not the installation folder, which may be protected. Not yet implemented.

## 7. Possible Linux and macOS Distribution

Both are potential future targets, not current ones.

| Item | Consideration |
| --- | --- |
| Graphics | Vulkan must be available; the loader is supplied by the system, and availability varies |
| Windowing | GLFW binaries for Linux and macOS are present in the dependency package and would ship if those platforms are targeted |
| Packaging | Flatpak, AppImage, or a tarball each have their own conventions for notices and for file placement |
| Notices | Must ship in the package, readable without running the game |
| macOS specifics | Notarisation and signing would be required for ordinary distribution; not currently planned |

Any Linux or macOS build would need its own checklist pass, because the redistributed native libraries differ by platform.

## 8. Installer and Launcher

1. An installer must present the end-user terms before installation completes, or make them available immediately after.
2. An installer must include the third-party notices in the installed directory.
3. If a launcher is introduced, it must be described in the launcher terms, which do not yet exist. See [`../Future/Launcher-Terms.md`](/docs/places-left-behind/launcher-terms).
4. A launcher that collects data would require a privacy policy update before release.

## 9. Updates and Patches

An update is a distribution and must satisfy the same requirements. In particular:

1. Re-run the third-party redistribution checklist if any dependency changed.
2. Update the notices if a component was added, removed, or upgraded.
3. State any save-compatibility impact.
4. Present changed terms if the end-user terms were revised.

## 10. Prototype Distribution

Prototype builds have additional requirements:

1. The prototype terms, with an acceptance step.
2. A build identifier, so reports can be matched.
3. A clear statement that the build is incomplete.
4. A feedback channel.
5. The same third-party notices as a release.

See [`../Prototype/Prototype-Distribution-Policy.md`](/docs/places-left-behind/prototype-distribution-policy).

## 11. Records to Keep Per Distribution

- the version and build identifier distributed;
- the date and channel;
- the commit the build came from;
- confirmation that notices were included;
- the terms version presented;
- any platform-specific filings;
- who received access, for prototype builds.

## 12. Release Gate

A build may be distributed only when:

1. the [Build and Packaging Licensing Checklist](/docs/places-left-behind/build-packaging-checklist) is complete;
2. the [Third-Party Redistribution Checklist](/docs/places-left-behind/third-party-redistribution-checklist) is complete;
3. the applicable terms are in force — which today they are not;
4. the applicable legal review is complete.

## 13. Open Items

1. Whether an installer will be used, and what it will be built with.
2. Whether code signing will be obtained.
3. Which platform will be used for the first distribution.
4. Whether Linux or macOS support is intended.
5. How notices will be surfaced in a single-file build.
6. Whether an in-game about screen will exist.
7. Legal review of the terms before any distribution.

## 14. Related Documents

- [Build-Packaging-Checklist.md](/docs/places-left-behind/build-packaging-checklist)
- [Third-Party-Redistribution-Checklist.md](/docs/places-left-behind/third-party-redistribution-checklist)
- [`../ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses)
- [`../Commercial/EULA-Draft.md`](/docs/places-left-behind/eula-draft)
- [`../Prototype/Prototype-Distribution-Policy.md`](/docs/places-left-behind/prototype-distribution-policy)
- [`../../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files)

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial distribution compliance policy |
