// === Imports ===
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { logEvent } = require('./utils/splunk');  // <-- from splunk.js

// === App setup ===
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 8000;

// === Health route ===
app.get('/', (_req, res) => res.status(200).send('Backend is running ✅'));

// === MongoDB User model ===
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
  },
  { collection: 'users', timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

// === Splunk test route ===
// === Splunk test route ===
app.get('/test-splunk', (req, res) => {
  logEvent("test", {
    message: "Hello from Fin-AI backend",
    time: new Date().toISOString()
  });

  res.send('Test event sent to Splunk!');
});

// === Test Login Event Route ===
app.get('/test-login-event', (_req, res) => {
  logEvent("login_attempt", {
    email: "testuser@example.com",
    success: false,
    reason: "wrong_password",
    time: new Date().toISOString()
  });

  res.send("Login test event sent to Splunk!");
});

// === Send all users to Splunk (no password) ===
app.get('/send-users', async (_req, res) => {
  try {
    const users = await User.find().lean();

    for (const u of users) {
      const { password, ...safe } = u;  // remove password
      logEvent('user_record', {
        source: 'fin-ai-backend',
        ...safe,
      });
    }

    res.json({ ok: true, count: users.length });
  } catch (err) {
    console.error(err);
    logEvent('api_error', {
      route: 'GET /send-users',
      error: err.message,
    });
    res.status(500).json({ error: err.message });
  }
});

// === Connect to MongoDB ONCE, then start server ===
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
  .then(() => {
    console.log('✅ MongoDB connected');

    logEvent('mongo_connected', {
      message: 'MongoDB connected successfully from Fin-AI backend',
      time: new Date().toISOString(),
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

      logEvent('server_started', {
        message: `Server started on port ${PORT}`,
        time: new Date().toISOString(),
      });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);

    logEvent('mongo_connection_failed', {
      error: err.message,
      time: new Date().toISOString(),
    });

    process.exit(1);
  });