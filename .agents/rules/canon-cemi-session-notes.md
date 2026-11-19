---
trigger: model_decision
description: "CEMI canon (cemi-session-notes): 🗒️ Sessions say what they are working on (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/session-notes.md; edit the source, not this copy -->

<!-- BEGIN cemi-session-notes v1 (managed — source: cemi-system/sync/session-notes.md) -->
## 🗒️ Sessions say what they are working on (all CEMI repos)

Carlos keeps many sessions open at once, and a crash or a full context can lose track of them. Every session therefore records what it is doing in the **Sessions registry** (registry.cemi.ai `/admin/sessions`), which `restore` also prints when it reopens the tabs after a crash (Carlos, 2026-10-16).

- **When:** at the start of a piece of work, when its direction changes, and before stopping with something left open. One line each time; no more than that.
- **How**, from the repository's root:
  ```bash
  node ../cemi-system/tools/sessions.mjs note "<what this session is doing, and what is waiting on whom>"
  ```
  It appends to this folder's latest session and syncs to the registry. If the command is missing or fails, carry on; the note is a convenience, never a blocker.
- **What to write:** the task in plain words, the state (in progress, waiting on Carlos for X, handed to session Y), and anything a fresh session would need to pick it up. Never secrets, tokens or personal data.
- Status (open, committed/pushed/deployed, ahead/behind, closed) is derived automatically from git and the session hooks. The note is the part only the session knows.
<!-- END cemi-session-notes v1 -->
