import React from 'react';
import './Timer.css';

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({ timeLeft, isActive, className = '' }) => {
  const isLowTime = timeLeft <= 3;
  const percentage = (timeLeft / 10) * 100;

  return (
    <div className={`timer ${className}`}>
      <div className="timer-container">
        <div 
          className={`timer-circle ${
            isLowTime ? 'timer-circle--warning' : ''
          } ${
            isActive ? 'timer-circle--active' : ''
          }`}
        >
          <div 
            className="timer-progress"
            style={{
              background: `conic-gradient(
                var(--color-primary) ${percentage}%, 
                var(--bg-secondary) ${percentage}%
              )`
            }}
          >
            <div className="timer-inner">
              <span 
                className={`timer-text ${
                  isLowTime ? 'timer-text--warning animate-countdown' : ''
                }`}
              >
                {timeLeft}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="timer-label">
        {isActive ? 'Time Left' : 'Paused'}
      </div>
    </div>
  );
};

export default Timer;