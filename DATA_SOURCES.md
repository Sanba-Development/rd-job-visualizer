# Inventario de Fuentes de Datos — RD Job Visualizer

> Última actualización: 20 de marzo de 2026
> Estado: Investigación completada, fuentes priorizadas para ingesta Día 1

---

## Fuentes Priorizadas (Viables para MVP)

### 1. MAP — Nómina Pública General del Estado

| Campo | Detalle |
|-------|---------|
| **Institución** | Ministerio de Administración Pública (MAP) |
| **URL API** | `https://map.gob.do/datosabiertos/data/nomina_publica_general_estado/json?year=2025&month=1` |
| **Datos** | Títulos de puestos, instituciones, salarios brutos/netos, cantidad de empleados por cargo |
| **Formato** | JSON API (parámetros: `year`, `month`) |
| **Acceso** | Público, sin autenticación |
| **Frescura** | Mensual — disponible hasta marzo 2026 |
| **Volumen estimado** | ~500,000+ registros por mes |
| **Prioridad** | **P0 — Mayor dataset, más estructurado** |
| **Campos útiles** | `nombre_cargo`, `institucion`, `salario_bruto`, `salario_neto`, `tipo_empleado` |
| **Notas** | Mejor fuente para sector público. Variar `month=1..12` y `year` para serie temporal. |

---

### 2. TSS — Empleos Cotizantes por Tipo de Empleador

| Campo | Detalle |
|-------|---------|
| **Institución** | Tesorería de la Seguridad Social (TSS) |
| **URL descarga** | `https://tss.gob.do/transparencia/estadisticas` (buscar "Empleos cotizantes") |
| **Datos** | Conteo de empleos formales por tipo de empleador (público, privado, zona franca) |
| **Formato** | CSV / XLSX (descarga directa) |
| **Acceso** | Público |
| **Frescura** | Quincenal — disponible hasta marzo 2026 |
| **Prioridad** | **P0 — Conteo oficial de empleo formal** |
| **Campos útiles** | `tipo_empleador`, `cantidad_empleos`, `periodo` |
| **Notas** | Complementa MAP con visión del sector privado. Ideal para ponderar el treemap. |

---

### 3. ENCFT — Encuesta Nacional Continua de Fuerza de Trabajo

| Campo | Detalle |
|-------|---------|
| **Institución** | Banco Central de la República Dominicana |
| **URL** | `https://www.bancentral.gov.do/a/d/2541-encuesta-mercado-de-trabajo` |
| **Datos** | Empleo por ocupación (CIUO-08), sector económico, desempleo, informalidad |
| **Formato** | XLSX (descarga manual o scrape del SPA) |
| **Acceso** | Público, pero requiere navegación manual del SPA |
| **Frescura** | Trimestral (último: Q4 2025) |
| **Prioridad** | **P1 — Gold standard para distribución sectorial** |
| **Campos útiles** | `ocupacion_ciuo`, `sector_economico`, `empleo_total`, `tasa_desempleo`, `informalidad` |
| **Notas** | Datos más representativos del mercado laboral total (formal + informal). Requiere procesamiento de Excel con múltiples hojas. |

---

### 4. datos.gob.do — Nóminas Institucionales (CKAN Bulk)

| Campo | Detalle |
|-------|---------|
| **Institución** | Múltiples (1,183 datasets de nómina en el portal) |
| **URL API** | `https://datos.gob.do/api/3/action/package_search?q=nomina&rows=100` |
| **Datos** | Títulos de puestos públicos por institución individual |
| **Formato** | CSV / XLSX via CKAN API |
| **Acceso** | Público, API CKAN estándar |
| **Frescura** | Varía por institución (mensual a anual) |
| **Prioridad** | **P2 — Volumen alto pero calidad inconsistente** |
| **Campos útiles** | `puesto`, `departamento`, `salario` (varía por dataset) |
| **Notas** | Gran volumen pero schemas inconsistentes entre instituciones. Útil para enriquecer después del MVP. |

---

### 5. RD Trabaja — Vacantes Activas del Sector Privado

| Campo | Detalle |
|-------|---------|
| **Institución** | Ministerio de Trabajo |
| **URL** | `https://rdtrabaja.mt.gob.do/` |
| **Datos** | Vacantes activas con título, empresa, ubicación, sector |
| **Formato** | SPA (requiere Playwright para scraping) |
| **Acceso** | Público pero dinámico (JavaScript rendering) |
| **Frescura** | Tiempo real |
| **Prioridad** | **P2 — Valioso pero costoso de extraer** |
| **Campos útiles** | `titulo_vacante`, `empresa`, `ubicacion`, `sector`, `salario` (a veces) |
| **Notas** | SPA con posible detección de bots. Alternativa: inspeccionar XHR requests del SPA para encontrar API interna. Riesgo de bloqueo alto. |

---

### 6. CNZFE — Empleo en Zonas Francas por Sector

| Campo | Detalle |
|-------|---------|
| **Institución** | Consejo Nacional de Zonas Francas de Exportación |
| **URL** | `https://cnzfe.gob.do/estadisticas/` |
| **Datos** | Empleo en zonas francas desglosado por sector industrial |
| **Formato** | CSV / XLSX / PDF (descarga directa) |
| **Acceso** | Público |
| **Frescura** | Anual (serie 2003-2023) |
| **Prioridad** | **P2 — Nicho pero datos únicos de manufactura** |
| **Campos útiles** | `sector_zf`, `empleo_total`, `empresas`, `año` |
| **Notas** | Único dataset con desglose de manufactura/zonas francas. Serie temporal larga para tendencias. |

---

## Fuentes Descartadas o Bloqueadas

| Fuente | Razón del descarte |
|--------|-------------------|
| **Aldaba** | No tiene RSS ni API pública. Requiere autenticación; responde 403 a requests externos. |
| **Portal Concursa (MAP)** | Caído o bloqueado — ECONNREFUSED / 403 en múltiples intentos. |
| **ONE en datos.gob.do** | Solo 10 datasets disponibles, ninguno laboral (turismo, energía, pobreza). |
| **Ministerio de Trabajo en datos.gob.do** | Solo publica su nómina interna, no datos del mercado laboral general. |
| **LinkedIn DR** | Paywall estricto, scraping viola ToS. |
| **Buscojobs / CompuTrabajo** | Requiere autenticación, no ofrecen API pública. |

---

## Estrategia de Ingesta para el MVP

```
Día 1 (Lun 23):
├── Descargar MAP JSON API (nómina pública) → /data/raw/map/
├── Descargar TSS CSV (empleos cotizantes) → /data/raw/tss/
└── Descargar ENCFT XLSX (Banco Central) → /data/raw/encft/

Día 2 (Mar 24):
├── Normalizar MAP + TSS → /data/processed/
├── Explorar RD Trabaja DOM (decidir si vale la pena)
└── Descargar CNZFE estadísticas → /data/raw/cnzfe/

Día 3 (Mié 25):
├── Integrar datos normalizados al treemap
└── Si RD Trabaja es viable → scraper Playwright
```

### Prioridad de campos por fuente

| Campo del Treemap | MAP | TSS | ENCFT | RD Trabaja |
|-------------------|-----|-----|-------|------------|
| Sector económico | Via institución | Por tipo empleador | Directo (CIUO-08) | Por categoría |
| Volumen de empleos | Conteo de registros | Directo | Directo | Conteo vacantes |
| Salario | Directo (bruto/neto) | No | Rango por ocupación | A veces |
| Ubicación geográfica | Via institución | No | Por provincia | Directo |
| Título de puesto | Directo | No | Por clasificación | Directo |

---

## URLs de Descarga Directa (Quick Reference)

```
# MAP Nómina (cambiar year/month)
https://map.gob.do/datosabiertos/data/nomina_publica_general_estado/json?year=2025&month=1

# CKAN API datos.gob.do
https://datos.gob.do/api/3/action/package_search?q=nomina&rows=10

# TSS Estadísticas
https://tss.gob.do/transparencia/estadisticas

# Banco Central ENCFT
https://www.bancentral.gov.do/a/d/2541-encuesta-mercado-de-trabajo

# CNZFE Estadísticas
https://cnzfe.gob.do/estadisticas/
```
