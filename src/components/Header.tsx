import React from 'react';
import { ActivePage } from '../types';
import { useAuth } from '../context/AuthContext';
import { Volume2, VolumeX, Trophy, Gamepad2, User, LogOut } from 'lucide-react';
import { sounds } from '../lib/sound';

interface HeaderProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  isMuted,
  onToggleMute,
}) => {
  const { user, playerName, signOut } = useAuth();

  return (
    <header className="w-full max-w-lg mx-auto mb-4 pt-3 px-4">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#a68992]/15">
        {/* Brand */}
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('game');
          }}
          className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ec4899] to-[#c084fc] flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.45)] group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-lg font-display">?</span>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white font-display flex items-center gap-1.5 leading-none">
              GUESS IT
              <span className="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_8px_#06b6d4] inline-block animate-pulse" />
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#debec8] mt-0.5">
              Neon Arcade
            </p>
          </div>
        </button>

        {/* Top Controls: Sound & User profile */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-xl bg-[#211340] border border-[#a68992]/20 hover:border-[#a68992]/40 text-[#debec8] hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#f43f5e]" /> : <Volume2 className="w-4 h-4 text-[#4cd7f6]" />}
          </button>

          {/* User Status / Auth Button */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-2 py-1 pr-1 rounded-xl bg-[#211340] border border-[#c084fc]/30">
              <span className="text-xs font-semibold text-[#eaddff] max-w-[90px] truncate" title={playerName || user.email}>
                {playerName || user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  signOut();
                }}
                title="Sign Out"
                className="p-1 rounded-lg hover:bg-white/10 text-[#debec8] hover:text-[#ffb4ab] transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('auth');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
                activePage === 'auth'
                  ? 'bg-[#ec4899] text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                  : 'bg-[#211340] border border-[#ffb0cd]/30 text-[#ffb0cd] hover:bg-[#ffb0cd]/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Pills */}
      <nav className="flex items-center justify-center gap-2 mt-3 p-1 rounded-2xl bg-[#211340]/90 border border-[#a68992]/20">
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('game');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
            activePage === 'game'
              ? 'bg-gradient-to-r from-[#ec4899] to-[#d946ef] text-white shadow-[0_0_15px_rgba(236,72,153,0.45)]'
              : 'text-[#debec8] hover:text-white hover:bg-[#2a1752]'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Game</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('leaderboard');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
            activePage === 'leaderboard'
              ? 'bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white shadow-[0_0_15px_rgba(6,182,212,0.45)]'
              : 'text-[#debec8] hover:text-white hover:bg-[#2a1752]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Leaderboard</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('auth');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer ${
            activePage === 'auth'
              ? 'bg-gradient-to-r from-[#8b5cf6] to-[#c084fc] text-white shadow-[0_0_15px_rgba(192,132,252,0.45)]'
              : 'text-[#debec8] hover:text-white hover:bg-[#2a1752]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{user ? 'Profile' : 'Sign In'}</span>
        </button>
      </nav>
    </header>
  );
};
