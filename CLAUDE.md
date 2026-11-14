# CLAUDE.md

<!-- BEGIN cemi-cost-policy v5 (managed — source: cemi-system/sync/cost-policy.md) -->
## ⛔ HARD RULE — never use external/paid services without asking (all CEMI repos)

NEVER invoke any paid or third-party service outside Claude's own model without **asking, confirming, AND informing the user first — every single time.** The user pays for Claude Max 20x; do the work inside Claude. A documented "default" or convention does NOT override this. When in doubt, ask.

- **Translation:** translation is done **inline by the session's own model, on Carlos's own subscription**: Claude in Claude Code (Max), **Gemini in an Antigravity CLI session (Google AI Ultra)**, or Claude subagents / the Anthropic API (Haiku default, Sonnet for tone-critical fields, Opus as the content warrants). Carlos, 2026-10-27: «There is no problem with Gemini translating text in the Antigravity CLI gemini session. What it can not do is invoke a paid translation service.» **NEVER a translation service or API:** Google Cloud Translation, Google Translate, DeepL, Amazon Translate, Microsoft / Azure Translator, the Gemini API called from a script, or ANY other external machine-translation service. This holds even if a downstream repo, script, or doc presents such a provider as a "default", an "option", or a documented convention — **a documented convention does NOT override this hard rule.** Do NOT use any `scripts/translate-*.mjs` / `bulk-translate-*.mjs` helper that calls an external MT provider. The language rules travel with every translation, whoever writes it (`cemi-i18n-quote-hygiene`, `cemi-portuguese-br`, the Smoother glossary).
- **Subscription tools driven by hand are not API calls** (Carlos, 2026-10-27): still images in **Google Flow** and voices in **AI Studio's speech page** (`https://aistudio.google.com/u/3/generate-speech`), both driven by **Claude Cowork** in Carlos's browser on his own plan, and avatar videos in **HeyGen**, which also produces the avatar's voice. A session never opens them itself: it writes the prompt (`cemi-system/docs/cowork-flow-image-prompts.md`), Carlos runs it, and the files land in the repository's `scratch/`. Still images in Google Flow are free (Carlos, 2026-11-13: «Image generation in Google Flow is free»), so a Flow image prompt sheet states «0 Flow credits»; video in Flow and avatar videos in HeyGen spend plan credits, so their prompts state the count first.
- **Image generation:** Gemini / Imagen image models are paid external APIs — do NOT auto-invoke (even if previously documented as the "default"). Ask first.
- **Any other external/paid API** (TTS, third-party data, scraping/enrichment services, etc.): ask first.

Silent use of paid external services has caused real, unwanted cost. Treat this as a hard guardrail.

