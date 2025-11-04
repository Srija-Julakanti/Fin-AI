import { useState } from 'react';
import FinAICard from './shared/FinAICard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CreditCard, ArrowLeft, Check, User, Users, Phone } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface AddCardScreenProps {
  onBack?: () => void;
  onSuccess?: () => void;
  onClose?: () => void;
}

// Card BIN database for auto-detection
const cardBinDatabase: Record<string, { name: string; type: string }> = {
  '4': { name: 'Visa', type: 'visa' },
  '51': { name: 'Mastercard', type: 'mastercard' },
  '52': { name: 'Mastercard', type: 'mastercard' },
  '53': { name: 'Mastercard', type: 'mastercard' },
  '54': { name: 'Mastercard', type: 'mastercard' },
  '55': { name: 'Mastercard', type: 'mastercard' },
  '34': { name: 'American Express', type: 'amex' },
  '37': { name: 'American Express', type: 'amex' },
  '6011': { name: 'Discover', type: 'discover' },
  '65': { name: 'Discover', type: 'discover' },
};

export default function AddCardScreen({ onBack, onSuccess, onClose }: AddCardScreenProps) {
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardType: '',
    cardHolder: 'self',
    holderName: '',
    phoneNumber: '',
  });

  const [detectedCardInfo, setDetectedCardInfo] = useState<{ name: string; type: string } | null>(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const detectCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    // Check different BIN lengths
    for (let i = 6; i >= 1; i--) {
      const bin = cleaned.substring(0, i);
      if (cardBinDatabase[bin]) {
        return cardBinDatabase[bin];
      }
    }
    
    return null;
  };

  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    const formatted = chunks.join(' ').substr(0, 19);
    
    setFormData({ ...formData, cardNumber: formatted });

    // Auto-detect card type
    const detected = detectCardType(cleaned);
    if (detected) {
      setDetectedCardInfo(detected);
      setFormData(prev => ({ 
        ...prev, 
        cardNumber: formatted,
        cardType: detected.type,
        cardName: prev.cardName || detected.name 
      }));
    }
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending OTP
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpSent(true);
      setShowOtpDialog(true);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setIsVerifying(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      setShowOtpDialog(false);
      onSuccess && onSuccess();
      onClose && onClose();
    }, 1500);
  };

  const handleResendOtp = () => {
    // Simulate resending OTP
    setOtpSent(false);
    setTimeout(() => {
      setOtpSent(true);
    }, 1000);
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
          <h1 className="text-slate-800 dark:text-slate-100">Add Credit Card</h1>
          <p className="text-slate-600 dark:text-slate-400">Link a new card to your account</p>
        </div>
      </div>

      {/* Card Holder Selection */}
      <FinAICard className="bg-white dark:bg-slate-800">
        <div className="space-y-3">
          <Label className="dark:text-slate-200">Card Belongs To</Label>
          <Select
            value={formData.cardHolder}
            onValueChange={(value) => setFormData({ ...formData, cardHolder: value })}
          >
            <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
              <SelectItem value="self">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Self</span>
                </div>
              </SelectItem>
              <SelectItem value="spouse">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Spouse</span>
                </div>
              </SelectItem>
              <SelectItem value="child">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Child</span>
                </div>
              </SelectItem>
              <SelectItem value="other">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Other Family Member</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {formData.cardHolder !== 'self' && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="holderName" className="dark:text-slate-200">Cardholder Name</Label>
              <Input
                id="holderName"
                placeholder="Enter cardholder's name"
                value={formData.holderName}
                onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                required
              />
            </div>
          )}
        </div>
      </FinAICard>

      {/* Card Preview */}
      <FinAICard className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-white/70 text-sm">
                {formData.cardName || (detectedCardInfo?.name) || 'Card Network'}
              </p>
              <p className="text-xl">
                {formData.cardHolder === 'self' ? 'Alex Morgan' : formData.holderName || 'Cardholder Name'}
              </p>
            </div>
            <CreditCard className="w-10 h-10 text-white/60" />
          </div>
          
          <div className="space-y-1">
            <p className="text-white/70 text-sm">Card Number</p>
            <p className="text-2xl tracking-wider">
              {formData.cardNumber || '•••• •••• •••• ••••'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-white/70 text-sm">Expires</p>
              <p>{formData.expiryDate || 'MM/YY'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-white/70 text-sm">CVV</p>
              <p>{'•'.repeat(formData.cvv.length) || '•••'}</p>
            </div>
            {detectedCardInfo && (
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <p className="text-sm">{detectedCardInfo.name}</p>
              </div>
            )}
          </div>
        </div>
      </FinAICard>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FinAICard className="bg-white dark:bg-slate-800">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="dark:text-slate-200">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                maxLength={19}
                required
              />
              {detectedCardInfo && (
                <p className="text-sm text-teal-600 dark:text-teal-400">
                  ✓ {detectedCardInfo.name} card detected
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName" className="dark:text-slate-200">Card Name (Optional)</Label>
              <Input
                id="cardName"
                placeholder={detectedCardInfo?.name || "e.g. Chase Sapphire"}
                value={formData.cardName}
                onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Auto-detected from card number
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate" className="dark:text-slate-200">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    expiryDate: formatExpiryDate(e.target.value) 
                  })}
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  maxLength={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv" className="dark:text-slate-200">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    cvv: e.target.value.replace(/\D/g, '').substr(0, 4) 
                  })}
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="dark:text-slate-200">
                Phone Number for Verification
              </Label>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-400" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  required
                />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                We will send a verification code to confirm card ownership
              </p>
            </div>
          </div>
        </FinAICard>

        {/* Security Notice */}
        <FinAICard className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 p-2 rounded-full mt-1">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-slate-900 dark:text-slate-100">Secure Verification Required</p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                For your security, we will send a verification code to the phone number associated with this card. Your card details are encrypted with bank-level security.
              </p>
            </div>
          </div>
        </FinAICard>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-teal-600 hover:bg-teal-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending Verification Code...' : 'Continue to Verification'}
        </Button>
      </form>

      {/* OTP Verification Dialog */}
      <AlertDialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <AlertDialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-slate-100">Verify Your Card</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400">
              We have sent a 6-digit verification code to {formData.phoneNumber}. Please enter it below to confirm card ownership.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="dark:text-slate-200">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substr(0, 6))}
                className="text-center text-2xl tracking-widest dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                maxLength={6}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Did not receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                >
                  Resend Code
                </button>
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:border-slate-600 dark:text-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVerifyOtp}
              disabled={otpCode.length !== 6 || isVerifying}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Add Card'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
