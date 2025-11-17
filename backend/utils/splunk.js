// backend/utils/splunk.js
const axios = require("axios");
const https = require("https");

const agent = new https.Agent({
  rejectUnauthorized: false   // allow self-signed SSL from local Splunk
});

const SPLUNK_HEC_URL = process.env.SPLUNK_HEC_URL;
const SPLUNK_HEC_TOKEN = process.env.SPLUNK_HEC_TOKEN;
const SPLUNK_INDEX = process.env.SPLUNK_INDEX || "main";

async function logEvent(type, data = {}) {
  if (!SPLUNK_HEC_URL || !SPLUNK_HEC_TOKEN) {
    console.warn("Splunk not configured, skipping log");
    return;
  }

  const payload = {
    index: SPLUNK_INDEX,
    sourcetype: "finai:backend",
    event: {
      type,
      ...data,
    },
  };

  try {
    await axios.post(SPLUNK_HEC_URL, payload, {
      httpsAgent: agent,
      headers: {
        Authorization: `Splunk ${SPLUNK_HEC_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error sending to Splunk:", err.message);
  }
}

module.exports = { logEvent };