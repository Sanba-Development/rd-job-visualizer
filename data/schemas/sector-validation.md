# Validación Cruzada: Sectores de Fuentes vs Taxonomía

> Generado: 25 de marzo de 2026
> Basado en: `data/processed/summary.json`, `SECTOR_TAXONOMY.md`, `scripts/processors/normalize.js`

---

## 1. Cobertura por Sector

Total de registros normalizados: **262,154**

| # | Sector | Registros | % del Total | Fuentes que contribuyen | Estado |
|---|--------|-----------|-------------|------------------------|--------|
| 1 | Administración Pública y Defensa | 171,927 | 65.6% | CKAN (PROPEEP, MAPRE, ASDE), TSS (centralizada + descentralizada) | OK — sobrerrepresentado |
| 2 | Turismo y Hostelería | 0 | 0.0% | Ninguna | **SIN DATOS** |
| 3 | Comercio | 0 | 0.0% | Ninguna | **SIN DATOS** |
| 4 | Construcción | 78,828 | 30.1% | CKAN (MIVHED), salario mínimo (Hacienda/MEPyD) | OK |
| 5 | Manufactura y Zonas Francas | 42 | 0.02% | CNZFE (textil, electrónicos) | Baja representación |
| 6 | Tecnología y Telecomunicaciones | 0 | 0.0% | Ninguna | **SIN DATOS** |
| 7 | Salud | 0 | 0.0% | Ninguna | **SIN DATOS** |
| 8 | Educación | 3,910 | 1.5% | CKAN (INESDYC) | Baja representación |
| 9 | Servicios Financieros | 0 | 0.0% | Ninguna | **SIN DATOS** |
| 10 | Transporte y Logística | 0 | 0.0% | Ninguna | **SIN DATOS** |
| 11 | Agricultura y Agroindustria | 794 | 0.3% | CKAN (CONALECHE) | Baja representación |
| 12 | Otros Servicios | 6,653 | 2.5% | CKAN (CORAABO, DGII ISR, salario mínimo), TSS (privada) | OK |

### Hallazgos

- **6 de 12 sectores tienen 0 registros** (50% de la taxonomía sin cobertura).
- El sector público (Admin. Pública + Construcción) acumula el **95.7%** de los datos.
- Sectores como Turismo, Comercio, Tecnología, Salud, Financiero y Transporte no tienen representación alguna.
- Manufactura/ZF solo tiene 42 registros agregados anuales (datos CNZFE).

---

## 2. Fuentes Sin Clasificar

### Archivos no procesados por el normalizador

| Archivo | Procesado? | Notas |
|---------|-----------|-------|
| `data/raw/rdtrabaja/puestos.json` | **BUG — 0 registros producidos** | El procesador busca `p.titulo`, `p.id`, etc. pero los datos están anidados bajo `p.puesto.titulo`, `p.puesto.id`. Los 256 vacantes NO se están normalizando. |
| `data/raw/rdtrabaja/categorias-destacadas.json` | No | Datos de referencia, no se procesan |
| `data/raw/rdtrabaja/conceptos.json` | Parcialmente | Se carga para mapear `actividadEconomica`, pero la estructura anidada (`conceptos.actividadEconomica`) no coincide con lo que el procesador espera (`raw.actividadEconomica`), por lo que el mapping de conceptos también falla. |
| `data/raw/rdtrabaja/regiones.json` | No | Datos de referencia de provincias/municipios, no se procesan |
| `data/raw/rdtrabaja/metadata.json` | No | Metadata del scraping |
| `data/raw/datos-gob-ckan-nomina-search.json` | No | Resultado de búsqueda CKAN, no contiene datos laborales directos |
| `data/raw/empleadores-cotizantes-tss-2003-2026.csv` | No | Conteo de **empleadores** (no empleos). Podría complementar el dataset TSS. |
| `data/raw/map/` | Vacío | Directorio existe pero no se han descargado datos del API MAP |
| `data/raw/tss/` | Vacío | Directorio existe pero no contiene archivos |

### Detalle del bug en rdtrabaja

El procesador `processRDTrabaja()` (línea 742 de normalize.js) hace:
```javascript
const items = Array.isArray(puestos) ? puestos : (puestos.data || ...);
// items[0] = { puesto: { id: 78131, titulo: "OPERARIOS", ... } }
const titulo = p.titulo || p.nombre || ...; // → undefined (debería ser p.puesto.titulo)
```
Los datos de puestos.json tienen estructura `{ data: [{ puesto: { ... } }] }`, pero el procesador accede a las propiedades directamente en el item sin descender al objeto `puesto`.

