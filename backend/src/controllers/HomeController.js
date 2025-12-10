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

async function getAllTransactionsForUser(req, res) {
	try {
		const userId = req.query.userId || req.body.userId;
		if (!userId) {
			return res.status(400).json({ error: "Missing userId" });
		}

		const limit = Number(req.query.limit) || 200;

		// Fetch from newest to oldest
		const txs = await Transaction.find({ user: userId })
			.sort({ date: -1 })
			.limit(limit)
			.lean();

		// Helper: map Plaid categories -> UI categories
		function mapCategory(tx) {
			const primary = tx.raw?.personal_finance_category?.primary;

			switch (primary) {
				case "TRANSPORTATION":
					return "Transportation";

				case "RENT_AND_UTILITIES":
					return "Rent & Utilities";

				case "PERSONAL_CARE":
					return "Personal Care";

				case "TRANSFER_OUT":
					return "Transfer Out";

				case "LOAN_PAYMENTS":
					return "Loan Payments";

				case "INCOME":
					return "Income";

				case "FOOD_AND_DRINK":
					return "Food & Drink";

				case "TRAVEL":
					return "Travel";

				case "GENERAL_MERCHANDISE":
					return "General Merchandise";

				case "ENTERTAINMENT":
					return "Entertainment";

				default:
					// Fallbacks: use legacy category array if present
					if (Array.isArray(tx.category) && tx.category.length > 0) {
						const raw = tx.category[0]; // e.g. "RESTAURANTS"
						return raw
							.split("_")
							.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
							.join(" ");
					}

					return "Other";
			}
		}

		const uiTxs = txs.map((t) => {
			// `t.amount` is the Plaid amount (debit positive, credit negative)
			const isIncome = t.amount < 0;
			const absAmount = Math.abs(t.amount);

			const jsDate = new Date(t.date); // stored as ISO/date

			// Format date like "Dec 1, 2024"
			const date = jsDate.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});

			// Format time like "9:00 AM"
			const time = jsDate.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			});

			return {
				id: String(t._id),
				name: t.merchantName || t.name,
				category: mapCategory(t),
				amount: absAmount,
				type: isIncome ? "income" : "expense",
				date,
				time,
				// send ISO string; client will turn into a Date object
				dateObj: jsDate.toISOString(),
			};
		});

		return res.json({
			count: uiTxs.length,
			transactions: uiTxs,
		});
	} catch (err) {
		console.error("getAllTransactionsForUser error:", err);
		return res
			.status(500)
			.json({ error: "Failed to fetch all transactions" });
	}
}

module.exports = {
	getHomeData,
	getAllTransactionsForUser
};
