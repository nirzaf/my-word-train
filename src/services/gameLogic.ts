import type { GameState, Player, PowerUp, DifficultyLevel } from '../types/game';
import { getLastLetter, getRandomItem } from '../utils/helpers';
import { GAME_CONFIG } from '../utils/constants';
import { validateWord } from './wordValidation';
import { COIN_REWARDS, DIFFICULTY_SETTINGS } from '../utils/powerUps';

/**
 * Initialize a new game state
 */
export const initializeGame = (difficulty: DifficultyLevel = 'normal'): GameState => {
  const initialWord = getRandomItem([...GAME_CONFIG.INITIAL_WORDS]);
  
  return {
    gameStatus: 'idle',
    currentPlayer: 'human',
    wordChain: [initialWord],
    currentWord: initialWord,
    timeLeft: GAME_CONFIG.TIME_LIMIT,
    score: { player: 0, computer: 0 },
    isLoading: false,
    error: null,
    wallet: {
      coins: 50, // Starting coins
      powerUps: []
    },
    difficulty,
    activePowerUps: [],
    baseTimeLimit: GAME_CONFIG.TIME_LIMIT,
  };
};

/**
 * Start a new game
 */
export const startGame = (gameState: GameState): GameState => {
  return {
    ...gameState,
    gameStatus: 'playing',
    currentPlayer: 'human',
    timeLeft: GAME_CONFIG.TIME_LIMIT,
    error: null,
  };
};

/**
 * Add a word to the game chain
 */
export const addWordToChain = (
  gameState: GameState,
  word: string,
  player: Player
): { newState: GameState; isValid: boolean; error?: string } => {
  const trimmedWord = word.trim().toLowerCase();
  const expectedFirstLetter = getLastLetter(gameState.currentWord);
  
  // Validate the word
  const validation = validateWord(trimmedWord, expectedFirstLetter, gameState.wordChain);
  
  if (!validation.isValid) {
    return {
      newState: gameState,
      isValid: false,
      error: validation.error,
    };
  }
  
  // Add word to chain
  const newWordChain = [...gameState.wordChain, trimmedWord];
  const nextPlayer: Player = player === 'human' ? 'computer' : 'human';
  
  let newState: GameState = {
    ...gameState,
    wordChain: newWordChain,
    currentWord: trimmedWord,
    currentPlayer: nextPlayer,
    timeLeft: gameState.baseTimeLimit,
    error: null,
  };
  
  // Award coins for successful word submission
  if (player === 'human') {
    newState = awardCoins(newState, 'WORD_SUBMITTED');
  }
  
  return {
    newState,
    isValid: true,
  };
};

/**
 * End the current game round
 */
export const endGameRound = (
  gameState: GameState,
  winner: Player
): GameState => {
  const newScore = { ...gameState.score };
  let newState = { ...gameState };
  
  if (winner === 'human') {
    newScore.player += 1;
    // Award coins for winning
    newState = awardCoins(newState, 'ROUND_WON');
    
    // Check for game win (best of 3, 5, etc.)
    if (newScore.player > newScore.computer && newScore.player >= 3) {
      newState = awardCoins(newState, 'GAME_WON');
    }
  } else {
    newScore.computer += 1;
  }
  
  return {
    ...newState,
    gameStatus: 'gameOver',
    score: newScore,
    isLoading: false,
  };
};

/**
 * Reset game for a new round
 */
export const resetForNewRound = (gameState: GameState): GameState => {
  const initialWord = getRandomItem([...GAME_CONFIG.INITIAL_WORDS]);
  
  return {
    ...gameState,
    gameStatus: 'idle',
    currentPlayer: 'human',
    wordChain: [initialWord],
    currentWord: initialWord,
    timeLeft: gameState.baseTimeLimit,
    isLoading: false,
    error: null,
    // Clear active power-ups but preserve wallet and difficulty
    activePowerUps: [],
  };
};

/**
 * Get the expected first letter for the next word
 */
