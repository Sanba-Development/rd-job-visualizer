---
trigger: model_decision
description: "CEMI canon (cemi-contact-emails): 📧 Contact emails (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/contact-emails.md; edit the source, not this copy -->

<!-- BEGIN cemi-contact-emails v4 (managed — source: cemi-system/sync/contact-emails.md) -->
## 📧 Contact emails (all CEMI repos)

Valid, working contact addresses for CEMI — real and monitored. Safe to use in site copy, footers, contact forms, persona contact routing, press kits, proposals, and any outward-facing material.

**Addresses (all `@cemi.ai`):** `ai-staff@` · `business@` · `contact@` (general inbox) · `info@` · `invest@` · `legal@` · `partners@` · `privacy@` · `security@` · `support@`

**The same set is aliased at these initiative domains:** `@ailearning.global`, `@airtistic.ai`, `@ibizai.ai`, `@lawra.io`, `@skaills.ai` — so e.g. `contact@ailearning.global`, `legal@lawra.io`, `support@ibizai.ai` all resolve. Each was confirmed to accept mail on **2026-10-05**; the weekly drift run re-checks them (`cemi-system/schedules/check-mail-aliases.mjs`), so an alias that stops working is caught instead of advertised.

**Retired — never publish:** `@ibizai.io`. The domain was retired on 2026-10-05 and redirects to ibizai.ai. It was advertised here while its addresses bounced; it has since been re-attached so that old mail still arrives, but it is no longer a domain CEMI publishes. Replace any `…@ibizai.io` still in copy with the same address `@ibizai.ai`.

Default to `contact@cemi.ai`; route by purpose where a specific address fits (legal → `legal@`, security → `security@`, investment → `invest@`, partnerships/alliances → `partners@`, sales/commercial → `business@`, privacy/GDPR → `privacy@`). Do **not** invent addresses outside this list. Consultable at `/admin/emails`.
<!-- END cemi-contact-emails v4 -->
