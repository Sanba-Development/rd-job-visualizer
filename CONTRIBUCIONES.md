# ¿Y ahora qué? — 40 Contribuciones para el Futuro del Mapa del Empleo RD

> El challenge de 7 días terminó, pero ahora es que falta mambo. Este documento lista 40 contribuciones concretas y accionables que cualquier persona puede hacer para llevar este proyecto al siguiente nivel.
>
> **¿Quieres contribuir?** Elige una tarea, abre un issue en GitHub, y empieza.

---

## Cómo usar este documento

Cada contribución tiene:
- **Título** claro y específico
- **Descripción** de qué hacer concretamente
- **Datos/recursos** necesarios
- **Nivel de esfuerzo** (1-3 días, 1-2 semanas, 1+ mes)
- **Impacto** (Alto, Medio, Bajo)

---

## 🗺️ Visualización e Interactividad

El treemap actual muestra volumen de empleo por sector — pero hay cuatro capas de información que todavía no se pueden explorar visualmente. Este segmento extiende la visualización para que el mismo mapa cuente múltiples historias: salarios, formalidad, exposición a IA, geografía. Cada contribución aquí transforma una tabla de datos en algo que alguien sin conocimientos técnicos puede entender en segundos.

1. **Toggle de modos de color** — Agregar 4 botones para cambiar qué representan los colores del treemap: Volumen de Empleo (actual), Mediana Salarial, Tasa de Formalidad, Exposición a IA. Inspirado en las 4 capas de Karpathy. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** `src/treemap.html`

2. **Mapa coroplético por provincia** — Vista alternativa con las 32 provincias de RD, coloreadas por densidad de empleo formal. Datos: ENCFT provincial. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** nuevo `src/map.html`

3. **Distribución salarial P25/P50/P75** — Reemplazar la mediana única en tooltips con gráfico de barras mostrando percentiles 25, 50 y 75. Los datos existen en DGII. **Esfuerzo:** 1-3 días | **Impacto:** Medio | **Archivos:** `src/treemap.html`

4. **Sparklines de tendencia temporal** — Mini gráficos de línea por sector mostrando la evolución 2003-2026 usando la serie de 23 años de TSS cotizantes. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** `src/treemap.html`, `data/raw/empleos-cotizantes-tss-2003-2026.csv`

5. **Línea de referencia de salario mínimo** — Línea roja horizontal en el gráfico salarial mostrando el salario mínimo vigente por sector. Ya tenemos `salario-minimo-hacienda-2000-2025.csv`. **Esfuerzo:** 1-3 días | **Impacto:** Medio | **Archivos:** `src/treemap.html`

6. **Overlay de economía informal** — Mostrar cada sector dividido: empleo formal (sólido) vs estimado informal (rayado). ENCFT tiene tasa de informalidad por sector (~58% nacional). **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** `src/treemap.html`

7. **Buscador de ocupaciones** — Campo de búsqueda: escribir "médico" o "contador" y ver sectores relevantes, salario típico, volumen de empleo. Actualmente solo hay treemap sin búsqueda. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** `src/treemap.html`

---

## 🔬 Pipeline de Datos e IA

Los datos crudos están ahí — 264K registros normalizados — pero su potencial analítico apenas se ha tocado. Este segmento trata de enriquecer, conectar y automatizar: pasar títulos de puesto por Claude para scoring de IA, mapear ocupaciones a estándares internacionales, y construir la infraestructura que convierte snapshots en series de tiempo. Una sola contribución aquí puede desbloquear años de análisis.

8. **Scoring de exposición a IA por ocupación** — Pasar los 200 títulos de puesto más comunes por Claude con una rúbrica de scoring (0-10). Output: `data/processed/ai-exposure.json`. Seguir el patrón de `score.py` de Karpathy. **Esfuerzo:** 1-3 días | **Impacto:** Alto | **Archivos:** nuevo `scripts/processors/score-ai-exposure.js`

9. **Tabla de equivalencia ISCO-08** — Mapear los 500 títulos más comunes del gobierno dominicano a códigos ISCO-08 usando Claude. Publicar como CSV descargable. Este recurso NO EXISTE para RD — sería el primero. **Esfuerzo:** 1-2 semanas | **Impacto:** Muy Alto | **Archivos:** nuevo `data/processed/isco-crosswalk.csv`

