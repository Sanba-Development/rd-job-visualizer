# CLAUDE.md

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