### Impacto del bug

- **256 vacantes del sector privado** no se normalizan.
- Estas vacantes son la **única fuente de datos del sector privado con diversidad sectorial** (los datos CKAN son casi todos sector público).
- Contienen `actividadEconomica` que permite mapear a múltiples sectores (Turismo, Comercio, Tecnología, etc.).
- Corregir este bug aportaría datos a **sectores actualmente con 0 registros**.

### Utilización de `retencion-isr-salarios-dgii-2017-2025.csv`

Este archivo se procesa y genera **9 registros agregados** (uno por año, 2017-2025). Sin embargo:
- Se mapea todo a `otros_servicios`, lo cual es correcto ya que es una tabla de referencia fiscal, no datos de empleo por sector.
- Solo aporta rangos salariales (salary_min/salary_max), no conteos de empleo.
- Su utilidad principal es como referencia de escalas salariales, no como fuente de empleo.

---

## 3. Mapping Institucional

| Archivo Raw | Institución | Sector Asignado | Correcto? | Notas |
|-------------|------------|-----------------|-----------|-------|
| `nomina-conaleche-2026.csv` | CONALECHE | Agricultura y Agroindustria | **Si** | CONALECHE regula la industria lechera — sector agroindustrial. |
| `nomina-propeep-2018-2025.csv` | PROPEEP | Administración Pública y Defensa | **Si** | Dirección General de Proyectos Estratégicos — adscrita a la Presidencia. |
| `nomina-mapre-2017-2026.csv` | MAPRE | Administración Pública y Defensa | **Si** | Ministerio Administrativo de la Presidencia. |
| `nomina-mivhed-2022-2026.csv` | MIVHED | Construcción | **Cuestionable** | MIVHED es el Ministerio de la Vivienda. Si bien sus proyectos involucran construcción, la institución es de **Admin. Pública**. Mapear a Construcción infla artificialmente ese sector. Recomendación: reclasificar como Admin. Pública o crear categoría "Vivienda" dentro de Admin. Pública. |
| `nomina-inesdyc-2023-2026.csv` | INESDYC | Educación | **Si** | Instituto de Educación Superior — sector educativo. |
| `nomina-asde-2020-2023.csv` | ASDE | Administración Pública y Defensa | **Si** | Ayuntamiento de Santo Domingo Este — gobierno municipal. |
| `nomina-coraabo-2021-2025.csv` | CORAABO | Otros Servicios | **Cuestionable** | CORAABO es una corporación de acueducto. Podría mapearse a **Otros Servicios** (servicios públicos/utilities) o a **Admin. Pública** (entidad pública). El mapping actual es aceptable pero podría debatirse. |
| `empleos-cotizantes-tss-2003-2026.csv` | TSS | Mixto | **Parcialmente correcto** | El sector privado se mapea a `otros_servicios` porque no hay desglose por sector económico. Esto es un **compromiso necesario** pero impreciso: ~350k empleos privados van todos a "Otros Servicios" cuando en realidad están distribuidos en Comercio, Turismo, Manufactura, etc. |
| `salario-minimo-hacienda-2000-2025.csv` | Hacienda | Mapeo por keyword | **Si** | Usa keywords del campo SECTOR (privado, público, zona franca, turismo, construcción, agricultura). Mapping razonable. |
| `salario-minimo-mepyd-2000-2023.csv` | MEPyD | Mapeo por keyword | **Si** | Mismo enfoque que Hacienda. |
| `zonas-francas-textil-2003-2023.csv` | CNZFE | Manufactura y ZF | **Si** | Datos de empleo en zonas francas — sector correcto. |
| `zonas-francas-electronicos-2003-2023.csv` | CNZFE | Manufactura y ZF | **Si** | Datos de empleo en zonas francas — sector correcto. |
| `retencion-isr-salarios-dgii-2017-2025.csv` | DGII | Otros Servicios | **Aceptable** | Es una tabla de referencia ISR, no datos de empleo. Categoría residual es apropiada. |

### Mappings cuestionables

1. **MIVHED → Construcción**: El Ministerio de la Vivienda emplea funcionarios públicos, no obreros de construcción. Sus 78,828 registros (30.1% del total) inflan artificialmente el sector Construcción. Si se reclasificaran a Admin. Pública, ese sector tendría el 95.7% de los datos (aún más concentrado, pero más preciso).

