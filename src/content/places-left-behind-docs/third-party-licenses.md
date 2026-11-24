---
title: "Third-Party Licenses Inventory"
version: "1.0"
docStatus: "Current — with items marked Requires Verification"
summary: "Every third-party software component and dependency in the repository"
sourceId: "PLB-LEG-018"
sourcePath: "Documentation/Licensing/ThirdParty/Third-Party-Licenses.md"
category: "third-party"
order: 20
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-018 |
| Version | 1.0 |
| Status | Current — with items marked Requires Verification |
| Scope | Every third-party software component and dependency in the repository |
| Audit basis | `Directory.Packages.props`, both `.csproj` files, resolved NuGet assets, package nuspec metadata, package license files, published runtime output |
| Audit date | 2026-11-24 |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | 2026-11-24 (describes the current dependency set) |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

---

## 1. How This Inventory Was Produced

1. Read the central package versions in `Directory.Packages.props`.
2. Read the direct references in `Source/Engine/PlacesLeftBehind.Engine.csproj` and `Source/Game/PlacesLeftBehind.Game.csproj`.
3. Read the resolved dependency graph from `Source/Engine/obj/project.assets.json` and `Source/Game/obj/project.assets.json`, which include transitive packages.
4. Read each package's `.nuspec` `<license>` declaration and, where present, its license file, from the local NuGet cache.
5. Read the published runtime library list from `Source/Game/bin/Debug/net10.0/PlacesLeftBehind.deps.json`.
6. Inspected package contents for native libraries.

Licenses below are stated only where they were read from the package or its declared metadata. Nothing in this inventory is inferred from the package's name or from memory.

## 2. Direct Dependencies

Declared in `Directory.Packages.props` and referenced by `Source/Engine/PlacesLeftBehind.Engine.csproj` (and therefore transitively by the game).

| Package | Version | License | SPDX | Redistributed |
| --- | --- | --- | --- | --- |
| Silk.NET.Vulkan | 2.23.0 | MIT | MIT | Yes — managed assembly |
| Silk.NET.Vulkan.Extensions.KHR | 2.23.0 | MIT | MIT | Yes — managed assembly |
| Silk.NET.Windowing | 2.23.0 | MIT | MIT | No — meta-package, no assembly |
| Silk.NET.Windowing.Glfw | 2.23.0 | MIT | MIT | Yes — managed assembly |
| Silk.NET.Input | 2.23.0 | MIT | MIT | No — meta-package, no assembly |
| Silk.NET.Input.Glfw | 2.23.0 | MIT | MIT | Yes — managed assembly |

## 3. Transitive Dependencies

| Package | Version | License | SPDX | Redistributed |
| --- | --- | --- | --- | --- |
| Silk.NET.Core | 2.23.0 | MIT | MIT | Yes — managed assembly |
| Silk.NET.GLFW | 2.23.0 | MIT | MIT | Yes — managed assembly |
| Silk.NET.Input.Common | 2.23.0 | MIT | MIT | Yes — managed assembly |
| Silk.NET.Maths | 2.23.0 | MIT | MIT | Yes — managed assembly |
| Silk.NET.Windowing.Common | 2.23.0 | MIT | MIT | Yes — managed assembly |
| Ultz.Native.GLFW | 3.4.0 | zlib License | Zlib | Yes — native `glfw3.dll` (Windows x64) |
| Microsoft.DotNet.PlatformAbstractions | 3.1.6 | MIT | MIT | Yes — managed assembly |
| Microsoft.Extensions.DependencyModel | 9.0.9 | MIT | MIT | Yes — managed assembly |
| Microsoft.NET.ILLink.Tasks | 10.0.15 | MIT | MIT | No — build-time only |

## 4. Detailed Records

### 4.1 Silk.NET package family

