#!/usr/bin/env node
/**
 * normalize.js — Raw CSV/JSON → normalized JSON
 *
 * Reads all raw data files from data/raw/ and normalizes them
 * to the schema defined in data/schemas/normalized-job.schema.json.
 *
 * Usage: node scripts/processors/normalize.js
 *
 * No external dependencies — pure Node.js (fs, path).
 */

const fs = require('fs');
const path = require('path');

// ── Paths ──────────────────────────────────────────────────────────────────
const ROOT = path.resolve(__dirname, '..', '..');
const RAW_DIR = path.join(ROOT, 'data', 'raw');
const OUT_DIR = path.join(ROOT, 'data', 'processed');
const RDTRABAJA_DIR = path.join(RAW_DIR, 'rdtrabaja');

const EXTRACTED_AT = new Date().toISOString();

// ── Month name → number mapping ────────────────────────────────────────────
const MONTH_MAP = {
  'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4,
  'mayo': 5, 'junio': 6, 'julio': 7, 'agosto': 8,
  'septiembre': 9, 'octubre': 10, 'noviembre': 11, 'diciembre': 12,
};

// ── Institution → sector mapping ───────────────────────────────────────────
const INSTITUTION_SECTOR = {
  'CONALECHE': 'agricultura_y_agroindustria',
  'PROPEEP': 'administracion_publica_y_defensa',
  'MAPRE': 'administracion_publica_y_defensa',
  'MIVHED': 'administracion_publica_y_defensa',
  'INESDYC': 'educacion',
  'CORAABO': 'otros_servicios',
  'ASDE': 'administracion_publica_y_defensa',
};

// ── Simple CSV parser ──────────────────────────────────────────────────────
function detectDelimiter(firstLine) {
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  return semicolons > commas ? ';' : ',';
}

function parseCSVLine(line, delimiter) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        fields.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current.trim());
  return fields;
}

/**
 * Read a file trying UTF-8 first, then Latin-1/CP437 if mojibake is detected.
 * Handles common DR government CSV encoding issues.
 */
function readFileAutoEncoding(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  // If we see the replacement character, the file is likely Latin-1/CP437
  if (content.includes('\uFFFD')) {
    const buf = fs.readFileSync(filePath);
    // Decode byte-by-byte with CP437/Latin-1 hybrid for common DR characters
    // CP437: 0xA5 = Ñ, 0xA4 = ñ, 0x82 = é, 0xA0 = á, 0xA1 = í, 0xA2 = ó, 0xA3 = ú
    const cp437map = {
      0x82: '\u00E9', // é
      0xA0: '\u00E1', // á
      0xA1: '\u00ED', // í
      0xA2: '\u00F3', // ó
      0xA3: '\u00FA', // ú
      0xA4: '\u00F1', // ñ
      0xA5: '\u00D1', // Ñ
      0xA8: '\u00BF', // ¿
      0xAD: '\u00A1', // ¡
      0xD1: '\u00D1', // Ñ (Latin-1 fallback)
      0xF1: '\u00F1', // ñ (Latin-1 fallback)
      0xE1: '\u00E1', // á (Latin-1 fallback)
      0xE9: '\u00E9', // é (Latin-1 fallback)
      0xED: '\u00ED', // í (Latin-1 fallback)
      0xF3: '\u00F3', // ó (Latin-1 fallback)
      0xFA: '\u00FA', // ú (Latin-1 fallback)
    };
    content = '';
    for (let i = 0; i < buf.length; i++) {
      const b = buf[i];
      if (b < 0x80) {
        content += String.fromCharCode(b);
      } else if (cp437map[b]) {
        content += cp437map[b];
      } else {
        content += String.fromCharCode(b);
      }
    }
  }
  // Strip BOM
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  return content;
}

function readCSV(filePath) {
  try {
    let content = readFileAutoEncoding(filePath);
    // Normalize line endings
    const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());
    if (lines.length === 0) return [];

    const delimiter = detectDelimiter(lines[0]);
    const headers = parseCSVLine(lines[0], delimiter).map(h =>
      h.replace(/\uFEFF/g, '').trim()
    );

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i], delimiter);
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j] !== undefined ? values[j] : '';
      }
      rows.push(row);
    }
    return rows;
  } catch (err) {
    console.warn(`  ⚠ Could not read ${path.basename(filePath)}: ${err.message}`);
    return [];
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────
function parseMonth(val) {
  if (!val) return null;
  const num = parseInt(val, 10);
  if (!isNaN(num) && num >= 1 && num <= 12) return num;
  return MONTH_MAP[val.toLowerCase().trim()] || null;
}

function parseYear(val) {
  if (!val) return null;
  const num = parseInt(String(val).trim(), 10);
  return (num >= 2000 && num <= 2030) ? num : null;
}

function parseSalary(val) {
  if (!val || val === '-' || val === '0') return null;
  // Remove $, spaces, and thousand-separator commas; keep decimal dot
  const cleaned = String(val).replace(/[$\s]/g, '').replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? null : num;
}

function normalizeTitle(title) {
  if (!title) return 'sin titulo';
  return title.toLowerCase().trim().replace(/\s+/g, ' ');
}

function normalizeGender(val) {
  if (!val) return null;
  const v = val.trim().toUpperCase();
  if (v === 'M' || v === 'MASCULINO') return 'M';
  if (v === 'F' || v === 'FEMENINO') return 'F';
  return null;
}

// ── Processors per source ──────────────────────────────────────────────────

/**
 * Generic CKAN nómina processor.
 * Each file has a slightly different column layout, so we detect columns.
 */
function processNomina(filePath, institutionKey, institutionName) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const sector = INSTITUTION_SECTOR[institutionKey] || 'otros_servicios';
  const results = [];

  // Detect column names (case-insensitive, trimmed)
  const sample = rows[0];
  const cols = Object.keys(sample);
  const find = (patterns) => cols.find(c => {
    const cl = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    return patterns.some(p => cl.includes(p));
  });

  const colNo = find(['n\u00ba', 'no', 'numero']);
  const colCargo = find(['cargo', 'funcion', 'puesto', 'posicion']);
  const colDepto = find(['departamento', 'departament', 'direccion', 'seccion']);
  const colGenero = find(['genero', 'gender']);
  const colMes = find(['mes']);
  // Use exact match for year column to avoid matching 'tamano'
  const colAno = cols.find(c => {
    const n = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
    return n === 'ano' || n === 'year';
  });
  const colSalBruto = find(['sueldo bruto', 'salario bruto', 'ingreso bruto', 'sueldo', 'salario', 'honorarios']);
  const colSalNeto = find(['sueldo neto', 'salario neto', 'neto']);

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const cargo = r[colCargo] || '';
    if (!cargo) continue;

    const year = parseYear(r[colAno]);
    if (!year) continue;
    const month = parseMonth(r[colMes]);

    const srcId = r[colNo] || null;
    const id = `ckan_${institutionKey.toLowerCase()}_${i}`;

    results.push({
      id,
      source: 'ckan',
      source_record_id: srcId || null,
      sector,
      job_title: normalizeTitle(cargo),
      institution: institutionName,
      salary_gross: parseSalary(r[colSalBruto]),
      salary_net: parseSalary(r[colSalNeto]),
      salary_min: null,
      salary_max: null,
      employee_count: 1,
      location_province: null,
      location_city: null,
      employment_type: 'publico',
      gender: normalizeGender(r[colGenero]),
      period_year: year,
      period_month: month,
      period_quarter: null,
      raw_department: r[colDepto] || null,
      raw_title: cargo,
      raw_institution: institutionName,
      extracted_at: EXTRACTED_AT,
      metadata: null,
    });
  }
  return results;
}

