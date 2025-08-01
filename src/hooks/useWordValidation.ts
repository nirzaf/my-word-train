import { useState, useCallback } from 'react';
import { validateWord } from '../services/wordValidation';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const useWordValidation = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({ isValid: true });

  const validateInput = useCallback((word: string, expectedFirstLetter: string, usedWords: string[]) => {
    const result = validateWord(word, expectedFirstLetter, usedWords);
    setValidationResult(result);
    return result;
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult({ isValid: true });
  }, []);

  return {
    validationResult,
    validateInput,
    clearValidation,
  };
};