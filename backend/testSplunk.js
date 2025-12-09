
console.log("⭐ testSplunk.js Loaded");

const { logEvent } = require("./utils/splunk"); // <-- FIXED

(async () => {
  try {
    await logEvent("manual_test", {
      message: "Hello Splunk!",
      user: "Surinder",
      time: new Date().toISOString(),
    });

    console.log("✅ Splunk test log sent!");
  } catch (error) {
    console.error("❌ Error sending Splunk log:", error);
  }
})();