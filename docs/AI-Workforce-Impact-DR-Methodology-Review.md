# AI Workforce Impact in the Dominican Republic
## Methodology Review, Gap Analysis & Enhancement Proposals

**Prepared for:** Carlos Miranda Levy — CEMI.ai / iBizai.io  
**Date:** March 27, 2026  
**Reference Article:** *The Intelligence Transition: AI, Work, and the Future We're Building* — Kaia Tanaka-Lindgren, iBizai.io  
**Reference Data:** Sanba Development RD Job Visualizer (262K+ records, 12 sectors, 13+ government sources)

---

## 1. Executive Assessment

### 1.1 What's Strong

Your four-phase architecture — Profile → Aggregate → Cross-validate → Prospect — is methodologically clean and follows a logic that most global frameworks skip: starting from the *human* (the job profile) rather than from the *technology* (AI capability). This is not a trivial design choice. The dominant global frameworks (Frey & Osborne, Felten et al.'s AIOE, the IMF's C-AIOE, Anthropic's Observed Exposure) all begin from the technology side — mapping what AI *can* do and then overlaying that on occupations. Your approach inverts this by asking first: *who is vulnerable regardless of AI?* That's a Schumpeterian instinct — understanding the structural fault lines *before* the earthquake hits.

The three-criteria framework (Vulnerability, Susceptibility, Adaptability) is the project's intellectual backbone, and it's the right one. It captures something the global literature consistently misses: that AI impact is not just a function of task exposure but of the *structural resilience* of the person holding the job. A call center operator in Santo Domingo and one in Manila may have identical AI susceptibility scores, but their vulnerability and adaptability profiles are radically different based on social protection, savings capacity, informality rates, and reconversion pathways.

The Sanba Jobs data asset (262K+ records across 12 sectors from 13 government sources) is a genuine differentiator. Most developing-country AI impact studies work with modeled estimates or crosswalked O*NET data — you have *actual Dominican labor market microdata*. That's rare and valuable.

### 1.2 What Needs Refinement

The project as conceived has five significant gaps that, if addressed, would elevate it from a strong analysis to a reference framework:

1. **The Vulnerability dimension needs operationalization.** Your intuitive definition — *la gente que vive de quincena en quincena* — is correct but needs measurable proxies. Without them, vulnerability becomes a qualitative judgment rather than a scorable dimension.

2. **The Susceptibility dimension lacks a stated methodology.** You identify which jobs are more or less susceptible, but you don't specify *how* you'll score this. Will you use AIOE? Frey & Osborne? A custom task-based assessment? The choice matters enormously.

3. **Informality is the elephant in the room.** The Dominican Republic has a 54.1% labor informality rate (ENCFT 2025). This isn't a footnote — it's a *structural feature* that changes everything about how AI impact plays out. Informal workers are simultaneously less exposed to direct AI displacement (they don't use enterprise software) and more vulnerable to indirect effects (their markets shrink when formal competitors adopt AI).

4. **The Adaptability dimension needs a reconversion cost model.** Saying "some workers can transition more easily" is directionally right but analytically incomplete. You need a framework that accounts for: education level, age, skill transferability, geographic mobility, and retraining infrastructure availability — all in the Dominican context.

5. **The temporal dimension is underdeveloped.** Phase 4 mentions scenarios with different rates of adoption, but the methodology for constructing those scenarios isn't specified. This is where the iBizai article's three-horizon framework (2026–2028 augmentation, 2028–2032 capability convergence, 2032+ reinvention) could be systematized.

---

## 2. Benchmarking Against Existing Methodologies

### 2.1 The Global Landscape of AI Workforce Impact Frameworks

Your project sits at the intersection of several established methodologies. Understanding where each one succeeds and fails will help you design a superior Dominican-specific framework.

| Framework | Creator | Approach | Strength | Weakness for DR Context |
|---|---|---|---|---|
| **Automation Probability** | Frey & Osborne (2017) | Gaussian classifier on 702 U.S. occupations using O*NET | Pioneering; widely replicated | U.S.-centric; ignores informality; binary (automatable vs. not) |
| **AIOE Index** | Felten, Raj & Seamans (2021) | Links AI applications to occupational abilities via crowdsourced data | Agnostic on substitution vs. complementarity; granular | Built on O*NET abilities, not Dominican task profiles |
| **C-AIOE** | Pizzinelli et al. / IMF (2023) | Extends AIOE with complementarity and social/physical context | Captures augmentation, not just displacement | Still uses O*NET as base; no developing-country calibration |
| **Observed Exposure** | Anthropic (2026) | Maps 1M real AI conversations to occupational tasks | Measures *actual* use, not theoretical capability | Biased toward English-language, tech-savvy users |
| **GENOE** | IDB (2024) | GPT-4o synthetic surveys to assess exposure at multiple time horizons | Forward-looking; captures 1/5/10-year projections | Experimental; not yet widely validated |
| **STEP-SBERT Method** | World Bank (PMC, 2023) | Semantic similarity between U.S. work activities and developing-country worker skills | Designed for developing countries; uses local survey data | Requires STEP survey data, which DR may not have at granularity needed |
| **GDPval** | OpenAI (2025) | AI performance on 1,320 real-world tasks across 44 occupations | Measures actual AI capability on real work products | Tasks are "precisely specified"; nothing like messy real employment |
| **OWCI** | Bionic Advertising (2026) | 0-100 scale of AI office work capability | Simple, trackable over time | Only covers office work; ignores physical, service, agricultural labor |

**Key insight from the table:** No single existing framework adequately captures what you're trying to do. The established methodologies are all built on U.S./OECD occupational classifications, assume formal employment, and ignore the structural vulnerability dimension. Your framework needs to *borrow* from them (particularly the AIOE for susceptibility scoring and the STEP-SBERT method for cross-walking to Dominican occupations) while *adding* what they lack (vulnerability, informality, Dominican-specific adaptability pathways).

### 2.2 The IDB's GENOE Is Your Closest Cousin

The Inter-American Development Bank's *"Mirror, Mirror on the Wall: Which Jobs Will AI Replace After All?"* (2024) is methodologically the closest to what you're attempting, and it covers Latin America. Their GENOE (Generative AI Occupational Exposure) index uses GPT-4o synthetic surveys to assess occupational exposure across multiple time horizons (1, 5, and 10 years). They found that in countries like Brazil and Mexico, college-educated workers historically moved more easily from high-displacement to high-complementarity jobs, while workers without postsecondary education showed reduced mobility.

**What to borrow:** Their multi-horizon temporal approach and their Latin American calibration.  
**What they miss that you can add:** The vulnerability layer, the informality adjustment, and the Dominican-specific sectoral composition.

---

## 3. Proposed Enhancements to Your Methodology

### 3.1 Phase 1 Enhancement: Operationalizing the Three Criteria

#### 3.1.1 Vulnerability Index (V-Score)

Your definition is intuitive and correct. Here's how to make it measurable. I propose a composite index (0–100) built from five proxies, each weighted:

| Proxy | Data Source | Weight | Rationale |
|---|---|---|---|
| **Income proximity to minimum wage** | ENCFT / TSS salary data | 25% | Workers earning <1.5x minimum wage have minimal financial buffer |
| **Informality status** | ENCFT informality rate by occupation | 25% | No social security = no safety net |
| **Household dependency ratio** | ENCFT household data | 15% | Single earners supporting multiple dependents are more fragile |
| **Savings capacity proxy** | Income minus estimated cost of living by province | 20% | Can the worker survive 3 months without income? |
| **Educational attainment** | ENCFT education data | 15% | Lower education correlates with fewer reconversion options |

The **key innovation** here is that vulnerability is measured *independently* of AI. This lets you later cross it with susceptibility to produce a *compound risk score* — which is far more actionable for policy than either dimension alone.

**Threshold bands:**
- **V-Score 0–30:** Resilient — Can absorb shocks for 3+ months
- **V-Score 31–60:** Exposed — Limited buffer; 1–3 months
- **V-Score 61–100:** Critical — Lives paycheck to paycheck; *de quincena en quincena*

#### 3.1.2 AI Susceptibility Index (S-Score)

For susceptibility, I recommend a hybrid approach that combines:

1. **AIOE baseline scores** (from Felten et al.'s open dataset on GitHub) crosswalked to ISCO-08 codes and then mapped to Dominican occupation classifications in your Sanba data.

2. **Dominican task adjustment factor.** This is crucial. A "financial analyst" in the U.S. may spend 80% of their time on data analysis (highly susceptible to AI). The same title in a Dominican PYME may spend 40% of their time on relationship management and in-person client meetings (less susceptible). The adjustment requires either a qualitative expert panel assessment or, better, a structured survey of Dominican employers.

3. **Temporal layering.** Following the IDB's GENOE approach, score each occupation for susceptibility at three horizons: short-term (2026–2028), medium-term (2028–2032), long-term (2032+). This produces not a single score but a trajectory.

4. **Informality discount factor.** Informal occupations should receive a reduced susceptibility score in the short term (they won't adopt AI), but potentially a *higher* score in the medium term (formal competitors who adopt AI will erode their market). This creates a non-linear exposure curve unique to economies with high informality.

**Proposed S-Score formula:**

```
S-Score(t) = AIOE_base × Task_Adjustment_DR × Informality_Factor(t) × Adoption_Rate(t)
```

Where:
- `AIOE_base` = Felten et al. score crosswalked to ISCO → Dominican classification
- `Task_Adjustment_DR` = Dominican task composition modifier (0.5 to 1.5)
- `Informality_Factor(t)` = Time-varying discount for informal occupations
- `Adoption_Rate(t)` = Sector-specific AI adoption rate in DR (starts very low)

#### 3.1.3 Adaptability Index (A-Score)

Adaptability should capture *transition feasibility*, not just *willingness*. I propose four sub-dimensions:

| Sub-dimension | Measure | Weight |
|---|---|---|
| **Skill transferability** | O*NET skill overlap with adjacent occupations (how many other jobs share >50% of your skill set) | 30% |
| **Retraining feasibility** | Estimated months/cost to reach competency in nearest growing occupation, adjusted for DR training infrastructure | 25% |
| **Age factor** | Non-linear: peaks at 25–40, declines after 50 | 20% |
| **Geographic mobility** | Province-level employment diversity (can you find alternative work without relocating?) | 25% |

**The missing piece in most adaptability frameworks:** They assume that retraining infrastructure exists and is accessible. In the DR, where 90% of teachers worldwide have never received AI training (per the iBizai article), and where INFOTEP (the national vocational training institute) operates under significant capacity constraints, the *supply side* of adaptability matters as much as the *demand side*.

### 3.2 Phase 1 Enhancement: The Compound Risk Matrix

Once you have V, S, and A scores for each job profile, the analytical power comes from crossing them. I propose a **3D Risk Matrix** that produces four archetypal categories:

| Category | Profile | V-Score | S-Score | A-Score | Policy Implication |
|---|---|---|---|---|---|
| **Red Zone** — Critical Priority | High vulnerability, high susceptibility, low adaptability | 61–100 | 61–100 | 0–40 | Immediate social protection + guided transition |
| **Orange Zone** — Urgent Attention | Moderate vulnerability, high susceptibility, moderate adaptability | 31–60 | 61–100 | 41–60 | Reskilling programs + income bridging |
| **Yellow Zone** — Strategic Monitoring | Low vulnerability, high susceptibility, high adaptability | 0–30 | 61–100 | 61–100 | Market will likely self-correct; monitor |
| **Green Zone** — AI Opportunity | Any vulnerability, low susceptibility, any adaptability | Any | 0–40 | Any | Focus on AI adoption benefits, not risk |

**The Red Zone is where Dominican policy should focus first.** These are the workers who are simultaneously economically fragile, in jobs that AI will impact, and with limited options for transition. Based on the DR's labor market structure — 54.1% informality, construction informality at 85.4%, ~5M employed — the Red Zone likely contains a disproportionate number of clerical workers, basic administrative staff, and call center operators in the formal sector, plus a large informal segment that faces indirect displacement.

### 3.3 Phase 2 Enhancement: Sector Composition Mapping

Your instinct to aggregate job profiles to sectors is correct, but the methodology needs one crucial addition: **sectoral AI adoption velocity**.

Not all sectors will adopt AI at the same speed. Finance and telecommunications will move fast; agriculture and construction will move slowly. This means the same job profile (e.g., "administrative assistant") faces different timelines depending on which sector employs them.

I propose creating a **Sector AI Readiness Score** for each of the 12 sectors in your Sanba data, based on:

| Factor | Weight |
|---|---|
| **Digital infrastructure penetration** in the sector | 25% |
| **Competitive pressure** (international exposure, margin pressure) | 20% |
| **Formality rate** (formal sectors adopt faster) | 20% |
| **Employer size distribution** (large firms adopt faster) | 15% |
| **Regulatory environment** (regulated sectors may be slower or mandated) | 10% |
| **Presence of multinational firms** (MNCs transfer AI adoption from HQ) | 10% |

**Dominican-specific sector readiness estimates** (preliminary, to be validated):

| Sector | Estimated Readiness | Rationale |
|---|---|---|
| Banking & Finance | Very High | Highly regulated, tech-forward, MNC presence, competitive pressure |
| Telecommunications | Very High | Technology-native, concentrated market, scale operations |
| Free Trade Zones / Manufacturing | High | MNC-driven, global supply chain pressure, cost optimization imperative |
| Tourism & Hospitality | Medium-High | International competition, customer experience pressure, but high human-contact |
| Retail & Commerce | Medium | Mixed; large chains will adopt, *colmados* and small retail won't |
| Healthcare | Medium | Quality pressure, but regulatory and infrastructure constraints |
| Government / Public Admin | Medium-Low | Scale opportunity, but bureaucratic inertia and procurement complexity |
| Education | Medium-Low | Massive potential, but institutional resistance and funding constraints |
| Agriculture & Agribusiness | Low-Medium | Precision agriculture opportunity, but extremely high informality |
| Construction | Low | 85.4% informality rate; highly manual; limited digital infrastructure |
| Transportation | Low | Informal, fragmented, but autonomous vehicle pressure is distant in DR |
| Non-profit / Social | Low | Limited budgets, but AI efficiency could amplify impact |

When you multiply the **Sector Readiness Score** by the **aggregated job-profile susceptibility** within each sector, you get a much more realistic picture of *when* and *how hard* each sector will be impacted.

### 3.4 Phase 3 Enhancement: Cross-validation with Sanba Data

Your Sanba Jobs data is your empirical anchor. Here's how to maximize its value in cross-validation:

#### 3.4.1 Data Enrichment Strategy

The Sanba dataset has 262K+ records across 12 sectors from government sources (MAP, TSS, ENCFT, DGII, CNZFE). To cross-validate your theoretical V/S/A scores, you need to:

1. **Map Sanba occupational categories to ISCO-08 codes.** This is the bridge that lets you apply international AIOE scores to Dominican data. The ILO has a Dominican ENCFT → ISCO crosswalk that should work. If Sanba uses its own taxonomy, you'll need a manual or semi-automated concordance.

2. **Extract salary distributions by occupation.** This feeds directly into the Vulnerability index. The Sanba data appears to include salary averages — you need distributions (or at least decile breakdowns) to identify the *de quincena en quincena* population.

3. **Cross-reference with TSS (Tesorería de la Seguridad Social) data.** The TSS records 2.43 million contributing workers — this is your *formality* dataset. Occupations that appear in Sanba but have low TSS representation are high-informality.

4. **Validate against RD Trabaja vacancy data.** The Sanba project has ~256 vacancies from the RD Trabaja API. These represent *demand-side* signals — which occupations are actively hiring, and at what salary levels.

#### 3.4.2 The Pareto Insight

The Sanba project mentions a Pareto ratio of 3.12x and 10.4% coverage. This means a small number of occupational categories account for a disproportionate share of employment. This is analytically powerful — it means you can focus your detailed V/S/A scoring on the top 20-30 occupations that cover 60-70% of employment, rather than trying to score all 700+ possible categories.

### 3.5 Phase 4 Enhancement: Scenario Architecture

For the prospective analysis, I recommend structuring scenarios around three independent variables:

1. **AI Adoption Speed** — How fast do Dominican firms deploy AI?
   - Slow: Only MNCs and large formal firms (10% of employment affected by 2030)
   - Moderate: Mid-market adoption follows (25% by 2030)
   - Fast: Broad adoption including SMEs (40% by 2030)

2. **Policy Response Intensity** — How aggressively does the government intervene?
   - Passive: Current trajectory (INFOTEP as-is, no new programs)
   - Active: Targeted reskilling programs, transition insurance, digital literacy push
   - Transformative: Mauritius-model worker protection, education system overhaul, AI strategy

3. **Global Demand Shifts** — What happens to DR's export-oriented sectors?
   - Favorable: Nearshoring accelerates, tourism grows, FTZ diversifies
   - Neutral: Current trajectory continues
   - Adverse: AI-driven reshoring reduces FTZ demand, virtual tourism erodes travel

The cross of these three variables produces **27 scenarios**, which you can collapse into 5-7 illustrative ones. Each scenario should produce a quantified projection of:
- Net employment change by sector
- Wage pressure by occupation band
- Informal-to-formal transition rates
- Red Zone population size and composition
- Required reskilling investment

---

## 4. Critical Additions: What the Project Needs That It Doesn't Have Yet

### 4.1 The Informality Paradox

This deserves its own analytical thread. The Dominican Republic's 54.1% informality rate creates a paradox that no global framework adequately addresses:

**Informal workers are less *directly* exposed to AI** (they don't use enterprise software, they're not in call centers, their jobs require physical presence and human interaction). But they are **more *indirectly* exposed** through three channels:

1. **Market compression:** When formal competitors adopt AI and reduce costs, informal operators lose market share. The *colmado* doesn't use AI, but the supermarket chain does, and that chain's AI-optimized pricing and inventory management erodes the colmado's margins.

2. **Platform displacement:** Ride-hailing apps, delivery platforms, and e-commerce — all AI-enhanced — are already restructuring informal commerce and transportation in Santo Domingo.

3. **Wage spillover:** When AI increases productivity in formal sectors, it can either raise wages (if labor is scarce) or suppress them (if displaced formal workers flood into informal markets). In the DR, the second scenario is more likely for low-skill occupations.

**Recommendation:** Create a separate analytical module for "Indirect AI Impact on the Informal Economy" that traces these three channels through each sector.

### 4.2 The Call Center / BPO Vulnerability

The Dominican Republic has a growing BPO/call center industry, particularly in Santiago and Santo Domingo. This sector is among the *most* susceptible to AI globally — the iBizai article cites India's BPM net headcount dropping from 130,000 to fewer than 17,000 annual new hires. The Philippines' BPO industry is also under pressure.

For the DR, this is a near-term, concentrated risk. Call center operators fit squarely in the Red Zone: moderate-to-low income, high AI susceptibility (conversational AI is already handling 70-80% of standard inquiries according to the article), and limited adaptability (the skills are specific and don't transfer easily).

**Recommendation:** Treat BPO/Call Centers as a separate micro-sector within your analysis, even if the Sanba data aggregates them into "Services" or "Telecommunications."

### 4.3 The Free Trade Zone Equation

The DR's Zonas Francas (Free Trade Zones) employ hundreds of thousands and are a cornerstone of the formal economy. The CNZFE data in your Sanba dataset is critical here. Two countervailing forces are at play:

1. **Automation pressure:** Manufacturing AI and robotics are reducing the labor intensity of production. The iBizai article projects assembly line employment falling from 2.1M to 1.0M in the U.S. by 2030.

2. **Nearshoring opportunity:** Geopolitical tensions and supply chain restructuring are *increasing* demand for production capacity close to the U.S. market. The DR is well-positioned for this.

The net effect depends on *what kind* of FTZ activity the DR attracts. Low-skill assembly (high automation risk) vs. higher-value manufacturing and services (lower automation risk, higher AI complementarity).

**Recommendation:** Split FTZ analysis into sub-segments by activity type, not just as a monolithic sector.

### 4.4 The Gender Dimension

The iBizai article cites the Brookings finding that 86% of the 6.1 million most vulnerable U.S. workers are women, concentrated in clerical and administrative roles. In the DR, where 53% of new formal jobs in 2025 were filled by women (per President Abinader's accountability report), the gender dimension of AI impact deserves explicit analysis.

**Recommendation:** Cross your V/S/A scores with gender data from the ENCFT to produce gender-differentiated impact projections.

### 4.5 The Youth Pipeline Crisis

The iBizai article's most alarming finding — young software developer employment falling 20%, entry-level tech postings dropping 60% — has specific implications for the DR. The Dominican tech ecosystem is young and growing, but it depends on entry-level opportunities as the pipeline for career development.

**Recommendation:** Add an age-stratified analysis, particularly for the 18-30 cohort, examining how AI adoption affects the *entry ramp* to professional careers in the DR.

---

## 5. Suggested Revised Project Architecture

### Phase 0: Data Foundation (NEW)
- Complete ISCO-08 crosswalk for Sanba occupational data
- Identify top 30 occupations by employment volume (Pareto focus)
- Assemble salary distribution, informality rate, and education data by occupation
- Map AIOE scores to Dominican occupation classification

### Phase 1: Score Job Profiles (ENHANCED)
- Compute V-Score (Vulnerability Index) for each occupation
- Compute S-Score (AI Susceptibility Index) at three time horizons
- Compute A-Score (Adaptability Index) with Dominican retraining infrastructure adjustment
- Generate Compound Risk Matrix and classify occupations into Red/Orange/Yellow/Green zones

### Phase 1.5: Structural Overlays (NEW)
- Informality paradox analysis (direct vs. indirect AI exposure)
- Gender-differentiated impact assessment
- Youth pipeline crisis assessment (18-30 cohort)
- Geographic distribution (Santo Domingo vs. Santiago vs. provincial labor markets)

### Phase 2: Sector Aggregation (ENHANCED)
- Aggregate job-profile scores to 12 sectors
- Apply Sector AI Readiness multiplier
- Compute sector-level Compound Risk scores with temporal trajectories
- Identify sectoral tipping points (when does adoption reach critical mass?)

### Phase 3: Empirical Cross-Validation (ENHANCED)
- Cross-validate theoretical scores against Sanba employment data
- Triangulate with TSS formality data and RD Trabaja vacancy signals
- Identify discrepancies between theoretical exposure and observed labor market dynamics
- Produce "Reality Adjustment Factors" for each sector

### Phase 4: Prospective Scenarios (ENHANCED)
- Construct 5-7 scenarios from the 3-variable matrix (Adoption Speed × Policy Response × Global Demand)
- Quantify each scenario's impact on employment, wages, informality, and Red Zone size
- Identify "no-regret" policy actions that are beneficial under all scenarios
- Produce sector-specific transition roadmaps with cost estimates

### Phase 5: Policy & Action Framework (NEW)
- Translate findings into concrete policy recommendations for:
  - Government (INFOTEP reform, digital literacy strategy, transition insurance)
  - Private sector (augmentation-first adoption, entry-level pipeline, reskilling investment)
  - Individuals (career adaptability playbook by occupation band)
  - Education system (curriculum reform priorities)
- Connect to the NEVER HELP framework: Engage stakeholders in understanding their own risk → Enable with tools and training → Inspire with possibility → Empower with ownership → Connect to networks and opportunities

---

## 6. Methodological Recommendations

### 6.1 What to Borrow from Existing Frameworks

| Framework | What to Borrow | How to Adapt for DR |
|---|---|---|
| **AIOE (Felten et al.)** | Baseline occupation-level AI exposure scores | Crosswalk via ISCO-08; apply Dominican task adjustment factor |
| **C-AIOE (IMF/Pizzinelli)** | Complementarity vs. displacement distinction | Essential — DR needs augmentation pathways, not just displacement metrics |
| **STEP-SBERT (World Bank)** | Semantic similarity method for cross-country translation | Use ENCFT skill descriptions as the DR input corpus |
| **GENOE (IDB)** | Multi-horizon temporal scoring (1/5/10 years) | Directly applicable to Phase 1 S-Score design |
| **Anthropic Observed Exposure** | Gap between theoretical capability and actual use | Critical for calibrating realistic adoption timelines in DR |
| **OWCI (Bionic)** | Tractable capability index as a time-series anchor | Use to track AI frontier advancement and update S-Scores over time |

### 6.2 What to Invent (Your Unique Contributions)

1. **The Vulnerability Index as an independent dimension.** No existing framework does this. You're measuring *who can't absorb shocks*, independently of *what causes the shock*. This is applicable far beyond AI — it's a structural labor market fragility metric.

2. **The Informality Adjustment.** The direct/indirect exposure distinction for informal workers is original and methodologically important. Publish it as a standalone contribution.

3. **The Sector AI Readiness Score** calibrated to a developing Caribbean economy. Existing readiness indexes (OECD, IMF, WEF) operate at the country level. Yours operates at the sector-within-country level.

4. **The Compound Risk Matrix.** Three-dimensional scoring (V × S × A) producing actionable population segments. This is policy-ready analytics, not academic abstraction.

---

## 7. Practical Next Steps

### Immediate (This Week)
1. Confirm ISCO-08 crosswalk strategy with Sanba data team
2. Identify and download AIOE open dataset from Felten et al. GitHub repository
3. Define the top 30 Dominican occupations by employment volume for Pareto-focused analysis

### Short-Term (Next 2-4 Weeks)
4. Assemble V-Score data from ENCFT and TSS sources
5. Construct S-Score for top 30 occupations using hybrid AIOE + Dominican task adjustment
6. Design and conduct a structured expert panel (5-10 Dominican business leaders + economists) to validate Task Adjustment Factors
7. Build the Compound Risk Matrix prototype

### Medium-Term (Next 2-3 Months)
8. Complete scoring for all major occupations
9. Run sector aggregation with Readiness multipliers
10. Cross-validate against Sanba empirical data
11. Construct scenario models
12. Draft policy recommendations

### Deliverables
- **The Analysis:** A comprehensive report (the *neutral research substrate* you'll then process through your CEMI.ai personas and frameworks)
- **The Tool:** An interactive version integrated into the Sanba Job Visualizer, where users can explore V/S/A scores by occupation and sector
- **The Policy Brief:** A government-facing document with actionable recommendations
- **The Individual Guide:** A career-facing tool where Dominican professionals can assess their own risk profile

---

## 8. Final Observation: Why This Project Matters

Most AI workforce impact analyses are written *about* developing countries by researchers *in* developed countries, using data *from* developed countries, crosswalked through methodologies designed *for* developed countries. The result is analysis that is technically competent but contextually deaf.

What you're building is different. It starts from Dominican data, applies Dominican context, accounts for Dominican structural realities (informality, vulnerability, sector composition), and produces Dominican-actionable insights. As you've said many times: *what makes us different makes us better.* The global AI workforce literature needs a framework built from the inside out, not the outside in.

The iBizai article provides the global evidence base. Your methodology provides the local analytical engine. Together, they produce something that neither global reports nor local intuition can achieve alone: a rigorous, contextual, and actionable map of how AI will reshape work in the Dominican Republic — and what to do about it.

Or as you might put it: *AI al ritmo de tambora, pero con la metodología de Stanford.*

---

**Sources & References:**

- Felten, E. W., Raj, M. & Seamans, R. (2021). "AI Occupational Exposure Index (AIOE)." Strategic Management Journal. GitHub: github.com/AIOE-Data/AIOE
- Frey, C. B. & Osborne, M. A. (2017). "The future of employment: How susceptible are jobs to computerisation?" Technological Forecasting and Social Change, 114, 254-280.
- Pizzinelli, C. et al. (2023). "Labor Exposure to AI: Cross-Country Differences and Implications." IMF Staff Discussion Note SDN/2024/001.
- World Bank (2024). Policy Research Working Paper 11057. "AI Occupational Exposure in Low- and Middle-Income Countries."
- IDB (2024). "Mirror, Mirror on the Wall: Which Jobs Will AI Replace After All?" Publications IADB.
- Tanaka-Lindgren, K. (2026). "The Intelligence Transition: AI, Work, and the Future We're Building." iBizai.io.
- Banco Central de la República Dominicana. Encuesta Nacional Continua de Fuerza de Trabajo (ENCFT), 2024-2025.
- Sanba Development. RD Job Visualizer (2026). 262K+ records, 12 sectors. jobs.sanba.dev
- Egana-delSol, P. (2024). IZA Policy Paper No. 216: AI and Labor Markets in Developing Countries.
- Brynjolfsson, E., Li, D. & Raymond, L. (2023). "Generative AI at Work." NBER Working Paper.
