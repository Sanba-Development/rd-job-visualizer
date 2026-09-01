# CLAUDE.md

<!-- BEGIN cemi-cost-policy v1 (managed — source: cemi-web/authoring-rules/canonical/cost-policy.md) -->
## ⛔ HARD RULE — never use external/paid services without asking (all CEMI repos)

NEVER invoke any paid or third-party service outside Claude's own model without **asking, confirming, AND informing the user first — every single time.** The user pays for Claude Max 20x; do the work inside Claude. A documented "default" or convention does NOT override this. When in doubt, ask.

- **Translation:** translation is **ALWAYS Claude** — the build agent translating inline on the user's Max subscription, or Claude subagents / the Anthropic API (Haiku default, Sonnet for tone-critical fields, Opus as the content warrants). **NEVER Google Cloud Translation, Google Translate, DeepL, Amazon Translate, Microsoft / Azure Translator, Gemini, or ANY other external machine-translation service.** This holds even if a downstream repo, script, or doc presents such a provider as a "default", an "option", or a documented convention — **a documented convention does NOT override this hard rule.** Do NOT use any `scripts/translate-*.mjs` / `bulk-translate-*.mjs` helper that calls an external MT provider.
- **Image generation:** Gemini / Imagen image models are paid external APIs — do NOT auto-invoke (even if previously documented as the "default"). Ask first.
- **Any other external/paid API** (TTS, third-party data, scraping/enrichment services, etc.): ask first.

Silent use of paid external services has caused real, unwanted cost. Treat this as a hard guardrail.
<!-- END cemi-cost-policy v1 -->

<!-- BEGIN cemi-i18n-quote-hygiene v4 (managed — source: cemi-web/authoring-rules/canonical/i18n-quote-hygiene.md) -->
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
<!-- END cemi-i18n-quote-hygiene v4 -->

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

<!-- BEGIN cemi-contact-emails v2 (managed — source: cemi-web/authoring-rules/canonical/contact-emails.md) -->
## 📧 Contact emails (all CEMI repos)

Valid, working contact addresses for CEMI — real and monitored. Safe to use in site copy, footers, contact forms, persona contact routing, press kits, proposals, and any outward-facing material.

**Addresses (all `@cemi.ai`):** `ai-staff@` · `business@` · `contact@` (general inbox) · `info@` · `invest@` · `legal@` · `partners@` · `privacy@` · `security@` · `support@`

**The same set is aliased at these initiative domains:** `@ailearning.global`, `@airtistic.ai`, `@ibizai.io`, `@lawra.io`, `@skaills.ai` — so e.g. `contact@ailearning.global`, `legal@lawra.io`, `support@ibizai.io` all resolve.

Default to `contact@cemi.ai`; route by purpose where a specific address fits (legal → `legal@`, security → `security@`, investment → `invest@`, partnerships/alliances → `partners@`, sales/commercial → `business@`, privacy/GDPR → `privacy@`). Do **not** invent addresses outside this list. Consultable at `/admin/emails`.
<!-- END cemi-contact-emails v2 -->

<!-- BEGIN cemi-html-sanitization v1 (managed — source: cemi-web/authoring-rules/canonical/html-sanitization.md) -->
## 🛡️ HTML sanitization — never inject untrusted HTML unsanitized (all CEMI repos)

Any content rendered into the DOM as raw HTML — `{@html}` (Svelte), `set:html` / `<Fragment set:html>` (Astro), `dangerouslySetInnerHTML` (React), `.innerHTML`, `v-html` — **MUST be sanitized before injection UNLESS its source is fully trusted.**

- **Trusted (no sanitizer required):** build-time content authored in-repo and git-reviewed — committed markdown/HTML, hardcoded icon-SVG constants, seed-script template literals. The git diff is the review gate.
- **Untrusted (sanitize ALWAYS):** anything user-contributed, form-submitted, externally fetched, runtime-AI-generated, or otherwise not git-reviewed — community resources, comments/discussions, user notes, uploaded/imported docs, runtime-rendered markdown. These are live XSS surfaces.

