#!/usr/bin/env node
/**
 * fetch-rdtrabaja.js
 * Downloads all public data from the RD Trabaja API (empleateya.mt.gob.do)
 * and saves it as JSON files in data/raw/rdtrabaja/.
 *
 * Usage: node scripts/scrapers/fetch-rdtrabaja.js
 * Requirements: Node 18+ (uses native fetch)
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://empleateya.mt.gob.do/api';
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'data', 'raw', 'rdtrabaja');
const USER_AGENT = 'RDJobVisualizer/1.0 (https://jobs.sanba.dev)';

const ENDPOINTS = [
  {
    name: 'puestos',
    url: `${BASE_URL}/puestos?PageSize=500`,
    file: 'puestos.json',
    description: 'Active job vacancies',
  },
  {
    name: 'conceptos',
    url: `${BASE_URL}/conceptos`,
    file: 'conceptos.json',
    description: 'Lookup tables (46 categories)',
  },
  {
    name: 'regiones',
    url: `${BASE_URL}/conceptos/regionesFlat`,
    file: 'regiones.json',
    description: 'Provinces and municipalities',
  },
  {
    name: 'metadata',
    url: `${BASE_URL}/metadata`,
    file: 'metadata.json',
    description: 'Portal statistics',
  },
  {
    name: 'categorias-destacadas',
    url: `${BASE_URL}/categorias-destacadas`,
    file: 'categorias-destacadas.json',
    description: 'Sector ranking by job count',
  },
];

function timestamp() {
  return new Date().toISOString();
}

function log(msg) {
  console.log(`[${timestamp()}] ${msg}`);
}

function logError(msg) {
  console.error(`[${timestamp()}] ERROR: ${msg}`);
}

async function fetchEndpoint(endpoint) {
  log(`Fetching ${endpoint.description} from ${endpoint.url}`);

  try {
    const response = await fetch(endpoint.url, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!response.ok) {
      logError(`${endpoint.name}: HTTP ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    const outputPath = path.join(OUTPUT_DIR, endpoint.file);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    log(`Saved ${endpoint.file} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);

    return { name: endpoint.name, data };
  } catch (err) {
    logError(`${endpoint.name}: ${err.message}`);
    return null;
  }
}

function printSummary(results) {
  console.log('\n' + '='.repeat(60));
  log('FETCH SUMMARY');
  console.log('='.repeat(60));

  for (const result of results) {
    if (!result) continue;
    const { name, data } = result;

    switch (name) {
      case 'puestos':
        console.log(`  Puestos (vacancies): ${data.rowCount ?? data.data?.length ?? '?'} active listings`);
        break;
      case 'conceptos': {
        const categories = Object.keys(data).length;
        console.log(`  Conceptos: ${categories} lookup categories`);
        break;
      }
      case 'regiones': {
        const entries = Object.keys(data).length;
        console.log(`  Regiones: ${entries} geographic entries`);
        break;
      }
      case 'metadata':
        console.log(`  Metadata: ${data.countEmpresas ?? '?'} empresas, ${data.countCandidatos ?? '?'} candidatos, ${data.countPuestos ?? '?'} puestos total`);
        break;
      case 'categorias-destacadas':
        console.log(`  Categorias destacadas: ${Array.isArray(data) ? data.length : '?'} sectors`);
        break;
    }
  }

  const succeeded = results.filter(Boolean).length;
  const failed = results.length - succeeded;
  console.log(`\n  Total: ${succeeded}/${results.length} endpoints fetched successfully${failed ? `, ${failed} failed` : ''}`);
  console.log('='.repeat(60));
}

async function main() {
  log('Starting RD Trabaja data fetch');
  log(`Output directory: ${OUTPUT_DIR}`);

  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Fetch all endpoints sequentially to be respectful of the server
  const results = [];
  for (const endpoint of ENDPOINTS) {
    const result = await fetchEndpoint(endpoint);
    results.push(result);
  }

  printSummary(results);
  log('Done');
}

main().catch((err) => {
  logError(`Fatal: ${err.message}`);
  process.exit(1);
});