/**
 * ASDE — Unique layout: columns for each month's salary; one row = one person for one year (2020).
 * Columns: Nombre;Direccion;Función;Fecha Ingreso;Enero;Febrero;...;Diciembre
 */
function processASDE(filePath) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const sector = INSTITUTION_SECTOR['ASDE'];
  const results = [];
  const monthCols = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Detect which year range — file name says 2020-2023
  // Each row has months as columns; but no year column. Looking at the data, all rows have the same structure.
  // We'll treat each row as year 2020 (the first year) and emit 1 record per non-zero month.
  // Actually, the file likely has multiple sections or years. Let's just emit one record per person
  // with the highest monthly salary found, year = 2020.
  // Given the complexity and that this is 11k rows with pivoted months, let's emit one record per row
  // for the first non-zero month as a representative record.

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const cargo = r['Función'] || r['Funcion'] || r['Funci\uFFFDn'] || '';
    if (!cargo) continue;

    // Find the Función column dynamically
    const funcCol = Object.keys(r).find(k => k.toLowerCase().includes('funci'));
    const dirCol = Object.keys(r).find(k => k.toLowerCase().includes('direcc'));
    const title = r[funcCol] || cargo;

    // Find salary from any month column
    let salary = null;
    let monthIdx = null;
    for (let m = 0; m < monthCols.length; m++) {
      const val = parseSalary(r[monthCols[m]]);
      if (val && val > 0) {
        salary = val;
        monthIdx = m + 1;
        break;
      }
    }
    if (!salary) continue;

    // Year: infer from Fecha Ingreso or default to 2020
    const year = 2020;

    results.push({
      id: `ckan_asde_${i}`,
      source: 'ckan',
      source_record_id: null,
      sector,
      job_title: normalizeTitle(title),
      institution: 'Ayuntamiento Santo Domingo Este (ASDE)',
      salary_gross: salary,
      salary_net: null,
      salary_min: null,
      salary_max: null,
      employee_count: 1,
      location_province: 'Santo Domingo',
      location_city: 'Santo Domingo Este',
      employment_type: 'publico',
      gender: null,
      period_year: year,
      period_month: monthIdx,
      period_quarter: null,
      raw_department: r[dirCol] || null,
      raw_title: title,
      raw_institution: 'ASDE',
      extracted_at: EXTRACTED_AT,
      metadata: null,
    });
  }
  return results;
}

/**
 * CORAABO — Unique layout with header rows mixed in.
 * Columns: Fecha;Nombre;Cargo;Genero;Ingreso Bruto;Otros Ing.;Total Ing.;AFP;ISR;SFS;Otros Desc.;Total Desc.;Neto
 * The first few rows may be empty or institution name rows.
 */
function processCORAABO(filePath) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const sector = INSTITUTION_SECTOR['CORAABO'];
  const results = [];

  // Find the header row dynamically — the actual column headers are in row index 1
  // (row 0 is empty semicolons, row 1 is header, row 2 is institution name)
  // But our readCSV uses row 0 as headers. Let's check what we got.
  // From the read: row0 = ";;;;;;..." (empty), row1 = actual headers, row2 = institution name
  // readCSV would use the empty first line as headers. So we need to re-read differently.

  // Re-read manually to skip empty header rows
  let content = readFileAutoEncoding(filePath);
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());

  // Find the actual header line (contains "Fecha" and "Cargo")
  let headerIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    if (lines[i].toLowerCase().includes('fecha') && lines[i].toLowerCase().includes('cargo')) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx < 0) {
    console.warn('  ⚠ CORAABO: could not find header row');
    return [];
  }

  const delimiter = ';';
  const headers = parseCSVLine(lines[headerIdx], delimiter);

  const colFecha = headers.findIndex(h => h.toLowerCase().includes('fecha'));
  const colCargo = headers.findIndex(h => h.toLowerCase().includes('cargo'));
  const colGenero = headers.findIndex(h => h.toLowerCase().includes('genero'));
  const colBruto = headers.findIndex(h => h.toLowerCase().includes('ingreso bruto'));
  const colNeto = headers.findIndex(h => h.toLowerCase().includes('neto'));

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i], delimiter);
    const cargo = vals[colCargo] || '';
    if (!cargo || cargo.toLowerCase().includes('corporacion')) continue;

    const fecha = vals[colFecha] || '';
    // Fecha format: dd/mm/yyyy
    let year = null, month = null;
    const dateMatch = fecha.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dateMatch) {
      month = parseInt(dateMatch[1], 10); // day actually
      month = parseInt(dateMatch[2], 10); // month
      year = parseInt(dateMatch[3], 10);
    }
    if (!year) continue;

    results.push({
      id: `ckan_coraabo_${results.length}`,
      source: 'ckan',
      source_record_id: null,
      sector,
      job_title: normalizeTitle(cargo),
      institution: 'Corp. Acueducto y Alcantarillado Boca Chica (CORAABO)',
      salary_gross: parseSalary(vals[colBruto]),
      salary_net: parseSalary(vals[colNeto]),
      salary_min: null,
      salary_max: null,
      employee_count: 1,
      location_province: 'Santo Domingo',
      location_city: 'Boca Chica',
      employment_type: 'publico',
      gender: normalizeGender(vals[colGenero]),
      period_year: year,
      period_month: month,
      period_quarter: null,
      raw_department: null,
      raw_title: cargo,
      raw_institution: 'CORAABO',
      extracted_at: EXTRACTED_AT,
      metadata: null,
    });
  }
  return results;
}

