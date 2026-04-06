const express = require("express");
const router = express.Router();
const controller = require("../controllers/hazardController");

router.post("/report", controller.addHazardData);
router.get("/active", controller.getActiveHazards);
router.get("/resolved", controller.getResolvedHazards);
router.get("/stats", controller.getStats);

module.exports = router;