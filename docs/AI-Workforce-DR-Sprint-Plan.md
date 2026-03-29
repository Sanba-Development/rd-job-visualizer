# AI Workforce Impact DR — Phase 1 Sprint Plan
## 2-3 Week Execution Roadmap

**Team:** Sanba Development + CEMI.ai  
**Sprint Start:** Week of March 31, 2026  
**Sprint End:** April 18, 2026  
**Objective:** Complete V/S/A scoring for priority occupations, produce Compound Risk Matrix, and integrate into Sanba Job Visualizer

---

## Sprint Philosophy

The Pareto insight from the Sanba data (3.12x ratio) tells us that a small number of occupation categories drive most of the employment. In a 2-3 week sprint, we don't score 700 occupations — we score the **top 30-40 that account for ~70% of Dominican formal employment**, then extrapolate to the rest using cluster-based estimation.

This is not cutting corners — it's the same approach the IMF used in their 2024 SDN and the IDB used in their GENOE work. Score the high-impact occupations rigorously; estimate the rest from occupational family patterns.

---

## Week 1: Data Foundation + Vulnerability Index (Phase 0 + V-Score)

### Day 1-2: Occupation Taxonomy & ISCO Crosswalk

**Goal:** Map Sanba's occupation categories to ISCO-08 codes so we can apply international AI exposure scores.

**Tasks:**
- Export Sanba's occupation taxonomy (the categories used in the treemap and drill-down)
- Map each to 2-digit ISCO-08 codes (10 major groups) as a minimum; 4-digit ISCO-08 for the top 30 occupations where granularity matters
- Download Felten et al. AIOE dataset from GitHub (github.com/AIOE-Data/AIOE) — it provides SOC-level scores that have been crosswalked to ISCO by the World Bank
- Build a concordance table: Sanba Category → ISCO-08 → AIOE Score

**Crosswalk approach (pragmatic for sprint):**
1. Start with ISCO-08 major groups (1-digit) for broad sectoral mapping
2. Go to 4-digit ISCO-08 for the top 30 occupations
3. Use the World Bank's SOC→ISCO concordance (available in their Policy Research Working Paper 11057 supplementary materials)
4. Where Sanba categories don't map cleanly (Dominican-specific titles like "digitador," "promotor de ventas," etc.), manually assign based on task description

**Deliverable:** Master concordance table (Sanba ↔ ISCO-08 ↔ AIOE score)

### Day 2-3: Identify Priority Occupations

**Goal:** Select the 30-40 occupations that will receive full V/S/A scoring.

**Selection criteria (weighted):**
- Employment volume (from Sanba data) — 40%
- Estimated AI susceptibility (preliminary AIOE) — 25%
- Estimated vulnerability (salary proximity to minimum wage) — 20%
- Strategic importance (policy relevance, media interest) — 15%

**Expected priority list (to be validated against Sanba data):**

