import React from 'react';
import type { PowerUp, PlayerWallet } from '../../types/game';
import './PowerUpBar.css';

interface PowerUpBarProps {
  wallet: PlayerWallet;
  activePowerUps: PowerUp[];
  onOpenShop: () => void;
  onUsePowerUp: (powerUp: PowerUp) => void;
  className?: string;
}

const PowerUpBar: React.FC<PowerUpBarProps> = ({
  wallet,
  activePowerUps,
  onOpenShop,
  onUsePowerUp,
  className = ''
}) => {
  return (
    <div className={`power-up-bar ${className}`}>
      <div className="power-up-bar-header">
        <div className="wallet-info">
          <span className="coin-display">
            <span className="coin-icon">🪙</span>
            <span className="coin-count">{wallet.coins}</span>
          </span>
          <button 
            className="shop-btn"
            onClick={onOpenShop}
            title="Open Power-Up Shop"
          >
            🛒 Shop
          </button>
        </div>
      </div>

      <div className="power-ups-section">
        <h4 className="section-title">Your Power-Ups</h4>
        
        {wallet.powerUps.length === 0 ? (
          <div className="no-power-ups">
            <p>No power-ups available</p>
            <button className="get-power-ups-btn" onClick={onOpenShop}>
              Get Power-Ups
            </button>
          </div>
        ) : (
          <div className="power-ups-list">
            {wallet.powerUps.map((powerUp, index) => (
              <div key={`${powerUp.id}-${index}`} className="power-up-item">
                <button
                  className="power-up-btn"
                  onClick={() => onUsePowerUp(powerUp)}
                  title={powerUp.description}
                >
                  <span className="power-up-icon">{powerUp.icon}</span>
                  <span className="power-up-name">{powerUp.name}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {activePowerUps.length > 0 && (
        <div className="active-power-ups-section">
          <h4 className="section-title">Active Effects</h4>
          <div className="active-power-ups-list">
            {activePowerUps.map((powerUp, index) => (
              <div key={`active-${powerUp.id}-${index}`} className="active-power-up">
                <span className="active-icon">{powerUp.icon}</span>
                <span className="active-name">{powerUp.name}</span>
                {powerUp.duration && (
                  <span className="active-duration">
                    {powerUp.type === 'easyMode' ? `${powerUp.duration} turns` : `${powerUp.duration}s`}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerUpBar;