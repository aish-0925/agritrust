const Advisory = require("../models/Advisory");
const Crop = require("../models/cropModel");

const weatherService = require("../services/weatherService");
const marketService = require("../services/marketService");
const mlService = require("../services/mlService");
const { getCropPlan } = require("../services/planningService");
const soilService = require("../services/soilService");
const { calculateFinalScores } = require("../services/scoringService");

// ================= UTIL =================

const validateInput = (input) => {
  if (!input?.location?.district) return "District is required";
  if (!input?.location?.taluk) return "Taluk is required";
  return null;
};

const getFallbackML = () => ({
  predictions: [
    { crop: "rice", confidence: 0.5 },
    { crop: "maize", confidence: 0.4 }
  ]
});

const getDefaultMarket = () => ({
  avgPrice: 1500,
  demand: "medium",
  trend: "stable"
});



const calculateScore = (confidence, market) => {
  let score = 0;

  // ML confidence (primary)
  score += confidence * 10;

  // Price factor
  score += Math.min((market?.avgPrice || 0) / 1000, 3);

  // Trend factor
  if (market?.trend === "up") score += 2;
  else if (market?.trend === "down") score -= 1;

  return score;
};
const getRecommendationLevel = (score) => {
  if (score >= 10) return "highly_recommended";
  if (score <= 5) return "avoid";
  return "moderate";
};

// ================= CORE =================

const getAdvisoryLogic = async (input, userId = null) => {
  const error = validateInput(input);
  if (error) throw new Error(error);

  // ================= WEATHER =================
  const weather = await weatherService.getFullWeather(input.location);

  // ================= SOIL =================
  const soilData = await soilService.getSoilData(input);

  // ================= ML INPUT =================
  const mlInput = {
    district: input.location.district,
    taluk: input.location.taluk,
    soil_ph: input.soil?.ph || 6.5,
    nitrogen: input.soil?.nitrogen || 50,
    phosphorus: input.soil?.phosphorus || 50,
    potassium: input.soil?.potassium || 50,
    temperature: weather.temperature,
    humidity: weather.humidity,
    rainfall: weather.rainfall || 100,
    season: input.season || "kharif"
  };

  // ================= ML =================
  let mlResult;
  try {
    mlResult = await mlService.getCrop(mlInput);
  } catch {
    mlResult = getFallbackML();
  }

  const predictions = mlResult.predictions;

  if (!predictions || !predictions.length) {
    throw new Error("No ML predictions");
  }

  // ================= EVALUATION =================
  const scored = await calculateFinalScores({
    predictions,
    soil: soilData,
    weather,
    input: mlInput
  });

  if (!scored.length) {
    throw new Error("No valid crops after scoring");
  }

  // ================= ENRICH (FIXED CORE) =================
  const enriched = await Promise.all(
    scored.map(async (item) => {
      const cropData = await Crop.findOne({ crop: item.crop });

      if (!cropData) return null;

      const [plan, market] = await Promise.all([
        getCropPlan(
          cropData._id,
          input.sowingDate || new Date(),
          weather
        ),
        marketService.getMarketData(item.crop, input.location)
      ]);

      return {
        ...item,
        cropData,
        plan,
        market
      };
    })
  );

  const valid = enriched.filter(Boolean);

  if (!valid.length) {
    throw new Error("No enriched crop data");
  }

  const best = valid[0];


  // ================= ADVISORY =================
  const stageDetails = best?.plan?.stageDetails || {};

  let irrigation = stageDetails.irrigation || "Moderate";

  if (weather.rainExpected) irrigation = "Skip irrigation due to expected rain";
  else if (weather.temperature > 36) irrigation = "Increase irrigation due to heat";
  else if (weather.rainfall < 40) irrigation = "Increase irrigation due to low rainfall";

  const alerts = [];

  if (weather.rainfall > 150)
    alerts.push("Heavy rain expected – avoid fertilizer application");

  if (weather.humidity > 80)
    alerts.push("High pest/disease risk");

  if (stageDetails?.pestAlert)
    alerts.push(stageDetails.pestAlert);

  // ================= RISK =================
  const risk = {
    droughtRisk: weather.rainfall < 50 ? "high" : "low",
    floodRisk: weather.rainfall > 200 ? "high" : "low",
    pestLevel: weather.humidity > 80 ? "high" : "low",
    diseaseRisk: weather.humidity > 80 ? "high" : "medium"
  };

  // ================= PROFIT =================
  const expectedYield = best.cropData.averageYield || 0;
  const price = best.market.avgPrice || 0;

  // ================= RESPONSE =================
  const response = {
  recommendation: {
    crop: best.crop || best.cropData?.crop,
    confidence: best.scores.ml,
    level: getRecommendationLevel(best.finalScore)
  },

  scores: {
    ml: best.scores.ml,
    soil: best.scores.soil,
    cropSuitability: best.scores.crop,
    weather: best.scores.weather,
    finalScore: best.finalScore
  },

  advisory: {
    irrigation,
    fertilizer: stageDetails?.fertilizer
  },

  soil: soilData,

  weather: {
    temperature: weather.temperature,
    rainfall: weather.rainfall
  },

  alternatives: valid.slice(1, 3).map((c) => ({
    crop: c.crop,
    score: c.finalScore
  }))
};

  // ================= SAVE =================
  if (userId) {
    const advisoryDoc = new Advisory({
      userId,

      status: "completed",

      input,
      weather,

      mlInput,

      mlResult: {
        recommendedCrop: best.cropData.crop,
        confidence: best.confidence,
        topAlternatives: scored.slice(1, 3).map(r => ({
          crop: r.cropData.crop,
          confidence: r.confidence
        })),
        modelVersion: "v1"
      },

      decision: {
        finalScore: best.score,
        confidence: best.confidence,
        recommendation: getRecommendationLevel(best.score),
        reasoning: "ML + market + weather combined scoring"
      },

      finalCrop: best.cropData.crop,

      advisory: {
        irrigation,
        fertilizer: stageDetails?.fertilizer,
        expectedYield
      },

      risk,

      explanation: {
        factors: ["ML confidence", "market demand", "weather conditions"],
        summary: `Selected ${best.cropData.crop} based on highest combined score`
      },

      systemVersion: {
        mlModel: "v1",
        scoringEngine: "v1"
      }
    });

    await advisoryDoc.save();
  }

  return response;
};

