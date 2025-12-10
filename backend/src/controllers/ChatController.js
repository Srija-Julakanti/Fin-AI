// src/controllers/ChatController.js
const Transaction = require('../models/Transaction');
const { computeBudgetFromTransactions } = require('../../utils/budgetUtils');
const { callOllama } = require('../services/ollamaService');

async function chatHandler(req, res) {
  try {
    const { userId, message, monthlyIncome, savingsTargetPct } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const lower = message.toLowerCase();
    const isBudgetIntent = ['budget', 'spend', 'save', 'savings', 'spending', 'expense']
      .some(k => lower.includes(k));

    if (isBudgetIntent) {
      if (!userId) {
        return res.status(400).json({ error: 'userId required for budget intent' });
      }

      // ✅ IMPORTANT: field is `user`, not `userId`
      const txns = await Transaction.find({ user: userId }).lean();
      console.log('chatHandler budget intent tx count:', txns.length);

      const budgetData = computeBudgetFromTransactions(txns, {
        monthlyIncome,
        savingsTargetPct,
      });

      const prompt = `
You are Fin-AI, a concise friendly finance assistant.

User message: "${message}"

Use ONLY the following aggregated data (do not invent numbers):
monthCount: ${budgetData.monthCount}
monthlyAverages: ${JSON.stringify(budgetData.monthlyAverages, null, 2)}
totals: ${JSON.stringify(budgetData.suggestions.totals, null, 2)}
recommended: ${JSON.stringify(budgetData.suggestions.recommended, null, 2)}
rules: ${JSON.stringify(budgetData.suggestions.rules, null, 2)}

Task:
1) Provide a one-line summary of the user's spending.
2) Provide a short suggested monthly budget: list up to 6 top categories with amounts.
3) Provide one concrete action to improve savings this month.
4) Show Emergency fund target number.
Keep response short (4-6 lines), friendly, and use only numbers from the data above.
`;

      const reply = await callOllama(prompt, 'llama3');
      return res.json({ ok: true, reply });
    } else {
      // general chat
      const prompt = `
You are Fin-AI, a helpful finance assistant.
User: "${message}"
Reply in 2 short sentences and if user asks about personal data say "I can help with your transactions and budgets — ask 'Create budget'".
`;
      const reply = await callOllama(prompt, 'llama3');
      return res.json({ ok: true, reply });
    }
  } catch (err) {
    console.error('ChatController error', err);
    return res.status(500).json({ error: 'internal', details: err.message });
  }
}

module.exports = { chatHandler };
