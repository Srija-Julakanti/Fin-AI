// backend/src/controllers/plaidController.js
const plaidClient = require("../plaidClient");

async function createLinkToken(req, res) {
	try {
		const response = await plaidClient.linkTokenCreate({
			user: { client_user_id: req.body?.client_user_id || "user-id-123" },
			client_name: "Fin-AI",
			products: ["transactions"],
			country_codes: ["US"],
			language: "en",
		});
		console.log("Link token created:", response.data, response);
		return res.json(response.data);
	} catch (err) {
		console.error("createLinkToken error:", err?.response?.data ?? err);
		return res.status(500).json({ error: "Failed to create link token" });
	}
}

async function exchangePublicToken(req, res) {
	try {
		const { publicToken } = req.body;
		if (!publicToken)
			return res.status(400).json({ error: "Missing publicToken" });

		const response = await plaidClient.itemPublicTokenExchange({
			public_token: publicToken,
		});
		return res.json({ accessToken: response.data.access_token });
	} catch (err) {
		console.error("exchangePublicToken error:", err?.response?.data ?? err);
		return res.status(500).json({ error: "Failed to exchange public token" });
	}
}

async function getTransactions(req, res) {
	try {
		const { token } = req.body;
		if (!token) return res.status(400).json({ error: "Missing access token" });

		const response = await plaidClient.transactionsGet({
			access_token: token,
			start_date: req.body.start_date || "2023-01-01",
			end_date: req.body.end_date || "2023-12-31",
			options: { offset: 0 },
		});
		return res.json(response.data);
	} catch (err) {
		console.error("getTransactions error:", err?.response?.data ?? err);
		return res.status(500).json({ error: "Failed to fetch transactions" });
	}
}

module.exports = {
	createLinkToken,
	exchangePublicToken,
	getTransactions,
};
