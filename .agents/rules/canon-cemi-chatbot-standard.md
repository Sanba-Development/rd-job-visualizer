---
trigger: model_decision
description: "CEMI canon (cemi-chatbot-standard): 💬 One chatbot standard for every site (all CEMI repos with a chatbot, persona chat, assistant or advisor)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/chatbot-standard.md; edit the source, not this copy -->

<!-- BEGIN cemi-chatbot-standard v2 (managed — source: cemi-system/sync/chatbot-standard.md) -->
## 💬 One chatbot standard for every site (all CEMI repos with a chatbot, persona chat, assistant or advisor)

Carlos, 2026-11-15: «Chatbot implementation, addressing its challenges and issues should be normalized and be based on the same for all sites, coordinated with ../cemi-system and ../sitecraft-system canons. This applies to ../journalaism-web, ../podcast-web and to every other repository, project and site.»

- **One standard.** It is `sitecraft-system/protocol/chatbot-and-personas.md`, with the tests in `cemi-quality-gates` §4.23, under the rules of `cemi-paid-api-keys` and `cemi-responsible-ai-use`. No site designs its own variant. A site that needs to differ records why in its CLAUDE.md and tells cemi-system.
- **One implementation, shared.** The server side of a chat lives once in sitecraft-system: App Check, client address, money cap, history bound, persona and scope resolution, thinking off, ledger and markers. Each site vendors it through a generator with a `--check` mode in CI, never as a hand copy (`cemi-repo-documents`: CI checks out one repository).
- **Problems go up, fixes come down.** A session that finds a chatbot problem fixes it in its own site if it is urgent, then reports it to cemi-system, which records it and routes it to sitecraft. The fix lands in the standard, and every site takes it at its next re-vendor. Never fix the same problem differently in two sites.
- **Every chat offers copy and save** (Carlos, 2026-11-15): a copy button on each answer, plus «Copy conversation» and «Save conversation» (a .txt file with speaker labels and the AI notice), done in the browser only, from the vendored page client.
- **Never in the browser.** No site calls a model from the browser. Firebase AI Logic in a client is moved behind the shared function.
<!-- END cemi-chatbot-standard v2 -->