| Field | Value |
| --- | --- |
| Name | Silk.NET (12 packages listed in sections 2 and 3) |
| Exact versions | 2.23.0 (all) |
| Copyright holder | .NET Foundation and Contributors |
| License | MIT License |
| SPDX identifier | MIT |
| Official project URL | <https://github.com/dotnet/Silk.NET> |
| Official license URL | <https://github.com/dotnet/Silk.NET/blob/main/LICENSE.md> |
| Package license declaration | `<license type="expression">MIT</license>` in every package nuspec |
| Commercial use | Permitted |
| Redistribution | Permitted, including in binary form |
| Modification | Permitted |
| Sublicensing | Permitted |
| Attribution requirement | Copyright notice and permission notice must be included in all copies or substantial portions |
| Required notices | The MIT text with "Copyright (c) .NET Foundation and Contributors" |
| Special restrictions | None beyond the notice requirement. No copyleft. No field-of-use restriction. |
| Included in final game | Yes, for the assemblies listed as redistributed |
| Verification status | **Verified** from nuspec metadata and the project's license file |
| Notes | `Silk.NET.Windowing` and `Silk.NET.Input` contain no assemblies; they are meta-packages that pull in the `.Common` and `.Glfw` implementations. The MIT licence on these bindings does not extend to Places Left Behind's own engine code. |

### 4.2 GLFW native library

| Field | Value |
| --- | --- |
| Name | GLFW, shipped through the `Ultz.Native.GLFW` package |
| Exact version | GLFW 3.4, package version 3.4.0 |
| Copyright holder | Copyright (c) 2002-2006 Marcus Geelnard; Copyright (c) 2006-2019 Camilla Löwy |
| License | zlib License |
| SPDX identifier | Zlib |
| Official project URL | <https://github.com/glfw/glfw> |
| Official license URL | <https://github.com/glfw/glfw/blob/3.4/LICENSE.md> |
| Package license declaration | `<license type="expression">Zlib</license>` |
| Commercial use | Permitted |
| Redistribution | Permitted, including in binary form |
| Modification | Permitted, if altered versions are plainly marked |
| Attribution requirement | The origin must not be misrepresented; the notice may not be removed from a source distribution. Acknowledgement in documentation is appreciated but not required. |
| Required notices | The zlib text with both copyright lines, reproduced in `THIRD-PARTY-NOTICES.txt` |
| Special restrictions | Altered source versions must be marked as altered and must not be presented as the original |
| Included in final game | Yes — `glfw3.dll` on Windows x64. Linux and macOS binaries are present in the package and would ship if those platforms are targeted. |
| Verification status | **Verified** from nuspec metadata and the upstream license file |
| Notes | The binaries are unmodified pre-built GLFW 3.4. The package is published by the Silk.NET project but contains upstream GLFW code, so the GLFW licence — not the Silk.NET MIT licence — governs these files. |

### 4.3 Microsoft.DotNet.PlatformAbstractions

| Field | Value |
| --- | --- |
| Name | Microsoft.DotNet.PlatformAbstractions |
| Exact version | 3.1.6 |
| Copyright holder | .NET Foundation and Contributors (package metadata records "© Microsoft Corporation. All rights reserved.") |
| License | MIT License |
| SPDX identifier | MIT |
| Official project URL | <https://dotnet.microsoft.com/> |
| Official license URL | The package's own `LICENSE.TXT` (MIT); NuGet gallery entry for the package |
| Package license declaration | `<license type="file">LICENSE.TXT</license>` |
| Commercial use | Permitted |
| Redistribution | Permitted |
| Modification | Permitted |
| Attribution requirement | Copyright notice and permission notice must accompany copies |
| Required notices | MIT text, reproduced in `THIRD-PARTY-NOTICES.txt` |
| Special restrictions | The package is marked deprecated upstream, which affects support but not licensing |
| Included in final game | Yes — managed assembly |
| Verification status | **Verified** from the package's `LICENSE.TXT` |
| Notes | Pulled in transitively by Silk.NET.Core. Its `THIRD-PARTY-NOTICES.TXT` contains additional informational notices for its own dependencies. |

