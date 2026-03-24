# ORCHESTRATOR.md — Living Repo Summary

> This file is maintained by the orchestrator thread. It preserves architecture,
> conventions, decisions, and risks so context survives compaction.
> Last updated: 2026-03-24 (session-save)

---

## Architecture

**Type:** Static single-page HTML (no build system, no framework)

```
index.html              ← Main entry. 78KB. All JS inline. Spanish UI.
explorer.html           ← Interactive Data Explorer (PapaParse CSV preview, 15 datasets)
promo.html              ← Promotional image generator (Instagram/WhatsApp)
data/
  participants.json     ← Team registry (source of truth for Equipo section)
  raw/                  ← Government payroll/employment data (15 files, 436k+ rows, ~25MB)
  raw/MANIFEST.md       ← Inventory of all downloaded files with metadata
  processed/            ← (empty) For normalized output
  schemas/              ← normalized-job.schema.json + README.md
scripts/
  scrapers/             ← (empty) For Playwright/web scrapers
  processors/           ← (empty) For data normalization scripts
src/                    ← (empty) For frontend source code (React/D3.js)
assets/team/            ← Team member photos (erick-santana.png, jonathan-ovalley.png)
.claude/commands/       ← Custom slash commands (participant-intake.md, session-save.md)
.vercel/                ← Vercel project config (prj_vDKsKAllXVHViCpF1NQvlAhonjZC)
```

### Key Documents (Markdown)
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project guidance for Claude Code sessions |
| `BACKLOG.md` | Live task tracker — single source of truth for progress |
| `PROJECT_PLAN.md` | Sprint roadmap (Day 0-5), roles, risks, criteria |
| `DATA_SOURCES.md` | 6 prioritized government data sources with URLs |
| `SECTOR_TAXONOMY.md` | 12 CIUO-08 sectors for treemap + color palette |
| `CONTRIBUTING.md` | Contribution rules for the team |
| `README.md` | Project overview, structure, team, links |
| `RD Job Visualizer Research.md` | Deep analysis (embedded inline in index.html) |

---

## CDN Dependencies

| Library | Purpose |
|---------|---------|
| Tailwind CSS (`cdn.tailwindcss.com`) | Utility CSS |
| Lucide Icons (`unpkg.com/lucide@latest`) | Icons |
| Marked.js (`cdn.jsdelivr.net/npm/marked/marked.min.js`) | Markdown rendering |
| PapaParse (`cdn.jsdelivr.net/npm/papaparse@5.4.1`) | CSV parsing (explorer.html) |
| Plus Jakarta Sans (Google Fonts) | Typography |

---

## index.html Structure

### Sections (in order)
1. Nav (sticky, glass effect) — links: Progreso, Visión, Roadmap, Roles, Equipo, Tecnología, Plan, Investigación
2. Hero — countdown timer targeting `2026-03-27T23:59:59`, CTA to WhatsApp signup
3. **Progreso ("Lo Que Ya Tenemos")** — 6 colored card grid: Inventario, Explorador, Sectores, API RD Trabaja, Wireframe, Plan
4. Vision — mission + mockup treemap preview
5. Roadmap — 4-phase timeline cards
6. Roles — 8 role cards (dev, data, design, content, etc.)
7. **Equipo** — Dynamic grid from `data/participants.json` (photo/initials, status badge, role, bio, skills, socials)
8. Tech Stack — Claude Code, Playwright, MCP, React+Tailwind
9. Plan — button opens overlay → fetches `PROJECT_PLAN.md`
10. Investigación — button opens overlay → renders embedded `<script id="research-md">`
11. Final CTA — WhatsApp signup
12. Footer

### Overlays (6 total)
Research, Plan, Datos (DATA_SOURCES.md), Taxonomy (SECTOR_TAXONOMY.md), RD Trabaja analysis, Signup form

### Overlays (Modal Pattern)
All overlays follow same pattern:
- `<div id="*-overlay" class="fixed inset-0 z-[100] hidden">`
- Backdrop click + ESC key to close
- Content rendered via `marked.parse()` on first open (lazy, cached with `*Rendered` flag)
- Each has dedicated CSS rules for markdown styling (headings, tables, code, links)

