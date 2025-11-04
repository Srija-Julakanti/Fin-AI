import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import FinAICard from './shared/FinAICard';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export default function LoginScreen({ onLogin, onNavigateToRegister }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Header */}
        <div className="text-center space-y-3">
          <div className="bg-white dark:bg-slate-800 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-10 h-10 text-teal-600" />
          </div>
          <div>
            <h1 className="text-white text-3xl">Welcome to Fin-AI</h1>
            <p className="text-white/80 mt-2">Your AI Personal Finance Assistant</p>
          </div>
        </div>

        {/* Login Form */}
        <FinAICard className="bg-white dark:bg-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-slate-200">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-slate-200">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <button type="button" className="text-sm text-teal-600 dark:text-teal-400 hover:underline">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </FinAICard>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-white/90">
            Do not have an account?{' '}
            <button
              onClick={onNavigateToRegister}
              className="text-white hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>

        {/* Features */}
        <FinAICard className="bg-white/10 backdrop-blur-sm border-2 border-white/20">
          <div className="space-y-2 text-white">
            <p className="text-sm opacity-90">✓ Bank-level encryption</p>
            <p className="text-sm opacity-90">✓ AI-powered insights</p>
            <p className="text-sm opacity-90">✓ Smart budget tracking</p>
            <p className="text-sm opacity-90">✓ Family finance management</p>
          </div>
        </FinAICard>
      </div>
    </div>
  );
}
