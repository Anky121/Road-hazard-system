const Hazard = require("../models/Hazard");
const calculateSeverity = require("../utils/severityCalculator");

async function processHazard(data) {
  const { latitude, longitude, reported } = data;

  // Simple radius match (prototype logic)
  const hazard = await Hazard.findOne({
    latitude: { $gte: latitude - 0.0003, $lte: latitude + 0.0003 },
    longitude: { $gte: longitude - 0.0003, $lte: longitude + 0.0003 }
  });

  if (hazard) {
    hazard.totalVehicles++;
    hazard.recentVehicles++;

    if (reported) {
      hazard.totalReports++;
      hazard.recentReports++;
    }

    const result = calculateSeverity(
      hazard.recentReports,
      hazard.recentVehicles
    );

    hazard.severityPercentage = result.percentage;
    hazard.severityLevel = result.level;

    // Reset recent window after 50 vehicles
    if (hazard.recentVehicles >= 12) {
    hazard.recentReports = 0;
    hazard.recentVehicles = 0;
    }

    // Automatic Resolution Logic
    if (hazard.severityPercentage < 20 && hazard.recentVehicles >= 6) {
      hazard.status = "RESOLVED";
    }

    hazard.lastUpdated = new Date();
    await hazard.save();

    return hazard;
  }

  // Create new hazard
  return await Hazard.create({
    latitude,
    longitude,
    totalVehicles: 1,
    recentVehicles: 1,
    totalReports: reported ? 1 : 0,
    recentReports: reported ? 1 : 0
  });
}

module.exports = { processHazard };