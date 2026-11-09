import React, { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GameScore, Difficulty } from '../types';
import { DIFFICULTY_CONFIGS } from './DifficultySelector';
import { useAuth } from '../context/AuthContext';
import { SupabaseErrorBox } from './SupabaseErrorBox';
import { Trophy, Medal, RefreshCw, Sparkles, Zap, Flame, User, Clock, AlertCircle } from 'lucide-react';
import { sounds } from '../lib/sound';

export const LeaderboardView: React.FC = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<GameScore[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Difficulty | 'all'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setSupabaseError(null);

    try {
      let query = supabase
        .from('game_scores')
        .select('id, user_id, player_name, difficulty, attempts, created_at')
        .order('attempts', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(50);

      if (selectedFilter !== 'all') {
        query = query.eq('difficulty', selectedFilter);
      }

      const { data, error } = await query;

      if (error) {
        setSupabaseError(error.message);
        setScores([]);
      } else {
        setScores((data as GameScore[]) || []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSupabaseError(msg);
      setScores([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 text-[#241a3a] flex items-center justify-center font-black text-xs shadow-[0_0_12px_rgba(251,191,36,0.6)]">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-slate-200 to-gray-300 text-[#241a3a] flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgba(226,232,240,0.5)]">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-orange-400 text-white flex items-center justify-center font-black text-xs shadow-[0_0_10px_rgba(245,158,11,0.4)]">
          3
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-[#2a1752] text-[#debec8] flex items-center justify-center font-bold text-xs">
        {rank}
      </div>
    );
  };

  const getDifficultyIcon = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return <Sparkles className="w-3 h-3 text-[#4cd7f6]" />;
      case 'medium':
        return <Zap className="w-3 h-3 text-[#ffb0cd]" />;
      case 'hard':
        return <Flame className="w-3 h-3 text-[#ddb8ff]" />;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-12 animate-in fade-in duration-200">
      {/* Page Title Card */}
      <div className="rounded-2xl bg-[#211340] border border-[#a68992]/20 p-4 mb-4 shadow-[0_8px_24px_rgba(10,4,20,0.6)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#06b6d4] to-[#3b82f6] flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-display tracking-tight leading-none">
                Hall of Fame
              </h2>
              <p className="text-xs text-[#debec8] mt-1">
                Fewest attempts wins the highest rank
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              fetchScores();
            }}
            disabled={loading}
            title="Refresh Leaderboard"
            className="p-2 rounded-xl bg-[#2a1752] border border-[#c084fc]/30 text-[#eaddff] hover:text-white hover:bg-[#3a206b] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-4 p-1 rounded-xl bg-[#180d2d] border border-[#a68992]/15">
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedFilter('all');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#c084fc] text-[#241a3a] shadow-[0_0_10px_rgba(192,132,252,0.5)]'
                : 'text-[#debec8] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedFilter('easy');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'easy'
                ? 'bg-[#4cd7f6] text-[#003640] shadow-[0_0_10px_rgba(76,215,246,0.5)]'
                : 'text-[#debec8] hover:text-white'
            }`}
          >
            Easy (1-50)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedFilter('medium');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'medium'
                ? 'bg-[#ffb0cd] text-[#640039] shadow-[0_0_10px_rgba(255,176,205,0.5)]'
                : 'text-[#debec8] hover:text-white'
            }`}
          >
            Med (1-100)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSelectedFilter('hard');
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
              selectedFilter === 'hard'
                ? 'bg-[#ddb8ff] text-[#490081] shadow-[0_0_10px_rgba(221,184,255,0.5)]'
                : 'text-[#debec8] hover:text-white'
            }`}
          >
            Hard (1-500)
          </button>
        </div>
      </div>

      {/* Supabase Error Display (Red error box strictly for real Supabase errors) */}
      {supabaseError && (
        <div className="mb-4">
          <SupabaseErrorBox
            error={supabaseError}
            contextTitle="Supabase Leaderboard Error"
            onRetry={fetchScores}
            onDismiss={() => setSupabaseError(null)}
          />
        </div>
      )}

      {/* Not Configured Warning */}
      {!isSupabaseConfigured && (
        <div className="p-4 mb-4 rounded-2xl bg-[#241a3a] border border-[#ffb0cd]/30 text-center">
          <AlertCircle className="w-8 h-8 text-[#ffb0cd] mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white font-display mb-1">
            Supabase Credentials Needed
          </h3>
          <p className="text-xs text-[#debec8] leading-relaxed">
            Provide <code className="text-[#4cd7f6]">VITE_SUPABASE_URL</code> and{' '}
            <code className="text-[#4cd7f6]">VITE_SUPABASE_PUBLISHABLE_KEY</code> in your environment to load live database scores.
          </p>
        </div>
      )}

      {/* Scores List */}
      <div className="rounded-2xl bg-[#211340] border border-[#a68992]/20 overflow-hidden shadow-[0_8px_24px_rgba(10,4,20,0.6)]">
        {loading ? (
          <div className="py-16 text-center text-[#debec8]">
            <div className="w-8 h-8 border-3 border-[#ec4899] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold tracking-wide uppercase font-display">
              Loading High Scores...
            </p>
          </div>
        ) : scores.length === 0 ? (
          <div className="py-14 text-center px-4">
            <Medal className="w-12 h-12 text-[#a68992]/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white font-display">
              No Scores Yet
            </h3>
            <p className="text-xs text-[#debec8] mt-1 max-w-xs mx-auto">
              Be the first legend on the leaderboard by winning a game!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#a68992]/10">
            {scores.map((score, index) => {
              const rank = index + 1;
              const isCurrentUser = user && user.id === score.user_id;
              const config = DIFFICULTY_CONFIGS[score.difficulty];

              return (
                <div
                  key={score.id || `${score.user_id}-${index}`}
                  className={`flex items-center gap-3 p-3.5 transition-colors ${
                    isCurrentUser
                      ? 'bg-[#ec4899]/10 border-l-4 border-l-[#ec4899]'
                      : 'hover:bg-[#2a1752]/50'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0">{getRankBadge(rank)}</div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate font-display">
                        {score.player_name || 'Anonymous Player'}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#ec4899]/30 text-[#ffb0cd] border border-[#ec4899]/50">
                          You
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#debec8]/80">
                      <span className="flex items-center gap-1 capitalize">
                        {getDifficultyIcon(score.difficulty)}
                        {config?.label || score.difficulty}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(score.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Attempts Pill */}
                  <div className="text-right flex-shrink-0">
                    <div className="inline-flex items-baseline gap-1 px-3 py-1 rounded-xl bg-[#180d2d] border border-[#c084fc]/30">
                      <span className="text-base font-black text-[#4cd7f6] font-display">
                        {score.attempts}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-[#debec8]">
                        {score.attempts === 1 ? 'try' : 'tries'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
