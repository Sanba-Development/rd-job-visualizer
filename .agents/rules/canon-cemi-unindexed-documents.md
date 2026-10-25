---
trigger: model_decision
description: "CEMI canon (cemi-unindexed-documents): 🔒 Per-recipient documents are public by link and never indexed (all CEMI sites)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/unindexed-documents.md; edit the source, not this copy -->

<!-- BEGIN cemi-unindexed-documents v1 (managed — source: cemi-system/sync/unindexed-documents.md) -->
## 🔒 Per-recipient documents are public by link and never indexed (all CEMI sites)

A letter, proposal, quote, dossier or report addressed to one recipient and reachable by an unguessable link is **public by link and never indexed** (Carlos, 2026-10-25: «make sure the letters are not indexed … although they are publicly accessible, they are not meant to be indexed»). The rule covers the page and every file it serves (PDF, DOCX, images), on every host.

1. **`X-Robots-Tag: noindex, nofollow, noarchive` on the page and on every file.** A `<meta name="robots">` covers only HTML; PDFs and DOCX need the header, set in `firebase.json` `headers` for the path pattern (`/c/**`, `/proposals/**`, `/dossier/**` or the site's equivalent) or by the function that serves them.
2. **No canonical and never in the sitemap** (`cemi-canonical-urls` rule 4).
3. **Never `Disallow` the path in `robots.txt`.** A blocked crawler never reads the `noindex` and may still list the bare URL from a link elsewhere; the header is what removes it.
4. **Links are unguessable:** a token of at least 128 bits generated server-side, never a name, a date or a counter; an unknown or revoked token answers the same 404 as a wrong one, with no hint.
5. **A public link endpoint that sends nothing** (serves the document) still carries a per-IP limit and `maxInstances`; one that sends or costs per call (mail, generation) carries the site-wide cap of `cemi-paid-api-keys` rule 8.
6. **Hosting that cannot send headers** (GitHub Pages, a plain bucket) must not serve these documents: move them to Firebase Hosting or a function in the site's project, where rule 1 applies.

**Check:** `curl -sI https://<host>/<a letter path>` shows the `x-robots-tag`; `robots.txt` has no `Disallow` on those paths; the sitemap does not list them. The weekly drift run in `cemi-system` samples the registered letter paths per site and posts a finding when a header is missing or a path is disallowed.

Origin: estrategia's audit of 2026-10-25 (estrategia `/c/**` compliant; cemi-web FinLab PDFs and DOCX without the header and disallowed in robots.txt; one media-web proposal PDF; ailearning-web letters on GitHub Pages, which cannot send headers). Standard and examples: `sitecraft-system/protocol/quality-gates.md` §4.19 and `proposals-and-dossiers.md`.
<!-- END cemi-unindexed-documents v1 -->
