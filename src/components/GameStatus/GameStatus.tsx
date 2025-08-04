import React from 'react';
import type { GameStatus as GameStatusType, Player } from '../../types/game';
import './GameStatus.css';

interface GameStatusProps {
  gameStatus: GameStatusType;
  currentPlayer: Player;
  isLoading: boolean;
  error: string | null;
  winner?: Player;
  className?: string;
}

const GameStatus: React.FC<GameStatusProps> = ({
  gameStatus,
  currentPlayer,
  isLoading,
  error,
  winner,
  className = ''
}) => {
  const getStatusMessage = () => {
    if (error) {
      return {
        message: error,
        type: 'error' as const,
        icon: '❌'
      };
    }

    if (gameStatus === 'idle') {
      return {
        message: 'Ready to start a new game!',
        type: 'info' as const,
        icon: '🎮'
      };
    }

    if (gameStatus === 'gameOver') {
      if (winner === 'human') {
        return {
          message: '🎉 Congratulations! You won this round!',
          type: 'success' as const,
          icon: '🏆'
        };
      } else {
        return {
          message: '😔 Computer won this round. Better luck next time!',
          type: 'warning' as const,
          icon: '🤖'
        };
      }
    }

    if (gameStatus === 'playing') {
      if (isLoading) {
        return {
          message: '🤖 Computer is thinking...',
          type: 'info' as const,
          icon: '💭'
        };
      }

      if (currentPlayer === 'human') {
        return {
          message: '👤 Your turn! Enter a word quickly!',
          type: 'active' as const,
          icon: '⚡'
        };
      } else {
        return {
          message: '🤖 Computer\'s turn...',
          type: 'waiting' as const,
          icon: '⏳'
        };
      }
    }

    return {
      message: 'Game in progress...',
      type: 'info' as const,
      icon: '🎯'
    };
  };

  const status = getStatusMessage();

  return (
    <div className={`game-status ${className}`}>
      <div className={`status-card status-card--${status.type} animate-fadeIn`}>
        <div className="status-icon">
          {isLoading ? (
            <span className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          ) : (
            <span className="status-emoji">{status.icon}</span>
          )}
        </div>
        
        <div className="status-content">
          <p className="status-message">{status.message}</p>
          
          {gameStatus === 'playing' && !isLoading && (
            <div className="status-details">
              {currentPlayer === 'human' ? (
                <span className="player-indicator player-indicator--active">
                  It's your turn - make it count!
                </span>
              ) : (
                <span className="player-indicator player-indicator--waiting">
                  Waiting for computer response...
                </span>
              )}
            </div>
          )}
          
          {error && (
            <div className="error-details">
              <small>The game will continue with the next round.</small>
            </div>
          )}
        </div>
      </div>
      
      {gameStatus === 'playing' && (
        <div className="game-progress">
          <div className="progress-bar">
            <div 
              className={`progress-fill progress-fill--${currentPlayer}`}
              style={{
                width: currentPlayer === 'human' ? '60%' : '40%',
                transition: 'width 0.5s ease'
              }}
            />
          </div>
          <div className="progress-labels">
            <span className={`progress-label ${
              currentPlayer === 'human' ? 'progress-label--active' : ''
            }`}>
              👤 You
            </span>
            <span className={`progress-label ${
              currentPlayer === 'computer' ? 'progress-label--active' : ''
            }`}>
              🤖 Computer
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatus;