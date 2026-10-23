---
trigger: model_decision
description: "CEMI canon (cemi-gemini-models): 🤖 Gemini model ids — never hard-code a dated id in application code (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/gemini-models.md; edit the source, not this copy -->

<!-- BEGIN cemi-gemini-models v3 (managed — source: cemi-system/sync/gemini-models.md) -->
## 🤖 Gemini model ids — never hard-code a dated id in application code (all CEMI repos)

Google retires Gemini model ids without notice and **new API keys cannot use retired ids** even while old keys still can (2026-09-13: `gemini-2.5-flash` answered 404 "no longer available to new users" on a fresh key while older keys kept working). A model id copied from another repo, a doc, or memory is therefore never proof that it works for THIS key.

Rules:
1. **One place per repo.** Model ids live in exactly one module (e.g. `functions/src/assistant/provider.ts` → `MODELS`), never inline at call sites, scripts, or docs as "the model".
2. **Prefer families, resolve at runtime.** Express the need as a family + tier (`flash` for chat/volume, `pro` for analysis, `*-image`, `*-tts`) and resolve the concrete id at startup or first use from `models.list()` (Developer API `ListModels`), picking the newest generally-available id of that family that supports the required method (`generateContent`, image, TTS). Cache per process. Fall back to the pinned id only if listing fails.
3. **Treat 404 / "no longer available" as a model-rotation signal**, not a bug in your prompt: re-resolve once, log the substitution with both ids, and continue. **Where to look for the successor (2026-09-21, found in production by aunsinnombre.org, routed through sitecraft-system):** take the successor from the **documentation's model list** (`models.list()` and the published model page), **never from the API's error message** — when `gemini-2.5-pro` answered 404 "no longer available to new users", the error named a *preview* model as its replacement while the documentation listed a *stable* one; the error is a rotation signal, not a recommendation, and following it silently moves a production surface onto preview. And **prefer stable over preview on any user-facing surface**: a preview id can change behaviour or disappear without notice; take a preview only when the stable line genuinely cannot do the job, and record why beside the pin. The surface changes the risk tolerance, not the rule.
4. **Verify before pinning.** When a repo pins ids (media pipelines, TTS canon), the pin carries a date and the key it was verified with, and `/ship` for that repo re-checks the pin against `ListModels`.
5. **Docs name families, not ids**, except in a single dated "verified ids" table per repo. Never copy ids across repos.

Verified ids as of **2026-09-13** on a fresh Developer API key (project schools-solutions): chat `gemini-3.6-flash`, analysis `gemini-pro-latest` (alias, follows the current Pro). TTS (`gemini-2.5-flash-preview-tts`) was verified only on the older shared media key — re-verify on any new key before relying on it.

**Image models are named by family, never by id here** (mediamax-system image-gen spec 2.0, 2026-10-15): `image-flash` (the default), `image-flash-lite`, `image-pro`. The one dated table of image ids and prices is `mediamax-system/knowledge/production/image-gen/19a-image-gen-model-catalog.md` §3.0. **Retired, never use:** `gemini-2.5-flash-image` (shut down 2026-10-02 per Google's pricing page), `gemini-3-pro-image-preview` (2026-06-25; successor `gemini-3-pro-image`), Imagen 4 — `imagen-4.0-*` (2026-08-17). Retirements and image-price drift are checked weekly by `@smoother/image-pricing` (`../smoother-image-pricing`, one public page, no paid call) in `cemi-system/schedules/run-canon-drift.sh`, which also lists every repository still naming a retired id.
<!-- END cemi-gemini-models v3 -->
