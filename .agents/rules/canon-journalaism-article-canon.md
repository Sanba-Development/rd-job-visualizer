---
trigger: model_decision
description: "CEMI canon (journalaism-article-canon): Article writing and research canon (all CEMI repositories that publish text)"
---
<!-- delivered by cemi-system canon-sync from journalaism-system/sync/journalaism-article-canon.md; edit the source, not this copy -->

<!-- BEGIN journalaism-article-canon v2 (managed — source: journalaism-system/sync/journalaism-article-canon.md) -->
## Article writing and research canon (all CEMI repositories that publish text)

The canon for writing articles and researching topics lives in `../journalaism-system/canon/` and is binding here. One copy, there; this block points.

- **Factual-article protocol** (`01`): the working shape of an article (Step 0 file, claim ledger, prompts, returns, source ledgers, Gate 2 record, bibliography), the eight steps and two human gates, the claim classes and verdicts, kill criteria.
- **Research protocol** (`02`): how a deep-research round is written, run by the human operator in several systems, saved verbatim and verified source by source; the source ledger with its four verdicts (VERIFIED, PARTIAL, UNVERIFIED, CONTRADICTED); the fetch ladder; what counts as a source; corrections to our own documents.
- **Bibliography and citation** (`03`): the rule of admission, the entry, ids never renumbered, two-way id reconciliation (`tools/check-ids.mjs`), a verbatim quote always carries its page.
- **Voice, style and disclosure** (`04`): the voice brief (style and perspective, from the personAI roster or supplied in the request), what reads as generated and the fix, no exact small counts in public copy, typography per language, disclosure of method without naming tools where the reader's confidence is the point.
- **Anti-hallucination for text** (`05`): the hierarchy (verified cited fact, documented canon, silence; never fabrication), the tiers `[SOURCE]` / `[INFERENCE]` / `[REQUIRES VERIFICATION]`, the prohibited fabrications, the three-pass check, the authenticity test, corrections published visibly. **Nothing carrying `[REQUIRES VERIFICATION]` ships.**
- **Quality audit** (`06`): `node ../journalaism-system/tools/audit-opinion-content.mjs <path>` before every publish; category 7 (unresolved markers) is a hard gate; every match is triaged by a human.
- **Article types and structures** (`07`): opinion, take, dialogue, factual, explainer, consultation to an authority, foundations document, gaps register, incident log, handoff; the structure catalogue and the structure register, so no two consecutive pieces share a shape. Every content unit declares its canon-07 `type` at the source; §10 "Declaring the type at the source".

Templates: `../journalaism-system/templates/`. Worked examples: `../journalaism-system/examples/`.
<!-- END journalaism-article-canon v2 -->
