---
trigger: model_decision
description: "CEMI canon (cemi-feature-security-assessment): 🛡️ Every new feature ships with a security assessment (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/feature-security-assessment.md; edit the source, not this copy -->

<!-- BEGIN cemi-feature-security-assessment v2 (managed — source: cemi-system/sync/feature-security-assessment.md) -->
## 🛡️ Every new feature ships with a security assessment (all CEMI repos)

A feature is not done until someone has asked what it exposes. On 2026-10-20 a key compiled into a browser bundle cost about US$1,000 in a morning; the first question below would have caught it before the deploy. From 2026-11-01 (Carlos) every new feature, function, endpoint, integration or data flow carries a recorded security assessment, scaled to its risk, before it is deployed.

**The sheet, six questions answered in one line each:**
1. **Who can call it?** Anyone on the internet, an anonymous session, a signed-in user, an admin by server-written claim, only another server?
2. **What does one call cost?** A paid API, an e-mail or SMS, storage, compute; and what bounds a flood: cap in code, quota, budget, kill switch.
3. **What data does it read or write?** Personal data, credentials, payments, documents; whose; where it goes.
4. **What can a stranger trigger?** Anything reachable without sign-in that sends, spends, writes or reveals.
5. **What does it trust?** Request parameters, a role in a user-writable field, a referrer, content rendered as HTML, a third-party script or embed.
6. **What is new to the fleet?** A provider, a library, a service account, a secret, a public endpoint.

**The tier follows the answers.**
- **Light** (most features): the sheet, the checks below, and the harness's security review skill (`/security-review`) run on the diff; about fifteen minutes. Recorded in the pull request's «Security assessment» section (template delivered by canon-sync), or in the commit message when the change rightly has no pull request.
- **Deep** (any «yes» to: sign-in or authorization changes, money or metered sends, Firestore or Storage rules, personal or financial data, a new external service or provider, a public endpoint): a written review before the deploy, by a session on a model tier at least as capable as the author's (`cemi-model-choice`), covering the sheet in full, the abuse cases, and the checks with evidence; filed under the repository's `docs/security/` and linked from the pull request. Carlos reads it before saying «deploy».

**The checks map to canon already in force;** the sheet decides which apply:
- Paid calls behind a capped function, no key in a browser or repository, brakes outside the code (`cemi-paid-api-keys` 1–4, 7).
- A send a stranger can trigger is capped in code (`cemi-paid-api-keys` 8; `cemi-quality-gates` §4.17).
- «Signed in» is never «trusted»: rights from server-written documents or claims only (`cemi-paid-api-keys` 6); rules tests that fail on the ruleset they replace, live rules equal the file (`cemi-quality-gates`).
- Untrusted HTML sanitized at every sink (`cemi-html-sanitization`).
- Per-recipient documents noindexed and unguessable (`cemi-unindexed-documents`).
- Only the site is served; headers on every host; embedding denied by default (`cemi-quality-gates` §4.14, §4.15).
- Secrets in Secret Manager under `<PROVIDER>_API_KEY_<SITE>`, listed in the repository's «Credentials» (`cemi-paid-api-keys`, `sitecraft-system/protocol/api-credentials.md`).
- Rate limits per user and per IP from the last `X-Forwarded-For` hop; `maxInstances` on every function.

**Gate.** `/ship` and the pull request review refuse a deploy whose change adds or alters a callable surface, a data flow or a dependency on an external service without a recorded assessment. A finding that cannot be fixed before the deploy is an **item of type security** with an owner and a date, never a note. Findings that reveal a fleet pattern are reported to cemi-system, which records them in the current audit (`docs/security-audit-2026-10-20/`) and sweeps the fleet.

**The security log.** The group keeps one time-ordered log, `cemi-system/docs/security-log.md` (Carlos, 2026-11-02): one dated entry per incident, audit (opened, each scope report, closed), decision or exception, control added or changed, deep review, and release that changes a security surface (rules, auth, a public endpoint). cemi-system writes the entries from the reports that reach it, so a session that closes a deep review, releases rules, grants an exception or handles an incident reports the facts to cemi-system in its usual message, and the detail stays where it is written. A registry section will render the log later; the file is the source of truth.

**Limits.** The assessment is a judgement recorded by the session that built the feature and checked by another; it is not a penetration test and never claims to be one. Dependency alerts follow their own policy (`O-dependency-upgrades.md` §7). Nothing here authorizes a paid or external scanning service (`cemi-cost-policy`).
<!-- END cemi-feature-security-assessment v2 -->
