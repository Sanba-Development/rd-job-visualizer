---
trigger: model_decision
description: "CEMI canon (cemi-i18n-quote-hygiene): 🈂 Localized-text hygiene — quotes, multibyte, significant spaces (all CEMI repos)"
---
<!-- delivered by cemi-system canon-sync from sitecraft-system/sync/i18n-quote-hygiene.md; edit the source, not this copy -->

<!-- BEGIN cemi-i18n-quote-hygiene v8 (managed — source: sitecraft-system/sync/i18n-quote-hygiene.md) -->
## 🈂 Localized-text hygiene — quotes, multibyte, significant spaces (all CEMI repos)

**Scope: any operation over localized text — translating it, DERIVING from it, or reformatting it.** Excerpt and meta-description generators, subtitle and cue splitters, chunkers, word wrappers, search indexers and TTS segmenters are all covered, and most of them involve no translation step at all. The rules below were originally written for translation; the hazards are not limited to it.

These bugs share a failure mode, which is why they live together: **nothing throws.** The JSON parses, the text looks right, the build passes, and only the bytes changed.

The most frequent one: a translation agent nests English `"…"` quotes inside a foreign-language string and silently breaks the JSON. When translating into JSON or any structured/code format:

- **Never emit a raw ASCII `"` inside a JSON string value.** Use the locale's typographic quote pair (table below), or escape it as `\"`.
- **Select/segment the text blocks carefully** so quotes and punctuation never cross or corrupt the surrounding structure — and with multibyte **CJK (Chinese / Japanese / Korean)** characters, never split mid-character when chunking or truncating.

| Locale | Quote pair to use |
|---|---|
| DE | `„…"` (U+201E / U+201C) |
| FR / IT / AR | `«…»` |
| ZH | `「…」` (corner brackets) or full-width `"…"` |
| JA | `「…」` |
| ES / PT | `«…»` or curly `"…"` |

- **Put the French spaces there when you write the French.** The rule above keeps them alive once they exist; this one puts them there in the first place. French requires a **narrow no-break space (U+202F)** before `: ; ? !`, inside `« … »`, **and before `%`** (an ordinary space there is also a legal line break, so «9 %» can wrap with the sign alone on the next line — found 2026-09-13 in journalaism-web, 55 cases). Text authored with an ordinary space is wrong before any pipeline touches it, and no build fails on it — 76 such defects sat in CEMI's own published investor dossier from its first draft until 2026-09-11, because every rule on the subject was about *preserving* the spaces rather than *writing* them. This applies to anything a reader sees in French: page copy, i18n values, PDF and deck text, subtitles, email and letter bodies, social posts.

  **Decide it's French from the text, not from the page.** Generated text, a persona's chat answer above all, comes in the reader's language, which is not always the page's. A French answer on an English page still takes U+202F. Never apply French spacing to text whose language is undecided: Spanish also uses `« »`, without inner spaces. Streaming detail: `sitecraft-system/protocol/chatbot-and-personas.md`, *French typography follows the answer's language*.

  Audit any French file — HTML, JSON or markdown — with a text-node-aware pass, never a blind global replace (an ordinary space before a colon is correct inside a URL, a code block or an attribute):

  ```bash
  # count the defects in rendered French text
  python3 - "$FILE" <<'EOF'
  import re, sys
  s = open(sys.argv[1], encoding='utf-8').read()
  s = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', s, flags=re.S)
  s = re.sub(r'<[^>]+>', ' ', s)
  print(len(re.findall(r'[A-Za-zÀ-ÿ0-9»)*_] [:;?!%]', s)))
  EOF
  ```

  To fix, split the source on tags and script/style bodies, and inside the text segments only, replace `(?<=[A-Za-zÀ-ÿ0-9»\)*_]) (?=[:;?!%])` with U+202F (the `*_` admit markdown emphasis before the sign). Reference implementation: the 2026-09-11 pass over `cemi-web/public/{dossier,investors}/fr/*.html`.

- **Never split or trim localized text on JavaScript `\s`.** In any pipeline that **re-emits** the text — cue splitters, word wrappers, chunkers, excerpt and meta-description generators, TTS segmenters — `\s` matches **U+202F, U+00A0 and U+2009**, so `split(/\s+/)` + rejoin, `replace(/\s+/g, ' ')` and `trim()` silently delete the typographic spaces French requires before `: ; ? !` and inside `« … »`. No validator catches it. Split only on breakable whitespace: `[^\S\u202f\u00a0\u2009]+`, and trim the same way.

  **Safe exception:** `\s+` remains correct where the output is *not* served text — slugs, URL segments, search-query tokenization, filename derivation. The rule is about text that goes back on screen.

  Verify it yourself in ten seconds:

  ```bash
  node -e "console.log(/\s/.test('\u202f'), JSON.stringify(' \u202fx\u202f '.trim()))"
  # -> true "x"     the thin space matched \s, and trim() ate it
  ```

  **Two shapes, and prefer the second for trimming.** For splitting, negate the no-break spaces: `split(/(?<=[.?!])[^\S\u202f\u00a0\u2009]+/)`. For trimming, allow-list ASCII instead of negating — `t.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, '')` — which is stricter and reads as intent rather than as an exclusion.

  **When auditing a file for this pattern, grep it exhaustively — never trust an enumeration, including one in a report like this.** Run `grep -nE '\.trim\(\)|/\\s' <file>` over the WHOLE file and fix every hit. This has now failed twice in the same file: a first pass fixed one instance and left three, a second reported three and found six. Both times the shortfall came from reading a truncated grep, not from the pattern being subtle. A colon split is the easiest to miss and the most damaging, because `:` is exactly where the French thin space lives.

  Origin: two independently written pipelines in `ailearning-web` corrupted FR output this way in 2026-08, and no build failed on either. Wording adopted from `mediamax-system/.claude/rules/translation-protocol.md` §1, which had it first; deeper canon for cue segmentation lives at `mediamax-system/knowledge/production/tts/18f`.

**Always validate that every translated JSON file parses before applying it** (make it part of `/ship`). Example (adjust the path to your repo's i18n files):

```bash
for loc in en es fr de it zh ja pt ar; do
  node -e "JSON.parse(require('fs').readFileSync('src/i18n/$loc.json','utf8'))" && echo "$loc OK" || echo "$loc FAIL"
done
```

**Deeper protocol** (find/replace contract for subagent-produced translations, applier requirements, quality gates): see `mediamax-system/.claude/rules/translation-protocol.md`. The find/replace contract is mandatory whenever a translation agent emits structured pairs to apply against source HTML/JSON/ASS. Origin: 2026-06-17 batch where ~13% of pairs failed to match because agents retyped find strings.
<!-- END cemi-i18n-quote-hygiene v8 -->