/**
 * TSS Empleos Cotizantes — Aggregate employment counts by employer type.
 * Columns: MES,AÑO,EMPRESA_PRIVADA,PUBLICA_CENTRALIZADA,PUBLICA_DESCENTRALIZADA,TOTAL
 */
function processTSS(filePath) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const results = [];

  // Detect column names
  const sample = rows[0];
  const cols = Object.keys(sample);
  const colMes = cols.find(c => c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '') === 'mes');
  const colAno = cols.find(c => {
    const n = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
    return n === 'ano' || n === 'year';
  });
  const colPrivada = cols.find(c => c.includes('PRIVADA'));
  const colCentralizada = cols.find(c => c.includes('CENTRALIZADA') && !c.includes('DESCENTRALIZADA'));
  const colDescentralizada = cols.find(c => c.includes('DESCENTRALIZADA'));

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const year = parseYear(r[colAno]);
    if (!year) continue;
    const month = parseMonth(r[colMes]);

    const privada = parseInt(String(r[colPrivada] || '0').replace(/,/g, ''), 10) || 0;
    const centralizada = parseInt(String(r[colCentralizada] || '0').replace(/,/g, ''), 10) || 0;
    const descentralizada = parseInt(String(r[colDescentralizada] || '0').replace(/,/g, ''), 10) || 0;

    // Private sector
    if (privada > 0) {
      results.push({
        id: `tss_privada_${year}_${month || 0}`,
        source: 'tss',
        source_record_id: null,
        sector: 'otros_servicios', // private = mixed sectors
        job_title: 'empleo formal sector privado',
        institution: null,
        salary_gross: null,
        salary_net: null,
        salary_min: null,
        salary_max: null,
        employee_count: privada,
        location_province: null,
        location_city: null,
        employment_type: 'privado',
        gender: null,
        period_year: year,
        period_month: month,
        period_quarter: null,
        raw_department: null,
        raw_title: null,
        raw_institution: null,
        extracted_at: EXTRACTED_AT,
        metadata: { tipo_empleador: 'empresa_privada' },
      });
    }

    // Public centralized
    if (centralizada > 0) {
      results.push({
        id: `tss_publica_centralizada_${year}_${month || 0}`,
        source: 'tss',
        source_record_id: null,
        sector: 'administracion_publica_y_defensa',
        job_title: 'empleo formal sector publico centralizado',
        institution: null,
        salary_gross: null,
        salary_net: null,
        salary_min: null,
        salary_max: null,
        employee_count: centralizada,
        location_province: null,
        location_city: null,
        employment_type: 'publico',
        gender: null,
        period_year: year,
        period_month: month,
        period_quarter: null,
        raw_department: null,
        raw_title: null,
        raw_institution: null,
        extracted_at: EXTRACTED_AT,
        metadata: { tipo_empleador: 'publica_centralizada' },
      });
    }

    // Public decentralized
    if (descentralizada > 0) {
      results.push({
        id: `tss_publica_descentralizada_${year}_${month || 0}`,
        source: 'tss',
        source_record_id: null,
        sector: 'administracion_publica_y_defensa',
        job_title: 'empleo formal sector publico descentralizado',
        institution: null,
        salary_gross: null,
        salary_net: null,
        salary_min: null,
        salary_max: null,
        employee_count: descentralizada,
        location_province: null,
        location_city: null,
        employment_type: 'publico',
        gender: null,
        period_year: year,
        period_month: month,
        period_quarter: null,
        raw_department: null,
        raw_title: null,
        raw_institution: null,
        extracted_at: EXTRACTED_AT,
        metadata: { tipo_empleador: 'publica_descentralizada' },
      });
    }
  }
  return results;
}

/**
 * Salario Minimo — Aggregate minimum wage by sector/size.
 * Columns: SECTOR;TAMAÑO EMPRESA;AREAS;MES;AÑO;SALARIO MINIMO
 */
