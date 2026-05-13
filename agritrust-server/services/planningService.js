const CropGrowth = require("../models/CropGrowth");

/**
 * Get dynamic crop plan based on:
 * - cropId
 * - sowing date
 * - weather conditions
 */
const getCropPlan = async (cropId, sowingDate, weather = {}) => {
  try {
    // ================= FETCH DATA =================
    const data = await CropGrowth.findOne({ cropId });

    if (!data) {
      console.warn("No CropGrowth data found for:", cropId);

      return {
        totalDays: 0,
        daysPassed: 0,
        currentStage: "Unknown",
        stageDetails: null,
        nextStage: null
      };
    }

    // ================= DATE HANDLING (FIXED) =================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sowDate = new Date(sowingDate);
    sowDate.setHours(0, 0, 0, 0);

    const daysPassed = Math.max(
      0,
      Math.floor((today - sowDate) / (1000 * 60 * 60 * 24))
    );

    // ================= STAGE DETECTION (SAFE) =================
    let stage = data.stages.find(
      (s) => daysPassed >= s.startDay && daysPassed <= s.endDay
    );

    // fallback to last stage
    if (!stage) {
      stage = data.stages[data.stages.length - 1];
    }

    // ================= NEXT STAGE =================
    const nextStage = data.stages.find(
      (s) => s.startDay > daysPassed
    );

    // ================= BASE VALUES =================
    let irrigation = stage.irrigation || "Moderate irrigation";
    let fertilizer = stage.fertilizer || "Standard fertilizer application";

    // ================= WEATHER ADJUSTMENTS =================

    const rainfall = weather.rainfall || 0;
    const temperature = weather.temperature || 0;
    const humidity = weather.humidity || 0;

    //Priority-based irrigation logic
    if (rainfall > 100) {
      irrigation = "Skip irrigation due to heavy rainfall";
    } else if (rainfall < 40) {
      irrigation = "Increase irrigation due to low rainfall";
    } else if (temperature > 35) {
      irrigation = "Increase irrigation due to high temperature";
    }

    //Fertilizer adjustment
    if (rainfall > 120) {
      fertilizer = "Delay fertilizer application due to heavy rain";
    }

    //Pest / disease detection
    let pestAlert = null;

    if (humidity > 80 && temperature > 25) {
      pestAlert = "High risk of pests and fungal diseases";
    }

    // ================= RETURN =================
    return {
      totalDays: data.totalDays,
      daysPassed,

      currentStage: stage.name,

      stageDetails: {
        name: stage.name,
        startDay: stage.startDay,
        endDay: stage.endDay,

        activities: stage.activities || [],

        irrigation,
        fertilizer,

        pests: stage.pests || [],
        pestAlert
      },

      nextStage: nextStage
        ? {
            name: nextStage.name,
            startsInDays: nextStage.startDay - daysPassed
          }
        : null
    };

  } catch (err) {
    console.error("Error in getCropPlan:", err.message);

    return {
      totalDays: 0,
      daysPassed: 0,
      currentStage: "Error",
      stageDetails: null,
      nextStage: null
    };
  }
};

module.exports = { getCropPlan };