---
title: "Third-Party Redistribution Checklist"
version: "1.0"
docStatus: "Draft — not yet executed for any distribution"
summary: "Verifying that every redistributed third-party component is compliant"
sourceId: "PLB-LEG-034"
sourcePath: "Documentation/Licensing/Compliance/Third-Party-Redistribution-Checklist.md"
category: "compliance"
order: 30
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-034 |
| Version | 1.0 |
| Status | Draft — not yet executed for any distribution |
| Scope | Verifying that every redistributed third-party component is compliant |
| Applies to | Every distributable build, and every engine release if one occurs |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not applicable — no distribution has occurred |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Draft.** This checklist has not been run against a real distribution. It exists so that the first distribution is checked rather than assumed.

---

## 1. Principle

Redistribution obligations attach to each component individually. A build is compliant only if **every** redistributed component is compliant, not if the build as a whole looks acceptable.

Two mistakes this checklist is designed to catch:

1. Treating a managed package's licence as covering native binaries that package bundles. The project's GLFW dependency is exactly this case: it arrives through a Silk.NET-published NuGet package but contains zlib-licensed GLFW code.
2. Treating a development tool as if it were redistributed, or failing to notice that a runtime dependency has appeared.

## 2. Step 1 — Enumerate What Actually Ships

- [ ] Produce a distribution build.
- [ ] List every file in the output, including files embedded in a single-file executable.
- [ ] For a single-file publish, record that the embedded assemblies are still redistributed components and are still covered by their notices.
- [ ] Classify each file: original project file, redistributed third-party file, or generated data.
- [ ] Write the list down and keep it with the build record.

To enumerate an embedded single-file build, inspect `PlacesLeftBehind.deps.json` and the publish output before the single-file step, or extract the bundle.

## 3. Step 2 — Verify Each Component

For every redistributed component:

- [ ] Name and exact version recorded.
- [ ] Licence verified from the package metadata or licence file — not from memory.
- [ ] SPDX identifier recorded.
- [ ] Copyright holder recorded.
- [ ] Notice text present in `THIRD-PARTY-NOTICES.txt`.
- [ ] If the component bundles native code, the native code's licence is separately verified.
- [ ] No component has a licence that forbids commercial distribution.
- [ ] No component has a licence that would require the project's source to be disclosed.

Use the inventory as the reference: [`../ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses).

## 4. Step 3 — Current Component Set

The expected set for a Windows x64 build, as of the inventory date:

| Component | Version | Licence | Notice location |
| --- | --- | --- | --- |
| Silk.NET.Core | 2.23.0 | MIT | `THIRD-PARTY-NOTICES.txt` §1.1 |
| Silk.NET.GLFW | 2.23.0 | MIT | §1.1 |
| Silk.NET.Input.Common | 2.23.0 | MIT | §1.1 |
| Silk.NET.Input.Glfw | 2.23.0 | MIT | §1.1 |
| Silk.NET.Maths | 2.23.0 | MIT | §1.1 |
| Silk.NET.Vulkan | 2.23.0 | MIT | §1.1 |
| Silk.NET.Vulkan.Extensions.KHR | 2.23.0 | MIT | §1.1 |
| Silk.NET.Windowing.Common | 2.23.0 | MIT | §1.1 |
| Silk.NET.Windowing.Glfw | 2.23.0 | MIT | §1.1 |
| Ultz.Native.GLFW (`glfw3.dll`) | 3.4.0 | zlib | §1.2 |
| Microsoft.DotNet.PlatformAbstractions | 3.1.6 | MIT | §1.3 |
| Microsoft.Extensions.DependencyModel | 9.0.9 | MIT | §1.4 |

If the build contains a component not on this list, stop and update the inventory and notices before shipping.

## 5. Step 4 — Notice Accuracy

- [ ] The MIT text is verbatim, including the copyright line.
- [ ] The zlib text is verbatim, including both copyright lines and all three numbered conditions.
- [ ] No licence text has been paraphrased, shortened, or reformatted in a way that changes it.
- [ ] Version numbers in the notices match the shipped versions.
- [ ] The notices do not list components that are not shipped.
- [ ] The notices do not omit components that are shipped.

## 6. Step 5 — Notice Accessibility

- [ ] The notices ship as a file in the installed directory, or are displayed in an about screen **and** available as a file.
- [ ] The notices can be read without launching the game, where the licence requires the notice to accompany the distribution.
- [ ] If the game is distributed as a single file, the notices are not hidden inside it.
- [ ] A platform-specific notice page is provided if the platform requires one.

## 7. Step 6 — Development-Only Components

- [ ] `glslc` is not shipped.
- [ ] `Microsoft.NET.ILLink.Tasks` is not shipped.
- [ ] The .NET SDK is not shipped.
- [ ] Blender is not shipped.
- [ ] No build tool, script, or internal documentation is shipped.
- [ ] If any of the above changed, the inventory has been updated to reflect it.

## 8. Step 7 — Native and System Components

- [ ] The Vulkan loader is not bundled. If it ever is, its licence and notices have been verified and added.
- [ ] No GPU driver file is bundled.
- [ ] No Windows system library is redistributed.
- [ ] Platform-specific native libraries match the target platform.
- [ ] No unused platform binaries are shipped unnecessarily.

## 9. Step 8 — Fonts and Creative Assets

- [ ] Every bundled font has a verified licence and its licence file ships with it.
- [ ] OFL fonts are embedded in accordance with the OFL's terms, including reserved font names.
- [ ] Every bundled third-party asset has a register entry and the required attribution.
- [ ] No asset with an unverified licence is included.

Currently no fonts or third-party creative assets are present, so this step should be marked "not applicable" until one is added.

## 10. Step 9 — Record

- [ ] The completed checklist is stored with the build record.
- [ ] The distribution date, channel, and build identifier are recorded.
- [ ] Any deviation from this checklist is documented and justified.

## 11. Failure Handling

If a check fails:

1. Do not distribute the build.
2. Fix the cause — add the notice, remove the component, or resolve the licence.
3. Re-run the affected checks, then the full checklist.
4. Record what failed and what changed.

Removing a notice to make a build "pass" is not a fix. Neither is shipping a component whose licence has not been verified.

## 12. Related Documents

- [Build-Packaging-Checklist.md](/docs/places-left-behind/build-packaging-checklist)
- [Distribution-Compliance.md](/docs/places-left-behind/distribution-compliance)
- [`../ThirdParty/Third-Party-Licenses.md`](/docs/places-left-behind/third-party-licenses)
- [`../ThirdParty/Third-Party-Compliance-Policy.md`](/docs/places-left-behind/third-party-compliance-policy)
- [`../../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files)
- [`../Assets/Asset-Licensing-Register.md`](/docs/places-left-behind/asset-licensing-register)

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial third-party redistribution checklist |
