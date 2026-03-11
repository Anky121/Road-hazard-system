// Controller for hazard-related endpoints.
// This file exports Express route handlers that the router uses to interact
// with hazards stored in the database. Handlers are thin: they call service
// functions or the Mongoose model, then return JSON responses to the client.

// processHazard: service function that validates/processes incoming hazard
// payloads and persists them (or updates existing records) as needed.
const { processHazard } = require("../services/hazardService");

// Hazard: Mongoose model representing a hazard document in MongoDB. Used
// directly by simple read/count operations in the handlers below.
const Hazard = require("../models/Hazard");

// Handler: addHazardData
// - Purpose: Accepts a hazard payload (from req.body), delegates processing
//   and persistence to `processHazard`, and returns the processed/created
//   hazard object as JSON.
// - Expected input: JSON body containing hazard fields (validated within
//   the service layer). Called by a POST route from the API.
// - Error handling: Catches exceptions and responds with HTTP 500 and an
//   error message. More fine-grained error statuses can be implemented in
//   the service layer if needed.
exports.addHazardData = async (req, res) => {
  try {
    const hazard = await processHazard(req.body);
    res.json(hazard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handler: getActiveHazards
// - Purpose: Query the database for hazards with `status: "ACTIVE"` and
//   return them as a JSON array. Used to populate active hazard lists in
//   the frontend or APIs.
exports.getActiveHazards = async (req, res) => {
  const hazards = await Hazard.find({ status: "ACTIVE" });
  res.json(hazards);
};

// Handler: getResolvedHazards
// - Purpose: Query the database for hazards with `status: "RESOLVED"` and
//   return them as a JSON array. Useful for historical views or archives.
exports.getResolvedHazards = async (req, res) => {
  const hazards = await Hazard.find({ status: "RESOLVED" });
  res.json(hazards);
};

// Handler: getStats
// - Purpose: Return simple aggregated statistics about hazards: the count
//   of active hazards and the count of resolved hazards. Response JSON has
//   the shape: { active: <number>, resolved: <number> }.
// - Performance: Uses `countDocuments` which is efficient for counts; add
//   indexes on `status` in the Hazard model if counts are queried often.
exports.getStats = async (req, res) => {
  const active = await Hazard.countDocuments({ status: "ACTIVE" });
  const resolved = await Hazard.countDocuments({ status: "RESOLVED" });

  res.json({ active, resolved });
};