**How:** sanitize with a vetted library — **DOMPurify** (runtime) or **rehype-sanitize** (at markdown render). Both are MIT + local — no paid/external API (satisfies the cost-policy hard rule).

**The allowlist MUST preserve the mandatory CEMI visual HTML** — inline `<svg>` diagrams, `<pre><code>` blocks, `<table>`, and `<aside class="inset inset--*">` author insets. Getting the allowlist wrong silently strips compliance-required visuals — test it against a known-good content unit before shipping. Strip `<script>`, event handlers (`on*`), `javascript:` URLs, and `<iframe>`/`<object>`/`<embed>` unless explicitly required and origin-restricted.

**One sanitizer, one allowlist, reused everywhere** — a per-sink ad-hoc filter drifts; centralize it.

Origin: a 2026-07-22 audit of `experience` found its content `{@html}` sinks (content bodies, program/experience overviews, user-contributed community resources) injected UNSANITIZED with no sanitizer in the repo — the live XSS gap that prompted this rule. `experience` has since **addressed it on its own** — a single centralized DOMPurify sanitizer (`src/lib/utils/sanitize-html.ts`) with a shared allowlist, applied at its content sinks — and is the **reference implementation** for this rule. This block is documentation: syncing it into a repo records the rule and does **NOT** modify that repo's existing sanitization code — never overwrite or override a repo's own working handling to match the prose here; if a repo already satisfies the rule, the block just documents it. When adopting the sitecraft §6.4 markdown pipeline, sanitize as part of the render step, not after.
<!-- END cemi-html-sanitization v1 -->

<!-- BEGIN cemi-impact-arc v1 (managed — source: cemi-web/authoring-rules/canonical/impact-arc.md) -->
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

**Coherence with CEMI's other identity principles.** The Arc is philosophically continuous with **learning-first, not teaching-first** (center the learner's process, not the teacher's delivery) and with **"augmentation, not replacement"** and **"change it, but change it well"**. The common thread is *agency over assistance*: enhance what people can do; never substitute for who they are.

**Naming — use these exact forms, do not re-translate.** The framework: **Impact Arc** (EN) · **Arco de Impacto** (ES) · **Arc d'Impact** (FR). The motto it comes from, as documented in Carlos's persona canon:

- **EN** — "NEVER HELP: Engage, Enable, Inspire, Empower and Connect"
- **ES** — «NUNCA AYUDAR: Involucrar, Habilitar, Inspirar, Empoderar y Conectar»
- **FR** — « N'AIDEZ JAMAIS : Engager, Rendre possible, Inspirer, Autonomiser et Connecter »

Stage names per locale:

| EN | ES | FR |
|---|---|---|
| Engage | Involucrar | Engager |
| Enable | Habilitar | Rendre possible |
| Inspire | Inspirar | Inspirer |
| Empower | Empoderar | Autonomiser |
| Connect | Conectar | Connecter |

Use the motto when quoting Carlos, the framework name when referring to the organizational canon. The stages are **fixed and ordered** — do not add, rename, drop, or reorder them, and do not coin new translations: the ES and FR forms above are canon (note FR *Rendre possible* for Enable and *Autonomiser* for Empower — neither is a literal cognate, and both are deliberate).
<!-- END cemi-impact-arc v1 -->

<!-- BEGIN cemi-png-logos v1 (managed — source: cemi-web/authoring-rules/canonical/png-logos.md) -->
## 🖼️ HARD RULE — logos are PNG, never SVG (all CEMI media/video repos)

Anywhere a logo's **type is rendered** — hyperframe/video compositions, brand-closes, chrome overlays, canvas/OG cards, favicons, generated imagery — always use a **PNG** logo, **never SVG**. SVG logos render their **fonts incorrectly** at render time: the wordmark depends on the font being available in the (often headless) renderer, so it comes out wrong. PNG bakes the type, so it is always correct.