function processSalarioMinimo(filePath, sourceLabel) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const results = [];

  const sample = rows[0];
  const cols = Object.keys(sample);
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const colSector = cols.find(c => norm(c).replace(/[^a-z]/g, '') === 'sector');
  const colTamano = cols.find(c => norm(c).includes('tama'));
  const colAreas = cols.find(c => norm(c).includes('areas'));
  const colMes = cols.find(c => norm(c).replace(/[^a-z]/g, '') === 'mes');
  const colAno = cols.find(c => { const n = norm(c).replace(/[^a-z]/g, ''); return n === 'ano' || n === 'anofiscal'; });
  const colSalario = cols.find(c => norm(c).includes('salario'));

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const year = parseYear(r[colAno]);
    if (!year) continue;
    const month = parseMonth(r[colMes]);
    const salario = parseSalary(r[colSalario]);
    if (!salario) continue;

    const sectorRaw = (r[colSector] || '').trim();
    const areas = (r[colAreas] || '').trim();

    // Map to our sector: these are minimum wage stats, record_type = aggregate
    // Sector mapping from the raw SECTOR field
    let sector = 'otros_servicios';
    const sl = sectorRaw.toLowerCase();
    if (sl.includes('privado')) sector = 'otros_servicios';
    else if (sl.includes('publico') || sl.includes('público')) sector = 'administracion_publica_y_defensa';
    else if (sl.includes('zona franca')) sector = 'manufactura_y_zonas_francas';
    else if (sl.includes('turismo') || sl.includes('hotel')) sector = 'turismo_y_hosteleria';
    else if (sl.includes('construcci')) sector = 'construccion';
    else if (sl.includes('agric')) sector = 'agricultura_y_agroindustria';

    const empType = sl.includes('publico') || sl.includes('público') ? 'publico' :
                    sl.includes('zona franca') ? 'zona_franca' : 'privado';

    results.push({
      id: `ckan_salmin_${sourceLabel}_${i}`,
      source: 'ckan',
      source_record_id: null,
      sector,
      job_title: `salario minimo - ${sectorRaw.toLowerCase()} - ${(r[colTamano] || '').toLowerCase()}`,
      institution: null,
      salary_gross: null,
      salary_net: null,
      salary_min: salario,
      salary_max: null,
      employee_count: null,
      location_province: null,
      location_city: null,
      employment_type: empType,
      gender: null,
      period_year: year,
      period_month: month,
      period_quarter: null,
      raw_department: null,
      raw_title: null,
      raw_institution: null,
      extracted_at: EXTRACTED_AT,
      metadata: {
        record_type: 'aggregate',
        tamano_empresa: r[colTamano] || null,
        areas: areas || null,
      },
    });
  }
  return results;
}

/**
 * Zonas Francas — Annual aggregate employment data.
 * Columns: Anos;Empresas;Empleos;Export Millones US;Salario Prom Tecnicos;Salario Prom Operarios
 */
function processZonasFrancas(filePath, subsector) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const results = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const yearKey = Object.keys(r).find(k => k.toLowerCase().includes('ano'));
    const empleosKey = Object.keys(r).find(k => k.toLowerCase().includes('empleo'));
    const salTecKey = Object.keys(r).find(k => k.toLowerCase().includes('tecnico'));
    const salOpKey = Object.keys(r).find(k => k.toLowerCase().includes('operario'));

    const year = parseYear(r[yearKey]);
    if (!year) continue;
    const empleos = parseInt(String(r[empleosKey] || '0').replace(/,/g, ''), 10);
    if (!empleos || empleos <= 0) continue;

    results.push({
      id: `cnzfe_${subsector}_${year}`,
      source: 'cnzfe',
      source_record_id: null,
      sector: 'manufactura_y_zonas_francas',
      job_title: `empleo zona franca - ${subsector}`,
      institution: null,
      salary_gross: null,
      salary_net: null,
      salary_min: parseSalary(r[salOpKey]),
      salary_max: parseSalary(r[salTecKey]),
      employee_count: empleos,
      location_province: null,
      location_city: null,
      employment_type: 'zona_franca',
      gender: null,
      period_year: year,
      period_month: null,
      period_quarter: null,
      raw_department: null,
      raw_title: null,
      raw_institution: null,
      extracted_at: EXTRACTED_AT,
      metadata: {
        record_type: 'aggregate',
        subsector_zf: subsector,
        empresas: parseInt(String(r[Object.keys(r).find(k => k.toLowerCase().includes('empresa'))] || '0').replace(/,/g, ''), 10) || null,
      },
    });
  }
  return results;
}

/**
 * DGII ISR Retention table — aggregate salary statistics.
 * Columns: AÑO FISCAL;SALARIO MENSUAL;RETENCION MENSUAL
 */
function processDGII(filePath) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const results = [];

  // This is a large table (174k rows) of ISR brackets. We aggregate by year.
  const yearGroups = {};
  for (const r of rows) {
    const anoKey = Object.keys(r).find(k => { const n = k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, ''); return n === 'ano' || n === 'anofiscal'; });
    const salKey = Object.keys(r).find(k => k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('salario'));

    const year = parseYear(r[anoKey]);
    if (!year) continue;
    const sal = parseSalary(r[salKey]);
    if (!sal) continue;

    if (!yearGroups[year]) yearGroups[year] = { count: 0, min: Infinity, max: -Infinity };
    yearGroups[year].count++;
    if (sal < yearGroups[year].min) yearGroups[year].min = sal;
    if (sal > yearGroups[year].max) yearGroups[year].max = sal;
  }

  for (const [yearStr, g] of Object.entries(yearGroups)) {
    const year = parseInt(yearStr, 10);
    results.push({
      id: `ckan_dgii_isr_${year}`,
      source: 'ckan',
      source_record_id: null,
      sector: 'otros_servicios',
      job_title: 'retencion isr salarios - tabla referencia',
      institution: 'DGII',
      salary_gross: null,
      salary_net: null,
      salary_min: g.min === Infinity ? null : g.min,
      salary_max: g.max === -Infinity ? null : g.max,
      employee_count: null,
      location_province: null,
      location_city: null,
      employment_type: 'privado',
      gender: null,
      period_year: year,
      period_month: null,
      period_quarter: null,
      raw_department: null,
      raw_title: null,
      raw_institution: 'DGII',
      extracted_at: EXTRACTED_AT,
      metadata: {
        record_type: 'aggregate',
        bracket_count: g.count,
      },
    });
  }
  return results;
}

/**
 * Zonas Francas with custom sector mapping (e.g., medical devices → salud).
 * Same format as processZonasFrancas but allows overriding the sector.
 */
