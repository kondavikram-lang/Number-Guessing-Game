export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  name: Difficulty;
  label: string;
  min: number;
  max: number;
  maxTries: number;
  badgeColor: string;
  glowColor: string;
}

export interface GuessRecord {
  guess: number;
  attemptNumber: number;
  hint: 'too_low' | 'too_high' | 'correct';
  isVeryClose: boolean; // within 5
  difference: number;
  timestamp: number;
}

export interface GameScore {
  id?: string;
  user_id: string;
  player_name: string;
  difficulty: Difficulty;
  attempts: number;
  created_at?: string;
}

export type ActivePage = 'game' | 'leaderboard' | 'auth';
