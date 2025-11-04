import { ReactNode } from 'react';

interface FinAICardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function FinAICard({ children, className = '', onClick }: FinAICardProps) {
  return (
    <div 
      className={`p-5 rounded-2xl shadow-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
