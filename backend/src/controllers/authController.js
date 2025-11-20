// Import Splunk logger and auth service
const { logEvent } = require("../../utils/splunk");   // keep this if it already works
const authService = require("../services/authServices");

// ================= REGISTER USER =================
const register = async (req, res) => {
  try {
    // Call service to register user
    const response = await authService.registerUser(req.body);

    // ⭐ Splunk log: Registration successful
    await logEvent("register_success", {
      email: req.body.email,
    });

    // Send response to frontend
    res.status(201).json(response);
  } catch (error) {
    // ⭐ Splunk log: Registration failed
    await logEvent("register_failed", {
      email: req.body.email,
      error: error.message,
    });

    res.status(400).json({ error: error.message });
  }
};

// ================= LOGIN USER =================
const login = async (req, res) => {
  try {
    // Call service to log in user
    const response = await authService.loginUser(req.body);

    // ⭐ Splunk log: Login successful
    await logEvent("login_success", {
      email: req.body.email,
    });

    res.status(200).json(response);
  } catch (error) {
    // ⭐ Splunk log: Login failed
    await logEvent("login_failed", {
      email: req.body.email,
      error: error.message,
    });

    res.status(400).json({ error: error.message });
  }
};

// Export functions
module.exports = { register, login };