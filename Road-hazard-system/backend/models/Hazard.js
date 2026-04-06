const mongoose = require("mongoose");

const hazardSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,

  totalReports: { type: Number, default: 0 },
  totalVehicles: { type: Number, default: 0 },

  recentReports: { type: Number, default: 0 },
  recentVehicles: { type: Number, default: 0 },

  severityPercentage: { type: Number, default: 0 },
  severityLevel: {
    type: String,
    enum: ["MINOR", "MODERATE", "SEVERE"],
    default: "MINOR"
  },

  status: {
    type: String,
    enum: ["ACTIVE", "RESOLVED"],
    default: "ACTIVE"
  },

  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Hazard", hazardSchema);