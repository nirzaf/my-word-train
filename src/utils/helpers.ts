/**
 * Get the last letter of a word
 */
export const getLastLetter = (word: string): string => {
  return word.toLowerCase().slice(-1);
};

/**
 * Get the first letter of a word
 */
export const getFirstLetter = (word: string): string => {
  return word.toLowerCase().charAt(0);
};

/**
 * Check if a word starts with a specific letter
 */
export const startsWithLetter = (word: string, letter: string): boolean => {
  return getFirstLetter(word) === letter.toLowerCase();
};

/**
 * Validate word format (basic validation)
 */
export const isValidWordFormat = (word: string): boolean => {
  const trimmed = word.trim();
  return (
    trimmed.length >= 2 &&
    trimmed.length <= 20 &&
    /^[a-zA-Z]+$/.test(trimmed)
  );
};

/**
 * Get a random item from an array
 */
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Capitalize first letter of a word
 */
export const capitalize = (word: string): string => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};