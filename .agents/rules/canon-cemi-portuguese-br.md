---
trigger: model_decision
description: "CEMI canon (cemi-portuguese-br): 🇧🇷 Portuguese is Brazilian Portuguese on every CEMI surface (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from cemi-system/sync/portuguese-br.md; edit the source, not this copy -->

<!-- BEGIN cemi-portuguese-br v4 (managed — source: cemi-system/sync/portuguese-br.md) -->
## 🇧🇷 Portuguese is Brazilian Portuguese on every CEMI surface (all CEMI repos)

**Portuguese means Brazilian Portuguese (pt-BR)** in every CEMI site, app, e-mail, document, caption, subtitle, deck and video (Carlos, 2026-10-24, chosen for the Studio and cemi.media and made canon for the group). The locale code stays **`pt`**; the variety is Brazilian. This block is the single source of truth; the translation and i18n protocols point here and do not restate it.

- **Address the reader as «você»** (plural «vocês»); verbs in the third person. Never «tu» as the default register, never «vós».
- **Progressive with the gerund:** «está fazendo», «estamos construindo» — never «está a fazer», «estamos a construir».
- **Vocabulary, Brazilian forms (European forms are defects):** equipe (not equipa) · roteiro (not guião) · arquivo (not ficheiro) · cadastro / cadastrar-se (not registo / registar-se) · compartilhar (not partilhar) · entrar em contato / fale conosco (not contactar / contacte-nos / connosco) · tela (not ecrã) · usuário (not utilizador) · celular (not telemóvel) · baixar (not descarregar) · aplicativo (not aplicação, for an app) · ônibus (not autocarro) · trem (not comboio) · café da manhã (not pequeno-almoço) · sobrenome (not apelido) · gerenciar / gestão (not gerir) · esporte (not desporto) · fato (not facto) · atualizar (not actualizar) · ação (not acção).
- **Spelling and accents follow the Brazilian norm of the 1990 Orthographic Agreement** as Brazil applies it: gênero, econômico, Antônio, ônibus (circumflex where Portugal writes an acute), «ideia» without accent, no silent consonants (ação, ótimo, direção).
- **Dates and numbers:** `24 de outubro de 2026`, `24/10/2026`; thousands with a point and decimals with a comma (`1.234,56`); currency `R$ 1.234,56` and `US$ 1.234,56` with a space after the symbol.
- **Typography:** quotes «…» as the i18n block prescribes for PT; the Impact Arc and the motto keep their canon PT forms (`cemi-impact-arc`: Engajar, Viabilizar, Inspirar, Empoderar, Conectar); Smoother's structures keep the frozen glossary forms where a PT column exists, and nobody coins a translation downstream.
- **Generated text follows the same rule:** a persona's answer, a subtitle, a TTS script or an e-mail body produced at run time is Brazilian Portuguese; prompts that ask for Portuguese say «português do Brasil».

**Audit.** Grep the `pt` locale files and every PT document for the European markers before shipping: `\bequipas?\b|\bguião\b|\bficheiros?\b|\bregisto\b|\bregistar|\bpartilha|\bcontactar|\bcontacte\b|\bconnosco\b|\becrãs?\b|\butilizador|\btelemóvel|\bdescarregar|\bautocarro|\bcomboio|pequeno-almoço|\bdesporto|\bfacto\b|\bactualiza|\bacção|\bestá a [a-zç]+[aei]r\b|\bestamos a [a-zç]+[aei]r\b` (word-bounded: «compartilhar», «equipamentos» and «registrar» are Brazilian and must not match). The regex catches the lexical tells only; a reviewer also reads for the grammatical ones: «A sua» for «Sua», «Enviámos» for «Enviamos», «contacto» for «contato», «Não tem» as a question opener, the pronoun before the verb («o enviei» for «enviei ele» in speech). A hit is a defect to fix in the repository that owns the text. The weekly drift run in `cemi-system` reports fleet-wide hits to registry.cemi.ai; each repository's session fixes its own.

**Why one variety.** CEMI's Portuguese-speaking audience and partners are in Brazil; a mixed corpus reads as careless in both countries, and a translation agent given no variety drifts toward European forms. Reference conversions: `media-web` (guide and order page, ae8e01a), `mediamax-web` (Studio UI), `mediamax-system` manifest 0.9.1.
<!-- END cemi-portuguese-br v4 -->
