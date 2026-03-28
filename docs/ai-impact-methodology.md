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

**Dos dimensiones de escenario:**

El S-Score se ajusta mediante dos multiplicadores combinados: `S_mostrado = min(100, AIOE × velocidad × intensidad)`

**Velocidad de Adopción** (qué tan rápido se despliega la IA en la economía):

| Velocidad | Corto (2026-28) | Medio (2028-32) | Largo (2032+) |
|---|---|---|---|
| Lenta | ×0.30 | ×0.50 | ×0.70 |
| Promedio | ×0.50 | ×0.75 | ×0.90 |
| Rápida | ×0.70 | ×0.90 | ×1.00 |

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

## Referencias

- Felten, E. W., Raj, M. & Seamans, R. (2021). "AI Occupational Exposure Index (AIOE)." Strategic Management Journal.
- ENCFT 2025 — Banco Central de la República Dominicana
- Tanaka-Lindgren, K. (2026). "The Intelligence Transition." ibizai.io
- World Bank (2024). Policy Research Working Paper 11057
- IMF (2024). "Gen-AI: Artificial Intelligence and the Future of Work." SDN/2024/001

## Créditos

Análisis desarrollado por CEMI.ai en colaboración con Sanba Development.
Datos: Sanba Development RD Job Visualizer (262K+ registros, 12+ sectores, 13+ fuentes gubernamentales).
Artículo de referencia: ibizai.io/explore/opinions/the-intelligence-transition

"Lo que nos hace diferentes, nos hace mejores." — Carlos Miranda Levy
