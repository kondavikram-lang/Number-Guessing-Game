import React from 'react';
import { Difficulty, DifficultyConfig } from '../types';
import { Sparkles, Zap, Flame } from 'lucide-react';
import { sounds } from '../lib/sound';

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: 'easy',
    label: 'Easy',
    min: 1,
    max: 50,
    maxTries: 10,
    badgeColor: 'text-[#4cd7f6] bg-[#003640]/40 border-[#06b6d4]/40',
    glowColor: 'glow-cyan',
  },
  medium: {
    name: 'medium',
    label: 'Medium',
    min: 1,
    max: 100,
    maxTries: 7,
    badgeColor: 'text-[#ffb0cd] bg-[#640039]/40 border-[#ec4899]/40',
    glowColor: 'glow-magenta',
  },
  hard: {
    name: 'hard',
    label: 'Hard',
    min: 1,
    max: 500,
    maxTries: 9,
    badgeColor: 'text-[#ddb8ff] bg-[#490081]/40 border-[#c084fc]/40',
    glowColor: 'glow-purple',
  },
};

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
  disabled = false,
}) => {
  const getIcon = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy':
        return <Sparkles className="w-4 h-4 text-[#4cd7f6]" />;
      case 'medium':
        return <Zap className="w-4 h-4 text-[#ffb0cd]" />;
      case 'hard':
        return <Flame className="w-4 h-4 text-[#ddb8ff]" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#debec8] font-display">
          Select Difficulty
        </span>
        <span className="text-[11px] text-[#eaddff]/60">
          Range &amp; Tries
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(DIFFICULTY_CONFIGS) as Difficulty[]).map((diff) => {
          const config = DIFFICULTY_CONFIGS[diff];
          const isSelected = currentDifficulty === diff;

          return (
            <button
              key={diff}
              type="button"
              disabled={disabled}
              onClick={() => {
                sounds.playClick();
                onSelectDifficulty(diff);
              }}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? `bg-[#241a3a] border-[#ffb0cd] shadow-[0_0_16px_rgba(236,72,153,0.35)] scale-[1.02]`
                  : 'bg-[#201536]/80 border-[#a68992]/20 hover:border-[#a68992]/40 hover:bg-[#241a3a]/70 text-[#eaddff]/80'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {getIcon(diff)}
                <span className="text-xs font-bold font-display uppercase tracking-wider text-white">
                  {config.label}
                </span>
              </div>

              <div className="text-[11px] font-semibold text-[#eaddff]">
                {config.min}–{config.max}
              </div>

              <div className="text-[10px] text-[#debec8]/80 mt-0.5">
                {config.maxTries} tries
              </div>

              {isSelected && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ec4899] shadow-[0_0_8px_#ec4899]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
