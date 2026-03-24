# RD Trabaja — Technical Exploration

**Date:** 2026-03-23
**Portal URL:** https://rdtrabaja.mt.gob.do/
**Status:** API fully accessible, no authentication required for public endpoints

---

## 1. Technical Architecture

### Frontend
- **Framework:** Angular (confirmed by `<app-root>` component, hashed bundles, Angular-specific patterns in JS)
- **Bundles:** `main.c8a79a36c39c5f31.js`, `runtime.ec4360d0ff87dacf.js`, `polyfills.426190c9c4baba58.js`
- **CSS:** `styles.81b5ec20128735fa.css`
- **PWA:** Has `manifest.webmanifest` and service worker support
- **Analytics:** Google Analytics UA-58408492-2

### Backend
- **Server:** Kestrel (ASP.NET Core)
- **CMS:** Squidex (headless CMS) at `/cms/` path
- **Base domain:** `https://empleateya.mt.gob.do` (the actual API host)
- **Frontend domain:** `https://rdtrabaja.mt.gob.do` (serves the Angular SPA)

### Environment Config (extracted from JS bundle)
```javascript
{
  apiUrl:        "https://empleateya.mt.gob.do/api",
  webappUrl:     "https://empleateya.mt.gob.do/web",
  idpLoginUrl:   "https://empleateya.mt.gob.do/idp/account/login",
  squidexUrl:    "https://empleateya.mt.gob.do/cms/api/content/senae-cms",
  squidexTokenUrl: "https://empleateya.mt.gob.do/cms/identity-server/connect/token",
  assetsUrl:     "https://empleateya.mt.gob.do/cms/api/assets/",
  squidexClient: "grant_type=client_credentials&client_id=senae-cms:senae-website&client_secret=6dHMdlITTfcqBzHMJxFdrPgRSCAinDXgtv2ImbEkYgU=&scope=squidex-api"
}
```

### Related MT Subdomains
| Subdomain | Purpose |
|---|---|
| `rdtrabaja.mt.gob.do` | Public job search portal (Angular SPA) |
| `empleateya.mt.gob.do` | API backend + admin webapp |
| `ovi.mt.gob.do` | Oficina Virtual (SIRLA) |
| `certificaciones.mt.gob.do` | SISCERT certifications system |
| `calculo.mt.gob.do` | Prestaciones calculator |
| `capacitate.mt.gob.do` | Training portal |

---

## 2. API Endpoints Discovered

### 2.1 Job Listings API (Public, No Auth Required)

#### `GET /api/puestos` — Active Job Vacancies

**Full URL:** `https://empleateya.mt.gob.do/api/puestos`
**Auth:** None required
**Response format:** JSON with pagination wrapper

**Pagination Parameters** (PascalCase required):
| Param | Type | Notes |
|---|---|---|
| `PageSize` | int | Works. Max tested: 250 (returned all 249 records). Default: 20. |
| `Page` | int | **BROKEN** — always returns page 1 regardless of value. |

**Important:** Since `Page` parameter is ignored by the server, use `PageSize=500` (or larger) to fetch all records in a single request. At time of testing, there were only 249 active listings.

**Response Schema:**
```json
{
  "data": [
    {
      "puesto": {
        "id": 78106,
        "titulo": "Operario de Almacén",
        "descripcion": "Persona responsable de recibir, organizar...",
        "actividadEconomica": 186,       // FK -> conceptos.actividadEconomica
        "salarioOfrecido": null,          // FK -> conceptos.salario (nullable)
        "tipoContrato": 78,              // FK -> conceptos.tipoContrato
        "tipoJornada": 85,               // FK -> conceptos.tipoJornada
        "estado": 341,                   // FK -> conceptos.estadoPuesto
        "idProvincia": 25,               // FK -> regionesFlat
        "idMunicipio": 116,              // FK -> regionesFlat
        "nivelAcademico": null,           // FK -> conceptos.nivelAcademico
        "cantidad": 1,                   // Number of openings
        "fechaPublicacion": "2026-03-23T12:36:57.4",
        "fechaVencimiento": "2026-04-22T16:34:43.353",
        "fechaAplicacion": "2026-04-23T04:00:00",
        "fechaInactivo": null,
        "idEmpresa": 2407723,
        "idEstablecimiento": 11499588,
        "idAnalista": 900177,
        "periodoCobro": 92,              // FK -> conceptos.periodoCobro
        "disponibilidadHorario": 323,
        "formaCreacion": 322,
        "tipoPuesto": 334,
        "fechaIncorporacion": 344,
        "barrerasArquitectonicas": false,
        "conocimientoInformatica": false,
        "facilidadesTransporte": false,
        "poseeLicenciaConducir": false,
        "prefiereDiscapacidad": false,
        "vehiculoPropio": false,
        "viajarAlExtranjero": false,
        "viajarAlInterior": false,
        "gestionadoAnalista": true,
        "capturadoFeria": false,
        "incluyeAlmuerzo": false,
        "incluyeEstipendioAdicionalAlmuerzo": false,
        "incluyeEstipendioAdicionalTransporte": false,
        "publicadoParaJornada": false,
        "idiomasRequeridos": [],
        "cantidadOriginal": 1,
        "sexo": null,
        "edadDesde": null,
        "edadHasta": null,
        "ocupacionPrincipal": null,
        "idOcupacion": null,
        "pais": null
      }
    }
  ],
  "currentPage": 1,
  "pageCount": 13,
  "pageSize": 20,
  "rowCount": 249,
  "filterParams": {},
  "orderParams": {}
}
```

