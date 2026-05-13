// models/soilModel.js

const mongoose = require("mongoose");

const soilSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
      index: true
    },

    taluk: {
      type: String,
      index: true
    },

    state: {
      type: String,
      default: "Karnataka"
    },

    soilType: {
      type: String,
      enum: ["red", "black", "alluvial", "laterite", "sandy", "clay"],
      default: "red"
    },

    soil_ph: {
      type: Number,
      min: 3,
      max: 10
    },

    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,

    // ✅ Derived insights (very useful)
    fertilityLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    }
  },
  { timestamps: true }
);

// ================= INDEXES =================

// Fast lookup for advisory
soilSchema.index({ district: 1, taluk: 1 });

// ================= METHODS =================

// Auto-calculate fertility before save
soilSchema.pre("save", function (next) {
  const avg =
    (this.nitrogen + this.phosphorus + this.potassium) / 3;

  if (avg < 40) this.fertilityLevel = "low";
  else if (avg < 70) this.fertilityLevel = "medium";
  else this.fertilityLevel = "high";

  next();
});

module.exports = mongoose.model("Soil", soilSchema);