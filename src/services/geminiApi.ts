import { API_CONFIG } from '../utils/constants';
import { isValidWordFormat, startsWithLetter } from '../utils/helpers';

// Note: In a real application, you would store the API key securely
// For demo purposes, we'll use a placeholder
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-api-key-here';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Generate a word using Google Gemini AI
 */
export const getNextWord = async (lastWord: string, usedWords: string[] = []): Promise<string> => {
  const lastLetter = lastWord.slice(-1).toLowerCase();
  
  try {
    const prompt = createPrompt(lastLetter, usedWords);
    const response = await callGeminiAPI(prompt);
    
    const generatedWord = extractWordFromResponse(response);
    
    // Validate the generated word
    if (!isValidWordFormat(generatedWord)) {
      throw new Error('Generated word has invalid format');
    }
    
    if (!startsWithLetter(generatedWord, lastLetter)) {
      throw new Error(`Generated word doesn't start with '${lastLetter}'`);
    }
    
    if (usedWords.includes(generatedWord.toLowerCase())) {
      throw new Error('Generated word was already used');
    }
    
    return generatedWord.toLowerCase();
    
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback to a simple word list if API fails
    return getFallbackWord(lastLetter, usedWords);
  }
};

/**
 * Create a prompt for the Gemini AI
 */
const createPrompt = (firstLetter: string, usedWords: string[]): string => {
  const usedWordsText = usedWords.length > 0 
    ? `\nDo not use these already used words: ${usedWords.join(', ')}` 
    : '';
    
  return `Generate a single English word that starts with the letter "${firstLetter.toUpperCase()}". 
The word should be:
- A common English word
- Between 3-15 letters long
- A noun, verb, or adjective
- Not a proper noun

Respond with ONLY the word, nothing else.${usedWordsText}`;
};

/**
 * Call the Gemini API
 */
const callGeminiAPI = async (prompt: string): Promise<any> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.GEMINI_TIMEOUT);
  
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Extract word from Gemini API response
 */
const extractWordFromResponse = (response: any): string => {
  try {
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No text in API response');
    }
    
    // Extract just the word (remove any extra text)
    const word = text.trim().split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
    return word;
    
  } catch (error) {
    throw new Error('Failed to parse API response');
  }
};

/**
 * Fallback word generation when API fails
 */
const getFallbackWord = (firstLetter: string, usedWords: string[]): string => {
  // Simple fallback word lists for each letter
  const fallbackWords: Record<string, string[]> = {
    a: ['apple', 'animal', 'amazing', 'adventure', 'awesome'],
    b: ['banana', 'beautiful', 'bright', 'butterfly', 'brave'],
    c: ['cat', 'creative', 'colorful', 'curious', 'calm'],
    d: ['dog', 'delicious', 'dynamic', 'dream', 'dance'],
    e: ['elephant', 'exciting', 'energy', 'explore', 'elegant'],
    f: ['flower', 'fantastic', 'friendly', 'fresh', 'fun'],
    g: ['garden', 'gentle', 'great', 'green', 'graceful'],
    h: ['happy', 'harmony', 'hope', 'heart', 'home'],
    i: ['ice', 'incredible', 'inspire', 'imagine', 'island'],
    j: ['joy', 'journey', 'jump', 'jungle', 'jewel'],
    k: ['kind', 'knowledge', 'key', 'kitchen', 'kite'],
    l: ['love', 'light', 'laugh', 'learn', 'life'],
    m: ['music', 'magic', 'mountain', 'moon', 'memory'],
    n: ['nature', 'nice', 'new', 'night', 'natural'],
    o: ['ocean', 'orange', 'open', 'opportunity', 'optimistic'],
    p: ['peace', 'positive', 'planet', 'power', 'perfect'],
    q: ['quiet', 'question', 'quick', 'quality', 'queen'],
    r: ['rainbow', 'river', 'relax', 'respect', 'radiant'],
    s: ['sun', 'smile', 'strong', 'special', 'success'],
    t: ['tree', 'trust', 'time', 'together', 'treasure'],
    u: ['unique', 'universe', 'understand', 'unity', 'uplifting'],
    v: ['victory', 'vibrant', 'value', 'vision', 'voice'],
    w: ['water', 'wonderful', 'wisdom', 'warm', 'welcome'],
    x: ['xylophone', 'xenial', 'xerus', 'xeric', 'xylem'],
    y: ['yellow', 'young', 'yesterday', 'yoga', 'yummy'],
    z: ['zebra', 'zen', 'zest', 'zone', 'zoom']
  };
  
  const words = fallbackWords[firstLetter.toLowerCase()] || ['word'];
  const availableWords = words.filter(word => !usedWords.includes(word));
  
  if (availableWords.length === 0) {
    // If all fallback words are used, generate a simple one
    return firstLetter.toLowerCase() + 'ord';
  }
  
  return availableWords[Math.floor(Math.random() * availableWords.length)];
};

/**
 * Check if Gemini API is configured
 */
export const isApiConfigured = (): boolean => {
  return GEMINI_API_KEY !== 'your-api-key-here' && GEMINI_API_KEY.length > 0;
};