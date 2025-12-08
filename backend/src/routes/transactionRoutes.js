const express = require("express");
const router = express.Router();
const { createDemoTransaction } = require("../controllers/transactionController");

// Test route to log a random transaction
// POST http://localhost:8000/api/transactions/demo
router.post("/demo", createDemoTransaction);

module.exports = router;