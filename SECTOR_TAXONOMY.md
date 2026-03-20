# Taxonomía de Sectores — RD Job Visualizer

> Basada en CIUO-08 (Clasificación Internacional Uniforme de Ocupaciones) adaptada al contexto económico dominicano.
> Última actualización: 20 de marzo de 2026

---

## Sectores de Primer Nivel (Treemap)

Se definen **12 sectores** que cubren la totalidad del mercado laboral dominicano, balanceando la clasificación estándar CIUO-08 con la realidad económica del país.

| # | Sector | Color Treemap | Código CIIU Rev.4 | Justificación |
|---|--------|--------------|-------------------|---------------|
| 1 | **Administración Pública y Defensa** | `#3B82F6` (Azul) | O | Mayor dataset disponible (MAP nómina). ~400k empleados públicos. |
| 2 | **Turismo y Hostelería** | `#F59E0B` (Ámbar) | I | Motor económico #1 de RD. ~300k empleos directos. Hoteles, restaurantes, tour operadores. |
| 3 | **Comercio** | `#8B5CF6` (Violeta) | G | Retail, wholesale, colmados, supermercados. Sector con mayor empleo informal. |
| 4 | **Construcción** | `#F97316` (Naranja) | F | Sector dinámico, alta inversión público-privada. Proyectos de infraestructura. |
| 5 | **Manufactura y Zonas Francas** | `#EF4444` (Rojo) | C | Datos CNZFE disponibles. Textil, tabaco, dispositivos médicos, electrónica. |
| 6 | **Tecnología y Telecomunicaciones** | `#06B6D4` (Cyan) | J | Alta demanda, Cámara TIC, sector en crecimiento. Salarios más altos. |
| 7 | **Salud** | `#10B981` (Esmeralda) | Q | Hospitales, clínicas, farmacias. Sector regulado con datos públicos. |
| 8 | **Educación** | `#6366F1` (Índigo) | P | Público (MINERD/MESCyT) y privado. Gran empleador estatal. |
| 9 | **Servicios Financieros** | `#14B8A6` (Teal) | K | Banca, seguros, fintech (Adofintech). Sector regulado con alta formalidad. |
| 10 | **Transporte y Logística** | `#A855F7` (Púrpura) | H | Puertos, aeropuertos, concho/OMSA, delivery, logística e-commerce. |
| 11 | **Agricultura y Agroindustria** | `#22C55E` (Verde) | A | Sector rural significativo. Caña, cacao, tabaco, banano, arroz. |
| 12 | **Otros Servicios** | `#64748B` (Slate) | R,S,T,U | Entretenimiento, servicios personales, ONGs, organismos internacionales, servicios domésticos. |

---

## Mapping de Fuentes a Sectores

### MAP Nómina → Sectores del Treemap

| Institución MAP | Sector Asignado |
|----------------|-----------------|
| Ministerios, Cámara de Diputados, Senado, JCE, etc. | Administración Pública y Defensa |
| Ministerio de Turismo, ASONAHORES | Turismo y Hostelería |
| DIGEMAPS, Pro Consumidor | Comercio |
| MOPC, OISOE | Construcción |
| CNZFE, PROINDUSTRIA | Manufactura y Zonas Francas |
| INDOTEL, OGTIC | Tecnología y Telecomunicaciones |
| SNS, MSP, SENASA | Salud |
| MINERD, MESCyT, INAFOCAM | Educación |
| Superintendencia de Bancos, SIPEN | Servicios Financieros |
| INTRANT, Autoridad Portuaria | Transporte y Logística |
| Ministerio de Agricultura, IDIAF, INDRHI | Agricultura y Agroindustria |
| Resto | Otros Servicios |

### CIUO-08 Grandes Grupos → Sectores

| Grupo CIUO-08 | Descripción | Sector(es) Probable(s) |
|---------------|-------------|----------------------|
| 1 | Directores y gerentes | Distribuido (según industria) |
| 2 | Profesionales científicos e intelectuales | Tecnología, Salud, Educación, Financiero |
| 3 | Técnicos y profesionales de nivel medio | Distribuido |
| 4 | Personal de apoyo administrativo | Administración Pública, Financiero |
| 5 | Trabajadores de servicios y vendedores | Comercio, Turismo |
| 6 | Agricultores y trabajadores agropecuarios | Agricultura |
| 7 | Oficiales, operarios y artesanos | Construcción, Manufactura |
| 8 | Operadores de instalaciones y máquinas | Manufactura, Transporte |
| 9 | Ocupaciones elementales | Otros Servicios, Comercio |
| 0 | Fuerzas armadas | Administración Pública y Defensa |

---

## Subsectores (Drill-down, Fase 2)

Para el MVP, los 12 sectores de primer nivel son suficientes. En caso de tener tiempo para drill-down:

### Administración Pública y Defensa
- Gobierno Central (Ministerios)
- Poder Legislativo
- Poder Judicial
- Organismos Autónomos
- Fuerzas Armadas y Policía

### Turismo y Hostelería
- Hoteles y Resorts
- Restaurantes y Gastronomía
- Tour Operadores y Agencias
- Transporte Turístico

### Tecnología y Telecomunicaciones
- Desarrollo de Software
- Telecomunicaciones (Claro, Altice, Viva)
- Servicios IT / Consultoría
- Fintech y Startups

### Manufactura y Zonas Francas
- Textil y Confección
- Dispositivos Médicos
- Tabaco y Cigarros
- Electrónica y Componentes
- Agroindustrial

---

## Notas Metodológicas

1. **Informalidad:** La ENCFT estima ~58% de informalidad en RD. Los datos de MAP y TSS solo cubren el sector formal. El treemap debe indicar que representa empleo formal + vacantes publicadas, no el mercado total.

2. **Clasificación automática:** Los títulos de puestos del MAP no vienen pre-clasificados por sector CIUO. Se usará un mapping por institución (tabla arriba) + opcionalmente Claude para clasificar títulos ambiguos.

3. **Superposición:** Algunos empleos podrían pertenecer a 2 sectores (ej: un desarrollador en el Ministerio de Salud → ¿Tecnología o Salud?). Regla: se asigna al sector de la **institución empleadora**, no de la función del puesto.

4. **Ponderación:** El tamaño de cada celda del treemap se determina por **volumen de empleos** (no por salario ni por número de vacantes), para representar la distribución real del mercado.

5. **Colores:** La paleta usa colores distintos y accesibles (WCAG AA contrast). Se evitan combinaciones rojo/verde para daltonismo.