export const getExpectedFirstLetter = (gameState: GameState): string => {
  return getLastLetter(gameState.currentWord);
};

/**
 * Purchase a power-up
 */
export const purchasePowerUp = (
  gameState: GameState,
  powerUp: PowerUp
): { newState: GameState; success: boolean; error?: string } => {
  if (gameState.wallet.coins < powerUp.cost) {
    return {
      newState: gameState,
      success: false,
      error: 'Not enough coins'
    };
  }

  const newWallet = {
    ...gameState.wallet,
    coins: gameState.wallet.coins - powerUp.cost,
    powerUps: [...gameState.wallet.powerUps, powerUp]
  };

  return {
    newState: {
      ...gameState,
      wallet: newWallet
    },
    success: true
  };
};

/**
 * Use a power-up
 */
export const usePowerUp = (
  gameState: GameState,
  powerUp: PowerUp
): { newState: GameState; success: boolean; error?: string } => {
  const powerUpIndex = gameState.wallet.powerUps.findIndex(p => p.id === powerUp.id);
  
  if (powerUpIndex === -1) {
    return {
      newState: gameState,
      success: false,
      error: 'Power-up not found'
    };
  }

  // Remove power-up from wallet
  const newPowerUps = [...gameState.wallet.powerUps];
  newPowerUps.splice(powerUpIndex, 1);

  let newState = {
    ...gameState,
    wallet: {
      ...gameState.wallet,
      powerUps: newPowerUps
    }
  };

  // Apply power-up effect
  switch (powerUp.type) {
    case 'extraTime':
      newState = {
        ...newState,
        timeLeft: newState.timeLeft + (powerUp.duration || 30)
      };
      break;
    
    case 'easyMode':
    case 'skipTurn':
      newState = {
        ...newState,
        activePowerUps: [...newState.activePowerUps, powerUp]
      };
      break;
  }

  return {
    newState,
    success: true
  };
};

/**
 * Award coins for game actions
 */
export const awardCoins = (
  gameState: GameState,
  action: keyof typeof COIN_REWARDS,
  multiplier: number = 1
): GameState => {
  const baseReward = COIN_REWARDS[action];
  const difficultyMultiplier = DIFFICULTY_SETTINGS[gameState.difficulty].coinMultiplier;
  const totalReward = Math.floor(baseReward * multiplier * difficultyMultiplier);

  return {
    ...gameState,
    wallet: {
      ...gameState.wallet,
      coins: gameState.wallet.coins + totalReward
    }
  };
};

/**
 * Update active power-ups (reduce duration, remove expired ones)
 */
export const updateActivePowerUps = (gameState: GameState): GameState => {
  const updatedPowerUps = gameState.activePowerUps
    .map(powerUp => ({
      ...powerUp,
      duration: powerUp.duration ? powerUp.duration - 1 : undefined
    }))
    .filter(powerUp => !powerUp.duration || powerUp.duration > 0);

  return {
    ...gameState,
    activePowerUps: updatedPowerUps
  };
};

/**
 * Check if easy mode is active
 */
export const isEasyModeActive = (gameState: GameState): boolean => {
  return gameState.activePowerUps.some(powerUp => powerUp.type === 'easyMode');
};

/**
 * Check if skip turn is available
 */
export const canSkipTurn = (gameState: GameState): boolean => {
  return gameState.activePowerUps.some(powerUp => powerUp.type === 'skipTurn');
};

/**
 * Use skip turn power-up
 */
export const useSkipTurn = (gameState: GameState): GameState => {
  const skipTurnIndex = gameState.activePowerUps.findIndex(powerUp => powerUp.type === 'skipTurn');
  
  if (skipTurnIndex === -1) {
    return gameState;
  }

  const newActivePowerUps = [...gameState.activePowerUps];
  newActivePowerUps.splice(skipTurnIndex, 1);

  return {
    ...gameState,
    activePowerUps: newActivePowerUps,
    currentPlayer: 'human',
    timeLeft: gameState.baseTimeLimit
  };
};