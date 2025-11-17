// src/services/authServices.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { logEvent } = require("../../utils/splunk");

// ============================
//  Register User
// ============================
const registerUser = async ({
  firstName,
  lastName,
  email,
  phone,
  password,
  confirmPassword,
}) => {
  // Passwords must match
  if (password !== confirmPassword) {
    await logEvent("register_attempt", {
      email,
      success: false,
      reason: "password_mismatch",
      time: new Date().toISOString(),
    });
    throw new Error("Passwords do not match");
  }

  // Email must be unique
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    await logEvent("register_attempt", {
      email,
      success: false,
      reason: "email_already_registered",
      time: new Date().toISOString(),
    });
    throw new Error("Email is already registered");
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
  });

  await user.save();

  await logEvent("register_attempt", {
    email,
    userId: user._id,
    success: true,
    time: new Date().toISOString(),
  });

  return { message: "User registered successfully", userId: user._id };
};

// ============================
//  Login User
// ============================
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  // User not found
  if (!user) {
    await logEvent("login_attempt", {
      email,
      success: false,
      reason: "user_not_found",
      time: new Date().toISOString(),
    });
    throw new Error("Invalid email or password");
  }

  // Wrong password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    await logEvent("login_attempt", {
      email,
      userId: user._id,
      success: false,
      reason: "wrong_password",
      time: new Date().toISOString(),
    });
    throw new Error("Invalid email or password");
  }

  // Success
  await logEvent("login_attempt", {
    email,
    userId: user._id,
    success: true,
    time: new Date().toISOString(),
  });

  return { message: "Login successful", userId: user._id };
};

module.exports = {
  registerUser,
  loginUser,
};