2. **TSS privada → Otros Servicios**: Es un compromiso necesario. Los ~350k empleos del sector privado (datos agregados mensuales) no tienen desglose sectorial. Esto significa que "Otros Servicios" absorbe todo el empleo privado formal indiscriminadamente.

---

## 4. Sectores Faltantes en los Datos

### Sectores con 0 registros reales

| Sector | Registros | Por qué falta | Fuente potencial (de DATA_SOURCES.md) |
|--------|-----------|---------------|---------------------------------------|
| **Turismo y Hostelería** | 0 | No hay datos de hoteles, restaurantes, ASONAHORES en los datasets actuales. Solo nóminas de instituciones públicas no turísticas. | ENCFT (Banco Central) — tiene empleo por sector CIUO-08. RD Trabaja — vacantes con `actividadEconomica`. MAP Nómina — incluiría Min. de Turismo. |
| **Comercio** | 0 | No hay datasets de retail, supermercados, colmados. Sector mayormente informal, no aparece en nóminas públicas. | ENCFT — tiene empleo en comercio. RD Trabaja — vacantes de comercio. |
| **Tecnología y Telecomunicaciones** | 0 | INDOTEL/OGTIC no están en los datasets CKAN actuales. Sector privado (Claro, Altice) no tiene datos públicos. | RD Trabaja — vacantes tech. ENCFT — empleo en TIC. MAP Nómina — incluiría OGTIC/INDOTEL. |
| **Salud** | 0 | SNS, MSP, SENASA no están en los datasets descargados. | MAP Nómina — mayor fuente potencial (hospitales públicos). ENCFT. |
| **Servicios Financieros** | 0 | Superintendencia de Bancos/SIPEN no están en datasets actuales. Banca privada no publica nóminas. | ENCFT. RD Trabaja — vacantes financieras. |
| **Transporte y Logística** | 0 | INTRANT, Autoridad Portuaria no están en datasets actuales. | MAP Nómina. ENCFT. |

### Causa raíz

El problema fundamental es que **los datos actuales provienen casi exclusivamente de nóminas de un puñado de instituciones públicas descargadas de datos.gob.do (CKAN)**. Estas instituciones cubren solo 3-4 sectores. Las dos fuentes clave que diversificarían la cobertura no están ingestadas:

1. **MAP Nómina Pública General** (`map.gob.do/datosabiertos/`) — contiene TODAS las instituciones del Estado (~400k empleados). Esto llenaría Salud (MSP/SNS), Educación (MINERD), Tecnología (OGTIC), Transporte (INTRANT), etc. El directorio `data/raw/map/` existe pero está vacío.

2. **ENCFT del Banco Central** — la única fuente que tiene distribución sectorial completa del mercado laboral (formal + informal). Clasificada como P1 en DATA_SOURCES.md pero no se ha descargado.

3. **RD Trabaja** — 256 vacantes ya descargadas pero no procesadas por el bug del normalizador. Estas vacantes tienen `actividadEconomica` con 50 categorías que cubren casi todos los sectores.

---

## 5. Calidad de Campos

### Cobertura por campo

| Campo | Registros con valor | % | Notas |
|-------|-------------------|---|-------|
| `salary_gross` | 255,819 | 97.6% | Todas las nóminas CKAN lo tienen. TSS y CNZFE no. |
| `salary_net` | 92,428 | 35.3% | Solo PROPEEP y CORAABO reportan neto. |
| `salary_min` | 5,505 | 2.1% | Solo salario mínimo (Hacienda/MEPyD) y ZF (salario operarios). |
| `salary_max` | 51 | 0.02% | Solo ZF (salario técnicos). Prácticamente nulo. |
| `location_province` | 12,958 | 4.9% | Solo ASDE (Santo Domingo) y CORAABO (Boca Chica). |
| `location_city` | 12,958 | 4.9% | Igual que provincia — mismas fuentes. |
| `gender` | 2,260 | 0.9% | Solo CONALECHE y CORAABO reportan género. |
| `raw_department` | 16,144 | 6.2% | CONALECHE, PROPEEP, MAPRE, MIVHED, INESDYC. |
| `institution` | 255,842 | 97.6% | Casi completo (falta en TSS y CNZFE por ser datos agregados). |

### Cobertura por fuente

