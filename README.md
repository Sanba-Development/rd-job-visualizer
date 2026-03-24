# RD Job Visualizer

> Visualizador interactivo del mercado laboral dominicano | Challenge de 7 Días por [Sanba Development](https://sanba.dev)

**Live:** [jobs.sanba.dev](https://jobs.sanba.dev)

---

## Qué es esto

Un portal web interactivo que visualiza el mercado laboral de la República Dominicana mediante un treemap estilo [Karpathy](https://karpathy.ai/jobs/), mostrando empleos por sector, salarios, volumen y metadata — usando datos reales de fuentes públicas gubernamentales.

## Estado actual

- **436,000+ filas** de datos gubernamentales reales (15 datasets de 11 instituciones)
- **API de RD Trabaja** descubierta — 249 vacantes activas del sector privado
- **12 sectores** definidos basados en CIUO-08
- **Schema normalizado** (22 campos) listo para procesamiento
- **Data Explorer** interactivo para navegar los datos
- **Wireframe del treemap** con diseño desktop + móvil

## Stack

Todo corre como HTML estático — sin build system, sin framework, sin instalación.

| Herramienta | Uso |
|-------------|-----|
| Tailwind CSS (CDN) | Estilos |
| Lucide Icons (CDN) | Iconografía |
| Marked.js (CDN) | Renderizar markdown en overlays |
| PapaParse (CDN) | Parsear CSV en el Data Explorer |
| D3.js (pendiente) | Treemap interactivo |

## Desarrollo local

```bash
npx serve .
# Abre http://localhost:3000
```

## Contribuir

Lee **[CONTRIBUTING.md](CONTRIBUTING.md)** para las reglas de contribución.

**TL;DR:**
1. Elige una tarea de `BACKLOG.md`
2. Crea un branch (`feat/tu-tarea`)
3. Trabaja, haz commit, push
4. Abre un PR — necesitas 1 aprobación para mergear

**No se permite push directo a master.**

## Estructura del proyecto

```
index.html              ← Landing principal
explorer.html           ← Data Explorer interactivo
wireframes/             ← Mockups del treemap
data/
  participants.json     ← Registro del equipo
  raw/                  ← Datos gubernamentales crudos (436K+ filas)
  schemas/              ← Schema normalizado
  processed/            ← (pendiente) Datos normalizados
scripts/                ← (pendiente) Scripts de procesamiento
src/                    ← (pendiente) Frontend D3.js
```

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [BACKLOG.md](BACKLOG.md) | Tareas pendientes y completadas |
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | Plan día por día del challenge |
| [DATA_SOURCES.md](DATA_SOURCES.md) | Inventario de fuentes de datos |
| [SECTOR_TAXONOMY.md](SECTOR_TAXONOMY.md) | 12 sectores para el treemap |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guía de contribución |
| [ORCHESTRATOR.md](ORCHESTRATOR.md) | Resumen técnico de arquitectura |

## Equipo

| Nombre | Rol | Status |
|--------|-----|--------|
| Erick Santana | Gestión de Proyecto | Confirmado |
| Jonathan Ovalley | TBD | Confirmado |
| Carlos Miranda Levy | TBD | Interesado |
| Victor Corniel | TBD | Interesado |

## Licencia

Proyecto abierto por Sanba Development.
