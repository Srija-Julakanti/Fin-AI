require("dotenv").config();
const { logEvent } = require("./utils/splunk");

(async () => {
  console.log("Sending test event to Splunk...");
  await logEvent("test_event", { from: "node_test_script" });
  console.log("Done.");
})();