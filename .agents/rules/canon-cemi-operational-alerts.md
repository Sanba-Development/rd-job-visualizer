---
trigger: model_decision
description: "CEMI canon (cemi-operational-alerts): 🔔 Operational alerts go to registry.cemi.ai (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/operational-alerts.md; edit the source, not this copy -->

<!-- BEGIN cemi-operational-alerts v1 (managed — source: cemi-system/sync/operational-alerts.md) -->
## 🔔 Operational alerts go to registry.cemi.ai (all CEMI repos)

Every operational alert a CEMI repository raises goes to **one place**: the Notifications & Monitoring section of registry.cemi.ai (`/admin/notifications`), which Carlos visits daily (Carlos, 2026-10-16). That covers a failing scheduled check, a cost cap nearing its limit, a model or price that changed, a deploy guard that tripped, or a dead address. Do not invent a separate e-mail, Slack or log-only channel for it.

- **How:** `POST https://us-central1-cemi-ai.cloudfunctions.net/notifications` with header `X-Notify-Token: <this source's token>` and a JSON body `{source, kind, severity, title, body, metric?, link?, dedupeKey}`. The contract is `registry-web/docs/notifications.md`, and it is the only copy. Read its «Writing a good notification» section before writing one.
- **Token:** one per repository (the `source`), minted by Carlos's session with `registry-web/scripts/mint-notify-token.mjs <source>` and kept as a secret, never committed or printed. Without a token, skip the post and log it; never block on the channel.
- **Severity:** `critical` only when something is broken for users or money is at risk now; `warning` for what needs action this week; `info` for the rest.
- **Write it for a reader who has not seen the log.** Say where the notification comes from, what the check looks at, what the finding means and what to do, then list the findings. Bodies are plain text, at most 2000 characters. Volatile values (dates, counts per run) go in `metric`, not in the body, so an unchanged finding does not reopen an acknowledged item.
- **One stable `dedupeKey` per finding class.** A repeat updates the item; changed content reopens it.

Reference implementation: `cemi-system/schedules/notify-drift.mjs`. Cloud apps post from their functions with the token in a secret (ailearning-web's AI-spend cap is the first).
<!-- END cemi-operational-alerts v1 -->
