---
trigger: model_decision
description: "CEMI canon (cemi-work-tracking): 🧭 Work is tracked as items, shipped through pull requests where a deploy follows (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/work-tracking.md; edit the source, not this copy -->

<!-- BEGIN cemi-work-tracking v2 (managed — source: cemi-system/sync/work-tracking.md) -->
## 🧭 Work is tracked as items, shipped through pull requests where a deploy follows (all CEMI repos)

CEMI runs many repositories with many sessions and one person deciding. Prose lists did the tracking until 2026-11-01; a crash or a full context then cost a session the time to find its place again, and «waiting on Carlos» was scattered across documents. From now on work is tracked as **items**, in a lean shape: what Agile and Lean offer that fits a one-person, many-session operation, and nothing that does not (Carlos, 2026-11-01). No sprints, no story points, no velocity.

**1. One item per piece of work.** An item has an **id** (`<repo>-<n>`), a **type** (feature, fix, security, canon, chore), a **state** (backlog → ready → in progress → review → done; or blocked), the **session** holding it, **who or what it waits on** when blocked, a **milestone**, and the commits or pull request that close it. The register is the Work section of registry.cemi.ai (`/admin/work`), written from any repository with `node ../cemi-system/tools/work.mjs` (Phase 1 of `cemi-system/docs/dev-process-2026-11-01.md`); until that command exists, the same line goes in `cemi-system/docs/pending-ecosystem.md` under the repository's heading, in the same fields and order. A session opens or claims its item when it starts, moves it when its state changes, and leaves it in a resumable state before stopping: the item, not the conversation, is what a fresh session reads after a crash.

**2. Lean limits.** One item in progress per session. A blocked item names who unblocks it; «waiting on Carlos» items are the first thing he sees, and the first thing a session reports. An item untouched for 30 days is closed or re-scoped, never carried silently.

**3. Milestones, not sprints.** Work is grouped by milestone (an initiative with a date and a done-list: «security audit closed», «HUMANOS 5.0 live»), never by a fixed cadence. The review is weekly, on Monday, over the register; the daily check is the Notifications page.

**4. Pull requests where a deploy follows — pilot first.** Until Phase 2 closes (one month from 2026-11-01, then Carlos decides the fleet rollout), this rule binds **five pilot repositories only: dreams, ibizai-web, mediamax-web, registry-web, cemi-web**; every other repository keeps committing to `main` and deploying as before, with the security assessment of rule 6 recorded in the commit message. In a pilot repository, any change that will be deployed (functions, hosting, rules, data scripts, a new feature or integration) goes on a branch named `<type>/<item-id>-<slug>` and reaches `main` through a pull request written from the template canon-sync delivers (`.github/pull_request_template.md`): the item, what changed, why, what was verified, the **security assessment** of `cemi-feature-security-assessment`, and the deploy plan. CI gates run on the pull request (`cemi-quality-gates`); the review is by a session on a model tier at least as capable as the author's (`cemi-model-choice`); Carlos merges, or says «merge» in the repository's tab. **Direct commits to `main` stay allowed** for documentation, canon receipts, handoffs, registers and other changes that deploy nothing; a pull request for prose would bury Carlos.

**5. Releases are tagged and logged.** Every deploy is a release: `/ship` tags it (`v<YYYY.MM.DD>[.<n>]`), adds its CHANGELOG entry, and records it in the repository's release log (`docs/qa/releases.md`, ibizai-web's shape) with what shipped, the checks run, and the item ids closed. Rollback is a redeploy of the previous tag.

**6. Definition of done.** An item is done when its change is merged, deployed where a deploy follows, verified live (the fixed journeys of `cemi-quality-gates`), its security assessment is recorded, its docs and register row are current, and nothing of it waits on anyone. «Committed» is not done.

**Limits.** This block shapes how work is tracked and merged; it changes no permission: pushes, deploys, paid calls and rules releases still follow `cemi-blocked-steps` and `cemi-cost-policy`. Long form, phases and what was deliberately left out: `cemi-system/docs/dev-process-2026-11-01.md`.
<!-- END cemi-work-tracking v2 -->
