# Metodología: Impacto de la IA en el Empleo Dominicano

## Resumen

Este módulo evalúa el impacto potencial de la Inteligencia Artificial en el mercado laboral dominicano a través de tres dimensiones: **Vulnerabilidad**, **Susceptibilidad a la IA** y **Adaptabilidad**. Se basa en 757K+ registros de 14+ fuentes gubernamentales dominicanas, procesados por el pipeline de Sanba Development RD Job Visualizer.

---

## Dimensiones de Evaluación

### Vulnerabilidad (V-Score, 0-100)

Mide la fragilidad estructural del trabajador — independiente de la IA. ¿Puede esta persona absorber un shock económico?

**Componentes y pesos:**

| Componente | Peso | Fuente | Descripción |
|---|---|---|---|
| Vulnerabilidad de ingreso | 35% | TSS / MAP | `max(0, 100 × (1 - salario / (1.5 × salario_min_sector)))` |
| Informalidad sectorial | 30% | ENCFT 2025 | Tasa de informalidad del sector × 100 |
| Nivel educativo (proxy) | 20% | Derivado de AIOE | AIOE < 30 → 75; 30-60 → 50; > 60 → 25 |
| Capacidad de ahorro | 15% | BCRD | `max(0, 100 × (1 - max(0, salario - 45000) / salario))`. Canasta básica familiar: RD$45,000/mes |

**Fórmula:** `V = (0.35 × ingreso) + (0.30 × informalidad) + (0.20 × educación) + (0.15 × ahorro)`

Mayor V = más vulnerable. Un conserje (salario bajo, sector con alta informalidad) tendrá V alto; un analista financiero (salario alto, sector formal) tendrá V bajo.

**Tasas de informalidad por sector (ENCFT 2025):**

| Sector | Informalidad |
|---|---|
| Construcción | 85.4% |
| Agricultura | 80.0% |
| Transporte | 70.0% |
| Comercio | 60.0% |
| Turismo y Hostelería | 55.0% |
| Otros Servicios | 54.0% |
| Manufactura y Zonas Francas | 35.0% |
| Salud | 30.0% |
| Educación | 20.0% |
| TIC | 15.0% |
| Servicios Financieros | 10.0% |
| Administración Pública | 5.0% |

### Susceptibilidad a la IA (S-Score, 0-100)

Mide qué tan expuesta está la ocupación a ser impactada por la IA.

**Base metodológica: Índice AIOE**

La base del S-Score es el **AI Occupational Exposure Index (AIOE)** de Felten, Raj & Seamans (2021), publicado en *Strategic Management Journal*, 42(12), 2195-2217. El AIOE mide, en una escala de 0 a 100, qué tan expuesta está cada ocupación a las capacidades de la IA. Fue construido cruzando 10 aplicaciones de IA (procesamiento de lenguaje, reconocimiento de imágenes, predicción, generación de contenido, entre otras) con las habilidades requeridas por cada ocupación según la base de datos O*NET del Departamento de Trabajo de EE.UU.

**Mapeo a ocupaciones dominicanas:**

Los valores AIOE se asignan a las ocupaciones dominicanas mediante coincidencia de palabras clave en los títulos de cargo de la nómina pública (MAP) y otras fuentes. El sistema normaliza los títulos (minúsculas, sin acentos) y busca coincidencias en una tabla de ~100 keywords. Cuando no hay coincidencia de keyword, se usa un promedio sectorial como fallback.

**Valores AIOE de referencia:**

| Ocupación | AIOE | Interpretación |
|---|---|---|
| Desarrollador de software | 88 | Muy alta exposición — IA generativa ya transforma la programación |
| Digitador / Data entry | 85 | Tarea altamente repetitiva y automatizable |
| Analista financiero | 85 | Análisis cuantitativo es core competency de la IA |
| Contador | 79 | Contabilidad rutinaria ya automatizada en países desarrollados |
| Abogado | 76 | Revisión de documentos y jurisprudencia impactada por LLMs |
| Recepcionista | 72 | Chatbots y asistentes virtuales reemplazan funciones de recepción |
| Secretaria | 70 | Agendas, correos y documentos impactados por asistentes IA |
| Gerente | 68 | Toma de decisiones augmentada por IA, pero liderazgo humano persiste |
| Farmacéutico | 66 | Dispensación automatizable, pero consejería clínica protegida |
| Comunicador | 65 | Generación de contenido impactada por IA generativa |
| Médico | 62 | Diagnóstico impactado, pero atención directa al paciente protegida |
| Profesor | 45 | Contenido impactado, pero rol de mentor irremplazable |
| Vendedor | 45 | E-commerce avanza, pero venta relacional persiste en RD |
| Enfermera | 38 | Cuidado directo del paciente difícilmente automatizable |
| Chofer | 28 | Vehículos autónomos lejanos en infraestructura dominicana |
| Vigilante / Seguridad | 25 | Presencia física requerida, cámaras IA complementan |
| Mecánico | 21 | Diagnóstico con IA posible, pero reparación manual persiste |
| Construcción / Albañil | 12 | Trabajo físico variable, muy difícil de automatizar |
| Conserje / Limpieza | 10 | Tareas físicas en entornos no estructurados |
| Peluquero / Estilista | 8 | Servicio personal creativo, mínima exposición a IA |