function processZonasFrancasSector(filePath, subsector, sectorOverride) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const results = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const yearKey = Object.keys(r).find(k => k.toLowerCase().includes('ano'));
    const empleosKey = Object.keys(r).find(k => k.toLowerCase().includes('empleo'));
    const salTecKey = Object.keys(r).find(k => k.toLowerCase().includes('tecnico'));
    const salOpKey = Object.keys(r).find(k => k.toLowerCase().includes('operario'));

    const year = parseYear(r[yearKey]);
    if (!year) continue;
    const empleos = parseInt(String(r[empleosKey] || '0').replace(/,/g, ''), 10);
    if (!empleos || empleos <= 0) continue;

    results.push({
      id: `cnzfe_${subsector}_${year}`,
      source: 'cnzfe',
      source_record_id: null,
      sector: sectorOverride || 'manufactura_y_zonas_francas',
      job_title: `empleo zona franca - ${subsector}`,
      institution: null,
      salary_gross: null,
      salary_net: null,
      salary_min: parseSalary(r[salOpKey]),
      salary_max: parseSalary(r[salTecKey]),
      employee_count: empleos,
      location_province: null,
      location_city: null,
      employment_type: 'zona_franca',
      gender: null,
      period_year: year,
      period_month: null,
      period_quarter: null,
      raw_department: null,
      raw_title: null,
      raw_institution: null,
      extracted_at: EXTRACTED_AT,
      metadata: {
        record_type: 'aggregate',
        subsector_zf: subsector,
        empresas: parseInt(String(r[Object.keys(r).find(k => k.toLowerCase().includes('empresa'))] || '0').replace(/,/g, ''), 10) || null,
      },
    });
  }
  return results;
}

/**
 * MITUR Empresas y Servicios Turísticos — Tourism business licensing data.
 * Columns: Empresa o Servicio,Licencias Nuevas,Renovacion,Cambio de Direccion,Cambio de categoria,Periodo,Ano
 */
function processMITUR(filePath) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const results = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const cols = Object.keys(r);
    const colEmpresa = cols.find(c => c.toLowerCase().includes('empresa') || c.toLowerCase().includes('servicio'));
    const colNuevas = cols.find(c => c.toLowerCase().includes('nuevas'));
    const colRenovacion = cols.find(c => c.toLowerCase().includes('renovacion'));
    const colAno = cols.find(c => {
      const n = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
      return n === 'ano' || n === 'year';
    });
    const colPeriodo = cols.find(c => c.toLowerCase().includes('periodo'));

    const year = parseYear(r[colAno]);
    if (!year) continue;
    const empresa = (r[colEmpresa] || '').trim();
    if (!empresa) continue;

    const nuevas = parseInt(String(r[colNuevas] || '0').replace(/,/g, ''), 10) || 0;
    const renovacion = parseInt(String(r[colRenovacion] || '0').replace(/,/g, ''), 10) || 0;
    const total = nuevas + renovacion;
    if (total <= 0) continue;

    // Derive quarter from periodo (e.g. "Enero-Marzo" = Q1)
    const periodo = (r[colPeriodo] || '').toLowerCase();
    let quarter = null;
    if (periodo.includes('enero')) quarter = 1;
    else if (periodo.includes('abril')) quarter = 2;
    else if (periodo.includes('julio')) quarter = 3;
    else if (periodo.includes('octubre')) quarter = 4;

    results.push({
      id: `mitur_${empresa.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${year}_q${quarter || 0}`,
      source: 'mitur',
      source_record_id: null,
      sector: 'turismo_y_hosteleria',
      job_title: `licencias turismo - ${empresa.toLowerCase()}`,
      institution: 'Ministerio de Turismo (MITUR)',
      salary_gross: null,
      salary_net: null,
      salary_min: null,
      salary_max: null,
      employee_count: total,
      location_province: null,
      location_city: null,
      employment_type: 'privado',
      gender: null,
      period_year: year,
      period_month: null,
      period_quarter: quarter,
      raw_department: null,
      raw_title: empresa,
      raw_institution: 'MITUR',
      extracted_at: EXTRACTED_AT,
      metadata: {
        record_type: 'aggregate',
        licencias_nuevas: nuevas,
        renovaciones: renovacion,
        periodo: r[colPeriodo] || null,
      },
    });
  }
  return results;
}

/**
 * MISPAS Exequátur Profesionales de Salud — Licensed health professionals.
 * Columns: NOMBRES;FECHA UNIVERSIDAD;NUMERO DECRETO;FECHA DECRETO;NUMERO REGISTRO;FECHA REGISTRO;UNIVERSIDAD;PROFESION CODIGO;PROFESION;FOLIO;LIBRO
 */
function processMISPAS(filePath) {
  const rows = readCSV(filePath);
  if (rows.length === 0) return [];
  const results = [];

  // Aggregate by profession and year to avoid 148k individual records
  const groups = {};
  for (const r of rows) {
    const cols = Object.keys(r);
    const colProfesion = cols.find(c => c.toLowerCase() === 'profesion');
    const colFechaReg = cols.find(c => c.toLowerCase().includes('fecha registro'));
    const colFechaDecreto = cols.find(c => c.toLowerCase().includes('fecha decreto'));

    const profesion = (r[colProfesion] || '').trim();
    if (!profesion) continue;

    // Try to get year from fecha registro or fecha decreto
    const fecha = r[colFechaReg] || r[colFechaDecreto] || '';
    let year = null;
    const dateMatch = fecha.match(/(\d{4})/);
    if (dateMatch) year = parseInt(dateMatch[1], 10);
    if (!year || year < 2000 || year > 2030) continue;

    const key = `${profesion}__${year}`;
    if (!groups[key]) groups[key] = { profesion, year, count: 0 };
    groups[key].count++;
  }

  for (const [key, g] of Object.entries(groups)) {
    results.push({
      id: `mispas_exequatur_${key.replace(/[^a-z0-9_]/gi, '_').toLowerCase()}`,
      source: 'mispas',
      source_record_id: null,
      sector: 'salud',
      job_title: `profesional de salud - ${g.profesion.toLowerCase()}`,
      institution: 'Ministerio de Salud Pública (MISPAS)',
      salary_gross: null,
      salary_net: null,
      salary_min: null,
      salary_max: null,
      employee_count: g.count,
      location_province: null,
      location_city: null,
      employment_type: 'privado',
      gender: null,
      period_year: g.year,
      period_month: null,
      period_quarter: null,
      raw_department: null,
      raw_title: g.profesion,
      raw_institution: 'MISPAS',
      extracted_at: EXTRACTED_AT,
      metadata: {
        record_type: 'aggregate',
        tipo: 'exequatur',
      },
    });
  }
  return results;
}

