(function () {
  "use strict";

  var AIOE_ISCO_MAP = {
    "1": 68, "2": 72, "3": 65, "4": 75, "5": 38, "6": 18, "7": 20, "8": 30, "9": 12,
  };

  var AIOE_OCCUPATION_OVERRIDES = {
    "call center": 82, "centro de llamadas": 82, "telemarketing": 82,
    "data entry": 85, "digitador": 85, "digitacion": 85,
    "contab": 79, "contador": 79, "bookkeep": 79,
    "cajero": 62, "cashier": 62, "caja": 58,
    "recepcion": 72, "reception": 72,
    "secretar": 70, "administrative assistant": 74, "auxiliar admin": 74,
    "analista financ": 85, "financial analyst": 85,
    "software": 88, "programador": 88, "developer": 88, "desarrollador": 88,
    "abogado": 76, "lawyer": 76, "legal": 70,
    "periodista": 67, "journalist": 67, "comunicador": 65,
    "disenador": 64, "designer": 64, "grafico": 64,
    "agente de seguro": 73, "insurance": 73,
    "vendedor": 45, "sales": 42, "dependiente": 42,
    "maestro": 45, "profesor": 45, "teacher": 45, "docente": 45,
    "medico": 62, "doctor": 62, "physician": 62,
    "enfermero": 38, "nurse": 38, "enfermeria": 38,
    "farmaceutico": 66, "pharmacist": 66,
    "ingeniero civil": 55, "arquitecto": 55,
    "chofer": 28, "conductor": 28, "driver": 28, "motorista": 28,
    "constructor": 15, "albanil": 12, "construccion": 15, "obrero": 15,
    "agricola": 16, "agricultor": 16, "agropecuario": 18,
    "seguridad": 28, "vigilante": 25, "guardia": 25,
    "limpieza": 10, "conserje": 10, "cleaning": 10,
    "cociner": 22, "chef": 25, "cook": 22,
    "mesero": 24, "camarero": 24, "waiter": 24,
    "peluquer": 8, "estilista": 8, "barbero": 8,
    "electricista": 19, "plomero": 14, "mecanico": 21,
    "domestic": 10,
    "gerente": 68, "supervisor": 62, "manager": 68, "director": 70,
    "operador zona franca": 45, "ensamblaje": 42, "assembly": 42,
    "funcionario": 65, "servidor publico": 62,
    "colmado": 20, "comerciante informal": 22,
    "tecnico": 55, "tecnico docente": 50, "soporte tecnico": 60,
    "coordinador": 60, "coordinador barrial": 35,
    "auxiliar": 50, "auxiliar administrativo": 65,
    "analista": 70, "encargado": 62, "inspector": 55,
  };

  var SECTOR_MIN_WAGE_PROXY = {
    "administracion_publica_y_defensa": 32000,
    "agricultura_y_agroindustria": 15000,
    "comercio": 22000,
    "construccion": 18000,
    "manufactura_y_zonas_francas": 22000,
    "turismo_y_hosteleria": 20000,
    "tecnologia_y_telecomunicaciones": 45000,
    "salud": 35000,
    "educacion": 28000,
    "servicios_financieros": 55000,
    "transporte_y_logistica": 20000,
    "otros_servicios": 25000,
  };

  var SECTOR_INFORMALITY = {
    "administracion_publica_y_defensa": 0.05,
    "agricultura_y_agroindustria": 0.80,
    "comercio": 0.60,
    "construccion": 0.854,
    "manufactura_y_zonas_francas": 0.35,
    "turismo_y_hosteleria": 0.55,
    "tecnologia_y_telecomunicaciones": 0.15,
    "salud": 0.30,
    "educacion": 0.20,
    "servicios_financieros": 0.10,
    "transporte_y_logistica": 0.70,
    "otros_servicios": 0.54,
  };

  var SECTOR_AIOE_DEFAULTS = {
    "administracion_publica_y_defensa": 58,
    "agricultura_y_agroindustria": 18,
    "comercio": 45,
    "construccion": 20,
    "manufactura_y_zonas_francas": 35,
    "turismo_y_hosteleria": 32,
    "tecnologia_y_telecomunicaciones": 75,
    "salud": 55,
    "educacion": 48,
    "servicios_financieros": 72,
    "transporte_y_logistica": 30,
    "otros_servicios": 42,
  };

  var ZONE_LABELS = {
    red: "Zona Cr\u00edtica",
    orange: "Atenci\u00f3n Urgente",
    yellow: "Monitoreo Estrat\u00e9gico",
    green: "Oportunidad IA",
    amber: "Evaluaci\u00f3n Contextual",
  };

  var ZONE_COLORS = {
    red: "#DC2626",
    orange: "#F97316",
    yellow: "#EAB308",
    green: "#10B981",
    amber: "#6366F1",
  };

  function normalizeText(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // ISCO-08 concordance data (injected by computeAll)
  var concordanceData = null;

  function shouldExclude(title) {
    if (!concordanceData) return false;
    var normalized = normalizeText(title);
    var patterns = concordanceData.excluded_patterns || [];
    for (var i = 0; i < patterns.length; i++) {
      if (normalized.indexOf(patterns[i].pattern) !== -1) return true;
    }
    return false;
  }

  function matchOccupation(title, sectorKey) {
    var normalized = normalizeText(title);

    // 1. Try ISCO-08 concordance table (most specific first)
    if (concordanceData) {
      var occs = concordanceData.occupations || [];
      for (var i = 0; i < occs.length; i++) {
        if (normalized.indexOf(occs[i].pattern) !== -1) {
          return { score: occs[i].aioe, source: "concordance", isco4: occs[i].isco4, isco2: occs[i].isco2, iscoLabel: occs[i].label_es };
        }
      }

      // 2. Sector-contextual "técnico" fallback
      if (normalized.indexOf("tecnico") !== -1 || normalized.indexOf("tecnica") !== -1) {
        var ctx = concordanceData.sector_context_tecnico || {};
        var match = ctx[sectorKey] || ctx._default;
        if (match) {
          return { score: match.aioe, source: "concordance_sector", isco4: match.isco4, isco2: match.isco2, iscoLabel: match.label_es };
        }
      }
    }

    // 3. Legacy keyword matching (fallback)
    var keys = Object.keys(AIOE_OCCUPATION_OVERRIDES);
    for (var k = 0; k < keys.length; k++) {
      if (normalized.indexOf(keys[k]) !== -1) {
        return { score: AIOE_OCCUPATION_OVERRIDES[keys[k]], source: "keyword", isco4: null, isco2: null, iscoLabel: null };
      }
    }

    // 4. Sector default
    var fallback = SECTOR_AIOE_DEFAULTS[sectorKey];
    return { score: fallback != null ? fallback : 42, source: "sector_default", isco4: null, isco2: null, iscoLabel: null };
  }

  function computeVScore(salary, sectorKey, aioe) {
    var minWage = SECTOR_MIN_WAGE_PROXY[sectorKey] || 25000;
    var incomeVuln;
    if (salary != null && salary > 0) {
      incomeVuln = Math.max(0, 100 * (1 - salary / (1.5 * minWage)));
    } else {
      incomeVuln = 50;
    }

    var informalityScore = (SECTOR_INFORMALITY[sectorKey] || 0.54) * 100;

    var educationVuln;
    if (aioe < 30) {
      educationVuln = 75;
    } else if (aioe <= 60) {
      educationVuln = 50;
    } else {
      educationVuln = 25;
    }

    var savingsVuln;
    if (salary != null && salary > 0) {
      var surplus = Math.max(0, salary - 45000);
      savingsVuln = Math.max(0, 100 * (1 - surplus / salary));
    } else {
      savingsVuln = 70;
    }

    return Math.round(
      0.35 * incomeVuln +
      0.30 * informalityScore +
      0.20 * educationVuln +
      0.15 * savingsVuln
    );
  }

  function computeSScore(aioe) {
    return {
      raw: aioe,
      short: Math.round(aioe * 0.3),
      medium: Math.round(aioe * 0.6),
      long: Math.round(aioe * 0.9),
    };
  }

  function computeAScore(aioe) {
    var adaptSkills;
    if (aioe < 30) {
      adaptSkills = 20;
    } else if (aioe < 50) {
      adaptSkills = 40;
    } else if (aioe < 70) {
      adaptSkills = 60;
    } else if (aioe < 85) {
      adaptSkills = 70;
    } else {
      adaptSkills = 55;
    }

    var educationVuln;
    if (aioe < 30) {
      educationVuln = 75;
    } else if (aioe <= 60) {
      educationVuln = 50;
    } else {
      educationVuln = 25;
    }
    var adaptEducation = 100 - educationVuln;

    return Math.round(0.5 * adaptSkills + 0.5 * adaptEducation);
  }

  function classifyZone(v, s, a) {
    if (v > 60 && s > 55 && a < 45) return "red";
    if (v > 35 && s > 55 && a < 60) return "orange";
    if (v <= 35 && s > 55 && a >= 55) return "yellow";
    if (s <= 40) return "green";
    return "amber";
  }

  function buildSectorLookup(sectorColorsData) {
    var lookup = {};
    if (!sectorColorsData || !Array.isArray(sectorColorsData)) return lookup;
    for (var i = 0; i < sectorColorsData.length; i++) {
      var entry = sectorColorsData[i];
      lookup[entry.id] = {
        name: entry.name,
        shortName: entry.shortName,
        color: entry.color,
        icon: entry.icon,
      };
    }
    return lookup;
  }

  /**
   * Main API: compute AI impact scores for all occupations and sectors.
   *
   * @param {Object} metricsData - Data from data/processed/metrics.json
   * @param {Array}  sectorColorsData - Data from src/sector-colors.json
   * @param {Object} [iscoData] - Optional ISCO-08 concordance from src/isco-08-concordance.json
   * @returns {Object} { occupations, sectors, global }
   */
  function computeAll(metricsData, sectorColorsData, iscoData) {
    concordanceData = iscoData || null;
    var sectorLookup = buildSectorLookup(sectorColorsData);
    var globalMetrics = metricsData.global || {};
    var sectorsData = metricsData.sectors || {};

    var allOccupations = [];
    var sectorResults = [];
    var totalWorkers = 0;
    var zoneWorkerCounts = { red: 0, orange: 0, yellow: 0, green: 0, amber: 0 };

    var sectorKeys = Object.keys(sectorsData);
    for (var si = 0; si < sectorKeys.length; si++) {
      var sectorKey = sectorKeys[si];
      var sectorData = sectorsData[sectorKey];
      var meta = sectorLookup[sectorKey] || {};
      var sectorName = meta.name || sectorKey;
      var sectorShortName = meta.shortName || sectorName;
      var sectorColor = meta.color || "#6B7280";
      var sectorIcon = meta.icon || "circle";
      var estimated = (sectorData.total_records || 0) < 50;
      var sectorSalary = (sectorData.total_records || 0) >= 500 ? (sectorData.salary_avg || null) : null;
      if (sectorSalary == null) {
        sectorSalary = SECTOR_MIN_WAGE_PROXY[sectorKey] || 25000;
      }

      var topTitles = sectorData.top_titles || [];
      var sectorOccupations = [];
      var weightedV = 0, weightedS = 0, weightedA = 0, totalCount = 0;

      for (var ti = 0; ti < topTitles.length; ti++) {
        var entry = topTitles[ti];
        var title = entry.title || "";
        var count = entry.count || 0;
        var salary = sectorSalary;

        // Skip non-occupation entries
        if (shouldExclude(title)) continue;

        var occResult = matchOccupation(title, sectorKey);
        var aioe = occResult.score;
        var aioeSource = occResult.source;

        var vScore = computeVScore(salary, sectorKey, aioe);
        var sResult = computeSScore(aioe);
        var aScore = computeAScore(aioe);
        var zone = classifyZone(vScore, sResult.raw, aScore);

        var occ = {
          title: title,
          sector: sectorKey,
          sectorName: sectorName,
          sectorShortName: sectorShortName,
          sectorColor: sectorColor,
          count: count,
          salary: salary,
          vScore: vScore,
          sScore: sResult.raw,
          aScore: aScore,
          sScoreShort: sResult.short,
          sScoreMedium: sResult.medium,
          sScoreLong: sResult.long,
          zone: zone,
          zoneName: ZONE_LABELS[zone],
          zoneColor: ZONE_COLORS[zone],
          aioeSource: aioeSource,
          isco4: occResult.isco4,
          isco2: occResult.isco2,
          iscoLabel: occResult.iscoLabel,
          estimated: estimated,
        };

        sectorOccupations.push(occ);
        allOccupations.push(occ);

        weightedV += vScore * count;
        weightedS += sResult.raw * count;
        weightedA += aScore * count;
        totalCount += count;

        zoneWorkerCounts[zone] += count;
        totalWorkers += count;
      }

      var avgV = totalCount > 0 ? Math.round(weightedV / totalCount) : 0;
      var avgS = totalCount > 0 ? Math.round(weightedS / totalCount) : 0;
      var avgA = totalCount > 0 ? Math.round(weightedA / totalCount) : 0;
      var sectorZone = classifyZone(avgV, avgS, avgA);

      sectorResults.push({
        key: sectorKey,
        name: sectorName,
        shortName: sectorShortName,
        color: sectorColor,
        icon: sectorIcon,
        totalRecords: sectorData.total_records || 0,
        totalEmpleos: sectorData.total_empleos || 0,
        salaryAvg: sectorSalary,
        vScore: avgV,
        sScore: avgS,
        aScore: avgA,
        zone: sectorZone,
        zoneName: ZONE_LABELS[sectorZone],
        zoneColor: ZONE_COLORS[sectorZone],
        estimated: estimated,
      });
    }

    var globalV = 0, globalS = 0, globalA = 0, globalCount = 0;
    for (var oi = 0; oi < allOccupations.length; oi++) {
      var o = allOccupations[oi];
      globalV += o.vScore * o.count;
      globalS += o.sScore * o.count;
      globalA += o.aScore * o.count;
      globalCount += o.count;
    }

    var zoneDist = {};
    var zoneKeys = Object.keys(zoneWorkerCounts);
    for (var zi = 0; zi < zoneKeys.length; zi++) {
      var zk = zoneKeys[zi];
      zoneDist[zk] = totalWorkers > 0
        ? Math.round((zoneWorkerCounts[zk] / totalWorkers) * 100)
        : 0;
    }

    return {
      occupations: allOccupations,
      sectors: sectorResults,
      global: {
        totalRecords: globalMetrics.total_records || 0,
        totalEmpleos: globalMetrics.total_empleos || 0,
        avgV: globalCount > 0 ? Math.round(globalV / globalCount) : 0,
        avgS: globalCount > 0 ? Math.round(globalS / globalCount) : 0,
        avgA: globalCount > 0 ? Math.round(globalA / globalCount) : 0,
        zoneDistribution: zoneDist,
      },
    };
  }

  window.AIImpactScores = {
    computeAll: computeAll,
  };
})();
