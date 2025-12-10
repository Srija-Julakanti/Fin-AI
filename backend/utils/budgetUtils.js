// src/utils/budgetUtils.js
const dayjs = require('dayjs');

/**
 * transactions: array of { date, amount, category }
 * userProfile: { monthlyIncome: number | null, savingsTargetPct: number | undefined }
 */
function computeBudgetFromTransactions(transactions = [], userProfile = {}) {
  const now = dayjs();
  const sixMonthStart = now.subtract(6, 'month');
  const recent = transactions.filter(t => dayjs(t.date).isAfter(sixMonthStart));

  const months = {};
  const categoryMonthly = {};
  recent.forEach(t => {
    const monthKey = dayjs(t.date).format('YYYY-MM');
    months[monthKey] = true;
    const cat = (t.category || 'uncategorized').toLowerCase();
    if (!categoryMonthly[cat]) categoryMonthly[cat] = {};
    categoryMonthly[cat][monthKey] = (categoryMonthly[cat][monthKey] || 0) + Math.abs(Number(t.amount));
  });

  const monthCount = Math.max(Object.keys(months).length, 1);
  const monthlyAverages = {};
  Object.keys(categoryMonthly).forEach(cat => {
    const totals = Object.values(categoryMonthly[cat]);
    const sum = totals.reduce((s, v) => s + v, 0);
    monthlyAverages[cat] = +(sum / monthCount).toFixed(2);
  });

  const fixedKeywords = ['rent','mortgage','utilities','electricity','water','insurance','loan','subscription'];
  const fixed = {}, discretionary = {};
  Object.entries(monthlyAverages).forEach(([cat, avg]) => {
    const isFixed = fixedKeywords.some(k => cat.includes(k));
    if (isFixed) fixed[cat] = avg;
    else discretionary[cat] = avg;
  });

  const monthlyIncome = userProfile.monthlyIncome || null;
  const savingsTargetPct = (userProfile.savingsTargetPct != null) ? userProfile.savingsTargetPct : 0.2;

  const totalFixed = Object.values(fixed).reduce((s, v) => s + v, 0);
  const totalDiscretionary = Object.values(discretionary).reduce((s, v) => s + v, 0);

  const suggestions = {
    fixed,
    discretionary,
    totals: { totalFixed: +totalFixed.toFixed(2), totalDiscretionary: +totalDiscretionary.toFixed(2), totalSpending: +(totalFixed + totalDiscretionary).toFixed(2) },
    recommended: {}
  };

  if (monthlyIncome) {
    const savingsTarget = +(monthlyIncome * savingsTargetPct).toFixed(2);
    const discretionaryCap = Math.max(monthlyIncome - totalFixed - savingsTarget, 0);
    suggestions.recommended = {
      monthlyIncome,
      savingsTarget,
      discretionaryCap,
      recommendedDiscretionaryReduction: Math.max(0, totalDiscretionary - discretionaryCap)
    };
  } else {
    suggestions.recommended = { strategy: 'no-income-known', suggestedDiscretionaryCutPct: 0.15 };
  }

  suggestions.rules = { emergencyFundTarget: +((totalFixed) * 3).toFixed(2), savingsGoalPct: savingsTargetPct };

  return { monthlyAverages, suggestions, monthCount };
}

module.exports = { computeBudgetFromTransactions };