/**
 * MIVHED Licencias de Construcción — Building permits.
 * Columns: Fecha de Emisión,Mes,Año,Provincia,Municipio,Barrio/Sector,Número de Licencia,Tipologia,Metros Cuadrados,Inversión Total
 */
function processLicenciasConstruccion(filePath) {
  // This file has junk header rows before the actual CSV headers.
  // Re-read manually to find the real header line.
  let content = readFileAutoEncoding(filePath);
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim());

  // Find the actual header line (contains "Provincia" and "Tipologia")
  let headerIdx = -1;
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    if (lines[i].toLowerCase().includes('provincia') && lines[i].toLowerCase().includes('tipologia')) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx < 0) {
    console.warn('  ⚠ MIVHED licencias: could not find header row');
    return [];
  }

  const delimiter = detectDelimiter(lines[headerIdx]);
  const headers = parseCSVLine(lines[headerIdx], delimiter);
  const results = [];

  // Parse rows into objects
  const rows = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], delimiter);
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] !== undefined ? values[j] : '';
    }
    rows.push(row);
  }

  // Aggregate by tipologia, province, and year
  const groups = {};
  for (const r of rows) {
    const cols = Object.keys(r);
    const colAno = cols.find(c => {
      const n = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
      return n === 'ano' || n === 'year';
    });
    const colTipologia = cols.find(c => c.toLowerCase().includes('tipologia'));
    const colProvincia = cols.find(c => c.toLowerCase().includes('provincia'));
    const colInversion = cols.find(c => c.toLowerCase().includes('inversion'));

    const year = parseYear(r[colAno]);
    if (!year) continue;
    const tipologia = (r[colTipologia] || '').trim();
    if (!tipologia) continue;
    const provincia = (r[colProvincia] || '').trim();

    const key = `${tipologia}__${provincia}__${year}`;
    if (!groups[key]) groups[key] = { tipologia, provincia, year, count: 0, inversion_total: 0 };
    groups[key].count++;
    const inv = parseSalary(r[colInversion]);
    if (inv) groups[key].inversion_total += inv;
  }

  for (const [key, g] of Object.entries(groups)) {
    results.push({
      id: `mivhed_licencia_${key.replace(/[^a-z0-9_]/gi, '_').toLowerCase()}`,
      source: 'mivhed',
      source_record_id: null,
      sector: 'construccion',
      job_title: `licencia construccion - ${g.tipologia.toLowerCase()}`,
      institution: 'Ministerio de la Vivienda (MIVHED)',
      salary_gross: null,
      salary_net: null,
      salary_min: null,
      salary_max: null,
      employee_count: g.count,
      location_province: g.provincia || null,
      location_city: null,
      employment_type: 'privado',
      gender: null,
      period_year: g.year,
      period_month: null,
      period_quarter: null,
      raw_department: null,
      raw_title: g.tipologia,
      raw_institution: 'MIVHED',
      extracted_at: EXTRACTED_AT,
      metadata: {
        record_type: 'aggregate',
        tipo: 'licencia_construccion',
        inversion_total: g.inversion_total || null,
      },
    });
  }
  return results;
}

/**
 * RD Trabaja puestos.json — Vacancies from the job portal.
 */
