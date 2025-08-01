import React, { useEffect } from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useTimer } from '../../hooks/useTimer';
import { getExpectedFirstLetter } from '../../services/gameLogic';
import { GAME_CONFIG } from '../../utils/constants';
import WordDisplay from '../WordDisplay';
import UserInput from '../UserInput';
import Timer from '../Timer';
import GameStatus from '../GameStatus';
import GameControls from '../GameControls';
import './GameBoard.css';

interface GameBoardProps {
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ className = '' }) => {
  const {
    gameState,
    startNewGame,
    submitWord,
    handleComputerTurn,
    handleTimeUp,
    resetGame,
    clearError
  } = useGameState();

  const {
    timeLeft,
    isActive: isTimerActive,
    restart: restartTimer,
    pause: pauseTimer
  } = useTimer({
    initialTime: GAME_CONFIG.TIME_LIMIT,
    onTimeUp: handleTimeUp,
    autoStart: false
  });

  // Start timer when game starts and it's human's turn
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.currentPlayer === 'human' && !gameState.isLoading) {
      restartTimer(GAME_CONFIG.TIME_LIMIT);
    } else {
      pauseTimer();
    }
  }, [gameState.gameStatus, gameState.currentPlayer, gameState.isLoading, restartTimer, pauseTimer]);

  // Handle computer turn
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && gameState.currentPlayer === 'computer' && !gameState.isLoading) {
      // Add a small delay to make the transition feel more natural
      const timer = setTimeout(() => {
        handleComputerTurn();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.gameStatus, gameState.currentPlayer, gameState.isLoading, handleComputerTurn]);

  // Clear error after a delay
  useEffect(() => {
    if (gameState.error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.error, clearError]);

  const handleStartGame = () => {
    startNewGame();
  };

  const handleRestartGame = () => {
    resetGame();
  };

  const handleWordSubmit = async (word: string) => {
    pauseTimer();
    await submitWord(word);
  };

  const expectedFirstLetter = getExpectedFirstLetter(gameState);
  const isUserInputDisabled = 
    gameState.gameStatus !== 'playing' || 
    gameState.currentPlayer !== 'human' || 
    gameState.isLoading;

  const getWinner = () => {
    if (gameState.gameStatus === 'gameOver') {
      // Determine winner based on who didn't make the last move
      return gameState.currentPlayer === 'human' ? 'computer' : 'human';
    }
    return undefined;
  };

  return (
    <div className={`game-board ${className}`}>
      <div className="game-board-container">
        {/* Header Section */}
        <div className="game-header">
          <div className="header-content">
            <h1 className="game-title">🔗 Word Train</h1>
            <p className="game-subtitle">
              Create a chain of words where each word starts with the last letter of the previous word!
            </p>
          </div>
        </div>

        {/* Game Status */}
        <div className="status-section">
          <GameStatus
            gameStatus={gameState.gameStatus}
            currentPlayer={gameState.currentPlayer}
            isLoading={gameState.isLoading}
            error={gameState.error}
            winner={getWinner()}
          />
        </div>

        {/* Main Game Area */}
        <div className="game-content">
          {gameState.gameStatus !== 'idle' && (
            <>
              {/* Word Display */}
              <div className="word-display-section">
                <WordDisplay
                  currentWord={gameState.currentWord}
                  wordChain={gameState.wordChain}
                  currentPlayer={gameState.currentPlayer}
                />
              </div>

              {/* User Input with Timer */}
              <div className="input-section">
                <div className="input-with-timer">
                  <div className="timer-section">
                    <Timer
                      timeLeft={timeLeft}
                      isActive={isTimerActive && gameState.currentPlayer === 'human'}
                    />
                  </div>
                  <div className="user-input-section">
                    <UserInput
                      isDisabled={isUserInputDisabled}
                      expectedFirstLetter={expectedFirstLetter}
                      usedWords={gameState.wordChain}
                      onWordSubmit={handleWordSubmit}
                      placeholder={`Enter a word starting with "${expectedFirstLetter.toUpperCase()}"...`}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Game Controls */}
        <div className="controls-section">
          <GameControls
            gameStatus={gameState.gameStatus}
            onStartGame={handleStartGame}
            onRestartGame={handleRestartGame}
            isLoading={gameState.isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default GameBoard;