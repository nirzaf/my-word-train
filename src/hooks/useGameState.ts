import { useState, useCallback } from 'react';
import type { GameState, Player } from '../types/game';
import { initializeGame, startGame, addWordToChain, endGameRound, resetForNewRound } from '../services/gameLogic';
import { getNextWord } from '../services/geminiApi';
import { saveGameScore } from '../utils/storage';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initializeGame());

  const startNewGame = useCallback(() => {
    setGameState(prevState => startGame(prevState));
  }, []);

  const submitWord = useCallback(async (word: string) => {
    setGameState(prevState => {
      const result = addWordToChain(prevState, word, 'human');
      
      if (!result.isValid) {
        // Invalid word - player loses
        const endedState = endGameRound(prevState, 'computer');
        saveGameScore(endedState.score);
        return {
          ...endedState,
          error: result.error || 'Invalid word',
        };
      }
      
      return result.newState;
    });
  }, []);

  const handleComputerTurn = useCallback(async () => {
    setGameState(prevState => ({ ...prevState, isLoading: true }));
    
    try {
      const computerWord = await getNextWord(gameState.currentWord, gameState.wordChain);
      
      setGameState(prevState => {
        const result = addWordToChain(prevState, computerWord, 'computer');
        
        if (!result.isValid) {
          // Computer generated invalid word - player wins
          const endedState = endGameRound(prevState, 'human');
          saveGameScore(endedState.score);
          return endedState;
        }
        
        return {
          ...result.newState,
          isLoading: false,
        };
      });
    } catch (error) {
      // Computer failed - player wins
      setGameState(prevState => {
        const endedState = endGameRound(prevState, 'human');
        saveGameScore(endedState.score);
        return {
          ...endedState,
          error: 'Computer failed to respond',
          isLoading: false,
        };
      });
    }
  }, [gameState.currentWord, gameState.wordChain]);

  const handleTimeUp = useCallback(() => {
    setGameState(prevState => {
      const winner: Player = prevState.currentPlayer === 'human' ? 'computer' : 'human';
      const endedState = endGameRound(prevState, winner);
      saveGameScore(endedState.score);
      return endedState;
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prevState => resetForNewRound(prevState));
  }, []);

  const clearError = useCallback(() => {
    setGameState(prevState => ({ ...prevState, error: null }));
  }, []);

  return {
    gameState,
    startNewGame,
    submitWord,
    handleComputerTurn,
    handleTimeUp,
    resetGame,
    clearError,
  };
};