**Nota del prototipo (TAF=1.0):** Se asume paridad de tareas — es decir, que la composición de tareas de cada ocupación en RD es similar a la de EE.UU. Esta simplificación será refinada en versiones posteriores con un Factor de Ajuste de Tareas Dominicano (TAF-RD) validado por expertos locales.

**Nota sobre modelos de IA generativa (LLMs):** El AIOE fue publicado en 2021, antes de la irrupción de los grandes modelos de lenguaje (LLMs) como Claude (Anthropic), GPT-4 (OpenAI) y Gemini (Google). Estos modelos expanden significativamente la superficie de exposición más allá de lo que el AIOE originalmente midió: hoy la IA puede redactar documentos legales, generar código de software, analizar imágenes médicas, traducir en tiempo real y razonar sobre problemas complejos — capacidades que en 2021 eran teóricas. El multiplicador de **Intensidad "Fuerte" (×1.25)** captura parcialmente esta expansión, representando un escenario donde la IA supera las proyecciones originales del AIOE. Versiones futuras de este modelo podrían incorporar un índice actualizado que refleje las capacidades de los LLMs de 2025-2026.

#### Multiplicadores de Escenario

El AIOE base se ajusta mediante dos multiplicadores combinados para reflejar el escenario de adopción:

```
S_mostrado = min(100, AIOE × Velocidad[horizonte] × Intensidad)
```

**Velocidad de Adopción** — qué tan rápido se despliega la IA en la economía dominicana:

| Velocidad | Corto (2026-28) | Medio (2028-32) | Largo (2032+) | Descripción |
|---|---|---|---|---|
| Lenta | ×0.20 | ×0.35 | ×0.55 | Solo grandes MNCs y gobierno adoptan IA |
| **Promedio (defecto)** | **×0.35** | **×0.55** | **×0.75** | Adopción se extiende al mercado medio |
| Rápida | ×0.55 | ×0.75 | ×0.90 | Incentivos fiscales + infraestructura digital aceleran adopción |

Calibrados ~30% por debajo de estimaciones para economías desarrolladas para reflejar la realidad dominicana (ver sección "Factores que Impactan la Adopción de IA en RD").

**Intensidad de Adopción** — qué tan profundamente penetra la IA en cada ocupación cuando llega:

| Intensidad | Multiplicador | Descripción |
|---|---|---|
| Leve | ×0.50 | IA augmenta pero no reemplaza — humanos permanecen en el loop |
| **Moderada (defecto)** | **×1.00** | Automatización estándar según proyección AIOE |
| Fuerte | ×1.25 | IA supera expectativas — más tareas automatizadas de lo previsto (incluye efecto LLMs) |

**Ejemplos con un Contador (AIOE = 79):**

| Escenario | Cálculo | S-Score | Interpretación |
|---|---|---|---|
| Lenta + Corto + Leve (optimista) | 79 × 0.20 × 0.50 | **8** | Prácticamente sin impacto a corto plazo |
| **Promedio + Medio + Moderada (defecto)** | **79 × 0.55 × 1.00** | **43** | Impacto moderado, monitoreo recomendado |
| Rápida + Medio + Fuerte | 79 × 0.75 × 1.25 | **74** | Impacto significativo, reconversión necesaria |
| Rápida + Largo + Fuerte (pesimista) | 79 × 0.90 × 1.25 | **89** | Impacto severo, intervención urgente |

El mismo contador puede ir de "seguro" (S=8) a "crítico" (S=89) dependiendo del escenario. Esto refleja la incertidumbre real sobre el ritmo de adopción de IA en RD.

#### Matriz de Multiplicadores Efectivos Combinados

Para referencia, la matriz completa de multiplicadores efectivos (Velocidad × Intensidad):

**Leve (×0.5):**

| | Corto | Medio | Largo |
|---|---|---|---|
| Lenta | 0.10 | 0.175 | 0.275 |
| Promedio | 0.175 | 0.275 | 0.375 |
| Rápida | 0.275 | 0.375 | 0.450 |

