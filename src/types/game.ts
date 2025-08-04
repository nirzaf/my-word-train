export type GameStatus = 'idle' | 'playing' | 'gameOver';
export type Player = 'human' | 'computer';
export type PowerUpType = 'extraTime' | 'easyMode' | 'skipTurn';
export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export interface PowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  description: string;
  cost: number;
  icon: string;
  duration?: number; // in seconds, for temporary power-ups
}

export interface PlayerWallet {
  coins: number;
  powerUps: PowerUp[];
}

export interface GameState {
  gameStatus: GameStatus;
  currentPlayer: Player;
  wordChain: string[];
  currentWord: string;
  timeLeft: number;
  baseTimeLimit: number;
  difficulty: DifficultyLevel;
  score: {
    player: number;
    computer: number;
  };
  isLoading: boolean;
  error: string | null;
  activePowerUps: PowerUp[];
  wallet: PlayerWallet;
}

export interface WordChainEntry {
  word: string;
  player: Player;
  timestamp: number;
}

export interface GameConfig {
  timeLimit: number;
  initialWords: string[];
}