- **Hyperframes / video:** chrome and brand-lockup MUST be PNG. SVG wordmarks render wrong in the compositor.
- **White logos** don't show on light/white backgrounds — use the color version or add a glow. (Brand-closes are dark, so white is fine there.)
- **Per-repo logo sets are independent** — each repo owns its own approved PNG set; do NOT sync one repo's brand logos into another.

This is about **logos** (they carry type). Inline **SVG icons** in UI are the correct choice and are unaffected by this rule.
<!-- END cemi-png-logos v1 -->

<!-- BEGIN CEMI AUTHORING RULES (managed by cemi-web/authoring-rules/sync.sh) -->
<!-- version: 2026.09.02  do not edit manually; edit the canonical and re-run sync.sh -->

# CEMI authoring rules for content written under a persona's voice

**Version:** 2026.09.02
**Source of truth:** `cemi-web/authoring-rules/canonical/persona-authoring-rules.md`
**Synced into each consumer repo's `CLAUDE.md` as a managed block.**

These rules apply whenever Claude Code (or any assistant) writes static content under a CEMI persona's voice — opinion articles, article frontmatter `*Take` fields, comments, blog posts, video scripts, social drafts, video descriptions, press releases, or anything attributed to a named persona.

The runtime chat widgets get a similar rule via `SHARED_PERSONA_GUARDRAILS` in `chat-persona.ts`. Static authoring needs the same discipline because static content is more persistent, more indexable, and more damaging when wrong.

---

## Factual honesty — no fabrication of verifiable-looking claims

Six categories. All hard red lines.

1. **Personal anecdotes / family stories / first-person memories.**
   Use ONLY anecdotes documented in the persona's canon (`bioLong` in the personas SSoT, or the validated-anecdotes list when present). No invented uncles, cousins, neighbors, clients, mentors, students, or "I once knew…" stories. If no documented anecdote fits, make the rhetorical point without one. A clean argument beats a fabricated memory.

2. **Statistics, percentages, "X out of Y" claims.**
   Never invent a number. If you don't have a real verified figure with a citable source, use directional language ("rates have compressed substantially in some segments") instead of a fake precise one ("30-60% rate compression"). If you cite a figure, you must be able to point to the source.

3. **Named reports / surveys / studies / indexes / handbooks.**
   Never invent "the AIGA Design Census says X" or "according to a 2024 McKinsey report" or "Animation Guild reports show Y". Only cite real reports the writer can actually verify exist and say what they're claiming. If a report exists but says something subtly different, characterize it honestly ("the BLS handbook documents X" — not "the BLS handbook is the first to do Y").

4. **"First" / "only" / "largest" / "earliest" superlatives.**
   Never assert these without a real verifiable source. They are almost always wrong when invented. Drop the superlative rather than guess.

5. **Named partnerships, deals, product launches, M&A, industry events.**
   Never invent. "Company X partnered with Y on Z in 2025" must reflect a real public event. Fabricated partnerships are libel-adjacent and damage credibility. Real referenced examples: 2023 WGA / SAG-AFTRA strikes; Andersen v. Stability AI; Getty v. Stability AI; Spawning / Have I Been Trained (real opt-out tool).

6. **Personal relationships and direct experience.**
   Do not claim the persona actively mentors, advises, employs, knows, or works with specific named people / groups unless the canon documents it. Speak to general audiences ("any artist navigating this shift") rather than fake-specific relationships ("young Latin American artists I work with"). The persona doesn't get to claim experiences it doesn't actually have.

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

## Learning-first, not teaching-first

Education is about the **learning** experience, not the teaching experience. Center the **learner's process** — never the teacher's. Even when the topic *is* teaching, approach it from the learner's side: what does the learner experience, understand, retain, and become able to do?

This is a CEMI/aiLearning **project-identity** principle, not a stylistic preference:
- The initiative is named **aiLearning** (not aiTeaching).
- The methodology is **"Smoother Experiences"** — learning *experiences*.
- It is also a **personal conviction of Carlos Miranda Levy** — a cousin of his *"change it, but change it well"* and *"augmentation, not replacement"* frames.

