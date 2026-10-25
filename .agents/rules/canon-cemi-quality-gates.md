---
trigger: model_decision
description: "CEMI canon (cemi-quality-gates): ✅ Quality gates — content, security and integrity, live QA (all CEMI sites and apps)"
---
<!-- delivered by cemi-system canon-sync from sitecraft-system/sync/quality-gates.md; edit the source, not this copy -->

<!-- BEGIN cemi-quality-gates v5 (managed — source: sitecraft-system/sync/quality-gates.md) -->
## ✅ Quality gates — content, security and integrity, live QA (all CEMI sites and apps)

Every CEMI site or app with content, sign-in or a database keeps three layers of checks. The standard, with reference implementations and each repository's adoption state, is `sitecraft-system/protocol/quality-gates.md`.

- **Checks block the deploy.** Content validators, drift guards, the no-secrets-in-client check, unit tests and security rules tests (on the emulator) run in CI **before** the deploy job, which `needs:` them. A check that only warns is not a gate. Only checks that need production credentials, write live data or cost money stay manual, and the workflow says which and why.
- **Rules tests must fail on the ruleset they replace.** Run new tests against the previous rules once and record how many fail.
- **Generated, never hand-copied.** Code shared between packages, or between a catalog and the rules, comes from one source through a generator with a `--check` mode in CI.
- **Deploy order:** functions, then hosting, then backfills, then security rules **last**.
- **The live rules equal the committed file.** A CI check reads the live Firestore and Storage releases through the Rules API, for the right database and bucket, and fails on any difference: a stale checkout must never revert a fix made live (`quality-gates.md` §4.13).
- **Only the site is served.** Hosting serves a build folder, never `"."`. Every `firebase.json` carries the minimum `hosting.ignore` (dotfiles, `.git`, `functions/`, `scripts/`, `docs/`, `*.md`, `*.map`, logs and rules files), production builds emit no source maps, and a check enforces it. After deploy, `/.git/HEAD` answers 404 (§4.14).
- **Security headers on every host:** HSTS, `nosniff`, a strict referrer policy, no framing (`frame-ancestors`), and a closed permissions policy. Each site's own CSP starts as report-only. **Embedding is denied by default** (`DENY`, `frame-ancestors 'none'`). An exception is one site and one embedding host, approved by Carlos and recorded in the registry ledger first (`set-embed-exception.mjs`, `/admin/embeds`). The header then names only that host, and is never dropped. The weekly drift run checks live headers against the ledger (§4.15).
- **A send a stranger can trigger is capped.** Any endpoint a visitor can trigger without signing in (an anonymous session counts as not signed in) that sends an e-mail, an SMS or another metered message carries a site-wide daily cap in code. The cap fails closed, posts to registry.cemi.ai at 80 % and 100 %, and past it the page offers a path that sends nothing. Per-IP limits and App Check do not bound a flood (§4.17).
- **Served CSS keeps the browser floor.** Astro sites set `vite.build.cssTarget` to `['chrome87', 'edge88', 'firefox78', 'safari14']`, and a build gate fails on range media queries (`(width<=…)`) in `dist/` CSS **and** HTML. Vite 8 writes them by default, and Safari before 16.4 ignores them, so older phones get the desktop layout without any error (§4.18).
- **Lockfiles are tracked** at the root and in `functions/`. CI and deploys use `npm ci`, and a security fix is committed with its lockfile (§4.16).
- **Live data changes are scripts that default to a dry run** and write only with `--apply`. Scan the staged diff for secrets before every commit, and stage files by name.
- **After every deploy, run the site's fixed live journeys**, signed out and signed in. Signed-in journeys use the site's QA identity: `qa-<app>@cemi.test`, created through xAId's API, in its own QA organization, never a platform tier, with credentials outside the repository (`sitecraft-system/protocol/niche-sites/test-identities-guidelines.md`). It never touches a client organization, and it cleans up what it creates.
- **Structure is validated by script; judgement by a second reader.** Fit, measurement validity, cultural load and vocabulary canon are reviewed by someone other than the author, working from a written checklist, on a model tier at least as capable as the author's (`cemi-model-choice`).

No paid or hosted service is used for any check without asking (`cemi-cost-policy`).
<!-- END cemi-quality-gates v5 -->
