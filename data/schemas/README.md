# Schemas de Datos — RD Job Visualizer

## `normalized-job.schema.json`

Schema JSON (draft-07) que define el formato unificado al que se normalizan **todos** los registros de empleo del proyecto, sin importar la fuente de origen.

---

## Descripción de Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | string | Sí | Identificador único. Formato: `{source}_{id_original}`. Ej: `map_00123_2025_01` |
| `source` | string (enum) | Sí | Fuente de origen: `map`, `tss`, `encft`, `ckan`, `rdtrabaja`, `cnzfe` |
| `source_record_id` | string \| null | No | ID original del registro en la fuente (número de empleado, ID de vacante, etc.) |
| `sector` | string (enum) | Sí | Uno de los 12 sectores de la taxonomía del proyecto (ver abajo) |
| `job_title` | string | Sí | Título del puesto normalizado (lowercase, trimmed) |
| `institution` | string \| null | No | Institución o empresa empleadora |
| `salary_gross` | number \| null | No | Salario bruto mensual en DOP |
| `salary_net` | number \| null | No | Salario neto mensual en DOP |
| `salary_min` | number \| null | No | Límite inferior del rango salarial publicado (DOP mensual) |
| `salary_max` | number \| null | No | Límite superior del rango salarial publicado (DOP mensual) |
| `employee_count` | integer \| null | No | Cantidad de empleos que representa el registro. Default: 1 |
| `location_province` | string \| null | No | Provincia de RD |
| `location_city` | string \| null | No | Ciudad o municipio |
| `employment_type` | string (enum) | Sí | Tipo: `publico`, `privado`, `zona_franca` |
| `gender` | string \| null | No | `M`, `F`, o null |
| `period_year` | integer | Sí | Año del dato |
| `period_month` | integer \| null | No | Mes (1-12), null si dato es anual o trimestral |
| `period_quarter` | integer \| null | No | Trimestre (1-4), para datos ENCFT |
| `raw_department` | string \| null | No | Departamento/área original sin normalizar |
| `raw_title` | string \| null | No | Título del puesto original sin normalizar |
| `raw_institution` | string \| null | No | Nombre de institución original sin normalizar |
| `extracted_at` | string (datetime) | Sí | Timestamp ISO 8601 de la extracción |
| `metadata` | object \| null | No | Campos extra específicos de cada fuente |

---

## Sectores Válidos

Los 12 valores válidos para el campo `sector` (corresponden a `SECTOR_TAXONOMY.md`):

| Valor en el schema | Nombre para mostrar |
|--------------------|---------------------|
| `administracion_publica_y_defensa` | Administración Pública y Defensa |
| `turismo_y_hosteleria` | Turismo y Hostelería |
| `comercio` | Comercio |
| `construccion` | Construcción |
| `manufactura_y_zonas_francas` | Manufactura y Zonas Francas |
| `tecnologia_y_telecomunicaciones` | Tecnología y Telecomunicaciones |
| `salud` | Salud |
| `educacion` | Educación |
| `servicios_financieros` | Servicios Financieros |
| `transporte_y_logistica` | Transporte y Logística |
| `agricultura_y_agroindustria` | Agricultura y Agroindustria |
| `otros_servicios` | Otros Servicios |

---

## Mapping de Fuentes al Schema

### 1. MAP (Nómina Pública)

| Campo MAP | Campo Normalizado | Notas |
|-----------|-------------------|-------|
| (generado) | `id` | `map_{nº}_{year}_{month}` |
| — | `source` | `"map"` |
| Nº | `source_record_id` | Número de empleado |
| (via institución) | `sector` | Se asigna según tabla de mapping institución → sector en `SECTOR_TAXONOMY.md` |
| Cargo | `job_title` | Lowercase, trimmed |
| (institución del endpoint) | `institution` | Nombre de la institución MAP |
| Sueldo Bruto | `salary_gross` | Parsear: remover comas, convertir a float |
| (no disponible) | `salary_net` | Null (algunas nóminas lo incluyen) |
| (no disponible) | `location_province` | Null (se puede inferir de institución) |
| — | `employment_type` | `"publico"` |
| Genero | `gender` | `"Masculino"` → `"M"`, `"Femenino"` → `"F"` |
| Año | `period_year` | Directo |
| Mes | `period_month` | `"Enero"` → 1, `"Febrero"` → 2, etc. |
| Departamento | `raw_department` | Tal cual |
| Cargo | `raw_title` | Tal cual (antes de normalizar) |

### 2. TSS (Empleos Cotizantes)

| Campo TSS | Campo Normalizado | Notas |
|-----------|-------------------|-------|
| (generado) | `id` | `tss_{tipo}_{periodo}` |
| — | `source` | `"tss"` |
| — | `source_record_id` | Null (datos agregados) |
| tipo_empleador | `sector` | Mapping: público → `administracion_publica_y_defensa`, privado → requiere desglose, zona franca → `manufactura_y_zonas_francas` |
| — | `job_title` | Genérico: `"empleo formal {tipo}"` |
| — | `institution` | Null (datos agregados) |
| — | `salary_gross` | Null |
| cantidad_empleos | `employee_count` | Directo — este es el valor clave para el treemap |
| — | `employment_type` | Según tipo_empleador |
| periodo | `period_year` / `period_month` | Parsear del campo periodo |

### 3. ENCFT (Banco Central)

| Campo ENCFT | Campo Normalizado | Notas |
|-------------|-------------------|-------|
| (generado) | `id` | `encft_{ocupacion}_{year}_Q{quarter}` |
| — | `source` | `"encft"` |
| ocupacion_ciuo | `sector` | Mapping CIUO-08 → sector (ver tabla en `SECTOR_TAXONOMY.md`) |
| ocupacion_ciuo | `job_title` | Descripción de la clasificación CIUO |
| — | `institution` | Null |
| rango por ocupación | `salary_min` / `salary_max` | Si disponible |
| empleo_total | `employee_count` | Directo |
| por provincia | `location_province` | Si disponible |
| — | `employment_type` | Según sector (puede ser mixto, usar `"privado"` por defecto) |
| — | `period_year` | Directo |
| — | `period_quarter` | Trimestre del dato |

### 4. datos.gob.do / CKAN (Nóminas Institucionales)

| Campo CKAN | Campo Normalizado | Notas |
|------------|-------------------|-------|
| (generado) | `id` | `ckan_{institucion}_{nº}` |
| — | `source` | `"ckan"` |
| Nº | `source_record_id` | Tal cual del CSV |
| (via institución) | `sector` | Mapping por nombre de institución |
| Cargo | `job_title` | Lowercase, trimmed |
| (nombre del dataset) | `institution` | Ej: "CONALECHE" |
| Sueldo Bruto | `salary_gross` | Parsear formato numérico con comas |
| — | `employment_type` | `"publico"` (son nóminas de instituciones públicas) |
| Genero | `gender` | `"Masculino"` → `"M"`, `"Femenino"` → `"F"` |
| Año | `period_year` | Directo |
| Mes | `period_month` | Convertir nombre de mes a número |
| Departamento | `raw_department` | Tal cual |
| Cargo | `raw_title` | Tal cual |

### 5. RD Trabaja (Vacantes)

| Campo RD Trabaja | Campo Normalizado | Notas |
|------------------|-------------------|-------|
| (generado) | `id` | `rdtrabaja_{id_vacante}` |
| — | `source` | `"rdtrabaja"` |
| id_vacante | `source_record_id` | ID de la vacante en el portal |
| sector | `sector` | Mapping de categoría del portal → taxonomía |
| titulo_vacante | `job_title` | Lowercase, trimmed |
| empresa | `institution` | Nombre de la empresa |
| salario | `salary_min` / `salary_max` | Parsear rango si disponible |
| ubicacion | `location_province` / `location_city` | Parsear |
| — | `employment_type` | `"privado"` |
| — | `employee_count` | 1 (cada vacante = 1 puesto) |

### 6. CNZFE (Zonas Francas)

| Campo CNZFE | Campo Normalizado | Notas |
|-------------|-------------------|-------|
| (generado) | `id` | `cnzfe_{sector_zf}_{year}` |
| — | `source` | `"cnzfe"` |
| sector_zf | `sector` | `"manufactura_y_zonas_francas"` (todos) |
| sector_zf | `job_title` | Genérico: `"empleo zona franca - {sector_zf}"` |
| — | `institution` | Null (datos agregados por sector) |
| empleo_total | `employee_count` | Directo |
| — | `employment_type` | `"zona_franca"` |
| año | `period_year` | Directo |

---

## Uso en el Treemap

El treemap se construye a partir de estos campos:

- **Tamaño de celda**: `employee_count` (volumen de empleos)
- **Agrupación nivel 1**: `sector` (los 12 sectores)
- **Color**: Definido por sector en `SECTOR_TAXONOMY.md`
- **Drill-down**: `institution`, `location_province`, `source`
- **Tooltip/detalle**: `job_title`, `salary_gross`/`salary_net`, `salary_min`/`salary_max`

## Validación

Para validar un archivo JSON contra este schema:

```bash
# Con ajv-cli (Node.js)
npx ajv validate -s data/schemas/normalized-job.schema.json -d data/processed/jobs.json

# Con jsonschema (Python)
python -m jsonschema -i data/processed/jobs.json data/schemas/normalized-job.schema.json
```
