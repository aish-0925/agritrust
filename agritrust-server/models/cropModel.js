const mongoose = require("mongoose");

// ================= SUB-SCHEMAS =================

// Environmental requirements
const conditionSchema = new mongoose.Schema({
  temperature: {
    min: Number,
    max: Number
  },
  rainfall: {
    min: Number,
    max: Number
  },
  humidity: {
    min: Number,
    max: Number
  },
  soil_ph: {   
    min: Number,
    max: Number
  }
}, { _id: false });

// ================= MAIN SCHEMA =================

const cropSchema = new mongoose.Schema({

  crop: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },

  category: {
    type: String,
    enum: ["cereal", "pulse", "vegetable", "fruit", "cash_crop"]
  },

  season: [{
    type: String,
    enum: ["kharif", "rabi", "zaid"]
  }],

  growthDays: Number,

  // Environmental conditions
  conditions: conditionSchema,

  // Water requirement
  waterRequirement: {
    type: String,
    enum: ["low", "medium", "high"]
  },

  //Optional (keep for future scalability)
  irrigationAdvice: String,

  fertilizer: {
    nitrogen: String,
    phosphorus: String,
    potassium: String,
    recommendation: String
  },

  averageYield: Number,

  demandCategory: {
    type: String,
    enum: ["low", "medium", "high"]
  },

  regions: [String],

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

// ================= INDEXES =================

cropSchema.index({ category: 1 });
cropSchema.index({ season: 1 });
cropSchema.index({ regions: 1 });

// ================= METHODS =================

cropSchema.methods.isSuitable = function(input) {

  if (!this.conditions) return false;

  const tempOk =
    input.temperature >= this.conditions.temperature?.min &&
    input.temperature <= this.conditions.temperature?.max;

  const rainOk =
    input.rainfall >= this.conditions.rainfall?.min &&
    input.rainfall <= this.conditions.rainfall?.max;

  const phOk =
    input.soil_ph >= this.conditions.soil_ph?.min &&
    input.soil_ph <= this.conditions.soil_ph?.max;

  return tempOk && rainOk && phOk;
};

// ================= STATIC METHODS =================

cropSchema.statics.getBySeason = function(season) {
  return this.find({ season, isActive: true });
};

cropSchema.statics.getByRegion = function(region) {
  return this.find({ regions: region, isActive: true });
};

cropSchema.methods.getSuitabilityScore = function(input) {
  let score = 0;

  if (!this.conditions) return 0;

  const within = (val, min, max) => val >= min && val <= max;

  if (within(input.temperature, this.conditions.temperature?.min, this.conditions.temperature?.max)) score += 1;
  if (within(input.rainfall, this.conditions.rainfall?.min, this.conditions.rainfall?.max)) score += 1;
  if (within(input.soil_ph, this.conditions.soil_ph?.min, this.conditions.soil_ph?.max)) score += 1;

  return score / 3; // 0 → 1
};

// ================= EXPORT =================

module.exports = mongoose.model("Crop", cropSchema);