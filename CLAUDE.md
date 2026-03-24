# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RD Job Visualizer is a 7-day challenge organized by **Sanba Development** to build an interactive portal for exploring the Dominican Republic job market, inspired by [Andrej Karpathy's US Job Market Visualizer](https://karpathy.ai/jobs/). The goal is to scrape DR job portals (RD Trabaja, Aldaba RSS, datos.gob.do) as data sources, aggregate job metadata (volume, salary ranges, sectors, geography), and render an interactive D3.js treemap. Note: RD Trabaja is one of several data sources — not the identity of the project.

## Current State

The project is currently a **single static HTML file** (`index.html`) serving as a recruitment/landing page for the hackathon sprint, plus a research document (`RD Job Visualizer Research.md`) detailing the data architecture plan. There is no build system, package manager, or framework installed yet.

Key documents and artifacts:
- `DATA_SOURCES.md` — Inventario de 6 fuentes de datos priorizadas con URLs y formatos
- `SECTOR_TAXONOMY.md` — 12 sectores basados en CIUO-08 adaptados a RD
- `data/raw/` — 15 datasets gubernamentales (436k+ filas). Ver `data/raw/MANIFEST.md`.
- `data/schemas/normalized-job.schema.json` — Schema normalizado (22 campos, JSON Schema draft-07)
- `explorer.html` — Data Explorer interactivo para navegar los datasets
- `ORCHESTRATOR.md` — Living architecture summary (read this first in new sessions)

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

Open `index.html` in a browser directly — no build step needed. Any static file server works (`npx serve .`, `python -m http.server`, etc.).

## Stack & Dependencies (CDN-loaded, no local install)

- **Tailwind CSS** via CDN script tag
- **Lucide Icons** via unpkg
- **Plus Jakarta Sans** via Google Fonts
- **Marked.js** via CDN for rendering markdown overlays

All JS is inline at the bottom of `index.html`.

## Planned Architecture (from research doc)

The full MVP pipeline follows Karpathy's pattern:
1. **Ingestion** — Playwright scrapers for RD Trabaja (SPA), CSV/JSON downloads from MAP/TSS/ENCFT via datos.gob.do and CKAN API
2. **Processing** — Normalization to CIUO-08 sectors (see `SECTOR_TAXONOMY.md`)
3. **Visualization** — D3.js interactive treemap with layers: sector, geography, salary
4. **Storage** — JSON for MVP simplicity

## Data Sources (see DATA_SOURCES.md for full details)

Priority sources for MVP:
- **P0:** MAP Nómina Pública (JSON API — currently 403, needs investigation), datos.gob.do CKAN API (working)
- **P0:** TSS Empleos Cotizantes (CSV)
- **P1:** ENCFT Banco Central (XLSX)
- **P2:** RD Trabaja (Playwright scraping), CNZFE Zonas Francas

Discarded: Aldaba (403/auth required), Portal Concursa (down), LinkedIn (paywall).

## Contributing Rules

See `CONTRIBUTING.md` for full details. Key rules:

- **Master is protected** — requires PR + 1 approval to merge. No direct push.
- **One branch per task** — `feat/`, `fix/`, or `data/` prefix.
- **Update BACKLOG.md** after completing any task.
- **Don't modify CLAUDE.md or ORCHESTRATOR.md** without Erick's approval.
- **Don't delete raw data** — only add to `data/raw/`.
- **Test locally** with `npx serve .` before creating a PR.

## Language

All UI and content is in **Spanish**. Comments and code may mix Spanish and English.
