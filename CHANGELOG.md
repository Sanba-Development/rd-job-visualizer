# Changelog

Registro de cambios del módulo de Impacto de la IA en el Empleo Dominicano.

Proyecto: [RD Job Visualizer](https://jobs.sanba.dev) por Sanba Development.
Módulo AI Impact: [Carlos Miranda Levy](https://thesocialentrepreneur.com) / [CEMI.ai](https://cemi.ai)

---

## [Unreleased] — feat/isco-08-concordance (PR #40)

### Added
- **Concordancia ISCO-08**: Tabla de ~60 patrones de títulos dominicanos clasificados a nivel de 4 dígitos ISCO-08 (`src/isco-08-concordance.json`)
- **Exclusión de no-ocupaciones**: Filtrado automático de "salario mínimo", "empleo zona franca" y "licencias turismo" del análisis V/S/A
- **Desambiguación "técnico" por sector**: En RD "técnico" = profesional de nivel medio (ISCO Grupo 3). AIOE varía según sector (Salud: 38, TIC: 65, Admin: 58)
- **ISCO en UI**: Códigos ISCO-08 visibles en tooltips del scatter plot y panel de detalle
- Nuevo `matchOccupation()` reemplaza `matchAIOE()` con cadena de resolución de 6 pasos
- Secciones "Concordancia ISCO-08", "Exclusiones y Adaptaciones", "Adaptaciones al Contexto Dominicano" en metodología inline
- Status de implementación actualizado en todos los documentos de planificación

---

## [2.0.0] — 2026-03-28 (PR #39, merged)

### Added
- **Integración MAP nómina pública**: 493,554 registros de diciembre 2025, llevando el total a 757K registros
- **Procesador MAP** en `normalize.js` con mapeo de ~35 instituciones a sectores y keyword fallback
- **Streaming JSON** para manejar 750K+ registros sin exceder límites de V8
- **Controles de escenario**: Horizonte temporal (Corto/Medio/Largo) + Velocidad de adopción (Lenta/Promedio/Rápida) + Intensidad de adopción (Leve/Moderada/Fuerte)
- **Buscador de ocupaciones**: Filtra y resalta burbujas en el scatter plot
- **Top 10 rankings**: 6 listas paginadas (Vulnerables/Seguros, Susceptibles/No Susceptibles, Adaptables/No Adaptables) con agregación cross-sectorial y normalización de variantes de género "(a)"
- **Radar chart**: Comparación de sectores ilimitados en 5 dimensiones (V, S, A, Nivel Salarial, Formalidad) con leyenda explicativa
- **CSS ring gauges**: Indicadores circulares con color dinámico por valor (verde/amarillo/rojo)
- **Análisis Sistémico** (nueva sección): Paradoja de la Informalidad, Dimensión de Género (67% F en MAP), BPO/Call Centers como micro-sector de riesgo, Factores DR de adopción (8 retardantes + 10 aceleradores)
- **Sector filter chips**: Botones coloreados por sector directamente sobre el scatter plot
- **Sticky controls bar**: Barra de controles globales fija debajo del navbar al hacer scroll
- **Collapsible sections**: Dashboard, Rankings, Radar, Análisis Sistémico, Análisis por Sector, Metodología — todos colapsables, colapsados por defecto
- **Metodología expandida**: AIOE explicado con tabla de 20 ocupaciones, fórmula de multiplicadores con ejemplos trabajados, niveles de confianza (Tier 1/2/3), hoja de ruta 5 fases, 10 limitaciones documentadas
- **Nota LLMs**: Reconoce que AIOE (2021) predates Claude/GPT-4/Gemini; Intensidad "Fuerte" (×1.25) captura parcialmente la expansión
- **Modal de documentos**: Carga cualquier `docs/*.md` con rendering marked.js
- **Documentos de trabajo**: 5 documentos de planificación vinculados desde metodología
- **Factores DR completos**: 8 factores retardantes + 10 aceleradores con análisis detallado

### Changed
- **Multiplicadores de velocidad calibrados para RD**: ~10-17% por debajo de economías desarrolladas (era ~30%)
- **Colores de zona diferenciados**: Atención Urgente (#F97316 naranja), Monitoreo Estratégico (#EAB308 amarillo), Evaluación Contextual (#6366F1 índigo)
- **Sector mapping corregido**: Ministerio de Hacienda, Presupuesto, Tesorería → Admin. Pública (no Servicios Financieros). Solo reguladores autónomos (SB, BCRD) como Financiero
- **Umbral de representatividad salarial**: Sectores con <500 registros usan proxies ENCFT/TSS
- **Gauges**: De arcos D3 (no renderizaban en contenedores ocultos) a anillos CSS
- **Labels**: "Susceptibilidad" → "Susceptibilidad a la IA" en toda la página
- **Tabla sectorial**: Columna "Empleos" → "Registros"; subtítulo indica acción de click
- **Rankings bylines**: Alineados con definiciones V/S/A ("Mayor fragilidad económica..." en vez de "Mayor riesgo compuesto")
- **"Top 10 Más Seguros"** → **"Top 10 Menos Vulnerables"** (simetría con "Más Vulnerables")

### Fixed
- Números inflados en tabla sectorial (usaba `total_empleos` que sumaba employee_count de agregados TSS)
- Badges de zona en Análisis por Sector no se actualizaban con cambios de controles
- Gauges no renderizaban al abrir dashboard (SVGs en contenedores hidden)
- Espacio extra entre Dashboard y Rankings (panel de detalle con margin estático)
- Radar Nivel Salarial mostraba 0 para 7 sectores sin datos de salario
- Lucide icons: `palm-tree` → `tree-palm`, `github` → `git-branch`

### Credits
- Créditos actualizados: [Carlos Miranda Levy](https://thesocialentrepreneur.com) / [CEMI.ai](https://cemi.ai) / Sanba Development
- Artículos de referencia con links a Wiley y ResearchGate

---

## [1.0.0] — 2026-03-27 (PR #35, merged)

### Added
- **Prototipo inicial** del módulo de impacto de IA (`src/ai-impact.html`)
- **Motor de scoring** (`src/ai-impact-scores.js`): V-Score (4 componentes), S-Score (AIOE × temporal), A-Score (2 componentes), clasificación de 5 zonas de riesgo
- **Scatter plot D3.js**: Burbujas por ocupación, tamaño = trabajadores, color = zona, cuadrantes etiquetados
- **Selector temporal**: Corto (2026-28), Medio (2028-32), Largo (2032+)
- **Dashboard con gauges**: Indicadores nacionales V/S/A
- **Tabla sectorial**: Desglose por sector con scores y zona
- **Panel de detalle**: Click en burbuja muestra breakdown V/S/A
- **Análisis por sector**: 12 explicaciones colapsables de V/S/A por sector económico
- **Metodología inline**: Scores, zonas, limitaciones, créditos
- **Documentación**: `docs/ai-impact-methodology.md`
- **Navegación**: Links treemap ↔ ai-impact en navbar y footer
- **Datos**: AIOE baselines para 9 grupos ISCO + ~100 keywords de ocupaciones
- **Informality rates**: 12 sectores basados en ENCFT 2025
- **Salary proxies**: 12 sectores con estimaciones de salario promedio

---

## [Pre-AI Impact] — 2026-03-20 a 2026-03-26

### Project Foundation (Days 0-4)
- Landing page (`index.html`) con secciones de progreso diario
- Data Explorer (`explorer.html`) para navegar datasets
- D3.js treemap (`src/treemap.html`) con 12 sectores y drill-down por ocupación
- Pipeline de datos: fetch (RD Trabaja API) + normalize (262K registros de 13 fuentes)
- Paleta de colores WCAG por sector (`src/sector-colors.json`)
- Taxonomía de 12 sectores basada en CIUO-08
- Participantes: 8 contribuyentes con perfiles completos
- Metodología del treemap (`src/methodology.html`)
- CONTRIBUCIONES.md con 43 contribuciones accionables post-challenge