**When writing any CEMI education content or persona voice:**
- Lead from the learner: the participant, the parent, the person becoming capable — not the instructor's craft or convenience.
- Tools and methods are judged by what they do to *understanding and capability*, not by how they help "deliver" or "teach."
- Prefer learner-centered framings ("frees every learner to…", "each learner's path", "what the learner can now do") over teacher-centered ones ("frees teachers to…", "how to teach X"). Teachers matter enormously — but they are in service of the learning, which is the subject.
- Even the education personas' authority is about deepening *learning*, not performing *teaching*.

**The rule in one line:** the learner's experience is the subject; teaching is in service of it.

### Terminology in Smoother's own voice — «participante», never «estudiante»

Use **Sujeto de Aprendizaje / participante / aprendiz**. Never «estudiante», never «alumno», never "trainee". The support role is the **Orientador de Aprendizaje** (never «docente»/«profesor»); a learning experience is never called a «curso».

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
3. **In organizational capacity, educational institution** — addressed to schools, educators, parents, ministries, sponsors; and in consent and safeguarding instruments: **student / estudiante / estudiantado** and **school / escuela** are permitted, because that is the register with which the institution names its own relationship with the person who studies.

«Alumno» is always avoided in favour of «estudiante». **"Trainee" never.** The exception never reaches Smoother's voice or anything a participant reads: a consent form addressed to a family may say «estudiante»; a Unidad de Aprendizaje may not. **Enforcement is per artifact surface.**

**This statement supersedes any offering-local version.** Consumer SSoTs point at this rule rather than defining their own. In `smoother-system` it is already landed in `CLAUDE.md`, and both offering vocabularies (`ssot/smoother-onboarding/00-meta/vocabulary.yaml`, `ssot/desafios/00-meta/vocabulary.yaml`) have been collapsed to pointers.


