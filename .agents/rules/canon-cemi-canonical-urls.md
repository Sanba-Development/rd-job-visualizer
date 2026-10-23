---
trigger: model_decision
description: "CEMI canon (cemi-canonical-urls): 🔗 One host per site, a static canonical on every indexable page (all CEMI sites)"
---
<!-- delivered by cemi-system canon-sync from sitecraft-system/sync/canonical-urls.md; edit the source, not this copy -->

<!-- BEGIN cemi-canonical-urls v1 (managed — source: sitecraft-system/sync/canonical-urls.md) -->
## 🔗 One host per site, a static canonical on every indexable page (all CEMI sites)

Every CEMI site answers on its custom domain **and** on `<site>.web.app` / `<site>.firebaseapp.com`, which cannot be switched off. Without a canonical, search engines may index the copies or split ranking between them (Carlos, 2026-10-10).

1. **One primary host.** Every alias and `www.` domain **301-redirects** to it — set in the Firebase console (Hosting → the domain → redirect); `firebase.json` redirects match paths, never hosts.
2. **A static `<link rel="canonical" href="https://<primary>/<path>">` in the `<head>` of every indexable page**, in the served HTML, built from a **fixed site address** — never from `location.host` or the request host, and never added only by runtime JavaScript.
3. **The sitemap is the arbiter:** each sitemap URL's page carries a canonical equal to that URL, on the primary host.
4. **Noindex pages carry no canonical** and stay out of the sitemap. An indexable page outside the sitemap is **Carlos's decision** — list it, don't choose.
5. **A guard runs before every deploy** — a build step, or for a static site a named pre-deploy command recorded in `CLAUDE.md` — and fails on a missing or wrong canonical or a canonical on another host.

Long form, per-stack how-to and launch checklist: `sitecraft-system/protocol/canonical-urls.md`. Reference implementation: `media-web/scripts/add-canonical.mjs` (`npm run check:canonical`). The fleet sweep is tracked in `cemi-system/docs/handoff-2026-10-10-canonical-sweep.md`.
<!-- END cemi-canonical-urls v1 -->
