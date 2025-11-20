// backend/src/routes/metricsRoutes.js
const express = require("express");
const router = express.Router();
const { logEvent } = require("../../utils/splunk.js");

// POST /api/metrics/dashboard-view
router.post("/dashboard-view", async (req, res) => {
  try {
    await logEvent("dashboard_view", {
      type: "dashboard_view",
      ...req.body, // extra data from frontend
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error logging dashboard event:", err);
    res.status(500).json({ error: "Failed to log dashboard event" });
  }
});

module.exports = router;