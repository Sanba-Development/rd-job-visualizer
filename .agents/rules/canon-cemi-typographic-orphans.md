---
trigger: model_decision
description: "CEMI canon (cemi-typographic-orphans): 🔤 No one-word last lines in titles — web headlines and HyperFrames titles (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/typographic-orphans.md; edit the source, not this copy -->

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
