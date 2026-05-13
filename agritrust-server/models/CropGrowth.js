const mongoose = require("mongoose");

// ================= STAGE SCHEMA =================
const stageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  startDay: {
    type: Number,
    required: true
  },

  endDay: {
    type: Number,
    required: true
  },

  activities: [{
    type: String,
    trim: true
  }],

  irrigation: {
    type: String,
    trim: true
  },

  fertilizer: {
    type: String,
    trim: true
  },

  pests: [{
    type: String,
    trim: true
  }]

}, { _id: false });


// ================= MAIN SCHEMA =================

const cropGrowthSchema = new mongoose.Schema({

  //  Reference to Crop model
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop",
    required: true,
    unique: true
  },

  totalDays: {
    type: Number,
    required: true
  },

  stages: {
    type: [stageSchema],
    validate: {
      validator: function(stages) {
        return stages.length > 0;
      },
      message: "At least one growth stage is required"
    }
  },

  generalAdvice: [{
    type: String,
    trim: true
  }]

}, { timestamps: true });



// ================= METHODS =================

//  Get current stage based on days passed
cropGrowthSchema.methods.getCurrentStage = function(daysPassed) {
  return this.stages.find(
    (stage) => daysPassed >= stage.startDay && daysPassed <= stage.endDay
  );
};


// ================= STATIC METHODS =================

//  Fetch growth data with crop details
cropGrowthSchema.statics.getWithCrop = function(cropId) {
  return this.findOne({ cropId }).populate("cropId");
};


// ================= EXPORT =================

module.exports = mongoose.model("CropGrowth", cropGrowthSchema);