---
trigger: model_decision
description: "CEMI canon (cemi-page-size): 📄 Printable output is US Letter unless told otherwise (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/page-size.md; edit the source, not this copy -->

<!-- BEGIN cemi-page-size v1 (managed — source: cemi-system/sync/page-size.md) -->
## 📄 Printable output is US Letter unless told otherwise (all CEMI repos)

Carlos, 2026-11-17: «Always assume Letter 8.5x11" unless the project, site or user says differently.»

- **The default page is US Letter**, 8.5 × 11 in (215.9 × 279.4 mm), for everything printed or rendered to PDF or Word: one-pagers and infographics, guides and handouts, proposals, quotes, letters, dossiers and reports.
- **European and Swiss audiences get A4** (210 × 297 mm), the paper they print on: fabriqueafetes.ch, the French pages of a site printed in France, a proposal to a European client (Carlos, 2026-11-17: «European and Swiss get A4»). The site or project records it in its `CLAUDE.md`, and a site that serves both picks the size by the reader's market, not by the language alone.
- **Any other size only when the project, the site or the person asking says so.**
- **Write the size out; never rely on a tool's default:** `@page { size: Letter }`, `page.pdf({ format: 'Letter' })`, Word sections set to 8.5 × 11 in. A landscape page is Letter turned (11 × 8.5 in), unless it is a 16:9 slide.
- **A generator that writes A4 for a non-European audience switches to Letter at its next edit;** one that serves a European or Swiss audience keeps A4 and says why in the project's `CLAUDE.md`.

How to apply it per tool, with pagination and margins: `sitecraft-system/protocol/signed-documents.md` §4.
<!-- END cemi-page-size v1 -->
