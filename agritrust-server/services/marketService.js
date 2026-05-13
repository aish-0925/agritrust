const Product = require("../models/Product");

// ================= GET MARKET DATA =================

exports.getMarketData = async (crop, location = {}) => {
  try {
    const query = {
      crop: crop.toLowerCase()
    };

    // 🌍 Optional location filtering
    if (location?.district) {
      query["location.district"] = location.district;
    }

    const products = await Product.find(query);

    if (!products.length) {
      return {
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        demand: 0,
        trend: "stable"
      };
    }

    // ================= PRICE CALCULATIONS =================

    const prices = products.map(p => p.price || 0);

    const totalPrice = prices.reduce((sum, p) => sum + p, 0);
    const avgPrice = totalPrice / prices.length;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // ================= DEMAND (IMPROVED) =================

    const demandScore = Math.min(products.length / 10, 10); // normalized

    let demandLevel = "low";
    if (demandScore > 7) demandLevel = "high";
    else if (demandScore > 3) demandLevel = "medium";

    // ================= TREND (IMPROVED) =================

    const now = new Date();
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const prevWeek = new Date(now);
    prevWeek.setDate(now.getDate() - 14);

    const recent = products.filter(
      p => new Date(p.createdAt) >= lastWeek
    );

    const previous = products.filter(
      p =>
        new Date(p.createdAt) >= prevWeek &&
        new Date(p.createdAt) < lastWeek
    );

    const recentAvg =
      recent.reduce((sum, p) => sum + (p.price || 0), 0) /
      (recent.length || 1);

    const prevAvg =
      previous.reduce((sum, p) => sum + (p.price || 0), 0) /
      (previous.length || 1);

    let trend = "stable";

    if (recentAvg > prevAvg * 1.05) {
      trend = "up";
    } else if (recentAvg < prevAvg * 0.95) {
      trend = "down";
    }

    // ================= RETURN =================

    return {
      avgPrice: Math.round(avgPrice),
      minPrice,
      maxPrice,

      // demand: demandLevel,
      // demandScore: Math.round(demandScore),

      trend,

      recordedAt: new Date()
    };

  } catch (err) {
    console.error("Market Service Error:", err.message);
    throw new Error("Failed to fetch market data");
  }
};