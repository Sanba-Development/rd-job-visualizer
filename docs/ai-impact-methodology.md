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

**Horizontes temporales:**
- Corto plazo (2026-2028): S × 0.3 — Solo adoptadores tempranos (MNCs, grandes empresas formales)
- Mediano plazo (2028-2032): S × 0.6 — Adopción se extiende al mercado medio
- Largo plazo (2032+): S × 0.9 — Adopción generalizada incluyendo PYMEs

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

## Limitaciones del Prototipo

1. **TAF=1.0:** No se ajusta por diferencias en composición de tareas entre RD y EE.UU.
2. **Datos mixtos:** Algunos scores usan datos a nivel de ocupación; otros usan proxies sectoriales
3. **A-Score simplificado:** No incorpora infraestructura de reentrenamiento (INFOTEP), movilidad geográfica, ni factor etario
4. **Informalidad como factor indirecto:** El prototipo captura informalidad como vulnerabilidad pero no modela los efectos indirectos de la IA en mercados informales (compresión de mercado por competidores formales que adoptan IA)

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
