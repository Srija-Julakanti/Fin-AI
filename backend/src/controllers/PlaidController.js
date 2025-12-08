// backend/src/controllers/plaidController.js

const plaidClient = require("../plaidClient");
// ⭐ Splunk logger
const { logEvent } = require("../../utils/splunk");

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
// ------------------------------------------------------
async function getTransactions(req, res) {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: "Missing access token" });
        }

        const response = await plaidClient.transactionsGet({
            access_token: token,
            start_date: req.body.start_date || "2023-01-01",
            end_date: req.body.end_date || "2023-12-31",
            options: { offset: 0 },
        });

        const transactions = response.data.transactions || [];

        // ⭐ Log transaction activity to Splunk
        logEvent("plaid_transactions_fetched", {
            count: transactions.length,
            sample_transaction: transactions[0] || null,
            timestamp: new Date().toISOString(),
        });

        return res.json(response.data);
    } catch (err) {
        console.error("getTransactions error:", err?.response?.data ?? err);

        // ⭐ Error logging
        logEvent("plaid_error", {
            action: "getTransactions",
            message: err.message,
            timestamp: new Date().toISOString(),
        });

        return res.status(500).json({ error: "Failed to fetch transactions" });
    }
}

module.exports = {
    createLinkToken,
    exchangePublicToken,
    getTransactions,
};