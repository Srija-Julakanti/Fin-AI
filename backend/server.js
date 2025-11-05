const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ Enable CORS for all requests (no need for app.options in Express 5)
const app = express();
app.use(cors());

require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");

// ✅ Parse JSON
app.use(express.json());

// test route
app.get("/", (req, res) => res.send("Backend is running"));
// ===== Auto send logs to Splunk every 10 seconds =====
const { logEvent } = require('./utils/splunk');  // make sure this file exists and exports logEvent

setInterval(() => {
  const events = [
    "Fin-AI backend test",
    "User logged in",
    "Expense added",
    "Subscription cancelled",
    "AI analysis triggered"
  ];
  
  const randomEvent = events[Math.floor(Math.random() * events.length)];
  const logData = {
    event: randomEvent,
    from: "node",
    timestamp: new Date().toISOString()
  };

  logEvent(logData); // send to Splunk
  console.log("✅ Sent automatic event to Splunk:", logData);
}, 10000); // every 10 seconds
// ✅ Test route
app.get("/", (req, res) => {
	res.status(200).send("Backend is running ✅");
});

// ✅ API routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
	})
	.catch((err) => console.error("❌ MongoDB connection error:", err));