| # | Occupation (Estimated) | Sector | Why Priority |
|---|---|---|---|
| 1 | Empleado(a) de oficina / Auxiliar administrativo | Multiple | High volume, high AI susceptibility |
| 2 | Vendedor(a) / Dependiente de comercio | Retail | Highest employment volume sector |
| 3 | Operador(a) de call center | Services/Telecom | Extremely high AI susceptibility |
| 4 | Chofer / Conductor | Transportation | High volume, low direct susceptibility but high vulnerability |
| 5 | Obrero(a) de construcción | Construction | Massive volume, 85% informality |
| 6 | Cajero(a) | Retail/Banking | High susceptibility (self-checkout, digital payments) |
| 7 | Contador(a) / Auxiliar contable | Multiple | Very high AI susceptibility |
| 8 | Maestro(a) / Profesor(a) | Education | High volume, augmentation over displacement |
| 9 | Médico(a) general | Healthcare | High strategic importance, augmentation pathway |
| 10 | Enfermero(a) | Healthcare | High volume, projected growth |
| 11 | Abogado(a) | Legal | High susceptibility for routine legal work |
| 12 | Ingeniero(a) de software / Desarrollador | IT/Services | Very high susceptibility, high media interest |
| 13 | Trabajador(a) agrícola | Agriculture | High volume, low direct susceptibility, high vulnerability |
| 14 | Personal de seguridad / Vigilante | Services | High volume, moderate susceptibility (surveillance AI) |
| 15 | Cocinero(a) / Chef | Tourism/Hospitality | Low susceptibility, high employment |
| 16 | Camarero(a) / Mesero(a) | Tourism/Hospitality | Low susceptibility, high employment |
| 17 | Recepcionista | Multiple | High susceptibility (AI assistants) |
| 18 | Personal de limpieza / Conserje | Services | Low susceptibility, high vulnerability |
| 19 | Técnico(a) eléctrico / Electricista | Construction/Services | Low susceptibility, moderate adaptability |
| 20 | Peluquero(a) / Estilista | Personal services | Zero susceptibility, high informality |
| 21 | Operador(a) de zona franca / Ensamblaje | Manufacturing/FTZ | High volume, moderate susceptibility |
| 22 | Gerente medio / Supervisor(a) | Multiple | High susceptibility (AI analytics replacing oversight) |
| 23 | Analista financiero / Bancario | Banking | Very high susceptibility |
| 24 | Agente de seguros | Insurance | High susceptibility |
| 25 | Periodista / Comunicador(a) | Media | High susceptibility, high media interest (meta!) |
| 26 | Diseñador(a) gráfico | Creative | High susceptibility |
| 27 | Farmacéutico(a) | Healthcare | Moderate susceptibility |
| 28 | Mecánico(a) automotriz | Services | Low susceptibility, moderate volume |
| 29 | Funcionario(a) público / Servidor público | Government | High volume, moderate susceptibility |
| 30 | Trabajador(a) doméstico(a) | Personal services | Very low susceptibility, extreme vulnerability |

**Deliverable:** Validated priority occupation list with employment volumes from Sanba data

### Day 3-5: Vulnerability Index Construction

**Goal:** Compute V-Score (0-100) for each priority occupation.

**Data assembly:**

| V-Score Component | Source | How to Extract |
|---|---|---|
| Income proximity to minimum wage | Sanba salary data + TSS average contributable salary (RD$37,261 as of April 2025) | Compute ratio: occupation median salary / (1.5 × sector minimum wage). Below 1.0 = high vulnerability |
| Informality rate by occupation | ENCFT data (if accessible) or estimate from TSS registration rates by sector | TSS workers in sector / ENCFT employed in sector = formality rate |
| Household dependency ratio | ENCFT household data (may need aggregate proxy by income band) | If unavailable at occupation level, use sector-average from ENCFT |
| Savings capacity | Salary minus provincial cost-of-living estimate | Use BCRD cost-of-living data by province; compute residual as % of income |
| Educational attainment | ENCFT education data by occupation or sector | Average years of education or % with secondary complete |

**Scoring formula:**
```
V-Score = (0.25 × Income_Vulnerability) + (0.25 × Informality_Score) + 
          (0.15 × Dependency_Score) + (0.20 × Savings_Score) + 
          (0.15 × Education_Score)
```

Each component normalized to 0-100 where 100 = maximum vulnerability.

**Practical shortcut for sprint:** If occupation-level data is unavailable for some components, use sector-level averages as proxies and flag the estimation. The Pareto principle applies here too — the top 10 most vulnerable occupations will be obvious regardless of data granularity.

**Deliverable:** V-Score table for 30-40 priority occupations with data source and confidence flag for each component

---

## Week 2: Susceptibility + Adaptability Scoring (S-Score + A-Score)

### Day 6-8: AI Susceptibility Index Construction

**Goal:** Compute S-Score for each priority occupation at three time horizons.

**Step 1: AIOE Baseline**
Apply the Felten et al. AIOE scores via the concordance table built in Week 1. These scores range from 0-100 (normalized from original -2.67 to 1.58 scale).

**Step 2: Dominican Task Adjustment Factor**

For each of the 30-40 priority occupations, estimate a Task Adjustment Factor (TAF) ranging from 0.5 to 1.5:

