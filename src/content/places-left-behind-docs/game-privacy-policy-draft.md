---
title: "Places Left Behind — Game Privacy Policy (Draft)"
version: "1.0"
docStatus: "Draft — Requires Legal Review"
summary: "Personal data handling by the Places Left Behind game application"
sourceId: "PLB-LEG-015"
sourcePath: "Documentation/Licensing/Privacy/Game-Privacy-Policy-Draft.md"
category: "privacy"
order: 20
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-015 |
| Version | 1.0 |
| Status | Draft — Requires Legal Review |
| Scope | Personal data handling by the Places Left Behind game application |
| Applies to | The game application on Windows, and any build distributed later |
| Verified against | Repository source at 2026-11-24 |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not yet applicable — the game has not been released |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Draft — not published.** This policy is prepared for a release that has not happened. It is not a published privacy notice, and it has not been reviewed by a lawyer. A published version must match the code that actually ships.

---

## 1. Purpose and Scope

This policy describes what the Places Left Behind game application does with personal data.

It covers the game application only. It does not cover:

- the studio website at `https://next-step-studios-official.github.io/`, which has its own privacy notice;
- the studio's Discord bot, which has its own policy scope;
- the storefront or platform through which a copy is purchased, which has its own privacy policy;
- third-party software on the user's system, including the graphics driver and operating system.

Places Left Behind must have its own independent policy scope. Its policies must not be merged with website policies or Discord bot policies.

## 2. What the Game Does Today — Verified

The current prototype was inspected to establish what it actually does. The verified position:

| Question | Verified answer |
| --- | --- |
| Does the game create user accounts? | No. No account system exists. |
| Does the game send data over a network? | No. No network code exists in the source. |
| Does the game collect telemetry or analytics? | No. No telemetry or analytics code exists. |
| Does the game show advertising? | No. No advertising code exists. |
| Does the game support online multiplayer? | No. |
| Does the game use cloud saves? | No. No save system is implemented. |
| Does the game read personal files? | No. It reads its own configuration file and its own compiled shaders. |
| Does the game write files? | No. No write path exists at present. |
| Does the game require a network connection? | No. |

What the game does read:

- `Configuration/game.settings.json`, from its own installation directory, for display, graphics, and audio settings;
- compiled shader files from its own `Shaders` directory.

Neither file contains personal data.

**This is a statement about the current prototype, not a permanent promise.** It must be re-verified before any release, because a future build may add saving, logging, crash reporting, or online features.

## 3. Data the Game Is Expected to Store Locally

Planned, not yet implemented:

- **Save data.** Progress, discovered evidence, collected documents, and photographed clues, stored locally in the user's application-data directory.
- **Settings.** Display, graphics, audio, and control preferences.

Local data stays on the user's device. It is not transmitted. It is described further in the [Game Save Data and User Data Policy](/docs/places-left-behind/game-save-data-policy).

## 4. Data the Game Does Not Collect

The following are not collected, and are not planned as part of the initial single-player release:

- names, email addresses, or other account identifiers;
- precise location;
- contact lists or address books;
- advertising identifiers;
- payment information (any purchase is handled entirely by the storefront);
- biometric data;
- health data;
- data from other applications on the device.

If any of these were introduced, this policy would have to be rewritten and republished before the feature shipped.

## 5. Operating System and Driver Behaviour

Some data handling happens outside the game and outside the owner's control:

- The operating system may record application errors, crash reports, or event logs.
- The graphics driver may create a shader cache or collect its own diagnostics.
- The storefront or platform may record play time, achievements, or crash information.
- Windows may synchronise user folders if the user has enabled that.

Those behaviours are governed by the relevant vendor's terms, not by this policy. The owner does not receive that data unless a user chooses to send it.

## 6. Data the Owner May Receive Outside the Game

If a person contacts the studio, submits a bug report, or applies to test a prototype, the owner may receive:

- a name or handle the person chooses to give;
- an email address or other contact detail;
- the content of the message, including screenshots and logs;
- hardware details volunteered in a bug report.