#### `GET /api/metadata` — Portal Statistics

**Full URL:** `https://empleateya.mt.gob.do/api/metadata`
**Auth:** None
**Response:**
```json
{
  "countEmpresas": 13275,
  "countCandidatos": 691299,
  "countPuestos": 36156,
  "countCandidatosColocados": 11221,
  "countTalleres": 1
}
```
Note: `countPuestos` (36,156) is total historical; only 249 are currently active.

#### `GET /api/categorias-destacadas` — Top Sectors by Active Listings

**Full URL:** `https://empleateya.mt.gob.do/api/categorias-destacadas`
**Auth:** None
**Response:** Array of `{actividadEconomica, cantidad}` sorted by count descending.
```json
[
  {"actividadEconomica": 196, "cantidad": 6041},
  {"actividadEconomica": 179, "cantidad": 5712},
  {"actividadEconomica": 164, "cantidad": 4455},
  ...
]
```

#### `GET /api/conceptos` — All Lookup Tables (Catalogs)

**Full URL:** `https://empleateya.mt.gob.do/api/conceptos`
**Auth:** None
**Response:** Object with 46 lookup categories. Key ones for job data:

| Category | Items | Description |
|---|---|---|
| `actividadEconomica` | 50 | Economic sectors (Servicios, Hotelería, Comercio, etc.) |
| `salario` | 8 | Salary ranges (RD$ 5,000 to 45,000+) |
| `tipoContrato` | 8 | Contract types (Indefinido, Cierto Tiempo, Pasante, etc.) |
| `tipoJornada` | 5 | Work schedule (Completa, Parcial, Rotativa, Mixto) |
| `estadoPuesto` | 4 | Listing status (Activo, Inactivo, Suspendido) |
| `nivelAcademico` | 39 | Education levels (Inicial through Doctorado) |
| `carreras` | 62 | University majors |
| `ramasCarreras` | 14 | Career branches |
| `experiencia` | 5 | Experience levels |
| `idiomas` | 7 | Languages |
| `nacionalidad` | 164 | Nationalities |

#### `GET /api/conceptos/regionesFlat` — Provinces & Municipalities

**Full URL:** `https://empleateya.mt.gob.do/api/conceptos/regionesFlat`
**Auth:** None
**Response:** Flat key-value map: `{"1": "CIBAO NORDESTE", "2": "CIBAO NOROESTE", ..., "41": "Distrito Nacional", "42": "Santo Domingo", ...}`
Contains: 10 regions, 32 provinces, 155+ municipalities.

#### `GET /api/otes` — Ministry Regional Offices

**Full URL:** `https://empleateya.mt.gob.do/api/otes`
**Auth:** None
**Response:** Array of office objects with contact info, location, Google Maps URLs, and service statistics.

#### `GET /api/talleres` — Workshops/Training Events

**Full URL:** `https://empleateya.mt.gob.do/api/talleres`
**Auth:** None

### 2.2 Squidex CMS Endpoints (Auth Required but Credentials Public)

The CMS uses Squidex with public client credentials embedded in the JS bundle. Token endpoint:

```
POST https://empleateya.mt.gob.do/cms/identity-server/connect/token
Content-Type: application/x-www-form-urlencoded
Body: grant_type=client_credentials&client_id=senae-cms:senae-website&client_secret=6dHMdlITTfcqBzHMJxFdrPgRSCAinDXgtv2ImbEkYgU=&scope=squidex-api
```

