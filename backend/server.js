// === Imports ===
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logToSplunk = require('./utils/logger'); // <- correct path

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
app.get('/test-splunk', (_req, res) => {
  logToSplunk({ message: 'Hello from Fin-AI backend', time: new Date().toISOString() });
  res.send('✅ Test event sent to Splunk!');
});

// === Send all users to Splunk (safe: no password) ===
app.get('/send-users', async (_req, res) => {
  try {
    const users = await User.find().lean();
    for (const u of users) {
      const { password, ...safe } = u;
      logToSplunk({ event: 'user_record', source: 'fin-ai-backend', ...safe });
    }
    res.json({ ok: true, count: users.length });
  } catch (err) {
    console.error(err);
    logToSplunk({ event: 'api_error', route: 'GET /send-users', error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// === Connect to MongoDB ONCE, then start server ===
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 })
  .then(() => {
    console.log('✅ MongoDB connected');
    logToSplunk({ event: '✅ MongoDB connected successfully from Fin-AI backend' });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      logToSplunk({ event: `🚀 Server started on port ${PORT}` });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    logToSplunk({ event: '❌ MongoDB connection failed', error: err.message });
    process.exit(1);
  });