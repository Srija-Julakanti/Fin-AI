import { useState } from 'react';
import FinAICard from './shared/FinAICard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ArrowLeft, Wallet, Calendar as CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface AddExpenseScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function AddExpenseScreen({ onBack, onSuccess, onClose }: AddExpenseScreenProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date(),
    paymentMethod: 'cash',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Groceries',
    'Transportation',
    'Bills & Utilities',
    'Dining Out',
    'Healthcare',
    'Shopping',
    'Entertainment',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess && onSuccess();
    }, 1000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="dark:text-slate-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-slate-800 dark:text-slate-100">Add Expense</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your cash and other expenses</p>
        </div>
      </div>

      {/* Amount Card */}
      <FinAICard className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
        <div className="text-center space-y-2">
          <Wallet className="w-12 h-12 mx-auto text-white/60" />
          <p className="text-white/80">Amount</p>
          <p className="text-5xl">
            ${formData.amount || '0.00'}
          </p>
        </div>
      </FinAICard>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FinAICard className="bg-white dark:bg-slate-800">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="dark:text-slate-200">Amount</Label>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 dark:text-slate-400 text-xl">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="dark:text-slate-200">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase().replace(/\s/g, '-')}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="dark:text-slate-200">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                required
              >
                <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="debit">Debit Card</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-200">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(formData.date)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-slate-700 dark:border-slate-600">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="dark:text-slate-200">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a note about this expense..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 resize-none"
                rows={3}
              />
            </div>
          </div>
        </FinAICard>

        {/* Submit Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 dark:border-slate-600 dark:text-slate-300"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-12 bg-teal-600 hover:bg-teal-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </div>
  );
}
