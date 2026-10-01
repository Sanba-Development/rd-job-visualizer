# RD Job Visualizer

> Visualizador interactivo del mercado laboral dominicano + Evaluación de Impacto de la IA | [Sanba Development](https://sanba.dev)

**Live:** [jobs.sanba.dev](https://jobs.sanba.dev)

---

## Qué es esto

Un portal web interactivo que visualiza el mercado laboral de la República Dominicana mediante un treemap estilo [Karpathy](https://karpathy.ai/jobs/) y un módulo de evaluación de impacto de la inteligencia artificial en el empleo dominicano — usando datos reales de fuentes públicas gubernamentales.

## Estado actual

- **757,000+ registros** normalizados de 14+ fuentes gubernamentales (MAP, TSS, ENCFT, DGII, CNZFE, MITUR, MISPAS, RD Trabaja)
- **493K registros de nómina pública** (MAP, diciembre 2025) con salario, género e institución
- **12 sectores** económicos definidos basados en CIUO-08
- **Treemap interactivo** con drill-down por ocupación, datos reales, panel de detalle
- **Módulo de Impacto de IA** con evaluación de Vulnerabilidad, Susceptibilidad a la IA y Adaptabilidad
- **Concordancia ISCO-08** a 4 dígitos para ~60 ocupaciones dominicanas
- **27 escenarios** combinables (3 horizontes × 3 velocidades × 3 intensidades de adopción)
- **Análisis sistémico**: paradoja de la informalidad, dimensión de género, riesgo BPO, factores DR

## Páginas

| Página | URL | Descripción |
|--------|-----|-------------|
| Landing | `index.html` | Página principal con progreso del challenge |
| Treemap | `src/treemap.html` | Treemap D3.js interactivo por sector y ocupación |
| Impacto IA | `src/ai-impact.html` | Evaluación V/S/A con scatter plot, rankings, radar |
| Data Explorer | `explorer.html` | Navegador interactivo de datasets |
| Metodología Treemap | `src/methodology.html` | Explicación del treemap |
| Paleta de Colores | `src/color-palette.html` | Referencia WCAG de colores por sector |

## Stack

Todo corre como HTML estático — sin build system, sin framework, sin instalación.

| Herramienta | Uso |
|-------------|-----|
| Tailwind CSS (CDN) | Estilos |
| D3.js v7 (CDN) | Treemap y scatter plot |
| Lucide Icons (CDN) | Iconografía |
| Marked.js (CDN) | Renderizar markdown en modales |
| PapaParse (CDN) | Parsear CSV en el Data Explorer |

## Pipeline de Datos

```bash
# 1. Normalizar datos crudos → normalized.json (757K registros)
node scripts/processors/normalize.js

# 2. Calcular métricas por sector → metrics.json
node scripts/processors/calculate-metrics.js

# 3. Validar cobertura sectorial
node scripts/processors/validate-sectors.js
```

## Desarrollo local

```bash
npx serve .
# Abre http://localhost:3000
```

No usar `npx serve . -s` — el modo SPA rompe la navegación multi-página.

## Estructura del proyecto

```
index.html                  ← Landing principal
explorer.html               ← Data Explorer interactivo
src/
  treemap.html              ← Treemap D3.js interactivo
  ai-impact.html            ← Módulo de impacto de IA (V/S/A)
  ai-impact-scores.js       ← Motor de scoring V/S/A
  isco-08-concordance.json  ← Tabla de concordancia ISCO-08
  sector-colors.json        ← Paleta WCAG por sector
  methodology.html          ← Metodología del treemap
data/
  participants.json         ← Registro del equipo
  raw/                      ← Datos gubernamentales crudos (757K+ registros)
  processed/                ← metrics.json, summary.json, normalized.json
  schemas/                  ← Schema normalizado (22 campos)
scripts/
  processors/normalize.js   ← Normalización de todas las fuentes
  processors/calculate-metrics.js  ← Generación de métricas
  scrapers/fetch-rdtrabaja.js      ← Fetch API RD Trabaja
docs/
  ai-impact-methodology.md              ← Metodología completa del módulo IA
  AI-Workforce-Impact-DR-Methodology-Review.md  ← Revisión metodológica
  AI-Workforce-DR-Working-Tools.md       ← Herramientas de trabajo
  AI-Workforce-DR-Sprint-Plan.md         ← Plan de sprint
  AI-Impact-Prototype-Master-Prompt.md   ← Especificación del prototipo
```

## Módulo de Impacto de IA

El módulo evalúa el impacto potencial de la IA en el empleo dominicano a través de tres dimensiones:

- **Vulnerabilidad (V-Score)**: Fragilidad económica del trabajador (salario, informalidad, educación, ahorro)
- **Susceptibilidad a la IA (S-Score)**: Exposición a automatización basada en el índice AIOE (Felten et al., 2021), ajustada por velocidad e intensidad de adopción
- **Adaptabilidad (A-Score)**: Capacidad de transición a otras áreas laborales

Clasificación en 5 zonas de riesgo: Zona Crítica, Atención Urgente, Monitoreo Estratégico, Oportunidad IA, Evaluación Contextual.

Multiplicadores calibrados para República Dominicana (~10-17% por debajo de economías desarrolladas).

**Análisis por:** [Carlos Miranda Levy](https://thesocialentrepreneur.com) / [CEMI.ai](https://cemi.ai)

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [CHANGELOG.md](CHANGELOG.md) | Registro de cambios |
| [BACKLOG.md](BACKLOG.md) | Tareas pendientes y completadas |
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | Plan día por día del challenge |
| [DATA_SOURCES.md](DATA_SOURCES.md) | Inventario de fuentes de datos |
| [SECTOR_TAXONOMY.md](SECTOR_TAXONOMY.md) | 12 sectores para el treemap |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guía de contribución |
| [CONTRIBUCIONES.md](CONTRIBUCIONES.md) | 43 contribuciones post-challenge |
| [ORCHESTRATOR.md](ORCHESTRATOR.md) | Resumen técnico de arquitectura |

## Equipo

| Nombre | Rol | Status |
|--------|-----|--------|
| Erick Santana | Gestión de Proyecto | Confirmado |
| Jonathan Ovalley | Analítica, Diseño, Desarrollo con IA | Confirmado |
| Carlos Miranda Levy | Interrelaciones Sectoriales, Impacto IA, Prospectiva | Confirmado |
| Victor Corniel | Dirección de Proyecto, BI, UX/UI | Confirmado |
| Abel López | Política Pública, Estrategia de IA | Confirmado |
| José D'Andrade | AI, Deep Learning, Data Science | Confirmado |
| Arlette Palacio | EdTech, Empleabilidad | Confirmado |
| Angelino Mejía-Ricart | Comunicación, Diseño, Marketing | Confirmado |

## Deployment

- **Vercel Git Integration** — merges a `master` auto-deploy a `jobs.sanba.dev`
- Preview deployments para cada PR

## Licencia

Proyecto abierto por Sanba Development.