10. **Frecuencia de skills desde RD Trabaja** — Parsear las descripciones de vacantes para extraer keywords de habilidades. Output: Top 50 skills más demandados. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** `scripts/processors/`, `data/raw/rdtrabaja/`

11. **Recuperar API del MAP** — La API JSON del MAP (actualmente 403) es fuente P0. Reintentar con headers correctos de Accept/Authorization, o solicitar acceso vía OAI. 500K+ registros de nómina desbloqueados si funciona. **Esfuerzo:** 1-3 días | **Impacto:** Muy Alto | **Archivos:** nuevo `scripts/scrapers/fetch-map.js`

12. **Ingesta completa de ENCFT** — La encuesta trimestral del Banco Central es el "gold standard" para empleo total (formal + informal). Parsear los workbooks de Excel desbloquearía los datos más representativos. **Esfuerzo:** 1-2 semanas | **Impacto:** Muy Alto | **Archivos:** `scripts/processors/`, `data/raw/`

13. **Scraping histórico de RD Trabaja** — Automatizar snapshots semanales de vacantes usando el script existente `fetch-rdtrabaja.js` con un Cron Job. Construir serie de demanda de 52 semanas. **Esfuerzo:** 1-3 días | **Impacto:** Medio | **Archivos:** `scripts/scrapers/fetch-rdtrabaja.js`, `vercel.json`

---

## 🔄 Treemap Inverso — Transparencia Institucional

> **Concepto:** Así como nuestro treemap muestra quiénes SÍ reportan datos, un treemap inverso mostraría quiénes NO lo hacen. Identificar las instituciones gubernamentales que deberían reportar su nómina públicamente y no lo hacen, y los gremios/asociaciones del sector privado que podrían compartir datos de sus miembros.

La transparencia es una forma de presión social. Cuando una institución sabe que su ausencia es visible, tiene incentivos para publicar. Este segmento convierte la falta de datos en un dato en sí mismo — y lo hace visible.

14. **Inventario de instituciones gubernamentales sin datos públicos** — Investigar las ~180 instituciones del gobierno dominicano (ver Ley 247-12) y marcar cuáles publican nómina en datos.gob.do y cuáles no. Output: tabla con nombre, tipo, si publica, URL o "sin datos". **Esfuerzo:** 1-2 semanas | **Impacto:** Muy Alto | **Archivos:** nuevo `data/raw/instituciones-sin-datos.csv`

15. **Treemap inverso de instituciones** — Visualización donde el tamaño del bloque es proporcional al presupuesto de personal de la institución, y el color indica si publica datos (verde) o no (rojo). **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** nuevo `src/treemap-inverso.html`

16. **Directorio de gremios y asociaciones sectoriales** — Listar las asociaciones empresariales dominicanas por sector (ASONAHORES turismo, ADOZONA zonas francas, CTIC tecnología, ADARS salud, etc.) con contacto y si comparten datos de empleo. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** nuevo `data/raw/gremios-directorio.csv`

17. **Carta abierta de solicitud de datos** — Template de carta para enviar a instituciones y gremios solicitando colaboración con datos de empleo. Publicar como recurso descargable. **Esfuerzo:** 1-3 días | **Impacto:** Medio | **Archivos:** nuevo `docs/carta-solicitud-datos.md`

18. **Ranking de transparencia laboral** — Scorecard público: ¿cuáles instituciones son más transparentes con sus datos de empleo? Actualizar trimestralmente. Incentivo social para que publiquen. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** nuevo `src/transparencia.html`

---

## 📊 Bureau de Empleo — Infraestructura Nacional

> **Concepto:** Así como existe el Bureau de Crédito (DataCrédito/TransUnion) para historial crediticio, proponemos un Bureau de Empleo para verificación laboral. Las empresas contribuyen datos anonimizados de su nómina y a cambio pueden verificar historial laboral de candidatos — sin llamar a la empresa actual. El modelo es: "give-in / take-out".

Este es el segmento de mayor ambición del documento. No es solo una mejora al visualizador — es proponer una infraestructura de información laboral que RD no tiene. El visualizador sería el punto de entrada y prueba de concepto.

