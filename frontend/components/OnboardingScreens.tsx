import { useState } from 'react';
import { Button } from './ui/button';
import { Sparkles, Shield, TrendingUp, CreditCard, Bell } from 'lucide-react';

interface OnboardingScreensProps {
  onComplete: () => void;
}

export default function OnboardingScreens({ onComplete }: OnboardingScreensProps) {
  const [step, setStep] = useState(0);

  const screens = [
    {
      icon: <Sparkles className="w-20 h-20 text-teal-500" />,
      title: 'Welcome to Fin-AI',
      description: 'Your intelligent personal finance assistant. Manage money smarter with AI-powered insights.',
    },
    {
      icon: <Shield className="w-20 h-20 text-blue-500" />,
      title: 'Connect Securely',
      description: 'Link your bank accounts with bank-level encryption. Your data stays private and secure.',
    },
    {
      icon: <TrendingUp className="w-20 h-20 text-emerald-500" />,
      title: 'Save More Money',
      description: 'Get personalized recommendations to optimize subscriptions and maximize credit card rewards.',
    },
    {
      icon: <Bell className="w-20 h-20 text-amber-500" />,
      title: 'Stay Protected',
      description: 'Real-time fraud alerts and balance forecasts keep you in control of your finances.',
    },
  ];

  const handleNext = () => {
    if (step < screens.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentScreen = screens[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-blue-500 to-indigo-500 flex flex-col items-center justify-between p-8">
      {/* Progress Indicators */}
      <div className="flex gap-2 mt-8">
        {screens.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === step ? 'w-8 bg-white' : 'w-4 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-8 mb-4">
          {currentScreen.icon}
        </div>
        <h1 className="text-white text-3xl max-w-xs">
          {currentScreen.title}
        </h1>
        <p className="text-white/90 text-lg max-w-sm">
          {currentScreen.description}
        </p>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-sm space-y-3">
        <Button
          onClick={handleNext}
          className="w-full bg-white text-teal-600 hover:bg-white/90 h-12 rounded-2xl"
        >
          {step < screens.length - 1 ? 'Continue' : 'Get Started'}
        </Button>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-white/80 hover:text-white"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