CMS content endpoints (require Bearer token):
- `/cms/api/content/senae-cms/menu-v2`
- `/cms/api/content/senae-cms/inicio`
- `/cms/api/content/senae-cms/noticias`
- `/cms/api/content/senae-cms/nosotros`
- `/cms/api/content/senae-cms/servicios-demandantes`
- `/cms/api/content/senae-cms/servicios-empresas`
- `/cms/api/content/senae-cms/footer`
- `/cms/api/content/senae-cms/bannerestadisticas`
- `/cms/api/content/senae-cms/jornadas`
- `/cms/api/content/senae-cms/politicas-privacidad`
- `/cms/api/content/senae-cms/terminos-uso`
- `/cms/api/content/senae-cms/busquedabanner`

These contain editorial content (menus, banners, etc.) — not job data.

### 2.3 Non-Working / Not Found
- `https://rdtrabaja.mt.gob.do/robots.txt` — 404
- `https://rdtrabaja.mt.gob.do/sitemap.xml` — 404
- `https://webapi.mt.gob.do/` — not tested (not referenced in codebase)

---

## 3. Key Lookup Tables — Decoded Values

### Salary Ranges (`salarioOfrecido` field)
| Code | Range |
|---|---|
| 297 | Salario Mínimo |
| 298 | RD$ 5,000 – 10,000 |
| 299 | RD$ 10,001 – 15,000 |
| 300 | RD$ 15,001 – 20,000 |
| 301 | RD$ 20,001 – 25,000 |
| 302 | RD$ 25,001 – 35,000 |
| 303 | RD$ 35,001 – 45,000 |
| 304 | Más de RD$ 45,000 |

### Top Economic Sectors (`actividadEconomica` field)
| Code | Sector |
|---|---|
| 196 | Servicios |
| 179 | Hotelería |
| 164 | Comercio |
| 430 | Administrativa |
| 190 | Otra |
| 44 | Alimenticia |
| 186 | Manufactura |
| 2163 | Industria |
| 165 | Construcción |
| 194 | Salud |
| 176 | Gastronomía |
| 47 | Automotriz |
| 201 | Turismo |
| 182 | Informática / Tecnología |

---

## 4. Data Quality Observations

- **Volume:** Only 249 active listings at time of testing (2026-03-23). This is a small dataset compared to the 36,156 historical total.
- **Salary field:** Many listings have `salarioOfrecido: null` — salary is optional and often omitted.
- **Province/Municipality:** Some listings have null `idProvincia`/`idMunicipio`.
- **Company names:** Not exposed in the API response. Only `idEmpresa` and `idEstablecimiento` IDs are returned.
- **Occupation codes:** `idOcupacion` is always null in tested records, suggesting the CIUO classification is not being used.
- **Pagination bug:** The `Page` parameter is ignored; all requests return page 1. Use large `PageSize` to fetch all records.

---

## 5. Recommended Scraping Strategy

### Recommended: Direct API Calls (No Playwright Needed)

**The API is fully open and returns structured JSON.** There is no need for Playwright/browser scraping.

**Ingestion approach:**
1. Fetch all active listings: `GET https://empleateya.mt.gob.do/api/puestos?PageSize=500`
2. Fetch lookup tables: `GET https://empleateya.mt.gob.do/api/conceptos`
3. Fetch geography: `GET https://empleateya.mt.gob.do/api/conceptos/regionesFlat`
4. Fetch statistics: `GET https://empleateya.mt.gob.do/api/metadata`
5. Fetch sector totals: `GET https://empleateya.mt.gob.do/api/categorias-destacadas`

**Frequency:** Daily snapshot recommended. The active listing count is small (~250) so a single request suffices.

**Normalization:** Join `puesto.actividadEconomica` with `conceptos.actividadEconomica` to get sector names. Join `puesto.salarioOfrecido` with `conceptos.salario` for salary ranges. Join `puesto.idProvincia`/`idMunicipio` with `regionesFlat` for geography.

### Rate Limiting & Authentication
- **No authentication** required for `/api/*` endpoints
- **No rate limiting** observed during testing
- **No CORS restrictions** on API responses
- **Content-Security-Policy** allows connections to `empleateya.mt.gob.do`

### Limitations
- No historical data accessible — API only returns currently active listings
- No company names — only numeric IDs
- No occupation classification (CIUO) — `idOcupacion` always null
- Pagination is broken (Page param ignored) — but PageSize workaround is sufficient given the small dataset
- Salary is a range code, not an exact value

---

## 6. Security Headers

```
Server: Kestrel
X-Powered-By: ASP.NET
Content-Security-Policy: default-src 'self'; connect-src 'self' https://empleateya.mt.gob.do
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000
```
