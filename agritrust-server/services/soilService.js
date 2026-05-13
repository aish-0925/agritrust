const Soil = require("../models/soilModel");

// ================= CONFIG =================
const THRESHOLDS = {
  nitrogen: { low: 40, high: 80 },
  phosphorus: { low: 30, high: 60 },
  potassium: { low: 30, high: 60 }
};

// ================= HELPERS =================

// Safe value handler
const safe = (v, def = 50) => (v !== undefined && v !== null ? v : def);

const classify = (value, low, high) => {
  if (value < low) return "low";
  if (value > high) return "high";
  return "medium";
};

const getPhStatus = (ph) => {
  if (ph == null || ph < 3 || ph > 10) return "unknown";
  if (ph < 6.5) return "acidic";
  if (ph > 7.5) return "alkaline";
  return "neutral";
};

// ================= SCORING =================

const calculateSoilScore = (soil) => {
  const scoreMap = {
    low: 0,
    medium: 2,
    high: 1
  };

  let score = 0;

  score += scoreMap[soil.nitrogenStatus] || 0;
  score += scoreMap[soil.phosphorusStatus] || 0;
  score += scoreMap[soil.potassiumStatus] || 0;

  if (soil.phStatus === "neutral") score += 2;

  return score; // out of 8
};

// ================= RECOMMENDATIONS =================

const generateSoilAdvice = (soil) => {
  const advice = [];

  if (soil.nitrogenStatus === "low") {
    advice.push("Nitrogen is low → apply urea or compost");
  }

  if (soil.phosphorusStatus === "low") {
    advice.push("Phosphorus deficiency → apply DAP or bone meal");
  }

  if (soil.potassiumStatus === "low") {
    advice.push("Potassium is low → use potash fertilizers");
  }

  if (soil.phStatus === "acidic") {
    advice.push("Soil is acidic → apply lime before sowing");
  }

  if (soil.phStatus === "alkaline") {
    advice.push("Soil is alkaline → add organic matter or gypsum");
  }

  // Soil type based insight
  if (soil.type === "clay") {
    advice.push("Clay soil retains water → avoid over-irrigation");
  }

  return advice;
};

// ================= NORMALIZE =================

const normalizeSoil = (soil) => {
  const nitrogen = safe(soil.nitrogen);
  const phosphorus = safe(soil.phosphorus);
  const potassium = safe(soil.potassium);
  const ph = safe(soil.ph, 6.5);

  const nitrogenStatus = classify(
    nitrogen,
    THRESHOLDS.nitrogen.low,
    THRESHOLDS.nitrogen.high
  );

  const phosphorusStatus = classify(
    phosphorus,
    THRESHOLDS.phosphorus.low,
    THRESHOLDS.phosphorus.high
  );

  const potassiumStatus = classify(
    potassium,
    THRESHOLDS.potassium.low,
    THRESHOLDS.potassium.high
  );

  const phStatus = getPhStatus(ph);

  const enriched = {
    ...soil,
    nitrogen,
    phosphorus,
    potassium,
    ph,
    nitrogenStatus,
    phosphorusStatus,
    potassiumStatus,
    phStatus
  };

  return {
    ...enriched,
    soilScore: calculateSoilScore(enriched),
    recommendations: generateSoilAdvice(enriched)
  };
};

// ================= MAIN =================

exports.getSoilData = async (input) => {
  try {
    let soil = null;

    // ================= 1. USER INPUT =================
    if (input.soil?.ph !== undefined) {
      soil = {
        type: input.soil.type || "custom",
        ph: input.soil.ph,
        nitrogen: input.soil.nitrogen,
        phosphorus: input.soil.phosphorus,
        potassium: input.soil.potassium
      };
    }

    // ================= 2. DATABASE =================
    else if (input.location?.district) {
      const district = input.location.district.trim().toLowerCase();
      const taluk = input.location.taluk?.trim().toLowerCase();

      let record = null;

      if (taluk) {
        record = await Soil.findOne({
          district,
          taluk
        });
      }

      if (!record) {
        record = await Soil.findOne({ district });
      }

      if (record) {
        soil = {
          type: record.soilType,
          ph: record.ph,
          nitrogen: record.nitrogen,
          phosphorus: record.phosphorus,
          potassium: record.potassium
        };
      }
    }

    // ================= 3. FALLBACK =================
    if (!soil) {
      soil = {
        type: "default",
        ph: 6.5,
        nitrogen: 50,
        phosphorus: 50,
        potassium: 50
      };
    }

    return normalizeSoil(soil);

  } catch (err) {
    console.error("Soil Service Error:", err.message);
    throw err;
  }
};