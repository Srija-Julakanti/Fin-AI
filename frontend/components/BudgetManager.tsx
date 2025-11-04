import { useState } from 'react';
import FinAICard from './shared/FinAICard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { 
  Wallet, 
  ShoppingCart, 
  Car, 
  Home, 
  Smartphone, 
  Coffee,
  Heart,
  MoreHorizontal,
  Edit,
  Plus,
  Settings
} from 'lucide-react';

interface BudgetManagerProps {
  onNavigate?: (screen: string) => void;
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface Budget {
  id: string;
  category: string;
  icon: any;
  color: string;
  budget: number;
  spent: number;
}

export default function BudgetManager({ onNavigate }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      category: 'Groceries',
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-600',
      budget: 600,
      spent: 387,
    },
    {
      id: '2',
      category: 'Transportation',
      icon: Car,
      color: 'from-blue-500 to-cyan-600',
      budget: 300,
      spent: 245,
    },
    {
      id: '3',
      category: 'Bills & Utilities',
      icon: Home,
      color: 'from-orange-500 to-amber-600',
      budget: 800,
      spent: 634,
    },
    {
      id: '4',
      category: 'Subscriptions',
      icon: Smartphone,
      color: 'from-purple-500 to-violet-600',
      budget: 150,
      spent: 143,
    },
    {
      id: '5',
      category: 'Dining Out',
      icon: Coffee,
      color: 'from-pink-500 to-rose-600',
      budget: 200,
      spent: 178,
    },
    {
      id: '6',
      category: 'Healthcare',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      budget: 250,
      spent: 92,
    },
    {
      id: '7',
      category: 'Other',
      icon: MoreHorizontal,
      color: 'from-slate-500 to-gray-600',
      budget: 400,
      spent: 234,
    },
  ]);

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalBudget = budgets.reduce((sum, b) => sum + b.budget, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setNewBudgetAmount(budget.budget.toString());
    setIsDialogOpen(true);
  };

  const handleSaveBudget = () => {
    if (editingBudget && newBudgetAmount) {
      setBudgets(budgets.map(b => 
        b.id === editingBudget.id 
          ? { ...b, budget: parseFloat(newBudgetAmount) }
          : b
      ));
      setIsDialogOpen(false);
      setEditingBudget(null);
      setNewBudgetAmount('');
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-slate-800 dark:text-slate-100">Budget Manager</h1>
        <p className="text-slate-600 dark:text-slate-400">Track and manage your spending</p>
      </div>

      {/* Total Budget Overview */}
      <FinAICard className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80">Monthly Budget</p>
              <p className="text-4xl">${totalBudget.toLocaleString()}</p>
            </div>
            <Wallet className="w-12 h-12 text-white/60" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/90">Spent: ${totalSpent.toLocaleString()}</span>
              <span className="text-white/90">Remaining: ${remainingBudget.toLocaleString()}</span>
            </div>
            <Progress value={(totalSpent / totalBudget) * 100} className="h-2 bg-white/20" />
          </div>
        </div>
      </FinAICard>

      {/* Category Budgets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-800 dark:text-slate-100">Categories</h3>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onNavigate?.('create-budget')}
            className="dark:border-slate-600 dark:text-slate-300"
          >
            <Settings className="w-4 h-4 mr-2" />
            Modify Budget
          </Button>
        </div>

        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.budget) * 100;
          const isOverBudget = percentage > 100;
          const Icon = budget.icon;

          return (
            <FinAICard key={budget.id} className="bg-white dark:bg-slate-800">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`bg-gradient-to-br ${budget.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-slate-100">{budget.category}</p>
                      <p className="text-slate-600 dark:text-slate-400">
                        ${budget.spent} of ${budget.budget}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditBudget(budget)}
                    className="text-teal-600 dark:text-teal-400"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${isOverBudget ? 'bg-red-100' : ''}`}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className={isOverBudget ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}>
                      {percentage.toFixed(0)}% used
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      ${(budget.budget - budget.spent).toFixed(0)} left
                    </span>
                  </div>
                </div>
              </div>
            </FinAICard>
          );
        })}
      </div>

      {/* Edit Budget Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="dark:text-slate-100">Edit Budget</DialogTitle>
            <DialogDescription className="dark:text-slate-400">
              Update your monthly budget for {editingBudget?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="budget-amount" className="dark:text-slate-200">Monthly Budget</Label>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400">$</span>
                <Input
                  id="budget-amount"
                  type="number"
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 dark:border-slate-600 dark:text-slate-300"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                onClick={handleSaveBudget}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
