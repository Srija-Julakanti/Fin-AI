import { Button } from './ui/button';
import FinAICard from './shared/FinAICard';
import { Sparkles, TrendingUp, Calendar, CreditCard, Repeat, ChevronRight, MessageCircle, Plus, Wallet } from 'lucide-react';

interface HomeDashboardProps {
  onNavigate: (screen: any) => void;
}

export default function HomeDashboard({ onNavigate }: HomeDashboardProps) {
  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-slate-800 dark:text-slate-100">Good morning, Alex</h1>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate('add-expense')}
            className="dark:border-slate-600 dark:text-slate-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-4 rounded-2xl flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles className="w-5 h-5" />
          </div>
          <p>You saved $40 this week!</p>
        </div>
      </div>

      {/* Total Balance Card */}
      <FinAICard className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="space-y-2">
          <p className="text-white/70">Total Balance</p>
          <h2 className="text-white text-4xl">$12,847.52</h2>
          <div className="flex items-center gap-2 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>+2.4% this month</span>
          </div>
        </div>
      </FinAICard>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <FinAICard 
          className="bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onNavigate('budget')}
        >
          <div className="space-y-2">
            <div className="bg-teal-100 dark:bg-teal-900/30 w-10 h-10 rounded-xl flex items-center justify-center">
              <Wallet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400">Budget Left</p>
            <p className="text-slate-900 dark:text-slate-100 text-2xl">$1,179</p>
          </div>
        </FinAICard>

        <FinAICard 
          className="bg-white dark:bg-slate-800 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onNavigate('forecast')}
        >
          <div className="space-y-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-10 h-10 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400">This Month</p>
            <p className="text-slate-900 dark:text-slate-100 text-2xl">$1,821</p>
          </div>
        </FinAICard>
      </div>

      {/* Credit Card Rewards */}
      <FinAICard 
        className="bg-gradient-to-br from-amber-400 to-orange-500 text-white cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => onNavigate('cards')}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-white/90">Credit Card Rewards</p>
            <p className="text-2xl">$127</p>
            <p className="text-white/80">Available to redeem</p>
          </div>
          <CreditCard className="w-12 h-12 text-white/80" />
        </div>
      </FinAICard>

      {/* Recent Insights */}
      <div className="space-y-3">
        <h3 className="text-slate-800 dark:text-slate-100">AI Insights</h3>
        
        <FinAICard className="bg-white dark:bg-slate-800 border-l-4 border-teal-500">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-slate-900 dark:text-slate-100">Unused Subscription Detected</p>
              <p className="text-slate-600 dark:text-slate-400">You have not used HBO Max in 60 days</p>
            </div>
            <Button size="sm" variant="ghost" className="text-teal-600 dark:text-teal-400">
              Review
            </Button>
          </div>
        </FinAICard>

        <FinAICard className="bg-white dark:bg-slate-800 border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-slate-900 dark:text-slate-100">Better Card for Groceries</p>
              <p className="text-slate-600 dark:text-slate-400">Use Chase Freedom for 5% cashback</p>
            </div>
            <Button size="sm" variant="ghost" className="text-blue-600 dark:text-blue-400">
              View
            </Button>
          </div>
        </FinAICard>
      </div>

      {/* Floating AI Assistant Button */}
      <Button className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg">
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
}
