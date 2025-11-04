const axios = require('axios');
const https = require('https');

const hecUrl = process.env.SPLUNK_HEC_URL;
const hecToken = process.env.SPLUNK_HEC_TOKEN;
const index = process.env.SPLUNK_INDEX || 'main';

// Simple Splunk logger
async function logEvent(event, fields = {}) {
  if (!hecUrl || !hecToken) return;
  const payload = {
    time: Date.now() / 1000,
    host: 'fin-ai-backend',
    source: 'fin-ai-backend',
    sourcetype: '_json',
    index,
    event: { event, ...fields }
  };
  try {
    await axios.post(`${hecUrl}/event`, payload, {
      headers: { Authorization: `Splunk ${hecToken}` },
      timeout: 3000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });
  } catch (e) {
    console.error('Splunk log failed:', e.message);
  }
}

module.exports = { logEvent };