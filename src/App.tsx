import React from 'react';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import { useLocalStorage } from './hooks/useLocalStorage';
import { loadGameScore } from './utils/storage';
import './App.css';

function App() {
  const [score] = useLocalStorage('wordTrain_score', { player: 0, computer: 0 });

  return (
    <div className="app">
      <div className="app-container">
        <div className="main-content">
          <GameBoard />
        </div>
        
        <div className="sidebar">
          <ScoreBoard 
            playerScore={score.player}
            computerScore={score.computer}
          />
        </div>
      </div>
    </div>
  )
}

export default App
