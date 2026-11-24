---
title: "Build and Packaging Licensing Checklist"
version: "1.0"
docStatus: "Draft — not yet executed for any build"
summary: "Licensing checks to run when producing a distributable build"
sourceId: "PLB-LEG-033"
sourcePath: "Documentation/Licensing/Compliance/Build-Packaging-Checklist.md"
category: "compliance"
order: 10
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-033 |
| Version | 1.0 |
| Status | Draft — not yet executed for any build |
| Scope | Licensing checks to run when producing a distributable build |
| Applies to | Prototype, demo, and release builds |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not applicable — no build has been distributed |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Draft.** Nothing here has been run against a real distribution. It is the checklist to follow when the first one is prepared.

---

## 1. Before Building

- [ ] Confirm which licence and terms apply to the build: prototype terms or end-user terms.
- [ ] Confirm the terms are actually in force. Today they are drafts, so a build cannot yet be distributed lawfully under them.
- [ ] Confirm the legal review status of those terms.
- [ ] Confirm the dependency inventory is current: [`../ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses).
- [ ] Confirm the asset register is current: [`../Assets/Asset-Licensing-Register.md`](/docs/places-left-behind/asset-licensing-register).
- [ ] Confirm no new asset was added without an entry.

## 2. Dependency Check

- [ ] Run `dotnet list package --include-transitive` and compare the output with the inventory.
- [ ] Confirm every package's licence is still what the inventory records.
- [ ] Confirm no package is marked deprecated in a way that affects distribution.
- [ ] Confirm no development-only package has become a runtime dependency.
- [ ] Confirm no native library was added inside an existing package by an upgrade.

## 3. Build Configuration Check

Current project facts, to be re-verified each time:

- [ ] `TargetFramework` is `net10.0` and `RuntimeIdentifier` is the intended platform.
- [ ] Publishing is framework-dependent (`--self-contained false`), so the .NET runtime stays a prerequisite.
- [ ] If self-contained publishing is adopted, add the .NET runtime and its notices to `THIRD-PARTY-NOTICES.txt` before shipping.
- [ ] `PublishSingleFile=true` and `IncludeNativeLibrariesForSelfExtract=true` mean third-party assemblies are embedded; the notices must be shipped separately.
- [ ] Shader compilation targets ran: `clear.vert.spv` and `clear.frag.spv` exist in the output.
- [ ] `Configuration/game.settings.json` is present in the output.
- [ ] Debug symbols (`.pdb`) are **excluded** from a public build unless deliberately shipped.
- [ ] No source maps, internal documentation, or test scaffolding is included.

## 4. Output Directory Inspection

- [ ] List every file in the publish output.
- [ ] Identify each file as original, redistributed third-party, or output data.
- [ ] Confirm no development tool is present: no `glslc`, no SDK files, no ILLink.
- [ ] Confirm `glfw3.dll` (or the platform equivalent) is present and accounted for.
- [ ] Confirm no unexpected `.dll` appears that is missing from the inventory.
- [ ] Confirm no file contains a credential, token, or private key.
- [ ] Confirm no personal data, test save, or debug log is included.

## 5. Notices Check

- [ ] `THIRD-PARTY-NOTICES.txt` exists in the distribution.
- [ ] It lists every redistributed component at the correct version.
- [ ] The MIT and zlib texts are reproduced verbatim.
- [ ] The notices are reachable without running the game — a file beside the executable, or an about screen plus a file.
- [ ] Platform-specific notice requirements are met, if any.

Full procedure: [Third-Party-Redistribution-Checklist.md](/docs/places-left-behind/third-party-redistribution-checklist).

## 6. Terms and Presentation

- [ ] The applicable terms are included in the distribution or presented at first run.
- [ ] The terms version and date are visible.
- [ ] Prototype builds have an acceptance step that records acceptance.
- [ ] The terms do not reference documents that do not exist.
- [ ] The terms do not claim a legal entity, address, or registration that does not exist.

## 7. Build Identity

- [ ] A build identifier is visible in the game or documented with the download.
- [ ] The identifier maps to a specific commit.
- [ ] Prototype builds record the game version, so bug reports can be matched.
- [ ] If a build expires, the expiry behaviour is documented.

## 8. Prerequisites and Documentation

- [ ] .NET 10 runtime requirement stated.
- [ ] Vulkan-capable GPU and driver requirement stated.
- [ ] Supported operating system stated (currently Windows 11).
- [ ] Installation and uninstallation described.
- [ ] Save location described, once saving exists.

## 9. Attribution and Credits

- [ ] In-game credits exist, if any third-party creative asset requires attribution. None do today.
- [ ] Contributors credited, if any. There are none today.
- [ ] Fonts credited and their licences included, once fonts are added.

## 10. Sign-Off

| Check | Result | Date | By |
| --- | --- | --- | --- |
| Dependency inventory current | — | — | — |
| Asset register current | — | — | — |
| Notices included and correct | — | — | — |
| Terms in force | — | — | — |
| Build identity present | — | — | — |
| Prerequisites documented | — | — | — |
| No development tooling or symbols | — | — | — |
| Ready to distribute | — | — | — |

The build is not ready to distribute until every row is complete and the terms it relies on are actually in force.

## 11. Related Documents

- [Third-Party-Redistribution-Checklist.md](/docs/places-left-behind/third-party-redistribution-checklist)
- [Distribution-Compliance.md](/docs/places-left-behind/distribution-compliance)
- [`../ThirdParty/Third-Party-Compliance-Policy.md`](/docs/places-left-behind/third-party-compliance-policy)
- [`../../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files)
- [`../../../Scripts/Build.ps1`](/docs/places-left-behind/#source-only-files)
- [`../../../Scripts/Run.ps1`](/docs/places-left-behind/#source-only-files)

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial build and packaging licensing checklist |
