import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';

interface SupabaseErrorBoxProps {
  error: string | null;
  onDismiss?: () => void;
  onRetry?: () => void;
  className?: string;
  contextTitle?: string;
}

export const SupabaseErrorBox: React.FC<SupabaseErrorBoxProps> = ({
  error,
  onDismiss,
  onRetry,
  className = '',
  contextTitle = 'Supabase Error',
}) => {
  if (!error) return null;

  return (
    <div
      role="alert"
      className={`rounded-2xl bg-[#2e0c15] border-2 border-[#f43f5e] p-4 text-[#ffdad6] shadow-[0_0_22px_rgba(244,63,94,0.35)] transition-all animate-in fade-in zoom-in-95 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#f43f5e]/20 border border-[#f43f5e]/40 flex items-center justify-center text-[#f43f5e]">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#f43f5e]/25 text-[#ff8da1] border border-[#f43f5e]/40 font-display">
              {contextTitle}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-mono text-[#ffdad6] break-words whitespace-pre-wrap leading-relaxed">
            {error}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f43f5e]/20 hover:bg-[#f43f5e]/30 text-[#ffb4ab] text-xs font-semibold transition-colors border border-[#f43f5e]/30 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="flex-shrink-0 p-1 text-[#ffb4ab]/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
