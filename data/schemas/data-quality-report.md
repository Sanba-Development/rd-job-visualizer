# Reporte de Calidad de Datos — RD Job Visualizer

> Generado: 26 de marzo de 2026
> Basado en: `data/processed/summary.json`, `data/processed/normalized.json`, fuentes oficiales TSS y Hacienda

---

## 1. Comparación con Empleo Formal (TSS)

### Datos oficiales TSS (última lectura disponible: enero 2026)

| Categoría | Empleos Cotizantes |
|-----------|-------------------|
| Empresa Privada | 1,756,725 |
| Pública Centralizada | 409,177 |
| Pública Descentralizada | 353,078 |
| **Total empleo formal** | **2,518,980** |

Fuente: `data/raw/empleos-cotizantes-tss-2003-2026.csv`, fila enero 2026.

### Comparación con nuestros datos

| Métrica | Valor |
|---------|-------|
| Nuestro total de registros | 262,410 |
| Empleo formal total (TSS ene-2026) | 2,518,980 |
| **Cobertura** | **10.4%** |

### Interpretación

- Nuestros 262,410 registros representan aproximadamente el **10.4%** del empleo formal en RD.
- La mayoría (261,296 registros, 99.6%) provienen de nóminas CKAN de solo 7 instituciones gubernamentales.
- Los datos TSS muestran ~1.76M empleos privados formales; nuestro dataset solo tiene 256 vacantes de RD Trabaja del sector privado (y estas tienen un bug que impide su normalización completa).
- **Conclusión**: Nuestro dataset cubre una fracción pequeña del empleo formal, concentrada casi exclusivamente en el sector público.

### Tendencia histórica TSS (empleo formal total)

| Año | Empleo formal (diciembre) | Crecimiento |
|-----|--------------------------|-------------|
| 2003 | 572,465 | — |
| 2010 | 1,265,905 | +121% |
| 2015 | 1,708,749 | +35% |
| 2019 | 2,150,517 | +26% |
| 2020 | 1,948,293 | -9.4% (COVID) |
| 2022 | 2,345,647 | +20% (recuperación) |
| 2024 | 2,450,093 | +4.5% |
| 2025 (dic) | 2,531,099 | +3.3% |
| 2026 (ene) | 2,518,980 | (parcial) |

El empleo formal creció de ~570K en 2003 a ~2.5M en 2026, con una caída notable por COVID en abril 2020 (bajó a 1,613,083 — pérdida de ~540K empleos formales en un mes).

---

## 2. Distribución Sectorial — ¿Tiene Sentido?

### Nuestra distribución actual

| Sector | Registros | % del Total |
|--------|-----------|-------------|
| Administración Pública y Defensa | 250,755 | 95.6% |
| Otros Servicios | 6,786 | 2.6% |
| Educación | 3,916 | 1.5% |
| Agricultura y Agroindustria | 800 | 0.3% |
| Manufactura y Zonas Francas | 68 | 0.03% |
| Comercio | 37 | 0.01% |
| Turismo y Hostelería | 24 | 0.01% |
| Salud | 8 | <0.01% |
| Construcción | 8 | <0.01% |
| Servicios Financieros | 4 | <0.01% |
| Tecnología y Telecomunicaciones | 2 | <0.01% |
| Transporte y Logística | 2 | <0.01% |

### Distribución real conocida del PIB y empleo en RD

Según estimaciones del Banco Central (ENCFT) y fuentes internacionales, la estructura aproximada del empleo es:

| Sector | % real (aprox.) | Nuestro % | Desviación |
|--------|----------------|-----------|------------|
| Comercio | ~20% | 0.01% | **Masivamente sub-representado** |
| Servicios (turismo, financiero, otros) | ~25% | 2.6% | **Sub-representado** |
| Administración Pública | ~10-15% | 95.6% | **Masivamente sobre-representado** |
| Agricultura | ~9% | 0.3% | **Sub-representado** |
| Manufactura/ZF | ~10% | 0.03% | **Sub-representado** |
| Construcción | ~7% | <0.01% | **Sub-representado** |
| Educación | ~5% | 1.5% | Sub-representado |
| Salud | ~4% | <0.01% | **Sub-representado** |
| Tecnología | ~3% | <0.01% | **Sub-representado** |
| Transporte | ~5% | <0.01% | **Sub-representado** |

### Diagnóstico

La distribución sectorial de nuestros datos **no refleja la economía real de RD**. La razón es clara: nuestras fuentes son casi exclusivamente nóminas de un puñado de instituciones gubernamentales descargadas de datos.gob.do. Esto no es un error de procesamiento — es una limitación fundamental de las fuentes ingestadas.

**Nota importante sobre el Day 2**: En la validación anterior (`sector-validation.md`), MIVHED (Ministerio de la Vivienda) se clasificó como "Construcción" con 78,828 registros (30.1%). Esa clasificación fue corregida — MIVHED ahora se clasifica como Administración Pública (los empleados del ministerio son funcionarios públicos, no obreros de construcción). Esto explica por qué Construcción bajó de 30.1% a <0.01%.

---

## 3. Validación Salarial

### Salarios mínimos oficiales vigentes (2025)

Fuente: `data/raw/salario-minimo-hacienda-2000-2025.csv`

| Categoría | Salario Mínimo (RD$/mes) |
|-----------|--------------------------|
| Sector Público (Gobierno Central) | 10,000 |
| Zona Franca (áreas deprimidas) | 3,600 |
| Zona Franca Industrial | 16,700 |
| Empresa grande (no sectorizado) | 24,990 |
| Empresa mediana (no sectorizado) | 22,908 |
| Empresa pequeña (no sectorizado) | 15,351 |
| Microempresa | 14,161 |
| Hoteles/restaurantes (empresa grande) | 16,100 |
| Hoteles/restaurantes (mediana/pequeña) | 13,685 |

### Estadísticas salariales de nuestros datos

| Métrica | Valor (RD$/mes) |
|---------|-----------------|
| Registros con salario | 255,819 de 262,410 (97.5%) |
| Mínimo encontrado | RD$1 |
| Percentil 10 | RD$16,344 |
| Mediana | RD$37,882 |
| Promedio | RD$46,398 |
| Percentil 90 | RD$85,000 |
| Máximo encontrado | RD$1,758,882 |

### Registros por debajo del salario mínimo

- **1,109 registros** con salario bruto < RD$10,000 (mínimo del sector público).
- Ejemplos: seguridad en CONALECHE (RD$9,000), coordinadora municipal en PROPEEP (RD$2,500), auxiliar de protocolo en PROPEEP (RD$9,000).
- **Interpretación**: Estos pueden ser empleos a tiempo parcial, montos proporcionales, o datos incompletos. El salario de RD$2,500 es sospechoso — posible error de datos o pago parcial de mes.
- **Porcentaje afectado**: 0.4% de registros con salario — bajo, pero merece revisión.

### Registros con salarios inusualmente altos (>RD$500,000/mes)

Se encontraron **5 registros** — todos de CORAABO (Corp. Acueducto y Alcantarillado Boca Chica):

| Título (raw) | Salario Bruto |
|---------------|---------------|
| "129" | RD$1,718,882 |
| "131" | RD$1,758,882 |
| "130" | RD$1,747,632 |
| "130" | RD$1,743,882 |
| "125" | RD$1,695,132 |

**Diagnóstico**: Estos son **errores de datos claros**. Los "títulos" son números (probablemente IDs de empleado, no puestos), y los salarios superan RD$1.7M/mes, lo cual es implausible para una corporación de acueducto municipal. Probablemente son sumas anuales interpretadas como mensuales, o totales de nómina (múltiples empleados) registrados como un solo registro.

### Comparación con promedios nacionales

- Nuestro **promedio: RD$46,398** y **mediana: RD$37,882**.
- Salario promedio nacional estimado: ~RD$25,000-30,000 (incluye sector privado con salarios más bajos).
- Nuestros datos están sesgados hacia arriba porque la mayoría son nóminas del gobierno central, donde los salarios tienden a ser más altos que el promedio nacional (especialmente en ministerios).
- El percentil 10 (RD$16,344) se alinea bien con el salario mínimo de empresas pequeñas (RD$15,351).

---

## 4. Cobertura Temporal

### Registros por año

| Año | Registros | Notas |
|-----|-----------|-------|
| 2000-2016 | 216-254/año | Solo datos de referencia salarial (Hacienda/MEPyD) |
| 2017 | 8,853 | Inicio de nóminas MAPRE |
| 2018 | 17,634 | Se agregan más fuentes CKAN |
| 2019 | 16,548 | |
| 2020 | 26,219 | Se agrega nómina ASDE |
| 2021 | 13,059 | Caída — posible gap en publicación de datos |
| 2022 | 41,270 | Se agregan más períodos de MIVHED |
| 2023 | 41,244 | Estable |
| 2024 | 42,262 | Estable |
| 2025 | 45,350 | Año parcial (datos al 2025) |
| 2026 | 5,782 | Solo enero (CONALECHE, MAPRE parcial) |

### Observaciones

- **2000-2016**: Solo registros de referencia salarial (salario mínimo). No hay datos de empleo reales.
- **2017-presente**: Los datos de empleo reales comienzan en 2017 con las primeras nóminas CKAN.
- **Gap en 2021**: Solo 13K registros vs 26K en 2020 y 41K en 2022. Probablemente algunas instituciones no publicaron datos ese año.
- **No hay serie temporal continua**: Cada institución CKAN cubre períodos diferentes (MAPRE 2017-2026, ASDE 2020-2023, MIVHED 2022-2026, etc.), lo cual crea irregularidades.
- Los datos TSS y CNZFE son agregados mensuales con serie continua (2003-2026), pero son solo 858 registros en total.

---

## 5. Calidad de Campos

### Cobertura por campo

| Campo | Registros con valor | % | Evaluación |
|-------|-------------------|---|------------|
| `job_title` | 262,410 | 100.0% | Excelente |
| `salary_gross` | 255,819 | 97.5% | Excelente |
| `institution` | 255,842 | 97.5% | Excelente |
| `salary_net` | 92,428 | 35.2% | Moderado — solo PROPEEP y CORAABO |
| `raw_department` | 16,144 | 6.2% | Bajo |
| `location_province` | 12,958 | 4.9% | **Insuficiente** |
| `location_city` | 12,958 | 4.9% | **Insuficiente** |
| `salary_min` | 5,505 | 2.1% | Solo datos de referencia salarial |
| `gender` | 2,260 | 0.9% | **Insuficiente** |
| `salary_max` | 51 | 0.02% | **Casi nulo** |

### Cobertura por fuente

| Fuente | Registros | Salario | Ubicación | Género |
|--------|-----------|---------|-----------|--------|
| CKAN (nóminas) | 261,296 | 99.99% | 5.0% | 0.9% |
| TSS | 816 | 0% | 0% | 0% |
| CNZFE | 42 | 100% | 0% | 0% |
| RD Trabaja | 256 | 0% | 0% | 0% |

### Campos más problemáticos

1. **Ubicación geográfica (4.9%)**: Solo ASDE (Santo Domingo Este) y CORAABO (Boca Chica) reportan provincia/ciudad. Esto impide el drill-down geográfico en el treemap. Las demás 5 instituciones CKAN no incluyen datos de ubicación en sus nóminas publicadas.

2. **Género (0.9%)**: Solo CONALECHE y CORAABO reportan género del empleado. Insuficiente para cualquier análisis de brecha salarial de género.

3. **salary_max (0.02%)**: Prácticamente inexistente. Solo útil como dato de referencia en zonas francas.

### Verificación de archivos CSV fuente

Se verificaron las primeras líneas de 3 archivos CSV para confirmar carga correcta:

- **nomina-mapre-2017-2026.csv**: Delimitado por `;`. Campos: Año, Mes, Nombre, Posicion, Salario. OK.
- **nomina-conaleche-2026.csv**: Delimitado por `,`. Campos: Nº, Nombre, Departamento, Cargo, Designacion, Genero, Sueldo Bruto, Mes, Año. OK — incluye género y departamento.
- **nomina-mivhed-2022-2026.csv**: Delimitado por `,`. Campos: Nombre, Puesto, Sueldo, Mes, Año. OK — minimal, sin departamento ni ubicación.

Los archivos se cargan correctamente en el normalizador. No se detectaron problemas de encoding o parsing en los datos verificados.

---

## 6. Limitaciones Conocidas

### Representatividad

| Limitación | Impacto |
|-----------|---------|
| Solo nóminas gubernamentales + vacantes RD Trabaja | No representa el sector privado (~1.76M empleos formales) |
| Sin sector informal | Estimado en 56% del empleo total (~2.8M trabajadores) no representados |
| Solo 7 instituciones de ~400+ del Estado | Incluso dentro del sector público, la cobertura es parcial |

### Calidad de datos

| Limitación | Impacto |
|-----------|---------|
| 5 registros con salarios >RD$500K — probables errores | Sesgan hacia arriba el promedio y máximo |
| 1,109 registros por debajo del salario mínimo | 0.4% — bajo pero indica posibles datos parciales |
| CORAABO tiene títulos numéricos ("129", "130") | Error en fuente original — títulos no son nombres de puesto |
| Salarios son brutos de nómina, no take-home | No reflejan ingreso disponible del empleado |

### Cobertura

| Limitación | Impacto |
|-----------|---------|
| Cobertura geográfica: 4.9% | Drill-down por provincia no es viable |
| Cobertura de género: 0.9% | Análisis de género no es viable |
| Sin datos 2000-2016 de empleo real | Solo referencia salarial para ese período |
| Gap en 2021 (solo 13K registros) | Serie temporal irregular |
| Bug en RD Trabaja — 256 vacantes no normalizadas | Única fuente de diversidad sectorial privada no funcional |

