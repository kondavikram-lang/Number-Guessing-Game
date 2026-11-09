import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GentleValidation } from './GentleValidation';
import { SupabaseErrorBox } from './SupabaseErrorBox';
import { User, Mail, Lock, Sparkles, LogOut, Gamepad2, ArrowRight } from 'lucide-react';
import { sounds } from '../lib/sound';

interface AuthViewProps {
  onSuccessRedirect?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccessRedirect }) => {
  const { user, playerName, signIn, signUp, signOut, supabaseError, clearSupabaseError } = useAuth();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [gentleValidation, setGentleValidation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const validateInputs = (): boolean => {
    setGentleValidation(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setGentleValidation('Please enter your email address to continue.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setGentleValidation('Please enter a valid email address (e.g., player@example.com).');
      return false;
    }

    if (!password) {
      setGentleValidation('Please enter your password.');
      return false;
    }

    if (password.length < 6) {
      setGentleValidation('Password must be at least 6 characters.');
      return false;
    }

    if (isSignUp && !nickname.trim()) {
      setGentleValidation('Please enter a nickname or player name for the leaderboard.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearSupabaseError();

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    sounds.playClick();

    if (isSignUp) {
      const res = await signUp(email.trim(), password, nickname.trim());
      setLoading(false);
      if (res.success && onSuccessRedirect) {
        onSuccessRedirect();
      }
    } else {
      const res = await signIn(email.trim(), password);
      setLoading(false);
      if (res.success && onSuccessRedirect) {
        onSuccessRedirect();
      }
    }
  };

  // If user is already logged in, show profile card
  if (user) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 pb-12 animate-in fade-in duration-200">
        <div className="rounded-3xl bg-[#211340] border border-[#a68992]/20 p-6 shadow-[0_8px_24px_rgba(10,4,20,0.6)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#ec4899] to-[#c084fc] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
            <User className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-black text-white font-display">
            Welcome, {playerName || 'Player'}!
          </h2>
          <p className="text-xs text-[#debec8] mt-1 font-mono">
            {user.email}
          </p>

          <div className="my-6 p-4 rounded-2xl bg-[#180d2d] border border-[#c084fc]/20 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#debec8] block mb-1">
              Account Status
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
                Supabase Connected
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#c084fc]/20 text-[#ddb8ff]">
                Ready to Record Scores
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {onSuccessRedirect && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onSuccessRedirect();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#ec4899] to-[#d946ef] text-white font-bold font-display tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:brightness-110 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Jump Into Game</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                sounds.playClick();
                signOut();
              }}
              className="w-full py-3 px-4 rounded-full bg-[#180d2d] border border-[#f43f5e]/30 text-[#ffb4ab] hover:bg-[#f43f5e]/15 font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-12 animate-in fade-in duration-200">
      <div className="rounded-3xl bg-[#211340] border border-[#a68992]/20 p-6 shadow-[0_8px_24px_rgba(10,4,20,0.6)]">
        {/* Header Tabs */}
        <div className="flex items-center justify-center gap-2 p-1 rounded-2xl bg-[#180d2d] border border-[#a68992]/15 mb-6">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsSignUp(false);
              setGentleValidation(null);
              clearSupabaseError();
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
              !isSignUp
                ? 'bg-gradient-to-r from-[#ec4899] to-[#d946ef] text-white shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                : 'text-[#debec8] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsSignUp(true);
              setGentleValidation(null);
              clearSupabaseError();
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
              isSignUp
                ? 'bg-gradient-to-r from-[#ec4899] to-[#d946ef] text-white shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                : 'text-[#debec8] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-white font-display">
            {isSignUp ? 'Join the Arcade' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#debec8] mt-1">
            {isSignUp
              ? 'Create your player profile to claim a spot on the leaderboard'
              : 'Sign in with your email and password to track your high scores'}
          </p>
        </div>

        {/* Gentle Validation Message (Soft banner for user input checks, not red) */}
        {gentleValidation && (
          <div className="mb-4">
            <GentleValidation message={gentleValidation} />
          </div>
        )}

        {/* Red Error Box strictly for real Supabase errors */}
        {supabaseError && (
          <div className="mb-4">
            <SupabaseErrorBox
              error={supabaseError}
              contextTitle="Supabase Auth Error"
              onDismiss={clearSupabaseError}
            />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-[#debec8] uppercase tracking-wider mb-1.5 font-display">
                Player Nickname
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c084fc]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    if (gentleValidation) setGentleValidation(null);
                  }}
                  placeholder="e.g., PixelMaster"
                  maxLength={25}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#180d2d] border border-[#a68992]/30 text-white placeholder-[#a68992]/50 text-sm focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#debec8] uppercase tracking-wider mb-1.5 font-display">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c084fc]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (gentleValidation) setGentleValidation(null);
                }}
                placeholder="player@example.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#180d2d] border border-[#a68992]/30 text-white placeholder-[#a68992]/50 text-sm focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#debec8] uppercase tracking-wider mb-1.5 font-display">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#c084fc]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (gentleValidation) setGentleValidation(null);
                }}
                placeholder="••••••••"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#180d2d] border border-[#a68992]/30 text-white placeholder-[#a68992]/50 text-sm focus:outline-none focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#ec4899] to-[#d946ef] text-white font-bold font-display tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.45)] hover:brightness-110 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Contacting Supabase...</span>
              </div>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Sign In to Play'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
