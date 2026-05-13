const Crop = require("../models/cropModel");

// ================= WEIGHTS =================
const WEIGHTS = {
  ml: 0.4,
  soil: 0.2,
  crop: 0.25,
  weather: 0.15
};

// ================= HELPERS =================

const clamp = (val, min = 0, max = 1) =>
  Math.max(min, Math.min(val, max));

// ================= CROP SUITABILITY =================

const getCropScore = (crop, input) => {
  if (!crop.conditions) return 0.5;

  let score = 0;
  let total = 0;

  const check = (val, min, max) => {
    if (val >= min && val <= max) return 1;
    if (val >= min - 5 && val <= max + 5) return 0.5;
    return 0;
  };

  if (crop.conditions.temperature) {
    score += check(
      input.temperature,
      crop.conditions.temperature.min,
      crop.conditions.temperature.max
    );
    total++;
  }

  if (crop.conditions.rainfall) {
    score += check(
      input.rainfall,
      crop.conditions.rainfall.min,
      crop.conditions.rainfall.max
    );
    total++;
  }

  if (crop.conditions.soil_ph) {
    score += check(
      input.soil_ph,
      crop.conditions.soil_ph.min,
      crop.conditions.soil_ph.max
    );
    total++;
  }

  return total ? score / total : 0.5;
};

// ================= WEATHER SCORE =================

const getWeatherScore = (weather) => {
  let score = 1;

  if (weather.heatWave) score -= 0.3;
  if (weather.heavyRain) score -= 0.3;
  if (weather.rainfall < 40) score -= 0.2;

  return clamp(score);
};

// ================= MAIN =================

exports.calculateFinalScores = async ({
  predictions,
  soil,
  weather,
  input
}) => {
  const results = [];

  for (const pred of predictions) {
    const cropName = pred.crop.toLowerCase();

    const crop = await Crop.findOne({ crop: cropName });

    if (!crop) continue;

    // ================= INDIVIDUAL SCORES =================
    const mlScore = clamp(pred.confidence);

    const soilScore = (soil.soilScore || 4) / 8; // normalize to 0–1

    const cropScore = getCropScore(crop, input);

    const weatherScore = getWeatherScore(weather);

    // ================= FINAL SCORE =================
    const finalScore =
      mlScore * WEIGHTS.ml +
      soilScore * WEIGHTS.soil +
      cropScore * WEIGHTS.crop +
      weatherScore * WEIGHTS.weather;

    results.push({
      crop: crop.crop,
      scores: {
        ml: mlScore,
        soil: soilScore,
        crop: cropScore,
        weather: weatherScore
      },
      finalScore: Number(finalScore.toFixed(3))
    });
  }

  // ================= SORT =================
  results.sort((a, b) => b.finalScore - a.finalScore);

  return results;
};