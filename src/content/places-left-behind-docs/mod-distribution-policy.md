---
title: "Mod Distribution Policy"
version: "1.0"
docStatus: "Future Draft — Requires Legal Review"
summary: "Where and how modifications for Places Left Behind may be distributed"
sourceId: "PLB-LEG-025"
sourcePath: "Documentation/Licensing/Modding/Mod-Distribution-Policy.md"
category: "modding"
order: 20
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-025 |
| Version | 1.0 |
| Status | Future Draft — Requires Legal Review |
| Scope | Where and how modifications for Places Left Behind may be distributed |
| Applies to | Mod authors, hosting platforms, and users |
| Feature status | No official mod channel, workshop, or loader exists |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not applicable — no distribution system exists |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Future Draft.** Nothing here is in force. This policy is prepared so that a mod distribution channel, if built, starts with clear rules rather than being retrofitted.

---

## 1. Purpose

This policy sets out how Mods may be distributed: what channels are allowed, what a Mod package must contain, what must never be included, and how removal works.

It works alongside the [Modding License](/docs/places-left-behind/modding-license), which grants the underlying permission to create and share Mods.

## 2. Distribution Channels

| Channel | Status | Notes |
| --- | --- | --- |
| Official channel operated by the studio | Planned, does not exist | Subject to submission rules in section 5 |
| Independent mod hosting sites | Permitted, subject to this policy | The author is responsible for the site's rules |
| File-sharing links posted by the author | Permitted, subject to this policy | Prefer a stable, moderated host |
| Bundling a Mod inside a paid product | Not permitted without written consent | See section 8 |
| Redistribution of another author's Mod | Not permitted without that author's permission | Includes re-uploads to other sites |

## 3. What a Mod Package May Contain

- Original content created by the Mod author.
- Content the author has a documented right to include, with its attribution.
- Code, scripts, and data created by the author.
- References to Game Assets that the Game already provides, rather than copies of them.
- A manifest or metadata file describing the Mod.

## 4. What a Mod Package Must Not Contain

1. Copies of the Game's original assets — models, textures, materials, audio, music, writing, or documents.
2. The Game executable, data files, or any build of the Game.
3. Files that allow the Game to run without a legitimate copy.
4. Third-party assets without a licence permitting inclusion.
5. Malware, downloaders, telemetry, or code that contacts a server without the user's knowledge.
6. Code that modifies system settings, registry entries, or files outside the Game's own data directories.
7. Another author's Mod, unless that author has given permission.
8. Real personal data about any individual.

A Mod that requires the Game to supply an asset should reference it through the supported mechanism, not ship a copy.

## 5. Submission Requirements for an Official Channel

If an official channel is built, a submission would need:

1. **Metadata:** name, author, version, target Game version, dependencies, and a short description.
2. **Clear description:** what the Mod changes, and any known incompatibilities.
3. **Licence statement:** the author's own terms for their original work, which must not conflict with the [Modding License](/docs/places-left-behind/modding-license).
4. **Attribution list:** every third-party asset included, with its licence.
5. **No prohibited content:** confirmed by the author.
6. **Functional check:** the Mod loads without crashing the Game, and degrades gracefully when a dependency is missing.
7. **Acceptance of the submission terms**, if a formal submission agreement is adopted. The draft is in [`../Future/Community-Submission-Terms.md`](/docs/places-left-behind/community-submission-terms).

## 6. Metadata Standard

A manifest should include at least:

```text
name            Human-readable Mod name
id              Stable, unique identifier
version         Mod version
author          Author name or handle
game_version    Game version targeted, or a range
dependencies    List of required Mods and versions
description     Short summary
licence         The author's terms for their original work
credits         Third-party assets and their licences
```

The exact format would be defined with the modding tools. This is a proposal, not an existing schema.

## 7. Review and Moderation

1. An official channel would review submissions for prohibited content before publication.
2. Review is not a guarantee of quality or safety, and does not mean the studio endorses the Mod.
3. The studio may remove a published Mod if a problem is found later.
4. Review capacity may be limited, and the studio may decline submissions without giving a detailed reason.
5. Appeals should be possible where a removal or refusal is disputed.

## 8. Paid Mods and Monetisation

1. Free distribution is the default.
2. Selling a Mod, paywalling it, or bundling it into a paid product requires prior written permission.
3. Donations through a platform's normal mechanism are acceptable where the platform's rules allow it.
4. Advertising wrapped around a download page is the host's business, not the studio's, but a Mod page must not imply studio endorsement.
5. If a paid modding programme is ever introduced, it would need its own terms, published before it starts.

## 9. Removal and Takedown

The studio may remove a Mod from an official channel when:

1. it contains prohibited content;
2. it infringes a third party's rights;
3. it is unsafe, malicious, or harmful to users;
4. it breaches the [Modding License](/docs/places-left-behind/modding-license) or this policy;
5. a credible infringement claim is received, handled under the draft [Copyright and Takedown Policy](/docs/places-left-behind/copyright-and-takedown);
6. the author asks for it to be removed.

Removal from an official channel does not remove copies elsewhere, which the studio does not control.

## 10. Version Compatibility

1. A Mod should state the Game version it targets.
2. After a Game update, a Mod may break. The author is responsible for updating it or marking it incompatible.
3. The studio may mark Mods as incompatible with the current version but is not obliged to test them.
4. The studio may preserve an older Game branch for Mod compatibility, but makes no commitment to do so.

## 11. User Safety

1. Users install Mods at their own risk.
2. The Game should warn when Mods are active, and should identify which Mods are loaded.
3. A crash report from a modified installation should record that Mods were present, so support can distinguish a base-game defect from a Mod issue.
4. The studio may decline support for modified installations.

## 12. Platform and Legal Considerations

1. A hosting platform's own terms apply in addition to this policy.
2. Different jurisdictions treat modding, reverse engineering, and user-generated content differently. Before an official channel launches, the intended jurisdiction — Georgia, United States — should be confirmed, and the treatment of Mods reviewed.
3. Any requirement to operate a notice-and-takedown process should be assessed with a lawyer.

## 13. Open Items

1. Whether an official channel will exist at all, or whether distribution stays entirely third-party.
2. The manifest format and the loader's behaviour.
3. The review process and who performs it.
4. Whether submissions need a signed or click-through agreement.
5. Whether paid Mods will ever be permitted.
6. How version compatibility is expressed and enforced.
7. Legal review of the removal and takedown provisions.

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial future draft of the mod distribution policy |

## Related Documents

- [Modding-License.md](/docs/places-left-behind/modding-license)
- [Community-Content-Policy.md](/docs/places-left-behind/community-content-policy)
- [Modder-Guidelines.md](/docs/places-left-behind/modder-guidelines)
- [Modding-SDK-Licensing-Policy.md](/docs/places-left-behind/modding-sdk-licensing-policy)
- [`../Future/Community-Submission-Terms.md`](/docs/places-left-behind/community-submission-terms)
- [`../Future/Copyright-and-Takedown.md`](/docs/places-left-behind/copyright-and-takedown)
