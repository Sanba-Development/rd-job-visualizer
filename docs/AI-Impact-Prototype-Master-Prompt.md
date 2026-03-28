# AI Workforce Impact Prototype — Master Prompt Package
## For immediate execution in the jobs.sanba.dev repository

**Context:** This prompt package is designed to be run via Claude Code (or equivalent) directly in the Sanba Development jobs.sanba.dev repository. It produces a working prototype of the Vulnerability / Susceptibility / Adaptability (V/S/A) scoring and visualization as a sprint deliverable.

**Assumptions:**
- TAF = 1.0 for all occupations (AIOE baseline parity — no Dominican adjustment in prototype)
- V-Score uses available Sanba salary data + hardcoded sector informality rates from ENCFT 2025
- S-Score uses AIOE baselines mapped to ISCO-08 major groups
- A-Score uses a simplified skill-transferability + education proxy
- Visualization integrates with existing treemap or creates a companion page

---

## MASTER PROMPT (Single-Shot Version)

Copy everything below the line and run it as a single prompt in Claude Code from the repository root.

---

```
I'm working on the jobs.sanba.dev project — a Dominican Republic employment data visualizer with 262K+ records across 12 economic sectors from government sources (MAP, TSS, ENCFT, DGII, CNZFE). 

I need you to build a prototype AI workforce impact assessment module that scores Dominican occupations on three dimensions — Vulnerability, AI Susceptibility, and Adaptability — and visualizes the results. This is for a sprint demo this week, so we're prioritizing a working prototype over perfection.

## Step 1: Explore the repository

First, explore the repository structure to understand:
1. How the data is organized (JSON files, CSV, API endpoints)
2. The existing treemap page structure (src/treemap.html and related JS)
3. The occupation/sector taxonomy already in use
4. The color palette and design language (src/color-palette.html)
5. Any existing data pipeline or build process

Read the key files before writing any code. I need you to understand the data model.

## Step 2: Build the AI Impact Scoring Engine

Create a new JavaScript module (src/ai-impact-scores.js) that computes three scores (0-100) for each occupation in the dataset.

### 2.1 AIOE-to-ISCO Mapping (Hardcoded Baseline)

Use these AIOE baseline scores mapped to ISCO-08 major occupation groups. These come from the Felten et al. (2021) AI Occupational Exposure Index, normalized 0-100, and represent each group's average AI exposure:

```javascript
const AIOE_ISCO_MAP = {
  // ISCO Major Group → Average AIOE score (0-100)
  // Higher = more exposed to AI
  "1": 68,  // Managers
  "2": 72,  // Professionals  
  "3": 65,  // Technicians and Associate Professionals
  "4": 75,  // Clerical Support Workers (highest exposure group)
  "5": 38,  // Service and Sales Workers
  "6": 18,  // Skilled Agricultural Workers
  "7": 20,  // Craft and Related Trades Workers
  "8": 30,  // Plant and Machine Operators
  "9": 12,  // Elementary Occupations (lowest exposure)
};
```

For more granular mapping, use these occupation-specific overrides when the data allows matching at a more specific level:

```javascript
const AIOE_OCCUPATION_OVERRIDES = {
  // Occupation keyword → AIOE score
  // These override the ISCO major group score when matched
  "call center": 82, "centro de llamadas": 82, "telemarketing": 82,
  "data entry": 85, "digitador": 85, "digitación": 85,
  "contab": 79, "contador": 79, "bookkeep": 79,
  "cajero": 62, "cashier": 62, "caja": 58,
  "recepcion": 72, "reception": 72,
  "secretar": 70, "administrative assistant": 74, "auxiliar admin": 74,
  "analista financ": 85, "financial analyst": 85,
  "software": 88, "programador": 88, "developer": 88, "desarrollador": 88,
  "abogado": 76, "lawyer": 76, "legal": 70,
  "periodista": 67, "journalist": 67, "comunicador": 65,
  "diseñador": 64, "designer": 64, "gráfico": 64,
  "agente de seguro": 73, "insurance": 73,
  "vendedor": 45, "sales": 42, "dependiente": 42,
  "maestro": 45, "profesor": 45, "teacher": 45, "docente": 45,
  "médico": 62, "doctor": 62, "physician": 62,
  "enfermero": 38, "nurse": 38, "enfermería": 38,
  "farmacéutico": 66, "pharmacist": 66,
  "ingeniero civil": 55, "arquitecto": 55,
  "chofer": 28, "conductor": 28, "driver": 28, "motorista": 28,
  "constructor": 15, "albañil": 12, "construcción": 15, "obrero": 15,
  "agrícola": 16, "agricultor": 16, "agropecuario": 18,
  "seguridad": 28, "vigilante": 25, "guardia": 25,
  "limpieza": 10, "conserje": 10, "cleaning": 10,
  "cociner": 22, "chef": 25, "cook": 22,
  "mesero": 24, "camarero": 24, "waiter": 24,
  "peluquer": 8, "estilista": 8, "barbero": 8,
  "electricista": 19, "plomero": 14, "mecánico": 21,
  "doméstic": 10, "domestic": 10,
  "gerente": 68, "supervisor": 62, "manager": 68, "director": 70,
  "operador zona franca": 45, "ensamblaje": 42, "assembly": 42,
  "funcionario": 65, "servidor público": 62,
  "colmado": 20, "comerciante informal": 22,
};
```

The matching function should normalize text (lowercase, remove accents) and try keyword matching against occupation titles in the Sanba data. If no keyword match, fall back to ISCO major group. If no ISCO mapping, estimate from sector averages.

### 2.2 Vulnerability Score (V-Score)

Compute V-Score (0-100, where 100 = maximum vulnerability) from available data:

```javascript
// Component 1: Income Vulnerability (weight: 0.35)
// Based on salary relative to sector minimum wage thresholds
// If salary data available: score = max(0, 100 * (1 - salary / (1.5 * sector_min_wage)))
// If not: use sector-level proxy

