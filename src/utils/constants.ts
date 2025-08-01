export const GAME_CONFIG = {
  TIME_LIMIT: 10, // seconds
  INITIAL_WORDS: ['apple', 'elephant', 'tiger', 'rainbow', 'ocean'],
  MIN_WORD_LENGTH: 2,
  MAX_WORD_LENGTH: 20,
} as const;

export const API_CONFIG = {
  GEMINI_TIMEOUT: 8000, // 8 seconds to leave buffer for user
  MAX_RETRIES: 2,
} as const;

export const STORAGE_KEYS = {
  GAME_SCORE: 'wordTrain_score',
  GAME_SETTINGS: 'wordTrain_settings',
} as const;

export const MESSAGES = {
  GAME_START: 'Game started! Your turn.',
  COMPUTER_THINKING: 'Computer is thinking...',
  TIME_UP: 'Time\'s up!',
  INVALID_WORD: 'Invalid word! Must start with the correct letter.',
  COMPUTER_WINS: 'Computer wins this round!',
  PLAYER_WINS: 'You win this round!',
  API_ERROR: 'Computer failed to respond. You win!',
} as const;