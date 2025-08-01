import React from 'react';
import './ScoreBoard.css';

interface ScoreBoardProps {
  playerScore: number;
  computerScore: number;
  className?: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerScore,
  computerScore,
  className = ''
}) => {
  const totalGames = playerScore + computerScore;
  const playerWinRate = totalGames > 0 ? (playerScore / totalGames) * 100 : 0;
  const computerWinRate = totalGames > 0 ? (computerScore / totalGames) * 100 : 0;
  
  const getLeaderStatus = () => {
    if (playerScore > computerScore) {
      return { leader: 'player', message: 'You\'re winning!' };
    } else if (computerScore > playerScore) {
      return { leader: 'computer', message: 'Computer is ahead!' };
    } else {
      return { leader: 'tie', message: 'It\'s a tie!' };
    }
  };
  
  const leaderStatus = getLeaderStatus();

  return (
    <div className={`scoreboard ${className}`}>
      <div className="scoreboard-header">
        <h3 className="scoreboard-title">🏆 Score Board</h3>
        <div className={`leader-badge leader-badge--${leaderStatus.leader}`}>
          {leaderStatus.message}
        </div>
      </div>
      
      <div className="score-container">
        <div className="score-item score-item--player">
          <div className="score-icon">👤</div>
          <div className="score-details">
            <div className="score-label">You</div>
            <div className="score-value">{playerScore}</div>
            <div className="score-rate">
              {playerWinRate.toFixed(0)}% win rate
            </div>
          </div>
          <div className="score-progress">
            <div 
              className="score-progress-fill score-progress-fill--player"
              style={{ width: `${playerWinRate}%` }}
            />
          </div>
        </div>
        
        <div className="score-divider">
          <span className="vs-text">VS</span>
        </div>
        
        <div className="score-item score-item--computer">
          <div className="score-icon">🤖</div>
          <div className="score-details">
            <div className="score-label">Computer</div>
            <div className="score-value">{computerScore}</div>
            <div className="score-rate">
              {computerWinRate.toFixed(0)}% win rate
            </div>
          </div>
          <div className="score-progress">
            <div 
              className="score-progress-fill score-progress-fill--computer"
              style={{ width: `${computerWinRate}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="scoreboard-stats">
        <div className="stat-item">
          <span className="stat-label">Total Games:</span>
          <span className="stat-value">{totalGames}</span>
        </div>
        
        {totalGames > 0 && (
          <>
            <div className="stat-item">
              <span className="stat-label">Longest Streak:</span>
              <span className="stat-value">-</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Average Game Length:</span>
              <span className="stat-value">-</span>
            </div>
          </>
        )}
      </div>
      
      {totalGames === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <p className="empty-message">
            No games played yet.<br />
            Start your first game to see your progress!
          </p>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;