### Inline JS Functions
- `openSignupForm()` / `closeSignupForm()` / `handleSignupSubmit(e)` — WhatsApp deep link to `+12245155867`
- `updateCountdown()` — 1-second interval timer
- `open/close[Research|Plan|Datos|Taxonomy]Overlay()` — Modal toggles with fetch
- Team grid loader — `fetch('data/participants.json')` on page load

---

## Data Architecture

### participants.json Schema
```json
{
  "id": "slug",
  "name": "Full Name",
  "headline": "Professional title",
  "current_role": "Job title",
  "current_company": "Company",
  "location": "City, Country",
  "bio": "1-2 sentences",
  "challenge_role": "Role in challenge (from PROJECT_PLAN.md roles)",
  "status": "confirmed | interested | pending",
  "skills": ["skill1", "skill2"],
  "socials": { "linkedin": null, "github": null, "twitter": null, "website": null, "email": null },
  "photo_url": "assets/team/slug.png | null",
  "joined_at": "YYYY-MM-DD",
  "updated_at": "YYYY-MM-DD"
}
```

### Raw Data (in data/raw/ — see MANIFEST.md for full details)
**15 files, 436,000+ rows total.** Key datasets:
- `nomina-propeep-2018-2025.csv` — 90,921 rows (PROPEEP social programs)
- `nomina-mivhed-2022-2026.csv` — 78,828 rows (Min. Vivienda)
- `nomina-mapre-2017-2026.csv` — 68,471 rows (Min. Adm. Presidencia)
- `retencion-isr-salarios-dgii-2017-2025.csv` — 174,042 rows (DGII salary ISR)
- `empleos-cotizantes-tss-2003-2026.csv` — 272 rows (TSS 23-year employment series)
- `salario-minimo-hacienda-2000-2025.csv` — 2,862 rows (minimum wage by sector)
- Plus: CONALECHE, ASDE, INESDYC, CORAABO, zonas francas, CKAN metadata

### Normalized Schema (data/schemas/)
- `normalized-job.schema.json` — JSON Schema draft-07, 22 fields, 7 required
- `README.md` — Spanish docs with field-by-field mapping from each source

---

## Conventions

- **UI language:** Spanish. Always.
- **Code language:** Mixed Spanish/English (variables in English, UI strings in Spanish)
- **Naming:** kebab-case for IDs/files, camelCase for JS vars, UPPER_SNAKE for .md docs
- **Branching:** `feat/*` branches → PR to `master` (no `main`)
- **Commits:** English commit messages, descriptive, with `Co-Authored-By: Claude Opus 4.6`
- **Overlays:** All follow the same HTML/CSS/JS pattern — copy existing when adding new ones
- **Backlog:** Update `BACKLOG.md` immediately after completing any task
- **No build system:** Pure static HTML. Use `npx serve .` for local dev (needed for fetch).

---

## Decisions Made

| Decision | Date | Context |
|----------|------|---------|
| 12 sectors for treemap | 2026-03-20 | Based on CIUO-08, see SECTOR_TAXONOMY.md |
| Aldaba discarded as source | 2026-03-20 | Returns 403, no RSS/API |
| MAP API returns 403 | 2026-03-20 | Need to investigate with headers; datos.gob.do CKAN works as alternative |
| BACKLOG.md is live tracker | 2026-03-20 | PROJECT_PLAN.md is reference, BACKLOG.md is the working tracker |
| participants.json as team DB | 2026-03-20 | Simple JSON, no backend needed for MVP |
| PR workflow preferred | 2026-03-20 | User prefers PRs over direct push to master |
| Data transparency via explorer | 2026-03-22 | User values making raw data browsable publicly — created explorer.html |
| Orchestrator mode persisted | 2026-03-23 | Added to CLAUDE.md so new sessions auto-start in orchestrator mode |
| /session-save skill created | 2026-03-23 | Captures session learnings before closing; updates ORCHESTRATOR.md + memories |
| Small changes direct to master | 2026-03-22 | Config/participant updates go direct; features go via PR |
| CSV delimiter varies | 2026-03-23 | Many govt CSVs use semicolons, not commas. PapaParse auto-detects. |
| RD Trabaja has open API | 2026-03-23 | `empleateya.mt.gob.do/api/puestos?PageSize=500` — no auth, no Playwright needed |
| Master branch protected | 2026-03-24 | Requires PR + 1 approval. Admin can bypass. No direct push. |
| No manual Vercel deploy | 2026-03-24 | Vercel Git Integration auto-deploys on merge. Never run `vercel --prod`. |
| Domain: jobs.sanba.dev | 2026-03-24 | Production domain. sanba.dev reserved for future company landing. |
| Progress section above fold | 2026-03-24 | 6 card grid moved below hero for immediate visibility of achievements. |
| Nanobanana MCP for images | 2026-03-24 | Use `gemini_generate_image` with conversation_id for consistent style. Reference images for real photos. |

