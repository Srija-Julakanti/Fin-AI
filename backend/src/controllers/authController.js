// backend/src/controllers/authController.js

const authService = require("../services/authServices");
const { logEvent } = require("../../utils/splunk");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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

/// LOGIN with lockout after 5 failed attempts
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      await logEvent("auth_login_fail", {
        email,
        error: "User not found",
      });
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 2️⃣ If user already BLOCKED
    if (user.isBlocked) {
      await logEvent("auth_blocked_user_try", { email });
      return res.status(403).json({
        error:
          "Your account is blocked due to too many failed login attempts. Please contact support.",
      });
    }

    // 3️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // increase failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.save();

      await logEvent("auth_login_fail", {
        email,
        attempts: user.failedLoginAttempts,
      });

      // 4️⃣ If 5 or more failed → block account
      if (user.failedLoginAttempts >= 5) {
        user.isBlocked = true;
        await user.save();

        await logEvent("auth_user_blocked", {
          email,
          reason: "Too many failed attempts",
        });

        return res.status(403).json({
          error:
            "Too many failed attempts. Your account is now BLOCKED. Please contact support.",
        });
      }

      return res.status(400).json({
        error: "Invalid password",
        attempts: user.failedLoginAttempts,
      });
    }

    // 5️⃣ Login success → reset counters
    user.failedLoginAttempts = 0;
    user.isBlocked = false;
    await user.save();

    await logEvent("auth_login_success", {
      email,
      time: new Date().toISOString(),
    });

    // keep using your existing service to generate token, etc.
    const response = await authService.loginUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Login error", error.message);
    await logEvent("auth_login_error", {
      email: req.body?.email,
      message: error.message,
    });
    return res.status(400).json({ error: error.message });
  }
};

// EXPORT BOTH FUNCTIONS ❗❗❗
module.exports = { register, login };