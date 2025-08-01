export type GameStatus = 'idle' | 'playing' | 'gameOver';
export type Player = 'human' | 'computer';

export interface GameState {
  gameStatus: GameStatus;
  currentPlayer: Player;
  wordChain: string[];
  currentWord: string;
  timeLeft: number;
  score: {
    player: number;
    computer: number;
  };
  isLoading: boolean;
  error: string | null;
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