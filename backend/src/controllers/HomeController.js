// backend/src/controllers/HomeController.js
const PlaidItem = require("../models/PlaidItem");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const PlaidAccountToken = require("../models/PlaidAccountToken");
const plaidClient = require("../plaidClient");

async function getOrCreateIncomeUserToken(userId) {
	// 1. Try to find an existing token doc
	let tokenDoc = await PlaidAccountToken.findOne({ user: userId });
	console.log("Existing PlaidAccountToken:", tokenDoc);
	if (tokenDoc) {
		return tokenDoc.plaidUserToken;
	}

	// 2. No token yet -> create a new Plaid Income user
	const userCreateResp = await plaidClient.userCreate({
		client_user_id: String(userId), // your internal user id
	});

	const userToken = userCreateResp.data.user_token; // looks like user-sandbox-...
	console.log("Created new Plaid Income user_token:", userCreateResp);
	// 3. Persist it
	tokenDoc = await PlaidAccountToken.create({
		user: userId,
		plaidUserToken: userToken,
		environment: process.env.PLAID_ENV || "sandbox",
	});

	return tokenDoc.plaidUserToken;
}

async function getHomeData(req, res) {
	try {
		const { userId } = req.query;
		console.log("getHomeData userId:", userId);

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
				: "Please link your bank account to view your financial data",
		};

		// Only include account data if user has linked accounts
		if (hasLinkedAccounts) {
			// ----- Total balance -----
			const accounts = await Account.find({ user: userId });
			const totalBalance = accounts.reduce(
				(sum, account) => sum + (account.currentBalance || 0),
				0
			);

			// ----- Recent transactions (last 5) -----
			const recentTransactions = await Transaction.find({ user: userId })
				.sort({ date: -1 })
				.limit(5)
				.populate("account", "name");

			// ----- Upcoming bills -----
			const today = new Date();
			const upcomingBills = await Transaction.find({
				user: userId,
				$or: [{ date: { $gte: today } }, { isRecurring: true }],
			})
				.sort({ date: 1 })
				.limit(5)
				.populate("account", "name");

			// ----- Income (Bank Income via user_token) -----
			let incomeReport = null;

			try {
				// Get existing or create new Income user_token
				const userToken = await getOrCreateIncomeUserToken(userId);
				console.log("Income user_token:", userToken);

				const request = {
					user_token: userToken,
					options: { count: 1 }, // latest report
				};

				const incomeResp = await plaidClient.creditBankIncomeGet(request);
				incomeReport = incomeResp.data; // full Plaid Income payload
			} catch (err) {
				console.error("Income fetch failed:", err.response?.data || err);
				// Don't block the rest of home data if income fails
			}

			response = {
				...response,
				totalBalance,
				recentTransactions,
				upcomingBills,
				incomeReport,
			};
		}

		return res.json(response);
	} catch (err) {
		console.error("Error in getHomeData:", err);
		return res.status(500).json({
			error: "Failed to load home data",
			details: err.message,
		});
	}
}

module.exports = {
	getHomeData,
};
