import React from 'react';
import { GameStatus } from '../../types/game';
import './GameControls.css';

interface GameControlsProps {
  gameStatus: GameStatus;
  onStartGame: () => void;
  onRestartGame: () => void;
  isLoading?: boolean;
  className?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameStatus,
  onStartGame,
  onRestartGame,
  isLoading = false,
  className = ''
}) => {
  const getButtonConfig = () => {
    switch (gameStatus) {
      case 'idle':
        return {
          primary: {
            text: '🚀 Start New Game',
            action: onStartGame,
            variant: 'primary' as const,
            disabled: isLoading
          },
          secondary: null
        };
      
      case 'playing':
        return {
          primary: {
            text: '🔄 Restart Game',
            action: onRestartGame,
            variant: 'secondary' as const,
            disabled: isLoading
          },
          secondary: null
        };
      
      case 'gameOver':
        return {
          primary: {
            text: '🎮 Play Again',
            action: onStartGame,
            variant: 'primary' as const,
            disabled: isLoading
          },
          secondary: {
            text: '🏠 New Game',
            action: onRestartGame,
            variant: 'secondary' as const,
            disabled: isLoading
          }
        };
      
      default:
        return {
          primary: {
            text: 'Start Game',
            action: onStartGame,
            variant: 'primary' as const,
            disabled: isLoading
          },
          secondary: null
        };
    }
  };

  const { primary, secondary } = getButtonConfig();

  return (
    <div className={`game-controls ${className}`}>
      <div className="controls-container">
        <button
          onClick={primary.action}
          disabled={primary.disabled}
          className={`control-button control-button--${primary.variant} ${
            primary.disabled ? 'control-button--disabled' : ''
          }`}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner animate-spin">⟳</span>
              Loading...
            </>
          ) : (
            primary.text
          )}
        </button>
        
        {secondary && (
          <button
            onClick={secondary.action}
            disabled={secondary.disabled}
            className={`control-button control-button--${secondary.variant} ${
              secondary.disabled ? 'control-button--disabled' : ''
            }`}
          >
            {secondary.text}
          </button>
        )}
      </div>
      
      {gameStatus === 'idle' && (
        <div className="game-info">
          <div className="info-card">
            <h4 className="info-title">🎯 How to Play</h4>
            <ul className="info-list">
              <li>Take turns with the computer to create a word chain</li>
              <li>Each word must start with the last letter of the previous word</li>
              <li>You have 10 seconds to enter your word</li>
              <li>First to fail loses the round!</li>
            </ul>
          </div>
        </div>
      )}
      
      {gameStatus === 'gameOver' && (
        <div className="game-info">
          <div className="info-card">
            <h4 className="info-title">🏆 Round Complete!</h4>
            <p className="info-text">
              Great game! Ready for another round? Your progress is automatically saved.
            </p>
          </div>
        </div>
      )}
      
      {gameStatus === 'playing' && (
        <div className="game-info">
          <div className="info-card info-card--warning">
            <h4 className="info-title">⚠️ Game in Progress</h4>
            <p className="info-text">
              Restarting will end the current game and reset your progress.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameControls;