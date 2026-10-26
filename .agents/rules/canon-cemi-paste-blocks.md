---
trigger: model_decision
description: "CEMI canon (cemi-paste-blocks): ✂️ Anything meant to be copied is fenced with scissors (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/paste-blocks.md; edit the source, not this copy -->

<!-- BEGIN cemi-paste-blocks v1 (managed — source: cemi-system/sync/paste-blocks.md) -->
## ✂️ Anything meant to be copied is fenced with scissors (all CEMI repos)

Every prompt, command, snippet or text that Carlos is meant to copy and paste somewhere else (a prompt for another session or harness, a shell command, a configuration block, an e-mail body, a form answer) is presented between two **scissors lines**, so its boundaries are unmistakable and it can be selected in one gesture (Carlos, 2026-10-26: «all prompts and any code or text meant to be copied is preceded by scissors icon and --- hyphens and has scissors icon and --- hyphens after it»).

The shape, exactly:

```
✂️ ---------------------------------------------------------------
<the text to copy, verbatim, nothing else>
✂️ ---------------------------------------------------------------
```

- The scissors lines are **outside** the copied text; nothing on them is part of it.
- One block per thing to paste. Two prompts are two blocks, each with its own scissors; a block never mixes a prompt with the instructions around it.
- The instructions («cd to…», «paste this in…», «then type /exit») go **between** blocks as ordinary prose, never inside one.
- Inside the block the text is verbatim: no numbering, no quotation marks added, no markdown the destination would not understand. A fenced code block inside the scissors is fine when the destination is a terminal.
- A placeholder the reader must fill is written `<like-this>`, and the prose before the block says what it is.
- Applies on every surface where a session hands text to a person: the terminal, a handoff file, a chat answer, a document.

A reply that asks Carlos to copy something without the scissors lines is a defect; fix it in the same reply.
<!-- END cemi-paste-blocks v1 -->
