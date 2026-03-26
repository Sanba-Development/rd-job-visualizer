# Data Raw — Manifest

Downloaded: 2026-03-22

## Payroll (Nomina) Datasets

| File | Source | Rows | Columns | Notes |
|------|--------|------|---------|-------|
| `nomina-asde-2020-2023.csv` | [ASDE via CKAN](https://ayuntamientosde.gob.do/transparencia/wp-content/uploads/2024/02/Nomina-2020-2023.csv) | 11,460 | Mixed payroll fields | Ayuntamiento Santo Domingo Este, pre-existing |
| `nomina-conaleche-2026.csv` | [CONALECHE via CKAN](https://datos.gob.do/dataset/87545b6a-e54d-47f0-988c-3b0b900fb296/resource/a9257b14-3dc4-4030-8c5b-8d181aacc5ee/download/nomina-de-empleados-conaleche-2026.csv) | 796 | CSV payroll | Consejo Nacional de la Industria Lechera, pre-existing |
| `nomina-mapre-2017-2026.csv` | [MAPRE](https://mapre.gob.do/transparencia/download/datos_abiertos/nomina/Nomina-Datos-Abiertos-2017-2026.csv) | 68,471 | Ano;Mes;Nombre;Posicion;Salario | Ministerio Administrativo de la Presidencia. Semicolon-delimited. |
| `nomina-mivhed-2022-2026.csv` | [MIVHED via CKAN](https://transparencia.mived.gob.do/images/Datos_abiertos/NOMINADEDATOSABIERTOS_2026/Nómina_de_Empleados_MIVHED_2022_2026_.csv) | 78,828 | NOMBRE,PUESTO,SUELDO,MES,AÑO | Ministerio de la Vivienda, Habitat y Edificaciones. Comma-delimited. |
| `nomina-propeep-2018-2025.csv` | [PROPEEP via CKAN](https://propeep.gob.do/transparencia/descargar/244/nomina-institucional/932/nomina-institucional-2018-2025-3.csv) | 90,921 | Nombre;Funcion;Honorarios;Movilidad;Sueldo Neto;Nomina;Tipo Nomina;Mes;Ano | Dir. Gral. de Proyectos Estrategicos y Especiales. Semicolon-delimited. BOM present. |
| `nomina-coraabo-2021-2025.csv` | [CORAABO via CKAN](https://datos.gob.do/dataset/ba2432cf-d97a-4f14-9faa-72b662c719af/resource/e22e9a78-407f-4b54-bc49-74a82b62c109/download/nomina-empleados-fijos-enero-2021-a-noviembre-2025-csv.csv) | 1,654 | Fecha;Nombre;Cargo;Genero;Ingreso Bruto;...;Neto | Corp. Acueducto y Alcantarillado Boca Chica. Semicolon-delimited. |
| `nomina-inesdyc-2023-2026.csv` | [INESDYC via CKAN](https://www.inesdyc.edu.do/transparencia/download/181/nominas/28745/nomina-de-empleados-inesdyc-2023-2026.csv) | 3,910 | Nombre;Departamento;Funcion;Estatus;Sueldo Bruto;Mes;Ano | Instituto de Educacion Superior en Formacion Diplomatica. Semicolon-delimited. |

## Employment & Salary Statistics

| File | Source | Rows | Columns | Notes |
|------|--------|------|---------|-------|
| `empleos-cotizantes-tss-2003-2026.csv` | [TSS via CKAN](https://tss.gob.do/descargar/2045/empleos-cotizantes-2003-2026/17727/empleos-cotizantes-2003-2026-2.csv) | 272 | MES,ANO,EMPRESA_PRIVADA,PUBLICA_CENTRALIZADA,PUBLICA_DESCENTRALIZADA,TOTAL | Monthly employment counts by sector, 2003-2026. |
| `empleadores-cotizantes-tss-2003-2026.csv` | [TSS via CKAN](https://tss.gob.do/descargar/2044/empleadores-cotizantes-2003-2025/17724/empleadores-cotizantes-2003-2026-2.csv) | 272 | MES,ANO,EMPLEADORES_COTIZANTES | Monthly employer counts, 2003-2026. |
| `retencion-isr-salarios-dgii-2017-2025.csv` | [DGII via CKAN](https://dgii.gov.do/app/WebApps/Misc/DatosAbiertos/CSV/Retención%20ISR%20de%20Salario,%202017-2025.csv) | 174,042 | ANO FISCAL;SALARIO MENSUAL;RETENCION MENSUAL | ISR salary retention table, DGII. |
| `salario-minimo-hacienda-2000-2025.csv` | [Hacienda via CKAN](https://www.hacienda.gob.do/transparencia/wp-content/uploads/2026/02/Estadisticas-de-Salario-Minimo-Promedio-por-Sectores-MEPYD-2000-2025.csv) | 2,862 | SECTOR;TAMANO EMPRESA;AREAS;MES;ANO;SALARIO MINIMO | Minimum wage by sector/size, 2000-2025. Semicolon-delimited. |
| `salario-minimo-mepyd-2000-2023.csv` | [MEPyD via CKAN](https://mepyd.gob.do/download/17162/salario-minimo-promedio/397905/estadisticas-de-salario-minimo-promedio-por-sectores-mepyd-2000-2023-3.csv) | 2,592 | SECTOR;TAMANO EMPRESA;AREAS;MES;ANO;SALARIO MINIMO | Minimum wage by sector/size, 2000-2023. Semicolon-delimited. |

## Zonas Francas (Free Trade Zones)

| File | Source | Rows | Columns | Notes |
|------|--------|------|---------|-------|
| `zonas-francas-textil-2003-2023.csv` | [CNZFE via CKAN](https://datos.gob.do/dataset/c459b0d6-9148-4da4-a25f-cb1e83881987/resource/d1ee5b18-c94c-4c38-9d22-2a9ab709ae53/download/estadisticas-de-la-evolucion-del-sector-textil-cnzfe-2003-2023.csv) | 21 | Anos;Empresas;Empleos;Export Millones US;Salario Prom Tecnicos;Salario Prom Operarios | Textile sector evolution. |
| `zonas-francas-electronicos-2003-2023.csv` | [CNZFE via CKAN](https://datos.gob.do/dataset/c459b0d6-9148-4da4-a25f-cb1e83881987/resource/5e9d7045-7b50-4077-93e2-b32d249d0092/download/estadisticas-de-la-evolucion-del-sector-electricos-y-electronicos-cnzfe-2003-2023.csv) | 21 | Anos;Empresas;Empleos;Export Millones US;Salario Prom Tecnicos;Salario Prom Operarios | Electronics sector evolution. |
| `zonas-francas-calzados-cnzfe-2003-2023.csv` | [CNZFE via CKAN](https://datos.gob.do/dataset/c459b0d6-9148-4da4-a25f-cb1e83881987/resource/50bbea15-e9bf-4d13-8df1-d1931bded5e8/download/estadisticas-de-la-evolucion-del-sector-calzados-cnzfe-2003-2023.csv) | 21 | Anos;Empresas;Empleos;Export Millones US;Salario Prom Tecnicos;Salario Prom Operarios | Footwear sector evolution. |
| `zonas-francas-tabaco-cnzfe-2003-2023.csv` | [CNZFE via CKAN](https://datos.gob.do/dataset/c459b0d6-9148-4da4-a25f-cb1e83881987/resource/2104d4c1-9c3b-491e-ae87-4df4668d2b90/download/estadisticas-de-la-evolucion-del-sector-tabaco-cnzfe-2003-2023.csv) | 21 | Anos;Empresas;Empleos;Export Millones US;Salario Prom Tecnicos;Salario Prom Operarios | Tobacco sector evolution. |
| `zonas-francas-joyeria-cnzfe-2003-2023.csv` | [CNZFE via CKAN](https://datos.gob.do/dataset/c459b0d6-9148-4da4-a25f-cb1e83881987/resource/412ed11a-cfb4-4b16-8fe0-3d0cfb7190f3/download/estadisticas-de-la-evolucion-del-sector-joyeria-cnzfe-2003-2023.csv) | 21 | Anos;Empresas;Empleos;Export Millones US;Salario Prom Tecnicos;Salario Prom Operarios | Jewelry sector evolution. |
| `zonas-francas-dispositivos-medicos-cnzfe-2003-2023.csv` | [CNZFE via CKAN](https://datos.gob.do/dataset/c459b0d6-9148-4da4-a25f-cb1e83881987/resource/1f7d9b10-4a3f-4249-b0f7-68dbc224803f/download/estadisticas-de-la-evolucion-del-sector-dispositivos-medicos-y-farmaceuticos-cnzfe-2003-2023.csv) | 21 | Anos;Empresas;Empleos;Export Millones US;Salario Prom Tecnicos;Salario Prom Operarios | Medical devices & pharmaceuticals sector. Mapped to salud sector. |

## Tourism, Health & Construction

| File | Source | Rows | Columns | Notes |
|------|--------|------|---------|-------|
| `empresas-servicios-turisticos-mitur-2018-2025.csv` | [MITUR](https://transparencia.mitur.gob.do/Descargar/5691/estadisticas-empresas-y-servicios-turisticos/36778/estadisticas-empresas-y-servicios-turisticos-2018-2025-csv.csv) | 184 | Empresa o Servicio,Licencias Nuevas,Renovacion,...,Periodo,Ano | Tourism business licensing (hotels, restaurants, travel agencies). Quarterly. |
| `exequatur-profesionales-salud-mispas-1933-2025.csv` | [MISPAS](https://www.msp.gob.do/web/Transparencia/documentos_oai/746/exequatur-profesionales-de-la-salud/33973/exequatur-profesionales-de-la-salud-1922-2025-formato-csv-octubre-diciembre-2025.csv) | 148,835 | NOMBRES;FECHA UNIVERSIDAD;...;PROFESION;FOLIO;LIBRO | Licensed health professionals (doctors, nurses, etc). Semicolon-delimited. Aggregated by profession+year in normalizer. |
| `licencias-construccion-mivhed-2022-2025.csv` | [MIVHED](https://transparencia.mived.gob.do/images/Datos_abiertos/licencias-emitidas-2025/Licencias_emitidas_Ministerio_de_la_Vivienda_H%C3%A1bitat_y_Edificaciones_MIVHED_2022-2025.csv) | 4,770 | Fecha de Emisión,Mes,Año,Provincia,Municipio,...,Tipologia,Metros Cuadrados,Inversión Total | Building permits by type and province. Has 2 junk header rows before actual CSV headers. |

## Metadata

| File | Source | Notes |
|------|--------|-------|
| `datos-gob-ckan-nomina-search.json` | [CKAN API](https://datos.gob.do/api/3/action/package_search?q=nomina&rows=200) | 167 dataset metadata records from CKAN search |

## Summary

- **21 CSV files**, **1 JSON metadata file**
- **Total rows: ~590,000+**
- **Key payroll files:** MAPRE (68k), MIVHED (79k), PROPEEP (91k), DGII ISR (174k)
- **Key new files (Day 3):** MISPAS exequatur (149k), MIVHED licencias (4.7k), MITUR empresas (184), 4 new CNZFE sectors
- **Delimiter note:** Many DR government CSVs use semicolons (`;`) rather than commas as delimiter

## Failed Downloads

| Source | URL | Issue |
|--------|-----|-------|
| MAP (nomina publica) | `https://map.gob.do/datosabiertos/data/nomina_fijos_map/csv` | Cloudflare challenge (403) |
| MAP API | `https://map.gob.do/datosabiertos/data/nomina_publica_general_estado/json?year=2024&month=1` | Cloudflare challenge |
| DGM (Migracion) | `https://migracion.gob.do/transparencia/wp-content/uploads/2026/03/Nomina-de-Empleados-DGM-2021-2026.csv` | Cloudflare challenge (403) |
| SIPEN | `https://www.sipen.gob.do/dataset/salario_minimo_cotizable.csv` | 404 Not Found |
| DIGECOOM | `http://digecoom.gob.do/transparencia/phocadownload/DatosAbiertos/NominasDigecoom2017-2020/Nomina%20Digecoom%202017%20-%202020.csv` | Connection refused |
| TSS stats page | `https://tss.gob.do/estadisticas/informes-estadisticos/` | Dynamic JS loading, no direct CSV links |
