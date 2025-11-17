// src/services/authServices.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { logEvent } = require("../../utils/splunk");

// =========================
// Register User
// =========================
const registerUser = async ({ firstName, lastName, email, phone, password, confirmPassword }) => {

  if (password !== confirmPassword) {
    await logEvent("register_attempt", {
      email,
      success: false,
      reason: "password_mismatch",
      time: new Date().toISOString(),
    });
    throw new Error("Passwords do not match");
  }

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

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
  });

  await newUser.save();

  // Successful event
  await logEvent("register_attempt", {
    email,
    success: true,
    time: new Date().toISOString(),
  });

  return { message: "User registered successfully", userId: newUser._id };
};

// =========================
// Login User
// =========================
const loginUser = async ({ email, password }) => {

  const user = await User.findOne({ email });
  if (!user) {
    await logEvent("login_attempt", {
      email,
      success: false,
      reason: "email_not_found",
      time: new Date().toISOString(),
    });
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    await logEvent("login_attempt", {
      email,
      success: false,
      reason: "wrong_password",
      time: new Date().toISOString(),
    });
    throw new Error("Invalid email or password");
  }

  await logEvent("login_attempt", {
    email,
    success: true,
    time: new Date().toISOString(),
  });

  return { message: "Login successful!", userId: user._id };
};

module.exports = { registerUser, loginUser };