| Fuente | Registros | Salario | Ubicación | Género |
|--------|-----------|---------|-----------|--------|
| CKAN (nóminas) | 261,296 | 261,284 (99.99%) | 12,958 (5.0%) | 2,260 (0.9%) |
| TSS | 816 | 0 (0%) | 0 (0%) | 0 (0%) |
| CNZFE | 42 | 42 (100%) | 0 (0%) | 0 (0%) |
| RD Trabaja | **0 (bug)** | — | — | — |

### Campos problemáticos

- **Ubicación geográfica**: Solo el 4.9% tiene datos de provincia/ciudad. El treemap no puede hacer drill-down geográfico con esta cobertura. La API MAP incluye ubicación por institución; la ENCFT tiene datos por provincia.
- **Género**: Apenas el 0.9%. Insuficiente para cualquier análisis de género. CONALECHE y CORAABO son las únicas fuentes que lo reportan.
- **salary_max/salary_min**: Casi nulos. Solo sirven como referencia de escalas mínimas.
- **TSS sin salarios**: Los 816 registros TSS son conteos agregados sin información salarial. Útiles para volumen, no para análisis de compensación.

---

## 6. Recomendaciones

### Prioridad Alta (impacto inmediato)

1. **Corregir el bug de rdtrabaja/puestos.json** — El procesador `processRDTrabaja()` debe acceder a `p.puesto.titulo` en vez de `p.titulo` (y lo mismo para todos los campos). También debe cargar `conceptos.conceptos.actividadEconomica` en vez de `raw.actividadEconomica`. Esto aportaría 256 vacantes con diversidad sectorial inmediata.

2. **Descargar la API MAP Nómina Pública** — `map.gob.do/datosabiertos/data/nomina_publica_general_estado/json?year=2025&month=1`. Un solo mes genera ~500k registros cubriendo TODAS las instituciones del Estado. Esto llenaría Salud, Educación completa, Tecnología, Transporte, y más.

3. **Reclasificar MIVHED** — Mover de Construcción a Administración Pública y Defensa. Los empleados del Ministerio de Vivienda son funcionarios públicos, no trabajadores de construcción. Esto corrige una distorsión del 30% en la distribución.

### Prioridad Media (mejora significativa)

4. **Ingestar ENCFT del Banco Central** — Es la única fuente con distribución sectorial representativa del mercado total (formal + informal). Sin ella, el treemap solo representa empleo público formal.

5. **Procesar `empleadores-cotizantes-tss-2003-2026.csv`** — Complementa los datos de empleo TSS con conteo de empleadores formales.

6. **Mejorar mapping TSS sector privado** — Actualmente todos los ~350k empleos privados van a `otros_servicios`. Si se consigue ENCFT, las proporciones sectoriales de esa encuesta podrían usarse para distribuir el volumen TSS entre los 12 sectores.

### Prioridad Baja (pulido)

7. **Agregar ubicación geográfica** — Usar la API MAP (que incluye institución con sede) o datos RD Trabaja (que incluyen `idProvincia` y `idMunicipio`) para mejorar la cobertura geográfica del 4.9% actual.

8. **Agregar más datasets CKAN** — datos.gob.do tiene 1,183 datasets de nómina. Los actuales solo cubren 7 instituciones. Priorizar instituciones de sectores sin datos (SNS para Salud, MINERD para Educación, etc.).

9. **Documentar limitaciones en el treemap** — Agregar una nota visible de que los datos representan primordialmente empleo público formal, no el mercado laboral completo (SECTOR_TAXONOMY.md ya lo menciona en notas metodológicas, pero debe ser visible en la UI).

---

## Resumen Ejecutivo

| Métrica | Valor | Evaluación |
|---------|-------|------------|
| Sectores con datos | 6 / 12 | **Insuficiente** |
| Sectores con >1% de registros | 3 / 12 | **Crítico** |
| Fuentes activas | 3 (CKAN, TSS, CNZFE) | De 6 fuentes priorizadas |
| Fuentes con bug | 1 (RD Trabaja) | Fix trivial, alto impacto |
| Cobertura salarial | 97.6% | Buena |
| Cobertura geográfica | 4.9% | **Insuficiente** |
| Cobertura de género | 0.9% | **Insuficiente** |
| Mapping cuestionable | 1 (MIVHED→Construcción) | Distorsiona 30% del total |

**Conclusión**: El normalizador funciona correctamente para los datos que tiene, pero la cobertura de fuentes es insuficiente para un treemap representativo. Las acciones de mayor impacto son: (1) corregir el bug de RD Trabaja, (2) descargar el API MAP, y (3) reclasificar MIVHED.
