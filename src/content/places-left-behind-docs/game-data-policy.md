---
title: "Game Data Collection and Retention Policy"
version: "1.0"
docStatus: "Draft — Requires Legal Review"
summary: "What data is collected, why, how long it is kept, and how it is deleted"
sourceId: "PLB-LEG-016"
sourcePath: "Documentation/Licensing/Privacy/Game-Data-Policy.md"
category: "privacy"
order: 10
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-016 |
| Version | 1.0 |
| Status | Draft — Requires Legal Review |
| Scope | What data is collected, why, how long it is kept, and how it is deleted |
| Applies to | The game application, prototype testing, and support communications |
| Verified against | Repository source at 2026-11-24 |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not yet applicable — no programme or release exists |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Draft.** This policy describes an intended practice. No data is currently collected, no programme exists, and no retention schedule is running.

---

## 1. Purpose

This policy defines what data the project collects, why it is needed, where it is stored, how long it is kept, and how it is deleted.

It distinguishes three things that are often confused:

1. **What exists today** — verified from the source code.
2. **What is planned** — designed but not implemented.
3. **What is only hypothetical** — would require a policy change and a published update before it happened.

## 2. What Exists Today — Verified

| Data category | Collected today? | Evidence |
| --- | --- | --- |
| Gameplay telemetry | No | No telemetry code in `Source/` |
| Crash reports | No | No crash reporting code |
| Analytics events | No | No analytics SDK |
| Account data | No | No account system |
| Network identifiers or IP logging | No | No network code |
| Save data | No | No save system; `Source/Game/Saving/` is empty |
| Local settings | Read only | `Configuration/game.settings.json` is read, never written |
| Feedback or support messages | No | No channel published |
| Tester records | No | No testing programme |

The game writes no files at present. It reads its own configuration and compiled shaders.

## 3. Data Categories and Their Intended Status

| Category | Status | Purpose if implemented |
| --- | --- | --- |
| Local save data | Planned | Preserve progress between sessions |
| Local settings | Partially present (read-only) | Remember display, graphics, audio, and control preferences |
| Local log files | Not planned for release; possible for development builds | Diagnose defects reported by testers |
| Crash reports | Not planned | Only if a reporting mechanism is deliberately added |
| Optional telemetry | Not planned | Would require consent and a published policy change |
| Support and feedback messages | Only if a channel is opened | Investigate reports, respond to the sender |
| Tester administration records | Only if a programme starts | Manage access, match reports to builds |
| Storefront purchase data | Handled by the storefront | Payment, entitlement, refunds |

Nothing in the "not planned" rows may be added without updating this policy and republishing it.

## 4. Purpose Limitation

Data may be used only for the purpose it was collected for:

- save data — to restore the player's progress;
- settings — to apply the player's preferences;
- feedback — to investigate and respond;
- tester records — to administer access.

Data must not be repurposed for advertising, profiling, or sale. It must not be used to train models without a separate, explicit basis.

## 5. Storage Locations

| Data | Intended location | Notes |
| --- | --- | --- |
| Save data | The user's local application-data directory | Not inside the installation folder |
| Settings | The user's local application-data directory or the installation's configuration folder | Current prototype reads from the installation folder |
| Development logs | Local only, if used at all | Should not be uploaded automatically |
| Feedback and tester records | An access-controlled account held by the owner | Never the public repository |

No data is stored on a server today, because no server exists.

## 6. Retention Schedule

| Data | Intended retention | Deletion method |
| --- | --- | --- |
| Local save data | Until the user deletes it or uninstalls | User-controlled; uninstall should offer to remove it |
| Local settings | Until the user deletes them or uninstalls | User-controlled |
| Development logs | Until the defect is resolved, then deleted | Manual deletion |
| Feedback messages | Until the matter is resolved, and no longer than reasonably necessary | Manual deletion |
| Tester contact details | For the duration of the programme and a short administrative tail | Manual deletion on request or on programme end |
| Tester access records | Duration of the programme, then archived or deleted | Manual deletion |
| Build downloads | Until the build is withdrawn | Removal from the distribution channel |

No fixed retention periods are yet in force. If a programme begins, concrete periods should be set and recorded here.

## 7. Data Minimisation

- Collect only what is needed for the stated purpose.
- Prefer aggregate or de-identified information where it answers the question.
- Do not ask testers for personal details that are not needed for access or communication.
- Do not request full system information when a build identifier and a description suffice.

## 8. Security

- Keep any collected data in access-controlled accounts with multi-factor authentication where available.
- Do not place personal data in the repository, in build artifacts, or in public issue trackers.
- Do not commit credentials. If one is committed, treat it as exposed and rotate it.
- Delete data that is no longer needed rather than keeping it indefinitely.

## 9. Access, Correction, and Deletion Requests

If a person asks what data the owner holds about them, or asks for correction or deletion:

1. Verify the request comes from the person concerned.
2. Search the places listed in section 5.
3. Provide, correct, or delete the data as appropriate.
4. Confirm the outcome to the person.
5. Record that the request was handled, without recording more personal data than necessary.

Because the game itself transmits nothing, such requests will normally concern messages the owner holds, not game data.

## 10. Children

- No feature is designed to collect data from children.
- If a future feature would involve children's data, applicable law must be assessed first, and guardian consent may be required.
- Testers who are minors would require guardian involvement under the draft tester terms.

## 11. Third-Party Platforms

If the game is sold or delivered through a storefront:

- The storefront collects purchase and account data under its own policy.
- The owner may receive aggregate sales reports and, where the platform provides it, limited customer information for support.
- The owner should not receive more customer data than necessary, and should not request it from the platform without a reason.

## 12. Breach Handling

If data the owner holds is compromised:

1. Contain the exposure — revoke access, rotate credentials, remove exposed data.
2. Assess what was affected and who is affected.
3. Notify affected people and any authority where required by law.
4. Record what happened and what was changed.

No formal incident response plan is in force. This section is a proposed starting point.

## 13. Review

This policy should be reviewed:

- before any release;
- before any telemetry, crash reporting, account, or online feature is added;
- before a testing programme begins;
- at least annually.

## 14. Open Items Requiring Confirmation

- Concrete retention periods, once a programme exists.
- Whether development builds will write logs, and where.
- Which service, if any, would hold tester records.
- Whether any platform requires a specific data processing agreement.
- Legal review of the retention and request-handling sections.
- The data protection obligations that apply to a studio operated by a person under 18.

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial draft, verified against the prototype's source |

## Related Documents

- [Game-Privacy-Policy-Draft.md](/docs/places-left-behind/game-privacy-policy-draft)
- [Game-Save-Data-Policy.md](/docs/places-left-behind/game-save-data-policy)
- [`../Prototype/Prototype-Feedback-Policy.md`](/docs/places-left-behind/prototype-feedback-policy)
- [`../Prototype/Prototype-Tester-Agreement.md`](/docs/places-left-behind/prototype-tester-agreement)
- [`../Website-Policy-Integration.md`](/docs/places-left-behind/website-policy-integration)
