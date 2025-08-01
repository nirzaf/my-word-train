import React, { useState, useEffect, useRef } from 'react';
import { useWordValidation } from '../../hooks/useWordValidation';
import './UserInput.css';

interface UserInputProps {
  isDisabled: boolean;
  expectedFirstLetter: string;
  usedWords: string[];
  onWordSubmit: (word: string) => void;
  placeholder?: string;
  className?: string;
}

const UserInput: React.FC<UserInputProps> = ({
  isDisabled,
  expectedFirstLetter,
  usedWords,
  onWordSubmit,
  placeholder = 'Enter your word...',
  className = ''
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { validationResult, validateInput, clearValidation } = useWordValidation();

  // Focus input when enabled
  useEffect(() => {
    if (!isDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  // Clear input when disabled
  useEffect(() => {
    if (isDisabled) {
      setInputValue('');
      clearValidation();
    }
  }, [isDisabled, clearValidation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear validation when user starts typing
    if (value && !validationResult.isValid) {
      clearValidation();
    }
    
    // Real-time validation for better UX
    if (value.trim()) {
      validateInput(value, expectedFirstLetter, usedWords);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDisabled || isSubmitting || !inputValue.trim()) {
      return;
    }
    
    const validation = validateInput(inputValue, expectedFirstLetter, usedWords);
    
    if (!validation.isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onWordSubmit(inputValue.trim());
      setInputValue('');
      clearValidation();
    } catch (error) {
      console.error('Error submitting word:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <div className={`user-input ${className}`}>
      <form onSubmit={handleSubmit} className="user-input-form">
        <div className="input-container">
          <div className="input-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isDisabled || isSubmitting}
              placeholder={isDisabled ? 'Waiting...' : placeholder}
              className={`word-input ${
                !validationResult.isValid ? 'word-input--error' : ''
              } ${
                validationResult.isValid && inputValue ? 'word-input--valid' : ''
              }`}
              maxLength={20}
              autoComplete="off"
              spellCheck={false}
            />
            <div className="input-hint">
              Must start with <strong>{expectedFirstLetter.toUpperCase()}</strong>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isDisabled || isSubmitting || !inputValue.trim() || !validationResult.isValid}
            className="submit-button"
          >
            {isSubmitting ? (
              <span className="loading-spinner animate-spin">⟳</span>
            ) : (
              'Submit'
            )}
          </button>
        </div>
        
        {!validationResult.isValid && validationResult.error && (
          <div className="error-message animate-fadeIn">
            <span className="error-icon">⚠️</span>
            {validationResult.error}
          </div>
        )}
      </form>
      
      <div className="input-tips">
        <div className="tip">
          💡 <strong>Tip:</strong> Use common English words for better gameplay
        </div>
        <div className="tip">
          ⚡ <strong>Quick:</strong> Press Enter to submit your word
        </div>
      </div>
    </div>
  );
};

export default UserInput;