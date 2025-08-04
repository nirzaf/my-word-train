import React, { useState } from 'react';
import type { PowerUp } from '../../types/game';
import { AVAILABLE_POWER_UPS, POWER_UP_BUNDLES } from '../../utils/powerUps';
import { formatPrice, isPaymentConfigured } from '../../services/paymentService';
import PaymentCheckout from '../PaymentCheckout';
import './PowerUpShop.css';

interface PowerUpShopProps {
  onPurchase: (powerUp: PowerUp) => void;
  onClose: () => void;
  isOpen: boolean;
  wallet: {
    coins: number;
    powerUps: PowerUp[];
  };
}

const PowerUpShop: React.FC<PowerUpShopProps> = ({
  onPurchase,
  onClose,
  isOpen
}) => {
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  if (!isOpen) return null;

  const handlePurchaseClick = (powerUp: PowerUp) => {
    if (!isPaymentConfigured()) {
      alert('Payment system is not configured. Please contact support.');
      return;
    }
    setSelectedPowerUp(powerUp);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (powerUp: PowerUp) => {
    setIsCheckoutOpen(false);
    setSelectedPowerUp(null);
    onPurchase(powerUp);
  };

  const handlePaymentCancel = () => {
    setIsCheckoutOpen(false);
    setSelectedPowerUp(null);
  };

  return (
    <div className="power-up-shop-overlay">
      <div className="power-up-shop">
        <div className="shop-header">
          <h2 className="shop-title">🛒 Power-Up Shop</h2>
          <div className="payment-info">
            <span className="secure-icon">🔒</span>
            <span className="secure-text">Secure Payment</span>
          </div>
          <button 
            className="shop-close-btn"
            onClick={onClose}
            aria-label="Close shop"
          >
            ✕
          </button>
        </div>

        <div className="power-ups-grid">
          {AVAILABLE_POWER_UPS.map((powerUp) => (
            <div key={powerUp.id} className="power-up-card">
              <div className="power-up-icon">{powerUp.icon}</div>
              <div className="power-up-info">
                <h3>{powerUp.name}</h3>
                <p>{powerUp.description}</p>
                <div className="power-up-cost">
                  <span className="price-amount">{formatPrice(powerUp.cost)}</span>
                </div>
              </div>
              <button 
                className="purchase-btn"
                onClick={() => handlePurchaseClick(powerUp)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
        
        {POWER_UP_BUNDLES.length > 0 && (
          <>
            <div className="section-header">
              <h3>💰 Bundle Deals</h3>
              <p>Save money with these special offers!</p>
            </div>
            
            <div className="bundles-grid">
              {POWER_UP_BUNDLES.map((bundle) => (
                <div key={bundle.id} className="bundle-card">
                  <div className="bundle-icon">{bundle.icon}</div>
                  <div className="bundle-info">
                    <h3>{bundle.name}</h3>
                    <p>{bundle.description}</p>
                    <div className="bundle-pricing">
                      <span className="original-price">{formatPrice(bundle.originalPrice)}</span>
                      <span className="bundle-price">{formatPrice(bundle.price)}</span>
                      <span className="savings">Save {formatPrice(bundle.originalPrice - bundle.price)}</span>
                    </div>
                  </div>
                  <button 
                    className="purchase-btn bundle-btn"
                    onClick={() => {
                      // For bundles, we'll create a special power-up object
                      const bundlePowerUp: PowerUp = {
                        id: bundle.id,
                        type: 'bundle' as any,
                        name: bundle.name,
                        description: bundle.description,
                        cost: bundle.price,
                        icon: bundle.icon
                      };
                      handlePurchaseClick(bundlePowerUp);
                    }}
                  >
                    Buy Bundle
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="shop-footer">
          <div className="payment-methods">
            <span>💳</span>
            <span>🍎</span>
            <span>📱</span>
            <span>💰</span>
          </div>
          <p>Secure payments powered by Stripe</p>
        </div>
      </div>
      
      {selectedPowerUp && (
        <PaymentCheckout
          powerUp={selectedPowerUp}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
          isOpen={isCheckoutOpen}
        />
      )}
    </div>
  );
};

export default PowerUpShop;