That data is used to respond, to investigate the report, and to administer a testing programme if one exists. It is not sold, and it is not used for advertising. Handling is described in the [Game Data Collection and Retention Policy](/docs/places-left-behind/game-data-policy).

No feedback channel and no testing programme currently exist, so no such data is being received today.

## 7. Legal Bases (For Future Use)

If the game is later distributed in jurisdictions that require a legal basis for processing personal data, the intended bases would be:

| Purpose | Intended basis |
| --- | --- |
| Providing the game and local saves | Performance of a contract, or the user's request before entering a contract |
| Responding to support and feedback messages | Legitimate interests, or consent where required |
| Optional telemetry, if ever added | Consent, obtained before collection |
| Security and abuse prevention | Legitimate interests |
| Legal obligations | Compliance with a legal obligation |

These bases are proposed, not established. They require review against the law of each market before any collection begins.

## 8. Sharing

The owner does not sell personal data. The owner does not share personal data with advertisers or data brokers.

Data may be shared only:

- with a service provider strictly necessary to operate a feature, under written terms;
- where required by law, or to respond to a valid legal request;
- to protect rights, safety, or property;
- with the user's consent.

No such sharing arrangement currently exists.

## 9. Retention

- Local save data is kept on the user's device until the user deletes it.
- Support and feedback messages would be kept only as long as needed to resolve the matter and to improve the game, then deleted.
- No data is retained today, because none is collected.

Detail is in the [Game Data Collection and Retention Policy](/docs/places-left-behind/game-data-policy).

## 10. Security

- The game stores data locally and does not transmit it.
- Any data the owner holds would be kept in access-controlled accounts, not in the public repository.
- No system is perfectly secure, and the owner cannot guarantee absolute security.

A public security overview exists on the website for the website and bot scopes. A game-specific security statement would be published alongside this policy.

## 11. Children's Privacy

- The game is a single-player exploration game and is not designed to collect data from anyone, including children.
- No account, chat, or user-generated content feature exists.
- If a future feature would involve children's data, applicable law — including United States children's privacy rules and any applicable state or international rules — would need to be assessed before that feature shipped.
- The owner is currently under 18; guardian involvement should be considered for any privacy commitment made on the studio's behalf.

## 12. User Rights

Where data protection law applies, a person may have rights to access, correct, delete, restrict, or object to processing of their data, and to data portability.

Because the game does not transmit data, most such requests concern only messages the owner holds. Requests can be made through the contact details published with the game. Identity may need to be verified before a request is actioned.

No formal request procedure is currently operating.

## 13. International Transfers

No data is transferred internationally today, because none is collected. If a service provider outside the user's country were used later, the transfer mechanism would have to be described before that feature shipped.

## 14. Changes to This Policy

Material changes would be published with a new version number and a revision date. A change would not retroactively apply to data already collected under an earlier version, except where the law permits or requires it.

## 15. Verification Requirement

Before this policy is published, the following must be confirmed against the shipping build:

- [ ] No network code added, or network behaviour fully documented.
- [ ] No logging of personal data.
- [ ] No crash reporting service.
- [ ] Save path and contents documented.
- [ ] Any launcher or updater behaviour documented.
- [ ] Storefront data handling referenced.
- [ ] Policy reviewed by a qualified lawyer.
- [ ] Policy published on the website as its own scope, not merged with other scopes.

## 16. Contact

Contact details for privacy questions would be published with the game and on the studio's policy index. No postal address is published, and none should be invented.

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial draft, verified against the prototype's source |

## Related Documents

- [Game-Data-Policy.md](/docs/places-left-behind/game-data-policy)
- [Game-Save-Data-Policy.md](/docs/places-left-behind/game-save-data-policy)
- [`../Website-Policy-Integration.md`](/docs/places-left-behind/website-policy-integration)
- [`../Commercial/EULA-Draft.md`](/docs/places-left-behind/eula-draft)
- [`../Future/Account-Terms.md`](/docs/places-left-behind/account-terms)
