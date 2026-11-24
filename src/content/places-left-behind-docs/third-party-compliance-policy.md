---
title: "Third-Party Dependency Compliance Policy"
version: "1.0"
docStatus: "Current"
summary: "How third-party software is selected, approved, tracked, and shipped"
sourceId: "PLB-LEG-019"
sourcePath: "Documentation/Licensing/ThirdParty/Third-Party-Compliance-Policy.md"
category: "third-party"
order: 10
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-019 |
| Version | 1.0 |
| Status | Current |
| Scope | How third-party software is selected, approved, tracked, and shipped |
| Applies to | Every dependency added to the engine, the game, or the tooling |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. Purpose

This policy makes dependency compliance a routine part of development rather than a scramble before release. It sets out what may be depended on, how a licence is verified, and what must happen when a dependency changes.

It covers software. Creative assets are covered by the [Asset Licensing Policy](/docs/places-left-behind/asset-licensing-policy).

## 2. Core Rules

1. **Every dependency has a verified licence before it is merged.** A package whose licence cannot be determined is not adopted.
2. **Do not treat a package's licence as covering native binaries it bundles.** Check the contents. The project's GLFW dependency is a managed package that ships zlib-licensed native code — a different licence from the package's MIT wrapper.
3. **Do not assume transitive dependencies are safe because the direct dependency is.** Read the resolved graph.
4. **Keep development-only dependencies out of the notice obligations for shipped builds**, and record why they are development-only.
5. **Never ship a build whose third-party notices are missing or out of date.**

## 3. What Is Acceptable

| Category | Position |
| --- | --- |
| MIT | Accepted. Keep the notice. |
| Apache License 2.0 | Accepted. Keep the notice, `NOTICE` file if provided, and any modification statements. |
| BSD 2-clause and 3-clause | Accepted. Keep the notice. |
| zlib | Accepted. Keep the notice. |
| ISC | Accepted. Keep the notice. |
| MS-PL | Acceptable with review; check patent language. |
| Public domain / CC0 for code | Acceptable, with the source documented |
| LGPL (dynamic linking) | Discouraged. Requires legal review and a plan for relinking and notices. Not currently used. |
| GPL, AGPL | Not acceptable in engine or game code. Would require releasing the project's source under the same licence. |
| Non-commercial licences | Not acceptable. The project intends commercial distribution. |
| No-derivatives licences for code | Not acceptable mechanically; review any that appear. |
| Source-available but not open-source licences (BUSL, SSPL, Commons Clause) | Not acceptable without review; usually incompatible with the project's plans. |
| Unlicensed code ("all rights reserved" with no grant) | Not acceptable. Absence of a licence means no permission. |
| Unknown or unverifiable licence | Not acceptable until resolved. Mark as Requires Verification and do not ship. |

## 4. Approval Workflow for a New Dependency

1. **Need.** Confirm the dependency is necessary and that the functionality is not already available in the project, the .NET base library, or an existing dependency.
2. **Licence.** Read the package's `<license>` or `<licenseUrl>` metadata and its licence file. Note the SPDX identifier.
3. **Contents.** Inspect the package for native libraries, bundled data, and fonts. Each may have its own licence.
4. **Transitives.** Resolve the graph and check each transitive package.
5. **Redistribution.** Decide whether the dependency ships with the game or is development-only, and record the reason.
6. **Record.** Add it to the [Third-Party Licenses inventory](/docs/places-left-behind/third-party-licenses) with all required fields.
7. **Notices.** If it ships, add the required notice text to [`../../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files).
8. **Version pin.** Add the version to `Directory.Packages.props`, which centralises package versions for the solution.
9. **Support and security.** Note whether the package is maintained, and whether it has known vulnerabilities.

## 5. Central Version Management

The project uses `Directory.Packages.props` with `ManagePackageVersionsCentrally` enabled. New package versions must be added there rather than in individual project files, so that the engine and game cannot drift onto different versions of the same package.

## 6. Separation of Engine and Game Dependencies

- The engine currently carries the graphics and windowing dependencies.
- The game references the engine project and adds no packages of its own.
- A dependency added for game-specific features should be evaluated against the engine's future licensing options: a game-only dependency cannot make the engine unlicensable, but an engine dependency can.

## 7. Development-Only Classification

A dependency is development-only if it is not copied to the publish output. Verify this by checking the publish output and `PlacesLeftBehind.deps.json`, not by assumption.

Currently development-only:

- `Microsoft.NET.ILLink.Tasks` — build-time trimming tooling.
- `glslc` — shader compiler invoked by MSBuild targets; only its `.spv` output ships.
- Blender, the .NET SDK, Git, and editors.

If any development-only tool is redistributed later, it becomes a shipped dependency and must be added to the notices.

## 8. Notice Maintenance

1. `THIRD-PARTY-NOTICES.txt` must list every redistributed component with its copyright holder and licence.
2. Standard licence texts must be reproduced verbatim. Do not paraphrase MIT, Apache, BSD, or zlib text.
3. Where a component's licence depends on a version, record the version.
4. The notices file should ship with every build and be reachable from the game's installation directory or its about screen.

## 9. Audits

| Trigger | Action |
| --- | --- |
| New dependency | Full approval workflow |
| Dependency upgrade | Re-verify licence; check for newly bundled native components; update version and notices |
| New distribution platform | Review that platform's third-party requirements |
| Before any release | Full audit and checklist run |
| Annually | Full audit even without changes |

Useful commands:

```bash
dotnet list package --include-transitive
dotnet nuget why <project> <package>
```

## 10. Security of Dependencies

1. Prefer maintained packages.
2. Check for known vulnerabilities before adopting a package, and periodically thereafter.
3. Do not adopt a package solely because it is convenient if it is unmaintained and security-sensitive.
4. Record a dependency's security status as part of the inventory notes.

## 11. When a Licence Cannot Be Verified

1. Do not ship the dependency.
2. Record it in the inventory marked **Requires Verification**.
3. State exactly what must be checked — for example "confirm the native binary's licence in the package's `runtimes/` folder" or "confirm the version of the tool installed on the build machine".
4. If the dependency is essential, find an alternative with a verified licence.

## 12. Current Open Verification Items

| Item | What must be checked |
| --- | --- |
| glslc version in the Vulkan SDK | Record the exact SDK version used to build, and its licence notices if the SDK is redistributed |
| Vulkan loader, if bundled later | Confirm its licence and notices before shipping it |
| Self-contained publishing | If adopted, add the .NET runtime and its notices |
| Microsoft packages' own third-party notices | Confirm whether any must be reproduced in the shipped game, if those assemblies remain in the build |

## 13. Related Documents

- [Third-Party-Licenses.md](/docs/places-left-behind/third-party-licenses) — the inventory
- [`../../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files) — notices
- [`../Compliance/Third-Party-Redistribution-Checklist.md`](/docs/places-left-behind/third-party-redistribution-checklist)
- [`../Compliance/Build-Packaging-Checklist.md`](/docs/places-left-behind/build-packaging-checklist)
- [`../Engine-Licensing.md`](/docs/places-left-behind/engine-licensing) — dependency implications for engine licensing

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial third-party compliance policy |