const SECTOR_MIN_WAGE_PROXY = {
  // Sector → approximate average monthly salary RD$ (from TSS/Sanba data)
  // These are rough midpoints; the prototype will use actual Sanba salary data where available
  "Administración Pública": 32000,
  "Agricultura": 15000,
  "Comercio": 22000,
  "Construcción": 18000,
  "Electricidad, Gas y Agua": 45000,
  "Hoteles, Bares y Restaurantes": 18000,
  "Industria": 25000,
  "Intermediación Financiera": 55000,
  "Manufactura": 22000,
  "Minas y Canteras": 28000,
  "Salud": 35000,
  "Servicios": 28000,
  "TIC": 45000,
  "Telecomunicaciones": 42000,
  "Transporte": 20000,
  "Turismo": 20000,
  "Zona Franca": 16000,
  "Otros": 25000,
};

// Component 2: Informality Score (weight: 0.30)
const SECTOR_INFORMALITY = {
  // Sector → informality rate (ENCFT 2025 data)
  "Administración Pública": 0.05,
  "Agricultura": 0.80,
  "Comercio": 0.60,
  "Construcción": 0.854,
  "Electricidad, Gas y Agua": 0.15,
  "Hoteles, Bares y Restaurantes": 0.55,
  "Industria": 0.35,
  "Intermediación Financiera": 0.10,
  "Manufactura": 0.35,
  "Minas y Canteras": 0.40,
  "Salud": 0.30,
  "Servicios": 0.50,
  "TIC": 0.15,
  "Telecomunicaciones": 0.12,
  "Transporte": 0.70,
  "Turismo": 0.55,
  "Zona Franca": 0.05,
  "Otros": 0.54,
};

// Component 3: Education/Skills Proxy (weight: 0.20)
// Map AIOE inversely: high-AIOE jobs tend to require more education = lower vulnerability
// Low-AIOE manual jobs tend to have lower education = higher vulnerability
// This is a simplification but directionally correct for the prototype
// education_vulnerability = occupation requires low education ? high : low
// Proxy: if AIOE < 30 (manual work), education vulnerability = 75
//        if AIOE 30-60, education vulnerability = 50
//        if AIOE > 60, education vulnerability = 25

// Component 4: Savings Capacity Proxy (weight: 0.15)  
// Use salary relative to canasta básica familiar (~RD$45,000/month national avg)
// savings_vulnerability = max(0, 100 * (1 - max(0, salary - 45000) / salary))
// Workers below canasta básica = score 100
```

V-Score formula:
```
V = (0.35 × income_vuln) + (0.30 × informality × 100) + (0.20 × education_vuln) + (0.15 × savings_vuln)
```

### 2.3 AI Susceptibility Score (S-Score)

For the prototype, S-Score = AIOE score (with keyword overrides). We skip the Dominican Task Adjustment Factor (TAF=1.0) and temporal layering for now.

Provide three temporal estimates as simple multipliers for display:
- Short-term (2026-2028): S × 0.3 (only early adopters)
- Medium-term (2028-2032): S × 0.6 (broader adoption)
- Long-term (2032+): S × 0.9 (widespread adoption)

### 2.4 Adaptability Score (A-Score)

Simplified for prototype. A-Score (0-100, where 100 = highly adaptable):

```javascript
// Proxy based on two factors:
// 1. Skill diversity (higher AIOE often = more transferable cognitive skills = higher adaptability)
//    But very high AIOE (>80) means specialized technical skills that may narrow options
//    adaptability_from_skills = AIOE < 30 ? 20 : AIOE < 50 ? 40 : AIOE < 70 ? 60 : AIOE < 85 ? 70 : 55

