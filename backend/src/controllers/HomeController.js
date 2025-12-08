// backend/src/controllers/HomeController.js
const PlaidItem = require("../models/PlaidItem");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

async function getHomeData(req, res) {
  try {
    const { userId } = req.query;
    console.log(userId);
    if (!userId) {
        console.log("Missing userId");
      return res.status(400).json({ error: "Missing userId" });
    }

    // Check if user has any linked Plaid accounts
    const plaidItems = await PlaidItem.find({ user: userId });
    const hasLinkedAccounts = plaidItems.length > 0;

    let response = {
      hasLinkedAccounts,
      message: hasLinkedAccounts 
        ? "Account data loaded successfully" 
        : "Please link your bank account to view your financial data"
    };

    // Only include account data if user has linked accounts
    if (hasLinkedAccounts) {
      // Get total balance from all accounts
      const accounts = await Account.find({ user: userId });
      const totalBalance = accounts.reduce(
        (sum, account) => sum + (account.currentBalance || 0), 
        0
      );

      // Get recent transactions (last 5)
      const recentTransactions = await Transaction.find({ user: userId })
        .sort({ date: -1 })
        .limit(5)
        .populate('account', 'name');

      // Get upcoming bills (transactions with future dates or recurring)
      const today = new Date();
      const upcomingBills = await Transaction.find({
        user: userId,
        $or: [
          { date: { $gte: today } },
          { isRecurring: true }
        ]
      })
      .sort({ date: 1 })
      .limit(5)
      .populate('account', 'name');

      response = {
        ...response,
        totalBalance,
        recentTransactions,
        upcomingBills
      };
    }

    return res.json(response);
  } catch (err) {
    console.error("Error in getHomeData:", err);
    return res.status(500).json({ 
      error: "Failed to load home data",
      details: err.message 
    });
  }
}

module.exports = {
  getHomeData
};
