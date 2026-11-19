<!-- managed by canon-sync (source: cemi-system/templates/pull_request_template.md); edit the source, not this copy -->
## Item

`<repo>-<n>` — <title>. Milestone: <milestone or none>. Type: feature | fix | security | canon | chore.

## What changed

<Two to five lines a reviewer who has not seen the conversation can follow. Name the surfaces: pages, functions, rules, scripts, dependencies.>

## Why

<The need or the finding, with its source: Carlos's words and date, an incident, an audit row, a user report.>

## Verified

- [ ] Build and the repository's own checks pass through the exact command CI runs
- [ ] Tests / rules tests (emulator): <counts>; rules tests fail on the ruleset they replace: <n of m>
- [ ] Localized text: JSON parses, French U+202F, Portuguese is Brazilian
- [ ] Canonical guard; hosting serves only the build folder; no source maps
- [ ] Live after deploy: six headers, `/.git/HEAD` 404, fixed journeys signed out and signed in (QA identity)

## Security assessment (`cemi-feature-security-assessment`)

Tier: **light** | **deep** (deep review filed at `docs/security/<date>-<slug>.md`)

1. Who can call it: <…>
2. What one call costs, and what bounds a flood: <…>
3. What data it reads or writes: <…>
4. What a stranger can trigger: <…>
5. What it trusts: <…>
6. What is new to the fleet: <…>

Checks that apply and their state:
- [ ] Paid call behind a capped function; no key in browser or repository; brakes outside code
- [ ] Stranger-triggered sends capped in code
- [ ] Rights from server-written claims only; rules tested; live rules equal the file
- [ ] Untrusted HTML sanitized
- [ ] Per-recipient documents noindexed, unguessable links
- [ ] Secrets in Secret Manager as `<PROVIDER>_API_KEY_<SITE>`, listed under «Credentials»
- [ ] Per-user and per-IP limits; `maxInstances`
- [ ] `/security-review` run on the diff; findings: <none | listed below as items>

## Deploy plan

Order: functions → hosting → backfills → rules last. Commands: <…>. Rollback: redeploy tag <previous>. Needs Carlos's go in this repository's tab: yes.

## Open after merge

<Items this PR leaves open, with ids and who they wait on; or «none».>

---
Session: <session name> (<repository>)
Claude-Session: <link, or local <id>>
