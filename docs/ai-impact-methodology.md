# Metodología: Impacto de la IA en el Empleo Dominicano

## Resumen

Este módulo evalúa el impacto potencial de la Inteligencia Artificial en el mercado
laboral dominicano a través de tres dimensiones:

### Vulnerabilidad (V-Score)
Mide la fragilidad estructural del trabajador — independiente de la IA.
¿Puede esta persona absorber un shock económico?

**Componentes:**
- Proximidad salarial al salario mínimo (35%)
- Tasa de informalidad del sector (30%)
- Nivel educativo / cualificación (20%)
- Capacidad de ahorro vs. canasta básica (15%)

**Fuentes:** TSS, ENCFT 2025, BCRD

### Susceptibilidad a IA (S-Score)
Mide qué tan expuesta está la ocupación a ser impactada por la IA.

**Base metodológica:** AI Occupational Exposure Index (AIOE) de Felten, Raj &
Seamans (2021), mapeado a clasificaciones ISCO-08 y adaptado a las categorías
ocupacionales dominicanas.

**Nota del prototipo:** Se asume paridad de tareas (TAF=1.0) — es decir, que la
composición de tareas de cada ocupación en RD es similar a la de EE.UU. Esta
simplificación será refinada en versiones posteriores con un Factor de Ajuste de
Tareas Dominicano (TAF-RD) validado por expertos locales.

**Nota sobre modelos de IA generativa (LLMs):** El AIOE fue publicado en 2021, antes de la irrupción de los grandes modelos de lenguaje (LLMs) como Claude (Anthropic), GPT-4 (OpenAI) y Gemini (Google). Estos modelos expanden significativamente la superficie de exposición más allá de lo que el AIOE originalmente midió: hoy la IA puede redactar documentos legales, generar código de software, analizar imágenes médicas, traducir en tiempo real y razonar sobre problemas complejos — capacidades que en 2021 eran teóricas. El multiplicador de **Intensidad "Fuerte" (×1.25)** captura parcialmente esta expansión, representando un escenario donde la IA supera las proyecciones originales del AIOE. Versiones futuras de este modelo podrían incorporar un índice actualizado que refleje las capacidades de los LLMs de 2025-2026.

**Dos dimensiones de escenario:**

El S-Score se ajusta mediante dos multiplicadores combinados: `S_mostrado = min(100, AIOE × velocidad × intensidad)`

**Velocidad de Adopción** (qué tan rápido se despliega la IA en la economía):

| Velocidad | Corto (2026-28) | Medio (2028-32) | Largo (2032+) |
|---|---|---|---|
| Lenta | ×0.20 | ×0.35 | ×0.55 |
| Promedio | ×0.35 | ×0.55 | ×0.75 |
| Rápida | ×0.55 | ×0.75 | ×0.90 |

**Intensidad de Adopción** (qué tan profundamente penetra la IA en cada ocupación):
- Leve (×0.5): IA augmenta pero no reemplaza — humanos permanecen en el loop
- Moderada (×1.0): Automatización estándar según proyección AIOE
- Fuerte (×1.25): IA supera expectativas — más tareas automatizadas de lo previsto

### Adaptabilidad (A-Score)
Mide la capacidad y viabilidad de transición a otras áreas laborales.

**Componentes simplificados (prototipo):**
- Diversidad de competencias transferibles (50%)
- Nivel educativo como proxy de capacidad de reconversión (50%)

### Matriz de Riesgo Compuesto

| Zona | Color | Criterio | Significado |
|---|---|---|---|
| Zona Crítica | Rojo | V>60, S>55, A<45 | Prioridad inmediata: alta vulnerabilidad + alta exposición a IA + baja adaptabilidad |
| Atención Urgente | Naranja | V>35, S>55, A<60 | Requiere programas de reconversión y apoyo transicional |
| Monitoreo Estratégico | Amarillo | V≤35, S>55, A≥55 | Expuestos pero resilientes — el mercado puede autocorregir |
| Oportunidad IA | Verde | S≤40 | Baja exposición a IA — enfoque en aprovechar beneficios |

## Agregación de Rankings

Los rankings Top 10 agregan ocupaciones con el mismo título que aparecen en múltiples sectores. Los scores V/S/A se calculan como promedios ponderados por cantidad de trabajadores. Por ejemplo, "conserje" aparece en 8+ sectores; el ranking muestra una sola entrada con el promedio ponderado de todos los sectores donde existe esa ocupación.

Adicionalmente, se normalizan variantes de género en los títulos: ocupaciones como "supervisor (a)" y "supervisor", o "encargado(a)" y "encargado", se consolidan en una sola entrada. Esta convención "(a)" es común en la nómina pública dominicana para indicar que el cargo aplica a ambos géneros.

Esto proporciona una visión consolidada del perfil de riesgo de cada ocupación a nivel nacional.

## Limitaciones del Prototipo

1. **TAF=1.0:** No se ajusta por diferencias en composición de tareas entre RD y EE.UU.
2. **Datos mixtos:** Algunos scores usan datos a nivel de ocupación; otros usan proxies sectoriales
3. **Umbral de representatividad salarial (≥500 registros):** Sectores con menos de 500 registros utilizan proxies salariales (estimaciones basadas en ENCFT/TSS) en lugar de sus promedios reales, ya que muestras pequeñas no son representativas del sector completo. Esto evita distorsiones como datos de CNZFE (68 registros) o INESDYC que no reflejan el espectro salarial completo del sector.
4. **A-Score simplificado:** No incorpora infraestructura de reentrenamiento (INFOTEP), movilidad geográfica, ni factor etario
5. **Informalidad como factor indirecto:** El prototipo captura informalidad como vulnerabilidad pero no modela los efectos indirectos de la IA en mercados informales (compresión de mercado por competidores formales que adoptan IA)

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

## Referencias

- Felten, E. W., Raj, M. & Seamans, R. (2021). "AI Occupational Exposure Index (AIOE)." Strategic Management Journal.
- ENCFT 2025 — Banco Central de la República Dominicana
- Tanaka-Lindgren, K. (2026). "The Intelligence Transition." ibizai.io
- World Bank (2024). Policy Research Working Paper 11057
- IMF (2024). "Gen-AI: Artificial Intelligence and the Future of Work." SDN/2024/001

## Créditos

Análisis desarrollado por CEMI.ai en colaboración con Sanba Development.
Datos: Sanba Development RD Job Visualizer (757K+ registros, 12+ sectores, 14+ fuentes gubernamentales).
Artículo de referencia: ibizai.io/explore/opinions/the-intelligence-transition

"Lo que nos hace diferentes, nos hace mejores." — Carlos Miranda Levy