- **TAF = 1.0** means the Dominican version of the job has roughly the same task composition as the U.S. version
- **TAF < 1.0** means the Dominican version is more relationship-intensive, physical, or informal (reducing AI susceptibility)
- **TAF > 1.0** means the Dominican version is more routinized or concentrated in automatable tasks than the U.S. equivalent

**Sprint approach for TAF:** Rather than a full expert panel (which takes weeks), use a rapid Delphi method:
1. Draft TAF estimates yourself (you know the Dominican labor market intimately)
2. Send to 3-5 trusted colleagues/contacts for blind validation
3. Average the estimates
4. Flag any occupation where estimates diverge by >0.3 for deeper examination

**Step 3: Temporal Adjustment**

For each occupation, estimate S-Score at three horizons:

| Horizon | Adoption Assumption | Adjustment Method |
|---|---|---|
| Short-term (2026-2028) | Only MNCs + large formal firms | S × Sector_Readiness × 0.3 |
| Medium-term (2028-2032) | Mid-market adoption spreads | S × Sector_Readiness × 0.6 |
| Long-term (2032+) | Broad adoption including some SMEs | S × Sector_Readiness × 0.9 |

**Step 4: Informality Discount**

For occupations with high informality rates:
- Short-term: Multiply S-Score by (1 - informality_rate × 0.8) — informality strongly shields from direct displacement
- Medium-term: Multiply S-Score by (1 - informality_rate × 0.4) — indirect effects emerge
- Long-term: Multiply S-Score by (1 - informality_rate × 0.1) — platform effects and market compression fully manifest

**Final S-Score formula:**
```
S-Score(t) = AIOE_base × TAF_DR × Temporal_Adjustment(t) × Informality_Discount(t)
```

**Deliverable:** S-Score table for 30-40 occupations at three time horizons

### Day 8-10: Adaptability Index Construction

**Goal:** Compute A-Score (0-100) for each priority occupation.

**Components:**

| Component | Measurement | Sprint Method |
|---|---|---|
| Skill transferability (30%) | Number of adjacent occupations that share >50% skill overlap | Use O*NET skill profiles crosswalked to ISCO; count adjacent occupations within 0.6 cosine similarity |
| Retraining feasibility (25%) | Estimated months to reach competency in nearest growing occupation | Expert estimation; calibrated to Dominican training infrastructure (INFOTEP, universities, online) |
| Age factor (20%) | Median age of workers in occupation × non-linear penalty | Use ENCFT age distribution by sector if occupation-level unavailable |
| Geographic mobility (25%) | Employment diversity in worker's province | Sanba data can provide sector distribution by province; higher diversity = higher mobility |

**Key Dominican adjustments:**
- INFOTEP capacity is concentrated in urban areas and technical trades — retraining feasibility for rural and service workers is lower
- English proficiency is a massive differentiator for adaptability into growing sectors (BPO, tourism management, tech) — flag occupations where language training is the critical bottleneck
- The Dominican diaspora is a unique adaptability factor — workers with US/PR family networks have migration as an adaptability option that workers in most developing countries lack

**Deliverable:** A-Score table for 30-40 occupations

---

## Week 3: Integration, Compound Risk Matrix & Visualization

### Day 11-12: Compound Risk Matrix

**Goal:** Cross V × S × A to produce the four-zone classification for each occupation.

**Classification algorithm:**
```
IF V > 60 AND S(short) > 60 AND A < 40 → RED ZONE (Critical Priority)
IF V > 30 AND S(medium) > 60 AND A < 60 → ORANGE ZONE (Urgent Attention)
IF V < 30 AND S(any) > 60 AND A > 60 → YELLOW ZONE (Strategic Monitoring)
IF S(long) < 40 → GREEN ZONE (AI Opportunity)
ELSE → Contextual assessment needed
```

**Output tables:**

1. **Master scoring table:** All 30-40 occupations with V, S(3 horizons), A scores and zone classification
2. **Red Zone deep-dive:** Detailed profiles of the 5-8 occupations in the Red Zone, including estimated population size, geographic concentration, gender composition, and recommended intervention
3. **Sector summary:** Aggregated scores by sector with visual heat map

