# RD Job Visualizer — Plan de Proyecto

> **Reto de 7 Días** | Sanba Development | Lun 23 → Vie 27 de Marzo 2026
> Inspirado en [karpathy.ai/jobs](https://karpathy.ai/jobs/)

---

## Objetivo General

Construir un portal web interactivo que visualice el mercado laboral dominicano mediante un treemap estilo Karpathy, mostrando empleos por sector, salarios, volumen y metadata relevante — usando datos reales de fuentes públicas dominicanas.

---

## Roles del Equipo

| Rol | Responsabilidad Principal |
|-----|--------------------------|
| **Ingeniería de Datos** | Scrapers, pipelines de ingesta, limpieza y normalización de datos |
| **Desarrollo Frontend** | Treemap D3.js, interfaz interactiva, responsive design |
| **Ciencia de Datos / Analytics** | Validación de datos, cálculos de métricas, análisis estadístico |
| **Diseño UX/UI** | Wireframes del treemap, paleta de colores por sector, experiencia móvil |
| **Investigación / Economía** | Contexto sectorial, validación de categorías CNO, interpretación de datos |
| **Contenido & Redes** | Documentación del proceso, posts diarios, comunicación pública |
| **Gestión de Proyecto** | Coordinación diaria, seguimiento de entregas, decisiones de alcance |

---

## Roadmap Diario

### Día 0 — Jueves 20 de Marzo (Pre-Sprint)
**Objetivo:** Alinear al equipo y tener todo listo para arrancar el lunes.

| # | Tarea | Rol(es) | Entregable |
|---|-------|---------|------------|
| 0.1 | Confirmar participantes y asignar roles | Gestión | Lista de equipo con roles asignados |
| 0.2 | Crear grupo de trabajo (WhatsApp/Discord) | Gestión | Canal activo con todos los participantes |
| 0.3 | ~~Compartir este plan y el documento de investigación~~ | Gestión / Contenido | **COMPLETADO** — Plan publicado en landing con overlay |
| 0.4 | ~~Inventariar fuentes de datos disponibles~~ | Investigación | **COMPLETADO** — `DATA_SOURCES.md` con 6 fuentes priorizadas + muestras descargadas en `data/raw/` |
| 0.5 | ~~Definir la taxonomía de sectores (basada en CNO)~~ | Investigación / Analytics | **COMPLETADO** — `SECTOR_TAXONOMY.md` con 12 sectores basados en CIUO-08 |

**Decisión clave:** ~~¿Cuántos sectores/categorías vamos a visualizar?~~ **DECIDIDO: 12 sectores de primer nivel** (ver `SECTOR_TAXONOMY.md`)

---

### Día 1 — Lunes 23 de Marzo
**Objetivo:** Datos crudos en mano. Al menos una fuente descargada y explorada.

| # | Tarea | Rol(es) | Entregable |
|---|-------|---------|------------|
| 1.1 | Descargar datasets estáticos de datos.gob.do (ONE, MAP, TSS) | Ing. Datos | Archivos CSV/JSON en `/data/raw/` |
| 1.2 | Explorar estructura de RD Trabaja (inspeccionar DOM, endpoints) | Ing. Datos | Documento con selectores CSS y estructura de datos |
| 1.3 | Probar feed RSS de Aldaba | Ing. Datos | Script funcional que parsea vacantes |
| 1.4 | Definir schema de datos normalizado | Analytics / Ing. Datos | Schema JSON con campos: sector, título, salario_min, salario_max, ubicación, fuente, fecha |
| 1.5 | Crear wireframe del treemap (desktop + móvil) | Diseño UX/UI | Mockup visual con jerarquía de datos |
| 1.6 | Setup del repo: estructura de carpetas, README actualizado | Frontend | Estructura `/data`, `/scripts`, `/src` lista |
| 1.7 | Post de arranque en redes | Contenido | Post "Día 1" documentando el inicio |

**Decisión clave:** ¿Qué campos de metadata son viables con los datos disponibles? (salario, volumen, ubicación — ¿cuáles realmente están en las fuentes?)

---

### Día 2 — Martes 24 de Marzo
**Objetivo:** Pipeline de ingesta funcional. Datos normalizados de al menos 2 fuentes.

| # | Tarea | Rol(es) | Entregable |
|---|-------|---------|------------|
| 2.1 | Scraper Playwright para RD Trabaja (modo no-headless) | Ing. Datos | Script que extrae vacantes con título, empresa, ubicación, sector |
| 2.2 | Parser de datasets ONE (ENFT, demografía empresarial) | Ing. Datos / Analytics | Datos de volumen de empleo por sector en formato normalizado |
| 2.3 | Script de normalización: mapear datos crudos → schema definido en 1.4 | Ing. Datos | Pipeline: raw → cleaned → normalized JSON |
| 2.4 | Validación cruzada: ¿los sectores de las fuentes coinciden con la taxonomía? | Investigación / Analytics | Tabla de mapeo fuente → categoría del treemap |
| 2.5 | Prototipo del treemap con datos dummy | Frontend | Treemap D3.js renderizando con datos ficticios pero estructura real |
| 2.6 | Definir paleta de colores por sector | Diseño UX/UI | Guía de colores asignados a cada categoría |
| 2.7 | Post de progreso en redes | Contenido | Post "Día 2" con screenshot del primer treemap |

**Decisión clave:** Si el scraping de RD Trabaja es muy complejo, ¿pivotamos a Aldaba RSS + datos estáticos de ONE como fuentes principales?

---

### Día 3 — Miércoles 25 de Marzo
**Objetivo:** Datos reales fluyendo al treemap. Primera visualización con datos de verdad.

| # | Tarea | Rol(es) | Entregable |
|---|-------|---------|------------|
| 3.1 | Integrar datos normalizados con el treemap D3.js | Frontend / Ing. Datos | Treemap mostrando sectores reales con volumen real |
| 3.2 | Agregar interactividad: hover con tooltip (sector, # empleos, salario) | Frontend | Tooltips funcionales al pasar sobre cada celda |
| 3.3 | Completar ingesta de todas las fuentes priorizadas | Ing. Datos | Dataset consolidado en `/data/processed/` |
| 3.4 | Calcular métricas agregadas: promedio salarial por sector, total empleos | Analytics | Archivo de métricas listo para consumo del frontend |
| 3.5 | Revisar y validar datos: ¿los números tienen sentido? | Investigación / Analytics | Informe de calidad de datos con banderas rojas |
| 3.6 | Diseño de la página contenedora (header, filtros, leyenda) | Diseño UX/UI | Layout completo alrededor del treemap |
| 3.7 | Post de progreso: primera captura con datos reales | Contenido | Post "Día 3" — el treemap empieza a contar una historia |

**Decisión clave:** ¿Incluimos filtros (por geografía, por rango salarial) o eso es scope creep para el MVP?

---

### Día 4 — Jueves 26 de Marzo
**Objetivo:** MVP funcional y desplegado. Feature freeze al final del día.

| # | Tarea | Rol(es) | Entregable |
|---|-------|---------|------------|
| 4.1 | Agregar drill-down: clic en sector → expandir sub-categorías | Frontend | Navegación por niveles del treemap |
| 4.2 | Panel lateral o modal con detalle de cada sector/ocupación | Frontend / Diseño | Vista de detalle con metadata completa |
| 4.3 | Responsive: asegurar que funciona en móvil | Frontend / Diseño | Treemap legible en pantallas < 768px |
| 4.4 | Agregar fuentes y notas metodológicas ("Sobre los datos") | Investigación / Contenido | Sección explicando de dónde vienen los datos y limitaciones |
| 4.5 | Deploy a Vercel — URL funcional | Frontend / Gestión | rd-job-visualizer.vercel.app mostrando el MVP |
| 4.6 | Testing: probar en 3+ navegadores y dispositivos | Todo el equipo | Lista de bugs críticos (si hay) |
| 4.7 | **FEATURE FREEZE a las 6pm** | Gestión | Solo bugfixes después de este punto |
| 4.8 | Post de preview: "Mañana es Demo Day" | Contenido | Post "Día 4" con GIF del treemap funcionando |

**Decisión clave:** ¿Qué features cortamos si no estamos a tiempo? (Prioridad: treemap con datos reales > interactividad > filtros > drill-down)

---

### Día 5 — Viernes 27 de Marzo (Demo Day)
**Objetivo:** Pulir, presentar, celebrar.

| # | Tarea | Rol(es) | Entregable |
|---|-------|---------|------------|
| 5.1 | Bugfixes de última hora (solo críticos) | Frontend / Ing. Datos | MVP estable |
| 5.2 | Preparar demo: script de presentación (2-3 min) | Gestión / Contenido | Guión: problema → datos → visualización → insight |
| 5.3 | Capturar screenshots y GIFs para documentación | Contenido / Diseño | Assets para post-mortem y redes |
| 5.4 | Demo Day: presentación en vivo | Todo el equipo | Demostración del MVP funcionando |
| 5.5 | Post final en redes con link al portal | Contenido | Post "Día 5" — resultado final con link público |
| 5.6 | Retrospectiva rápida: ¿qué salió bien? ¿qué mejorar? | Todo el equipo | Notas para futuros retos |

---

## Criterios de Éxito del MVP

| Criterio | Mínimo Viable | Ideal |
|----------|--------------|-------|
| **Fuentes de datos** | 1 fuente real integrada | 3+ fuentes cruzadas |
| **Treemap** | Estático con datos reales | Interactivo con drill-down |
| **Metadata visible** | Sector + volumen de empleos | + salario + ubicación + tendencia |
| **Dispositivos** | Desktop funcional | Desktop + móvil |
| **Deploy** | URL pública funcional | Con dominio y SSL |
| **Documentación** | README actualizado | + notas metodológicas en el portal |

---

## Riesgos y Planes B

| Riesgo | Probabilidad | Plan B |
|--------|-------------|--------|
| RD Trabaja bloquea el scraper | Alta | Usar Aldaba RSS + datos estáticos ONE como fuentes principales |
| Datos de salario no disponibles en fuentes públicas | Media | Mostrar rangos estimados o excluir salario del MVP |
| Equipo incompleto (no todos los roles cubiertos) | Media | Priorizar Ing. Datos + Frontend; otros roles los cubre el PM |
| D3.js treemap toma más tiempo del esperado | Baja | Usar librería wrapper como `react-d3-treemap` o Recharts |
| Datos inconsistentes entre fuentes | Alta | Documentar discrepancias, priorizar una fuente como "verdad base" |

---

## Stack Técnico

- **Scraping:** Playwright (SPAs), fetch/RSS parser (feeds)
- **Procesamiento:** Python/Node scripts, JSON como formato intermedio
- **Frontend:** HTML/JS + D3.js (o React si el equipo lo prefiere)
- **Hosting:** Vercel (ya configurado)
- **Colaboración:** GitHub (repo público), WhatsApp (coordinación)
- **Herramientas de desarrollo:** Claude Code para aceleración

---

*Este plan es un documento vivo. Se actualiza diariamente según el progreso real del equipo.*

*Última actualización: 20 de marzo de 2026*
