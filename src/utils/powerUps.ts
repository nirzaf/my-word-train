import type { PowerUp, DifficultyLevel } from '../types/game';

export const AVAILABLE_POWER_UPS: PowerUp[] = [
  {
    id: 'extra-time-30',
    type: 'extraTime',
    name: 'Extra Time +30s',
    description: 'Add 30 seconds to your current turn',
    cost: 10,
    icon: '⏰',
    duration: 30
  },
  {
    id: 'extra-time-60',
    type: 'extraTime',
    name: 'Extra Time +60s',
    description: 'Add 60 seconds to your current turn',
    cost: 18,
    icon: '⏰',
    duration: 60
  },
  {
    id: 'easy-mode',
    type: 'easyMode',
    name: 'Easy Mode',
    description: 'Make the AI use simpler words for 3 turns',
    cost: 15,
    icon: '🎯',
    duration: 3
  },
  {
    id: 'skip-turn',
    type: 'skipTurn',
    name: 'Skip Turn',
    description: 'Skip the computer\'s turn once',
    cost: 25,
    icon: '⏭️'
  }
];

export const DIFFICULTY_SETTINGS: Record<DifficultyLevel, {
  name: string;
  description: string;
  aiWordComplexity: number; // 1-10 scale
  coinMultiplier: number;
}> = {
  easy: {
    name: 'Easy',
    description: 'AI uses simple, common words',
    aiWordComplexity: 3,
    coinMultiplier: 1
  },
  normal: {
    name: 'Normal',
    description: 'AI uses moderate difficulty words',
    aiWordComplexity: 6,
    coinMultiplier: 1.5
  },
  hard: {
    name: 'Hard',
    description: 'AI uses complex, challenging words',
    aiWordComplexity: 9,
    coinMultiplier: 2
  }
};

export const POWER_UP_BUNDLES = [
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    description: 'Perfect for beginners',
    price: 299, // $2.99 in cents
    originalPrice: 347,
    savings: 48,
    powerUps: [
      { id: 'extra-time-30', quantity: 2 },
      { id: 'easy-mode', quantity: 1 }
    ],
    icon: '🎁'
  },
  {
    id: 'pro-pack',
    name: 'Pro Pack',
    description: 'For serious players',
    price: 899, // $8.99 in cents
    originalPrice: 1095,
    savings: 196,
    powerUps: [
      { id: 'extra-time-30', quantity: 3 },
      { id: 'extra-time-60', quantity: 2 },
      { id: 'easy-mode', quantity: 2 },
      { id: 'skip-turn', quantity: 1 }
    ],
    icon: '💎'
  }
];

export const COIN_REWARDS = {
  WORD_SUBMITTED: 2,
  ROUND_WON: 10,
  GAME_WON: 25,
  STREAK_BONUS: 5, // per consecutive win
  DAILY_LOGIN: 5
};

export const WALLET_STORAGE_KEY = 'word-train-wallet';
export const DIFFICULTY_STORAGE_KEY = 'word-train-difficulty';