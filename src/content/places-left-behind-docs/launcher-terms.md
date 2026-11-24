---
title: "Future Launcher Terms"
version: "1.0"
docStatus: "Future Draft — Requires Legal Review"
summary: "Terms for a launcher, updater, or installer helper for Places Left Behind"
sourceId: "PLB-LEG-039"
sourcePath: "Documentation/Licensing/Future/Launcher-Terms.md"
category: "future"
order: 60
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-039 |
| Version | 1.0 |
| Status | Future Draft — Requires Legal Review |
| Scope | Terms for a launcher, updater, or installer helper for Places Left Behind |
| Applies to | Users of a launcher, if one is built |
| Feature status | No launcher exists. The game is currently run directly as an executable. |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not applicable — no launcher exists |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Future Draft.** No launcher, updater, or installer application exists. This document describes intended terms for software that has not been built.

---

## 1. Purpose

A launcher would sit between the user and the game: delivering updates, checking prerequisites, and possibly hosting news or mod management.

That position gives it access to the user's system and data in ways the game itself does not need. This draft states what a launcher may and may not do.

## 2. What a Launcher Would Be For

Possible functions:

- downloading and installing the game;
- delivering updates and patches;
- verifying installed files;
- checking for required runtime components;
- showing patch notes and announcements;
- optionally, managing Mods.

Not intended:

- installing unrelated software;
- advertising;
- collecting data beyond what update delivery requires;
- modifying system settings unrelated to installation.

## 3. Licence to Use the Launcher

The launcher would be proprietary software, licensed for use in installing, updating, and launching Places Left Behind.

The licence would not permit:

1. redistributing the launcher;
2. modifying or reverse engineering it, except where the law permits;
3. using it to install or distribute anything other than the game;
4. circumventing update integrity checks;
5. using the launcher to deliver modified or unauthorized builds.

## 4. Installation and System Changes

1. The launcher would install the game into a directory the user chooses or confirms.
2. It would write its own configuration to a documented location.
3. It would not add files to system directories, change registry keys unrelated to uninstallation, or install background services without clear disclosure.
4. Any startup entry it creates would be optional and reversible.
5. Uninstallation would be available and would remove the launcher and, at the user's choice, its data.

## 5. Updates

1. Updates would be downloaded from the studio's servers or the distribution platform.
2. The launcher would verify the integrity of downloaded files.
3. An update might be required to keep playing, and that requirement would be disclosed.
4. The launcher should warn before an update that breaks save compatibility.
5. The user should be able to defer a non-critical update.

See the [Game Updates and Patches Policy](/docs/places-left-behind/game-updates-policy).

## 6. Data Handling

If a launcher is built, the minimum data it would need:

| Data | Purpose | Retention |
| --- | --- | --- |
| Installed version | Determine whether an update is needed | Until uninstall |
| Install path | Locate files to update | Until uninstall |
| Update logs | Diagnose failures | Short, local |
| IP address (server side) | Deliver a download; standard server logging | Short |

The launcher would **not** collect gameplay data, browsing data, or hardware inventories beyond what a compatibility check requires, and any such check would be disclosed.

Any data collection would require the [Game Privacy Policy](/docs/places-left-behind/game-privacy-policy-draft) to be updated before the launcher shipped.

## 7. Optional Telemetry

Telemetry is **not planned**. If it were added, it would require:

1. clear disclosure before collection;
2. an opt-in, not a default-on setting;
3. a published description of what is collected;
4. an easy way to turn it off;
5. no collection of personal content.

## 8. Mod Management

If the launcher manages Mods, it would:

1. install only Mods the user selects;
2. show the author and version of each Mod;
3. allow the user to disable or remove Mods;
4. not install a Mod silently;
5. follow the [Mod Distribution Policy](/docs/places-left-behind/mod-distribution-policy).

## 9. Third-Party Components

A launcher would bundle third-party software, including an HTTP client, an archive library, or update framework components. Each would need:

- a verified licence recorded in the [Third-Party Licenses inventory](/docs/places-left-behind/third-party-licenses);
- notices shipped with the launcher;
- no copyleft component that would require disclosing the launcher's source.

No launcher dependency has been selected.

## 10. Security

1. Downloads would be verified against a published checksum or signature.
2. The launcher would use HTTPS for all downloads and update metadata.
3. The launcher would not execute unsigned code obtained from an untrusted source.
4. A compromise of the update channel would be a serious incident and would be handled as such, with disclosure to users.

## 11. No Warranty and Liability

The launcher would be provided "as is", without warranty. Liability would be limited to the maximum extent permitted by law. A failed update is a foreseeable risk and should be handled by keeping a rollback path where practical.

## 12. Relationship to Other Documents

1. The launcher would not replace the end-user licence for the game.
2. Where the launcher's terms and the game's terms conflict, the game's terms would govern the game and the launcher's terms would govern the launcher.
3. Users would be shown both, or told where to find them.

## 13. Legal Review Requirements

1. Whether a separate launcher licence is needed, or whether it can be incorporated into the game's terms.
2. Data protection obligations for update logging.
3. Whether a bundled update framework's licence permits the intended distribution.
4. Consumer law obligations for automatic updates.
5. Confirmation of the intended jurisdiction, Georgia, United States.

## 14. Open Items

1. Whether a launcher will be built at all. It is not currently planned.
2. Whether updates would be delivered by a platform instead.
3. Whether Mod management would be part of the launcher.
4. Which update framework or HTTP library would be used, and its licence.
5. How rollback would work after a failed update.

## 15. Related Documents

- [Online-Services-Terms.md](/docs/places-left-behind/online-services-terms)
- [Account-Terms.md](/docs/places-left-behind/account-terms)
- [`../Commercial/Game-Updates-Policy.md`](/docs/places-left-behind/game-updates-policy)
- [`../Commercial/Game-Distribution-Terms.md`](/docs/places-left-behind/game-distribution-terms)
- [`../Compliance/Distribution-Compliance.md`](/docs/places-left-behind/distribution-compliance)
- [`../Privacy/Game-Privacy-Policy-Draft.md`](/docs/places-left-behind/game-privacy-policy-draft)

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial future draft of launcher terms |