---

## Known Fragile Areas

1. **Hardcoded WhatsApp number** (`+12245155867`) — no fallback if changed
2. **Fetch-based overlays** — no error handling if .md files renamed/deleted
3. **Countdown date** — `2026-03-27T23:59:59` with no timezone, parsed as local time
4. **`lucide.createIcons()`** called 7+ times — performance concern, no dedup
5. **2MB team photo** — `erick-santana.png` is unoptimized, will slow page load
6. **participants.json** — no validation, corrupt JSON = broken team section

---

## Current State (as of 2026-03-24)

### Completed (Day 0 + Day 1)
- [x] 0.3 — Plan + research shared (overlays on landing)
- [x] 0.4 — Data sources inventoried (DATA_SOURCES.md + samples downloaded)
- [x] 0.5 — Sector taxonomy defined (SECTOR_TAXONOMY.md, 12 sectors)
- [x] X.1 — Participant intake skill + participant DB
- [x] X.2 — Team section on landing (dynamic from participants.json)
- [x] 1.1 — Downloaded 15 datasets (436k+ rows) from datos.gob.do CKAN
- [x] 1.2 — RD Trabaja API discovered (open REST, no Playwright needed)
- [x] 1.4 — Normalized schema (22 fields, JSON Schema draft-07)
- [x] 1.5 — Treemap wireframe (desktop + mobile, interactive mockup)
- [x] 1.6 — Repo structure (scripts/, src/, data/processed/, data/schemas/)
- [x] 1.1b — Data Explorer (explorer.html) with interactive CSV preview
- [x] Contributing guide + master branch protection + README

### Blocked
- [!] 0.1 — Confirm participants (4 total: 2 confirmed, 2 interested)
- [!] 0.2 — Create group (coordination via WhatsApp direct for now)

### Discarded
- 1.3 — Aldaba RSS (no API, returns 403)
- 2.1 — Playwright scraper (replaced by direct API call to empleateya.mt.gob.do)

### Pending / Next Up (Day 2 — Tue Mar 24)
- 2.3 — Script de normalización (raw → schema)
- 2.5 — Prototipo treemap con datos dummy (D3.js)
- 2.4 — Validación cruzada: sectores de fuentes vs taxonomía
- 2.6 — Paleta de colores por sector (already in SECTOR_TAXONOMY.md, needs D3 integration)

### Uncommitted local changes (need PR)
- CLAUDE.md updates (deployment, UI patterns, RD Trabaja API, contributing rules)
- ORCHESTRATOR.md updates (this session-save)

---

## Participants

| Name | Status | Challenge Role | Key Info |
|------|--------|---------------|----------|
| Erick Santana | confirmed | Gestión de Proyecto | Product leader, BairesDev, Punta Cana. Full profile + photo. |
| Jonathan Ovalley | confirmed | TBD | Analytics, design, AI dev. GitHub: jovalleyz. 2h/día. |
| Carlos Miranda Levy | interested | TBD | Pending: email, GitHub, availability, photo. |
| Victor Corniel | interested | TBD | Dev, project mgmt, integration. Pending: email, GitHub, photo. |
