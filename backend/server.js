const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ Enable CORS for all requests (no need for app.options in Express 5)
const app = express();
app.use(cors());

require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");
const budgetRoutes = require("./src/routes/budgetRoutes");

// ✅ Parse JSON
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
	res.status(200).send("Backend is running ✅");
});

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/budgets", budgetRoutes);

const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
	})
	.catch((err) => console.error("❌ MongoDB connection error:", err));
