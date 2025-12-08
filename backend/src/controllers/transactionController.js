const { logEvent } = require("../../utils/splunk");

// ⭐ Sample transactions for testing
const sampleTransactions = [
  {
    userId: "surinder",
    title: "Starbucks Coffee",
    subtitle: "Latte 9:42 AM",
    amount: -6.25,
    category: "Food & Drinks",
    paymentMethod: "DebitCard"
  },
  {
    userId: "surinder",
    title: "Walmart",
    subtitle: "Groceries",
    amount: -45.90,
    category: "Groceries",
    paymentMethod: "DebitCard"
  },
  {
    userId: "surinder",
    title: "Amazon Order",
    subtitle: "Online Shopping",
    amount: -32.50,
    category: "Shopping",
    paymentMethod: "CreditCard"
  },
  {
    userId: "surinder",
    title: "Salary",
    subtitle: "Monthly Income",
    amount: 3200,
    category: "Income",
    paymentMethod: "DirectDeposit"
  },
  {
    userId: "surinder",
    title: "CVS Pharmacy",
    subtitle: "Health & Wellness",
    amount: -18.75,
    category: "Health",
    paymentMethod: "DebitCard"
  },
  {
    userId: "surinder",
    title: "Uber Ride",
    subtitle: "Morning Commute",
    amount: -14.20,
    category: "Transportation",
    paymentMethod: "CreditCard"
  },
];

// ⭐ Create a random transaction and send to Splunk
exports.createDemoTransaction = async (req, res) => {
  try {
    // pick a random transaction example
    const tx = sampleTransactions[Math.floor(Math.random() * sampleTransactions.length)];

    const txRecord = {
      ...tx,
      createdAt: new Date().toISOString(),
      transactionId: "txn_" + Math.random().toString(36).substring(2, 10)
    };

    // Send SUCCESS transaction event to Splunk
logEvent("transaction_success", {
  source: "finai-backend",
  status: "success",
  ...txRecord
});
    res.status(201).json({
      message: "Transaction logged successfully",
      transaction: txRecord
    });

  } catch (err) {
    // Send FAILED transaction event to Splunk
logEvent("transaction_failed", {
  source: "finai-backend",
  status: "failed",
  error: err.message
});

    res.status(500).json({
      message: "Transaction logging failed",
      error: err.message
    });
  }
};