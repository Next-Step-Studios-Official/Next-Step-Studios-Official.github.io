---
title: "External Contribution Guidelines"
version: "1.0"
docStatus: "Future Draft — the process described here is not active"
summary: "How external contributions would be proposed, reviewed, and accepted"
sourceId: "PLB-LEG-030"
sourcePath: "Documentation/Licensing/Contributors/External-Contribution-Guidelines.md"
category: "contributors"
order: 40
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-030 |
| Version | 1.0 |
| Status | Future Draft — the process described here is not active |
| Scope | How external contributions would be proposed, reviewed, and accepted |
| Applies to | External developers, artists, and writers who wish to contribute |
| Current position | Contributions are not accepted. See the [Contributor Policy](/docs/places-left-behind/contributor-policy). |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not applicable — the process is not active |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Future Draft.** Do not send unsolicited code or assets. The project does not accept contributions, has no CLA in force, and cannot use anything you send. These guidelines describe how a future process would work.

---

## 1. Current Status

- The repository is private.
- There is no public issue tracker for contributions.
- No contributor licence agreement has been executed.
- No review process exists.

Any material sent today creates no obligation on the owner, cannot be accepted, and should not be sent.

## 2. How a Future Process Would Work

1. **Discuss first.** Open a proposal describing what you want to change and why, before writing code.
2. **Get agreement in principle.** The owner confirms the change fits the project's direction.
3. **Accept the CLA.** Sign or click through the [Contributor License Agreement](/docs/places-left-behind/contributor-license-agreement) before submitting anything substantive.
4. **Submit a focused change.** One logical change per contribution, matching the project's conventions.
5. **Review.** The owner reviews for correctness, style, and licensing. Changes may be requested.
6. **Merge and record.** The contribution is recorded with the CLA version and date.

## 3. What Makes a Good Contribution

- Solves one clearly described problem.
- Includes the reasoning, not only the diff.
- Follows the existing architecture and naming.
- Keeps engine and game code separate.
- Adds no new dependency without prior agreement.
- Includes no third-party material unless properly licensed and declared.
- Is tested on the platforms the project supports.

## 4. What to Expect From Review

1. Review focuses on correctness, clarity, architecture, and licensing.
2. A contribution may be declined for reasons of direction rather than quality.
3. The owner may rewrite or adapt a contribution to fit the architecture.
4. Review may be slow. There is no service level.

## 5. Coding Conventions

The project's conventions are defined in [`../../Development.md`](/docs/places-left-behind/development):

- C# types, methods, and public properties use PascalCase.
- Private fields use `_camelCase`.
- Local variables use `camelCase`.
- Constants use PascalCase.
- Engine functionality stays in `Source/Engine/`; game-specific functionality stays in `Source/Game/`.
- Small, understandable systems are preferred over large monolithic classes.
- Unnecessary dependencies are avoided.

## 6. Commit Conventions

The project uses Conventional Commits, as described in [`../../Git-Conventions.md`](/docs/places-left-behind/git-conventions):

```text
type: description
```

Approved types: `feat`, `fix`, `refactor`, `docs`, `style`, `perf`, `test`, `build`, `chore`, `ci`.

Examples:

```text
feat: add depth buffer support
fix: correct swapchain recreation on resize
docs: document shader compilation targets
```

## 7. Asset Contributions

1. Art, audio, and writing are contributions too, and are covered by the CLA.
2. Every asset must come with its provenance: creator, source, licence, and any required attribution.
3. Third-party assets must have a licence permitting commercial use and modification.
4. Do not submit assets with unverifiable origins, non-commercial terms, or "free for personal use only" terms.
5. Follow the project's asset naming and directory conventions.

## 8. Dependency Contributions

1. Propose a dependency before using it.
2. State its licence and verify it from the package metadata, not from memory.
3. Check for native components inside the package; a managed package's licence may not cover them.
4. Accept that a dependency may be declined for licensing or maintenance reasons.

## 9. Security

1. Do not report a security issue in a public pull request.
2. Report it privately to the owner.
3. Do not include exploit code in a contribution.

## 10. Licensing Declarations Required

A contribution would need to state:

1. that the contributor accepts the CLA;
2. that the work is original, or identify third-party material and its licence;
3. that no conflicting employment or contract obligation applies;
4. that the contribution contains no malicious or undisclosed functionality.

## 11. Grounds for Rejection

- No CLA on record.
- Unclear or incompatible licensing.
- Copied code from another project.
- Changes that break the engine/game separation.
- Unrequested refactoring of unrelated code.
- Unrequested new dependencies.
- Harassment or unprofessional conduct in review.

## 12. Credits

Accepted contributors would be credited in the project's records and, where practical, in the game's credits. A contributor may ask to be credited under a preferred name or omitted.

## 13. Related Documents

- [Contributor-Policy.md](/docs/places-left-behind/contributor-policy)
- [Contributor-License-Agreement.md](/docs/places-left-behind/contributor-license-agreement)
- [Engine-Relicensing-Policy.md](/docs/places-left-behind/engine-relicensing-policy)
- [`../../Development.md`](/docs/places-left-behind/development)
- [`../../Git-Conventions.md`](/docs/places-left-behind/git-conventions)
- [`../ThirdParty/Third-Party-Compliance-Policy.md`](/docs/places-left-behind/third-party-compliance-policy)
- [`../Assets/Asset-Acquisition-Guidelines.md`](/docs/places-left-behind/asset-acquisition-guidelines)

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial future draft of the external contribution guidelines |
