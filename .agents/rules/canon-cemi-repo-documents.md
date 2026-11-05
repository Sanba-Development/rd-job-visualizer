---
trigger: model_decision
description: "CEMI canon (cemi-repo-documents): 📄 Repository documents — the same five at every root, plus the session's memory (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from sitecraft-system/sync/repo-documents.md; edit the source, not this copy -->

<!-- BEGIN cemi-repo-documents v3 (managed — source: sitecraft-system/sync/repo-documents.md) -->
## 📄 Repository documents — the same five at every root, plus the session's memory (all CEMI repos)

Every CEMI repository carries five root documents, each with one job (Carlos, 2026-10-17). Documents cross-reference each other and never duplicate one another.

| File | Its one job |
| :---- | :---- |
| `README.md` | What this is, who it is for, and where everything else lives: a router, not a manual |
| `INSTALL.md` | Requirements and stack versions, environment variables, build and run steps, how it is deployed |
| `CLAUDE.md` | How to work here: conventions, invariants, hard rules, and the managed blocks (their only home) |
| `CHANGELOG.md` | What changed, when and why, updated on every ship |
| `AGENTS.md` | The same instructions for Antigravity. canon-sync writes it, and it is never edited by hand |

- **MEMORY.md is not in the repository.** It is Claude Code's memory at `~/.claude/projects/<folder>/memory/`, and it is backed up nightly by cemi-system. **Every session keeps it current, and every `/ship` brings it up to date.** When a memory becomes a lasting rule for everyone, promote it: a rule goes to `CLAUDE.md`, a fact and its reason to `docs/decisions.md`. Never commit a `MEMORY.md`.
- **Both harnesses, always.** Claude Code reads `CLAUDE.md` and `.claude/`; Antigravity reads `AGENTS.md` (or `GEMINI.md`) and `.agents/`. canon-sync mirrors one into the other, so a local skill or rule is written under `.claude/` only. **Antigravity truncates a rule file at 24,000 bytes, silently.** A rule an Antigravity session must follow has to sit inside that limit.
- **Shared tools live once, in their system repository,** and are called by relative path from the sibling checkout (`node ../cemi-system/tools/…`). They are never copied, never packaged, and never delivered by canon-sync (Carlos, 2026-10-24). First case: `mediamax-system/tools/tts-checker`. **CI checks out one repository only**: what a sibling tool generates is committed in the consumer, and a step that regenerates it skips cleanly (exit 0, one line) when the sibling is absent. A build never depends on a sibling.
- **`/ship`** keeps these documents current, runs the gates, commits, pushes and deploys. Its source is `sitecraft-system/skills/ship/SKILL.md`; a per-repository variant is drift.

Long form: `sitecraft-system/protocol/cemi-sitecraft.md`, *Standard Repository Documents*, and the Working-Folder Policy just above it.
<!-- END cemi-repo-documents v3 -->
