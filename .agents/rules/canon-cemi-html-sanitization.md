---
trigger: model_decision
description: "CEMI canon (cemi-html-sanitization): 🛡️ HTML sanitization — never inject untrusted HTML unsanitized (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from sitecraft-system/sync/html-sanitization.md; edit the source, not this copy -->

<!-- BEGIN cemi-html-sanitization v2 (managed — source: sitecraft-system/sync/html-sanitization.md) -->
## 🛡️ HTML sanitization — never inject untrusted HTML unsanitized (all CEMI repos)

Any content rendered into the DOM as raw HTML — `{@html}` (Svelte), `set:html` / `<Fragment set:html>` (Astro), `dangerouslySetInnerHTML` (React), `.innerHTML`, `v-html` — **MUST be sanitized before injection UNLESS its source is fully trusted.**

- **Trusted (no sanitizer required):** build-time content authored in-repo and git-reviewed — committed markdown/HTML, hardcoded icon-SVG constants, seed-script template literals. The git diff is the review gate.
- **Untrusted (sanitize ALWAYS):** anything user-contributed, form-submitted, externally fetched, runtime-AI-generated, or otherwise not git-reviewed — community resources, comments/discussions, user notes, uploaded/imported docs, runtime-rendered markdown. These are live XSS surfaces.

**How:** sanitize with a vetted library — **DOMPurify** (runtime) or **rehype-sanitize** (at markdown render). Both are MIT + local — no paid/external API (satisfies the cost-policy hard rule).

**The allowlist MUST preserve the mandatory CEMI visual HTML** — inline `<svg>` diagrams, `<pre><code>` blocks, `<table>`, and `<aside class="inset inset--*">` author insets. Getting the allowlist wrong silently strips compliance-required visuals — test it against a known-good content unit before shipping. Strip `<script>`, event handlers (`on*`), `javascript:` URLs, and `<iframe>`/`<object>`/`<embed>` unless explicitly required and origin-restricted.

**One sanitizer, one allowlist, reused everywhere** — a per-sink ad-hoc filter drifts; centralize it.

Origin: a 2026-07-22 audit of `experience` found its content `{@html}` sinks (content bodies, program/experience overviews, user-contributed community resources) injected UNSANITIZED with no sanitizer in the repo — the live XSS gap that prompted this rule. `experience` has since **addressed it on its own** — a single centralized DOMPurify sanitizer (`src/lib/utils/sanitize-html.ts`) with a shared allowlist, applied at its content sinks — and is the **reference implementation** for this rule. This block is documentation: syncing it into a repo records the rule and does **NOT** modify that repo's existing sanitization code — never overwrite or override a repo's own working handling to match the prose here; if a repo already satisfies the rule, the block just documents it. When adopting the sitecraft §6.4 markdown pipeline, sanitize as part of the render step, not after.
<!-- END cemi-html-sanitization v2 -->
