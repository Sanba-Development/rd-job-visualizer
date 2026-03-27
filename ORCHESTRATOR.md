# ORCHESTRATOR.md — Living Repo Summary

> This file is maintained by the orchestrator thread. It preserves architecture,
> conventions, decisions, and risks so context survives compaction.
> Last updated: 2026-03-27 (session-save: Day 4 complete, Day 5 Demo Day)

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
| `CONTRIBUCIONES.md` | 43 post-challenge contributions across 9 segments |
| `ORCHESTRATOR-ABEL.md` | Abel López's Claude session context file |
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
1. Nav (sticky, glass effect) — links: Progreso, Contribuir, Equipo, Visión, Roadmap, Roles, Tecnología, Plan, Investigación
2. Hero — countdown timer targeting `2026-03-27T23:59:59`, CTA to WhatsApp signup
3. **Treemap Showcase** — Preview widget linking to treemap
4. **Progreso** — Days 1-4 (completed, colored cards with links) + Day 5 (amber/pending) + "¿Y ahora qué?" (6 gradient cards + overlay button)
5. Contribuir — "Únete al Equipo" with ONBOARDING.md overlay
6. **Equipo** — Dynamic grid from `data/participants.json` (photo/initials, status badge, role, bio, skills, socials)
7. Vision — mission + mockup treemap preview
8. Roadmap — 4-phase timeline cards
9. Roles — 8 role cards (dev, data, design, content, etc.)
10. Tech Stack — Claude Code, Playwright, MCP, React+Tailwind
11. Plan — button opens overlay → fetches `PROJECT_PLAN.md`
12. Investigación — button opens overlay → renders embedded `<script id="research-md">`
13. Final CTA — WhatsApp signup
14. Footer

### Overlays (7 total)
Research, Plan, Datos (DATA_SOURCES.md), Taxonomy (SECTOR_TAXONOMY.md), RD Trabaja analysis, Signup form, Contribuciones (CONTRIBUCIONES.md)

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
| 3 agents on same file works sequentially | 2026-03-27 | Tasks 4.1/4.3/4.4 all edited treemap.html — ran sequentially (not worktrees), reviewed final state. No conflicts. |
| Abel contributes via own branch | 2026-03-27 | Abel uses his own Claude session with ORCHESTRATOR-ABEL.md. Branches from day4/working, PRs back to it. |
| salary_max is polluted by subtotals | 2026-03-27 | CORAABO CSV has subtotal rows (RD$1.7M) that normalize.js treats as individual records. Real max is RD$450K (Presidente Abinader). See backlog X.6. |
| CONTRIBUCIONES.md as post-challenge roadmap | 2026-03-27 | 43 contributions across 9 segments. Visible on landing via "¿Y ahora qué?" section with overlay. |
| Bureau de Empleo concept | 2026-03-27 | Erick's idea: employment verification bureau modeled on credit bureaus (give-in/take-out). 5 contributions in CONTRIBUCIONES.md. |
| Treemap inverso concept | 2026-03-27 | Erick's idea: identify institutions NOT reporting data. Reverse transparency accountability. 5 contributions. |
| Carlos Miranda prospectiva | 2026-03-27 | Carlos contributes sectoral vulnerability analysis + iBIZAi article. Added as contributions #41-43. |
| serve -s breaks multi-page sites | 2026-03-27 | `npx serve . -s` (SPA mode) redirects .html → extensionless URLs → falls back to index.html. Use `npx serve .` without -s. |

---

## Known Fragile Areas

1. **Hardcoded WhatsApp number** (`+12245155867`) — no fallback if changed
2. **Fetch-based overlays** — no error handling if .md files renamed/deleted
3. **Countdown date** — `2026-03-27T23:59:59` with no timezone, parsed as local time
4. **`lucide.createIcons()`** called 7+ times — performance concern, no dedup
5. **2MB team photo** — `erick-santana.png` is unoptimized, will slow page load
6. **participants.json** — no validation, corrupt JSON = broken team section
7. **normalize.js subtotal rows** — CORAABO (and potentially other CSVs) have subtotal/total rows that get treated as individual salary records. salary_max in metrics.json is RD$1.7M (actually a subtotal of 131 employees). Real individual max is RD$450K.
8. **Lucide icon `palm-tree` missing** — Not in bundled Lucide icons. Shows as empty on methodology page.

---

## Current State (as of 2026-03-27)

### Completed (Days 0-4)
- [x] Days 0-3: All tasks (see BACKLOG.md for full history)
- [x] 4.1 — Drill-down: click sector → top 10 occupations in color variants, breadcrumb nav, back button. Mobile uses bottom sheet.
- [x] 4.2 — Panel mejorado: salary distribution bars, Pareto 80/20 visual strip, methodology link. PR #32 by Abel López.
- [x] 4.3 — Responsive mobile: taller treemap (0.75 ratio), hidden tooltip, compact stats, relaxed label thresholds for top 4.
- [x] 4.4 — Methodology links in header stats bar and footer of treemap.
- [x] 4.5 — Deploy verified (auto-deploy on merge). Tested desktop 1280px + mobile 375px.
- [x] 4.6 — Browser tested: all features pass on desktop and mobile.
- [x] Landing: Day 4 completed cards (colorful) + Day 5 Demo Day section + "¿Y ahora qué?" section with 43 contributions overlay
- [x] CONTRIBUCIONES.md: 43 contributions across 9 segments (visualization, pipeline, treemap inverso, bureau de empleo, data standards, community, policy, infrastructure, prospectiva)
- [x] Angelino Mejía-Ricart confirmed with full profile + photo
- [x] CLAUDE.md updated with session learnings

### Blocked
- [!] 0.1 — 8 confirmed, 1 pending info

### Discarded
- 1.3 — Aldaba RSS (no API, returns 403)

### Pending / Next Up (Day 5 — Demo Day, Fri Mar 27)
- 5.1 — Bugfixes (critical only)
- 5.2 — Prepare demo script (2-3 min)
- 5.3 — Capture screenshots and GIFs
- 5.4 — Demo Day: live presentation
- 5.5 — Final social media post with portal link
- 5.6 — Retrospective

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
| Angelino Mejía-Ricart | confirmed | Contenido & Comunicación | Diseño, marketing, content creation. GitHub/IG: angelinocvino. Photo. |
| (unnamed) | interested | TBD | Pending info. |
