---
trigger: model_decision
description: "CEMI canon (cemi-svg-icons): ✳️ Icons are SVG line icons — Lucide preferred, never emoji (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from sitecraft-system/sync/svg-icons.md; edit the source, not this copy -->

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