// 2. Education level proxy (inverse of education vulnerability)
//    adaptability_from_education = 100 - education_vulnerability

// A = (0.5 × adaptability_from_skills) + (0.5 × adaptability_from_education)
```

### 2.5 Compound Risk Zone Classification

```javascript
function classifyZone(v, s, a) {
  // s here is the raw S-Score (not temporally adjusted)
  if (v > 60 && s > 55 && a < 45) return "red";       // Critical Priority
  if (v > 35 && s > 55 && a < 60) return "orange";     // Urgent Attention  
  if (v <= 35 && s > 55 && a >= 55) return "yellow";   // Strategic Monitoring
  if (s <= 40) return "green";                          // AI Opportunity / Low Exposure
  return "amber";                                       // Mixed / Needs Context
}

const ZONE_LABELS = {
  red: "Zona Crítica",
  orange: "Atención Urgente", 
  yellow: "Monitoreo Estratégico",
  green: "Oportunidad IA",
  amber: "Evaluación Contextual"
};

const ZONE_COLORS = {
  red: "#DC2626",
  orange: "#F59E0B",
  yellow: "#FBBF24",
  green: "#10B981",
  amber: "#F97316"
};
```

## Step 3: Build the Visualization

Create a new page (src/ai-impact.html) that displays the AI impact assessment. It should:

### 3.1 Page Structure

1. **Header section** with title "Impacto de la IA en el Empleo Dominicano" and subtitle "Evaluación de Vulnerabilidad, Susceptibilidad e Adaptabilidad"
2. **Summary dashboard** showing:
   - Total workers analyzed
   - % in each risk zone (Red/Orange/Yellow/Green)
   - Three "speedometer" or gauge visualizations showing national average V, S, A scores
3. **Interactive scatter plot** (the hero visualization):
   - X-axis: AI Susceptibility (S-Score, 0-100)
   - Y-axis: Vulnerability (V-Score, 0-100)
   - Bubble size: employment volume
   - Bubble color: Risk Zone (Red/Orange/Yellow/Green)
   - Hover tooltip: occupation name, sector, V/S/A scores, employment count, average salary
   - Quadrant labels: top-right = "ZONA CRÍTICA", top-left = "Vulnerables pero protegidos de IA", bottom-right = "Expuestos pero resilientes", bottom-left = "Zona segura"
4. **Sector breakdown table** showing aggregated V/S/A scores per sector, sorted by compound risk
5. **Occupation detail panel** (appears on click): shows the full scoring breakdown for a selected occupation
6. **Temporal slider** that adjusts S-Scores between short/medium/long-term and re-renders the scatter plot
7. **Methodology note** at the bottom explaining the scoring approach, data sources, and limitations

### 3.2 Design Requirements

- Match the existing Sanba design language (check src/treemap.html, color-palette.html for the existing styles)
- Dark theme if the existing site uses dark theme
- Responsive (mobile-friendly)
- Use D3.js if it's already in the project; otherwise vanilla JS or whatever charting library is already available
- Spanish language throughout (this is a Dominican project)
- Include a link back to the main treemap and vice versa

### 3.3 Data Flow

The scoring module should:
1. Load the same data source as the treemap (check how treemap.html loads its data)
2. Apply the V/S/A scoring to each record or aggregated occupation group
3. Pass scored data to the visualization

If the treemap data is organized by sector → occupation, maintain that hierarchy.

## Step 4: Integration Points

1. Add a navigation link from the existing treemap page to the new AI impact page and vice versa
2. If there's a data pipeline (e.g., a build script that processes raw data), integrate the scoring into it
3. Add the AI impact page to any navigation menus or index pages

## Step 5: Documentation

Add a methodology section either inline on the page or as a separate src/ai-methodology.html that explains:

- What V, S, and A scores measure
- Data sources (AIOE from Felten et al. 2021, ENCFT 2025, TSS, Sanba data)
- Limitations: TAF=1.0 assumed (no Dominican task adjustment yet), simplified A-Score, sector-level proxies where occupation-level data unavailable
- Scoring formulas
- Risk zone classification logic
- Citation: "Metodología basada en el AI Occupational Exposure Index (Felten, Raj & Seamans, 2021), adaptada para el contexto dominicano por CEMI.ai / Sanba Development"
- Link to the iBizai article: https://ibizai.io/explore/opinions/the-intelligence-transition

## Important Notes

- This is a PROTOTYPE for sprint demo. Prioritize a working, visually impressive visualization over scoring perfection.
- If the existing data doesn't have occupation-level granularity, score at the sector level and note this as a limitation.
- The scatter plot is the hero — it should be beautiful and immediately communicative. Someone looking at it for 5 seconds should understand: big red bubbles top-right = crisis; small green bubbles bottom-left = safe.
- All text in Spanish.
- Don't break anything in the existing treemap — this is an addition, not a modification.

Please start by exploring the repository structure, then build this step by step. Show me the plan before writing code.
```

