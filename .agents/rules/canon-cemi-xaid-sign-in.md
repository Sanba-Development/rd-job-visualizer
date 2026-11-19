---
trigger: model_decision
description: "CEMI canon (cemi-xaid-sign-in): 🔐 Signing in through xAId: claims age, access changes arrive, the app id is pinned (all CEMI sites that sign in through xAId)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/xaid-sign-in.md; edit the source, not this copy -->

<!-- BEGIN cemi-xaid-sign-in v1 (managed — source: cemi-system/sync/xaid-sign-in.md) -->
## 🔐 Signing in through xAId: claims age, access changes arrive, the app id is pinned (all CEMI sites that sign in through xAId)

A site that signs people in through xAId mints its own Firebase session from xAId's answer. Without the three rules below, a role removed in xAId stays live on the site until the person signs in again, which can take weeks (Carlos, 2026-11-16: «I have asked this many times»; SL-248, SL-250, SL-253, SL-258).

1. **Claims age.** The token bridge mints with the xAId uid and stamps `rolesAt` in milliseconds **before** it calls `/auth/verify`. The maximum claim age is **at most 24 hours for every role** (Carlos, 2026-11-17: «24 hours for all», no exception), plus xAId's `accessExpiresAt` when it is set. It is enforced in the rules (an `xaidClaimsCurrent` helper, with the rules suite and the live-rules check in CI) and on every server path. A token older than the user's mark or the app-wide mark is refused.
2. **Access changes arrive.** The site vendors sitecraft's receiver (`sitecraft-system/xaid-hook/`), served at `https://<site>/__xaid/access-change` through a Hosting rewrite. It keeps `XAID_HOOK_SECRET_<APP>` in the site's own Secret Manager and registers the hook in xAId with its maximum age. On every change the receiver raises the mark before it answers 200, and revokes refresh tokens on every change that can narrow access. On a delete it keeps the mark and disables the uid.
3. **The app id is pinned.** The bridge sends its own app id, never one taken from the request (SL-253).

A site without the receiver yet keeps the maximum age and the deleted-user polling, and is listed as pending in `cemi-system/docs/plans/2026-11-16-xaid-access-change-receivers.md`. The contract is `xaid/docs/ACCESS-CHANGE-NOTIFICATIONS.md`; the module and its tests are `sitecraft-system/xaid-hook/`.
<!-- END cemi-xaid-sign-in v1 -->
