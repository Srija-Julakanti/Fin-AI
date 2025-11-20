// utils/splunk.js

// Enable fetch for Node.js (Node 18+)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// allow self-signed certificates for localhost Splunk (dev only)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const https = require("https");

// Create HTTPS agent (ignore certificate on localhost)
const agent = new https.Agent({ rejectUnauthorized: false });

// Send event to Splunk HEC
async function logEvent(event, data = {}) {
  console.log("🟡 logEvent called with:", event, data);

  const url = `${process.env.SPLUNK_URL}/services/collector/event`;
  const token = process.env.SPLUNK_TOKEN;

  const payload = {
    event: { event, ...data },
    sourcetype: "_json",
    index: process.env.SPLUNK_INDEX || "main",
    source: process.env.SPLUNK_SOURCE || "final_backend",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Splunk ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      agent,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Splunk log failed:", response.status, text);
    } else {
      console.log("✅ Splunk log sent successfully");
    }
  } catch (error) {
    console.error("❌ Splunk log error:", error.message);
  }
}

module.exports = { logEvent };