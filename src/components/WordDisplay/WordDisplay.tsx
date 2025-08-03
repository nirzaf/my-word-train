import React from 'react';
import type { Player } from '../../types/game';
import { capitalize } from '../../utils/helpers';
import './WordDisplay.css';

interface WordDisplayProps {
  currentWord: string;
  wordChain: string[];
  currentPlayer: Player;
  className?: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({
  currentWord,
  wordChain,
  currentPlayer,
  className = ''
}) => {
  const lastLetter = currentWord.slice(-1).toUpperCase();
  
  return (
    <div className={`word-display ${className}`}>
      <div className="current-word-section">
        <h2 className="current-word-label">
          Current Word
        </h2>
        <div className="current-word-container">
          <span className="current-word animate-scaleIn">
            {capitalize(currentWord)}
          </span>
          <div className="next-letter-hint">
            <span className="next-letter-label">Next word starts with:</span>
            <span className="next-letter">{lastLetter}</span>
          </div>
        </div>
      </div>
      
      <div className="word-chain-section">
        <h3 className="word-chain-label">
          Word Chain ({wordChain.length} words)
        </h3>
        <div className="word-chain">
          {wordChain.map((word, index) => {
            const isCurrentWord = index === wordChain.length - 1;
            const isPlayerWord = index % 2 === 1; // Assuming first word is computer's
            
            return (
              <div
                key={`${word}-${index}`}
                className={`word-chain-item ${
                  isCurrentWord ? 'word-chain-item--current' : ''
                } ${
                  isPlayerWord ? 'word-chain-item--player' : 'word-chain-item--computer'
                } animate-slideInLeft`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="word-chain-number">{index + 1}</span>
                <span className="word-chain-word">{capitalize(word)}</span>
                <span className="word-chain-player">
                  {isPlayerWord ? '👤' : '🤖'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="turn-indicator">
        <div className={`turn-badge ${
          currentPlayer === 'human' ? 'turn-badge--player' : 'turn-badge--computer'
        }`}>
          {currentPlayer === 'human' ? '👤 Your Turn' : '🤖 Computer\'s Turn'}
        </div>
      </div>
    </div>
  );
};

export default WordDisplay;