import { Button } from './ui/button';
import FinAICard from './shared/FinAICard';
import { Badge } from './ui/badge';
import { CreditCard, Sparkles, Calendar, TrendingUp, Plus } from 'lucide-react';

interface CreditCardOptimizerProps {
  onNavigate?: (screen: string) => void;
}

export default function CreditCardOptimizer({ onNavigate }: CreditCardOptimizerProps) {
  const cards = [
    {
      name: 'Chase Sapphire',
      lastFour: '4523',
      rewards: 42.50,
      nextPayment: 'Nov 15',
      color: 'from-blue-600 to-blue-800',
      recommendation: 'Best for travel & dining',
    },
    {
      name: 'AmEx Gold',
      lastFour: '8392',
      rewards: 38.20,
      nextPayment: 'Nov 20',
      color: 'from-amber-400 to-amber-600',
      recommendation: 'Best for groceries',
    },
    {
      name: 'Chase Freedom',
      lastFour: '1847',
      rewards: 46.80,
      nextPayment: 'Nov 8',
      color: 'from-slate-700 to-slate-900',
      recommendation: 'Best for rotating categories',
    },
  ];

  const totalRewards = cards.reduce((sum, card) => sum + card.rewards, 0);

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-slate-800 dark:text-slate-100">Credit Cards</h1>
        <p className="text-slate-600 dark:text-slate-400">Optimize your rewards</p>
      </div>

      {/* Total Rewards */}
      <FinAICard className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="space-y-2">
          <p className="text-white/80">Total Rewards Available</p>
          <p className="text-4xl">${totalRewards.toFixed(2)}</p>
          <div className="flex items-center gap-2 text-white/90">
            <TrendingUp className="w-4 h-4" />
            <span>+$12.40 this month</span>
          </div>
        </div>
      </FinAICard>

      {/* AI Recommendation */}
      <FinAICard className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full mt-1">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-slate-900">Smart Recommendation</p>
            <p className="text-slate-600">Use Chase Freedom for your next grocery purchase to earn 5% cashback (ends this quarter).</p>
            <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
              Learn More
            </Button>
          </div>
        </div>
      </FinAICard>

      {/* Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-800 dark:text-slate-100">Your Cards</h3>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onNavigate?.('add-card')}
            className="dark:border-slate-600 dark:text-slate-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        </div>
        {cards.map((card, index) => (
          <FinAICard key={index} className="bg-white dark:bg-slate-800 overflow-hidden">
            <div className={`bg-gradient-to-br ${card.color} text-white p-4 rounded-xl mb-3`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-white/80">{card.name}</p>
                  <p className="text-2xl">•••• {card.lastFour}</p>
                </div>
                <CreditCard className="w-8 h-8 text-white/80" />
              </div>
              <Badge className="bg-white/20 text-white border-0">
                {card.recommendation}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 dark:text-slate-400">Rewards Available</p>
                <p className="text-slate-900 dark:text-slate-100 text-xl">${card.rewards.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <p>Due {card.nextPayment}</p>
                </div>
                <Button size="sm" variant="ghost" className="text-teal-600 dark:text-teal-400 mt-1">
                  Pay Now
                </Button>
              </div>
            </div>
          </FinAICard>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="space-y-3">
        <h3 className="text-slate-800 dark:text-slate-100">Best Cards by Category</h3>
        <FinAICard className="bg-white dark:bg-slate-800">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">Groceries</p>
              <p className="text-slate-900 dark:text-slate-100">Chase Freedom - 5% back</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">Dining</p>
              <p className="text-slate-900 dark:text-slate-100">Chase Sapphire - 3% back</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">Gas</p>
              <p className="text-slate-900 dark:text-slate-100">Chase Freedom - 5% back</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-600 dark:text-slate-400">Travel</p>
              <p className="text-slate-900 dark:text-slate-100">Chase Sapphire - 3% back</p>
            </div>
          </div>
        </FinAICard>
      </div>
    </div>
  );
}