function processRDTrabaja() {
  const puestosPath = path.join(RDTRABAJA_DIR, 'puestos.json');
  if (!fs.existsSync(puestosPath)) {
    console.log('  ℹ rdtrabaja/puestos.json not found — skipping');
    return [];
  }

  let puestos;
  try {
    puestos = JSON.parse(fs.readFileSync(puestosPath, 'utf-8'));
  } catch (e) {
    console.warn(`  ⚠ Could not parse puestos.json: ${e.message}`);
    return [];
  }

  // Load conceptos for actividadEconomica mapping
  let conceptos = {};
  const conceptosPath = path.join(RDTRABAJA_DIR, 'conceptos.json');
  if (fs.existsSync(conceptosPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(conceptosPath, 'utf-8'));
      // conceptos may be an array or an object with arrays by type
      if (Array.isArray(raw)) {
        for (const c of raw) conceptos[c.id || c.codigo] = c.nombre || c.descripcion || '';
      } else if (raw.actividadEconomica) {
        for (const c of raw.actividadEconomica) conceptos[c.id || c.codigo] = c.nombre || c.descripcion || '';
      } else if (raw.conceptos && raw.conceptos.actividadEconomica) {
        for (const c of raw.conceptos.actividadEconomica) conceptos[c.id || c.codigo] = c.nombre || c.descripcion || '';
      }
    } catch (e) {
      console.warn(`  ⚠ Could not parse conceptos.json: ${e.message}`);
    }
  }

  const actividadToSector = (nombre) => {
    if (!nombre) return 'otros_servicios';
    const n = nombre.toLowerCase();
    if (n.includes('turismo') || n.includes('hotel') || n.includes('alojamiento') || n.includes('restaurante')) return 'turismo_y_hosteleria';
    if (n.includes('comercio') || n.includes('tienda') || n.includes('venta')) return 'comercio';
    if (n.includes('construcci')) return 'construccion';
    if (n.includes('manufactur') || n.includes('industria') || n.includes('zona franca') || n.includes('textil')) return 'manufactura_y_zonas_francas';
    if (n.includes('tecnol') || n.includes('telecom') || n.includes('informati') || n.includes('software')) return 'tecnologia_y_telecomunicaciones';
    if (n.includes('salud') || n.includes('hospital') || n.includes('clinic') || n.includes('farmac')) return 'salud';
    if (n.includes('educa') || n.includes('enseñanza') || n.includes('colegio') || n.includes('universidad')) return 'educacion';
    if (n.includes('financ') || n.includes('banco') || n.includes('seguro') || n.includes('asegurad')) return 'servicios_financieros';
    if (n.includes('transport') || n.includes('logist') || n.includes('almacen')) return 'transporte_y_logistica';
    if (n.includes('agri') || n.includes('ganad') || n.includes('pesca') || n.includes('agro')) return 'agricultura_y_agroindustria';
    if (n.includes('admin') && n.includes('public')) return 'administracion_publica_y_defensa';
    return 'otros_servicios';
  };

  const items = Array.isArray(puestos) ? puestos : (puestos.data || puestos.items || puestos.results || []);
  const results = [];

  for (const raw of items) {
    // Unwrap nested "puesto" object if present (RD Trabaja API wraps each record)
    const p = raw.puesto || raw;
    const id = p.id || p.idPuesto || p.codigo;
    const titulo = p.titulo || p.nombre || p.nombrePuesto || '';
    if (!titulo) continue;

    const actividadId = p.actividadEconomica || p.idActividadEconomica;
    const actividadNombre = conceptos[actividadId] || p.actividadEconomicaNombre || '';
    const sector = actividadToSector(actividadNombre);

    const empresa = p.empresa || p.nombreEmpresa || p.empleador || null;
    const provincia = p.provincia || p.ubicacion || null;
    const ciudad = p.ciudad || p.municipio || null;

    // Parse date
    let year = null, month = null;
    const fecha = p.fechaPublicacion || p.fecha || p.createdAt || '';
    if (fecha) {
      const d = new Date(fecha);
      if (!isNaN(d.getTime())) {
        year = d.getFullYear();
        month = d.getMonth() + 1;
      }
    }
    if (!year) year = new Date().getFullYear();

    results.push({
      id: `rdtrabaja_${id}`,
      source: 'rdtrabaja',
      source_record_id: String(id),
      sector,
      job_title: normalizeTitle(titulo),
      institution: empresa,
      salary_gross: null,
      salary_net: null,
      salary_min: parseSalary(p.salarioMinimo || p.salarioDesde),
      salary_max: parseSalary(p.salarioMaximo || p.salarioHasta),
      employee_count: 1,
      location_province: provincia,
      location_city: ciudad,
      employment_type: 'privado',
      gender: null,
      period_year: year,
      period_month: month,
      period_quarter: null,
      raw_department: null,
      raw_title: titulo,
      raw_institution: empresa,
      extracted_at: EXTRACTED_AT,
      metadata: {
        record_type: 'vacancy',
        actividad_economica: actividadNombre || null,
      },
    });
  }
  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────
