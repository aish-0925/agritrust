const axios = require("axios");

const ML_API_URL =
  process.env.ML_API_URL || "http://127.0.0.1:8000";

// ================= HELPERS =================

// Clamp confidence between 0 and 1
const clamp = (val, min = 0, max = 1) =>
  Math.max(min, Math.min(val, max));

// Normalize crop name (important for DB match)
const normalizeCrop = (name) =>
  name?.toLowerCase().trim();

// ================= FALLBACK =================

const fallbackPredictions = (input) => {
  const { rainfall, temperature, soil_ph } = input;

  // 🌧 High rainfall
  if (rainfall > 200) {
    return [
      { crop: "rice", confidence: 0.6 },
      { crop: "banana", confidence: 0.5 },
      { crop: "sugarcane", confidence: 0.4 }
    ];
  }

  // Dry + hot
  if (rainfall < 100 && temperature > 30) {
    return [
      { crop: "jowar", confidence: 0.6 },
      { crop: "bajra", confidence: 0.5 },
      { crop: "groundnut", confidence: 0.4 }
    ];
  }

  // Neutral
  if (soil_ph >= 6 && soil_ph <= 7.5) {
    return [
      { crop: "maize", confidence: 0.6 },
      { crop: "cotton", confidence: 0.5 },
      { crop: "sunflower", confidence: 0.4 }
    ];
  }

  // Default fallback
  return [
    { crop: "maize", confidence: 0.5 },
    { crop: "groundnut", confidence: 0.4 }
  ];
};

// ================= NORMALIZE ML RESPONSE =================

const normalizeResponse = (data) => {

  // Flask format: { success: true, predictions: [...] }
  if (data?.success && Array.isArray(data.predictions)) {
    return data.predictions.map((p) => ({
      crop: normalizeCrop(p.crop),
      confidence: clamp(p.confidence || 0.5)
    }));
  }

  // Alternative format
  if (data?.crop || data?.recommendedCrop) {
    const mainCrop = data.recommendedCrop || data.crop;

    const predictions = [
      {
        crop: normalizeCrop(mainCrop),
        confidence: clamp(data.confidence || 0.8)
      }
    ];

    if (Array.isArray(data.alternatives)) {
      data.alternatives.forEach((alt, i) => {
        predictions.push({
          crop: normalizeCrop(alt),
          confidence: clamp(0.7 - i * 0.1, 0.3, 1)
        });
      });
    }

    return predictions;
  }

  throw new Error("Invalid ML response format");
};

// ================= ML CALL =================

const callML = async (mlInput) => {
  const res = await axios.post(
    `${ML_API_URL}/predict`,
    mlInput,
    { timeout: 3000 }
  );

  console.log("ML RAW RESPONSE:", res.data);

  return normalizeResponse(res.data);
};

// ================= MAIN FUNCTION =================

exports.getCrop = async (mlInput) => {
  try {
    //Try ML call
    const predictions = await callML(mlInput);

    if (!predictions || !predictions.length) {
      throw new Error("Empty ML response");
    }

    return { predictions };

  } catch (err) {
    console.error("ML Service Error:", err.message);

    // Retry once
    try {
      const predictions = await callML(mlInput);
      return { predictions };
    } catch (retryErr) {
      console.error("ML Retry Failed → Using fallback");

      return {
        predictions: fallbackPredictions(mlInput)
      };
    }
  }
};