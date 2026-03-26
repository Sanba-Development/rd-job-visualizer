#!/usr/bin/env node
/**
 * calculate-metrics.js
 *
 * Reads data/processed/normalized.json and generates data/processed/metrics.json
 * with per-sector statistics including Pareto 80/20 salary analysis.
 *
 * Usage: node scripts/processors/calculate-metrics.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const INPUT = path.join(ROOT, 'data', 'processed', 'normalized.json');
const OUTPUT = path.join(ROOT, 'data', 'processed', 'metrics.json');
const COLORS_FILE = path.join(ROOT, 'src', 'sector-colors.json');

// ── Helpers ──────────────────────────────────────────────────────────────────

function median(sorted) {
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function round2(n) {
  return n == null ? null : Math.round(n * 100) / 100;
}

/** Pick the best available salary from a record */
function pickSalary(r) {
  if (r.salary_gross != null && r.salary_gross > 0) return r.salary_gross;
  if (r.salary_net != null && r.salary_net > 0) return r.salary_net;
  if (r.salary_min != null && r.salary_min > 0) return r.salary_min;
  return null;
}

/** Determine record type from metadata */
function recordType(r) {
  if (r.metadata && r.metadata.record_type) return r.metadata.record_type;
  if (r.employee_count != null && r.employee_count > 1) return 'aggregate';
  return 'position';
}

// ── Accumulator ──────────────────────────────────────────────────────────────

function createAccumulator() {
  return {
    total_records: 0,
    total_empleos: 0,
    record_types: { position: 0, aggregate: 0, vacancy: 0 },
    salaries: [],
    titles: {},       // title -> count
    institutions: {}, // institution -> count
    gender: { M: 0, F: 0, unknown: 0 },
    sources: new Set(),
    years: [],
  };
}

function accumulate(acc, r) {
  acc.total_records++;
  const rt = recordType(r);
  acc.record_types[rt] = (acc.record_types[rt] || 0) + 1;

  // Employee count: for aggregates use employee_count, for others count as 1
  const empCount = r.employee_count != null ? r.employee_count : 1;
  acc.total_empleos += empCount;

  // Salary
  const sal = pickSalary(r);
  if (sal != null) acc.salaries.push(sal);

  // Titles
  if (r.job_title) {
    acc.titles[r.job_title] = (acc.titles[r.job_title] || 0) + 1;
  }

  // Institutions
  if (r.institution) {
    acc.institutions[r.institution] = (acc.institutions[r.institution] || 0) + 1;
  }

  // Gender
  if (r.gender === 'M') acc.gender.M++;
  else if (r.gender === 'F') acc.gender.F++;
  else acc.gender.unknown++;

  // Source
  if (r.source) acc.sources.add(r.source);

  // Year
  if (r.period_year != null) acc.years.push(r.period_year);
}

