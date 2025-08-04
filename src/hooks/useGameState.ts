import { useState, useCallback } from 'react';
import type { GameState, Player, PowerUp, DifficultyLevel } from '../types/game';
import { 
  initializeGame, 
  startGame, 
  addWordToChain, 
  endGameRound, 
  resetForNewRound,
  purchasePowerUp,
  usePowerUp,
  updateActivePowerUps,
  isEasyModeActive,
  canSkipTurn,
  useSkipTurn
} from '../services/gameLogic';
import { getNextWord } from '../services/geminiApi';
import { saveGameScore } from '../utils/storage';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { WALLET_STORAGE_KEY, DIFFICULTY_STORAGE_KEY } from '../utils/powerUps';

export const useGameState = () => {
  // Initialize game state with saved data
  const initializeGameWithSavedData = () => {
    const savedDifficulty = loadFromStorage<DifficultyLevel>(DIFFICULTY_STORAGE_KEY, 'normal');
    const savedWallet = loadFromStorage(WALLET_STORAGE_KEY, { coins: 0, powerUps: [] });
    
    const initialState = initializeGame(savedDifficulty);
    
    initialState.wallet = savedWallet;
    
    return initialState;
  };
  
  const [gameState, setGameState] = useState<GameState>(initializeGameWithSavedData());

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
        saveToStorage(WALLET_STORAGE_KEY, endedState.wallet);
        return {
          ...endedState,
          error: result.error || 'Invalid word',
        };
      }
      
      // Save wallet data after successful word submission (coins awarded)
      saveToStorage(WALLET_STORAGE_KEY, result.newState.wallet);
      return result.newState;
    });
  }, []);

  const handleComputerTurn = useCallback(async () => {
    setGameState(prevState => ({ ...prevState, isLoading: true }));
    
    try {
      const easyMode = isEasyModeActive(gameState);
      const computerWord = await getNextWord(
        gameState.currentWord, 
        gameState.wordChain, 
        gameState.difficulty, 
        easyMode
      );
      
      setGameState(prevState => {
        const result = addWordToChain(prevState, computerWord, 'computer');
        
        if (!result.isValid) {
          // Computer generated invalid word - player wins
          const endedState = endGameRound(prevState, 'human');
          saveGameScore(endedState.score);
          saveToStorage(WALLET_STORAGE_KEY, endedState.wallet);
          return endedState;
        }
        
        // Update active power-ups after computer turn
        const updatedState = updateActivePowerUps(result.newState);
        saveToStorage(WALLET_STORAGE_KEY, updatedState.wallet);
        
        return {
          ...updatedState,
          isLoading: false,
        };
      });
    } catch (error) {
      // Computer failed - player wins
      setGameState(prevState => {
        const endedState = endGameRound(prevState, 'human');
        saveGameScore(endedState.score);
        saveToStorage(WALLET_STORAGE_KEY, endedState.wallet);
        return {
          ...endedState,
          error: 'Computer failed to respond',
          isLoading: false,
        };
      });
    }
  }, [gameState.currentWord, gameState.wordChain, gameState.difficulty]);

  const handleTimeUp = useCallback(() => {
    setGameState(prevState => {
      const winner: Player = prevState.currentPlayer === 'human' ? 'computer' : 'human';
      const endedState = endGameRound(prevState, winner);
      saveGameScore(endedState.score);
      saveToStorage(WALLET_STORAGE_KEY, endedState.wallet);
      return endedState;
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prevState => resetForNewRound(prevState));
  }, []);

  const clearError = useCallback(() => {
    setGameState(prevState => ({ ...prevState, error: null }));
  }, []);

  // Power-up functions
  const buyPowerUp = useCallback((powerUp: PowerUp) => {
    setGameState(prevState => {
      const result = purchasePowerUp(prevState, powerUp);
      if (result.success) {
        saveToStorage(WALLET_STORAGE_KEY, result.newState.wallet);
        return result.newState;
      }
      return {
        ...prevState,
        error: result.error || 'Purchase failed'
      };
    });
  }, []);

  const activatePowerUp = useCallback((powerUp: PowerUp) => {
    setGameState(prevState => {
      const result = usePowerUp(prevState, powerUp);
      if (result.success) {
        saveToStorage(WALLET_STORAGE_KEY, result.newState.wallet);
        return result.newState;
      }
      return {
        ...prevState,
        error: result.error || 'Power-up activation failed'
      };
    });
  }, []);

  const skipComputerTurn = useCallback(() => {
    setGameState(prevState => {
      if (canSkipTurn(prevState)) {
        const newState = useSkipTurn(prevState);
        saveToStorage(WALLET_STORAGE_KEY, newState.wallet);
        return newState;
      }
      return prevState;
    });
  }, []);

  const changeDifficulty = useCallback((difficulty: DifficultyLevel) => {
    setGameState(prevState => {
      const newState = { ...prevState, difficulty };
      saveToStorage(DIFFICULTY_STORAGE_KEY, difficulty);
      return newState;
    });
  }, []);

  return {
    gameState,
    startNewGame,
    submitWord,
    handleComputerTurn,
    handleTimeUp,
    resetGame,
    clearError,
    // Power-up functions
    buyPowerUp,
    activatePowerUp,
    skipComputerTurn,
    changeDifficulty,
    // Helper functions
    canSkipTurn: () => canSkipTurn(gameState),
    isEasyModeActive: () => isEasyModeActive(gameState),
  };
};