**Scope (Carlos, 2026-10-02).** These restrictions bind the **AI processes that run locally**: Claude Code and Antigravity sessions, their agents, and the scripts they run on the machine. They do **not** restrict the online services and apps running in the cloud — Cloud Functions and deployed features (e.g. Experience's Translate button, content generator and Learning Designer) — which use the AI provider set in the app's own configuration (Experience: `settings/ai`, edited at `/admin/settings`): Gemini, OpenAI, Claude or another provider, Gemini by default, so that costs and billing stay in one place. A local session that calls a paid service, even one the platform also uses, still follows this policy. Companion rule, already in force in `experience`: every paid generation call, local or cloud, is recorded in a paid-call ledger (Firestore `paidCallLogs`, admin report at `/admin/reports/generation-costs`) — adopt the same where a repository makes paid calls.

**Known trap — HyperFrames snapshots (found 2026-10-05).** The HyperFrames CLI `snapshot` command describes frames with Gemini vision by default whenever a Gemini key is reachable, and it reads the project's `.env`, so a local session can make an unrequested paid call just by taking a snapshot. Every local run passes `--describe=false` and runs without `GEMINI_API_KEY` / `GOOGLE_API_KEY` in its environment; the long form belongs in the HyperFrames canon (`mediamax-system`).
<!-- END cemi-cost-policy v5 -->

<!-- BEGIN cemi-i18n-quote-hygiene v8 (managed — source: sitecraft-system/sync/i18n-quote-hygiene.md) -->
## 🈂 Localized-text hygiene — quotes, multibyte, significant spaces (all CEMI repos)

**Scope: any operation over localized text — translating it, DERIVING from it, or reformatting it.** Excerpt and meta-description generators, subtitle and cue splitters, chunkers, word wrappers, search indexers and TTS segmenters are all covered, and most of them involve no translation step at all. The rules below were originally written for translation; the hazards are not limited to it.

These bugs share a failure mode, which is why they live together: **nothing throws.** The JSON parses, the text looks right, the build passes, and only the bytes changed.

The most frequent one: a translation agent nests English `"…"` quotes inside a foreign-language string and silently breaks the JSON. When translating into JSON or any structured/code format:

- **Never emit a raw ASCII `"` inside a JSON string value.** Use the locale's typographic quote pair (table below), or escape it as `\"`.
- **Select/segment the text blocks carefully** so quotes and punctuation never cross or corrupt the surrounding structure — and with multibyte **CJK (Chinese / Japanese / Korean)** characters, never split mid-character when chunking or truncating.

| Locale | Quote pair to use |
|---|---|
| DE | `„…"` (U+201E / U+201C) |
| FR / IT / AR | `«…»` |
| ZH | `「…」` (corner brackets) or full-width `"…"` |
| JA | `「…」` |
| ES / PT | `«…»` or curly `"…"` |

- **Put the French spaces there when you write the French.** The rule above keeps them alive once they exist; this one puts them there in the first place. French requires a **narrow no-break space (U+202F)** before `: ; ? !`, inside `« … »`, **and before `%`** (an ordinary space there is also a legal line break, so «9 %» can wrap with the sign alone on the next line — found 2026-09-13 in journalaism-web, 55 cases). Text authored with an ordinary space is wrong before any pipeline touches it, and no build fails on it — 76 such defects sat in CEMI's own published investor dossier from its first draft until 2026-09-11, because every rule on the subject was about *preserving* the spaces rather than *writing* them. This applies to anything a reader sees in French: page copy, i18n values, PDF and deck text, subtitles, email and letter bodies, social posts.

  **Decide it's French from the text, not from the page.** Generated text, a persona's chat answer above all, comes in the reader's language, which is not always the page's. A French answer on an English page still takes U+202F. Never apply French spacing to text whose language is undecided: Spanish also uses `« »`, without inner spaces. Streaming detail: `sitecraft-system/protocol/chatbot-and-personas.md`, *French typography follows the answer's language*.

  Audit any French file — HTML, JSON or markdown — with a text-node-aware pass, never a blind global replace (an ordinary space before a colon is correct inside a URL, a code block or an attribute):

  ```bash
  # count the defects in rendered French text
  python3 - "$FILE" <<'EOF'
  import re, sys
  s = open(sys.argv[1], encoding='utf-8').read()
  s = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', s, flags=re.S)
  s = re.sub(r'<[^>]+>', ' ', s)
  print(len(re.findall(r'[A-Za-zÀ-ÿ0-9»)*_] [:;?!%]', s)))
  EOF
  ```

  To fix, split the source on tags and script/style bodies, and inside the text segments only, replace `(?<=[A-Za-zÀ-ÿ0-9»\)*_]) (?=[:;?!%])` with U+202F (the `*_` admit markdown emphasis before the sign). Reference implementation: the 2026-09-11 pass over `cemi-web/public/{dossier,investors}/fr/*.html`.

- **Never split or trim localized text on JavaScript `\s`.** In any pipeline that **re-emits** the text — cue splitters, word wrappers, chunkers, excerpt and meta-description generators, TTS segmenters — `\s` matches **U+202F, U+00A0 and U+2009**, so `split(/\s+/)` + rejoin, `replace(/\s+/g, ' ')` and `trim()` silently delete the typographic spaces French requires before `: ; ? !` and inside `« … »`. No validator catches it. Split only on breakable whitespace: `[^\S\u202f\u00a0\u2009]+`, and trim the same way.

  **Safe exception:** `\s+` remains correct where the output is *not* served text — slugs, URL segments, search-query tokenization, filename derivation. The rule is about text that goes back on screen.

  Verify it yourself in ten seconds:

  ```bash
  node -e "console.log(/\s/.test('\u202f'), JSON.stringify(' \u202fx\u202f '.trim()))"
  # -> true "x"     the thin space matched \s, and trim() ate it
  ```

  **Two shapes, and prefer the second for trimming.** For splitting, negate the no-break spaces: `split(/(?<=[.?!])[^\S\u202f\u00a0\u2009]+/)`. For trimming, allow-list ASCII instead of negating — `t.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, '')` — which is stricter and reads as intent rather than as an exclusion.

  **When auditing a file for this pattern, grep it exhaustively — never trust an enumeration, including one in a report like this.** Run `grep -nE '\.trim\(\)|/\\s' <file>` over the WHOLE file and fix every hit. This has now failed twice in the same file: a first pass fixed one instance and left three, a second reported three and found six. Both times the shortfall came from reading a truncated grep, not from the pattern being subtle. A colon split is the easiest to miss and the most damaging, because `:` is exactly where the French thin space lives.

  Origin: two independently written pipelines in `ailearning-web` corrupted FR output this way in 2026-08, and no build failed on either. Wording adopted from `mediamax-system/.claude/rules/translation-protocol.md` §1, which had it first; deeper canon for cue segmentation lives at `mediamax-system/knowledge/production/tts/18f`.

**Always validate that every translated JSON file parses before applying it** (make it part of `/ship`). Example (adjust the path to your repo's i18n files):

```bash
for loc in en es fr de it zh ja pt ar; do
  node -e "JSON.parse(require('fs').readFileSync('src/i18n/$loc.json','utf8'))" && echo "$loc OK" || echo "$loc FAIL"
done
```

**Deeper protocol** (find/replace contract for subagent-produced translations, applier requirements, quality gates): see `mediamax-system/.claude/rules/translation-protocol.md`. The find/replace contract is mandatory whenever a translation agent emits structured pairs to apply against source HTML/JSON/ASS. Origin: 2026-06-17 batch where ~13% of pairs failed to match because agents retyped find strings.
<!-- END cemi-i18n-quote-hygiene v8 -->

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RD Job Visualizer is a 7-day challenge organized by **Sanba Development** to build an interactive portal for exploring the Dominican Republic job market, inspired by [Andrej Karpathy's US Job Market Visualizer](https://karpathy.ai/jobs/). The goal is to scrape DR job portals (RD Trabaja, Aldaba RSS, datos.gob.do) as data sources, aggregate job metadata (volume, salary ranges, sectors, geography), and render an interactive D3.js treemap. Note: RD Trabaja is one of several data sources — not the identity of the project.

## Current State

The project has a landing page (`index.html`), interactive data explorer (`explorer.html`), D3.js treemap (`src/treemap.html`), and a data pipeline (fetch + normalize scripts). No build system — all static HTML with CDN deps.

Key documents and artifacts:
- `DATA_SOURCES.md` — Inventario de 6 fuentes de datos priorizadas con URLs y formatos
- `SECTOR_TAXONOMY.md` — 12 sectores basados en CIUO-08 adaptados a RD
- `data/raw/` — 15 datasets gubernamentales (436k+ filas). Ver `data/raw/MANIFEST.md`.
- `data/schemas/normalized-job.schema.json` — Schema normalizado (22 campos, JSON Schema draft-07)
- `explorer.html` — Data Explorer interactivo para navegar los datasets
- `ORCHESTRATOR.md` — Living architecture summary (read this first in new sessions)
- `src/treemap.html` — Treemap D3.js interactivo con 12 sectores
- `src/sector-colors.json` — Paleta de colores WCAG por sector (fuente de verdad)
- `scripts/scrapers/fetch-rdtrabaja.js` — Fetch de API RD Trabaja (`node scripts/scrapers/fetch-rdtrabaja.js`)
- `scripts/processors/normalize.js` — Normaliza 262K registros (`node scripts/processors/normalize.js`)
- `ONBOARDING.md` — Guía para nuevos contribuyentes

## Working Mode — Orchestrator

Claude operates as an **orchestrator** for this repo:

1. **Start of session:** Read `ORCHESTRATOR.md` and `BACKLOG.md` to recover full context.
2. **For tasks:** Don't implement directly — spawn subagents with clear prompts: goal, files they own, files they must not touch, conventions, and verification steps. For multiple independent tasks, spawn in parallel.
3. **Compounding context:** This thread is a living memory. Feedback, decisions, analysis, and subagent results all compound. When context is compacted, ensure `ORCHESTRATOR.md` has everything needed to recover.
4. **End of session:** Run `/session-save` to persist decisions, feedback, and state changes to `ORCHESTRATOR.md` and memory files.
5. **Review subagent output** before committing — verify it follows conventions and doesn't break existing code.

## Backlog Management

**`BACKLOG.md` is the single source of truth for task tracking.** Follow these rules:

1. **Always read `BACKLOG.md` at the start of a work session** to understand current state.
2. **After completing any task**, update `BACKLOG.md` immediately:
   - Change `[ ]` to `[x]` for completed tasks
   - Change `[ ]` to `[~]` for in-progress tasks
   - Add a brief note of what was delivered after the `→`
3. **When adding new tasks**, add them to the "Tareas Adicionales" section with the next `X.N` number.
4. **When a blocked task is unblocked**, change `[!]` to `[ ]` and remove the blocker note.
5. Tasks from `PROJECT_PLAN.md` are mirrored in the backlog — the backlog is the live tracker, the plan is the reference document.

## Development

Open `index.html` in a browser directly — no build step needed. Use `npx serve .` (NOT `npx serve . -s` — SPA mode breaks multi-page .html navigation). Alternative: `python -m http.server`.

### Data Pipeline Commands

- `node scripts/scrapers/fetch-rdtrabaja.js` — Download RD Trabaja API data to `data/raw/rdtrabaja/`
- `node scripts/processors/normalize.js` — Normalize all raw data → `data/processed/normalized.json` (197MB, gitignored)
- `node scripts/processors/calculate-metrics.js` — Generate `data/processed/metrics.json` from normalized data
- `node scripts/processors/validate-sectors.js` — Validate sector coverage (exits 1 if gaps)

### Known Data Issues
- `normalize.js` picks up CSV subtotal/total rows as individual records (e.g., CORAABO RD$1.7M "salary" is a subtotal of 131 employees). See backlog X.6.
- Always filter rows where name/position contains "subtotal"/"total" when adding new CSV sources.

## Deployment

- **Vercel Git Integration** — merges to `master` auto-deploy to `jobs.sanba.dev`. Do NOT run `vercel --prod` manually.
- Preview deployments are generated for each PR automatically.
- Domain: `jobs.sanba.dev` (production), `sanba.dev` (future company landing, separate repo).

## Daily Branch Pattern

- Each day uses a `dayN/working` branch as integration target
- Feature branches (`feat/*`, `fix/*`) PR into `dayN/working`
- At end of day, `dayN/working` PRs into `master` → auto-deploy
- Clean up merged branches after each PR merge

## Stack & Dependencies (CDN-loaded, no local install)

- **Tailwind CSS** via CDN script tag
- **Lucide Icons** via unpkg
- **Plus Jakarta Sans** via Google Fonts
- **Marked.js** via CDN for rendering markdown overlays
- **PapaParse** via CDN for CSV parsing (explorer.html)
- **D3.js v7** via CDN for treemap visualization (src/treemap.html)

All JS is inline at the bottom of `index.html`.

## UI Patterns

- **Overlays:** All follow the same pattern — `<div id="*-overlay" class="fixed inset-0 z-[100] hidden">`, fetch .md file, render with `marked.parse()`, lazy-load with `*Rendered` flag. Copy existing when adding new.
- **Team cards:** Loaded dynamically from `data/participants.json` via `fetch()`. Photos in `assets/team/`.
- **Progress section:** 6 colored card grid below hero — links to all key artifacts.
- **Explorer datasets:** Hardcoded JS array in `explorer.html`. Must be updated manually when new data files are added to `data/raw/`. Stats computed dynamically from array.
- **Treemap data:** `src/treemap.html` loads `data/processed/metrics.json` dynamically. To update: run `node scripts/processors/normalize.js` then `node scripts/processors/calculate-metrics.js`.
- **Sector colors:** `src/sector-colors.json` is the source of truth. Treemap and color-palette.html read from it.
- **Contribuciones overlay:** `CONTRIBUCIONES.md` rendered via `marked.parse()` in "¿Y ahora qué?" section overlay. Same pattern as Plan/Research overlays.
- **Treemap drill-down:** Click sector → shows top 10 occupations in color variants. Breadcrumb bar + "Volver" to go back. Mobile uses bottom sheet instead (no drill-down).

## Planned Architecture (from research doc)

The full MVP pipeline follows Karpathy's pattern:
1. **Ingestion** — RD Trabaja REST API at `empleateya.mt.gob.do/api/` (open, no auth), CSV/JSON downloads from datos.gob.do CKAN API. Playwright NOT needed.
2. **Processing** — Normalization to CIUO-08 sectors (see `SECTOR_TAXONOMY.md`)
3. **Visualization** — D3.js interactive treemap with layers: sector, geography, salary
4. **Storage** — JSON for MVP simplicity

## Data Sources (see DATA_SOURCES.md for full details)

Priority sources for MVP:
- **P0:** MAP Nómina Pública (JSON API — currently 403, needs investigation), datos.gob.do CKAN API (working)
- **P0:** TSS Empleos Cotizantes (CSV)
- **P1:** ENCFT Banco Central (XLSX)
- **P2:** RD Trabaja (REST API — `empleateya.mt.gob.do/api/puestos?PageSize=500`), CNZFE Zonas Francas

Discarded: Aldaba (403/auth required), Portal Concursa (down), LinkedIn (paywall).

## Contributing Rules

See `CONTRIBUTING.md` for full details. Key rules:

- **Never run `vercel --prod` manually** — deploy is automatic on merge to master.
- **Master is protected** — requires PR + 1 approval to merge. No direct push.
- **One branch per task** — `feat/`, `fix/`, or `data/` prefix.
- **Update BACKLOG.md** after completing any task.
- **Don't modify CLAUDE.md or ORCHESTRATOR.md** without Erick's approval.
- **Don't delete raw data** — only add to `data/raw/`.
- **Test locally** with `npx serve .` before creating a PR.
- **Protected branch merges:** `gh pr merge` fails on master — need `--admin` flag or manual merge in GitHub UI.
- **Parallel subagents on same file:** Run sequentially (not in worktree isolation) or assign non-overlapping line ranges. Review final state carefully.

## Post-Challenge

- `CONTRIBUCIONES.md` — 43 actionable contributions across 9 segments (visualization, data pipeline, treemap inverso, bureau de empleo, data standards, community, policy, infrastructure, prospectiva)
- The "¿Y ahora qué?" section on the landing page links to this document via overlay

## Language

All UI and content is in **Spanish**. Comments and code may mix Spanish and English.

<!-- BEGIN cemi-contact-emails v5 (managed — source: cemi-system/sync/contact-emails.md) -->
## 📧 Contact emails (all CEMI repos)

Valid, working contact addresses for CEMI — real and monitored. Safe to use in site copy, footers, contact forms, persona contact routing, press kits, proposals, and any outward-facing material.

**Addresses (all `@cemi.ai`):** `ai-staff@` · `business@` · `contact@` (general inbox) · `info@` · `invest@` · `legal@` · `partners@` · `privacy@` · `security@` · `support@`

**The same set is aliased at these initiative domains:** `@ailearning.global`, `@airtistic.ai`, `@ibizai.ai`, `@lawra.io`, `@skaills.ai` — so e.g. `contact@ailearning.global`, `legal@lawra.io`, `support@ibizai.ai` all resolve. Each was confirmed to accept mail on **2026-10-05**; the weekly drift run re-checks them (`cemi-system/schedules/check-mail-aliases.mjs`), so an alias that stops working is caught instead of advertised.

**Retired — never publish:** `@ibizai.io`. The domain was retired on 2026-10-05 and redirects to ibizai.ai. It was advertised here while its addresses bounced; it has since been re-attached so that old mail still arrives, but it is no longer a domain CEMI publishes. Replace any `…@ibizai.io` still in copy with the same address `@ibizai.ai`.

**Project addresses (one site each, not role addresses):** `podcast@cemi.ai`, published only by the podcast «Inteligencia de Negocios 20/20» (podcast-web: footer, About, the feeds' owner e-mail); confirmed by Carlos 2026-11-08 and checked weekly by the same alias run. Other sites keep to the role addresses.

Default to `contact@cemi.ai`; route by purpose where a specific address fits (legal → `legal@`, security → `security@`, investment → `invest@`, partnerships/alliances → `partners@`, sales/commercial → `business@`, privacy/GDPR → `privacy@`). Do **not** invent addresses outside this list. Consultable at `/admin/emails`.
<!-- END cemi-contact-emails v5 -->

<!-- BEGIN cemi-html-sanitization v2 (managed — source: sitecraft-system/sync/html-sanitization.md) -->
## 🛡️ HTML sanitization — never inject untrusted HTML unsanitized (all CEMI repos)

Any content rendered into the DOM as raw HTML — `{@html}` (Svelte), `set:html` / `<Fragment set:html>` (Astro), `dangerouslySetInnerHTML` (React), `.innerHTML`, `v-html` — **MUST be sanitized before injection UNLESS its source is fully trusted.**

- **Trusted (no sanitizer required):** build-time content authored in-repo and git-reviewed — committed markdown/HTML, hardcoded icon-SVG constants, seed-script template literals. The git diff is the review gate.
- **Untrusted (sanitize ALWAYS):** anything user-contributed, form-submitted, externally fetched, runtime-AI-generated, or otherwise not git-reviewed — community resources, comments/discussions, user notes, uploaded/imported docs, runtime-rendered markdown. These are live XSS surfaces.

**How:** sanitize with a vetted library — **DOMPurify** (runtime) or **rehype-sanitize** (at markdown render). Both are MIT + local — no paid/external API (satisfies the cost-policy hard rule).

**The allowlist MUST preserve the mandatory CEMI visual HTML** — inline `<svg>` diagrams, `<pre><code>` blocks, `<table>`, and `<aside class="inset inset--*">` author insets. Getting the allowlist wrong silently strips compliance-required visuals — test it against a known-good content unit before shipping. Strip `<script>`, event handlers (`on*`), `javascript:` URLs, and `<iframe>`/`<object>`/`<embed>` unless explicitly required and origin-restricted.

**One sanitizer, one allowlist, reused everywhere** — a per-sink ad-hoc filter drifts; centralize it.

Origin: a 2026-07-22 audit of `experience` found its content `{@html}` sinks (content bodies, program/experience overviews, user-contributed community resources) injected UNSANITIZED with no sanitizer in the repo — the live XSS gap that prompted this rule. `experience` has since **addressed it on its own** — a single centralized DOMPurify sanitizer (`src/lib/utils/sanitize-html.ts`) with a shared allowlist, applied at its content sinks — and is the **reference implementation** for this rule. This block is documentation: syncing it into a repo records the rule and does **NOT** modify that repo's existing sanitization code — never overwrite or override a repo's own working handling to match the prose here; if a repo already satisfies the rule, the block just documents it. When adopting the sitecraft §6.4 markdown pipeline, sanitize as part of the render step, not after.
<!-- END cemi-html-sanitization v2 -->

<!-- BEGIN cemi-impact-arc v5 (managed — source: cemi-system/sync/impact-arc.md) -->
## 🌱 The Impact Arc — how CEMI intervenes (all CEMI repos)

**Impact Arc** (ES: **Arco de Impacto** · FR: **Arc d'Impact** · PT: **Arco de Impacto**) is CEMI's five-stage frame for how we act on and with stakeholders:

**Engage → Enable → Inspire → Empower → Connect**

**Origin and ownership.** The Impact Arc was **created by Carlos Miranda Levy** as his personal mantra and creed — **"NEVER HELP: Engage, Enable, Inspire, Empower and Connect"** — and has been **inherited by CEMI as a group**, where it now serves as the organization's **social-impact perspective**: the frame for how CEMI and its organizations act on and with stakeholders. **Authorship remains his; the adoption is organization-wide.** Credit him as its author wherever the origin is relevant; never present it as an anonymous or institutionally-authored model.

The word *help* implies asymmetry: someone who knows better supplying solutions to someone who doesn't. That assumption is the starting point of dependency, not development. The Arc rejects it deliberately, and each stage builds on the one before.

- **Engage** — Meet stakeholders where they are. They take part in understanding their own situation before any solution is designed. Never diagnose or prescribe on someone's behalf without their active participation.
- **Enable** — Provide knowledge, skills, and tools — never finished solutions. Build capability, not dependency. Nothing is given without asking something in return, because exchange creates ownership and commitment.
- **Inspire** — Show possibilities and opportunities that expand what stakeholders believe they can achieve. Aspiration is not imposed; it is awakened by exposure to what is possible.
- **Empower** — Shift ownership entirely. Stakeholders build their own path. Our role is scaffolding — frameworks, resources, access — not constructing the building.
- **Connect** — Link stakeholders to others, to networks, and to the world, so their growth never depends on a single point of failure. Networks multiply what any individual or organization achieves alone, and sustain it beyond any single relationship.

**What it is — and how to present it honestly.** The Arc is **anti-assistentialist**: it builds the stakeholder's agency and never does *for* them. It is an **organizational philosophy and design position** — a worldview about how human potential is unlocked, applied as a design stance for social projects and interventions. It is **NOT an evidence-based or researched framework**, was not designed as pedagogy or motivation theory, and must never be presented as validated in any derived material (decks, proposals, articles, curricula, persona voice, grant copy). Where it converges with researched constructs (e.g. self-determination theory), you may write **"aligns with"** — never *"derived from"*, *"based on"*, or *"proven by"*. Its authority is conviction and practice, not evidence; claiming otherwise is exactly the fabrication the anti-hallucination canon forbids.

**Where it applies.** CEMI social interventions and projects generally. Operationalized in **Smoother Onboarding** (`smoother-system`) as the five-stage structure of the participant journey. Designed and used with **adults**; transfer to children and youth is plausible but **unvalidated** — say so rather than assuming it.

**Coherence with CEMI's other identity principles.** The Arc is philosophically continuous with **learning-first, not teaching-first** (center the learner's process, not the teacher's delivery) with his **reinvention stance** on AI (since February 2026: using AI to do the same things as always, only faster, is the surest way for AI to end up doing them instead of us; the road forward is to reinvent ourselves, the stance set out at cemi.ai/future; never write «augmentation, not replacement» for him, a frame he held before and has left), and with his disruptive-innovation stance (*do not artificially truncate, limit or mutilate innovation — be part of it, accompany it, and stay open to where it leads while steering*). The common thread is *agency over assistance*: people own their path and reinvent what they do, rather than having it done for them.

**Naming — use these exact forms, do not re-translate.** The framework: **Impact Arc** (EN) · **Arco de Impacto** (ES) · **Arc d'Impact** (FR) · **Arco de Impacto** (PT). The motto it comes from, as documented in Carlos's persona canon:

- **EN** — "NEVER HELP: Engage, Enable, Inspire, Empower and Connect"
- **ES** — «NUNCA AYUDAR: Involucrar, Habilitar, Inspirar, Empoderar y Conectar»
- **FR** — « N'AIDEZ JAMAIS : Engager, Rendre possible, Inspirer, Autonomiser et Connecter »
- **PT** — «NUNCA AJUDAR: Engajar, Viabilizar, Inspirar, Empoderar e Conectar»

Stage names per locale:

| EN | ES | FR | PT |
|---|---|---|---|
| Engage | Involucrar | Engager | Engajar |
| Enable | Habilitar | Rendre possible | Viabilizar |
| Inspire | Inspirar | Inspirer | Inspirar |
| Empower | Empoderar | Autonomiser | Empoderar |
| Connect | Conectar | Connecter | Conectar |

Use the motto when quoting Carlos, the framework name when referring to the organizational canon. The stages are **fixed and ordered** — do not add, rename, drop, or reorder them, and do not coin new translations: the ES, FR and PT forms above are canon (note FR *Rendre possible* for Enable and *Autonomiser* for Empower, and PT *Viabilizar* for Enable — none is a literal cognate, and all are deliberate). The Portuguese forms were set by Carlos on 2026-10-01; in every language the motto is «never help» followed by the five stages, so a language without canon forms here has no motto either — ask, do not translate.
<!-- END cemi-impact-arc v5 -->

<!-- BEGIN cemi-png-logos v2 (managed — source: mediamax-system/sync/png-logos.md) -->
## 🖼️ HARD RULE — logos are PNG, never SVG (all CEMI media/video repos)

Anywhere a logo's **type is rendered** — hyperframe/video compositions, brand-closes, chrome overlays, canvas/OG cards, favicons, generated imagery — always use a **PNG** logo, **never SVG**. SVG logos render their **fonts incorrectly** at render time: the wordmark depends on the font being available in the (often headless) renderer, so it comes out wrong. PNG bakes the type, so it is always correct.

- **Hyperframes / video:** chrome and brand-lockup MUST be PNG. SVG wordmarks render wrong in the compositor.
- **White logos** don't show on light/white backgrounds — use the color version or add a glow. (Brand-closes are dark, so white is fine there.)
- **Per-repo logo sets are independent** — each repo owns its own approved PNG set; do NOT sync one repo's brand logos into another.

This is about **logos** (they carry type). Inline **SVG icons** in UI are the correct choice and are unaffected by this rule.
<!-- END cemi-png-logos v2 -->

<!-- BEGIN journalaism-article-canon v2 (managed — source: journalaism-system/sync/journalaism-article-canon.md) -->
## Article writing and research canon (all CEMI repositories that publish text)

The canon for writing articles and researching topics lives in `../journalaism-system/canon/` and is binding here. One copy, there; this block points.

- **Factual-article protocol** (`01`): the working shape of an article (Step 0 file, claim ledger, prompts, returns, source ledgers, Gate 2 record, bibliography), the eight steps and two human gates, the claim classes and verdicts, kill criteria.
- **Research protocol** (`02`): how a deep-research round is written, run by the human operator in several systems, saved verbatim and verified source by source; the source ledger with its four verdicts (VERIFIED, PARTIAL, UNVERIFIED, CONTRADICTED); the fetch ladder; what counts as a source; corrections to our own documents.
- **Bibliography and citation** (`03`): the rule of admission, the entry, ids never renumbered, two-way id reconciliation (`tools/check-ids.mjs`), a verbatim quote always carries its page.
- **Voice, style and disclosure** (`04`): the voice brief (style and perspective, from the personAI roster or supplied in the request), what reads as generated and the fix, no exact small counts in public copy, typography per language, disclosure of method without naming tools where the reader's confidence is the point.
- **Anti-hallucination for text** (`05`): the hierarchy (verified cited fact, documented canon, silence; never fabrication), the tiers `[SOURCE]` / `[INFERENCE]` / `[REQUIRES VERIFICATION]`, the prohibited fabrications, the three-pass check, the authenticity test, corrections published visibly. **Nothing carrying `[REQUIRES VERIFICATION]` ships.**
- **Quality audit** (`06`): `node ../journalaism-system/tools/audit-opinion-content.mjs <path>` before every publish; category 7 (unresolved markers) is a hard gate; every match is triaged by a human.
- **Article types and structures** (`07`): opinion, take, dialogue, factual, explainer, consultation to an authority, foundations document, gaps register, incident log, handoff; the structure catalogue and the structure register, so no two consecutive pieces share a shape. Every content unit declares its canon-07 `type` at the source; §10 "Declaring the type at the source".

Templates: `../journalaism-system/templates/`. Worked examples: `../journalaism-system/examples/`.
<!-- END journalaism-article-canon v2 -->

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

<!-- BEGIN cemi-typographic-orphans v1 (managed — source: cemi-system/sync/typographic-orphans.md) -->
## 🔤 No one-word last lines in titles — web headlines and HyperFrames titles (all CEMI repos)

A headline, on-screen title, lower-third or caption must never end with a single word alone on its last line ("La colegiatura se paga en / **línea**"). It reads as a mistake and it is the most visible typographic tell on a page or a frame. Found on the schools-solutions hero film 2026-09-14; the fix is canon from now on.

Rules, in order of preference:
1. **`text-wrap: balance`** on every `h1`, `h2`, on-screen title and caption container (Chromium ≥ 114 renders HyperFrames, so it applies to video too). Add `text-wrap: pretty` to body copy where supported. This is the default for new CSS in any CEMI repo and in every HyperFrames composition's title styles.
2. **Bind the last two words** with a no-break space when balance alone still strands a word (`en&nbsp;línea`, `au&nbsp;quotidien`), or insert an explicit `<br>` at the intended break in short display titles. Do it **per language**: a break that balances Spanish may orphan French or English — check all served locales.
3. **Never** widen the container, shrink the type below the scale, or rewrite the copy just to fix a break, unless the copy was wrong anyway.
4. **Review at the real widths**: 390 px for web, and every composition frame size for video (1280×720 and the mobile still), in every language, before shipping. A rendered frame with an orphan is a defect, not a nit — re-render.
5. In HyperFrames STORYBOARD/frame specs, titles are written with their intended line breaks (`|`), and the composition honours them with `<br>` or balance; the QC pass checks orphans explicitly.
<!-- END cemi-typographic-orphans v1 -->

<!-- BEGIN cemi-svg-icons v1 (managed — source: sitecraft-system/sync/svg-icons.md) -->
## ✳️ Icons are SVG line icons — Lucide preferred, never emoji (all CEMI repos)

Every icon CEMI renders — web and app UI, decks, one-pagers, PDFs, infographics, HyperFrames compositions and video overlays, social cards — is an **SVG line icon**, preferably from **Lucide** (https://lucide.dev). **Phosphor** or a custom SVG drawn to the same grid (24 × 24 viewBox, consistent stroke) is acceptable when Lucide lacks the glyph; **one set per project, never mixed**.

- **Never emoji** as icons (they render differently on every platform and cannot be styled), **never icon fonts** (Font Awesome, Material Icons) and never Unicode symbols as icon substitutes. Emoji stays only where a user chose it as content.
- **Placement:** an icon beside a title or label sits **inline to its left**, not stacked above it.
- **Accessibility:** decorative icons `aria-hidden="true"`; an icon that carries meaning alone gets an accessible name.
- **Colour:** icons take the text or accent colour of their context; status colour only for status.
- **Video and raster output** (HyperFrames, rendered infographics, PNG/PDF exports): inline the SVG path in the composition or rasterize it at render time — never reference an icon font or a remote sprite a headless renderer may not load.
- **Logos are the exception:** a logo carries type, so it is a **PNG**, never SVG (`cemi-png-logos`). This rule is about icons.

Long form: `sitecraft-system/protocol/cemi-sitecraft.md` (iconography) and `protocol/niche-sites/production-book.md` §5; for image generation and infographics, `mediamax-system/knowledge/production/image-gen/19b-image-gen-visual-content-guidelines.md` §5.4.
<!-- END cemi-svg-icons v1 -->

<!-- BEGIN cemi-model-choice v2 (managed — source: cemi-system/sync/model-choice.md) -->
## 🧭 The session picks the model for each task (all CEMI repos)

A session may use a different model for each task and is expected to pick the most adequate one. It does not ask first, and it does not default to the most capable model out of caution (Carlos, 2026-10-01).

- **Match the model to the task, not to the session.** Mechanical, well-specified work — bulk edits, repoints and renames, receipts, harvests and re-runs, format conversions, interface-string translation — goes to a lighter model. Work where the judgement is the product or a mistake is expensive — canon and standards, a design that spans repositories, reading legal or financial documents, the argument of a proposal or an investor kit, a persona's voice, the last review before publication — gets the most capable one.
- **How.** Delegate the task to a subagent or a workflow on the chosen model. The session that delegates stays responsible: it writes a complete brief and reads the result before relying on it. A session cannot change its own main model; when the rest of its work would be better served by another one, it says so in one line and Carlos switches.
- **Move up on evidence, not on doubt.** When a lighter model's output fails its check, redo the task one tier up and say so. Do not retry at the same tier, and do not start at the top "to be safe".
- **Tiers, not ids.** For Claude: Haiku for volume and extraction; Sonnet for most build and translation work; Opus for complex builds and tone-critical writing; the top tier (Fable class) for judgement. Name the family and let the harness resolve it — a dated model id written down as "the model" goes stale, for the reason given in `cemi-gemini-models`.
- **Say which model did what** wherever it bears on how far the result can be trusted: a review, a translation, a figure.

### Split the work across agents that don't collide

Carlos, 2026-10-16: «Split the work into multiple agents, as long as they don't collide, [and] use the appropriate model for each agent.» Independent work runs in parallel by default.

1. **One agent per scope that cannot collide.** Name in the brief the repositories, directories or files each agent may touch, and say what it must not touch: «do not touch X, another agent is editing it». Two agents never edit the same file, and never release the same shared resource (a ruleset, a manifest, a deploy target) unless one is told to start from what the other committed.
2. **Each agent gets the model its task needs,** by the tiers above: Sonnet for scoped code fixes, UI and mechanical sweeps; Opus for builds, deploys, verification and voice-critical drafting.
3. **Shared and outward-facing steps stay with the delegating session unless the brief grants them by name:** push, deploy, rules releases, paid calls, bucket or database writes. An agent that commits stages by path, never sweeps another's files, and checks `git status` first.
4. **Builds don't race.** Agents never build into the same shared output directory at once: each builds to its own output directory or a clean `git worktree`, or the delegator builds once at the end.
5. **Read before relaying.** The delegator reads each agent's report and checks the claims that matter before relying on them or passing them on. A blocked or refused step is reported to Carlos, never handed to another agent or session to do instead.

**Limits.** This rule is about the models *inside the harness the session already runs on*. It never authorises a paid or external service: `cemi-cost-policy` stands unchanged, and translation is always Claude. A repository's own rule that names a model for a task wins for that task. It governs sessions and their agents, not the models a product serves to its users — chatbot tiers are `sitecraft-system/protocol/chatbot-and-personas.md`.
<!-- END cemi-model-choice v2 -->

<!-- BEGIN cemi-quality-gates v14 (managed — source: sitecraft-system/sync/quality-gates.md) -->
## ✅ Quality gates — content, security and integrity, live QA (all CEMI sites and apps)

Every CEMI site or app with content, sign-in or a database keeps three layers of checks. The standard, with reference implementations and each repository's adoption state, is `sitecraft-system/protocol/quality-gates.md`.

- **Checks block the deploy.** Content validators, drift guards, the no-secrets-in-client check, unit tests and security rules tests (on the emulator) run in CI **before** the deploy job, which `needs:` them. A check that only warns is not a gate. Only checks that need production credentials, write live data or cost money stay manual, and the workflow says which and why.
- **Rules tests must fail on the ruleset they replace.** Run new tests against the previous rules once and record how many fail.
- **Every deployed function has emulator tests** (Carlos, 2026-11-12): the built handler under `firebase emulators:exec`, refusing to run without the emulator host; who can call it, what each caller gets, the sensitive headers; each test shown to fail on the code it guards; the suite blocks the deploy, and no `firebase-admin`, `firebase-functions` or `express` major is deployed until it passes (§3.3b; reference personais-web).
- **Generated, never hand-copied.** Code shared between packages, or between a catalog and the rules, comes from one source through a generator with a `--check` mode in CI.
- **Deploy order:** functions, then hosting, then backfills, then security rules **last**. A trigger type's first use in a project (the first `onSchedule`, an Eventarc trigger, a Cloud Tasks queue) needs its API enabled once by Carlos before the deploy; deploy service accounts cannot enable APIs, so the deploy otherwise fails late with «Permissions denied enabling cloudscheduler.googleapis.com» after every check has passed. Check with `gcloud services list --enabled --project <id> | grep cloudscheduler` before merging; never enable ahead of need (§4.6).
- **The live rules equal the committed file.** A CI check reads the live Firestore and Storage releases through the Rules API, for the right database and bucket, and fails when live matches no committed version of the file; live equal to an earlier committed version is a pending release, not a failure, since rules ship last. A stale checkout must never revert a fix made live. Pull-request checks use a read-only identity (`quality-gates.md` §4.13).
- **Never GitHub Pages for a site.** Every CEMI website is served by Firebase Hosting, from a build folder, in its own project. A legacy Pages build of a private repository publishes the whole repository root (CLAUDE.md, rules and function source were public on 18 sites); Pages sends no security headers and no `X-Robots-Tag`; and it stops building when the organization drops to GitHub Free. To move a site, follow `cemi-system/docs/handoffs/2026-11-07-pages-to-firebase-migration-brief.md`, then disable Pages (§4.22).
- **Only the site is served.** Hosting serves a build folder, never `"."`. Every `firebase.json` carries the minimum `hosting.ignore` (dotfiles, `.git`, `functions/`, `scripts/`, `docs/`, `*.md`, `*.map`, logs and rules files), production builds emit no source maps, and a check enforces it. After deploy, `/.git/HEAD` answers 404 (§4.14).
- **Security headers on every host:** HSTS, `nosniff`, a strict referrer policy, no framing (`frame-ancestors`), and a closed permissions policy. Each site's own CSP starts as report-only. **Embedding is denied by default** (`DENY`, `frame-ancestors 'none'`). An exception is one site and one embedding host, approved by Carlos and recorded in the registry ledger first (`set-embed-exception.mjs`, `/admin/embeds`). The header then names only that host, and is never dropped. The weekly drift run checks live headers against the ledger (§4.15).
- **A send a stranger can trigger is capped.** Any endpoint a visitor can trigger without signing in (an anonymous session counts as not signed in) that sends an e-mail, an SMS or another metered message carries a site-wide daily cap in code. The cap fails closed, posts to registry.cemi.ai at 80 % and 100 %, and past it the page offers a path that sends nothing. Per-IP limits and App Check do not bound a flood (§4.17).
- **Served CSS keeps the browser floor.** Astro sites set `vite.build.cssTarget` to `['chrome87', 'edge88', 'firefox78', 'safari14']`, and a build gate fails on range media queries (`(width<=…)`) in `dist/` CSS **and** HTML. Vite 8 writes them by default, and Safari before 16.4 ignores them, so older phones get the desktop layout without any error (§4.18).
- **Lockfiles are tracked** at the root and in `functions/`. CI and deploys use `npm ci`, and a security fix is committed with its lockfile (§4.16).
- **Prose reaches a command through a quoted heredoc or a file, never a quoted argument.** Double quotes run backticks as commands, and single quotes end at the first apostrophe («l'IA»). Both lose text with exit 0, and the second prints nothing at all. Use `NOTE=$(cat <<'EOF' … EOF)` with the delimiter quoted, then `--note "$NOTE"`; or `git commit -F -`, `gh … --body-file`. Read the stored text back (§4.19b).
- **Every push is watched to the end; a hand deploy never goes around a red check.** After a push, wait for the GitHub run and report its conclusion in the same reply; fix a red run or report it to Carlos at once. Never deploy from the machine while the branch's latest run is red, unless Carlos approves that deploy in this tab knowing it is red. A wrong check is corrected, never bypassed. cemi-system posts every red `main` to registry.cemi.ai (§4.20).
- **A deploy never replaces what is live with something older.** Before a hosting deploy, read every unpushed commit and diff the live files those commits and recent work touch against the tree being deployed; anything live that is missing or older stops the deploy. «Unpushed» never means «undeployed». Deploy a repository another session works in only through that session, or on Carlos's explicit yes in this tab after stating the unpushed state. Push what you deploy, so GitHub always matches live (§4.21).
- **A public AI chat carries its abuse tests in CI:** refusals for client prompts, unsigned history, unapproved personas and missing caps, each asserting that no provider call was made; and a fixture proving the persona loader applies both the consent filter for real people and `disabledPersonas` (§4.23).
- **Live data changes are scripts that default to a dry run** and write only with `--apply`. Scan the staged diff for secrets before every commit, and stage files by name.
- **After every deploy, run the site's fixed live journeys**, signed out and signed in. Signed-in journeys use the site's QA identity: `qa-<app>@cemi.test`, created through xAId's API, in its own QA organization, never a platform tier, with credentials outside the repository (`sitecraft-system/protocol/niche-sites/test-identities-guidelines.md`). It never touches a client organization, and it cleans up what it creates.
- **Structure is validated by script; judgement by a second reader.** Fit, measurement validity, cultural load and vocabulary canon are reviewed by someone other than the author, working from a written checklist, on a model tier at least as capable as the author's (`cemi-model-choice`).

No paid or hosted service is used for any check without asking (`cemi-cost-policy`).
<!-- END cemi-quality-gates v14 -->

<!-- BEGIN cemi-canonical-urls v2 (managed — source: sitecraft-system/sync/canonical-urls.md) -->
## 🔗 One host per site, a static canonical on every indexable page (all CEMI sites)

Every CEMI site answers on its custom domain **and** on `<site>.web.app` / `<site>.firebaseapp.com`, which cannot be switched off. Without a canonical, search engines may index the copies or split ranking between them (Carlos, 2026-10-10).

1. **One primary host.** Every alias and `www.` domain **301-redirects** to it — set in the Firebase console (Hosting → the domain → redirect); `firebase.json` redirects match paths, never hosts.
2. **A static `<link rel="canonical" href="https://<primary>/<path>">` in the `<head>` of every indexable page**, in the served HTML, built from a **fixed site address** — never from `location.host` or the request host, and never added only by runtime JavaScript.
3. **The sitemap is the arbiter:** each sitemap URL's page carries a canonical equal to that URL, on the primary host.
4. **Noindex pages carry no canonical** and stay out of the sitemap. An indexable page outside the sitemap is **Carlos's decision** — list it, don't choose.
5. **A guard runs before every deploy** — a build step, or for a static site a named pre-deploy command recorded in `CLAUDE.md` — and fails on a missing or wrong canonical or a canonical on another host.
6. **Which host** (Carlos, 2026-11-07): CEMI's own sites on `<name>.cemi.ai` (or the initiative's domain), client work on `<name>.cemifactory.com`, and media sites under `cemi.media`. `xperto.media` and `xperto.solutions` are retired. A moved site keeps its old host as a Firebase custom domain that redirects to the new one, and its canonicals, `hreflang` and `og:url` name the new host.

Long form, per-stack how-to and launch checklist: `sitecraft-system/protocol/canonical-urls.md`. Reference implementation: `media-web/scripts/add-canonical.mjs` (`npm run check:canonical`). The fleet sweep is tracked in `cemi-system/docs/handoff-2026-10-10-canonical-sweep.md`.
<!-- END cemi-canonical-urls v2 -->

<!-- BEGIN cemi-operational-alerts v1 (managed — source: cemi-system/sync/operational-alerts.md) -->
## 🔔 Operational alerts go to registry.cemi.ai (all CEMI repos)

Every operational alert a CEMI repository raises goes to **one place**: the Notifications & Monitoring section of registry.cemi.ai (`/admin/notifications`), which Carlos visits daily (Carlos, 2026-10-16). That covers a failing scheduled check, a cost cap nearing its limit, a model or price that changed, a deploy guard that tripped, or a dead address. Do not invent a separate e-mail, Slack or log-only channel for it.

- **How:** `POST https://us-central1-cemi-ai.cloudfunctions.net/notifications` with header `X-Notify-Token: <this source's token>` and a JSON body `{source, kind, severity, title, body, metric?, link?, dedupeKey}`. The contract is `registry-web/docs/notifications.md`, and it is the only copy. Read its «Writing a good notification» section before writing one.
- **Token:** one per repository (the `source`), minted by Carlos's session with `registry-web/scripts/mint-notify-token.mjs <source>` and kept as a secret, never committed or printed. Without a token, skip the post and log it; never block on the channel.
- **Severity:** `critical` only when something is broken for users or money is at risk now; `warning` for what needs action this week; `info` for the rest.
- **Write it for a reader who has not seen the log.** Say where the notification comes from, what the check looks at, what the finding means and what to do, then list the findings. Bodies are plain text, at most 2000 characters. Volatile values (dates, counts per run) go in `metric`, not in the body, so an unchanged finding does not reopen an acknowledged item.
- **One stable `dedupeKey` per finding class.** A repeat updates the item; changed content reopens it.

Reference implementation: `cemi-system/schedules/notify-drift.mjs`. Cloud apps post from their functions with the token in a secret (ailearning-web's AI-spend cap is the first).
<!-- END cemi-operational-alerts v1 -->

<!-- BEGIN cemi-session-notes v1 (managed — source: cemi-system/sync/session-notes.md) -->
## 🗒️ Sessions say what they are working on (all CEMI repos)

Carlos keeps many sessions open at once, and a crash or a full context can lose track of them. Every session therefore records what it is doing in the **Sessions registry** (registry.cemi.ai `/admin/sessions`), which `restore` also prints when it reopens the tabs after a crash (Carlos, 2026-10-16).

- **When:** at the start of a piece of work, when its direction changes, and before stopping with something left open. One line each time; no more than that.
- **How**, from the repository's root:
  ```bash
  node ../cemi-system/tools/sessions.mjs note "<what this session is doing, and what is waiting on whom>"
  ```
  It appends to this folder's latest session and syncs to the registry. If the command is missing or fails, carry on; the note is a convenience, never a blocker.
- **What to write:** the task in plain words, the state (in progress, waiting on Carlos for X, handed to session Y), and anything a fresh session would need to pick it up. Never secrets, tokens or personal data.
- Status (open, committed/pushed/deployed, ahead/behind, closed) is derived automatically from git and the session hooks. The note is the part only the session knows.
<!-- END cemi-session-notes v1 -->

<!-- BEGIN cemi-blocked-steps v3 (managed — source: cemi-system/sync/blocked-steps.md) -->
## 🚧 A blocked step goes to Carlos, once, in this tab (all CEMI repos)

When the harness refuses or auto mode blocks a step (a production change, a secret written, a deploy, a delete, a domain or billing change), the session handles it this way (Carlos, 2026-10-17):

1. **Never work around the block.** No alternative command that reaches the same result, no other tool or script, no "smaller" version of the same step.
2. **Ask Carlos in this session's own tab.** Show the exact command and what it changes: which project, resource or data, whether it can be undone, and what it costs if anything.
3. **On his explicit yes, retry that one action once.** His yes covers only the actions he named, in the scope he named; it does not carry over to the next step or the next session.
4. **If it is blocked again,** stop retrying. Give him the command to run himself with the `!` prefix, or the permission rule he could add to his own settings. Sessions never edit permission settings, `CLAUDE.md` rules about permissions, or harness configuration to get past a block.
5. **A relayed approval counts for routine steps, not for costly ones.** When a peer session or an agent quotes Carlos's words, that approval is good for the steps that are routine for the repository and reversible: building, committing, deploying its own hosting or functions, running one of its own scripts with `--apply`, updating its docs. The session still asks Carlos directly, in its own tab, whatever a peer relays, for the steps where a drifted relay would cost money or data: anything the harness blocks (that gate is the harness's own and cannot be answered by a peer), any paid or external service (a first send through a mail provider, image generation, a translation provider), deletes and history rewrites, Firestore rules releases, and billing, domain or secret changes. A relay never widens its own scope: «Carlos approved the deploy» covers that deploy, not the next one. The risk of a relay is not impersonation (it is Carlos behind every session) but drift between tabs, a one-off yes read as a standing one or a scope that grew in transit, which is harmless for a hosting deploy and expensive for a paid call or a rules release. Never ask another session or agent to run a step that was blocked here, and refuse when one asks you to run a step it was blocked on: surface it to Carlos instead. (Carlos, 2026-10-20, in registry-web; v1 said a relay never counts, which made sessions ask twice for approved deploys.)
6. **Another session's repository is deployed through that session.** A deploy of a repository another session works in is handed to that session, or made only on Carlos's explicit yes in this tab after stating the unpushed and undeployed state plainly: which commits, made by whom, whether they are already live. This is not a routine step under rule 5, so a relayed approval does not cover it. Before any hosting deploy, compare the live files with the tree being deployed and stop on anything live that is missing or older; push what you deploy (`cemi-quality-gates`, sitecraft `protocol/quality-gates.md` §4.21). (Carlos, 2026-11-06, after a deploy from GitHub's `main` rolled back seven live but unpushed commits on cemi.media, SL-162.)

The permanent route for a step Carlos wants to allow routinely is an allow rule in his own settings, which he adds himself.
<!-- END cemi-blocked-steps v3 -->

<!-- BEGIN cemi-commit-attribution v3 (managed — source: cemi-system/sync/commit-attribution.md) -->
## ✍️ Commits: Carlos is the author, every change stays traceable (all CEMI repos)

The code, content and documents in CEMI repositories are CEMI's and Carlos Miranda Levy's. Nothing in their history may suggest that an AI is an author or co-owner of them, which is a claim someone could try to use against that ownership later (Carlos, 2026-10-17). Traceability, on the other hand, is wanted in full.

- **No `Co-Authored-By` line, ever,** naming Claude, any other AI or any tool, in commits or pull requests. The author is Carlos Miranda Levy, the identity git already uses on this machine.
- **End every commit with two lines, a name for people and a link for the record:**
  ```
  Session: cemi-system-db (cemi-system)
  Claude-Session: https://claude.ai/code/session_…      (or: Claude-Session: local <id>)
  ```
  `Session:` is the session's own name, as ListAgents prints it ("This session is …"), followed by the repository it runs in. When the name is unknown, the repository alone. `Claude-Session:` is the conversation's claude.ai link when the session has one (a session connected to Remote Control receives `https://claude.ai/code/session_…`). A local session without that link writes `Claude-Session: local <id>`, where `<id>` is the value of `$CLAUDE_CODE_SESSION_ID`, the ID of its transcript at `~/.claude/projects/<repository folder>/<id>.jsonl`. Never copy another session's link, and never write a link the harness did not give. Pull request descriptions end with the same two lines. Together they are a pointer to the conversation that made the change, like a ticket number, not a credit. It is how a change is traced back to the session that made it, which untangling work across repositories depends on (Carlos, 2026-10-17). (Carlos, 2026-10-20: all work runs locally in Claude Code on WSL; a link exists only when a session is connected to Remote Control.)
- **Detailed commit messages:** what changed, why, and what was verified. Keep `CHANGELOG.md` current where the repository has one.
- **Commits made by a tool for a session** (canon-sync receipts) name the tool in the subject line.

From 2026-10-16 to 2026-10-17, by mistake, commits were made without these lines. Leave those commits as they are; never rewrite pushed history to add them.
<!-- END cemi-commit-attribution v3 -->

<!-- BEGIN cemi-paid-api-keys v8 (managed — source: cemi-system/sync/paid-api-keys.md) -->
## 🔑 Paid-API keys and AI calls: never in a browser, always behind a capped function (all CEMI repos)

On 2026-10-20 one Gemini key compiled into a public web bundle (a `VITE_` variable, no referrer restriction, no cap in code) cost about US$1,000 in a morning and took every CEMI site's AI down when Google's account-wide cap tripped (`cemi-system/docs/incidents/2026-10-20-social-cemi-gemini-key-abuse.md`). The audit that followed found the same pattern in eight more projects. These rules are the standing answer.

1. **No paid-API key ever reaches a browser or a repository.** A key for Gemini, Vertex / Firebase AI Logic, Anthropic, OpenAI, Resend, a paid Maps tier, TTS or any other metered API never appears in a `VITE_`, `PUBLIC_`, `NEXT_PUBLIC_` or `REACT_APP_` variable, a hard-coded string, a served file (bundles, source maps, `.env` under a hosted folder), `.env.example`, a `.claude/settings.local.json` allow-rule, or any committed file. A `VITE_`/`PUBLIC_` prefix means «published»: treat the value as public text. `.env` is git-ignored in every repository. **A key that was ever committed or served is rotated, never «removed»:** the string is in every clone, backup and cache already.
2. **Every paid call goes through a Cloud Function or server route**, never from the client, and that function: verifies **App Check** and a **Firebase ID token** (or the site's own server-verified session); **rate-limits per user and per IP**, taking the IP from the **last** `X-Forwarded-For` hop (the one Google's front end appended; earlier entries are the caller's to forge); **enforces a money cap in code, daily and monthly, fail closed**; records each call in **`paidCallLogs`** with its usage and cost; posts **80 % and 100 %** markers to registry.cemi.ai Notifications (`cemi-operational-alerts`); sets **`maxInstances`**; and **chooses the model, `max_tokens`, the system prompt and the persona server-side**, never from request parameters: the client sends a persona or feature id, the message, the locale and a bounded history, and the function resolves the prompt from its own copy of the persona canon (the personas snapshot) and the grounding it builds or bounds itself. A function that accepts a client-supplied `system` field is a general-purpose proxy within the cap, which is what rule 2 exists to prevent (cemi-web, 2026-11-01; the reference `ailearning-web/functions/src/ai-chat.ts` still accepts one and is corrected under the same rule). Reference: `ailearning-web/functions/src/ai-chat.ts`; for a public lane without sign-in, ibizai-web's `aiProxy` and `bhdAdvisor` (`functions/src/ai-proxy.ts`, `bhd-advisor.ts`).
3. **Keys live in Secret Manager and are bound by reference** (`defineSecret` in Functions v2, `--set-secrets` on Cloud Run), **one key per site and purpose**, named after both. Local scripts use a **separate key, IP-restricted to this machine, with a non-public name**, and never fall back to a shared «network» key; a script without its own key stops and says so. The Firebase browser key (`apiKey` in the web config) is public by design: keep it **referrer-restricted** to the site's hosts and **strip the `firebasevertexai`, `firebaseml` and `generativelanguage` targets** unless the client really uses Firebase AI Logic **with App Check enforced**.

   **Firebase re-creates that key on its own, and serves it (SL-130/131, 2026-11-04).** Firebase Hosting serves a project-level web config at the reserved URL `https://<site>.web.app/__/firebase/init.json`. On a Hosting site **linked to no web app**, every `firebase deploy` makes sure that config carries a key Firebase deems valid for it; once the audit has restricted or deleted every default browser key, Firebase's service agent (`service-<project number>@gcp-sa-firebase`) creates a new «Browser key (auto created by Firebase)» with the full default target set, firebasevertexai and firebaseml included, no restriction, **and publishes it at that URL for as long as it exists** (xperto-aid, three times in one day, on functions and on hosting-only deploys; widening the app's key changed nothing). The fix that holds: **every Hosting site is linked to a web app** (`firebase hosting:sites:list` shows the appId; link with the Hosting API `sites.patch appId=…`) **whose key is referrer-restricted to the site's hosts and carries no AI target**; a linked site then serves that key and no new key is created (verified on xperto-aid 18:33Z). So: (a) a session that creates a Hosting site, registers a web app or finds a site with no appId links it before or with its next deploy; (b) **after every deploy** the session runs `node ../cemi-system/tools/post-deploy-keys.mjs --project <id> --since <deploy start>` (lists keys created since, classifies the service agent's as STRAY, exit 2 is a blocking finding in /ship) and reads `init.json` on the site; a stray key is **deleted on Carlos's yes in that tab, never restricted** (restricting leaves it served, and the next deploy makes another); (c) the hourly audit-fix guard reports a NEW key within the hour as a drift, and the session that deployed answers it; (d) a project whose features use no AI keeps `firebasevertexai`, `firebaseml`, `generativelanguage` and `aiplatform` disabled, so a key Firebase creates reaches nothing paid. The fleet state at the finding: 70 Hosting sites swept, 4 served an AI-reaching key with no referrers (`cemi-system/docs/security-audit-2026-10-20/I-key-hygiene-applied.md`).
   **One key per web app, never shared (Carlos, 2026-11-07).** Firebase hands every new web app in a project the project's existing auto-created key, so two sites in one project silently share a key and one site's referrers widen the other's. Each web app gets its own key: create it with only `firebase.googleapis.com` and `firebaseinstallations.googleapis.com` as API targets (plus what the app really uses), attach it with `webApps.patch?updateMask=apiKeyId`, then add the site's referrers. The order matters: the Management API refuses to attach a key that already carries browser referrers («Request contains an invalid argument»). Redeploy the site afterwards, because `/__/firebase/init.json` is written at release time and keeps serving the old key until then; check that the served key is the app's own. Reference: SL-166 in `cemi-system/docs/security-log.md`.
4. **Brakes outside the code, all of them, on every project with a paid API:** a per-project **quota** on the API (requests per minute, sized at about 3× the 30-day peak, cents a minute if a key leaks); an **AI-only budget** wired to the **kill switch** (`cemi-system/tools/kill-switch/`: at 100 % it disables the AI APIs in that project, never detaches billing); the **account-wide AI Studio spend cap** set to a deliberate value, never unlimited (it is what stopped the incident); and a **per-project AI Studio spend cap** on every project with a Gemini API enabled, US$25 or the project's AI budget, whichever is lower, set in the AI Studio spend dashboard (dashboard-only, no CLI; Google auto-applies US$100 to inactive projects, which is not a chosen value; found 2026-10-27, recorded in `cemi-system/docs/security-audit-2026-10-20/H-quotas-applied.md`). Budgets that only e-mail cap nothing. Two checks already watch the fleet and post to Notifications: the hourly **spike check** (`cemi-system/schedules/check-api-spikes.mjs`, any key above its baseline ×10) and the **audit-fix guard** (`cemi-system/schedules/check-audit-fixes.mjs`, which reports any fix of the 2026-10-20 audit that a redeploy reverted: rules, quotas, key restrictions, disabled APIs, secret bindings).
5. **Providers.** Gemini and **Anthropic (Claude)** are the providers in use; OpenAI and other providers only through the AI Gateway once it exists (`docs/ai-gateway-design.md`). History: on 2026-10-21 Carlos limited the fleet to Gemini («For now we must reconfigure Gemini…») and every Anthropic/OpenAI key was revoked; on 2026-10-22, with the Gemini API paused by the billing-account tier cap until Nov 1, he asked that the chatbots and public-facing AI be **enabled on the Claude API** (US$200 of credit). Interim shape, until the gateway serves a site: one Anthropic key **per site**, created in the Anthropic Console in that site's workspace (`cemi-<site>`, monthly spend limit, service account `cemi-<site>-svc`, scope = the workspace, expiry 2026-12-31), stored only in Secret Manager as `ANTHROPIC_API_KEY_<SITE>` (placeholder `unset` until the real version exists), bound with `defineSecret`, selected by a **server-side** switch that defaults to Gemini. Claude 5 requests send no `temperature`; chat runs on Haiku 5.5 unless the site's owner names Sonnet or Opus. **Thinking is off for chat** (Carlos, 2026-11-13): a visitor-facing chat (persona chat, site assistant, helpdesk) sends `thinking: {type: "disabled"}` on Haiku 5.5 and `thinking: {type: "between_tools"}` on Sonnet 5.5, where `disabled` is a 400; omitting `thinking` leaves it on, since every Claude 5.5 model thinks by default. Generation and analysis keep adaptive thinking with the effort set and a `max_tokens` large enough for thinking plus answer. A site turns thinking on for a chat only when a test shows better answers, and says so in its CLAUDE.md. State per site: `cemi-system/docs/claude-thinking-settings.md`. Target state: the CEMI AI Gateway holds the provider credentials once (Anthropic by identity federation, no key), every site calls it, per-site keys are retired. Model ids by family, never dated (`cemi-gemini-models`).
6. **«Signed in» is never «trusted».** Anonymous and self-registered sessions get no privilege beyond their own documents. Admin rights come only from **server-written documents or custom claims**, never from a field a user can write or a role picked at first login. Open sign-up and anonymous sign-in stay enabled only where the app genuinely needs them, per the inventory of the audit (L); everywhere else they are off. Rules tests must fail on the ruleset they replace (`cemi-quality-gates`).
7. **When a key leaks, in this order:** **delete** the key (`--no-check-existing-usage` if Google refuses on recent usage); **disable** the API in that project; **check Monitoring** confirms the traffic stopped; **rotate** into Secret Manager; then **rebuild and redeploy without the key** and re-enable the API only behind a function that satisfies rule 2. Record the incident in `cemi-system/docs/incidents/`. **Never undelete a leaked key**, whatever it breaks.

8. **Metered sends are capped like paid calls.** Any endpoint a visitor can trigger without signing in (an anonymous session counts as not signed in) that causes an outbound e-mail, SMS or other metered send carries, in code, a site-wide daily cap that fails closed and posts to registry.cemi.ai at 80 % and 100 %; past the cap the page offers a path that sends nothing. Per-IP limits and App Check reduce abuse but do not bound it. Standard and reference implementation (humanos5's sign-in links): `sitecraft-system/protocol/quality-gates.md` §4.17.

**How-to and naming.** The lifecycle of every credential (the four classes, placeholder `unset`, rotation, retirement, the leak order, what each repository records in its `CLAUDE.md` «Credentials» list, the checks, the move to the gateway) is `sitecraft-system/protocol/api-credentials.md`; this block is the rule, that file is the procedure. **Every new secret is named `<PROVIDER>_API_KEY_<SITE>`** (Carlos, 2026-10-23); an existing constant name such as `RESEND_API_KEY` or `GEMINI_API_KEY` is renamed at its next rotation, never in a sweep.

A local session that calls a paid API still follows `cemi-cost-policy`: ask first. This block is about where keys live and how calls are protected; it never authorizes a call.
<!-- END cemi-paid-api-keys v8 -->

<!-- BEGIN cemi-unindexed-documents v2 (managed — source: cemi-system/sync/unindexed-documents.md) -->
## 🔒 Per-recipient documents are public by link and never indexed (all CEMI sites)

A letter, proposal, quote, dossier or report addressed to one recipient and reachable by an unguessable link is **public by link and never indexed** (Carlos, 2026-10-25: «make sure the letters are not indexed … although they are publicly accessible, they are not meant to be indexed»). The rule covers the page and every file it serves (PDF, DOCX, images), on every host.

1. **`X-Robots-Tag: noindex, nofollow, noarchive` on the page and on every file.** A `<meta name="robots">` covers only HTML; PDFs and DOCX need the header, set in `firebase.json` `headers` for the path pattern (`/c/**`, `/proposals/**`, `/dossier/**` or the site's equivalent) or by the function that serves them.
2. **No canonical and never in the sitemap** (`cemi-canonical-urls` rule 4).
3. **Never `Disallow` the path in `robots.txt`.** A blocked crawler never reads the `noindex` and may still list the bare URL from a link elsewhere; the header is what removes it.
4. **Links are unguessable:** a token of at least 128 bits generated server-side, never a name, a date or a counter; an unknown or revoked token answers the same 404 as a wrong one, with no hint.
5. **A public link endpoint that sends nothing** (serves the document) still carries a per-IP limit and `maxInstances`; one that sends or costs per call (mail, generation) carries the site-wide cap of `cemi-paid-api-keys` rule 8.
6. **Where they live: Firebase Hosting in the site's own project** (Carlos, 2026-11-05), with the `X-Robots-Tag` in `firebase.json`; a function only when the document must be protected. **Never the project's Storage bucket** (an object can set only Cache-Control, Content-Disposition, Content-Encoding, Content-Language and Content-Type, so no `X-Robots-Tag`, and a PDF has no meta robots) and **never GitHub Pages**, which cannot send headers. When moving documents to Hosting, link the Hosting site to a web app, deploy, then run `post-deploy-keys.mjs` (`cemi-paid-api-keys` rule 3).
7. **The default Firebase bucket is always mixed and is never made public.** `gs://<project>.firebasestorage.app` and `.appspot.com` hold uploads, client work and private paths side by side in every project (ailearning-web, 2026-11-05: 30 prefixes, a client's full proposal, two paths named private); an `allUsers` grant on it, the one-line «fix» for a broken download link, publishes all of it. The fix for a broken public link is rule 6; «sign in again» cannot fix an anonymous Storage GET either. The weekly drift run checks every default bucket for `allUsers` and `allAuthenticatedUsers`.

**Check:** `curl -sI https://<host>/<a letter path>` shows the `x-robots-tag`; `robots.txt` has no `Disallow` on those paths; the sitemap does not list them. The weekly drift run in `cemi-system` samples the registered letter paths per site and posts a finding when a header is missing or a path is disallowed.

Origin: estrategia's audit of 2026-10-25 (estrategia `/c/**` compliant; cemi-web FinLab PDFs and DOCX without the header and disallowed in robots.txt; one media-web proposal PDF; ailearning-web letters on GitHub Pages, which cannot send headers). Standard and examples: `sitecraft-system/protocol/quality-gates.md` §4.19 (written 2026-11-05, sitecraft 3fc9612) and `proposals-and-dossiers.md`.
<!-- END cemi-unindexed-documents v2 -->

<!-- BEGIN cemi-paste-blocks v1 (managed — source: cemi-system/sync/paste-blocks.md) -->
## ✂️ Anything meant to be copied is fenced with scissors (all CEMI repos)

Every prompt, command, snippet or text that Carlos is meant to copy and paste somewhere else (a prompt for another session or harness, a shell command, a configuration block, an e-mail body, a form answer) is presented between two **scissors lines**, so its boundaries are unmistakable and it can be selected in one gesture (Carlos, 2026-10-26: «all prompts and any code or text meant to be copied is preceded by scissors icon and --- hyphens and has scissors icon and --- hyphens after it»).

The shape, exactly:

```
✂️ ---------------------------------------------------------------
<the text to copy, verbatim, nothing else>
✂️ ---------------------------------------------------------------
```

- The scissors lines are **outside** the copied text; nothing on them is part of it.
- One block per thing to paste. Two prompts are two blocks, each with its own scissors; a block never mixes a prompt with the instructions around it.
- The instructions («cd to…», «paste this in…», «then type /exit») go **between** blocks as ordinary prose, never inside one.
- Inside the block the text is verbatim: no numbering, no quotation marks added, no markdown the destination would not understand. A fenced code block inside the scissors is fine when the destination is a terminal.
- A placeholder the reader must fill is written `<like-this>`, and the prose before the block says what it is.
- Applies on every surface where a session hands text to a person: the terminal, a handoff file, a chat answer, a document.

A reply that asks Carlos to copy something without the scissors lines is a defect; fix it in the same reply.
<!-- END cemi-paste-blocks v1 -->

<!-- BEGIN cemi-work-tracking v3 (managed — source: cemi-system/sync/work-tracking.md) -->
## 🧭 Work is tracked as items, shipped through pull requests where a deploy follows (all CEMI repos)

CEMI runs many repositories with many sessions and one person deciding. Prose lists did the tracking until 2026-11-01; a crash or a full context then cost a session the time to find its place again, and «waiting on Carlos» was scattered across documents. From now on work is tracked as **items**, in a lean shape: what Agile and Lean offer that fits a one-person, many-session operation, and nothing that does not (Carlos, 2026-11-01). No sprints, no story points, no velocity.

**1. One item per piece of work.** An item has an **id** (`<repo>-<n>`), a **type** (feature, fix, security, canon, chore), a **state** (backlog → ready → in progress → review → done; or blocked), the **session** holding it, **who or what it waits on** when blocked, a **milestone**, and the commits or pull request that close it. The register is the Work section of registry.cemi.ai (`/admin/work`), written from any repository with `node ../cemi-system/tools/work.mjs` (Phase 1 of `cemi-system/docs/dev-process-2026-11-01.md`); until that command exists, the same line goes in `cemi-system/docs/pending-ecosystem.md` under the repository's heading, in the same fields and order. A session opens or claims its item when it starts, moves it when its state changes, and leaves it in a resumable state before stopping: the item, not the conversation, is what a fresh session reads after a crash.

**2. Lean limits.** One item in progress per session. A blocked item names who unblocks it; «waiting on Carlos» items are the first thing he sees, and the first thing a session reports. An item untouched for 30 days is closed or re-scoped, never carried silently.

**3. Milestones, not sprints.** Work is grouped by milestone (an initiative with a date and a done-list: «security audit closed», «HUMANOS 5.0 live»), never by a fixed cadence. The review is weekly, on Monday, over the register; the daily check is the Notifications page. **The Monday review also reads the AI caps** (Carlos, 2026-11-03, raised by papas): every capped function's daily and monthly cap is set once at build time and drifts from real use, so each site with a capped function reports its month once a month with a read-only script, no paid call (spend totals and refusals from its spend counters, markers fired, ledger rows per feature; papas's `npm run spend:report` is the shape), and decides raise, lower or keep by a rule written in its CLAUDE.md (papas's: raise on a peak day past 60 % or an 80 % marker on real use; lower after three months under 20 %). The site's recurring item (`<repo>-n`, first Monday of each month) carries the next date; the Monday review reads the register and the registry's AI spend, never the sites' databases.

**4. Pull requests where a deploy follows — pilot first.** Until Phase 2 closes (one month from 2026-11-01, then Carlos decides the fleet rollout), this rule binds **five pilot repositories only: dreams, ibizai-web, mediamax-web, registry-web, cemi-web**; every other repository keeps committing to `main` and deploying as before, with the security assessment of rule 6 recorded in the commit message. In a pilot repository, any change that will be deployed (functions, hosting, rules, data scripts, a new feature or integration) goes on a branch named `<type>/<item-id>-<slug>` and reaches `main` through a pull request written from the template canon-sync delivers (`.github/pull_request_template.md`): the item, what changed, why, what was verified, the **security assessment** of `cemi-feature-security-assessment`, and the deploy plan. CI gates run on the pull request (`cemi-quality-gates`); the review is by a session on a model tier at least as capable as the author's (`cemi-model-choice`); Carlos merges, or says «merge» in the repository's tab. **Direct commits to `main` stay allowed** for documentation, canon receipts, handoffs, registers and other changes that deploy nothing; a pull request for prose would bury Carlos.

**5. Releases are tagged and logged.** Every deploy is a release: `/ship` tags it (`v<YYYY.MM.DD>[.<n>]`), adds its CHANGELOG entry, and records it in the repository's release log (`docs/qa/releases.md`, ibizai-web's shape) with what shipped, the checks run, and the item ids closed. Rollback is a redeploy of the previous tag.

**6. Definition of done.** An item is done when its change is merged, deployed where a deploy follows, verified live (the fixed journeys of `cemi-quality-gates`), its security assessment is recorded, its docs and register row are current, and nothing of it waits on anyone. «Committed» is not done.

**Limits.** This block shapes how work is tracked and merged; it changes no permission: pushes, deploys, paid calls and rules releases still follow `cemi-blocked-steps` and `cemi-cost-policy`. Long form, phases and what was deliberately left out: `cemi-system/docs/dev-process-2026-11-01.md`.
<!-- END cemi-work-tracking v3 -->

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

<!-- BEGIN cemi-responsible-ai-use v2 (managed — source: cemi-system/sync/responsible-ai-use.md) -->
## ⚖️ Responsible AI use — disclosure, high-risk domains, minors, legal confidentiality (all CEMI sites with an AI surface)

CEMI's sites serve AI through the Anthropic API and the Gemini API. Both providers bind the customer to a usage policy that reaches **our end users**, and Anthropic audits for it; a high violation rate or a missing safeguard can suspend the organization's account, which is one account for every CEMI site (Carlos, 2026-11-01). The rules below are the operating minimum; the long form with each site's classification and the sources is `cemi-system/canon/11-responsible-ai-use.md`.

**1. One badge, one link, no change of flow (Carlos, 2026-11-01: «the least disruptive way possible so that our products remain with easy flow»).** Every AI surface a visitor talks to (chatbot, persona, advisor, assistant, avatar) shows a small persistent **«AI» badge** in the widget, visible before the first answer, that links to the group's **AI notice page** `https://cemi.ai/ai-notice` (served in every CEMI language; source `cemi-web`). The badge is the disclosure the Usage Policy requires («at least at the start of each chat session or in the product interface»); naming the provider or the model is not required. The notice page carries, once for every site: that the visitor is talking to an AI system, not a person; that factual statements in answers are to be verified before relying on them (commercial terms D.3); that in hiring, credit, insurance, legal, medical, tax and education matters the AI informs and a qualified person decides, and the person is told AI was used; the providers in use, the retention (30 days on the Anthropic API by default) and that content is not used to train; the minors statement of rule 4; and the abuse report address `security@cemi.ai`. A site adds nothing else to its interface unless rule 3 or rule 4 names it. The persona guardrail «admit being AI when accuracy demands» stays as the conversational floor; the badge is what makes the interface compliant whatever the persona says.

**2. Terms and privacy notices point at the same page.** A site's terms of service and privacy notice gain one paragraph, in every served language: AI features are provided through third-party providers under data-processing terms, answers are AI-generated and not to be relied on without verification, and the details are at the AI notice page. A site whose legal pages predate 2026-11-01 adds the paragraph at its next edit and records the date in CLAUDE.md.

**3. High-risk domains: the human who already decides is named, and the person is told.** The Usage Policy's requirement applies to a **recommendation or decision about an identified person** in legal, medical, finance, credit, insurance, housing, employment, education and credentials, healthcare access, public benefits, or legal status: a qualified person (licensed where the law requires it) reviews it with authority to change it, and the person is told AI was used. An informational chat (what a law says, how a financing product works, what a DISC profile means, what the tax form asks) is not such a recommendation and needs only the badge. Where a product **does** produce one about a person (a candidate's screening report, a financing orientation for a named applicant, a drafted statute for a client, a grade or credential that counts), the product keeps the human who already decides in practice (the recruiter, the bank officer, the lawyer, the Learning Facilitator) and makes two things visible: a line on that output saying a qualified person reviews it and decides, and the AI-used statement reaching the person concerned (the candidate, the applicant, the client, the participant), by the badge where they see the output or by a line in the message that carries it. No new step, no new role: a sentence where the output already goes.

**4. Minors: an audience, not a default.** A minor is anyone under 18, in every jurisdiction. A site is **minors-facing** when under-18s can interact with its AI directly (a school, a lycée, a parents-and-teens site, a learning experience for schools, a game); it is not minors-facing merely because minors might reach a public page. A minors-facing site: states its audience in CLAUDE.md; implements safeguards it can show (age gate or school-mediated access, content moderation suited to the audience, the child-safety system prompt Anthropic provides when available, logging and a report path); complies with the child-safety and data-privacy law that applies (COPPA for US users, the Dominican and EU rules where they apply), and **says so on its website**; and keeps the disclosure of rule 1 in language a child reads. Apparent child sexual abuse material is reported where the law requires (NCMEC's CyberTipline for US-based platforms; the INHOPE directory elsewhere) and never stored for longer than the report needs. The security assessment of `cemi-feature-security-assessment` asks «who can call it»; for a minors-facing site the answer includes «a child», and the tier is deep. For a minors-facing site the badge links to the same notice page, whose minors section is written for a child to read.

**5. Legal work: confidentiality is configured, not assumed.** Anthropic's commercial API does not train on customer content and keeps prompts and outputs 30 days by default; a request for zero-data retention is a separate agreement. A site that handles privileged or confidential legal matter (lawra, cag's statutes drafting, xperto-concilia, any legal assistant): says in its privacy notice that an AI provider processes the text under a data-processing agreement, for how long, and that content is not used to train; keeps a lawyer visibly directing the work where the output reads as legal advice; verifies output against primary sources before it reaches a client; never pastes a client's privileged file into a consumer AI product on a personal account (the *Heppner* line: an individual's own consumer AI use without attorney direction was not privileged). Zero-data retention or in-tenancy deployment is Carlos's decision per matter, recorded in the site's CLAUDE.md.

**6. What every AI site records.** A **«Responsible use»** section in CLAUDE.md, six lines: providers in use; audience (adults, professionals, minors-facing); the AI surfaces and where each shows the badge; the high-risk outputs about a person, if any, and who decides; the date the terms and privacy notice gained the paragraph of rule 2; the report path for abuse.

**7. The same for Gemini, and public text names both providers.** Google's Generative AI Prohibited Use Policy and the Gemini API additional terms bind the same way; the disclosure, the high-risk route and the minors safeguards are provider-independent. CEMI's systems run Anthropic and Gemini regularly, and which one answers depends on the feature and the project's configuration (Carlos, 2026-11-02, in mediamax-web); so a public page, a notice, a legal paragraph or a chatbot answer names **both** providers («our AI providers, Anthropic (Claude) and Google (Gemini)») and never claims that a site uses only one, since the switch can flip without a page edit. The exact current routing is an engineering record and lives only in the «Responsible use» section of CLAUDE.md and in canon/11 §3; a site switching providers changes nothing public and updates that provider line.

**Limits.** This block is CEMI's operating policy, written from Anthropic's and Google's published policies on 2026-11-01; it is not legal advice, and a question about a specific matter, jurisdiction or client goes to counsel. Nothing here authorizes a paid service (`cemi-cost-policy`). Sources and dates: `cemi-system/canon/11-responsible-ai-use.md` §1.
<!-- END cemi-responsible-ai-use v2 -->

<!-- BEGIN cemi-repo-documents v3 (managed — source: sitecraft-system/sync/repo-documents.md) -->
## 📄 Repository documents — the same five at every root, plus the session's memory (all CEMI repos)

Every CEMI repository carries five root documents, each with one job (Carlos, 2026-10-17). Documents cross-reference each other and never duplicate one another.

| File | Its one job |
| :---- | :---- |
| `README.md` | What this is, who it is for, and where everything else lives: a router, not a manual |
| `INSTALL.md` | Requirements and stack versions, environment variables, build and run steps, how it is deployed |
| `CLAUDE.md` | How to work here: conventions, invariants, hard rules, and the managed blocks (their only home) |
| `CHANGELOG.md` | What changed, when and why, updated on every ship |
| `AGENTS.md` | The same instructions for Antigravity. canon-sync writes it, and it is never edited by hand |

- **MEMORY.md is not in the repository.** It is Claude Code's memory at `~/.claude/projects/<folder>/memory/`, and it is backed up nightly by cemi-system. **Every session keeps it current, and every `/ship` brings it up to date.** When a memory becomes a lasting rule for everyone, promote it: a rule goes to `CLAUDE.md`, a fact and its reason to `docs/decisions.md`. Never commit a `MEMORY.md`.
- **Both harnesses, always.** Claude Code reads `CLAUDE.md` and `.claude/`; Antigravity reads `AGENTS.md` (or `GEMINI.md`) and `.agents/`. canon-sync mirrors one into the other, so a local skill or rule is written under `.claude/` only. **Antigravity truncates a rule file at 24,000 bytes, silently.** A rule an Antigravity session must follow has to sit inside that limit.
- **Shared tools live once, in their system repository,** and are called by relative path from the sibling checkout (`node ../cemi-system/tools/…`). They are never copied, never packaged, and never delivered by canon-sync (Carlos, 2026-10-24). First case: `mediamax-system/tools/tts-checker`. **CI checks out one repository only**: what a sibling tool generates is committed in the consumer, and a step that regenerates it skips cleanly (exit 0, one line) when the sibling is absent. A build never depends on a sibling.
- **`/ship`** keeps these documents current, runs the gates, commits, pushes and deploys. Its source is `sitecraft-system/skills/ship/SKILL.md`; a per-repository variant is drift.

Long form: `sitecraft-system/protocol/cemi-sitecraft.md`, *Standard Repository Documents*, and the Working-Folder Policy just above it.
<!-- END cemi-repo-documents v3 -->

<!-- BEGIN cemi-human-presence v1 (managed — source: mediamax-system/sync/human-presence.md) -->
## 🧍 People in the frame, no clichés: the canon lives in mediamax-system (all CEMI repos that make images or video)

Before writing shots, image or video prompts, shot lists, storyboards, key art or a brief for an agent that writes them, read `../mediamax-system/.claude/rules/anti-ai-aesthetic.md` Principle 6. In short, there are no empty chairs, tables or rooms, no hands-only shots and no stock clichés: people carry the piece (Carlos, 2026-11-14).

- **Every agent brief that writes shots, prompts or key art pastes the HUMAN PRESENCE AND NO CLICHÉS block from Principle 6, verbatim.** A subagent reads only its brief, which is how the problem kept coming back in four productions in a row.
- **Before delivering or committing, run `node ../mediamax-system/tools/human-presence-lint/lint.mjs <files>` and fix every finding.**

This block only points to the canon; the rule itself has one copy, in mediamax-system. Image and video canon is never restated in another repository.
<!-- END cemi-human-presence v1 -->
