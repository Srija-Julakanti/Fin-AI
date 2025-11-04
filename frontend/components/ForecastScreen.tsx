import { Button } from './ui/button';
import FinAICard from './shared/FinAICard';
import { TrendingUp, Calendar, DollarSign, AlertCircle, ShoppingCart, Car, Home, Smartphone, Coffee, MoreHorizontal } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

interface ForecastScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
}

export default function ForecastScreen({ onNavigate }: ForecastScreenProps) {
  const forecastData = [
    { date: 'Nov 1', balance: 12847, projected: 12847 },
    { date: 'Nov 5', balance: 12200, projected: 12150 },
    { date: 'Nov 10', balance: null, projected: 11800 },
    { date: 'Nov 15', balance: null, projected: 11200 },
    { date: 'Nov 20', balance: null, projected: 12100 },
    { date: 'Nov 25', balance: null, projected: 13400 },
    { date: 'Nov 30', balance: null, projected: 14200 },
    { date: 'Dec 5', balance: null, projected: 13800 },
    { date: 'Dec 10', balance: null, projected: 14600 },
    { date: 'Dec 15', balance: null, projected: 15100 },
  ];

  const spendingByCategory = [
    { name: 'Groceries', value: 387, color: '#10b981', icon: ShoppingCart },
    { name: 'Transportation', value: 245, color: '#3b82f6', icon: Car },
    { name: 'Bills & Utilities', value: 634, color: '#f59e0b', icon: Home },
    { name: 'Subscriptions', value: 143, color: '#8b5cf6', icon: Smartphone },
    { name: 'Dining Out', value: 178, color: '#ec4899', icon: Coffee },
    { name: 'Other', value: 234, color: '#6b7280', icon: MoreHorizontal },
  ];

  const totalSpending = spendingByCategory.reduce((sum, cat) => sum + cat.value, 0);

  const upcomingBills = [
    { name: 'Rent', amount: 1800, date: 'Nov 1', paid: true },
    { name: 'Car Insurance', amount: 156, date: 'Nov 5', paid: true },
    { name: 'Credit Card - Chase', amount: 428, date: 'Nov 8', paid: false },
    { name: 'Electric Bill', amount: 89, date: 'Nov 12', paid: false },
    { name: 'Internet', amount: 79, date: 'Nov 15', paid: false },
    { name: 'Phone Bill', amount: 65, date: 'Nov 18', paid: false },
    { name: 'Subscriptions', amount: 143, date: 'Nov 20', paid: false },
  ];

  const upcomingTotal = upcomingBills.filter(b => !b.paid).reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-slate-800 dark:text-slate-100">Forecast</h1>
        <p className="text-slate-600 dark:text-slate-400">AI-powered balance predictions</p>
      </div>

      {/* Forecast Summary */}
      <FinAICard className="bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 text-white">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <p className="text-white/90">Projected Balance</p>
          </div>
          <p className="text-4xl">$15,100</p>
          <p className="text-white/90">by December 15, 2025</p>
        </div>
      </FinAICard>

      {/* AI Insight */}
      <FinAICard className="bg-blue-50 border-2 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500 p-2 rounded-full mt-1">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-slate-900">AI Insight</p>
            <p className="text-slate-600 mt-1">Based on your spending patterns, you will have approximately $1,200 available for discretionary spending by mid-December.</p>
          </div>
        </div>
      </FinAICard>

      {/* Spending Breakdown - Pie Chart */}
      <FinAICard className="bg-white dark:bg-slate-800">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-800 dark:text-slate-100">Spending by Category</h3>
            <p className="text-slate-600 dark:text-slate-400">${totalSpending.toLocaleString()}</p>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={spendingByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                onClick={(data) => {
                  if (onNavigate) {
                    onNavigate('category-transactions', { category: data.name });
                  }
                }}
                cursor="pointer"
              >
                {spendingByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `$${value}`}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Category Legend */}
          <div className="grid grid-cols-2 gap-3">
            {spendingByCategory.map((category) => {
              const Icon = category.icon;
              const percentage = ((category.value / totalSpending) * 100).toFixed(0);
              return (
                <button
                  key={category.name}
                  onClick={() => onNavigate?.('category-transactions', { category: category.name })}
                  className="flex items-center gap-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-lg transition-colors"
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-slate-100 text-sm truncate">{category.name}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      ${category.value} ({percentage}%)
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
            Click on a category to view transactions
          </p>
        </div>
      </FinAICard>

      {/* 30-Day Projection Chart */}
      <FinAICard className="bg-white dark:bg-slate-800">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-800 dark:text-slate-100">30-Day Projection</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full" />
                <span className="text-slate-600 dark:text-slate-400">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-slate-600 dark:text-slate-400">Projected</span>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#14b8a6" 
                strokeWidth={2}
                fill="url(#colorActual)" 
              />
              <Area 
                type="monotone" 
                dataKey="projected" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#colorProjected)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </FinAICard>

      {/* Upcoming Bills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-800 dark:text-slate-100">Upcoming Bills</h3>
          <p className="text-slate-600 dark:text-slate-400">${upcomingTotal} due</p>
        </div>
        
        {upcomingBills.map((bill, index) => (
          <FinAICard key={index} className={`bg-white dark:bg-slate-800 ${bill.paid ? 'opacity-60' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`${bill.paid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-slate-100 dark:bg-slate-700'} w-10 h-10 rounded-xl flex items-center justify-center`}>
                  {bill.paid ? (
                    <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-slate-900 dark:text-slate-100">{bill.name}</p>
                  <p className="text-slate-600 dark:text-slate-400">Due {bill.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-900 dark:text-slate-100">${bill.amount}</p>
                {bill.paid && <p className="text-green-600 dark:text-green-400">Paid</p>}
              </div>
            </div>
          </FinAICard>
        ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-12"
          onClick={() => onNavigate?.('budget')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Adjust Budget
        </Button>
        <Button 
          className="h-12 bg-teal-600 hover:bg-teal-700"
          onClick={() => onNavigate?.('add-expense')}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>
    </div>
  );
}
