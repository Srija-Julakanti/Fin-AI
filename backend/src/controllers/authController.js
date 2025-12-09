// backend/src/controllers/authController.js

const authService = require("../services/authServices");
const { logEvent } = require("../../utils/splunk");

// REGISTER
const register = async (req, res) => {
  try {
    const response = await authService.registerUser(req.body);

    // Send Splunk event
    try {
      await logEvent("auth_register", {
        email: req.body.email,
        time: new Date().toISOString(),
        source: "auth_register",
      });
      console.log("✅ Splunk register event sent");
    } catch (err) {
      console.error("⚠️ Failed to send Splunk register event:", err.message);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const response = await authService.loginUser(req.body);

    // Send Splunk event
    try {
      await logEvent("auth_login", {
        email: req.body.email,
        time: new Date().toISOString(),
        source: "auth_login",
      });
      console.log("✅ Splunk login event sent");
    } catch (err) {
      console.error("⚠️ Failed to send Splunk login event:", err.message);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// EXPORT BOTH FUNCTIONS ❗❗❗
module.exports = { register, login };