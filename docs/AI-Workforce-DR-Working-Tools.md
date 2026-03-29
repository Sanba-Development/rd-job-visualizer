# AI Workforce Impact DR — Working Tools Package
## Master Scoring Template + TAF Delphi Instrument + Data Assembly Guide

---

# TOOL 1: Master Occupation Scoring Template

## Priority Occupation List with Preliminary AIOE Mapping

The table below lists 35 priority occupations organized by estimated Compound Risk (Red Zone first). Each includes:
- **ISCO-08 code** for international crosswalk
- **AIOE baseline** (Felten et al., normalized 0-100, where 100 = maximum AI exposure)
- **Preliminary zone estimate** (to be validated through actual V/S/A scoring)

AIOE scores below are mapped from Felten et al.'s SOC→ISCO crosswalk via the World Bank's methodology. Where exact matches aren't available, I've used the nearest occupational family average.

### Tier A: Likely Red Zone (High V + High S + Low A)

| # | Dominican Occupation | ISCO-08 | AIOE Base | Est. V | Est. S | Est. A | Notes |
|---|---|---|---|---|---|---|---|
| 1 | Operador(a) de call center | 4222 | 78 | High | Very High | Low | DR's BPO sector directly exposed; conversational AI already handling 70-80% of standard inquiries globally |
| 2 | Digitador(a) / Data entry | 4132 | 82 | High | Very High | Low | Anthropic's Observed Exposure: 67.1% for data entry keyers — highest observed category |
| 3 | Auxiliar administrativo(a) | 4110 | 74 | High | High | Low-Med | Backbone of formal employment; high volume + high exposure = large affected population |
| 4 | Cajero(a) de banco | 4211 | 71 | Med-High | High | Low-Med | Digital banking + AI tellers; DR banking sector is tech-forward |
| 5 | Cajero(a) de comercio | 5230 | 58 | High | Medium | Low | Self-checkout slower in DR than US, but digital payment acceleration |
| 6 | Recepcionista | 4226 | 72 | Med-High | High | Low-Med | AI scheduling, virtual assistants, chatbots replacing front-desk |
| 7 | Trabajador(a) doméstico(a) | 9111 | 12 | Very High | Very Low | Very Low | Almost zero AI susceptibility, but extreme vulnerability; included for policy completeness |

### Tier B: Likely Orange Zone (Moderate V + High S + Moderate A)

| # | Dominican Occupation | ISCO-08 | AIOE Base | Est. V | Est. S | Est. A | Notes |
|---|---|---|---|---|---|---|---|
| 8 | Contador(a) / Auxiliar contable | 3313/2411 | 79 | Medium | Very High | Medium | Routine bookkeeping highly automatable; advisory work persists |
| 9 | Vendedor(a) / Dependiente | 5223 | 52 | Med-High | Medium | Medium | Physical retail persists in DR; e-commerce penetration still moderate |
| 10 | Agente de seguros | 3321 | 73 | Medium | High | Medium | Insureversia territory — you know this sector intimately |
| 11 | Analista financiero / Bancario | 2413 | 85 | Low-Med | Very High | Med-High | Highest AIOE scores in the economy; but high education = adaptability |
| 12 | Gerente medio / Supervisor(a) | 1211-1439 | 68 | Low-Med | High | Medium | AI analytics replacing oversight tasks; mid-management squeeze |
| 13 | Periodista / Comunicador(a) | 2642 | 67 | Medium | High | Medium | Content generation AI; 42% drop in writer gig availability globally |
| 14 | Diseñador(a) gráfico | 2166 | 64 | Medium | High | Medium | Generative AI for design; but creative direction grows |
| 15 | Operador(a) de zona franca | 8131-8189 | 48 | Med-High | Medium | Low-Med | Assembly automation pressure + nearshoring opportunity = complex dynamics |
| 16 | Funcionario(a) público | 3359/4419 | 65 | Medium | Medium | Low | Government adoption slower but inevitable; 43% of gov employees using AI globally |

### Tier C: Likely Yellow Zone (Low V + High S + High A)

