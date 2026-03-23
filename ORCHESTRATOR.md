# ORCHESTRATOR.md — Living Repo Summary

> This file is maintained by the orchestrator thread. It preserves architecture,
> conventions, decisions, and risks so context survives compaction.
> Last updated: 2026-03-20

---

## Architecture

**Type:** Static single-page HTML (no build system, no framework)

```
index.html              ← Main entry. 78KB. All JS inline. Spanish UI.
promo.html              ← Promotional image generator (Instagram/WhatsApp)
data/
  participants.json     ← Team registry (source of truth for Equipo section)
  raw/                  ← Sample government payroll data (CSV/JSON, ~2.7MB)
assets/team/            ← Team member photos (erick-santana.png)
.claude/commands/       ← Custom slash commands (participant-intake.md)
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
| `RD Job Visualizer Research.md` | Deep analysis (embedded inline in index.html) |

---

## CDN Dependencies

| Library | Purpose |
|---------|---------|
| Tailwind CSS (`cdn.tailwindcss.com`) | Utility CSS |
| Lucide Icons (`unpkg.com/lucide@latest`) | Icons |
| Marked.js (`cdn.jsdelivr.net/npm/marked/marked.min.js`) | Markdown rendering |
| Plus Jakarta Sans (Google Fonts) | Typography |

---

## index.html Structure

### Sections (in order)
1. Nav (sticky, glass effect) — links: Visión, Roadmap, Roles, Equipo, Tecnología, Plan, Datos, Investigación
2. Hero — countdown timer targeting `2026-03-27T23:59:59`, CTA to WhatsApp signup
3. Vision — mission + mockup treemap preview
4. Roadmap — 4-phase timeline cards
5. Roles — 8 role cards (dev, data, design, content, etc.)
6. **Equipo** — Dynamic grid, fetches `data/participants.json`, renders cards with photo/initials, status badge, role, bio, skills, socials
7. Tech Stack — Claude Code, Playwright, MCP, React+Tailwind
8. Plan — button opens overlay → fetches `PROJECT_PLAN.md`
9. Datos — two buttons open overlays → fetches `DATA_SOURCES.md` and `SECTOR_TAXONOMY.md`
10. Investigación — button opens overlay → renders embedded `<script id="research-md">`
11. Final CTA — WhatsApp signup
12. Footer

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

### Raw Data Samples (in data/raw/)
- `nomina-conaleche-2026.csv` — 796 rows. Cols: Nº, Nombre, Departamento, Cargo, Designacion, Genero, Sueldo Bruto, Mes, Año
- `nomina-asde-2020-2023.csv` — 11,460 rows. Municipality payroll with monthly salary breakdown.
- `datos-gob-ckan-nomina-search.json` — CKAN API metadata for 167 government payroll datasets.

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

---

## Known Fragile Areas

1. **Hardcoded WhatsApp number** (`+12245155867`) — no fallback if changed
2. **Fetch-based overlays** — no error handling if .md files renamed/deleted
3. **Countdown date** — `2026-03-27T23:59:59` with no timezone, parsed as local time
4. **`lucide.createIcons()`** called 7+ times — performance concern, no dedup
5. **2MB team photo** — `erick-santana.png` is unoptimized, will slow page load
6. **participants.json** — no validation, corrupt JSON = broken team section

---

## Current State (as of 2026-03-20)

### Completed
- [x] 0.3 — Plan + research shared (overlays on landing)
- [x] 0.4 — Data sources inventoried (DATA_SOURCES.md + samples downloaded)
- [x] 0.5 — Sector taxonomy defined (SECTOR_TAXONOMY.md, 12 sectors)
- [x] X.1 — Participant intake skill (`/participant-intake`)
- [x] X.2 — Team section on landing (dynamic from participants.json)

### Blocked
- [!] 0.1 — Confirm participants (external dependency)
- [!] 0.2 — Create group (needs confirmed participants)

### Next Up (Day 1 — Mon Mar 23)
- 1.1 — Download datasets from datos.gob.do
- 1.4 — Define normalized data schema
- 1.6 — Setup repo structure (/data, /scripts, /src)

---

## Participants

| Name | Status | Challenge Role | Key Info |
|------|--------|---------------|----------|
| Erick Santana | confirmed | Gestión de Proyecto | Product leader, BairesDev, Punta Cana. Full profile + photo. |
| Jonathan Ovalley | confirmed | TBD | Analytics, design, AI dev. GitHub: jovalleyz. 2h/día disponible. |
