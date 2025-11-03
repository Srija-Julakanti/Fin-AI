const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // ✅ load .env once — no need to call dotenv.config() again

const app = express();
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => res.send("Backend is running"));

const PORT = process.env.PORT || 5000;

// connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI)
	.then(() =>
		app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
	)
	.catch((err) => console.error("❌ MongoDB connection error:", err));