**Moderada (×1.0):**

| | Corto | Medio | Largo |
|---|---|---|---|
| Lenta | 0.20 | 0.35 | 0.55 |
| **Promedio** | 0.35 | **0.55** | 0.75 |
| Rápida | 0.55 | 0.75 | 0.90 |

**Fuerte (×1.25):**

| | Corto | Medio | Largo |
|---|---|---|---|
| Lenta | 0.25 | 0.4375 | 0.6875 |
| Promedio | 0.4375 | 0.6875 | 0.9375 |
| Rápida | 0.6875 | 0.9375 | 1.125 |

### Adaptabilidad (A-Score, 0-100)

Mide la capacidad y viabilidad de transición a otras áreas laborales.

**Componentes simplificados (prototipo):**

| Componente | Peso | Cálculo |
|---|---|---|
| Diversidad de competencias transferibles | 50% | AIOE < 30 → 20; 30-50 → 40; 50-70 → 60; 70-85 → 70; > 85 → 55 |
| Nivel educativo (proxy) | 50% | 100 - vulnerabilidad_educativa |

**Fórmula:** `A = (0.5 × competencias) + (0.5 × educación)`

Mayor A = más adaptable. Los profesionales cognitivos (AIOE 50-85) tienen la mayor adaptabilidad porque sus habilidades son transferibles. Los muy especializados en IA (AIOE > 85) bajan ligeramente porque sus skills son más estrechos. Los trabajadores manuales (AIOE < 30) tienen la menor adaptabilidad por limitadas habilidades transferibles y menor educación.

**Nota:** El A-Score simplificado NO incorpora factores importantes como: infraestructura de reentrenamiento (INFOTEP, universidades), movilidad geográfica, factor etario, idiomas, ni acceso a programas de reconversión. Estos factores serán incorporados en versiones futuras.

---

## Clasificación de Zonas de Riesgo

La combinación de V, S y A clasifica cada ocupación en una zona de riesgo:

| Zona | Color | Criterio | Significado | Acción recomendada |
|---|---|---|---|---|
| Zona Crítica | Rojo (#DC2626) | V > 60, S > 55, A < 45 | Alta vulnerabilidad + alta exposición + baja adaptabilidad | Intervención inmediata: protección social + reconversión urgente |
| Atención Urgente | Naranja (#F97316) | V > 35, S > 55, A < 60 | Vulnerabilidad y exposición significativas | Programas de reconversión y apoyo transicional |
| Monitoreo Estratégico | Amarillo (#EAB308) | V ≤ 35, S > 55, A ≥ 55 | Expuestos pero resilientes | Upskilling progresivo, el mercado puede autocorregir |
| Oportunidad IA | Verde (#10B981) | S ≤ 40 | Baja exposición a IA | Enfoque en aprovechar IA como herramienta |
| Evaluación Contextual | Índigo (#6366F1) | Otros casos | Perfil mixto que no encaja en las categorías anteriores | Análisis caso por caso |

**Nota sobre colores:** Atención Urgente (naranja) y Monitoreo Estratégico (amarillo) usan tonos diferenciados para facilitar la distinción visual. Evaluación Contextual usa índigo para evitar confusión con las zonas de advertencia.

---

## Datos y Pipeline

### Fuentes de Datos (757K+ registros)

| Fuente | Registros | Tipo | Campos clave |
|---|---|---|---|
| MAP Nómina Pública (Dic 2025) | 493,554 | Individual | Cargo, institución, salario bruto, género |
| CKAN Nóminas gubernamentales | 261,253 | Individual | Cargo, salario bruto/neto, período |
| MISPAS Profesionales de Salud | 903 | Individual | Profesión, exequátur |
| TSS Empleos Cotizantes | 816 | Agregado | Sector, conteo empleos |
| MIVHED Licencias Construcción | 479 | Individual | Tipo licencia, monto |
| RD Trabaja Vacantes | 256 | Vacante | Título, empresa, sector |
| MITUR Empresas Turísticas | 175 | Registro | Tipo empresa, ubicación |
| CNZFE Zonas Francas | 126 | Agregado | Sector, conteo empleos |

### Mapeo de Instituciones a Sectores

Los 493K registros de MAP se mapean a los 12 sectores económicos mediante:

1. **Coincidencia exacta** — tabla de ~30 instituciones principales mapeadas manualmente (ej: "Ministerio de Educación" → Educación, "Servicio Nacional de Salud" → Salud)
2. **Coincidencia por keywords** — si la institución contiene "salud", "hospital", "sanitari" → Salud; "educación", "universidad" → Educación; etc.
3. **Fallback** — instituciones no mapeadas se asignan a Administración Pública y Defensa

### Umbral de Representatividad Salarial (≥500 registros)

Sectores con menos de 500 registros utilizan proxies salariales (estimaciones basadas en ENCFT/TSS) en lugar de sus promedios reales, ya que muestras pequeñas no son representativas del sector completo.

**Proxies salariales por sector:**

| Sector | Proxy (RD$/mes) | Justificación |
|---|---|---|
| Servicios Financieros | 55,000 | Estimación ENCFT para sector bancario/financiero |
| TIC | 45,000 | Estimación basada en mercado tech dominicano |
| Salud | 35,000 | Promedio entre médicos y personal de apoyo |
| Educación | 28,000 | Promedio MINERD para docentes |
| Otros Servicios | 25,000 | Promedio general sector servicios |
| Manufactura y ZF | 22,000 | Salarios zona franca + manufactura local |
| Comercio | 22,000 | Retail formal + distribución |
| Administración Pública | 32,000 | Promedio nómina gubernamental |
| Transporte | 20,000 | Choferes + logística |
| Turismo | 20,000 | Personal hotelero + restaurantes |
| Construcción | 18,000 | Obreros + técnicos |
| Agricultura | 15,000 | Trabajadores agrícolas + agroindustria |

Sectores con ≥500 registros usan su promedio real calculado del pipeline. Con la incorporación de la nómina MAP (493K registros), 10 de 12 sectores ahora superan el umbral y usan datos reales.

---

## Agregación de Rankings

Los rankings Top 10 agregan ocupaciones con el mismo título que aparecen en múltiples sectores. Los scores V/S/A se calculan como promedios ponderados por cantidad de trabajadores.

**Ejemplo:** "conserje" aparece en 8+ sectores con diferentes salarios y niveles de informalidad. El ranking muestra una sola entrada con el promedio ponderado de todos los sectores donde existe esa ocupación.

**Normalización de variantes de género:** Ocupaciones como "supervisor (a)" y "supervisor", o "encargado(a)" y "encargado", se consolidan en una sola entrada. Esta convención "(a)" es común en la nómina pública dominicana para indicar que el cargo aplica a ambos géneros. La normalización elimina el sufijo `(a)` con o sin espacios antes de agregar.

**Paginación:** Los rankings muestran 10 entradas por página con navegación "Siguientes" / "Anteriores" para explorar más allá del top 10.

**Seis listas de ranking:**

| Lista | Ordenada por | Dirección |
|---|---|---|
| Top 10 Más Vulnerables | V + S - A (riesgo compuesto) | Descendente |
| Top 10 Menos Vulnerables | V + S - A | Ascendente |
| Top 10 Más Susceptibles a la IA | S-Score | Descendente |
| Top 10 Menos Susceptibles a la IA | S-Score | Ascendente |
| Top 10 con Mayor Adaptabilidad | A-Score | Descendente |
| Top 10 con Menor Adaptabilidad | A-Score | Ascendente |

---

## Comparación Radar por Sector

El radar chart compara sectores en 5 dimensiones:

| Dimensión | Fuente | Descripción |
|---|---|---|
| Vulnerabilidad | Calculada (V-Score) | Fragilidad económica del sector. Mayor = más frágil. |
| Susceptibilidad a IA | Calculada (S-Score) | Exposición a automatización. Mayor = más expuesto. Responde a controles de escenario. |
| Adaptabilidad | Calculada (A-Score) | Capacidad de transición laboral. Mayor = más adaptable. |
| Nivel Salarial | metrics.json / proxy | Salario promedio como % del sector mejor pagado. 100 = máximo. |
| Formalidad | ENCFT 2025 | % de empleo formal. Mayor = más formalizado. |

Se pueden seleccionar múltiples sectores para comparación simultánea. La dimensión Susceptibilidad a la IA responde a los controles de horizonte temporal, velocidad e intensidad de adopción.

---

## Factores que Impactan la Adopción de Inteligencia Artificial en República Dominicana

Los multiplicadores de velocidad e intensidad de este modelo están calibrados para el contexto dominicano. A continuación se documentan los factores estructurales que justifican estos ajustes.

### Factores que Retardan la Adopción de IA (reducen el multiplicador efectivo)

**1. Alta informalidad laboral (54% promedio nacional)**
La ENCFT 2025 del Banco Central estima que más de la mitad de la fuerza laboral dominicana opera en el sector informal — sin contratos, seguridad social ni acceso a tecnología empresarial. Sectores como Construcción (85.4%), Agricultura (80%) y Transporte (70%) tienen informalidad que hace prácticamente imposible la adopción de herramientas de IA en el corto y mediano plazo. La economía de colmados, vendedores ambulantes y servicios domésticos funciona fuera del alcance de la automatización digital.

**2. Bajo costo de la mano de obra**
El salario mínimo del sector privado no sectorizado es de ~RD$12,900/mes (~US$220). A estos niveles, el costo de reemplazar un trabajador con IA (licencias de software, infraestructura, integración) supera el costo del empleado. Esto elimina el incentivo económico para automatizar en la mayoría de PYMEs dominicanas, especialmente fuera de Santo Domingo.

**3. Brechas de infraestructura digital**
Según la ENIA (Estrategia Nacional de Inteligencia Artificial, 2024), la penetración de internet fijo en hogares dominicanos es de ~47%, con marcada disparidad entre zonas urbanas (~65%) y rurales (~25%). La conectividad empresarial fuera del Gran Santo Domingo y Santiago es insuficiente para soportar herramientas de IA en la nube. Los apagones eléctricos frecuentes en zonas rurales agravan esta limitación.

**4. Sector público como mayor empleador y más lento adoptador**
Con 493K+ empleados (nómina MAP diciembre 2025), el gobierno dominicano es el mayor empleador del país. La burocracia estatal, los ciclos presupuestarios plurianuales y los procesos de compras públicas retardan significativamente la adopción tecnológica. Ministerios clave como Educación (263K empleados) y Salud (96K) operan con sistemas legados que tomarán años en modernizar.

**5. Limitaciones del sistema de formación técnica**
INFOTEP, el principal instituto de formación técnico-profesional, tiene una oferta limitada de programas relacionados con IA y habilidades digitales avanzadas. La reconversión laboral a escala — necesaria para que trabajadores desplazados por IA transicionen a nuevas ocupaciones — requiere una infraestructura de capacitación que aún no existe a la escala requerida.

**6. Estructura empresarial de micro y pequeña empresa**
El 98.1% de las empresas dominicanas son MiPyMEs (MICM, 2024). La mayoría opera con márgenes reducidos, sin departamentos de TI y sin acceso a financiamiento para inversión tecnológica. La adopción de IA en este segmento será marginal hasta que existan soluciones asequibles y preconfiguradas para el mercado dominicano.

**7. Barreras lingüísticas y culturales**
La mayoría de herramientas de IA empresarial están diseñadas para mercados anglófonos. El procesamiento de lenguaje natural en español dominicano (con sus modismos, regionalismos y variaciones) es menos preciso que en inglés estándar. Esto limita la efectividad de chatbots, asistentes de voz y herramientas de análisis de texto en el contexto local.

**8. Resistencia institucional y laboral**
Los sindicatos del sector público, los colegios profesionales (médicos, abogados, contadores) y la cultura organizacional dominicana tienden a resistir cambios tecnológicos disruptivos. La percepción de la IA como amenaza laboral — especialmente en un país con memoria reciente de reformas que afectaron empleados públicos — genera resistencia política a la automatización.

### Factores que Aceleran la Adopción de IA (aumentan el multiplicador efectivo)

**1. Zonas francas y presencia de multinacionales**
Las 80+ zonas francas dominicanas emplean ~180,000 trabajadores y operan bajo estándares de sus casas matrices globales. Empresas como Hanes, Grupo M, Cardinal Health y 3M implementan automatización al ritmo global, no al dominicano. Los BPOs (Business Process Outsourcing) en zonas francas — call centers, procesamiento de datos, back-office — son de los primeros sectores impactados por IA generativa a nivel mundial.

**2. Sector financiero avanzado**
La banca dominicana (Banreservas, Popular, BHD León) ya despliega chatbots de atención al cliente, scoring crediticio con IA, detección de fraude automatizada y robo-advisors básicos. La Superintendencia de Bancos ha mostrado apertura regulatoria a la innovación fintech. Este sector adoptará IA a velocidad comparable a mercados desarrollados.

**3. Dependencia de remesas y presión diasporiana**
Las remesas representan ~10% del PIB dominicano (~US$10,600M en 2024). La diáspora dominicana en EE.UU. (2M+) está expuesta a la transformación laboral por IA en el mercado norteamericano. Esta presión se transmite a RD a través de: reducción potencial de remesas si los trabajadores de la diáspora son desplazados, transferencia de expectativas tecnológicas, e inversión de retornados con mentalidad digital.

**4. Población joven y digitalmente conectada**
La edad mediana dominicana es ~28 años. La penetración de smartphones supera el 70% y las redes sociales tienen adopción masiva. La generación que ingresa al mercado laboral es digitalmente nativa y más receptiva a herramientas de IA que las generaciones anteriores. Plataformas como WhatsApp Business ya se usan extensivamente en el comercio informal.

**5. Turismo como vector de modernización**
Con ~10M de turistas anuales y el turismo representando ~15% del PIB, las cadenas hoteleras internacionales (Marriott, Hilton, Meliá) implementan IA para revenue management, personalización de experiencias y operaciones. Esta modernización se difunde gradualmente al ecosistema turístico local.

**6. Ausencia de regulación de IA**
A diferencia de la UE (AI Act) o incluso de algunos países latinoamericanos, RD no tiene marco regulatorio específico para IA. Esto elimina barreras legales para el despliegue, aunque también deja a los trabajadores sin protecciones específicas ante el desplazamiento.

**7. Estrategia Nacional de IA (ENIA)**
La ENIA, coordinada con apoyo de BID y UNESCO, establece un marco de política pública para la adopción de IA. Aunque aún en fase inicial, señaliza la intención gubernamental de promover la IA, lo que podría acelerar la adopción en el sector público a mediano plazo.

**8. Competencia regional**
Costa Rica, Panamá y Colombia avanzan agresivamente en adopción de IA, compitiendo por las mismas inversiones en nearshoring y servicios digitales. La presión competitiva regional puede forzar una adopción más rápida en RD para mantener su posición como destino de inversión en la cuenca del Caribe.

**9. Costos decrecientes de IA como servicio**
Los modelos de IA como servicio (ChatGPT, Claude, Gemini) y sus APIs tienen costos que disminuyen ~50% anualmente. Lo que hoy cuesta US$50/mes por usuario estará disponible a US$5/mes en 3-5 años, haciendo la IA accesible incluso para PYMEs dominicanas con márgenes reducidos.

**10. Efecto demostración del sector privado formal**
A medida que empresas formales grandes adoptan IA y reportan ganancias de productividad, el efecto demostración presiona a competidores y proveedores a seguir. Este efecto cascada es especialmente potente en mercados pequeños y concentrados como el dominicano, donde pocas empresas dominan cada sector.

### Calibración del Modelo para RD

Basado en estos factores, los multiplicadores de velocidad están calibrados ~30% por debajo de las estimaciones para economías desarrolladas:

- **Escenario por defecto** (Promedio + Medio + Moderada): **×0.55** — reconoce que RD adoptará IA más lentamente que EE.UU./Europa, pero que el sector formal y las MNCs aceleran el proceso.
- **Escenario pesimista máximo** (Rápida + Largo + Fuerte): **×1.125** — representa un futuro donde los factores aceleradores dominan y RD converge con tasas de adopción regionales.
- **Escenario optimista máximo** (Lenta + Corto + Leve): **×0.10** — representa que la informalidad, el bajo costo laboral y las brechas de infraestructura limitan severamente el impacto a corto plazo.

---

## Niveles de Confianza de los Datos

Siguiendo la recomendación de la revisión metodológica (AI-Workforce-Impact-DR-Methodology-Review.md), los scores se clasifican en tres niveles de confianza:

| Nivel | Criterio | Margen de error | Ejemplo |
|---|---|---|---|
| **Tier 1** (Alta) | Datos a nivel de ocupación con salario real y ≥500 registros | ±5 puntos | Conserje en Admin. Pública (11,506 registros, salario MAP) |
| **Tier 2** (Moderada) | AIOE por keyword match + salario sectorial promedio | ±10 puntos | Secretaria en Educación (keyword match, salario promedio del sector) |
| **Tier 3** (Estimada) | AIOE por defecto sectorial + proxy salarial | ±15-20 puntos | Ocupaciones en TIC (2 registros, proxy salarial, AIOE sectorial) |

En el prototipo actual, la mayoría de ocupaciones son Tier 2 (keyword match con salario sectorial). Las ocupaciones de los 4 sectores con >10,000 registros (Admin. Pública, Educación, Salud, Agricultura) se aproximan a Tier 1 gracias a la nómina MAP.

---

## La Paradoja de la Informalidad

Un hallazgo contra-intuitivo del modelo: los trabajadores más vulnerables económicamente (Construcción con 85.4% informalidad, Agricultura con 80%) tienen los scores más bajos de Susceptibilidad a la IA. Esto crea la **Paradoja de la Informalidad**:

- **Impacto directo bajo**: Las tareas manuales (albañilería, agricultura, servicio doméstico) son difícilmente automatizables.
- **Impacto indirecto potencialmente alto**: A medida que el sector formal adopta IA y gana productividad, puede comprimir los mercados donde compiten trabajadores informales:
  - Supermercados con self-checkout vs. colmados
  - E-commerce con logística IA vs. vendedores ambulantes
  - Aplicaciones de transporte vs. motoconchistas
  - Cadenas hoteleras con IA vs. operadores turísticos informales

Este impacto indirecto NO está modelado en el prototipo actual. Es un área crítica para investigación futura y una razón por la que los scores de Vulnerabilidad (V) pueden subestimar el riesgo real para estos trabajadores.

---

## Dimensión de Género

Los datos de la nómina MAP (diciembre 2025) revelan una distribución de género significativa:

- **Femenino**: 329,509 (66.8%)
- **Masculino**: 164,045 (33.2%)

Las ocupaciones con mayor representación femenina en el sector público dominicano — maestras, enfermeras, secretarias, auxiliares administrativas — tienen un perfil de riesgo mixto:

- **Secretarias/Auxiliares administrativas** (AIOE 65-70): Alta susceptibilidad a la IA, moderada adaptabilidad. Zona de Atención Urgente en escenarios medios.
- **Maestras** (AIOE 45): Susceptibilidad moderada, alta adaptabilidad por habilidades transferibles. Zona de Monitoreo.
- **Enfermeras** (AIOE 38): Baja susceptibilidad, cuidado directo protegido. Zona de Oportunidad IA.

La literatura internacional (IMF 2024, World Bank 2024) confirma que las mujeres en roles administrativos y de servicios enfrentan mayor exposición a la IA generativa que los hombres en roles manuales. En RD, esto tiene implicaciones directas: los ~263K empleados del Ministerio de Educación (mayoría mujeres) requieren estrategias de adaptación diferenciadas.

Un análisis género-desagregado completo requiere acceso a ENCFT microdata, lo cual está fuera del alcance del prototipo actual.

---

## BPO / Call Centers como Micro-Sector de Riesgo Concentrado

Los Business Process Outsourcing (BPO) y call centers en zonas francas representan un caso de riesgo concentrado que merece atención especial:

- **~30,000 empleos directos** en call centers y BPOs de zonas francas
- **AIOE = 82** (entre los más altos de cualquier ocupación)
- **Adopción a ritmo global**: las casas matrices (no las subsidiarias dominicanas) deciden cuándo desplegar IA
- **IA generativa como amenaza existencial**: chatbots multilingües, sistemas de atención automatizada y voice AI ya reemplazan funciones de call center a nivel mundial
- **Demografía vulnerable**: empleados jóvenes (18-30), primer empleo formal, concentrados geográficamente en Santo Domingo y Santiago

En el escenario por defecto (Promedio + Medio + Moderada), operadores de call center obtienen S=45. Pero en el escenario Rápida + Medio + Fuerte (plausible dado que las MNCs aceleran la adopción), el score sube a S=62 — Zona de Atención Urgente.

Este micro-sector debería ser objeto de políticas de reconversión proactivas, no reactivas.

---

## Hoja de Ruta: Fases Futuras

Este prototipo corresponde a la **Fase 1** de un marco de análisis de 5 fases propuesto en la revisión metodológica:

| Fase | Descripción | Estado |
|---|---|---|
| **Fase 0**: Fundamentos de Datos | Pipeline de datos, normalización, taxonomía sectorial | ✅ Completada (757K registros) |
| **Fase 1**: Evaluación de Impacto | Scoring V/S/A, clasificación de zonas, visualización interactiva | ✅ Prototipo completado |
| **Fase 2**: Overlays Estructurales | Factor de Ajuste de Tareas Dominicano (TAF-RD), análisis de informalidad indirecta, dimensión de género | ⬜ Pendiente |
| **Fase 3**: Escenarios y Temporalidad | Panel Delphi de expertos, escenarios calibrados, proyecciones temporales validadas | ⬜ Pendiente |
| **Fase 4**: Política Pública | Recomendaciones sectoriales, programas de reconversión, integración con INFOTEP/MINERD | ⬜ Pendiente |
| **Fase 5**: Monitoreo Continuo | Dashboard en tiempo real, alertas sectoriales, actualización periódica de scores | ⬜ Pendiente |

### Mejoras Prioritarias para Fase 2

1. **TAF-RD (Factor de Ajuste de Tareas Dominicano)**: Validación mediante panel Delphi de 5-10 líderes empresariales dominicanos. El instrumento Delphi ya está diseñado (ver AI-Workforce-DR-Working-Tools.md).
2. **Clasificación ISCO-08**: Concordancia formal entre títulos de cargo dominicanos y la Clasificación Internacional Uniforme de Ocupaciones, permitiendo comparaciones internacionales.
3. **A-Score ampliado**: Incorporar capacidad de INFOTEP por sector, dominio de inglés, factor etario (cohorte 18-30 más adaptable), y factor de movilidad geográfica (migración a SDQ/STI).
4. **Modelo de informalidad indirecta**: Simular el efecto de compresión de mercado cuando competidores formales adoptan IA.
5. **Acceso a ENCFT microdata**: Datos a nivel de hogar del Banco Central permitirían scoring Tier 1 para todas las ocupaciones.

---

## Limitaciones del Prototipo

1. **TAF=1.0:** No se ajusta por diferencias en composición de tareas entre RD y EE.UU. Un maestro dominicano y uno estadounidense hacen tareas diferentes, pero reciben el mismo AIOE.
2. **AIOE pre-LLMs:** El índice base es de 2021, anterior a ChatGPT/Claude/Gemini. La Intensidad "Fuerte" (×1.25) compensa parcialmente.
3. **Datos mixtos:** Algunos scores usan datos a nivel de ocupación (títulos de cargo); otros usan proxies sectoriales cuando no hay coincidencia de keywords.
4. **Umbral de 500 registros:** Sectores pequeños (Manufactura: 131 registros, TIC: 2) usan proxies salariales que pueden no reflejar la realidad.
5. **A-Score simplificado:** No incorpora infraestructura de reentrenamiento (INFOTEP), movilidad geográfica, factor etario, idiomas, ni acceso a programas de reconversión.
6. **Informalidad indirecta no modelada:** El prototipo captura informalidad como vulnerabilidad pero no modela los efectos indirectos de la IA en mercados informales (compresión de mercado por competidores formales que adoptan IA). Ver sección "La Paradoja de la Informalidad".
7. **Keyword matching:** La asignación de AIOE por coincidencia de palabras clave es imprecisa — "auxiliar administrativo" recibe un score diferente a "asistente de oficina" aunque son funciones similares. Una concordancia formal ISCO-08 resolvería esto.
8. **Sector público dominante:** 493K de 757K registros son del sector público (MAP). El análisis está sesgado hacia ocupaciones gubernamentales y subrepresenta al sector privado formal e informal.
9. **Sin panel de validación:** Los scores no han sido validados por expertos dominicanos. Un panel Delphi (diseñado en AI-Workforce-DR-Working-Tools.md) es necesario para calibrar el TAF-RD.
10. **Dimensión de género incompleta:** Datos de género disponibles solo para MAP (67% F / 33% M). Un análisis diferenciado completo requiere ENCFT microdata.

---

## Referencias

- Felten, E. W., Raj, M. & Seamans, R. (2021). "Occupational, industry, and geographic exposure to artificial intelligence: A novel dataset and its potential uses." *Strategic Management Journal*, 42(12), 2195-2217.
- ENCFT 2025 — Banco Central de la República Dominicana. Encuesta Nacional Continua de Fuerza de Trabajo.
- MAP (2025) — Ministerio de Administración Pública. Nómina Pública Diciembre 2025.
- ENIA (2024) — Estrategia Nacional de Inteligencia Artificial de la República Dominicana. Con apoyo de BID y UNESCO.
- MICM (2024) — Ministerio de Industria, Comercio y MiPyMEs. Registro empresarial.
- TSS — Tesorería de la Seguridad Social. Empleos y empleadores cotizantes.
- CNZFE — Consejo Nacional de Zonas Francas de Exportación. Estadísticas sectoriales.
- Tanaka-Lindgren, K. (2026). "The Intelligence Transition." ibizai.io
- World Bank (2024). Policy Research Working Paper 11057. "The Impact of AI on Labor Markets."
- IMF (2024). "Gen-AI: Artificial Intelligence and the Future of Work." Staff Discussion Note SDN/2024/001.

---

## Créditos

Análisis desarrollado por **Carlos Miranda Levy** ([thesocialentrepreneur.com](https://thesocialentrepreneur.com)) / **CEMI.ai** (Collectively Enhanced Multiple Intelligence) en colaboración con **Sanba Development**.

Datos: Sanba Development RD Job Visualizer (757K+ registros, 12 sectores, 14+ fuentes gubernamentales).

Artículo de referencia: [The Intelligence Transition](https://ibizai.io/explore/opinions/the-intelligence-transition) — ibizai.io

> "Lo que nos hace diferentes, nos hace mejores." — Carlos Miranda Levy
