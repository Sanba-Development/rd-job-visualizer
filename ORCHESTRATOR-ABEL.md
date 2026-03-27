# ORCHESTRATOR-ABEL.md — Contexto del Thread de Abel López

> Este archivo es mantenido por el thread de Abel. Preserva arquitectura, convenciones,
> decisiones y estado actual para sobrevivir compactaciones de contexto.
> Última actualización: 2026-03-27

---

## Quién es Abel López

- Participante confirmado del challenge (3h/día)
- GitHub: jabelg
- Dueño de `src/sector-colors.json` — paleta WCAG de los 12 sectores
- Rol actual en el challenge: Founder | Project Manager | Business Development
- Contexto: coordinó la Estrategia Nacional de IA de RD (ENIA), trabajó en MICM

---

## Arquitectura del Repo (resumen rápido)

**Tipo:** Static HTML + vanilla JS. Sin build system. CDN deps. Servir con `npx serve .`

### Páginas principales
| Archivo | Propósito |
|---|---|
| `index.html` | Landing page (~1,800 líneas, todo JS inline) |
| `explorer.html` | Data explorer (27 datasets hardcodeados en JS array) |
| `src/treemap.html` | Visualización D3.js — carga metrics.json dinámicamente |
| `src/color-palette.html` | Preview WCAG de los 12 sectores |
| `src/methodology.html` | Documentación de fuentes y limitaciones |

### Pipeline de datos
```
data/raw/ (21 CSVs)
  → normalize.js → normalized.json (197MB, gitignored)
  → calculate-metrics.js → metrics.json (23KB, en git)
  → treemap.html (fetch dinámico)
```

### Fuentes de verdad
- `src/sector-colors.json` — colores (Abel los owns)
- `data/participants.json` — equipo
- `BACKLOG.md` — tareas
- `data/processed/metrics.json` — alimenta el treemap

---

## Convenciones Críticas

- **UI siempre en español** — código puede mezclar ES/EN
- **Overlays:** patrón fijo — `fixed inset-0 z-[100] hidden`, lazy fetch .md, marked.parse()
- **Branches:** `feat/*` → PR a `day4/working`. Nunca push directo a master.
- **Commits en inglés** + `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- **BACKLOG.md** se actualiza inmediatamente al completar tarea
- **Deploy** automático en merge a master — nunca `vercel --prod`

---

## Decisiones de Abel en Este Thread

| Decisión | Contexto |
|---|---|
| `sector-colors-abel.json` creado como copia experimental | Para comparar paletas sin tocar original |
| Abel propuso paleta alternativa con referentes semióticos | Cada color tiene un referente concreto (MICM, ENIA, RAL, etc.) |
| Erick adoptó los colores de Abel como estándar | PR #18 mergeado a prod. Colores ahora en `sector-colors.json` |
| Educación `#e0aa06` — Blanco Fail aceptado | Para elementos grandes funciona (AA Large). Con negro es AAA (12.5:1). Decisión intencional. |
| Tecnología `#14a0b8` — Cyan más vivo | Diferenciado del azul institucional (#0070C0 original). Pasa AA. |
| `color-palette.html` actualizado con comparador lado a lado | Columna Original vs Columna Abel |

---

## Áreas Frágiles a Tener en Cuenta

1. **`explorer.html`** — datasets hardcodeados en JS array. Nuevo archivo = edición manual.
2. **Fetch overlays sin error handling** — si un .md se renombra, falla silenciosamente.
3. **`metrics.json` puede quedar stale** — normalizar sin calcular métricas = datos viejos en treemap.
4. **`sector-colors.json`** — si se edita, regenerar metrics.json para que treemap tome nuevos colores.
5. **`lucide.createIcons()`** — llamado 7+ veces sin dedup.

---

## Estado Actual (2026-03-27)

### Branch activo
`feat/4.2-panel-mejorado` (off `day4/working`)

### Tarea en curso: 4.2 — Panel de detalle mejorado

**Archivos que toca:** solo `src/treemap.html`
**Archivos que NO debe tocar:** metrics.json, sector-colors.json, normalize.js, index.html

**Qué ya está implementado (en este branch):**
- [x] Gráfico de barras horizontales de distribución salarial (Mínimo/Mediana/Promedio/Máximo)
- [x] Barra visual Pareto 80/20 (franja azul/ámbar encima de las tarjetas)
- [x] Link a methodology.html al pie del panel
- [ ] Verificación de responsive del panel

**Criterios de aceptación (de Erick):**
- Panel muestra distribución salarial visual ✅
- Pareto 80/20 como barra ✅
- Link a metodología funciona ✅

**Pendiente:** commit + PR a day4/working

---

## Historial de PRs de Abel

| PR | Título | Estado | Base |
|---|---|---|---|
| #13 | Update Abel López profile: add current_role | MERGED | master |
| #18 | feat(colors): paleta Abel — WCAG, sin Fail | MERGED (por Erick accidentalmente a prod) | day2/working |
| #22 | feat(colors): paleta Abel — nuevo PR | CLOSED (Erick lo cerró, ya estaba en prod) | day2/working |
| (pendiente) | feat(panel): 4.2 panel de detalle mejorado | Por crear | day4/working |

---

## Próximos Pasos

1. Verificar cambios de 4.2 en localhost (`/src/treemap.html`)
2. Commit en `feat/4.2-panel-mejorado`
3. PR a `day4/working`
4. Actualizar `BACKLOG.md` (4.2 → [x])
