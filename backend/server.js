// Load environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { logEvent } = require("./utils/splunk");
console.log("⭐ server.js Loaded (Fin-AI backend)");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// ⭐ Automatically send every API request to Splunk
app.use((req, res, next) => {
  try {
    logEvent("http_request", {
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log("Splunk auto-log failed:", error.message);
  }
  next();
});

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const metricsRoutes = require("./src/routes/metricsRoutes.js");

// Home test route
app.get("/", (req, res) => {
  res.status(200).send("Backend is running ✅");
});

// ------------------ TEST ROUTE: CHECK MONGODB ------------------
app.get("/test-mongo", async (req, res) => {
  try {
    const Test = mongoose.model(
      "Test",
      new mongoose.Schema({
        name: String,
        createdAt: { type: Date, default: Date.now }
      })
    );

    const doc = await Test.create({ name: "Surinder Test" });
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error("Error in /test-mongo:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// ======= TEST ROUTE: CHECK SPLUNK =======
app.get("/test-splunk", async (req, res) => {
  console.log("👉 /test-splunk route was called");
  try {
    await logEvent("test_splunk_event", { from: "test_route" });
    res.status(200).send("Splunk test event sent successfully ✅");
  } catch (err) {
    console.error("Error in /test-splunk:", err);
    res.status(500).send("Failed to send Splunk event ❌");
  }
});
// ---------------------------------------------------------------

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/metrics", metricsRoutes);

const PORT = process.env.PORT || 8000;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });