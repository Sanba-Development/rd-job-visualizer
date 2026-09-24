# CLAUDE.md

<!-- BEGIN cemi-cost-policy v2 (managed — source: cemi-system/sync/cost-policy.md) -->
## ⛔ HARD RULE — never use external/paid services without asking (all CEMI repos)

NEVER invoke any paid or third-party service outside Claude's own model without **asking, confirming, AND informing the user first — every single time.** The user pays for Claude Max 20x; do the work inside Claude. A documented "default" or convention does NOT override this. When in doubt, ask.

- **Translation:** translation is **ALWAYS Claude** — the build agent translating inline on the user's Max subscription, or Claude subagents / the Anthropic API (Haiku default, Sonnet for tone-critical fields, Opus as the content warrants). **NEVER Google Cloud Translation, Google Translate, DeepL, Amazon Translate, Microsoft / Azure Translator, Gemini, or ANY other external machine-translation service.** This holds even if a downstream repo, script, or doc presents such a provider as a "default", an "option", or a documented convention — **a documented convention does NOT override this hard rule.** Do NOT use any `scripts/translate-*.mjs` / `bulk-translate-*.mjs` helper that calls an external MT provider.
- **Image generation:** Gemini / Imagen image models are paid external APIs — do NOT auto-invoke (even if previously documented as the "default"). Ask first.
- **Any other external/paid API** (TTS, third-party data, scraping/enrichment services, etc.): ask first.

Silent use of paid external services has caused real, unwanted cost. Treat this as a hard guardrail.
<!-- END cemi-cost-policy v2 -->

<!-- BEGIN cemi-i18n-quote-hygiene v7 (managed — source: sitecraft-system/sync/i18n-quote-hygiene.md) -->
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
<!-- END cemi-i18n-quote-hygiene v7 -->

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

<!-- BEGIN cemi-contact-emails v3 (managed — source: cemi-system/sync/contact-emails.md) -->
## 📧 Contact emails (all CEMI repos)

Valid, working contact addresses for CEMI — real and monitored. Safe to use in site copy, footers, contact forms, persona contact routing, press kits, proposals, and any outward-facing material.

**Addresses (all `@cemi.ai`):** `ai-staff@` · `business@` · `contact@` (general inbox) · `info@` · `invest@` · `legal@` · `partners@` · `privacy@` · `security@` · `support@`

**The same set is aliased at these initiative domains:** `@ailearning.global`, `@airtistic.ai`, `@ibizai.io`, `@lawra.io`, `@skaills.ai` — so e.g. `contact@ailearning.global`, `legal@lawra.io`, `support@ibizai.io` all resolve.

Default to `contact@cemi.ai`; route by purpose where a specific address fits (legal → `legal@`, security → `security@`, investment → `invest@`, partnerships/alliances → `partners@`, sales/commercial → `business@`, privacy/GDPR → `privacy@`). Do **not** invent addresses outside this list. Consultable at `/admin/emails`.
<!-- END cemi-contact-emails v3 -->

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

<!-- BEGIN cemi-impact-arc v3 (managed — source: cemi-system/sync/impact-arc.md) -->
## 🌱 The Impact Arc — how CEMI intervenes (all CEMI repos)

