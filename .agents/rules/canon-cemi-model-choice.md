---
trigger: model_decision
description: "CEMI canon (cemi-model-choice): 🧭 The session picks the model for each task (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/model-choice.md; edit the source, not this copy -->

<!-- BEGIN cemi-model-choice v2 (managed — source: cemi-system/sync/model-choice.md) -->
## 🧭 The session picks the model for each task (all CEMI repos)

A session may use a different model for each task and is expected to pick the most adequate one. It does not ask first, and it does not default to the most capable model out of caution (Carlos, 2026-10-01).

- **Match the model to the task, not to the session.** Mechanical, well-specified work — bulk edits, repoints and renames, receipts, harvests and re-runs, format conversions, interface-string translation — goes to a lighter model. Work where the judgement is the product or a mistake is expensive — canon and standards, a design that spans repositories, reading legal or financial documents, the argument of a proposal or an investor kit, a persona's voice, the last review before publication — gets the most capable one.
- **How.** Delegate the task to a subagent or a workflow on the chosen model. The session that delegates stays responsible: it writes a complete brief and reads the result before relying on it. A session cannot change its own main model; when the rest of its work would be better served by another one, it says so in one line and Carlos switches.
- **Move up on evidence, not on doubt.** When a lighter model's output fails its check, redo the task one tier up and say so. Do not retry at the same tier, and do not start at the top "to be safe".
- **Tiers, not ids.** For Claude: Haiku for volume and extraction; Sonnet for most build and translation work; Opus for complex builds and tone-critical writing; the top tier (Fable class) for judgement. Name the family and let the harness resolve it — a dated model id written down as "the model" goes stale, for the reason given in `cemi-gemini-models`.
- **Say which model did what** wherever it bears on how far the result can be trusted: a review, a translation, a figure.

### Split the work across agents that don't collide

Carlos, 2026-10-16: «Split the work into multiple agents, as long as they don't collide, [and] use the appropriate model for each agent.» Independent work runs in parallel by default.

1. **One agent per scope that cannot collide.** Name in the brief the repositories, directories or files each agent may touch, and say what it must not touch: «do not touch X, another agent is editing it». Two agents never edit the same file, and never release the same shared resource (a ruleset, a manifest, a deploy target) unless one is told to start from what the other committed.
2. **Each agent gets the model its task needs,** by the tiers above: Sonnet for scoped code fixes, UI and mechanical sweeps; Opus for builds, deploys, verification and voice-critical drafting.
3. **Shared and outward-facing steps stay with the delegating session unless the brief grants them by name:** push, deploy, rules releases, paid calls, bucket or database writes. An agent that commits stages by path, never sweeps another's files, and checks `git status` first.
4. **Builds don't race.** Agents never build into the same shared output directory at once: each builds to its own output directory or a clean `git worktree`, or the delegator builds once at the end.
5. **Read before relaying.** The delegator reads each agent's report and checks the claims that matter before relying on them or passing them on. A blocked or refused step is reported to Carlos, never handed to another agent or session to do instead.

**Limits.** This rule is about the models *inside the harness the session already runs on*. It never authorises a paid or external service: `cemi-cost-policy` stands unchanged, and translation is always Claude. A repository's own rule that names a model for a task wins for that task. It governs sessions and their agents, not the models a product serves to its users — chatbot tiers are `sitecraft-system/protocol/chatbot-and-personas.md`.
<!-- END cemi-model-choice v2 -->
