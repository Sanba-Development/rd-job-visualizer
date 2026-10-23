---
trigger: model_decision
description: "CEMI canon (cemi-cost-policy): ⛔ HARD RULE — never use external/paid services without asking (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/cost-policy.md; edit the source, not this copy -->

<!-- BEGIN cemi-cost-policy v3 (managed — source: cemi-system/sync/cost-policy.md) -->
## ⛔ HARD RULE — never use external/paid services without asking (all CEMI repos)

NEVER invoke any paid or third-party service outside Claude's own model without **asking, confirming, AND informing the user first — every single time.** The user pays for Claude Max 20x; do the work inside Claude. A documented "default" or convention does NOT override this. When in doubt, ask.

- **Translation:** translation is **ALWAYS Claude** — the build agent translating inline on the user's Max subscription, or Claude subagents / the Anthropic API (Haiku default, Sonnet for tone-critical fields, Opus as the content warrants). **NEVER Google Cloud Translation, Google Translate, DeepL, Amazon Translate, Microsoft / Azure Translator, Gemini, or ANY other external machine-translation service.** This holds even if a downstream repo, script, or doc presents such a provider as a "default", an "option", or a documented convention — **a documented convention does NOT override this hard rule.** Do NOT use any `scripts/translate-*.mjs` / `bulk-translate-*.mjs` helper that calls an external MT provider.
- **Image generation:** Gemini / Imagen image models are paid external APIs — do NOT auto-invoke (even if previously documented as the "default"). Ask first.
- **Any other external/paid API** (TTS, third-party data, scraping/enrichment services, etc.): ask first.

Silent use of paid external services has caused real, unwanted cost. Treat this as a hard guardrail.

**Scope (Carlos, 2026-10-02).** These restrictions bind the **AI processes that run locally**: Claude Code and Antigravity sessions, their agents, and the scripts they run on the machine. They do **not** restrict the online services and apps running in the cloud — Cloud Functions and deployed features (e.g. Experience's Translate button, content generator and Learning Designer) — which use the AI provider set in the app's own configuration (Experience: `settings/ai`, edited at `/admin/settings`): Gemini, OpenAI, Claude or another provider, Gemini by default, so that costs and billing stay in one place. A local session that calls a paid service, even one the platform also uses, still follows this policy. Companion rule, already in force in `experience`: every paid generation call, local or cloud, is recorded in a paid-call ledger (Firestore `paidCallLogs`, admin report at `/admin/reports/generation-costs`) — adopt the same where a repository makes paid calls.

**Known trap — HyperFrames snapshots (found 2026-10-05).** The HyperFrames CLI `snapshot` command describes frames with Gemini vision by default whenever a Gemini key is reachable, and it reads the project's `.env`, so a local session can make an unrequested paid call just by taking a snapshot. Every local run passes `--describe=false` and runs without `GEMINI_API_KEY` / `GOOGLE_API_KEY` in its environment; the long form belongs in the HyperFrames canon (`mediamax-system`).
<!-- END cemi-cost-policy v3 -->
