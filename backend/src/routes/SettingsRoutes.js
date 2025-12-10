// backend/src/routes/plaidRoutes.js
const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/SettingsController");



// POST /api/plaid/create_link_token
router.post("/delete-data", settingsController.deleteData);
router.post("/delete-account", settingsController.deleteAccount);


module.exports = router;