| # | Dominican Occupation | ISCO-08 | AIOE Base | Est. V | Est. S | Est. A | Notes |
|---|---|---|---|---|---|---|---|
| 17 | Ingeniero(a) de software | 2512 | 88 | Low | Very High | High | Programmer employment fell 27.5% in US; but high adaptability |
| 18 | Abogado(a) | 2611 | 76 | Low | High | High | 47.8% of large-firm attorneys using AI; augmentation-first pattern |
| 19 | Médico(a) general | 2211 | 62 | Low | Medium | High | AI diagnostics augment; 11M global shortage means displacement unlikely |
| 20 | Farmacéutico(a) | 2262 | 66 | Low-Med | Medium | Med-High | AI drug interaction checking, prescription automation |
| 21 | Arquitecto(a) / Ingeniero(a) civil | 2161/2142 | 59 | Low | Medium | High | AI design tools augment; physical site work persists |

### Tier D: Likely Green Zone (Low S — AI Opportunity)

| # | Dominican Occupation | ISCO-08 | AIOE Base | Est. V | Est. S | Est. A | Notes |
|---|---|---|---|---|---|---|---|
| 22 | Maestro(a) / Profesor(a) | 2341-2359 | 45 | Medium | Low-Med | Medium | AI as augmentation tool; doubles learning gains per Harvard study |
| 23 | Enfermero(a) | 2221 | 38 | Medium | Low | Med-High | 52% projected growth; AI fills gaps, doesn't displace |
| 24 | Chofer / Conductor | 8322/8331 | 31 | High | Low (DR) | Low | Autonomous driving decades away in DR; high vulnerability from other causes |
| 25 | Obrero(a) de construcción | 9313 | 15 | Very High | Very Low | Low | 85.4% informality; AI impact minimal; structural vulnerability enormous |
| 26 | Cocinero(a) / Chef | 3434/5120 | 22 | Med-High | Very Low | Low-Med | Physical, creative, cultural — AI can't cook moro de guandules |
| 27 | Camarero(a) / Mesero(a) | 5131 | 24 | High | Very Low | Low | Human service is the product in Dominican hospitality |
| 28 | Trabajador(a) agrícola | 6111-6130 | 18 | Very High | Very Low | Very Low | Precision agriculture opportunity, but current workforce barely touched |
| 29 | Personal de seguridad | 5414 | 28 | High | Low-Med | Low | Surveillance AI emerging but physical presence still required |
| 30 | Peluquero(a) / Estilista | 5141 | 8 | Med-High | Near Zero | Low | The last job AI will automate — entirely human-contact |
| 31 | Técnico(a) eléctrico | 7411 | 19 | Medium | Very Low | Medium | Physical trade; potential AI-assisted diagnostics |
| 32 | Mecánico(a) automotriz | 7231 | 21 | Medium | Very Low | Medium | Similar to electrical — physical + diagnostic |
| 33 | Personal de limpieza | 9112 | 10 | Very High | Very Low | Very Low | Negligible AI exposure; maximum structural vulnerability |
| 34 | Plomero(a) | 7126 | 14 | Medium | Very Low | Medium | Physical trade, growing demand |
| 35 | Colmadero(a) / Comerciante informal | 5221 | 20 | Very High | Low (direct) | Very Low | Indirect exposure via platform competition; Dominican cultural institution |

### Key Observations from the Preliminary Map

1. **The Red Zone is concentrated in clerical and administrative occupations** — call center operators, data entry clerks, administrative assistants, cashiers, and receptionists. These are formal-sector jobs held predominantly by women with moderate education and limited savings buffers.

2. **The highest AIOE scores (software engineers, financial analysts, accountants) don't produce the highest compound risk** because these workers have low vulnerability and high adaptability. This is the core insight your framework captures that one-dimensional analyses miss.

3. **The most vulnerable workers (construction, agriculture, domestic service, cleaning) have near-zero AI susceptibility.** Their crisis is structural, not technological. But your framework correctly captures them because vulnerability is measured independently.

4. **The Orange Zone is where policy gets interesting** — workers with moderate vulnerability and high AI susceptibility who *could* adapt with the right support. This is the zone where INFOTEP reform, reskilling programs, and transition insurance produce the highest return on investment.