### Sesgos

- **Sesgo institucional**: El 95.6% de los registros son Administración Pública. El treemap muestra "el empleo público en 7 instituciones", no "el mercado laboral de RD".
- **Sesgo salarial**: Las nóminas gubernamentales tienden a salarios más altos que el promedio nacional. La mediana de RD$37,882 supera el promedio nacional estimado (~RD$25,000).
- **Sesgo geográfico**: Santo Domingo/DN concentra la mayoría de las instituciones públicas representadas. No hay datos del Cibao, Sur, o Este.

---

## 7. Recomendaciones para Mejorar Cobertura

### Prioridad Alta (impacto inmediato)

| # | Acción | Registros esperados | Sectores que cubre |
|---|--------|--------------------|--------------------|
| 1 | **Corregir bug RD Trabaja** (`processRDTrabaja()` — acceder a `p.puesto.titulo` en vez de `p.titulo`) | +256 vacantes | Turismo, Comercio, Tecnología, Salud, Financiero, Transporte |
| 2 | **Descargar API MAP Nómina Pública** (`map.gob.do/datosabiertos/`) | +400,000-500,000 | Todas las instituciones del Estado: Salud (MSP/SNS), Educación (MINERD), Tecnología (OGTIC), Transporte (INTRANT), etc. |
| 3 | **Agregar más datasets CKAN** de datos.gob.do (hay 1,183 datasets de nómina disponibles; solo tenemos 7) | +50,000-200,000 | Priorizando SNS (Salud), MINERD (Educación), MOPC (Construcción) |

### Prioridad Media (mejora significativa)

| # | Acción | Impacto |
|---|--------|---------|
| 4 | **Ingestar ENCFT del Banco Central** | Gold standard para distribución sectorial. Única fuente con formal + informal, por sector CIUO-08 y provincia. |
| 5 | **Procesar `empleadores-cotizantes-tss-2003-2026.csv`** | Complementa datos de empleos con conteo de empleadores formales por sector. |
| 6 | **Distribuir TSS privado por sector usando proporciones ENCFT** | Los ~1.76M empleos privados van todos a "Otros Servicios". Con proporciones ENCFT, se podrían distribuir entre los 12 sectores. |

### Prioridad Baja (pulido)

| # | Acción | Impacto |
|---|--------|---------|
| 7 | **Limpiar 5 registros CORAABO con salarios >RD$500K** | Corregir valores atípicos que sesgan estadísticas |
| 8 | **Investigar 1,109 registros bajo salario mínimo** | Validar si son datos parciales, tiempo parcial, o errores |
| 9 | **Agregar nota visible en el treemap** sobre limitaciones de representatividad | Evitar que usuarios interpreten los datos como "el mercado laboral de RD" |
| 10 | **Enriquecer ubicación geográfica** usando API MAP (incluye sede de institución) o mapeo manual institución→provincia | Habilitar drill-down geográfico |

---

## Resumen Ejecutivo

| Métrica | Valor | Evaluación |
|---------|-------|------------|
| Cobertura del empleo formal | 10.4% (262K de 2.5M) | **Baja** |
| Sectores con datos significativos | 3 de 12 | **Insuficiente** |
| Distribución sectorial vs realidad | Administración Pública 95.6% vs ~10-15% real | **Muy sesgada** |
| Mediana salarial vs promedio nacional | RD$37,882 vs ~RD$25,000 | Sesgada hacia arriba (nóminas públicas) |
| Registros con salario | 97.5% | **Excelente** |
| Registros con ubicación | 4.9% | **Insuficiente** |
| Registros con género | 0.9% | **Insuficiente** |
| Errores detectados (salarios extremos) | 5 registros (>RD$500K) + 1,109 (<RD$10K) | Bajo (<0.5%) |
| Bug conocido (RD Trabaja) | 256 vacantes no procesadas | Impacta diversidad sectorial |

**Conclusión**: Los datos son de buena calidad técnica (97.5% con salario, campos bien normalizados), pero la **cobertura de fuentes es insuficiente** para representar el mercado laboral dominicano. Actualmente representamos solo el 10.4% del empleo formal, concentrado en el sector público. Las acciones de mayor impacto son: (1) descargar la API MAP para cubrir todas las instituciones del Estado, (2) corregir el bug de RD Trabaja para agregar diversidad sectorial privada, y (3) ingestar la ENCFT del Banco Central como referencia de distribución real.