function finalize(acc) {
  const salaries = acc.salaries.sort((a, b) => a - b);
  const totalWithSalary = salaries.length;

  // Basic salary stats
  const salary_avg = totalWithSalary > 0
    ? round2(salaries.reduce((s, v) => s + v, 0) / totalWithSalary)
    : null;
  const salary_median = round2(median(salaries));
  const salary_min = totalWithSalary > 0 ? salaries[0] : null;
  const salary_max = totalWithSalary > 0 ? salaries[totalWithSalary - 1] : null;

  // Pareto 80/20
  let salary_pareto = null;
  if (totalWithSalary >= 5) {
    const cutoff = Math.floor(totalWithSalary * 0.8);
    const bottom = salaries.slice(0, cutoff);
    const top = salaries.slice(cutoff);
    const bottomAvg = bottom.reduce((s, v) => s + v, 0) / bottom.length;
    const topAvg = top.reduce((s, v) => s + v, 0) / top.length;
    salary_pareto = {
      bottom_80_count: bottom.length,
      bottom_80_avg: round2(bottomAvg),
      top_20_count: top.length,
      top_20_avg: round2(topAvg),
      ratio: round2(topAvg / bottomAvg),
    };
  }

  // Top titles
  const top_titles = Object.entries(acc.titles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([title, count]) => ({ title, count }));

  // Top institutions
  const top_institutions = Object.entries(acc.institutions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([institution, count]) => ({ institution, count }));

  // Gender distribution
  const gTotal = acc.gender.M + acc.gender.F + acc.gender.unknown;
  const gender_distribution = gTotal > 0
    ? {
        male: acc.gender.M,
        female: acc.gender.F,
        unknown: acc.gender.unknown,
        male_pct: round2((acc.gender.M / gTotal) * 100),
        female_pct: round2((acc.gender.F / gTotal) * 100),
        unknown_pct: round2((acc.gender.unknown / gTotal) * 100),
      }
    : null;

  // Period
  const uniqueYears = [...new Set(acc.years)].sort((a, b) => a - b);
  const period = uniqueYears.length > 0
    ? { min_year: uniqueYears[0], max_year: uniqueYears[uniqueYears.length - 1] }
    : null;

  return {
    total_records: acc.total_records,
    total_empleos: acc.total_empleos,
    record_types: acc.record_types,
    records_with_salary: totalWithSalary,
    salary_avg,
    salary_median,
    salary_min,
    salary_max,
    salary_pareto,
    top_titles,
    top_institutions,
    gender_distribution,
    sources: [...acc.sources].sort(),
    period,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('Reading normalized.json...');
  const startRead = Date.now();
  const raw = fs.readFileSync(INPUT, 'utf8');
  console.log(`  Read ${(Buffer.byteLength(raw) / 1e6).toFixed(1)} MB in ${Date.now() - startRead}ms`);

  console.log('Parsing JSON...');
  const startParse = Date.now();
  const records = JSON.parse(raw);
  console.log(`  Parsed ${records.length.toLocaleString()} records in ${Date.now() - startParse}ms`);

  // Load sector colors for mapping sector keys to display names
  const sectorColors = JSON.parse(fs.readFileSync(COLORS_FILE, 'utf8'));
  const sectorIdToKey = {};
  // Map color file ids to normalized sector keys
  // Color file uses short ids like "admin-publica", normalized uses "administracion_publica_y_defensa"
  // We'll just use the sector keys from the data directly

  // Accumulators
  const globalAcc = createAccumulator();
  const sectorAccs = {};

  console.log('Calculating metrics...');
  const startCalc = Date.now();

  for (const r of records) {
    accumulate(globalAcc, r);

    const sector = r.sector;
    if (!sectorAccs[sector]) sectorAccs[sector] = createAccumulator();
    accumulate(sectorAccs[sector], r);
  }

  // Finalize
  const globalMetrics = finalize(globalAcc);
  const sectorMetrics = {};
  for (const [sector, acc] of Object.entries(sectorAccs)) {
    sectorMetrics[sector] = finalize(acc);
  }

  console.log(`  Calculated in ${Date.now() - startCalc}ms`);

  const output = {
    generated_at: new Date().toISOString(),
    global: globalMetrics,
    sectors: sectorMetrics,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n✓ Written: ${OUTPUT}`);

  // ── Console summary ──────────────────────────────────────────────────────

  console.log('\n════════════════════════════════════════════════════════');
  console.log('  METRICS SUMMARY');
  console.log('════════════════════════════════════════════════════════');
  console.log(`  Total records:      ${globalMetrics.total_records.toLocaleString()}`);
  console.log(`  Total empleos:      ${globalMetrics.total_empleos.toLocaleString()}`);
  console.log(`  Records w/ salary:  ${globalMetrics.records_with_salary.toLocaleString()}`);
  if (globalMetrics.salary_avg) {
    console.log(`  Salary avg:         RD$ ${globalMetrics.salary_avg.toLocaleString()}`);
    console.log(`  Salary median:      RD$ ${globalMetrics.salary_median.toLocaleString()}`);
    console.log(`  Salary range:       RD$ ${globalMetrics.salary_min.toLocaleString()} – ${globalMetrics.salary_max.toLocaleString()}`);
  }
  if (globalMetrics.salary_pareto) {
    const p = globalMetrics.salary_pareto;
    console.log(`  Pareto 80/20:       Bottom 80% avg RD$ ${p.bottom_80_avg.toLocaleString()} | Top 20% avg RD$ ${p.top_20_avg.toLocaleString()} | Ratio ${p.ratio}x`);
  }
  if (globalMetrics.gender_distribution) {
    const g = globalMetrics.gender_distribution;
    console.log(`  Gender:             M ${g.male_pct}% | F ${g.female_pct}% | Unknown ${g.unknown_pct}%`);
  }
  console.log(`  Period:             ${globalMetrics.period.min_year}–${globalMetrics.period.max_year}`);
  console.log(`  Sources:            ${globalMetrics.sources.join(', ')}`);

  console.log('\n── Per Sector ──────────────────────────────────────────');
  const sorted = Object.entries(sectorMetrics).sort((a, b) => b[1].total_records - a[1].total_records);
  for (const [sector, m] of sorted) {
    const salInfo = m.salary_avg
      ? `avg RD$ ${m.salary_avg.toLocaleString()}, median RD$ ${m.salary_median.toLocaleString()}`
      : 'no salary data';
    const paretoInfo = m.salary_pareto
      ? `, pareto ratio ${m.salary_pareto.ratio}x`
      : '';
    console.log(`  ${sector}`);
    console.log(`    Records: ${m.total_records.toLocaleString()} | Empleos: ${m.total_empleos.toLocaleString()} | ${salInfo}${paretoInfo}`);
  }

  console.log('\nDone.');
}

main();