19. **Documento conceptual del Bureau de Empleo RD** — White paper describiendo: qué es, cómo funciona, modelo de datos, privacidad (k-anonimato), marco legal (Ley 172-13 de protección de datos), incentivos para participar, roadmap de implementación. **Esfuerzo:** 1+ mes | **Impacto:** Muy Alto | **Archivos:** nuevo `docs/bureau-empleo-whitepaper.md`

20. **Prototipo de API de verificación** — Demo técnico: endpoint que recibe cédula/RNC + empresa → devuelve "Sí/No trabajó allí" + rango salarial + periodo. Datos dummy. Mostrar que es técnicamente viable. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** nuevo directorio `api/`

21. **Análisis de viabilidad legal** — Investigar la Ley 172-13, reglamentos de TSS, y normativas de DGII para determinar qué datos de empleo se pueden compartir legalmente entre empresas con consentimiento del empleado. **Esfuerzo:** 1+ mes | **Impacto:** Alto | **Archivos:** nuevo `docs/analisis-legal-bureau.md`

22. **Modelo de datos estandarizado de nómina** — Proponer un schema estándar JSON/CSV que las empresas dominicanas usarían para reportar datos al Bureau. Campos: cédula (hasheada), empresa (RNC), puesto, fecha inicio, fecha fin, rango salarial, sector. **Esfuerzo:** 1-3 días | **Impacto:** Alto | **Archivos:** nuevo `data/schemas/bureau-nomina.schema.json`

23. **Pitch deck para instituciones** — Presentación de 10 slides para TSS, DGII, MAP, cámaras de comercio explicando el concepto y los beneficios de participar. **Esfuerzo:** 1-3 días | **Impacto:** Medio | **Archivos:** nuevo `docs/pitch-bureau-empleo.md`

---

## 📐 Estándar de Datos de Empleabilidad

> **Concepto:** Proponer un estándar abierto para datos de empleabilidad dominicana — cómo reportar, qué campos incluir, qué taxonomía usar. Similar a ESCO para Europa o SOC para EE.UU., pero adaptado a la realidad dominicana.

Hoy cada fuente de datos usa sus propias categorías, títulos y formatos. Eso hace que comparar sea difícil y agregar sea frágil. Un estándar dominicano resuelve eso de raíz — y si lo publicamos como recurso abierto, cualquier portal de empleo en RD podría adoptarlo.

24. **CODO-08: Clasificación Oficial Dominicana de Ocupaciones** — Publicar una taxonomía basada en ISCO-08 pero adaptada al mercado local. Incluir ocupaciones informales comunes (motoconchista, colmadero, chiripero). **Esfuerzo:** 1+ mes | **Impacto:** Muy Alto | **Archivos:** nuevo `data/schemas/codo-08.json`

25. **Schema estándar de vacante laboral RD** — JSON Schema para publicación de vacantes que incluya: título normalizado, código CODO-08, salario (mín/máx), provincia, modalidad (presencial/remoto/híbrido), skills requeridos. **Esfuerzo:** 1-3 días | **Impacto:** Alto | **Archivos:** nuevo `data/schemas/vacante-estandar.schema.json`

26. **Integración con ESCO en español** — Para cada código ISCO-08 en nuestro crosswalk, importar los skills de ESCO (API gratuita, disponible en español). Mostrar "habilidades típicamente requeridas" en perfiles de ocupación. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** `scripts/processors/`, `data/processed/`

27. **Guía de reporte para empresas** — Documento práctico: "Cómo reportar datos de empleo al estándar RD". Paso a paso para que una empresa exporte su nómina en formato compatible. **Esfuerzo:** 1-3 días | **Impacto:** Medio | **Archivos:** nuevo `docs/guia-reporte-empresas.md`

---

## 🧑‍🤝‍🧑 Comunidad y Contenido

Los datos sin contexto son solo números. Este segmento convierte el proyecto en una fuente viva de conocimiento sobre el mercado laboral dominicano — con análisis accesibles, encuestas participativas, e infografías que la gente realmente comparte. También trata de conectar el proyecto con instituciones académicas que pueden darle credibilidad y continuidad.

