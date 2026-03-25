#!/usr/bin/env node
/**
 * validate-sectors.js — Cross-validate sector coverage against taxonomy
 *
 * Reads data/processed/summary.json and SECTOR_TAXONOMY.md to check
 * whether all 12 sectors have data coverage.
 *
 * Usage: node scripts/processors/validate-sectors.js
 * Exit code: 1 if any sector has 0 records, 0 otherwise.
 *
 * No external dependencies — pure Node.js.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SUMMARY_PATH = path.join(ROOT, 'data', 'processed', 'summary.json');
const TAXONOMY_PATH = path.join(ROOT, 'SECTOR_TAXONOMY.md');

// ── Extract sector names from SECTOR_TAXONOMY.md ─────────────────────────
function extractSectorsFromTaxonomy() {
  const content = fs.readFileSync(TAXONOMY_PATH, 'utf-8');
  const sectors = [];
  // Match rows like: | 1 | **Administración Pública y Defensa** | ...
  const regex = /\|\s*\d+\s*\|\s*\*\*([^*]+)\*\*/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    sectors.push(match[1].trim());
  }
  return sectors;
}

// ── Convert display name to snake_case key used in summary.json ──────────
function toKey(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/\s+y\s+/g, '_y_')
    .replace(/\s+/g, '_');
}

// ── Main ─────────────────────────────────────────────────────────────────
function main() {
  // Read summary
  if (!fs.existsSync(SUMMARY_PATH)) {
    console.error('ERROR: summary.json not found at ' + SUMMARY_PATH);
    console.error('Run normalize.js first: node scripts/processors/normalize.js');
    process.exit(1);
  }
  const summary = JSON.parse(fs.readFileSync(SUMMARY_PATH, 'utf-8'));

  // Read taxonomy
  if (!fs.existsSync(TAXONOMY_PATH)) {
    console.error('ERROR: SECTOR_TAXONOMY.md not found at ' + TAXONOMY_PATH);
    process.exit(1);
  }
  const taxonomySectors = extractSectorsFromTaxonomy();

  if (taxonomySectors.length === 0) {
    console.error('ERROR: Could not extract any sectors from SECTOR_TAXONOMY.md');
    process.exit(1);
  }

  const sectorData = summary.by_sector || {};
  const totalRecords = summary.total_records || 0;

  console.log('='.repeat(60));
  console.log(' Sector Coverage Validation Report');
  console.log('='.repeat(60));
  console.log('');
  console.log('Total records: ' + totalRecords.toLocaleString());
  console.log('Taxonomy sectors: ' + taxonomySectors.length);
  console.log('Sectors with data: ' + Object.keys(sectorData).length);
  console.log('');

  // Build report
  const MISSING = [];
  const LOW = [];
  const OK = [];

  console.log('-'.repeat(60));
  console.log(
    padRight('Sector', 38) +
    padRight('Records', 12) +
    padRight('%', 8) +
    'Status'
  );
  console.log('-'.repeat(60));

  for (const name of taxonomySectors) {
    const key = toKey(name);
    const count = sectorData[key] || 0;
    const pct = totalRecords > 0 ? ((count / totalRecords) * 100).toFixed(1) : '0.0';

    let status;
    if (count === 0) {
      status = 'MISSING';
      MISSING.push(name);
    } else if (parseFloat(pct) < 1.0) {
      status = 'LOW';
      LOW.push(name);
    } else {
      status = 'OK';
      OK.push(name);
    }

    console.log(
      padRight(name, 38) +
      padRight(count.toLocaleString(), 12) +
      padRight(pct + '%', 8) +
      status
    );
  }

  // Check for sectors in data that are NOT in taxonomy
  const taxonomyKeys = new Set(taxonomySectors.map(toKey));
  const unmapped = Object.keys(sectorData).filter(k => !taxonomyKeys.has(k));

  console.log('-'.repeat(60));
  console.log('');

  // Summary
  console.log('='.repeat(60));
  console.log(' Summary');
  console.log('='.repeat(60));
  console.log('');
  console.log('  OK sectors (' + OK.length + '): ' + (OK.join(', ') || 'none'));
  console.log('  LOW sectors (' + LOW.length + '): ' + (LOW.join(', ') || 'none'));
  console.log('  MISSING sectors (' + MISSING.length + '): ' + (MISSING.join(', ') || 'none'));

  if (unmapped.length > 0) {
    console.log('');
    console.log('  WARNING: Sectors in data but NOT in taxonomy:');
    for (const k of unmapped) {
      console.log('    - ' + k + ' (' + (sectorData[k] || 0).toLocaleString() + ' records)');
    }
  }

  console.log('');

  // Source breakdown
  if (summary.by_source) {
    console.log('Sources:');
    for (const [src, cnt] of Object.entries(summary.by_source)) {
      console.log('  ' + src + ': ' + cnt.toLocaleString());
    }
    console.log('');
  }

  // Exit code
  if (MISSING.length > 0) {
    console.log('FAIL: ' + MISSING.length + ' sector(s) have 0 records.');
    console.log('The treemap will have empty sectors. Ingest more data sources.');
    process.exit(1);
  } else {
    console.log('PASS: All sectors have at least 1 record.');
    process.exit(0);
  }
}

function padRight(str, len) {
  str = String(str);
  while (str.length < len) str += ' ';
  return str;
}

main();