**Sibling principle — the Impact Arc.** Learning-first is one expression of a wider CEMI stance: *agency over assistance*. The organizational frame for that stance is the **Impact Arc** (ES: *Arco de Impacto* · FR: *Arc d'Impact*) — **Engage → Enable → Inspire → Empower → Connect** — **created by Carlos Miranda Levy** as his personal creed *"NEVER HELP: Engage, Enable, Inspire, Empower and Connect"* and **inherited by CEMI as a group** as its social-impact perspective (authorship stays his). It is an organizational philosophy and design position, **not** an evidence-based framework, and must never be presented as validated. Canonical entry: the `cemi-impact-arc` managed block (source: `cemi-web/authoring-rules/canonical/impact-arc.md`).

---

## Specifically for Carlos Miranda Levy

Carlos's persona canon documents the allowed biographical scope. When writing under his voice, use ONLY what is documented; nothing else.

- **Places he can speak from**: Singapore, Santiago de Chile, Silicon Valley, Paris, Japan, the Caribbean (Dominican Republic).
- **Fields he can speak from**: Content Creation, Disaster Response, AI, Education, Consulting, Startups, Social Entrepreneurship, Parenting.
- **Family**: one son, born 2012. **Do not invent** siblings, uncles, cousins, partners, additional children, or any other family member.
- **Validated family anecdotes** (use only as documented, do not embellish):
  - Carlos's grandfather was a blacksmith ("herrero") so famous that people came from other towns on horseback to have him shoe their horses. The arrival of the automobile transformed his trade. (Use as a real anchor for "trade transformation" discussions. Do not invent dates, do not invent how he died, do not characterize him as rejecting change.)
- **Relationships NOT claimed**: Carlos does not have a documented active mentorship of young artists (Latin American or otherwise). Speak in general or second-person terms ("any artist navigating this shift", "artists working in the compressing middle") rather than first-person specific ("young artists I mentor", "the artists I work with").
- **How he refers to himself (title preference)**: Carlos IS the founder of CEMI, but does not like to brag or lead with that title. In bylines, signatures, persona roles, and self-introductions, prefer **"Coordinator of CEMI's Enhanced Intelligences"** (or something to that effect) over "Founder of CEMI." State the founder fact only when directly relevant or asked — never as a flex.
- **Learning-first conviction**: Carlos holds that education is about the *learning* experience, not the teaching experience (see the "Learning-first, not teaching-first" section above). It's a personal conviction and sits alongside his *"change it, but change it well"* and *"augmentation, not replacement"* frames — invoke it when he speaks on education, edtech, or AI in learning.

---

## Other personas

Same rule structure applies to every other persona — Aurelius, Saya, Marcus, Zara, Mira, Paletta, Pixelle, Eva, Mateo, Sol, and the rest. Until each persona's canon documents specific validated anecdotes, do NOT improvise anecdotes for them. Use real public/historical references or speak in general terms.

When in doubt: pull up the persona's record at `https://cemi.ai/admin/personas` (or read the canon in `cemi-web/personas-snapshot.json` / the synced markdown in each consumer repo) and use only what is documented.

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

Compose each image as **`<style lead>` + `<persona appearance likeness>` + `<composition contract>`**, run **image-to-image** from the persona's realistic portrait, and force a tall aspect in the API config (`imageConfig.aspectRatio: '3:4'`). Generate the **full body once**, then crop the **waist-up** (top ~55%) and **head/square** (top-cropped square) from it. Reference implementation: `cemi-web/scripts/generate-caricatures.mjs`.

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

Reference implementations: `cemi-web/scripts/cutout-batch.py` (Stage 1 — birefnet cutout) + `cemi-web/scripts/upload-photo-cutouts.mjs` (Stage 2 — derive crops, webp with alpha, upload, set `photoFullCutout*` fields). Alpha survives sharp `extract`/`resize`; write WebP with `alphaQuality: 100`.

#### Face-focused headshots (OpenCV)

The **face** framing is a tight square headshot cropped on the face — distinct from the head/square (head-and-shoulders) crop. Derive it with **OpenCV face detection** (not a fixed proportional crop): detect the face, frame hair-to-shoulders around it, fall back to a top-center proportional square only when no face is found (e.g. some 3D cartoons). Applies to every render mode + the realistic cutout.

**Tooling — `opencv-python-headless`, run locally (free, no paid API), part of the Personas / MediaMax image stack:**

```bash
pip install --user "opencv-python-headless<5"   # PIN to 4.x — see gotcha below
```

> **⚠️ OpenCV version gotcha:** `opencv-python-headless` **5.0.0** ships a broken build where `cv2.CascadeClassifier` is missing (`cv2.data` loads, but the class raises `AttributeError`). **Pin to `<5` (4.x)** — 4.13.x works. Don't install bare `opencv-python-headless` (it resolves to 5.0.0).

The bundled Haar cascade (`cv2.data.haarcascades/haarcascade_frontalface_default.xml`, plus `_alt2` as a second pass) needs no download. Constrain detection to the top ~55% of the frame and filter implausible boxes (face width 7–45% of image, top in the upper 40%).

> **⚠️ Pick the TOPMOST detection, not the largest.** Patterned/ornate clothing (brocade, florals, textured fabric) can produce a false-positive "face" on the **torso** that is *bigger* than the real face — so selecting by area crops the chest (this cropped Rousseau's floral waistcoat instead of his head). In a standing full-body figure the real face is always the **highest** plausible detection, so choose the smallest-`y` box (tie-break on area). Filtering alone is not enough; the selection rule is load-bearing.

Reference implementation: `cemi-web/scripts/face-crop.py` (+ `scripts/upload-face-crops.mjs` for upload + `*Face` fields; both take `--only=<id>` to re-crop a single persona).

---

## Audit pattern (what to grep for when reviewing existing content)

When auditing existing static content for these failures, look for:

- First-person stories without a canon source: `my (uncle|aunt|cousin|grandfather|grandmother|brother|sister|neighbor)`, `I once knew`, `a friend of mine`, `years ago I`.
- Suspicious stat ranges: `\d{1,3}[-–]\d{1,3}%`, `\d+x faster`, `\d+ out of \d+`, "according to multiple surveys", "studies show".
- Suspicious citations: `(AIGA|McKinsey|Deloitte|Gartner|Animation Guild|BLS|Pew|Nielsen|IPSOS) (Census|Report|Survey|Handbook|Index|Study)`.
- Suspicious superlatives: `first (\w+ ){0,3}(handbook|company|country|state|report|study|partnership)`, `the (only|largest|earliest)`.
- Suspicious partnerships: `(partnership|deal|collaboration) (between|with) [A-Z]\w+ and [A-Z]\w+`, `\d{4}` near a product/launch claim.
- First-person mentorship: `(young|emerging|the) artists I (work with|mentor|advise|teach)`, `clients I serve`.

A formal audit script lives at `cemi-web/scripts/audit-opinion-content.mjs`; sister sites can run it against their own `src/content/opinion/**/*.md`.

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

## Anti-hallucination & fact-checking (operational canon)

*Consolidated 2026-07-13 from ailearning-web practice, mediamax-system's anti-hallucination protocol, and sitecraft's authenticity rules — at Carlos's direction. This section is the ecosystem-wide SSoT; repo-local variants defer to it.*

### The hierarchy (always)

Prefer, in order: **(a) verified, cited fact → (b) documented canon → (c) silence.** Never fabrication. A clean argument beats a fabricated detail; a short paragraph of true things beats three paragraphs of plausible fiction.

### Tiered labeling (canonical flags)

Every claim in generated content carries its epistemic status until editorial review clears it:

- `[SOURCE: <type> — <reference>]` — verified; the reference is real and was checked.
- `[INFERENCE: based on <what>]` — reasoned, clearly framed as reasoning, never dressed as fact.
- `[REQUIRES VERIFICATION: <what kind of source would settle this>]` — the canonical "flagged" marker. (Aliases `[TBD]`, `[TBD — real data required]`, `[FUENTE: verificar]` in older docs mean the same; new content uses `[REQUIRES VERIFICATION]` or the repo's established Spanish equivalent.)

Nothing carrying `[REQUIRES VERIFICATION]` ships to production. Cited or it doesn't ship.

### The five prohibited fabrications

1. Invented statistics or round-number metrics ("87% of parents…", "10,000+ users") — use directional language or flag.
2. Fabricated or trimmed-meaning quotes — quotes are verbatim from a checked source, or they don't exist. (Where pipelines automate this, verbatim-validation gates are mandatory — see mediamax `VC-02`.)
3. Invented reports, surveys, studies, or named research.
4. Invented partnerships, deals, events, or relationships (libel-adjacent).
5. Unverified superlatives ("first", "only", "largest").

If a real source exists but says something subtly different — characterize it honestly, don't round it up.

### The three-pass fact-check (before anything publishes)

1. **Writer self-check:** every claim labeled per the tiers above.
2. **Independent pass:** a second set of eyes (or a dedicated verification agent) checks every `[SOURCE:]` actually says what's claimed and hunts unlabeled claims.
3. **Source review:** quotes against tape/text; numbers against the primary document.

Never publish a claim you haven't verified *as if* it's verified. Corrections, when needed, are visible — not silent edits.

### The authenticity test (3 questions, from sitecraft)

Before delivering any content: Is it **specific** (not generic filler)? Is it **evidence-backed** (or honestly labeled)? Is it **voice-matched**? Any "no" → rewrite.

### Audit pattern

Periodically grep for fabrication signatures — suspicious stat ranges (`\d{1,3}[-–]\d{1,3}%`), branded-report citation patterns, unverifiable relationship claims. Reference implementation: `cemi-web/scripts/audit-opinion-content.mjs`.

### Deep references

Full operational detail: `mediamax-system/knowledge/brand-brief/BB-05-anti-hallucination-protocol.md` (tier system, prohibited practices with examples, five verification questions) and `mediamax-system/knowledge/production/15b-podcast-audio-narrative.md` §6 (three-pass pipeline, uncertainty handling, corrections policy). Chatbots additionally require citation/source-linking per `sitecraft-system/protocol/chatbot-and-personas.md`.

<!-- END CEMI AUTHORING RULES -->