---

## ALTERNATIVE: Phased Prompts (If You Prefer Incremental Execution)

If you'd rather run this in stages, here are three sequential prompts:

### PROMPT 1: Explore + Plan

```
Explore this repository structure completely. I need you to understand:
1. The data model — how are employment records organized? What fields exist (occupation, sector, salary, count)?
2. The treemap page — how does src/treemap.html load and render data?
3. The tech stack — what libraries, frameworks, build tools are in use?
4. The design system — colors, fonts, layout patterns from existing pages

Read all key files. Then give me a summary of:
- The data structure and available fields
- How I should integrate a new AI impact scoring module
- Any constraints or dependencies I need to know about

Don't write any code yet — just explore and report.
```

### PROMPT 2: Build the Scoring Engine

```
Based on your exploration, build a JavaScript module (src/ai-impact-scores.js) that:

1. Takes the existing occupation/sector data from the Sanba pipeline
2. Computes three scores for each occupation or sector:
   - Vulnerability (V-Score, 0-100): based on salary data + hardcoded sector informality rates
   - AI Susceptibility (S-Score, 0-100): based on AIOE baseline scores mapped to occupations by keyword matching
   - Adaptability (A-Score, 0-100): simplified proxy from skill diversity + education level
3. Classifies each into a risk zone: Red (Zona Crítica), Orange (Atención Urgente), Yellow (Monitoreo), Green (Oportunidad IA)
4. Exports the scored data for visualization

Use these hardcoded reference values:

[INSERT THE AIOE MAPS, INFORMALITY RATES, AND SALARY PROXIES FROM THE MASTER PROMPT ABOVE]

Make the module work with whatever data format the existing treemap uses. If occupation-level granularity isn't available, score at sector level.
```

### PROMPT 3: Build the Visualization

```
Now build the interactive visualization page (src/ai-impact.html) that uses the scoring module from ai-impact-scores.js.

The hero visualization is an interactive scatter plot:
- X-axis: AI Susceptibility (0-100)  
- Y-axis: Vulnerability (0-100)
- Bubble size: employment volume
- Bubble color: Risk Zone (red/orange/yellow/green)
- Quadrant labels in Spanish
- Hover tooltips with full details
- Temporal slider (2026-2028 / 2028-2032 / 2032+) that adjusts S-Scores

Add:
- Summary dashboard with aggregate stats at the top
- Sector breakdown table below the chart
- Methodology note at the bottom
- Navigation links to/from the treemap

Match the existing design language. All text in Spanish. Mobile-responsive.

This is a sprint demo prototype — prioritize visual impact and interactivity over scoring perfection.
```

---

## CONTEXT DOCUMENT (Paste into Claude Code's project context or as a reference file)

Save this as `docs/ai-impact-methodology.md` in the repository:

```markdown
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
| Zona Crítica | 🔴 Rojo | V>60, S>55, A<45 | Prioridad inmediata: alta vulnerabilidad + alta exposición a IA + baja adaptabilidad |
| Atención Urgente | 🟠 Naranja | V>35, S>55, A<60 | Requiere programas de reconversión y apoyo transicional |
| Monitoreo Estratégico | 🟡 Amarillo | V≤35, S>55, A≥55 | Expuestos pero resilientes — el mercado puede autocorregir |
| Oportunidad IA | 🟢 Verde | S≤40 | Baja exposición a IA — enfoque en aprovechar beneficios |

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
```

---

## PRE-FLIGHT CHECKLIST

Before running the master prompt, confirm:

- [ ] You're in the jobs.sanba.dev repository root
- [ ] The treemap data files are accessible (check src/ or data/ directories)
- [ ] D3.js or an equivalent charting library is already available in the project
- [ ] You know where the navigation/menu is defined (to add the link to the new page)
- [ ] Git branch created for this feature (suggested: `feature/ai-impact-assessment`)

## POST-BUILD CHECKLIST

After the prototype is built:

- [ ] Scatter plot renders with real data from Sanba pipeline
- [ ] Bubbles are colored by risk zone and sized by employment volume
- [ ] Temporal slider changes the S-Score multiplier and re-renders
- [ ] Hover tooltips show V/S/A breakdown
- [ ] Sector summary table displays below the chart
- [ ] Navigation works: treemap ↔ AI impact page
- [ ] Mobile responsive
- [ ] Methodology note is visible and accurate
- [ ] No existing functionality broken
