---
trigger: model_decision
description: "CEMI canon (cemi-png-logos): 🖼️ HARD RULE — logos are PNG, never SVG (all CEMI media/video repos)"
---
<!-- delivered by cemi-system canon-sync from mediamax-system/sync/png-logos.md; edit the source, not this copy -->

<!-- BEGIN cemi-png-logos v2 (managed — source: mediamax-system/sync/png-logos.md) -->
## 🖼️ HARD RULE — logos are PNG, never SVG (all CEMI media/video repos)

Anywhere a logo's **type is rendered** — hyperframe/video compositions, brand-closes, chrome overlays, canvas/OG cards, favicons, generated imagery — always use a **PNG** logo, **never SVG**. SVG logos render their **fonts incorrectly** at render time: the wordmark depends on the font being available in the (often headless) renderer, so it comes out wrong. PNG bakes the type, so it is always correct.

- **Hyperframes / video:** chrome and brand-lockup MUST be PNG. SVG wordmarks render wrong in the compositor.
- **White logos** don't show on light/white backgrounds — use the color version or add a glow. (Brand-closes are dark, so white is fine there.)
- **Per-repo logo sets are independent** — each repo owns its own approved PNG set; do NOT sync one repo's brand logos into another.

This is about **logos** (they carry type). Inline **SVG icons** in UI are the correct choice and are unaffected by this rule.
<!-- END cemi-png-logos v2 -->
