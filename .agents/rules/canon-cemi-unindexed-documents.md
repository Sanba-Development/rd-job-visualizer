---
trigger: model_decision
description: "CEMI canon (cemi-unindexed-documents): 🔒 Per-recipient documents are public by link and never indexed (all CEMI sites)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/unindexed-documents.md; edit the source, not this copy -->

<!-- BEGIN cemi-unindexed-documents v2 (managed — source: cemi-system/sync/unindexed-documents.md) -->
## 🔒 Per-recipient documents are public by link and never indexed (all CEMI sites)

A letter, proposal, quote, dossier or report addressed to one recipient and reachable by an unguessable link is **public by link and never indexed** (Carlos, 2026-10-25: «make sure the letters are not indexed … although they are publicly accessible, they are not meant to be indexed»). The rule covers the page and every file it serves (PDF, DOCX, images), on every host.

1. **`X-Robots-Tag: noindex, nofollow, noarchive` on the page and on every file.** A `<meta name="robots">` covers only HTML; PDFs and DOCX need the header, set in `firebase.json` `headers` for the path pattern (`/c/**`, `/proposals/**`, `/dossier/**` or the site's equivalent) or by the function that serves them.
2. **No canonical and never in the sitemap** (`cemi-canonical-urls` rule 4).
3. **Never `Disallow` the path in `robots.txt`.** A blocked crawler never reads the `noindex` and may still list the bare URL from a link elsewhere; the header is what removes it.
4. **Links are unguessable:** a token of at least 128 bits generated server-side, never a name, a date or a counter; an unknown or revoked token answers the same 404 as a wrong one, with no hint.
5. **A public link endpoint that sends nothing** (serves the document) still carries a per-IP limit and `maxInstances`; one that sends or costs per call (mail, generation) carries the site-wide cap of `cemi-paid-api-keys` rule 8.
6. **Where they live: Firebase Hosting in the site's own project** (Carlos, 2026-11-05), with the `X-Robots-Tag` in `firebase.json`; a function only when the document must be protected. **Never the project's Storage bucket** (an object can set only Cache-Control, Content-Disposition, Content-Encoding, Content-Language and Content-Type, so no `X-Robots-Tag`, and a PDF has no meta robots) and **never GitHub Pages**, which cannot send headers. When moving documents to Hosting, link the Hosting site to a web app, deploy, then run `post-deploy-keys.mjs` (`cemi-paid-api-keys` rule 3).
7. **The default Firebase bucket is always mixed and is never made public.** `gs://<project>.firebasestorage.app` and `.appspot.com` hold uploads, client work and private paths side by side in every project (ailearning-web, 2026-11-05: 30 prefixes, a client's full proposal, two paths named private); an `allUsers` grant on it, the one-line «fix» for a broken download link, publishes all of it. The fix for a broken public link is rule 6; «sign in again» cannot fix an anonymous Storage GET either. The weekly drift run checks every default bucket for `allUsers` and `allAuthenticatedUsers`.

**Check:** `curl -sI https://<host>/<a letter path>` shows the `x-robots-tag`; `robots.txt` has no `Disallow` on those paths; the sitemap does not list them. The weekly drift run in `cemi-system` samples the registered letter paths per site and posts a finding when a header is missing or a path is disallowed.

Origin: estrategia's audit of 2026-10-25 (estrategia `/c/**` compliant; cemi-web FinLab PDFs and DOCX without the header and disallowed in robots.txt; one media-web proposal PDF; ailearning-web letters on GitHub Pages, which cannot send headers). Standard and examples: `sitecraft-system/protocol/quality-gates.md` §4.19 (written 2026-11-05, sitecraft 3fc9612) and `proposals-and-dossiers.md`.
<!-- END cemi-unindexed-documents v2 -->
