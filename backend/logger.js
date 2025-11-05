const axios = require('axios');
require('dotenv').config();

const SPLUNK_URL = process.env.SPLUNK_HEC_URL;
const SPLUNK_TOKEN = process.env.SPLUNK_HEC_TOKEN;
const SPLUNK_INDEX = process.env.SPLUNK_INDEX || 'main';

// Function to send event to Splunk HEC
const logToSplunk = async (event) => {
  try {
    await axios.post(
      `${SPLUNK_URL}/services/collector`,
      {
        event,
        index: SPLUNK_INDEX,
        sourcetype: 'json',
        source: 'fin-ai-backend'
      },
      {
        headers: {
          Authorization: `Splunk ${SPLUNK_TOKEN}`,
          'Content-Type': 'application/json'
        },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
      }
    );
    console.log('✅ Event sent to Splunk:', event);
  } catch (err) {
    console.error('❌ Error sending to Splunk:', err.message);
  }
};

module.exports = logToSplunk;