**Impact Arc** (ES: **Arco de Impacto** · FR: **Arc d'Impact**) is CEMI's five-stage frame for how we act on and with stakeholders:

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

**Coherence with CEMI's other identity principles.** The Arc is philosophically continuous with **learning-first, not teaching-first** (center the learner's process, not the teacher's delivery) and with **"augmentation, not replacement"** and his disruptive-innovation stance (*do not artificially truncate, limit or mutilate innovation — be part of it, accompany it, and stay open to where it leads while steering*). The common thread is *agency over assistance*: enhance what people can do; never substitute for who they are.

**Naming — use these exact forms, do not re-translate.** The framework: **Impact Arc** (EN) · **Arco de Impacto** (ES) · **Arc d'Impact** (FR). The motto it comes from, as documented in Carlos's persona canon:

- **EN** — "NEVER HELP: Engage, Enable, Inspire, Empower and Connect"
- **ES** — «NUNCA AYUDAR: Involucrar, Habilitar, Inspirar, Empoderar y Conectar»
- **FR** — « N'AIDEZ JAMAIS : Engager, Rendre possible, Inspirer, Autonomiser et Connecter »

Stage names per locale:

| EN | ES | FR |
|---|---|---|
| Engage | Involucrar | Engager |
| Enable | Habilitar | Rendre possible |
| Inspire | Inspirar | Inspirer |
| Empower | Empoderar | Autonomiser |
| Connect | Conectar | Connecter |

Use the motto when quoting Carlos, the framework name when referring to the organizational canon. The stages are **fixed and ordered** — do not add, rename, drop, or reorder them, and do not coin new translations: the ES and FR forms above are canon (note FR *Rendre possible* for Enable and *Autonomiser* for Empower — neither is a literal cognate, and both are deliberate).
<!-- END cemi-impact-arc v3 -->

<!-- BEGIN cemi-png-logos v2 (managed — source: mediamax-system/sync/png-logos.md) -->
## 🖼️ HARD RULE — logos are PNG, never SVG (all CEMI media/video repos)

Anywhere a logo's **type is rendered** — hyperframe/video compositions, brand-closes, chrome overlays, canvas/OG cards, favicons, generated imagery — always use a **PNG** logo, **never SVG**. SVG logos render their **fonts incorrectly** at render time: the wordmark depends on the font being available in the (often headless) renderer, so it comes out wrong. PNG bakes the type, so it is always correct.

- **Hyperframes / video:** chrome and brand-lockup MUST be PNG. SVG wordmarks render wrong in the compositor.
- **White logos** don't show on light/white backgrounds — use the color version or add a glow. (Brand-closes are dark, so white is fine there.)
- **Per-repo logo sets are independent** — each repo owns its own approved PNG set; do NOT sync one repo's brand logos into another.

This is about **logos** (they carry type). Inline **SVG icons** in UI are the correct choice and are unaffected by this rule.
<!-- END cemi-png-logos v2 -->

<!-- BEGIN cemi-persona-authoring v2 (managed — source: personais-system/sync/persona-authoring-rules.md) -->
# CEMI authoring rules for content written under a persona's voice

**Source of truth:** `personais-system/sync/persona-authoring-rules.md` — the managed block `cemi-persona-authoring`; an edit bumps the version in these markers and the `cemi-system/canon-sync` bundle.
**Lineage:** CEMI AUTHORING RULES 2026.09.11 — until 2026-09-14 this block was the legacy wrapper block named CEMI AUTHORING RULES, written by `cemi-web/authoring-rules/sync.sh` from `cemi-web/authoring-rules/canonical/persona-authoring-rules.md` (last content version 2026.09.11, last delivered in bundle 2026.09.13); it was imported here with its history, and its learning sections became the `smoother-learning-first` block (`smoother-system/sync/learning-first.md`).
**Synced into each consumer repo's `CLAUDE.md` and `AGENTS.md` as a managed block.**

These rules apply whenever Claude Code (or any assistant) writes static content under a CEMI persona's voice — opinion articles, article frontmatter `*Take` fields, comments, blog posts, video scripts, social drafts, video descriptions, press releases, or anything attributed to a named persona.

The runtime chat widgets get a similar rule via `SHARED_PERSONA_GUARDRAILS` in `chat-persona.ts`. Static authoring needs the same discipline because static content is more persistent, more indexable, and more damaging when wrong.

---

## Factual honesty — no fabrication of verifiable-looking claims

The prohibited fabrications — invented statistics, fabricated or trimmed-meaning quotes, invented reports/surveys/studies/indexes, invented partnerships/deals/launches/events, unverified superlatives, and (under a persona's voice) invented anecdotes, memories and direct experience — are defined in `journalaism-system/canon/05-anti-hallucination-for-text.md` §3 and are binding here. All hard red lines; one copy, there.

What is persona-specific lives here:

- **Where a persona's documented canon is**: `bioLong` in the personas SSoT (author at `/admin/personas`), plus the validated-anecdotes list when present. Only what is documented there may be voiced as the persona's own memory, relationship, or direct experience.
- **When no documented anecdote fits**: make the rhetorical point without one — a clean argument beats a fabricated memory. Speak to general audiences ("any artist navigating this shift"), never fake-specific relationships ("young artists I work with").

**The rule in one line:** prefer (a) verified cited fact, (b) documented canon, or (c) silence — never fabrication.

Real, verifiable cultural references ARE good and welcome. Cite them accurately.

---

## Fictional personas — authority without claimed institutional roles

Distinct from the fabrication rules above (which concern *verifiable* claims): even for an openly **fictional** persona, do not build its authority on **claimed institutional roles, titles, or positions** — and *anonymizing the institution does not fix it*. "Professor of X at the University of Edinburgh," "Professor at a leading Scottish university," "holds the Paulo Freire Chair at the University of São Paulo," "holds a chair in critical pedagogy at a major Brazilian university," and "Founder of [company]" are all the same problem: they assert a titled position the person does not hold. In academia especially, claiming a professorship/chair/deanship (real or vaguely-gestured) reads as a credential claim and is frowned upon.

**There is a fine line** between an interesting fictional character and a misleading credential claim. Go too strict and the characters become flat; the goal is not blandness — it is authority earned honestly.

**Establish authority, character, and perspective through other means:**
- **Intellectual stance & lineage** — what they champion and whose ideas they build on ("champions evidence-based pedagogy and the Socratic method"; "rooted in Freire's critical pedagogy, Dewey's learning-by-doing, and Ubuntu"). Citing real thinkers as *influences* is welcome and accurate; claiming to *hold their named chair* is not.
- **Temperament & voice** — "measured, precise, intellectually warm"; "warm, direct, community-minded"; "practical, kinetic, transformation-driven."
- **Domain & conviction** — the problem they care about and the line they hold ("no tool earns a place in the classroom until it proves it deepens understanding").
- **General, non-titled experience** — "grounded in years of classroom teaching" is fine (a formative experience); "Professor at…", "Chair at…", "Founder & Board Member of…" is not (a titled institutional position).

**The rule in one line:** describe the persona by *what it thinks, values, and is like* — never by a position it holds at an institution, real or invented.

---

**Sibling principle — learning-first and the Impact Arc.** The learning-first rule, the «participante» vocabulary (cited *as a Spanish word*, which is the one case where a Spanish term belongs in English prose) and the capacity rule are the `smoother-learning-first` managed block (source: `smoother-system/sync/learning-first.md`). **Smoother’s terms are fully translated in every non-Spanish surface** (Carlos, 2026-09-19): a persona writing in English says **Learning Facilitator** for the support role — never "teacher", "instructor" or "trainer" as the role name — and **Learning Unit**, never "module"; a learning experience is never a "course". The frozen trilingual table is `smoother-system/protocol/smoother-glosario.md`; every consumer inherits from there and nobody coins a translation downstream. Both that block and this one rest on the **Impact Arc** — *agency over assistance*, **created by Carlos Miranda Levy** and inherited by CEMI as a group — whose canonical entry is the `cemi-impact-arc` managed block (source: `cemi-system/sync/impact-arc.md`).

---

## Specifically for Carlos Miranda Levy

Carlos's persona canon documents the allowed biographical scope. When writing under his voice, use ONLY what is documented; nothing else.

- **Places he can speak from**: Singapore, Santiago de Chile, Silicon Valley, Paris, Japan, the Caribbean (Dominican Republic).
- **Fields he can speak from**: Content Creation, Disaster Response, AI, Education, Consulting, Startups, Social Entrepreneurship, Parenting.
- **Family**: one son, born 2012. **Do not invent** siblings, uncles, cousins, partners, additional children, or any other family member.
- **Validated family anecdotes** (use only as documented, do not embellish):
  - Carlos's grandfather was a blacksmith ("herrero") so famous that people came from other towns on horseback to have him shoe their horses. The arrival of the automobile transformed his trade. (Use as a real anchor for "trade transformation" discussions. Do not invent dates, do not invent how he died, do not characterize him as rejecting change.)
- **Relationships NOT claimed**: Carlos does not have a documented active mentorship of young artists (Latin American or otherwise). Speak in general or second-person terms ("any artist navigating this shift", "artists working in the compressing middle") rather than first-person specific ("young artists I mentor", "the artists I work with").
- **How he refers to himself (title preference)**: Carlos IS the founder of CEMI, but does not like to brag or lead with that title. In bylines, signatures, persona roles, and self-introductions, prefer **"Coordinator of Impact, Innovation and Intelligence"** (ES «Coordinador de Impacto, Innovación e Inteligencia» · FR « Coordinateur de l’Impact, de l’Innovation et de l’Intelligence ») over "Founder of CEMI." State the founder fact only when directly relevant or asked — never as a flex. (Changed 2026-09-19; the former "Coordinator of CEMI's Enhanced Intelligences" — with its ES form, «Coordinador de las Inteligencias Aumentadas de CEMI» and the older «Mejoradas» variant, and its FR form, « Coordinateur des Intelligences Augmentées de CEMI » — is retired and must not appear as a byline.)
- **Learning-first conviction**: Carlos holds that education is about the *learning* experience, not the teaching experience (see the "Learning-first, not teaching-first" section of the `smoother-learning-first` managed block). It's a personal conviction and sits alongside his *"augmentation, not replacement"* frame and his disruptive-innovation stance — invoke it when he speaks on education, edtech, or AI in learning.
- **Carlos on innovation (documented, 2026-09-03 — his own sentences; quote them as his, do not paraphrase into slogans):** "If we try to make change look like the past or respond to the expectations and structures of the past, it's not true change, is it?" and "Do not artificially truncate, limit, mutilate innovation. Be part of it, accompany it, and let's see and be open to different directions when steering where it leads us." He is a disruptive-innovation expert and advocate: for planning and dealing with the consequences of change, never for limiting it. **"Change it, but change it well" is NOT his expression** — it circulated in this canon by mistake until 2026-09-03; never attribute it to him.

---

## Other personas

Same rule structure applies to every other persona — Aurelius, Saya, Marcus, Zara, Mira, Paletta, Pixelle, Eva, Mateo, Sol, and the rest. Until each persona's canon documents specific validated anecdotes, do NOT improvise anecdotes for them. Use real public/historical references or speak in general terms.

When in doubt: pull up the persona's record in the personas admin (`https://cemi.ai/admin/personas` today; `https://personais.cemi.ai/admin` once personais-web deploys, phase 5 of the split) — or read the canon from the personas endpoint `https://us-central1-cemi-ai.cloudfunctions.net/personas`, served by personais-web and snapshotted into each consumer's `src/data/personas-snapshot.json`, or from the synced markdown in each consumer repo — and use only what is documented.

---

## Inclusion — normalized, never tokenized

A discipline sibling to "steelman, don't strawman," applied whenever a persona carries a represented identity attribute (disability, neurodiversity, ethnicity, age, body type, faith) — in its `profile.appearance.representation`, in its portrait, and in any content it appears in. **The person is first; the attribute is context, never the subject.** (Adapted from the MediaMax/Juguetón inclusion spec — *"Mateo construye. Usa silla. Fin."* / *"PRIMERO Sofía."*)

**Do:** keep the persona's personality primary; let others interact *with the person*, not with the wheelchair/aid; show the same tools, products, and competence as everyone else; let an attribute (a slower tempo, a visible feature) be authentic and unremarked; celebrate achievements without condescension.

**Don't:**
- Make the attribute the plot, or surface the persona only in an "inclusion moment / special episode" (tokenism).
- Frame as inspiration/pity ("despite their…", "overcoming…"), with sad/"triumphal" music or pitying camera angles.
- Hide or "correct" the attribute; edit to erase a natural tempo; over-help ("assisting" unasked); give "special tools for special people."
- Reduce the persona to the attribute ("the one in the wheelchair") instead of their name and character.

This complements the Indigenous `knowledge-boundary` rule (represent at the level openly-sharing teachers would recognize; nothing closed/initiatory; nothing exoticized).

---

## Portraits — representation fidelity (mandatory)

A persona's portrait is part of its canon. When generating or regenerating any persona image, these rules are mandatory.

1. **Match the portrait to the persona's ethnicity, heritage, gender, and age.** The apparent ethnicity in the image must never conflict with the persona's name, stated heritage, or `appearance`. Do NOT leave the image model to infer ethnicity from a name — it guesses wrong (a "Wei Chen" or "Priya Sharma" rendered as European; a "Tyrone Williams" not rendered as African American). Encode ethnicity/heritage, gender, and age **explicitly** in the generation prompt, sourced from a durable `appearance` field on the persona — never from vibes or the name alone.

2. **Keep a deliberate balance of ethnicities and genders across every roster.** A panel / team / cohort should represent a genuine range — never skew toward one group, and make sure under-represented groups actually appear *and appear correctly*. Review the whole set's composition, not each portrait in isolation. If the names imply diversity, the images must deliver it.

3. **Historical / inspired-by-real-figure personas must resemble the known depictions of that figure.** For any persona that is, or is inspired by, a real historical person, the portrait must reproduce that person's distinctive, well-documented features — glasses style, facial hair, hairstyle, era-accurate dress — not a generic period figure. Give the generator the *specific* features; "faithful to known likeness" alone is not enough. The specificity required, by example:
   - **Jean Piaget** — large bald forehead with white hair at the sides, **thick black-framed glasses**, clean-shaven (no mustache); mid-20th-century suit.
   - **John Dewey** — full **bushy mustache and NO beard**, **thin round wire/rimless glasses**, side-parted hair; early-20th-century suit.
   - **Rabindranath Tagore** — long flowing white beard and hair, simple robe.
   - **Maria Montessori** — dark hair worn up, early-20th-century high-collared dress.

   Verify the result against known photographs/portraits before accepting it.

**The rule in one line:** the image must look like who the persona actually is — right ethnicity and gender, the *real person* for historical figures, balanced across the roster — never a mismatched or generic face.

### Image variation set (all render modes)

Every persona's imagery is produced in **three render modes** — **photo** (realistic), **semi-realistic caricature**, and **fun 3D caricature (Pixar/Disney style)** — and, in each mode, as **four framings** derived from one full-body source: **full-body**, **waist-up**, **head/square** (head-and-shoulders), and **face** (a tight square headshot cropped on the face). Generate the full body once; crop the other three from it (don't generate them separately). Full-body means the whole standing figure, head to feet, with **natural/normal proportions** (no big-head caricature) and no oval/vignette/frame. Model choice: realistic + semi-realistic on the default (Flash) model; the fun 3D transformation needs the Pro model. Store each variation on the SSoT image bucket under the persona id (id-prefixed filenames) and record it in the personas collection so downstream consumers of the SSoT can select the mode + framing they need.

#### Settled generation prompt (reference model)

Compose each image as **`<style lead>` + `<persona appearance likeness>` + `<composition contract>`**, run **image-to-image** from the persona's realistic portrait, and force a tall aspect in the API config (`imageConfig.aspectRatio: '3:4'`). Generate the **full body once**, then crop the **waist-up** (top ~55%) and **head/square** (top-cropped square) from it. Reference implementation: `personais-web/scripts/generate-caricatures.mjs`.

**Composition contract** (shared by all modes — the hard-won wording that avoids ovals, letterboxing, cut feet, and square-not-tall):
> COMPOSITION (follow exactly): a TALL vertical FULL-BODY caricature image showing the ENTIRE person standing — from the top of the head all the way down to and INCLUDING the FEET and shoes. The WHOLE figure must be inside the frame: head near the top, feet near the bottom, with a little empty space above the head and below the feet. Do NOT crop or cut off the feet, the legs, or the top of the head — the complete body head-to-toe must be visible. The background must be a completely FLAT, SOLID, UNIFORM single plain color — no texture, no gradient, no scenery or props, and no cast/ground shadow — so the figure can be cleanly cut out and used as an overlay. Use NATURAL, REALISTIC human body proportions with a NORMAL-sized head (about seven to eight heads tall for an adult) — do NOT enlarge the head; no big-head or chibi caricature proportions. NOT an oval or floating cut-out; no vignette, no rounded/curved edges, no picture frame, border, or matte, no letterbox/pillarbox bands. No text or watermark.

**Style lead — semi-realistic caricature** (default/Flash model):
> Turn this person into a warm, friendly full-body SEMI-REALISTIC illustrated character of the SAME person — a clean, hand-illustrated cartoon rendering that stays faithful to their likeness, facial features, skin tone/ethnicity, hair, glasses, and distinctive features. CRITICAL: use fully REALISTIC, natural, life-like body proportions — a normal-sized head at a true adult head-to-body ratio (about seven to eight heads tall). This is NOT a caricature: do NOT enlarge, inflate, or exaggerate the head or any feature. Dignified, never mocking.

**Style lead — fun 3D caricature** (Pro model — Flash under-stylizes this):
> Turn this person into an OBVIOUSLY STYLIZED, fun full-body 3D-ANIMATED CARTOON character in the style of a modern feature animation film (Pixar / Disney / DreamWorks). CRITICAL: it must clearly read as a 3D animated cartoon — NOT photorealistic — with strong animated-film stylization (soft rounded features, warm expressive eyes, smooth subsurface-scattering skin, cinematic soft lighting) but NATURAL, realistic body proportions and a NORMAL-sized head (not a big-head caricature). Faithfully preserve the person's likeness, ethnicity, skin tone, hairstyle, facial hair, glasses, and distinctive features.

**Likeness lock:** always append the persona's documented `appearance` so image-to-image can't drift (e.g. *Piaget — thick black-framed glasses, large bald forehead, white side hair, clean-shaven / no mustache*). Never use the word **"portrait"** in the prompt (it forces an oval bust vignette) — say "full-body caricature image."

#### Transparent cutouts (background removal)

Each rendered image should also be available as a **transparent-background cutout** (RGBA PNG/WebP) for use as an overlay/composite. **The opaque studio/flat original is always kept as the fallback** — the cutout never replaces it. Cut out the full body once, then derive the transparent waist-up + head/square crops the same way (top ~55% / top-cropped square, alpha preserved).

**Tooling — `rembg`, run locally (free, no paid API).** Install as part of the Personas / MediaMax image stack and pre-cache the models:

```bash
pip install --user "rembg[cpu]"    # onnxruntime-backed; models auto-download on first use
```

**Model choice — pick by subject:**
- **People / human portraits → `birefnet-portrait`** (primary; best hair/edge matting on humans).
- **Objects / products / non-human elements → `birefnet-general`** (best general matting).
- **`isnet-general-use`** — the lightweight fallback (≈178 MB vs birefnet's ≈1 GB) for either subject when speed/size matters; near-identical on clean silhouettes.
- `u2net` / `u2net_human_seg` are older baselines — prefer the birefnet pair above.

> **⚠️ Memory-intensive — can crash the machine.** The birefnet models (~1 GB) run inference in RAM, and full-body images are large; a big batch can exhaust system memory and crash the process / the whole session (observed on WSL2). Mitigate: run in **small batches**, one image at a time in the loop (don't parallelize the cutout stage), keep other heavy jobs off the box, and drop to the lighter **`isnet-general-use`** (~178 MB) when memory-constrained. If a run dies mid-batch, just re-run — the stage is idempotent (it overwrites `-cutout.png`).

Reference implementations: `personais-web/scripts/cutout-batch.py` (Stage 1 — birefnet cutout) + `personais-web/scripts/upload-photo-cutouts.mjs` (Stage 2 — derive crops, webp with alpha, upload, set `photoFullCutout*` fields). Alpha survives sharp `extract`/`resize`; write WebP with `alphaQuality: 100`.

#### Face-focused headshots (OpenCV)

The **face** framing is a tight square headshot cropped on the face — distinct from the head/square (head-and-shoulders) crop. Derive it with **OpenCV face detection** (not a fixed proportional crop): detect the face, frame hair-to-shoulders around it, fall back to a top-center proportional square only when no face is found (e.g. some 3D cartoons). Applies to every render mode + the realistic cutout.

**Tooling — `opencv-python-headless`, run locally (free, no paid API), part of the Personas / MediaMax image stack:**

```bash
pip install --user "opencv-python-headless<5"   # PIN to 4.x — see gotcha below
```

> **⚠️ OpenCV version gotcha:** `opencv-python-headless` **5.0.0** ships a broken build where `cv2.CascadeClassifier` is missing (`cv2.data` loads, but the class raises `AttributeError`). **Pin to `<5` (4.x)** — 4.13.x works. Don't install bare `opencv-python-headless` (it resolves to 5.0.0).

The bundled Haar cascade (`cv2.data.haarcascades/haarcascade_frontalface_default.xml`, plus `_alt2` as a second pass) needs no download. Constrain detection to the top ~55% of the frame and filter implausible boxes (face width 7–45% of image, top in the upper 40%).

> **⚠️ Pick the TOPMOST detection, not the largest.** Patterned/ornate clothing (brocade, florals, textured fabric) can produce a false-positive "face" on the **torso** that is *bigger* than the real face — so selecting by area crops the chest (this cropped Rousseau's floral waistcoat instead of his head). In a standing full-body figure the real face is always the **highest** plausible detection, so choose the smallest-`y` box (tie-break on area). Filtering alone is not enough; the selection rule is load-bearing.

Reference implementation: `personais-web/scripts/face-crop.py` (+ `personais-web/scripts/upload-face-crops.mjs` for upload + `*Face` fields; both take `--only=<id>` to re-crop a single persona).

---

## Audit pattern (what to grep for when reviewing existing content)

When auditing existing static content for these failures, look for:

- First-person stories without a canon source: `my (uncle|aunt|cousin|grandfather|grandmother|brother|sister|neighbor)`, `I once knew`, `a friend of mine`, `years ago I`.
- Suspicious stat ranges: `\d{1,3}[-–]\d{1,3}%`, `\d+x faster`, `\d+ out of \d+`, "according to multiple surveys", "studies show".
- Suspicious citations: `(AIGA|McKinsey|Deloitte|Gartner|Animation Guild|BLS|Pew|Nielsen|IPSOS) (Census|Report|Survey|Handbook|Index|Study)`.
- Suspicious superlatives: `first (\w+ ){0,3}(handbook|company|country|state|report|study|partnership)`, `the (only|largest|earliest)`.
- Suspicious partnerships: `(partnership|deal|collaboration) (between|with) [A-Z]\w+ and [A-Z]\w+`, `\d{4}` near a product/launch claim.
- First-person mentorship: `(young|emerging|the) artists I (work with|mentor|advise|teach)`, `clients I serve`.

A formal audit script lives at `../journalaism-system/tools/audit-opinion-content.mjs`; run it from any repository against a path: `node ../journalaism-system/tools/audit-opinion-content.mjs src/content/opinion`.

---

## When generating new content

The default discipline:
1. Make the structural point first, then look for a real reference to anchor it.
2. If you can't find a real reference, leave the point unanchored — abstract rigor is better than fabricated grounding.
3. If a personal voice asks for an anecdote, check the persona canon. If nothing fits, drop the anecdote and rely on structural argument.
4. Cite real reports / cases / events with care. If unsure whether a report exists or says what you remember, omit it.
5. Never insert a "this is similar to when X partnered with Y" sentence without verifying X and Y actually did partner.

Brevity and honesty beat fluency. A short paragraph of true things is worth more than three paragraphs of plausible fiction under a real person's name.

---

## Anti-hallucination & fact-checking

> Fact-checking, the tiers `[SOURCE]` / `[INFERENCE]` / `[REQUIRES VERIFICATION]`, the prohibited fabrications, the three-pass check, the authenticity test and the corrections rule are defined in `journalaism-system/canon/05-anti-hallucination-for-text.md` and are binding here. One copy, there; nothing carrying `[REQUIRES VERIFICATION]` ships.

*(Pointer since 2026-09-11. The operational canon that lived here from 2026-07-13 to 2026-09-11 moved to journalaism-system canon 05, which is the single copy of the tiers.)*
<!-- END cemi-persona-authoring v2 -->

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

<!-- BEGIN cemi-gemini-models v2 (managed — source: cemi-system/sync/gemini-models.md) -->
## 🤖 Gemini model ids — never hard-code a dated id in application code (all CEMI repos)

Google retires Gemini model ids without notice and **new API keys cannot use retired ids** even while old keys still can (2026-09-13: `gemini-2.5-flash` answered 404 "no longer available to new users" on a fresh key while older keys kept working). A model id copied from another repo, a doc, or memory is therefore never proof that it works for THIS key.

Rules:
1. **One place per repo.** Model ids live in exactly one module (e.g. `functions/src/assistant/provider.ts` → `MODELS`), never inline at call sites, scripts, or docs as "the model".
2. **Prefer families, resolve at runtime.** Express the need as a family + tier (`flash` for chat/volume, `pro` for analysis, `*-image`, `*-tts`) and resolve the concrete id at startup or first use from `models.list()` (Developer API `ListModels`), picking the newest generally-available id of that family that supports the required method (`generateContent`, image, TTS). Cache per process. Fall back to the pinned id only if listing fails.
3. **Treat 404 / "no longer available" as a model-rotation signal**, not a bug in your prompt: re-resolve once, log the substitution with both ids, and continue. **Where to look for the successor (2026-09-21, found in production by aunsinnombre.org, routed through sitecraft-system):** take the successor from the **documentation's model list** (`models.list()` and the published model page), **never from the API's error message** — when `gemini-2.5-pro` answered 404 "no longer available to new users", the error named a *preview* model as its replacement while the documentation listed a *stable* one; the error is a rotation signal, not a recommendation, and following it silently moves a production surface onto preview. And **prefer stable over preview on any user-facing surface**: a preview id can change behaviour or disappear without notice; take a preview only when the stable line genuinely cannot do the job, and record why beside the pin. The surface changes the risk tolerance, not the rule.
4. **Verify before pinning.** When a repo pins ids (media pipelines, TTS canon), the pin carries a date and the key it was verified with, and `/ship` for that repo re-checks the pin against `ListModels`.
5. **Docs name families, not ids**, except in a single dated "verified ids" table per repo. Never copy ids across repos.

Verified ids as of **2026-09-13** on a fresh Developer API key (project schools-solutions): chat `gemini-3.6-flash`, analysis `gemini-pro-latest` (alias, follows the current Pro). Image and TTS ids used by media pipelines (`gemini-2.5-flash-image`, `gemini-3-pro-image*`, `gemini-2.5-flash-preview-tts`) were verified only on the older shared media key — re-verify on any new key before relying on them.
<!-- END cemi-gemini-models v2 -->

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

<!-- BEGIN smoother-learning-first v4 (managed — source: smoother-system/sync/learning-first.md) -->
## Learning-first, not teaching-first

Education is about the **learning** experience, not the teaching experience. Center the **learner's process** — never the teacher's. Even when the topic *is* teaching, approach it from the learner's side: what does the learner experience, understand, retain, and become able to do?

This is a CEMI/aiLearning **project-identity** principle, not a stylistic preference:
- The initiative is named **aiLearning** (not aiTeaching).
- The methodology is **"Smoother Experiences"** — learning *experiences*.
- It is also a **personal conviction of Carlos Miranda Levy** — a cousin of his *"augmentation, not replacement"* frame and of his disruptive-innovation stance (see "Carlos on innovation" in the `cemi-persona-authoring` managed block).

**When writing any CEMI education content or persona voice:**
- Lead from the learner: the participant, the parent, the person becoming capable — not the instructor's craft or convenience.
- Tools and methods are judged by what they do to *understanding and capability*, not by how they help "deliver" or "teach."
- Prefer learner-centered framings ("frees every learner to…", "each learner's path", "what the learner can now do") over teacher-centered ones ("frees teachers to…", "how to teach X"). Teachers matter enormously — but they are in service of the learning, which is the subject.
- Even the education personas' authority is about deepening *learning*, not performing *teaching*.

**The rule in one line:** the learner's experience is the subject; teaching is in service of it.

### Terminology in Smoother's own voice — «participante», never «estudiante»

In Spanish, use **Sujeto de Aprendizaje / participante / aprendiz**. Never «estudiante», never «alumno», never "trainee". The support role is the **Learning Facilitator** (ES *Orientador de Aprendizaje* · FR *Facilitateur·rice d'apprentissage*) — never "teacher", "instructor" or "trainer", and never «docente»/«profesor»/« enseignant ». A learning experience is never called a "course", never «curso», never « cours ».

**The terms are fully translated in every non-Spanish surface** (Carlos, 2026-09-19). English and French texts carry **Learning Subject, participant, Learning Facilitator, Learning Object, Learning Unit** — not the Spanish names as proper nouns. A Spanish term appears in an EN or FR text only when the Spanish word itself is the subject (as it is in this very section, where «participante» and «estudiante» are being weighed *as Spanish words*) — never as a parenthetical after the translated term (Carlos, 2026-09-21). The frozen trilingual table and the rules that travel with it are `smoother-system/protocol/smoother-glosario.md`; every consumer inherits from there and nobody coins a translation downstream.

**Why these words are refused.** The objection is not connotation — it is that each refused term defines the person by their **position relative to an institution**, rather than by what they are doing:

- **«Estudiante» / "student"** names an enrolment status, not an activity: one is a student *of* a teacher, *at* a school. The word puts the institution in the frame and the person in a receptive position inside it. It is also life-stage coded — it implies youth, full-time study, pre-professional standing — which is why it lands badly in adult professional development.
- **«Alumno»** carries the same problem more strongly. Its etymology is Latin *alumnus*, "the nourished one", from *alere*, to nourish: the learner as the one who is fed. That is an accurate description of a transmission model — precisely the model Smoother rejects — with the passivity encoded in the noun. It is also the most school-coded and, for adults, the most infantilising of the options.
- **"Trainee"** is explicitly subordinate and provisional: someone below full competence, on probation. Training is done *to* the person. It names a rank in an organisation, not a relationship to learning.
- **«Participante»**, by contrast, names what the person *does*. No institutional subordination, no age coding, no implied deficit. It reads the same for a 22-year-old and a 55-year-old department head.

**Do NOT use the false etymology.** The claim that «alumno» derives from *a-lumen*, «sin luz» / "without light", is **false**, though it circulates widely in Spanish-language education discourse. It must never appear in CEMI material or be used as justification anywhere. The genuine etymology (*alere* → nourished, fostered) makes the point honestly and needs no embellishment.

**Honest labelling — state this plainly.** This is a **design position and a matter of project identity, not an evidence claim.** No study shows that «participante» produces better learning outcomes than «estudiante». The justification is coherence: the initiative is aiLearning, not aiTeaching; the offering is learning *experiences*, not courses; adopting the receptive word in our own voice would quietly contradict what is being sold. Never present it as research-backed.

**This is not language-policing.** Cited frameworks keep their own terms — the OECD says "student agency" and we quote it as such; Gagné says "learners". The rule governs **Smoother's own voice**, not other people's words.

### La regla de capacidad — una persona, tres registros

*(The capacity rule: one person, three registers.)* Carlos's ruling, 2026-08-14, unifying a fork between two offerings that had each written their own incompatible interpretation of when the prohibition applies. The Onboarding SSoT ruled "never student/estudiante/alumno/trainee anywhere"; the aiLearning Challenge SSoT permitted student/escuela in the institutional register when addressing schools, parents and ministries. Both were right about their own audience — onboarding's counterparty is an employer, the Challenge's is a school — and onboarding could say "never anywhere" only because it had never had a school as a counterparty.

The prohibition protects **Smoother's own voice**; the exception is **the counterparty's own institutional register**, whatever that institution is. The same person is named differently depending on the capacity in which they are being addressed:

1. **In the learning process** — Smoother's voice, methodology, programme content, anything the learner reads: **Sujeto de Aprendizaje / participante / aprendiz**. Never «estudiante», never «alumno».
2. **In organizational capacity, employer** — proposals, commercial copy addressed to HR buyers, contracts, ROI material: **employee / new hire**; Spanish commercial copy prefers **colaborador** over «empleado».
3. **In organizational capacity, educational institution** — addressed to schools, educators, parents, ministries, sponsors; and in consent and safeguarding instruments: **student / estudiante / estudiantado** and **school / escuela** are permitted, because that is the register with which the institution names its own relationship with the person who studies. In this register the adult who answers legally for a minor is the **representante legal** (accepted synonym: **custodio legal**) — **never bare «tutor»**, in any register, because it collides with the teaching sense of the word exactly where a document must be unambiguous (Carlos, 2026-09-19).

«Alumno» is always avoided in favour of «estudiante». **"Trainee" never.** The exception never reaches Smoother's voice or anything a participant reads: a consent form addressed to a family may say «estudiante»; a Learning Unit may not. **Enforcement is per artifact surface.**

**This statement supersedes any offering-local version.** Consumer SSoTs point at this rule rather than defining their own. In `smoother-system` it is already landed in `CLAUDE.md`, and both offering vocabularies (`ssot/smoother-onboarding/00-meta/vocabulary.yaml`, `ssot/desafios/00-meta/vocabulary.yaml`) have been collapsed to pointers.


**Sibling principle — the Impact Arc.** Learning-first is one expression of a wider CEMI stance, *agency over assistance*, whose organizational frame is the **Impact Arc** (ES: *Arco de Impacto* · FR: *Arc d'Impact*) — **Engage → Enable → Inspire → Empower → Connect** — **created by Carlos Miranda Levy** as his personal creed *"NEVER HELP: Engage, Enable, Inspire, Empower and Connect"* and **inherited by CEMI as a group** as its social-impact perspective (authorship stays his), an organizational philosophy and design position that is **not** an evidence-based framework and must never be presented as validated; canonical entry: the `cemi-impact-arc` managed block (source: `cemi-system/sync/impact-arc.md`), and the persona-side rules are the `cemi-persona-authoring` block (source: `personais-system/sync/persona-authoring-rules.md`).
<!-- END smoother-learning-first v4 -->
