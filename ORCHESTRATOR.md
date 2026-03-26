# ORCHESTRATOR.md — Living Repo Summary

> This file is maintained by the orchestrator thread. It preserves architecture,
> conventions, decisions, and risks so context survives compaction.
> Last updated: 2026-03-26 (session-save)

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
| dayN/working branch pattern | 2026-03-25 | Feature branches PR into dayN/working, then dayN/working PRs into master at end of day |
| Treemap data is hardcoded | 2026-03-25 | src/treemap.html has inline data — must manually update when normalization changes. Task 3.1 will fix this. |
| Explorer datasets hardcoded | 2026-03-25 | explorer.html JS array must be updated when new data files are added |
| Mix real + estimated data | 2026-03-25 | Treemap shows real data (solid) + estimates (dashed border, 70% opacity) with visual distinction |
| Abel López owns color palette | 2026-03-25 | sector-colors.json maintained by Abel. WCAG-compliant. Treemap must sync colors from this file. |
| MIVHED = Admin Pública | 2026-03-25 | Ministry of Housing employees are govt workers, not construction. Fixed in normalize.js. |
| RD Trabaja nested JSON | 2026-03-25 | API returns data[].puesto.titulo (nested), not data[].titulo. Fixed in normalize.js. |
| Explorer must be updated manually | 2026-03-26 | When new data files are added, update the JS datasets array in explorer.html |
| metrics.json is the bridge | 2026-03-26 | Treemap reads metrics.json (not normalized.json). Pipeline: normalize.js → calculate-metrics.js → treemap loads |
| Vercel preview auth | 2026-03-26 | Disable "Vercel Authentication" in project Settings → Deployment Protection for public previews |
| Promo images not in git | 2026-03-26 | promo-day*.png files stay local, not committed. Used for WhatsApp/social media only. |
| Parallel subagents need coordination | 2026-03-26 | When two agents modify related files (treemap data + treemap layout), plan file ownership carefully |

---

## Known Fragile Areas

1. **Hardcoded WhatsApp number** (`+12245155867`) — no fallback if changed
2. **Fetch-based overlays** — no error handling if .md files renamed/deleted
3. **Countdown date** — `2026-03-27T23:59:59` with no timezone, parsed as local time
4. **`lucide.createIcons()`** called 7+ times — performance concern, no dedup
5. **2MB team photo** — `erick-santana.png` is unoptimized, will slow page load
6. **participants.json** — no validation, corrupt JSON = broken team section

---

## Current State (as of 2026-03-26)

### Completed (Day 0 + Day 1 + Day 2 + Day 3)
- [x] Days 0-2: All tasks (see BACKLOG.md for full history)
- [x] 3.1 — Treemap loads metrics.json dynamically (no more hardcoded data)
- [x] 3.2 — Tooltips with Pareto 80/20, top titles, salary, sources, detail panel
- [x] 3.3 — 7 new datasets (CNZFE×4, MITUR, MISPAS, MIVHED). 264K records from 20 sources.
- [x] 3.4 — calculate-metrics.js: per-sector salary/Pareto/titles/institutions/gender. Global Pareto 3.12x.
- [x] 3.5 — data-quality-report.md: 10.4% formal coverage, outliers identified
- [x] 3.6 — methodology.html: sources, classification, limitations, coverage
- [x] Explorer updated with 27 datasets
- [x] Landing: Day 3 completed + Day 4 task cards added
- [x] Treemap showcase section between hero and progress

### Blocked
- [!] 0.1 — 9 participants (7 confirmed, 2 interested)

### Discarded
- 1.3 — Aldaba RSS (no API, returns 403)

### Pending / Next Up (Day 4 — Thu Mar 26)
- 4.1 — Drill-down: click sector → expand sub-categories
- 4.2 — Panel lateral mejorado (salary distribution visual, Pareto bar)
- 4.3 — Responsive: mobile < 768px
- 4.4 — Link methodology from treemap
- 4.5 — Testing: 3+ browsers
- 4.7 — FEATURE FREEZE 6pm

---

## Participants

| Name | Status | Challenge Role | Key Info |
|------|--------|---------------|----------|
| Erick Santana | confirmed | Gestión de Proyecto | Product leader, BairesDev, Punta Cana. Full profile + photo. |
| Jonathan Ovalley | confirmed | TBD | Analytics, design, AI dev. GitHub: jovalleyz. 2h/día. |
| Carlos Miranda Levy | confirmed | TBD | Interrelaciones sectoriales, prospectiva. thesocialentrepreneur.com. Photo. |
| Victor Corniel | confirmed | TBD | Dirección de proyecto, BI, UX/UI. 6h/día. Photo. |
| Abel López | confirmed | TBD | ENIA, Envision Innovation Labs. GitHub: jabelg. 3h/día. Owns color palette. |
| José D'Andrade | confirmed | TBD | AI/ML/Data Science. Legal Design DO. GitHub: 13g4d0. Photo. |
| Arlette Palacio | confirmed | TBD | EdTech (Educology). 2h/día. Photo. |
| Angelino | interested | TBD | Comunicación, diseño, marketing. Pending details. |
| (unnamed) | interested | TBD | Pending info. |