5. **The informal economy occupations (#25, #28, #30, #33, #35) cluster in Green Zone for direct AI impact but face indirect exposure** through market compression. This is the Informality Paradox in data form.

---

# TOOL 2: Task Adjustment Factor (TAF) Delphi Instrument

## Instructions for Validators

### Background
We're adapting the international AI Occupational Exposure Index (AIOE) to the Dominican Republic. The AIOE was built on U.S. task descriptions — but the same job title in the DR often involves different task compositions. A "financial analyst" in New York spends 80% of their time on data analysis; in Santo Domingo, the same title may spend 40% on client relationships and in-person meetings.

The Task Adjustment Factor (TAF) corrects for this difference.

### Your Task
For each occupation below, rate how the **Dominican version** of the job compares to the **U.S. version** in terms of AI-susceptible task concentration:

- **TAF = 1.0** → Dominican version has roughly the same proportion of AI-automatable tasks as the U.S. version
- **TAF < 1.0** → Dominican version involves MORE human interaction, physical tasks, relationship management, or informal/unstructured work than the U.S. equivalent (i.e., LESS susceptible to AI)
- **TAF > 1.0** → Dominican version is MORE routinized, concentrated in data processing, or reliant on automatable tasks than the U.S. equivalent (i.e., MORE susceptible to AI)

### Scale
| TAF | Interpretation |
|---|---|
| 0.5 | Dominican version is MUCH more human/physical/relational than US |
| 0.7 | Dominican version is somewhat more human/physical/relational |
| 0.85 | Dominican version is slightly more human/physical/relational |
| 1.0 | Roughly equivalent task composition |
| 1.15 | Dominican version is slightly more routinized/automatable |
| 1.3 | Dominican version is somewhat more routinized/automatable |
| 1.5 | Dominican version is MUCH more routinized/automatable than US |

### Factors to Consider When Rating
- **Technology adoption level:** Does the Dominican version already use digital tools (making AI integration easier) or still work largely on paper/in-person?
- **Relationship intensity:** How much of the job is face-to-face client/stakeholder management vs. back-office processing?
- **Regulatory context:** Are there Dominican regulatory requirements that force manual review or human oversight?
- **Market structure:** Does the Dominican market structure (smaller firms, less specialization) mean this role covers more diverse tasks?
- **Cultural factors:** Are there cultural expectations (e.g., personal service in banking, face-to-face in legal) that increase human-contact requirements?

### Rating Form

Please fill your TAF estimate for each occupation. Add comments where your reasoning might be non-obvious.

| # | Occupation | Your TAF (0.5-1.5) | Comments / Reasoning |
|---|---|---|---|
| 1 | Operador(a) de call center | ___ | Consider: DR call centers serve US clients (English) vs. local market (Spanish). Task composition may vary by client type. |
| 2 | Digitador(a) / Data entry | ___ | Consider: Many DR organizations still have higher manual data entry loads than US equivalents. |
| 3 | Auxiliar administrativo(a) | ___ | Consider: In smaller DR firms, admin assistants do more diverse tasks (reception, errands, personal tasks for boss) vs. US where roles are more specialized. |
| 4 | Cajero(a) de banco | ___ | Consider: DR bank branches still handle many in-person transactions that are digital-only in US. |
| 5 | Cajero(a) de comercio | ___ | Consider: Colmado/small retail vs. large chain. Self-checkout penetration near zero in DR. |
| 6 | Recepcionista | ___ | Consider: In DR, receptionists often serve as office managers, gatekeepers, and personal assistants — broader role than US. |
| 7 | Contador(a) / Auxiliar contable | ___ | Consider: DGII compliance complexity; many small firms still use manual books; larger firms more automated. |
| 8 | Vendedor(a) / Dependiente | ___ | Consider: Dominican retail is relationship-heavy — *el fiado*, personal service, community knowledge. |
| 9 | Agente de seguros | ___ | Consider: DR insurance is heavily relationship-driven; agents are trusted advisors, not just processors. |
| 10 | Analista financiero | ___ | Consider: In DR, this role often includes more relationship management and less pure data work than US. |
| 11 | Gerente medio / Supervisor(a) | ___ | Consider: Dominican management is often more hands-on and relational; less data-driven decision-making. |
| 12 | Periodista / Comunicador(a) | ___ | Consider: DR media is more personality-driven; many journalists are also social media personalities. |
| 13 | Diseñador(a) gráfico | ___ | Consider: Similar task composition to US; perhaps slightly more client-facing in smaller DR agencies. |
| 14 | Operador(a) de zona franca | ___ | Consider: Task composition depends heavily on what the FTZ produces — textiles vs. electronics vs. medical devices. |
| 15 | Funcionario(a) público | ___ | Consider: DR government processes are often MORE paper-based and manual than US, but also more discretionary/relational. |
| 16 | Ingeniero(a) de software | ___ | Consider: DR devs often work for US clients (nearshoring) — task composition may be very similar to US. |
| 17 | Abogado(a) | ___ | Consider: Dominican legal practice is extremely relationship-intensive; *gestiones* and personal connections matter enormously. |
| 18 | Maestro(a) / Profesor(a) | ___ | Consider: Dominican classrooms are more teacher-centered; less technology-mediated instruction than US. |
| 19 | Enfermero(a) | ___ | Consider: DR nursing involves more direct patient interaction and less documentation than US. |
| 20 | Chofer / Conductor | ___ | Consider: Dominican driving conditions (informal traffic, *conchos*, unstructured routes) make autonomous driving even less feasible than in US. |

### Submission
Please return your completed ratings within 48 hours. We'll average across validators and flag any occupation where estimates diverge by more than 0.3 for group discussion.

---

# TOOL 3: V-Score Data Assembly Guide

## Data Sources and Extraction Strategy

### Component 1: Income Vulnerability (25% weight)

**What we need:** Median or average salary by occupation  
**Primary source:** Sanba salary data (from TSS, MAP, ENCFT)  
**Backup source:** TSS average contributable salary (RD$37,261 as of April 2025 — national average)  
**Reference point:** Current sector minimum wages (multiple tiers based on firm size per Resolution CNS012025)

**Scoring formula:**
```
Income_Vulnerability = 100 × max(0, 1 - (Occupation_Salary / (1.5 × Sector_Minimum_Wage)))
```

Interpretation: A worker earning exactly the minimum wage scores 33. A worker earning 1.5x minimum scores 0 (not income-vulnerable). A worker earning below minimum (informal) scores higher.

**Minimum wage reference (2025-2026, approximate):**
- Large firms (>RD$150M revenue): ~RD$21,000/month
- Medium firms (RD$4M-150M): ~RD$19,250/month  
- Small firms (<RD$4M): ~RD$12,900/month
- Free trade zones: ~RD$14,500/month
- Hotels/bars/restaurants: varies by establishment size

**Data availability:** HIGH — Sanba has salary data; TSS provides sector averages

### Component 2: Informality Score (25% weight)

**What we need:** Informality rate by occupation (or sector proxy)  
**Primary source:** Cross-reference Sanba employment counts with TSS registered workers by sector  
**Backup source:** Published ENCFT informality rates by sector  

**Known sector informality rates (ENCFT 2025):**
- National average: 54.1% (down from 55.5% in 2024)
- Construction: 85.4%
- Agriculture: ~80% (estimated)
- Commerce/retail: ~60%
- Transportation: ~70%
- Hotels/restaurants: ~55%
- Manufacturing: ~35%
- Banking/finance: ~10%
- Government: ~5%
- Free trade zones: ~5%

**Scoring formula:**
```
Informality_Score = Sector_Informality_Rate × 100
```

(If occupation-level data is available, use it; otherwise use sector rate)

**Data availability:** MEDIUM — Sector-level readily available; occupation-level requires ENCFT microdata or TSS cross-reference

### Component 3: Household Dependency Ratio (15% weight)

**What we need:** Average number of dependents per worker by occupation  
**Primary source:** ENCFT household data  
**Proxy if unavailable:** Use income-band proxy — lower-income occupations tend to have higher dependency ratios in DR

**Scoring formula:**
```
Dependency_Score = min(100, Dependency_Ratio × 25)
```

Where Dependency_Ratio = (household members) / (employed household members). A ratio of 4 (one worker supporting four people) = score of 100.

**Data availability:** LOW at occupation level — likely need sector or income-band proxies. Flag as Tier 2.

### Component 4: Savings Capacity (20% weight)

**What we need:** Estimated discretionary income after basic expenses  
**Primary source:** Salary data minus BCRD cost-of-living estimates by province  
**Reference:** BCRD IPC (Índice de Precios al Consumidor) and canasta básica data

**Scoring formula:**
```
Savings_Capacity = max(0, (Salary - Canasta_Basica_Familiar) / Salary)
Savings_Score = 100 × (1 - Savings_Capacity)
```

If salary barely covers the basic basket, savings score approaches 100 (maximum vulnerability).

**Dominican canasta básica familiar (approximate 2025):**
- National: ~RD$43,000-48,000/month (for a family of 4)
- Santo Domingo: ~RD$48,000-53,000/month
- Santiago: ~RD$42,000-47,000/month
- Rural areas: ~RD$35,000-40,000/month

**Critical insight:** At these levels, ANY occupation paying below ~RD$50,000/month in Santo Domingo has a worker whose family is structurally vulnerable. That's a large share of the formal workforce and essentially all of the informal one.

**Data availability:** MEDIUM — Salary data available; cost-of-living requires provincial matching but BCRD publishes this.

### Component 5: Educational Attainment (15% weight)

**What we need:** Average education level by occupation  
**Primary source:** ENCFT education data by occupation or sector  
**Proxy if unavailable:** Professional qualification requirements (known for regulated professions; estimated for others)

**Scoring formula:**
```
Education_Score = 100 - (Average_Years_Education × 6.67)
```

Where 15 years (university complete) = score of 0 (low vulnerability) and 6 years (incomplete primary) = score of 60 (high vulnerability). No education = 100.

**Data availability:** MEDIUM — ENCFT publishes education by sector; occupation-level may be in microdata.

---

## V-Score Composite Calculation

```
V-Score = (0.25 × Income_Vulnerability) + (0.25 × Informality_Score) + 
          (0.15 × Dependency_Score) + (0.20 × Savings_Score) + 
          (0.15 × Education_Score)
```

### Confidence Tiering

| Tier | Criteria | Action |
|---|---|---|
| Tier 1 (High Confidence) | 4-5 components from occupation-level data | Report as solid score |
| Tier 2 (Moderate Confidence) | 2-3 components occupation-level, rest sector-proxy | Report with confidence band (±10 points) |
| Tier 3 (Estimated) | Mostly sector-level proxies | Report as estimate; prioritize for data improvement |

---

## Quick-Start Checklist for Week 1

### Day 1
- [ ] Export Sanba occupation taxonomy (full list of categories in treemap)
- [ ] Download AIOE dataset from github.com/AIOE-Data/AIOE
- [ ] Download World Bank SOC→ISCO-08 concordance from WB Working Paper 11057 supplementary materials
- [ ] Confirm access to TSS average salary data by sector/occupation

### Day 2
- [ ] Build concordance table: Sanba Category → ISCO-08 → AIOE score
- [ ] Run employment volume query on Sanba data → rank by size
- [ ] Select top 35 occupations for priority scoring
- [ ] Send TAF Delphi instrument to 2-3 validators

### Day 3
- [ ] Assemble salary data from Sanba for priority occupations
- [ ] Pull sector informality rates from published ENCFT/BCRD tables
- [ ] Compute Income_Vulnerability and Informality_Score for all 35 occupations
- [ ] Identify which occupations have ENCFT microdata for Tier 1 scoring vs. Tier 2

### Day 4-5
- [ ] Complete remaining V-Score components (dependency, savings, education)
- [ ] Compute composite V-Scores with confidence tiering
- [ ] Validate: do the V-Scores pass the "smell test"? (Construction workers should be Very High; bank analysts should be Low)
- [ ] Prepare V-Score summary for team review

---

## Data Request Template for Sanba Team

If you need to request specific data extracts from colleagues:

```
SUBJECT: Data Extract Request — AI Workforce Impact Analysis

Need the following from Sanba's data pipeline for the Phase 1 sprint:

1. OCCUPATION TAXONOMY
   - Complete list of occupation categories used in the treemap
   - Employment count for each category
   - Sector assignment for each category

2. SALARY DATA
   - Average/median salary by occupation category (or by sector if occupation-level unavailable)
   - Salary distribution (p10, p25, p50, p75, p90) if available

3. TSS CROSS-REFERENCE
   - Number of TSS-registered (formal) workers by sector
   - If available: by occupation category

4. DEMOGRAPHIC DATA (from ENCFT if accessible)
   - Education level distribution by occupation or sector
   - Age distribution by occupation or sector
   - Gender distribution by occupation or sector

Timeline: Need items 1-2 by [Day 2]; items 3-4 by [Day 4]
Purpose: Building Vulnerability Index for AI workforce impact analysis
```
