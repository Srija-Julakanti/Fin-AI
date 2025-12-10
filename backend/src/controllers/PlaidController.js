// backend/src/controllers/plaidController.js

const plaidClient = require("../plaidClient");
const PlaidItem = require("../models/PlaidItem");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const logEvent = require("../../utils/splunk");

// ------------------------------------------------------
// Simple suspicious transaction checker
// ------------------------------------------------------
function findSuspiciousTransactions(transactions) {
    const suspicious = [];

    for (const tx of transactions) {
        // 1) High amount rule
        if (tx.amount && tx.amount > 500) {
            suspicious.push({
                reason: "HIGH_AMOUNT",
                threshold: 500,
                name: tx.name,
                amount: tx.amount,
                date: tx.date,
                category: tx.category,
            });
        }
    }

    return suspicious;
}

// ------------------------------------------------------
// Create Link Token
// ------------------------------------------------------
async function createLinkToken(req, res) {
    try {
        const response = await plaidClient.linkTokenCreate({
            user: { client_user_id: req.body?.client_user_id || "user-id-123" },
            client_name: "Fin-AI",
            products: ["transactions"],
            country_codes: ["US"],
            language: "en",
        });

        // ⭐ Log to Splunk
        logEvent("plaid_link_token_created", {
            client_user_id: req.body?.client_user_id || "user-id-123",
            timestamp: new Date().toISOString(),
        });

        return res.json(response.data);
    } catch (err) {
        console.error("createLinkToken error:", err?.response?.data ?? err);

        // ⭐ Error logging
        logEvent("plaid_error", {
            action: "createLinkToken",
            message: err.message,
            timestamp: new Date().toISOString(),
        });

        return res.status(500).json({ error: "Failed to create link token" });
    }
}

// ------------------------------------------------------
// Exchange Public Token for Access Token
// ------------------------------------------------------
async function exchangePublicToken(req, res) {
    try {
        const { publicToken } = req.body;
        if (!publicToken)
            return res.status(400).json({ error: "Missing publicToken" });

        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;

        // ⭐ Log to Splunk
        logEvent("plaid_token_exchanged", {
            timestamp: new Date().toISOString(),
        });

        return res.json({ accessToken });
    } catch (err) {
        console.error("exchangePublicToken error:", err?.response?.data ?? err);

        // ⭐ Error logging
        logEvent("plaid_error", {
            action: "exchangePublicToken",
            message: err.message,
            timestamp: new Date().toISOString(),
        });

        return res.status(500).json({ error: "Failed to exchange public token" });
    }
}

// ------------------------------------------------------
// Fetch Transactions
// --------------------------------------------
// ----------
async function getTransactions(req, res) {
	try {
    const { userId, publicToken, institution } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });
    if (!publicToken)
      return res.status(400).json({ error: "Missing publicToken" });
	try {
		const { userId, publicToken, institution } = req.body;
		if (!userId) return res.status(400).json({ error: "Missing userId" });
		if (!publicToken)
			return res.status(400).json({ error: "Missing publicToken" });

		const { data } = await plaidClient.itemPublicTokenExchange({
			public_token: publicToken,
		});
		const { access_token, item_id } = data;

		let plaidItem = await PlaidItem.findOne({ itemId: item_id, user: userId });

		if (!plaidItem) {
			plaidItem = await PlaidItem.create({
				user: userId,
				itemId: item_id,
				accessToken: access_token,
				institutionId: institution?.institution_id,
				institutionName: institution?.name,
			});
		} else {
			plaidItem.accessToken = access_token;
			if (institution) {
				plaidItem.institutionId = institution.institution_id;
				plaidItem.institutionName = institution.name;
			}
			await plaidItem.save();
		}

		// 1) Get accounts (balances)
		const accountsResp = await plaidClient.accountsGet({
			access_token: access_token,
		});
		const accounts = accountsResp.data.accounts;
  
		// 2) Get identity owners / verification_name
		const infoByAccountId = {};
		
			const identityResp = await plaidClient.identityGet({
				access_token: access_token,
			});

			identityResp.data.accounts.forEach((acc) => {
				const ownerNames =
					acc.owners?.flatMap((o) => o.names || [])?.filter(Boolean) || [];
				const verificationName = acc.verification_name || null;

				infoByAccountId[acc.account_id] = {
					ownerNames,
					verificationName,
				};
			});
		
			    const accountDocs = [];
    for (const acc of accounts) {
      const doc = await Account.findOneAndUpdate(
        {
          user: userId,
          plaidItem: plaidItem._id,
          plaidAccountId: acc.account_id,
        },
        {
          name: acc.name,
          officialName: acc.official_name,
          mask: acc.mask,
          type: acc.type,
          subtype: acc.subtype,
          currentBalance: acc.balances.current,
          availableBalance: acc.balances.available,
          isoCurrencyCode: acc.balances.iso_currency_code,
        },
        { new: true, upsert: true }
      );
      accountDocs.push(doc);
    }
	// ⭐ Log transaction activity to Splunk
        logEvent("plaid_transactions_fetched", {
            count: transactions.length,
            sample_transaction: transactions[0] || null,
            timestamp: new Date().toISOString(),
        });

    return res.json({
      plaidItemId: plaidItem._id,
      institutionName: plaidItem.institutionName,
      accounts: accountDocs,
    });

			
		} catch (e) {
			// Identity not available for this FI or product not enabled
			console.error(
				"identityGet error (owner/verification name may be empty):",
				e.response?.data || e
			);
			logEvent("plaid_error", {
            action: "getTransactions",
            message: err.message,
            timestamp: new Date().toISOString(),
        });
		}

		
	} catch (err) {
		console.error("getTransactions error:", err?.response?.data ?? err);
	}}

// syncTransactions / getTransactions unchanged...
async function syncTransactions(req, res) {
	try {
		const { userId, plaidItemId, start_date, end_date } = req.body;
		if (!userId) return res.status(400).json({ error: "Missing userId" });
		if (!plaidItemId)
			return res.status(400).json({ error: "Missing plaidItemId" });

		const item = await PlaidItem.findOne({
			_id: plaidItemId,
			user: userId,
		});
		if (!item) return res.status(404).json({ error: "Plaid item not found" });

		const today = new Date().toISOString().slice(0, 10);
		const startDate = start_date || "2025-05-01";
		const endDate = end_date || today;

		console.log(
			"Syncing transactions for item",
			plaidItemId,
			"from",
			startDate,
			"to",
			endDate
		);

		const plaidResp = await plaidClient.transactionsGet({
			access_token: item.accessToken,
			start_date: startDate,
			end_date: endDate,
			options: { count: 500, offset: 0 },
		});

		const { transactions } = plaidResp.data;
		console.log("Plaid returned transactions:", transactions.length);

		const plaidAccountIds = [...new Set(transactions.map((t) => t.account_id))];
		console.log("Unique plaidAccountIds from tx:", plaidAccountIds);

		const accounts = await Account.find({
			user: userId,
			plaidItem: item._id,
			plaidAccountId: { $in: plaidAccountIds },
		});

		console.log("Matched local accounts:", accounts.length);

		const accountMap = {};
		accounts.forEach((acc) => {
			accountMap[acc.plaidAccountId] = acc;
		});

		const savedTxs = [];
		for (const t of transactions) {
			const account = accountMap[t.account_id];
			if (!account) continue;

			const doc = await Transaction.findOneAndUpdate(
				{ plaidTransactionId: t.transaction_id },
				{
					user: userId,
					account: account._id,
					name: t.name,
					merchantName: t.merchant_name,
					amount: t.amount,
					isoCurrencyCode: t.iso_currency_code,
					date: t.date,
					category: t.category || [],
					pending: t.pending,
					paymentChannel: t.payment_channel,
					raw: t,
				},
				{ new: true, upsert: true }
			);
			savedTxs.push(doc);
		}

		console.log("Saved transactions:", savedTxs.length);

		return res.json({
			count: savedTxs.length,
			transactions: savedTxs,
		});
	} catch (err) {
		console.error("syncTransactions error:", err?.response?.data ?? err);
		return res.status(500).json({ error: "Failed to sync transactions" });
	}
}

async function getTransactions(req, res) {
	try {
		const userId = req.query.userId || req.body.userId;
		if (!userId) return res.status(400).json({ error: "Missing userId" });

		const { accountId, from, to, limit = 100 } = req.query;
		const query = { user: userId };

		if (accountId) query.account = accountId;
		if (from || to) {
			query.date = {};
			if (from) query.date.$gte = new Date(from);
			if (to) query.date.$lte = new Date(to);
		}

		const txs = await Transaction.find(query)
			.sort({ date: -1 })
			.limit(Number(limit))
			.populate("account");

		return res.json(txs);
	} catch (err) {
		console.error("getTransactions error:", err);
		return res.status(500).json({ error: "Failed to fetch transactions" });
	}
}
async function fetchTransactions(req, res) {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: "Missing access token" });
    }

    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: "2023-01-01",
      end_date: new Date().toISOString().slice(0, 10),
    });

    const transactions = response.data.transactions || [];

    // ⭐ Send to Splunk
    logEvent("plaid_fetch_transactions", {
      count: transactions.length,
      first: transactions[0] || null,
    });

    return res.status(200).json({ transactions });
  } catch (error) {
    logEvent("plaid_fetch_error", { message: error.message });
    return res.status(500).json({ error: error.message });
  }
}
module.exports = {
  createLinkToken,
  exchangePublicToken,
  syncTransactions,
  getTransactions,
  fetchTransactions,   // <-- add this line
};
