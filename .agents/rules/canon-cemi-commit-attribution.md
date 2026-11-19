---
trigger: model_decision
description: "CEMI canon (cemi-commit-attribution): ✍️ Commits: Carlos is the author, every change stays traceable (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/commit-attribution.md; edit the source, not this copy -->

<!-- BEGIN cemi-commit-attribution v3 (managed — source: cemi-system/sync/commit-attribution.md) -->
## ✍️ Commits: Carlos is the author, every change stays traceable (all CEMI repos)

The code, content and documents in CEMI repositories are CEMI's and Carlos Miranda Levy's. Nothing in their history may suggest that an AI is an author or co-owner of them, which is a claim someone could try to use against that ownership later (Carlos, 2026-10-17). Traceability, on the other hand, is wanted in full.

- **No `Co-Authored-By` line, ever,** naming Claude, any other AI or any tool, in commits or pull requests. The author is Carlos Miranda Levy, the identity git already uses on this machine.
- **End every commit with two lines, a name for people and a link for the record:**
  ```
  Session: cemi-system-db (cemi-system)
  Claude-Session: https://claude.ai/code/session_…      (or: Claude-Session: local <id>)
  ```
  `Session:` is the session's own name, as ListAgents prints it ("This session is …"), followed by the repository it runs in. When the name is unknown, the repository alone. `Claude-Session:` is the conversation's claude.ai link when the session has one (a session connected to Remote Control receives `https://claude.ai/code/session_…`). A local session without that link writes `Claude-Session: local <id>`, where `<id>` is the value of `$CLAUDE_CODE_SESSION_ID`, the ID of its transcript at `~/.claude/projects/<repository folder>/<id>.jsonl`. Never copy another session's link, and never write a link the harness did not give. Pull request descriptions end with the same two lines. Together they are a pointer to the conversation that made the change, like a ticket number, not a credit. It is how a change is traced back to the session that made it, which untangling work across repositories depends on (Carlos, 2026-10-17). (Carlos, 2026-10-20: all work runs locally in Claude Code on WSL; a link exists only when a session is connected to Remote Control.)
- **Detailed commit messages:** what changed, why, and what was verified. Keep `CHANGELOG.md` current where the repository has one.
- **Commits made by a tool for a session** (canon-sync receipts) name the tool in the subject line.

From 2026-10-16 to 2026-10-17, by mistake, commits were made without these lines. Leave those commits as they are; never rewrite pushed history to add them.
<!-- END cemi-commit-attribution v3 -->