### 4.4 Microsoft.Extensions.DependencyModel

| Field | Value |
| --- | --- |
| Name | Microsoft.Extensions.DependencyModel |
| Exact version | 9.0.9 |
| Copyright holder | .NET Foundation and Contributors (package metadata records "© Microsoft Corporation. All rights reserved.") |
| License | MIT License |
| SPDX identifier | MIT |
| Official project URL | <https://dotnet.microsoft.com/> |
| Official license URL | <https://licenses.nuget.org/MIT> |
| Package license declaration | `<license type="expression">MIT</license>` |
| Commercial use | Permitted |
| Redistribution | Permitted |
| Modification | Permitted |
| Attribution requirement | Copyright notice and permission notice must accompany copies |
| Required notices | MIT text, reproduced in `THIRD-PARTY-NOTICES.txt` |
| Special restrictions | None |
| Included in final game | Yes — managed assembly |
| Verification status | **Verified** from the package's `LICENSE.TXT` and nuspec |

### 4.5 Microsoft.NET.ILLink.Tasks

| Field | Value |
| --- | --- |
| Name | Microsoft.NET.ILLink.Tasks |
| Exact version | 10.0.15 |
| Copyright holder | .NET Foundation and Contributors (package metadata records "© Microsoft Corporation. All rights reserved.") |
| License | MIT License |
| SPDX identifier | MIT |
| Official project URL | <https://dotnet.microsoft.com/> |
| Official license URL | <https://licenses.nuget.org/MIT> |
| Package license declaration | `<license type="expression">MIT</license>` |
| Commercial use | Permitted |
| Redistribution | Not applicable — not redistributed |
| Modification | Not applicable |
| Attribution requirement | None for the shipped game, because nothing from this package is copied to output |
| Required notices | None required for the shipped game |
| Special restrictions | None |
| Included in final game | No — build-time trimming tooling supplied through the SDK |
| Verification status | **Verified** from nuspec and by confirming it is absent from `PlacesLeftBehind.deps.json` and the output directory |

### 4.6 .NET 10 runtime (Microsoft.NETCore.App)

| Field | Value |
| --- | --- |
| Name | .NET 10 runtime |
| Exact version | 10.0.x, targeted as `net10.0` in `Directory.Build.props` |
| Copyright holder | .NET Foundation and Contributors |
| License | MIT License |
| SPDX identifier | MIT |
| Official project URL | <https://github.com/dotnet/runtime> |
| Official license URL | <https://github.com/dotnet/runtime/blob/main/LICENSE.TXT> |
| Commercial use | Permitted |
| Redistribution | Permitted under the MIT licence if a self-contained build is used |
| Modification | Permitted |
| Attribution requirement | MIT notice, if redistributed |
| Required notices | None today, because it is not redistributed |
| Special restrictions | None |
| Included in final game | No — builds are framework-dependent (`--self-contained false`), so the runtime is a prerequisite |
| Verification status | **Verified** as a prerequisite from the publish configuration in `Scripts/Run.ps1` and from `PlacesLeftBehind.runtimeconfig.json` |
| Action if changed | If self-contained publishing is adopted, add the runtime and its third-party notices to `THIRD-PARTY-NOTICES.txt` |

## 5. Build and Development Tools

These are not redistributed with the game.

