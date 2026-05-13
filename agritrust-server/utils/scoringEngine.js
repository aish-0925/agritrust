// utils/scoringEngine.js

// ================= MAIN FUNCTION =================

exports.calculate = ({ mlResult, market, cropData, input }) => {
  let score = 0;
  let factors = [];

  // ================= 1. ML CONFIDENCE =================
  if (mlResult.confidence >= 0.9) {
    score += 4;
    factors.push("High ML confidence");
  } else if (mlResult.confidence >= 0.7) {
    score += 3;
    factors.push("Moderate ML confidence");
  } else {
    score += 1;
    factors.push("Low ML confidence");
  }

  // ================= 2. MARKET =================
  if (market.avgPrice > 2000) {
    score += 3;
    factors.push("High market price");
  }

  if (market.demand > 10) {
    score += 2;
    factors.push("High demand");
  }

  if (market.trend === "up") {
    score += 2;
    factors.push("Increasing market trend");
  } else if (market.trend === "down") {
    score -= 2;
    factors.push("Decreasing market trend");
  }

  // ================= 3. SOIL SUITABILITY =================
  if (cropData && input.soil) {
    const isSuitable = cropData.suitableSoils.includes(input.soil.type);

    if (isSuitable) {
      score += 2;
      factors.push("Soil is suitable");
    } else {
      score -= 2;
      factors.push("Soil not ideal");
    }
  }

  // ================= 4. USER INTENT =================
  if (input.userIntent?.profit && market.avgPrice > 2000) {
    score += 2;
    factors.push("Matches profit goal");
  }

  if (input.userIntent?.lowWater && cropData.waterRequirement === "low") {
    score += 2;
    factors.push("Low water requirement");
  }

  if (input.userIntent?.fastGrowth && cropData.durationDays <= 90) {
    score += 2;
    factors.push("Fast growing crop");
  }

  // ================= 5. RISK =================
  if (cropData?.risk?.riskLevel === "high") {
    score -= 3;
    factors.push("High pest/disease risk");
  } else if (cropData?.risk?.riskLevel === "medium") {
    score -= 1;
    factors.push("Moderate risk");
  }

  // ================= NORMALIZE SCORE =================
  if (score < 0) score = 0;
  if (score > 10) score = 10;

  // ================= RECOMMENDATION =================
  let recommendation = "moderate";

  if (score >= 8) recommendation = "highly_recommended";
  else if (score <= 4) recommendation = "avoid";

  // ================= FINAL OUTPUT =================
  return {
    finalScore: score,
    recommendation,
    reasoning: factors.join(", "),
    factors
  };
};