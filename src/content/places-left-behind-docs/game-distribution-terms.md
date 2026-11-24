---
title: "Game Distribution Terms"
version: "1.0"
docStatus: "Draft — Requires Legal Review"
summary: "How Places Left Behind builds are distributed, and on what terms"
sourceId: "PLB-LEG-012"
sourcePath: "Documentation/Licensing/Commercial/Game-Distribution-Terms.md"
category: "commercial"
order: 20
lastRevised: "2026-11-24"
sourceCommit: "9f8e7151d9a86f58305f0889dd4f5ef7b5e51fb2"
legal: true
---
| Field | Value |
| --- | --- |
| Document ID | PLB-LEG-012 |
| Version | 1.0 |
| Status | Draft — Requires Legal Review |
| Scope | How Places Left Behind builds are distributed, and on what terms |
| Applies to | The owner, distributors, storefronts, and recipients of builds |
| Document owner | Candler Shaw (Next Step Studios) |
| Created | 2026-11-24 |
| Last revised | 2026-11-24 |
| Effective date | Not yet applicable — the game has not been distributed |

**Copyright © 2026 Candler Shaw. All rights reserved. Developed under the name Next Step Studios.**

> **Draft.** No distribution channel has been selected and no build has been distributed. This document records the intended position, not an existing arrangement.

---

## 1. Purpose

These terms describe the intended distribution model for Places Left Behind, the obligations that would attach to any distribution channel, and the limits on what a distributor or recipient may do.

They apply in addition to the [End User License Agreement](/docs/places-left-behind/eula-draft), which governs the end user's use of the Game.

## 2. Distribution Channels

No channel has been chosen. The following are possible, and none is assumed:

| Channel type | Notes |
| --- | --- |
| The studio's own website | Direct download or a storefront operated by the studio |
| A third-party storefront | Such as Steam, itch.io, GOG, or the Epic Games Store |
| A console or subscription platform | Not currently planned |
| Physical distribution | Not currently planned |
| Bundles or promotions | Requires a separate written arrangement |

Steam is **not** assumed to be the distribution platform. Any statement that the Game "will be on Steam" would be a claim about a decision that has not been made.

Each channel brings its own terms, which the owner would need to review and accept. Where a platform's terms conflict with this document, the platform's terms govern the platform relationship, and this document governs the owner's own distribution decisions to the extent the platform allows.

## 3. Distribution Rights

1. Only the owner may authorize distribution of the Game.
2. A distributor receives only the rights granted in a written distribution agreement with the owner.
3. A distributor may not sublicense, assign, or transfer distribution rights without written permission.
4. A distributor may not alter the Game, its branding, its notices, or its build identification without written permission.
5. A distributor must reproduce the Game's end-user terms and third-party notices as provided.

## 4. Copies and Licence Keys

1. Each end user requires a lawfully obtained copy.
2. Where licence keys are used, they are personal to the end user and may not be resold, shared, or used to activate more copies than permitted.
3. Key generation, revocation, and regional restrictions would be governed by the distribution agreement and by the platform's rules.
4. The owner may revoke keys obtained through fraud, chargeback, or unauthorized resale, subject to the platform's rules and applicable law.

## 5. Pricing and Regional Availability

1. Pricing is set by the owner or, on some platforms, in agreement with the platform.
2. Regional pricing, currency, and taxes are handled by the platform or by the owner as the seller.
3. No price, discount, or regional availability is promised by this document.
4. Nothing here creates a price commitment or a most-favoured-nation obligation.

## 6. Refunds

1. Refunds would be handled under the policy of the store through which the Game was purchased.
2. Where the owner sells directly, the owner would publish a refund policy before taking payment.
3. Mandatory consumer rights in the purchaser's jurisdiction prevail over any refund policy.
4. No refund policy is currently in force, because nothing is sold.

## 7. Evaluation, Press, and Promotional Copies

1. The owner may provide copies to press, creators, or reviewers at the owner's discretion.
2. Such copies are for coverage and evaluation, not for redistribution.
3. Coverage conditions, including any embargo, would be stated in the accompanying communication.
4. A promotional copy does not grant the recipient rights beyond the end-user terms, except as separately agreed in writing.

## 8. Third-Party Components in Distributed Builds

Every distributed build must include or accompany:

1. The third-party notices required by the licences of included components. See [`../../../THIRD-PARTY-NOTICES.txt`](/docs/places-left-behind/#source-only-files).
2. The end-user terms.
3. Any platform-required disclosures.

The verified position at the time of writing: Silk.NET packages (MIT) and GLFW (zlib) are the only redistributed third-party components, and both permit commercial distribution with notices retained. The .NET runtime is a prerequisite and is not redistributed by a framework-dependent publish.

Detailed steps are in the [Build and Packaging Licensing Checklist](/docs/places-left-behind/build-packaging-checklist) and the [Third-Party Redistribution Checklist](/docs/places-left-behind/third-party-redistribution-checklist).

## 9. Installer and Launcher Considerations

1. An installer, if used, must not install unrelated software, adware, or bundled third-party offers without clear disclosure and consent.
2. An installer must not modify system settings beyond what installation requires.
3. If a launcher is used, it must be described in the launcher terms. The draft is [`../Future/Launcher-Terms.md`](/docs/places-left-behind/launcher-terms), and no launcher exists.
4. Uninstallation must be possible and must not leave the system in a broken state. User save data should be preserved or its removal clearly offered.
5. Code signing is recommended for Windows builds to reduce false security warnings. Whether a certificate will be obtained is undecided.

## 10. Platform Requirements

Distribution on a platform may require:

- age ratings and content questionnaires;
- support commitments or minimum patch cadence;
- store-page assets and accurate feature descriptions;
- accessibility disclosures;
- privacy disclosures consistent with the platform's rules;
- achievement, cloud save, or controller support integration.

None of these are implemented or agreed. They should be assessed before any platform agreement is signed.

## 11. Restrictions on Recipients

A person who receives a build may not:

1. redistribute it, or share installation files or keys;
2. sell it or use it commercially;
3. modify it beyond what the end-user terms permit;
4. remove notices or build identification;
5. present a modified build as authentic.

## 12. Support and Availability

1. No availability commitment, uptime commitment, or support commitment is made.
2. Distribution may be paused, ended, or moved to another channel.
3. If a channel is discontinued, the owner should give reasonable notice where possible and should not leave purchasers without access to what they lawfully bought, subject to the platform's rules.

## 13. Record Keeping

The owner should keep:

- a record of each distribution agreement and its terms;
- the version of the Game delivered to each channel;
- confirmation that third-party notices were included;
- any platform-required filings.

## 14. Open Items Requiring Confirmation

- Selection of the primary distribution channel.
- Whether the owner will sell directly and handle tax and refunds.
- Whether a launcher or installer will be built.
- Whether code signing will be obtained.
- Which platforms, if any, beyond Windows will be supported at release.
- Whether any platform-specific terms require changes to the EULA.
- Legal review of the distribution agreement template before it is used.

## Revision History

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-24 | Initial draft of the game distribution terms |

## Related Documents

- [EULA-Draft.md](/docs/places-left-behind/eula-draft)
- [Game-Updates-Policy.md](/docs/places-left-behind/game-updates-policy)
- [Game-Warranty-and-Liability.md](/docs/places-left-behind/game-warranty-and-liability)
- [`../Compliance/Distribution-Compliance.md`](/docs/places-left-behind/distribution-compliance)
- [`../Compliance/Build-Packaging-Checklist.md`](/docs/places-left-behind/build-packaging-checklist)
- [`../Future/Launcher-Terms.md`](/docs/places-left-behind/launcher-terms)