| Tool | License | SPDX | Purpose | Verification |
| --- | --- | --- | --- | --- |
| glslc (Google Shaderc, in the Vulkan SDK) | Apache License 2.0 | Apache-2.0 | Compiles GLSL to SPIR-V in the `CompileShadersAfterBuild` and `CompileShadersAfterPublish` targets | **Verified** from the Shaderc project (Apache-2.0). Exact version in the installed SDK: **Requires Verification** |
| Vulkan SDK (LunarG) | Multiple licences; the SDK is a distribution of several components | Mixed | Provides `glslc` and Vulkan headers/tools | **Requires Verification** if a specific version must be documented |
| Blender | GNU General Public License | GPL-2.0-or-later (Blender's own terms) | Authoring `TestMap.blend` and exporting `TestMap.glb` | **Verified** as a tool. Blender is not redistributed, and its licence does not extend to models created with it. |
| .NET SDK 10 | MIT | MIT | Build toolchain | **Verified** as a tool |
| Visual Studio Code | Microsoft licence | — | Editor | Not redistributed |
| Git | GPL-2.0 | GPL-2.0 | Version control | Not redistributed |
| Python (used during this audit) | PSF licence | PSF-2.0 | Audit scripts only | Not a project dependency |

Note: Blender's GPL applies to Blender itself. Exporting a `.glb` from original geometry does not make the exported model GPL-licensed, and no Blender code is included in the game.

## 6. Runtime Graphics Components Not Bundled

| Component | Status | Licence status |
| --- | --- | --- |
| Vulkan loader (`vulkan-1.dll`) | Not present in this repository or in the build output | **Requires Verification.** If a build begins shipping the loader, its licence (Apache-2.0 for the Khronos/LunarG loader) and its notices must be confirmed and added |
| Vulkan graphics driver | Supplied by the GPU vendor through the operating system | Not redistributed. Governed by the vendor's terms |
| Windows system libraries | Supplied by the operating system | Not redistributed |

Silk.NET.Vulkan provides managed bindings only. It does not ship the Vulkan loader, and it does not change the loader's licensing.

## 7. Findings Summary

| Finding | Detail |
| --- | --- |
| Total NuGet packages resolved | 16 including the project reference; 15 third-party packages |
| Copyleft components | None |
| Non-commercial or no-derivatives components | None |
| Components with unknown licence | None among the resolved NuGet packages |
| Components requiring notices in a shipped build | Silk.NET assemblies, GLFW `glfw3.dll`, and the two Microsoft assemblies — all MIT or zlib, all satisfied by `THIRD-PARTY-NOTICES.txt` |
| Potential incompatibility with commercial distribution | None identified |
| Potential incompatibility with a future open-source engine release under MIT, Apache 2.0, or BSD | None identified — MIT and zlib are compatible with all three |
| Items marked Requires Verification | glslc/SDK version, Vulkan loader if bundled, whether a self-contained publish is used |

## 8. Compatibility Assessment for Future Engine Licensing

If the engine were released under MIT, Apache 2.0, or a BSD licence:

- Silk.NET (MIT) may be redistributed with the engine, provided notices are retained.
- GLFW (zlib) may be redistributed with the engine, provided notices are retained and any altered version is marked.
- Microsoft assemblies (MIT) may be redistributed with notices retained.
- No dependency would prevent an open-source release, and none would force the release of the engine's own source under a copyleft licence.

## 9. Maintenance Rules

1. Update this inventory whenever a package is added, removed, or upgraded.
2. Verify the licence from the package metadata each time; do not carry a previous assumption forward.
3. Check native assets inside a package, not just its managed assemblies. A managed package's licence does not automatically cover native binaries it bundles — the GLFW case is exactly this situation.
4. Keep `THIRD-PARTY-NOTICES.txt` synchronised with the redistributed set.
5. Run the [Third-Party Redistribution Checklist](/docs/places-left-behind/third-party-redistribution-checklist) before every distribution.

## 10. Related Documents

- [`../../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files) — required notices
- [Third-Party-Compliance-Policy.md](/docs/places-left-behind/third-party-compliance-policy) — approval and audit process
- [`../Compliance/Third-Party-Redistribution-Checklist.md`](/docs/places-left-behind/third-party-redistribution-checklist)
- [`../Compliance/Build-Packaging-Checklist.md`](/docs/places-left-behind/build-packaging-checklist)
- [`../Assets/Asset-Licensing-Register.md`](/docs/places-left-behind/asset-licensing-register) — creative assets, which are tracked separately

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial audit of all resolved dependencies |
