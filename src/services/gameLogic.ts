import type { GameState, Player } from '../types/game';
import { getLastLetter, getRandomItem } from '../utils/helpers';
import { GAME_CONFIG } from '../utils/constants';
import { validateWord } from './wordValidation';

/**
 * Initialize a new game state
 */
export const initializeGame = (): GameState => {
  const initialWord = getRandomItem([...GAME_CONFIG.INITIAL_WORDS]);
  
  return {
    gameStatus: 'idle',
    currentPlayer: 'human',
    wordChain: [initialWord as string],
    currentWord: initialWord as string,
    timeLeft: GAME_CONFIG.TIME_LIMIT,
    score: { player: 0, computer: 0 },
    isLoading: false,
    error: null,
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
  
  const newState: GameState = {
    ...gameState,
    wordChain: newWordChain,
    currentWord: trimmedWord,
    currentPlayer: nextPlayer,
    timeLeft: GAME_CONFIG.TIME_LIMIT,
    error: null,
  };
  
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
  
  if (winner === 'human') {
    newScore.player += 1;
  } else {
    newScore.computer += 1;
  }
  
  return {
    ...gameState,
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
    wordChain: [initialWord as string],
    currentWord: initialWord as string,
    timeLeft: GAME_CONFIG.TIME_LIMIT,
    isLoading: false,
    error: null,
  };
};

/**
 * Get the expected first letter for the next word
 */
export const getExpectedFirstLetter = (gameState: GameState): string => {
  return getLastLetter(gameState.currentWord);
};