28. **Encuesta anual de salarios** — Formulario anónimo: ¿Cuánto ganas? + sector + años de experiencia + provincia + género. Agregar mensualmente para llenar el gap de economía informal. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** nuevo formulario + `data/processed/encuesta-salarios.json`

29. **Blog de análisis mensual** — Publicación mensual analizando un sector específico: ¿Quiénes son los mayores empleadores? ¿Cómo ha cambiado el salario? ¿Cuáles skills demandan? **Esfuerzo:** 1-3 días/mes | **Impacto:** Medio | **Archivos:** nuevo directorio `blog/`

30. **Infografías sectoriales** — Una infografía descargable por cada uno de los 12 sectores: datos clave, top empleadores, rango salarial, tendencia. Formato Instagram/WhatsApp. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** nuevo directorio `assets/infografias/`

31. **Alianzas con universidades** — Contactar INTEC, PUCMM, UASD, UNPHU para ofrecer los datos como insumo para tesis de grado y proyectos de investigación. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** `docs/`

32. **Programa "Data Champion" por sector** — Reclutar un voluntario experto por sector (ej: un médico para Salud, un profesor para Educación) que valide y contextualice los datos. **Esfuerzo:** 1+ mes | **Impacto:** Alto | **Archivos:** `data/participants.json`

---

## 🏛️ Política Pública e Investigación

El mercado laboral no es solo economía — es política. Decisiones sobre salario mínimo, incentivos sectoriales, y programas de capacitación afectan a millones de personas. Este segmento convierte el visualizador en una herramienta de análisis de política: simuladores, comparaciones regionales, y reportes que los tomadores de decisiones puedan usar directamente.

33. **Panel "RD en contexto regional"** — Mostrar el score de RD en el IDB Better Jobs Index vs promedio LAC. Dimensiones: participación laboral, tasa de empleo, formalidad, salario suficiente. **Esfuerzo:** 1-3 días | **Impacto:** Alto | **Archivos:** `src/treemap.html`

34. **Simulador de escenarios de política** — "Si el salario mínimo sube 10%, ¿cuántos trabajadores se ven afectados?" Simulación interactiva usando nuestra distribución salarial. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** nuevo `src/simulador.html`

35. **Indicador de pobreza laboral** — Señalar sectores donde la mediana salarial está por debajo del umbral de pobreza (~RD$12,000/mes). Overlay visual en el treemap. **Esfuerzo:** 1-3 días | **Impacto:** Alto | **Archivos:** `src/treemap.html`

36. **Brecha salarial de género por sector** — Visualización de la diferencia salarial hombre/mujer por sector. Datos: nóminas MAP (nombres permiten inferir género) y DGII. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** `src/treemap.html`, `scripts/processors/`

37. **Reporte Anual del Mercado Laboral RD** — PDF + versión interactiva publicado anualmente. Como el reporte de OIT "Situación del Empleo en América Latina y el Caribe" pero específico para RD. Sería el primero de su tipo. **Esfuerzo:** 1+ mes | **Impacto:** Muy Alto | **Archivos:** nuevo `docs/reporte-anual/`

---

## 🔮 Prospectiva y Análisis Sectorial

> **Concepto:** Más allá de los datos cuantitativos, necesitamos análisis cualitativo de hacia dónde van los sectores. ¿Cuáles son los más vulnerables ante la transición tecnológica? ¿Cuáles tienen más potencial de crecimiento? Este segmento cruza la prospectiva sectorial con los datos que ya tenemos para extraer métricas accionables.

