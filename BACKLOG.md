# Backlog — RD Job Visualizer

> Fuente de verdad para tareas pendientes, en progreso y completadas.
> Se actualiza cada vez que se ejecuta o añade una tarea.
> Última actualización: 20 de marzo de 2026

---

## Leyenda de estados

- `[ ]` — Pendiente
- `[~]` — En progreso
- `[x]` — Completado
- `[!]` — Bloqueado (ver notas)

---

## Día 0 — Jueves 20 de Marzo (Pre-Sprint)

- [!] **0.1** — Confirmar participantes y asignar roles → _Bloqueado: depende de confirmaciones externas. Jonathan Ovalley interesado (pendiente datos)._
- [!] **0.2** — Crear grupo de trabajo (WhatsApp/Discord) → _Bloqueado: necesita participantes confirmados._
- [x] **0.3** — Compartir plan e investigación → Plan publicado en landing con overlay.
- [x] **0.4** — Inventariar fuentes de datos → `DATA_SOURCES.md` con 6 fuentes priorizadas + muestras en `data/raw/`.
- [x] **0.5** — Definir taxonomía de sectores → `SECTOR_TAXONOMY.md` con 12 sectores basados en CIUO-08.

---

## Día 1 — Lunes 23 de Marzo

- [ ] **1.1** — Descargar datasets estáticos de datos.gob.do (ONE, MAP, TSS) → Archivos CSV/JSON en `/data/raw/`
- [ ] **1.2** — Explorar estructura de RD Trabaja (inspeccionar DOM, endpoints) → Documento con selectores CSS
- [ ] **1.3** — Probar feed RSS de Aldaba → Script funcional que parsea vacantes
- [ ] **1.4** — Definir schema de datos normalizado → Schema JSON (sector, título, salario_min, salario_max, ubicación, fuente, fecha)
- [ ] **1.5** — Crear wireframe del treemap (desktop + móvil) → Mockup visual
- [ ] **1.6** — Setup del repo: estructura de carpetas, README actualizado → `/data`, `/scripts`, `/src`
- [ ] **1.7** — Post de arranque en redes → Post "Día 1"

---

## Día 2 — Martes 24 de Marzo

- [ ] **2.1** — Scraper Playwright para RD Trabaja (modo no-headless)
- [ ] **2.2** — Parser de datasets ONE (ENFT, demografía empresarial)
- [ ] **2.3** — Script de normalización: raw → cleaned → normalized JSON
- [ ] **2.4** — Validación cruzada: sectores de fuentes vs taxonomía
- [ ] **2.5** — Prototipo del treemap con datos dummy (D3.js)
- [ ] **2.6** — Definir paleta de colores por sector
- [ ] **2.7** — Post de progreso "Día 2"

---

## Día 3 — Miércoles 25 de Marzo

- [ ] **3.1** — Integrar datos normalizados con treemap D3.js
- [ ] **3.2** — Interactividad: hover con tooltip (sector, # empleos, salario)
- [ ] **3.3** — Completar ingesta de todas las fuentes priorizadas
- [ ] **3.4** — Calcular métricas agregadas (promedio salarial por sector, total empleos)
- [ ] **3.5** — Revisar y validar datos (¿los números tienen sentido?)
- [ ] **3.6** — Diseño de la página contenedora (header, filtros, leyenda)
- [ ] **3.7** — Post de progreso "Día 3"

---

## Día 4 — Jueves 26 de Marzo

- [ ] **4.1** — Drill-down: clic en sector → expandir sub-categorías
- [ ] **4.2** — Panel lateral/modal con detalle de cada sector/ocupación
- [ ] **4.3** — Responsive: funciona en móvil (< 768px)
- [ ] **4.4** — Fuentes y notas metodológicas ("Sobre los datos")
- [ ] **4.5** — Deploy a Vercel — URL funcional
- [ ] **4.6** — Testing: 3+ navegadores y dispositivos
- [ ] **4.7** — **FEATURE FREEZE a las 6pm**
- [ ] **4.8** — Post de preview "Día 4"

---

## Día 5 — Viernes 27 de Marzo (Demo Day)

- [ ] **5.1** — Bugfixes de última hora (solo críticos)
- [ ] **5.2** — Preparar demo (script 2-3 min)
- [ ] **5.3** — Capturar screenshots y GIFs
- [ ] **5.4** — Demo Day: presentación en vivo
- [ ] **5.5** — Post final en redes con link al portal
- [ ] **5.6** — Retrospectiva

---

## Tareas Adicionales (Sin Día Asignado)

- [ ] **X.1** — **Participant Intake Skill** — Crear un skill de Claude Code que al recibir información de un participante (nombre, LinkedIn, GitHub, website, línea de trabajo, puesto actual, empresas, etc.) lo registre en una base de datos de participantes (`data/participants.json`). Si ya existe, actualizarlo. Debe poder extraer info de perfiles de LinkedIn u otras fuentes.
  - _Participantes conocidos pendientes de intake:_
    - **Erick Santana** — LinkedIn: https://www.linkedin.com/in/ericksantana/ (resto TBD)
    - **Jonathan Ovalley** — Interesado, pendiente email/GitHub/LinkedIn

- [ ] **X.2** — **Sección "Equipo" en la landing** — Agregar segmento en `index.html` para mostrar los participantes del challenge: foto, nombre, rol asignado, breve bio, y links a socials (LinkedIn, GitHub, website). Datos consumidos desde `data/participants.json`.
