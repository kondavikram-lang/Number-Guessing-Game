import React from 'react';
import { Info } from 'lucide-react';

interface GentleValidationProps {
  message: string | null;
  className?: string;
}

export const GentleValidation: React.FC<GentleValidationProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#241a3a] border border-[#c084fc]/30 text-[#eaddff] text-sm shadow-sm transition-all duration-200 animate-in fade-in-50 slide-in-from-top-1 ${className}`}
    >
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#c084fc]/15 flex items-center justify-center text-[#c084fc]">
        <Info className="w-3.5 h-3.5" />
      </div>
      <p className="text-xs sm:text-sm font-medium text-[#eaddff]/90 leading-tight">
        {message}
      </p>
    </div>
  );
};
