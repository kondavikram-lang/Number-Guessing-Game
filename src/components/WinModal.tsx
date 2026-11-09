import React, { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { Difficulty, DifficultyConfig } from '../types';
import { DIFFICULTY_CONFIGS } from './DifficultySelector';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { SupabaseErrorBox } from './SupabaseErrorBox';
import { sounds } from '../lib/sound';

interface WinModalProps {
  isOpen: boolean;
  secretNumber: number;
  attemptsUsed: number;
  difficulty: Difficulty;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  onOpenAuth: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  secretNumber,
  attemptsUsed,
  difficulty,
  onPlayAgain,
  onViewLeaderboard,
  onOpenAuth,
}) => {
  const { user, playerName } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const config: DifficultyConfig = DIFFICULTY_CONFIGS[difficulty];

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffb0cd', '#4cd7f6', '#ddb8ff', '#10b981', '#f751a1'],
      });
    } catch {}
  };

  const handleSaveScore = useCallback(async () => {
    if (!user || !supabase) return;

    setSaving(true);
    setSaveError(null);

    try {
      const activeName = (playerName && playerName.trim()) || user.email?.split('@')[0] || 'Player';
      const { error } = await supabase.from('game_scores').insert({
        user_id: user.id,
        player_name: activeName,
        difficulty: difficulty,
        attempts: attemptsUsed,
        created_at: new Date().toISOString(),
      });

      if (error) {
        setSaveError(error.message);
        setSaveSuccess(false);
      } else {
        setSaveSuccess(true);
        setSaveError(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSaveError(msg);
      setSaveSuccess(false);
    } finally {
      setSaving(false);
    }
  }, [user, playerName, difficulty, attemptsUsed]);

  useEffect(() => {
    if (isOpen) {
      sounds.playWin();
      fireConfetti();
      setSaveSuccess(false);
      setSaveError(null);

      // If user is already logged in, save score automatically
      if (user && supabase) {
        handleSaveScore();
      }
    }
  }, [isOpen, user, handleSaveScore]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#211340] border-2 border-[#ffb0cd]/40 p-6 shadow-[0_0_35px_rgba(236,72,153,0.35)] text-center animate-in zoom-in-95 duration-200">
        {/* Glow halo */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-[#ec4899] to-[#c084fc] flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.6)]">
          <Trophy className="w-12 h-12 text-white animate-bounce" />
        </div>

        <div className="mt-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold font-display uppercase tracking-wider bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 mb-2">
            Victory! You Guessed It
          </span>

          <h2 className="text-3xl font-extrabold text-white font-display">
            The Number Was{' '}
            <span className="text-[#4cd7f6] drop-shadow-[0_0_12px_rgba(76,215,246,0.6)]">
              {secretNumber}
            </span>
          </h2>

          <div className="my-5 p-4 rounded-2xl bg-[#180d2d] border border-[#c084fc]/20 flex items-center justify-around">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#debec8] font-semibold">
                Attempts
              </p>
              <p className="text-2xl font-black text-white font-display">
                {attemptsUsed}{' '}
                <span className="text-xs font-normal text-[#debec8]">
                  / {config.maxTries}
                </span>
              </p>
            </div>

            <div className="w-[1px] h-8 bg-[#3a2f50]" />

            <div>
              <p className="text-[11px] uppercase tracking-wider text-[#debec8] font-semibold">
                Difficulty
              </p>
              <p className="text-base font-bold text-[#ffb0cd] font-display capitalize">
                {config.label}
              </p>
            </div>
          </div>

          {/* Real Supabase Error Box on failure */}
          {saveError && (
            <div className="mb-4 text-left">
              <SupabaseErrorBox
                error={saveError}
                contextTitle="Score Save Error"
                onRetry={handleSaveScore}
                onDismiss={() => setSaveError(null)}
              />
            </div>
          )}

          {/* Score save state */}
          {user ? (
            <div className="mb-5">
              {saving ? (
                <div className="flex items-center justify-center gap-2 text-xs text-[#ddb8ff] animate-pulse">
                  <div className="w-3.5 h-3.5 border-2 border-[#ddb8ff] border-t-transparent rounded-full animate-spin" />
                  Saving score to Supabase leaderboard...
                </div>
              ) : saveSuccess ? (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#10b981] bg-[#10b981]/10 py-2 px-3 rounded-xl border border-[#10b981]/30">
                  <CheckCircle2 className="w-4 h-4" />
                  Score recorded to global leaderboard!
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mb-5 p-3 rounded-xl bg-[#2a1752] border border-[#c084fc]/30 text-left">
              <div className="flex items-center gap-2 mb-1 text-xs font-bold text-[#eaddff]">
                <Lock className="w-3.5 h-3.5 text-[#ffb0cd]" />
                Leaderboard Recording
              </div>
              <p className="text-[11px] text-[#debec8] leading-tight mb-2">
                Sign in to save your score of {attemptsUsed} attempts to the global leaderboard!
              </p>
              <button
                onClick={onOpenAuth}
                className="w-full py-1.5 px-3 rounded-lg bg-[#62259b] hover:bg-[#7b32c0] text-xs font-bold text-white transition-colors cursor-pointer"
              >
                Sign In to Save
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                sounds.playClick();
                onPlayAgain();
              }}
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#ec4899] to-[#d946ef] text-white font-bold font-display tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:brightness-110 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onViewLeaderboard();
              }}
              className="w-full py-3 px-4 rounded-full bg-[#180d2d] border border-[#4cd7f6]/40 text-[#4cd7f6] hover:bg-[#4cd7f6]/10 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
