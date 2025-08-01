import { isValidWordFormat, startsWithLetter } from '../utils/helpers';

/**
 * Basic word validation - checks format and starting letter
 * In a real app, you might want to integrate with a dictionary API
 */
export const validateWord = (word: string, expectedFirstLetter: string, usedWords: string[]): {
  isValid: boolean;
  error?: string;
} => {
  const trimmedWord = word.trim().toLowerCase();
  
  // Check if word is empty
  if (!trimmedWord) {
    return { isValid: false, error: 'Word cannot be empty' };
  }
  
  // Check word format
  if (!isValidWordFormat(trimmedWord)) {
    return { isValid: false, error: 'Word must be 2-20 letters only' };
  }
  
  // Check if word starts with correct letter
  if (!startsWithLetter(trimmedWord, expectedFirstLetter)) {
    return { 
      isValid: false, 
      error: `Word must start with '${expectedFirstLetter.toUpperCase()}'` 
    };
  }
  
  // Check if word was already used
  if (usedWords.includes(trimmedWord)) {
    return { isValid: false, error: 'Word already used' };
  }
  
  return { isValid: true };
};

/**
 * Simple dictionary check (placeholder)
 * In a real app, you'd integrate with a proper dictionary API
 */
export const isRealWord = async (word: string): Promise<boolean> => {
  // For now, just check if it's a reasonable word format
  // You could integrate with APIs like:
  // - Merriam-Webster Dictionary API
  // - Oxford Dictionary API
  // - Free Dictionary API
  
  const trimmedWord = word.trim().toLowerCase();
  
  // Basic check - reject very short or very long words
  if (trimmedWord.length < 2 || trimmedWord.length > 20) {
    return false;
  }
  
  // For demo purposes, accept any properly formatted word
  return isValidWordFormat(trimmedWord);
};