41. **Análisis de vulnerabilidad sectorial ante IA** — Evaluar cada uno de los 12 sectores según su susceptibilidad al impacto de la inteligencia artificial y automatización, independiente del dataset. Cruzar luego con nuestros datos cuantitativos para identificar cuántos empleos están en riesgo por sector. Referencia: [The Intelligence Transition (iBIZAi)](https://ibizai.io/es/explore/opinions/the-intelligence-transition/) por Carlos Miranda Levy / CEMI.ai. **Esfuerzo:** 1-2 semanas | **Impacto:** Muy Alto | **Archivos:** nuevo `docs/analisis-vulnerabilidad-sectorial.md`, `src/treemap.html` (nueva capa de color)

42. **Mapa de reconversión de competencias** — Para los sectores más vulnerables, identificar rutas de reconversión: ¿a qué otros sectores pueden migrar los trabajadores? ¿Qué skills necesitan adquirir? Visualización tipo Sankey diagram: sector vulnerable → skills puente → sector destino. **Esfuerzo:** 1+ mes | **Impacto:** Alto | **Archivos:** nuevo `src/reconversion.html`

43. **Cruce prospectiva × datos cuantitativos** — Tomar el análisis cualitativo de vulnerabilidad y cruzarlo con nuestras métricas reales: volumen de empleo, salario mediano, concentración institucional. Output: dashboard que muestre "X empleos en sector Y están en riesgo alto de automatización, con salario mediano de Z". **Esfuerzo:** 1-2 semanas | **Impacto:** Muy Alto | **Archivos:** `scripts/processors/`, `src/treemap.html`

---

## 🛠️ Infraestructura Técnica

El visualizador hoy es una aplicación de una sola página. Este segmento lo convierte en una plataforma: con una API que otros desarrolladores puedan consultar, un portal de descarga de datos, y un dashboard que muestra la salud del pipeline en tiempo real. La infraestructura técnica correcta multiplica el impacto de todo lo demás.

38. **API pública REST** — Vercel Functions sirviendo endpoints: `/api/sectores`, `/api/ocupaciones`, `/api/salarios`. Para que otros desarrolladores construyan sobre nuestros datos. Inspirado en Nomis UK. **Esfuerzo:** 1-2 semanas | **Impacto:** Alto | **Archivos:** nuevo directorio `api/`

39. **Página de datos abiertos** — "Datos para investigadores" — descargar normalized.json como CSV/JSON. Portal estilo Canada Open Data. **Esfuerzo:** 1-3 días | **Impacto:** Alto | **Archivos:** nuevo `src/datos-abiertos.html`

40. **Dashboard de calidad de datos** — Estado visual de cada fuente de datos: última actualización, conteo de registros, % cobertura, problemas conocidos. Inspirado en el framework de calidad de ILOSTAT. **Esfuerzo:** 1-2 semanas | **Impacto:** Medio | **Archivos:** nuevo `src/data-quality.html`

---

## ¿Cómo empezar?

1. Elige una contribución que te interese
2. Abre un issue en [GitHub](https://github.com/Sanba-Development/rd-job-visualizer/issues) con el número de la contribución (ej: "Contribución #9: Tabla de equivalencia ISCO-08")
3. Lee [CONTRIBUTING.md](CONTRIBUTING.md) para las reglas del repo
4. Crea un branch `feat/contribucion-N` y trabaja
5. PR a `master` cuando esté listo

## Inspiración y Referencias

- [Karpathy US Job Market Visualizer](https://karpathy.ai/jobs/) — Treemap con 4 capas de color
- [BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/) — Base de datos de 800+ ocupaciones
- [O*NET OnLine](https://www.onetonline.org/) — Skills, tasks, y abilities por ocupación
- [IDB Better Jobs Index](https://mejorestrabajos.iadb.org/) — Comparación regional LAC
- [ESCO European Skills](https://esco.ec.europa.eu/) — 3,039 ocupaciones + 13,939 skills en español
- [Nomis UK](https://www.nomisweb.co.uk/) — API REST de datos laborales
- [Canada Job Bank](https://www.jobbank.gc.ca/) — Portal de empleo con datos abiertos
- [The Work Number (Equifax)](https://theworknumber.com/) — Modelo de verificación laboral
- [Data México](https://www.economia.gob.mx/datamexico/) — Portal de datos más sofisticado de LAC
- [ILOSTAT](https://ilostat.ilo.org/) — Estadísticas laborales globales
- [World Bank RD Jobs Diagnostic (2021)](https://documents1.worldbank.org/curated/en/820141619770918898/) — Diagnóstico del mercado laboral RD
- [The Intelligence Transition (iBIZAi / CEMI.ai)](https://ibizai.io/es/explore/opinions/the-intelligence-transition/) — Análisis de impacto de IA en sectores económicos

---

*Este documento es un recurso vivo. Si tienes una idea que no está aquí, agrégala vía PR.*
