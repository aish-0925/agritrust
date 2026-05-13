// models/advisoryModel.js

const mongoose = require("mongoose");

// ================= SUB-SCHEMAS =================

const locationSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  district: String,
  state: String,
  zone: String,
}, { _id: false });

const soilSchema = new mongoose.Schema({
  type: String,
  ph: Number,
  moisture: Number,
  nitrogen: Number,
  phosphorus: Number,
  potassium: Number,
}, { _id: false });

const weatherSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  rainfall: Number,
  forecastRainfall: Number,
  source: String,
  recordedAt: { type: Date, default: Date.now },
}, { _id: false });


const alternativeSchema = new mongoose.Schema({
  crop: String,
  confidence: Number,
}, { _id: false });


const mlResultSchema = new mongoose.Schema({
  recommendedCrop: String,
  confidence: Number,
  topAlternatives: [alternativeSchema], // ← ONLY STRUCTURE
  modelVersion: String,
}, { _id: false });

// ================= MARKET =================

const marketSnapshotSchema = new mongoose.Schema({
  avgPrice: Number,
  demand: Number,
  trend: { type: String, enum: ["up", "down", "stable"] },
  recordedAt: { type: Date, default: Date.now },
}, { _id: false });

// ================= ADVISORY =================

const advisoryContentSchema = new mongoose.Schema({
  irrigation: String,
  fertilizer: String,
  expectedYield: Number,
  yieldUnit: { type: String, default: "tonnes/hectare" },
}, { _id: false });

const schemeSchema = new mongoose.Schema({
  name: String,
  benefit: String,
  eligibility: String,
}, { _id: false });

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  success: Boolean,
  comment: String,
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

// ================= MAIN SCHEMA =================

const advisorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    input: {
      location: { type: locationSchema, required: true }, 
      soil: soilSchema,
      season: {
        type: String,
        enum: ["kharif", "rabi", "zaid"],
      },
      userIntent: {
        profit: Boolean,
        lowWater: Boolean,
        fastGrowth: Boolean,
      },
    },

    weather: weatherSchema,

    mlResult: mlResultSchema,

    
    mlInput: {
      district: String,
      taluk: String,
      soil_ph: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      temperature: Number,
      humidity: Number,
      rainfall: Number,
      season: String
    },

    explanation: {
      factors: [String],
      summary: String
    },

    systemVersion: {
      mlModel: String,
      scoringEngine: String
    },

    requestMeta: {
      source: { type: String, enum: ["web", "mobile", "api"], default: "web" },
      ip: String,
      userAgent: String
    },

    isActive: {
      type: Boolean,
      default: true
    },

    marketHistory: [marketSnapshotSchema],

    decision: {
      finalScore: Number,
      confidence: Number, 
      recommendation: {
        type: String,
        enum: ["highly_recommended", "moderate", "avoid"],
      },
      reasoning: String,
    },

    finalCrop: {
      type: String,
      required: true,
      lowercase: true, 
      trim: true
    },

    advisory: advisoryContentSchema,

    rotation: {
      nextCrop: String,
      reason: String,
    },

    schemes: [schemeSchema],

    risk: {
      droughtRisk: { type: String, enum: ["low", "medium", "high"] },
      floodRisk:   { type: String, enum: ["low", "medium", "high"] },
      pestLevel:   { type: String, enum: ["low", "medium", "high"] },
      diseaseRisk: { type: String, enum: ["low", "medium", "high"] },
    },

    feedback: [feedbackSchema],

  },
  {
    timestamps: true,
  }
);

// ================= INDEXES =================

advisorySchema.index({ userId: 1, createdAt: -1 });
advisorySchema.index({ "input.location.district": 1 });
advisorySchema.index({ finalCrop: 1 });
advisorySchema.index({ status: 1 });

// ================= VIRTUAL =================

advisorySchema.virtual("latestMarket").get(function () {
  if (!this.marketHistory?.length) return null;
  return this.marketHistory[this.marketHistory.length - 1];
});

// ================= METHODS =================

advisorySchema.methods.addFeedback = function (feedbackData) {
  this.feedback.push(feedbackData); 
  return this.save();
};

advisorySchema.methods.getSummary = function () {
  return {
    crop: this.finalCrop,
    score: this.decision?.finalScore,
    recommendation: this.decision?.recommendation,
    price: this.latestMarket?.avgPrice,
    status: this.status,
  };
};

advisorySchema.methods.pushMarketSnapshot = function (snapshotData) {
  this.marketHistory.push(snapshotData);
  return this.save();
};

// ================= EXPORT =================

module.exports = mongoose.model("Advisory", advisorySchema);