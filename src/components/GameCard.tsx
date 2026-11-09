import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Difficulty, GuessRecord } from '../types';
import { generateSecretNumber } from '../lib/crypto';
import { DIFFICULTY_CONFIGS, DifficultySelector } from './DifficultySelector';
import { GentleValidation } from './GentleValidation';
import { WinModal } from './WinModal';
import { sounds } from '../lib/sound';
import {
  RotateCcw,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Flame,
  HelpCircle,
  Hash,
  Send,
  Compass,
} from 'lucide-react';

interface GameCardProps {
  onViewLeaderboard: () => void;
  onOpenAuth: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  onViewLeaderboard,
  onOpenAuth,
}) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const config = DIFFICULTY_CONFIGS[difficulty];

  // Game state
  const [secretNumber, setSecretNumber] = useState<number>(() =>
    generateSecretNumber(config.min, config.max)
  );
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [gentleValidation, setGentleValidation] = useState<string | null>(null);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize/reset game on difficulty change or restart
  const resetGame = useCallback((newDifficulty?: Difficulty) => {
    const activeDiff = newDifficulty || difficulty;
    const activeConfig = DIFFICULTY_CONFIGS[activeDiff];
    const newSecret = generateSecretNumber(activeConfig.min, activeConfig.max);

    setSecretNumber(newSecret);
    setGuesses([]);
    setInputValue('');
    setGentleValidation(null);
    setIsWon(false);
    setIsGameOver(false);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [difficulty]);

  const handleDifficultyChange = (newDiff: Difficulty) => {
    if (newDiff !== difficulty) {
      setDifficulty(newDiff);
      resetGame(newDiff);
    }
  };

  // Remaining tries
  const remainingTries = config.maxTries - guesses.length;

  // Narrowed known range based on previous guesses
  const lowGuesses = guesses.filter((g) => g.hint === 'too_low').map((g) => g.guess);
  const highGuesses = guesses.filter((g) => g.hint === 'too_high').map((g) => g.guess);
  const currentMinBound = lowGuesses.length > 0 ? Math.max(...lowGuesses) + 1 : config.min;
  const currentMaxBound = highGuesses.length > 0 ? Math.min(...highGuesses) - 1 : config.max;

  // Last hint
  const lastGuess = guesses.length > 0 ? guesses[guesses.length - 1] : null;

  const handleGuessSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGentleValidation(null);

    if (isWon || isGameOver) {
      resetGame();
      return;
    }

    const trimmed = inputValue.trim();

    // 1. Check empty
    if (!trimmed) {
      setGentleValidation('Please enter a number before guessing.');
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    // 2. Validate only whole numbers (regex for digits only, no decimals or signs)
    if (!/^\d+$/.test(trimmed)) {
      setGentleValidation('Please enter a valid whole number (no decimals, spaces, or letters).');
      return;
    }

    const num = parseInt(trimmed, 10);

    // 3. Range check
    if (isNaN(num) || num < config.min || num > config.max) {
      setGentleValidation(
        `Your guess must be between ${config.min} and ${config.max} for ${config.label} mode.`
      );
      return;
    }

    // 4. Duplicate check
    const alreadyGuessed = guesses.some((g) => g.guess === num);
    if (alreadyGuessed) {
      setGentleValidation(`You already guessed ${num}. Try a different number!`);
      return;
    }

    // Valid guess processing
    const attemptNumber = guesses.length + 1;
    const diff = Math.abs(num - secretNumber);
    const isVeryClose = diff <= 5 && num !== secretNumber;

    let hintType: 'too_low' | 'too_high' | 'correct' = 'correct';
    if (num < secretNumber) {
      hintType = 'too_low';
    } else if (num > secretNumber) {
      hintType = 'too_high';
    }

    const newRecord: GuessRecord = {
      guess: num,
      attemptNumber,
      hint: hintType,
      isVeryClose,
      difference: diff,
      timestamp: Date.now(),
    };

    const nextGuesses = [...guesses, newRecord];
    setGuesses(nextGuesses);
    setInputValue('');

    if (num === secretNumber) {
      // Victory!
      setIsWon(true);
      return;
    }

    // Play hint sounds
    if (isVeryClose) {
      sounds.playVeryClose();
    } else {
      sounds.playGuess(num < secretNumber);
    }

    // Check if remaining attempts exhausted
    if (attemptNumber >= config.maxTries) {
      setIsGameOver(true);
      sounds.playLose();
    } else {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleStepGuess = (step: number) => {
    setGentleValidation(null);
    sounds.playClick();
    const currentNum = parseInt(inputValue, 10);
    const base = isNaN(currentNum) ? Math.floor((config.min + config.max) / 2) : currentNum;
    const nextVal = Math.min(Math.max(base + step, config.min), config.max);
    setInputValue(String(nextVal));
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [difficulty]);

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-12 animate-in fade-in duration-200">
      {/* Difficulty Switcher */}
      <div className="mb-4">
        <DifficultySelector
          currentDifficulty={difficulty}
          onSelectDifficulty={handleDifficultyChange}
          disabled={isWon}
        />
      </div>

      {/* Main Game Surface Card */}
      <div className="relative rounded-3xl bg-[#211340] border border-[#a68992]/20 p-5 shadow-[0_8px_24px_rgba(10,4,20,0.6)] overflow-hidden">
        {/* Subtle arcade ambient gradient in top corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#ec4899]/15 to-transparent rounded-bl-full pointer-events-none" />

        {/* Heads Up Display: Attempts & Range Tracker */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#a68992]/15">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#debec8] font-display">
              Attempts
            </span>
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-white font-display">
                {guesses.length}
              </span>
              <span className="text-xs text-[#debec8]">
                / {config.maxTries}
              </span>
            </div>
          </div>

          {/* Remaining tries capsule badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-display uppercase tracking-wider border ${
                remainingTries <= 2
                  ? 'bg-[#f43f5e]/20 text-[#ffb4ab] border-[#f43f5e]/50 animate-pulse'
                  : remainingTries <= 4
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                  : 'bg-[#06b6d4]/20 text-[#4cd7f6] border-[#06b6d4]/40'
              }`}
            >
              <span>{remainingTries} {remainingTries === 1 ? 'try' : 'tries'} left</span>
            </span>

            <button
              onClick={() => {
                sounds.playClick();
                resetGame();
              }}
              title="Reset Game"
              className="p-1.5 rounded-xl bg-[#2a1752] hover:bg-[#3a206b] text-[#debec8] hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Attempt visual meter bar */}
        <div className="w-full h-1.5 bg-[#180d2d] rounded-full overflow-hidden mb-5">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              remainingTries <= 2
                ? 'bg-gradient-to-r from-rose-500 to-red-500 shadow-[0_0_8px_#f43f5e]'
                : remainingTries <= 4
                ? 'bg-gradient-to-r from-amber-400 to-rose-400'
                : 'bg-gradient-to-r from-[#06b6d4] to-[#ec4899]'
            }`}
            style={{ width: `${(guesses.length / config.maxTries) * 100}%` }}
          />
        </div>

        {/* Active Clue / Hint Box */}
        <div className="rounded-2xl bg-[#180d2d] border border-[#c084fc]/25 p-4 mb-4 text-center min-h-[96px] flex flex-col items-center justify-center relative overflow-hidden">
          {guesses.length === 0 ? (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4cd7f6] font-display mb-1">
                <Compass className="w-4 h-4" />
                Target Lock
              </div>
              <p className="text-xs text-[#debec8] max-w-xs leading-relaxed">
                I'm thinking of a whole number between{' '}
                <strong className="text-white font-bold">{config.min}</strong> and{' '}
                <strong className="text-white font-bold">{config.max}</strong>.
              </p>
            </div>
          ) : lastGuess ? (
            <div className="animate-in fade-in duration-200 flex flex-col items-center">
              {/* Main Direction Banner */}
              <div className="flex items-center gap-2 mb-1.5">
                {lastGuess.hint === 'too_low' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4]/40 text-[#4cd7f6] text-xs font-black uppercase tracking-wider font-display">
                    <ArrowUp className="w-3.5 h-3.5" />
                    Too Low!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f43f5e]/20 border border-[#f43f5e]/40 text-[#ffb4ab] text-xs font-black uppercase tracking-wider font-display">
                    <ArrowDown className="w-3.5 h-3.5" />
                    Too High!
                  </span>
                )}

                {/* Very close badge if within 5 */}
                {lastGuess.isVeryClose && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ec4899]/25 border border-[#ec4899] text-[#ffb0cd] text-xs font-extrabold font-display animate-pulse shadow-[0_0_12px_rgba(236,72,153,0.5)]">
                    <Flame className="w-3.5 h-3.5 text-[#ec4899]" />
                    Very Close! (Within 5)
                  </span>
                )}
              </div>

              <p className="text-xs text-[#debec8]">
                Last guess: <span className="font-bold text-white">{lastGuess.guess}</span>.{' '}
                {lastGuess.hint === 'too_low'
                  ? 'Aim higher!'
                  : 'Aim lower!'}
              </p>
            </div>
          ) : null}

          {/* Range bounds indicator */}
          {guesses.length > 0 && !isWon && !isGameOver && (
            <div className="mt-2 text-[11px] text-[#debec8]/80 font-mono">
              Known bounds:{' '}
              <span className="text-[#4cd7f6] font-bold">{currentMinBound}</span> –{' '}
              <span className="text-[#4cd7f6] font-bold">{currentMaxBound}</span>
            </div>
          )}
        </div>

        {/* Gentle Validation Message (Non-red, polite inline status for empty/invalid inputs) */}
        {gentleValidation && (
          <div className="mb-4">
            <GentleValidation message={gentleValidation} />
          </div>
        )}

        {/* Game Over Reveal Card */}
        {isGameOver && (
          <div className="rounded-2xl bg-[#31111d] border border-[#f43f5e]/50 p-4 mb-4 text-center animate-in zoom-in-95">
            <h3 className="text-lg font-black text-[#ffdad6] font-display mb-1">
              Out of Tries!
            </h3>
            <p className="text-xs text-[#ffb4ab] mb-3">
              The secret number was{' '}
              <span className="text-2xl font-black text-white font-display ml-1">
                {secretNumber}
              </span>
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                resetGame();
              }}
              className="py-2.5 px-5 rounded-full bg-gradient-to-r from-[#f43f5e] to-[#ec4899] text-white text-xs font-bold font-display uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Input Form & Tactile Controls */}
        {!isGameOver && !isWon && (
          <form onSubmit={handleGuessSubmit} className="space-y-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#c084fc]">
                <Hash className="w-5 h-5" />
              </div>
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                min={config.min}
                max={config.max}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (gentleValidation) setGentleValidation(null);
                }}
                placeholder={`Guess a number (${config.min} - ${config.max})`}
                className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-[#180d2d] border-2 border-[#c084fc]/30 text-white placeholder-[#a68992]/60 text-lg font-black font-display text-center tracking-wider focus:outline-none focus:border-[#ec4899] focus:shadow-[0_0_18px_rgba(236,72,153,0.4)] transition-all"
              />

              {inputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue('');
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  className="absolute inset-y-0 right-14 pr-2 flex items-center text-xs text-[#debec8] hover:text-white"
                >
                  Clear
                </button>
              )}

              {/* Submit icon button inside slot */}
              <button
                type="submit"
                aria-label="Submit guess"
                className="absolute inset-y-1.5 right-1.5 px-3.5 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#d946ef] text-white flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Step Buttons for rapid thumb dialing */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-[#debec8] tracking-wider font-display">
                Quick Adjust:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStepGuess(-5)}
                  className="py-1 px-2.5 rounded-lg bg-[#180d2d] border border-[#a68992]/20 hover:border-[#a68992]/40 text-xs font-mono text-[#eaddff] active:scale-95 transition-all cursor-pointer"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => handleStepGuess(-1)}
                  className="py-1 px-2.5 rounded-lg bg-[#180d2d] border border-[#a68992]/20 hover:border-[#a68992]/40 text-xs font-mono text-[#eaddff] active:scale-95 transition-all cursor-pointer"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => handleStepGuess(1)}
                  className="py-1 px-2.5 rounded-lg bg-[#180d2d] border border-[#a68992]/20 hover:border-[#a68992]/40 text-xs font-mono text-[#eaddff] active:scale-95 transition-all cursor-pointer"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => handleStepGuess(5)}
                  className="py-1 px-2.5 rounded-lg bg-[#180d2d] border border-[#a68992]/20 hover:border-[#a68992]/40 text-xs font-mono text-[#eaddff] active:scale-95 transition-all cursor-pointer"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#ec4899] to-[#d946ef] text-white font-extrabold text-sm font-display tracking-widest uppercase shadow-[0_0_24px_rgba(236,72,153,0.5)] hover:brightness-110 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>GUESS IT!</span>
            </button>
          </form>
        )}
      </div>

      {/* Guess History Section */}
      {guesses.length > 0 && (
        <div className="mt-5 rounded-2xl bg-[#211340] border border-[#a68992]/20 p-4 shadow-[0_8px_24px_rgba(10,4,20,0.6)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#debec8] font-display flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#c084fc]" />
              Guess History ({guesses.length})
            </h3>
            <span className="text-[11px] text-[#debec8]/70">
              Newest first
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {[...guesses].reverse().map((record) => (
              <div
                key={record.attemptNumber}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#180d2d] border border-[#a68992]/15 hover:border-[#a68992]/30 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-[#241a3a] text-[#debec8] flex items-center justify-center font-mono font-bold text-[11px]">
                    #{record.attemptNumber}
                  </span>
                  <span className="text-sm font-black text-white font-display">
                    {record.guess}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {record.isVeryClose && (
                    <span className="px-2 py-0.5 rounded-full bg-[#ec4899]/20 text-[#ffb0cd] border border-[#ec4899]/40 text-[10px] font-bold flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-[#ec4899]" />
                      Within 5
                    </span>
                  )}

                  {record.hint === 'too_low' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#06b6d4]/15 text-[#4cd7f6] font-semibold text-[11px]">
                      <ArrowUp className="w-3 h-3" />
                      Too Low
                    </span>
                  ) : record.hint === 'too_high' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#f43f5e]/15 text-[#ffb4ab] font-semibold text-[11px]">
                      <ArrowDown className="w-3 h-3" />
                      Too High
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-lg bg-[#10b981]/20 text-[#10b981] font-bold text-[11px]">
                      Correct!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Win Modal Celebration */}
      <WinModal
        isOpen={isWon}
        secretNumber={secretNumber}
        attemptsUsed={guesses.length}
        difficulty={difficulty}
        onPlayAgain={resetGame}
        onViewLeaderboard={onViewLeaderboard}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
};