### Day 12-13: Sector Aggregation

**Goal:** Roll up occupation-level scores to sector-level Compound Risk profiles.

**Method:**
For each of the 12 Sanba sectors, compute weighted averages of V, S, and A scores where the weight is the occupation's share of sector employment.

```
Sector_V = Σ (Occupation_V × Occupation_Employment_Share)
Sector_S(t) = Σ (Occupation_S(t) × Occupation_Employment_Share) × Sector_Readiness
Sector_A = Σ (Occupation_A × Occupation_Employment_Share)
```

Apply the Sector AI Readiness multiplier (from the methodology review document) to adjust sector-level S-Scores.

**Deliverable:** Sector risk ranking table + sector comparison visualization

### Day 13-15: Integration with Sanba Visualizer + Documentation

**Goal:** Make the analysis interactive and produce the research substrate document.

**Visualization integration (for the Sanba treemap):**

1. **Color overlay:** Add a toggle to the treemap that switches between employment volume (current) and Compound Risk Zone (Red/Orange/Yellow/Green)
2. **Drill-down enhancement:** When users click on a sector → occupation, show V/S/A scores alongside existing salary and employment data
3. **Temporal slider:** Allow users to switch between short/medium/long-term S-Scores to see how the risk landscape shifts over time

**Documentation:**

1. **Technical methodology document** (academic audience) — describes V/S/A construction, data sources, crosswalk methodology, and limitations
2. **Research substrate** (the neutral analysis) — comprehensive findings, sector-by-sector breakdown, compound risk matrix, data tables
3. **Data appendix** — all scoring tables, concordance maps, and source references

---

## Sprint Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ENCFT microdata not accessible at occupation level | Medium | High | Fall back to sector-level proxies from published BCRD tables |
| ISCO crosswalk ambiguity for Dominican occupational titles | Medium | Medium | Use 2-digit ISCO for ambiguous cases; flag for post-sprint refinement |
| TAF expert validation takes too long | Low | Medium | Proceed with Carlos's estimates + 2 validators minimum; expand panel post-sprint |
| Sanba data quality issues in salary fields | Medium | Medium | Use TSS average contributable salary data as cross-check |
| Scope creep into Phase 2-4 during sprint | High | Medium | Hard boundary: Phase 1 only. Sector aggregation is the ceiling. |

---

## Post-Sprint Pipeline (Phases 2-5)

The sprint delivers Phase 0 + Phase 1 + preliminary Phase 2 (sector aggregation). Remaining phases:

- **Phase 2 completion (Weeks 4-5):** Sector deep-dives, Sector AI Readiness validation, cross-sector analysis
- **Phase 3 (Weeks 5-7):** Empirical cross-validation with full Sanba dataset, TSS data, RD Trabaja demand signals
- **Phase 4 (Weeks 7-9):** Scenario construction (5-7 scenarios), quantified projections
- **Phase 5 (Weeks 9-12):** Policy framework, CEMI.ai persona processing, multi-audience deliverables

---

## Audience-Specific Output Planning

Since you're targeting all four audiences, the research substrate needs to be processable into:

| Audience | Format | Tone | Key Focus |
|---|---|---|---|
| **Policymakers** | Policy brief (5-10 pages) + executive dashboard | Formal, evidence-based, action-oriented | Red Zone population, required investment, program design |
| **Business leaders** | Strategic report + sector-specific guides | Business language, ROI-focused | Sector readiness, augmentation-first strategy, talent pipeline |
| **General public / Media** | Infographic + narrative article + interactive tool | Accessible, personal, relatable | "What does this mean for ME?" — occupation-level risk checker |
| **Academic / Research** | Methodology paper + data tables + replication guide | Rigorous, cited, transparent | Novel contributions (V-Index, Informality Paradox, Compound Matrix) |

The Sanba visualizer serves as the interactive anchor across all audiences — everyone from a senator to a *chiripero* should be able to find their occupation and understand their risk profile.

---

*"The analysis that changes nothing is an exercise in vanity. The analysis that changes everything starts with knowing exactly who is at risk, why, and what can be done — and then making that knowledge impossible to ignore."*