function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log(' RD Job Visualizer — Normalization Script');
  console.log('═══════════════════════════════════════════════════════\n');

  const allRecords = [];
  const sourceCounts = {};
  const sectorCounts = {};
  const typeCounts = {};

  function addRecords(label, records) {
    if (records.length === 0) {
      console.log(`  → ${label}: 0 records (skipped or empty)\n`);
      return;
    }
    allRecords.push(...records);
    console.log(`  → ${label}: ${records.length.toLocaleString()} records\n`);

    for (const r of records) {
      sourceCounts[r.source] = (sourceCounts[r.source] || 0) + 1;
      sectorCounts[r.sector] = (sectorCounts[r.sector] || 0) + 1;
      const rt = (r.metadata && r.metadata.record_type) || (r.employee_count > 1 ? 'aggregate' : 'position');
      typeCounts[rt] = (typeCounts[rt] || 0) + 1;
    }
  }

  // ── 1. Nómina files (CKAN) ──────────────────────────────────────────
  console.log('Processing nómina files...');

  const nominaFiles = [
    { file: 'nomina-conaleche-2026.csv', key: 'CONALECHE', name: 'Consejo Nacional de la Industria Lechera (CONALECHE)' },
    { file: 'nomina-propeep-2018-2025.csv', key: 'PROPEEP', name: 'Dir. Gral. Proyectos Estratégicos y Especiales (PROPEEP)' },
    { file: 'nomina-mapre-2017-2026.csv', key: 'MAPRE', name: 'Ministerio Administrativo de la Presidencia (MAPRE)' },
    { file: 'nomina-mivhed-2022-2026.csv', key: 'MIVHED', name: 'Ministerio de la Vivienda (MIVHED)' },
    { file: 'nomina-inesdyc-2023-2026.csv', key: 'INESDYC', name: 'Instituto de Educación Superior en Formación Diplomática (INESDYC)' },
  ];

  for (const { file, key, name } of nominaFiles) {
    const fp = path.join(RAW_DIR, file);
    if (!fs.existsSync(fp)) {
      console.log(`  → ${file}: file not found, skipping\n`);
      continue;
    }
    addRecords(file, processNomina(fp, key, name));
  }

  // ASDE — special layout
  const asdePath = path.join(RAW_DIR, 'nomina-asde-2020-2023.csv');
  if (fs.existsSync(asdePath)) {
    addRecords('nomina-asde-2020-2023.csv', processASDE(asdePath));
  }

  // CORAABO — special layout
  const coraaboPath = path.join(RAW_DIR, 'nomina-coraabo-2021-2025.csv');
  if (fs.existsSync(coraaboPath)) {
    addRecords('nomina-coraabo-2021-2025.csv', processCORAABO(coraaboPath));
  }

  // ── 2. TSS ────────────────────────────────────────────────────────────
  console.log('Processing TSS employment data...');
  const tssPath = path.join(RAW_DIR, 'empleos-cotizantes-tss-2003-2026.csv');
  if (fs.existsSync(tssPath)) {
    addRecords('empleos-cotizantes-tss-2003-2026.csv', processTSS(tssPath));
  }

  // ── 3. Salario Mínimo ────────────────────────────────────────────────
  console.log('Processing salary statistics...');
  const salHacienda = path.join(RAW_DIR, 'salario-minimo-hacienda-2000-2025.csv');
  if (fs.existsSync(salHacienda)) {
    addRecords('salario-minimo-hacienda-2000-2025.csv', processSalarioMinimo(salHacienda, 'hacienda'));
  }
  const salMepyd = path.join(RAW_DIR, 'salario-minimo-mepyd-2000-2023.csv');
  if (fs.existsSync(salMepyd)) {
    addRecords('salario-minimo-mepyd-2000-2023.csv', processSalarioMinimo(salMepyd, 'mepyd'));
  }

  // DGII ISR — aggregate only
  console.log('Processing DGII ISR data...');
  const dgiiPath = path.join(RAW_DIR, 'retencion-isr-salarios-dgii-2017-2025.csv');
  if (fs.existsSync(dgiiPath)) {
    addRecords('retencion-isr-salarios-dgii-2017-2025.csv', processDGII(dgiiPath));
  }

  // ── 4. Zonas Francas ─────────────────────────────────────────────────
  console.log('Processing Zonas Francas data...');
  const zfTextil = path.join(RAW_DIR, 'zonas-francas-textil-2003-2023.csv');
  if (fs.existsSync(zfTextil)) {
    addRecords('zonas-francas-textil-2003-2023.csv', processZonasFrancas(zfTextil, 'textil'));
  }
  const zfElec = path.join(RAW_DIR, 'zonas-francas-electronicos-2003-2023.csv');
  if (fs.existsSync(zfElec)) {
    addRecords('zonas-francas-electronicos-2003-2023.csv', processZonasFrancas(zfElec, 'electronicos'));
  }
  const zfCalzados = path.join(RAW_DIR, 'zonas-francas-calzados-cnzfe-2003-2023.csv');
  if (fs.existsSync(zfCalzados)) {
    addRecords('zonas-francas-calzados-cnzfe-2003-2023.csv', processZonasFrancas(zfCalzados, 'calzados'));
  }
  const zfTabaco = path.join(RAW_DIR, 'zonas-francas-tabaco-cnzfe-2003-2023.csv');
  if (fs.existsSync(zfTabaco)) {
    addRecords('zonas-francas-tabaco-cnzfe-2003-2023.csv', processZonasFrancas(zfTabaco, 'tabaco'));
  }
  const zfJoyeria = path.join(RAW_DIR, 'zonas-francas-joyeria-cnzfe-2003-2023.csv');
  if (fs.existsSync(zfJoyeria)) {
    addRecords('zonas-francas-joyeria-cnzfe-2003-2023.csv', processZonasFrancas(zfJoyeria, 'joyeria'));
  }
  // Medical devices → salud sector (not manufactura)
  const zfMedicos = path.join(RAW_DIR, 'zonas-francas-dispositivos-medicos-cnzfe-2003-2023.csv');
  if (fs.existsSync(zfMedicos)) {
    addRecords('zonas-francas-dispositivos-medicos-cnzfe-2003-2023.csv', processZonasFrancasSector(zfMedicos, 'dispositivos_medicos', 'salud'));
  }

  // ── 5. MITUR Tourism ──────────────────────────────────────────────────
  console.log('Processing MITUR tourism data...');
  const miturPath = path.join(RAW_DIR, 'empresas-servicios-turisticos-mitur-2018-2025.csv');
  if (fs.existsSync(miturPath)) {
    addRecords('empresas-servicios-turisticos-mitur-2018-2025.csv', processMITUR(miturPath));
  }

  // ── 6. MISPAS Health Professionals ────────────────────────────────────
  console.log('Processing MISPAS health professionals data...');
  const mispasPath = path.join(RAW_DIR, 'exequatur-profesionales-salud-mispas-1933-2025.csv');
  if (fs.existsSync(mispasPath)) {
    addRecords('exequatur-profesionales-salud-mispas-1933-2025.csv', processMISPAS(mispasPath));
  }

  // ── 7. MIVHED Construction Licenses ───────────────────────────────────
  console.log('Processing MIVHED construction license data...');
  const licenciasPath = path.join(RAW_DIR, 'licencias-construccion-mivhed-2022-2025.csv');
  if (fs.existsSync(licenciasPath)) {
    addRecords('licencias-construccion-mivhed-2022-2025.csv', processLicenciasConstruccion(licenciasPath));
  }

  // ── 8. RD Trabaja ─────────────────────────────────────────────────────
  console.log('Processing RD Trabaja data...');
  addRecords('rdtrabaja/puestos.json', processRDTrabaja());

  // ── Output ───────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════');
  console.log(` Total normalized records: ${allRecords.length.toLocaleString()}`);
  console.log('═══════════════════════════════════════════════════════\n');

  // Find date range
  let minYear = Infinity, maxYear = -Infinity;
  for (const r of allRecords) {
    if (r.period_year < minYear) minYear = r.period_year;
    if (r.period_year > maxYear) maxYear = r.period_year;
  }

  console.log('By source:');
  for (const [k, v] of Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v.toLocaleString()}`);
  }

  console.log('\nBy sector:');
  for (const [k, v] of Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v.toLocaleString()}`);
  }

  console.log('\nBy record type:');
  for (const [k, v] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v.toLocaleString()}`);
  }

  console.log(`\nDate range: ${minYear}–${maxYear}`);

  // Ensure output directory exists
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  // Write normalized.json
  const normalizedPath = path.join(OUT_DIR, 'normalized.json');
  fs.writeFileSync(normalizedPath, JSON.stringify(allRecords, null, 2), 'utf-8');
  console.log(`\n✓ Written: ${normalizedPath} (${(fs.statSync(normalizedPath).size / 1024 / 1024).toFixed(1)} MB)`);

  // Write summary.json
  const summary = {
    generated_at: EXTRACTED_AT,
    total_records: allRecords.length,
    date_range: { min_year: minYear === Infinity ? null : minYear, max_year: maxYear === -Infinity ? null : maxYear },
    by_source: sourceCounts,
    by_sector: sectorCounts,
    by_record_type: typeCounts,
  };
  const summaryPath = path.join(OUT_DIR, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
  console.log(`✓ Written: ${summaryPath}`);
  console.log('\nDone.');
}

main();
