import { STORAGE_KEYS } from './constants';

/**
 * Save data to localStorage with error handling
 */
export const saveToStorage = <T>(key: string, data: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
};

/**
 * Load data from localStorage with error handling
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 */
export const removeFromStorage = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
    return false;
  }
};

/**
 * Save game score
 */
export const saveGameScore = (score: { player: number; computer: number }): boolean => {
  return saveToStorage(STORAGE_KEYS.GAME_SCORE, score);
};

/**
 * Load game score
 */
export const loadGameScore = (): { player: number; computer: number } => {
  return loadFromStorage(STORAGE_KEYS.GAME_SCORE, { player: 0, computer: 0 });
};