// ================= CONTROLLERS =================

exports.getAdvisory = async (req, res) => {
  try {
    const result = await getAdvisoryLogic(req.body, req.user.id);
    res.json({ success: true, data: result });
  } catch (err) {
  console.error("ADVISORY ERROR:", err); // ✅ ADD THIS
  res.status(500).json({ error: err.message });
}
};

exports.getQuickAdvisory = async (req, res) => {
  try {
    const result = await getAdvisoryLogic(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyAdvisories = async (req, res) => {
  try {
    const data = await Advisory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAdvisoryById = async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);

    if (!advisory) return res.status(404).json({ message: "Not found" });

    if (advisory.userId.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    res.json({ success: true, data: advisory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshAdvisory = async (req, res) => {
  try {
    const advisory = await Advisory.findById(req.params.id);

    if (!advisory) return res.status(404).json({ message: "Not found" });

    const updated = await getAdvisoryLogic(advisory.input);

    advisory.advisory = updated.advisory;
    advisory.finalCrop = updated.recommendation.crop;

    await advisory.save();

    res.json({ success: true, data: advisory });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const { advisoryId, feedback } = req.body;

    const advisory = await Advisory.findById(advisoryId);
    if (!advisory) return res.status(404).json({ message: "Not found" });

    advisory.feedback.push(feedback); // ✅ FIXED
    await advisory.save();

    res.json({ success: true, message: "Feedback added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

