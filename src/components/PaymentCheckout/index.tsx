import React from 'react';
import type { PowerUp } from '../../types/game';

interface PaymentCheckoutProps {
  powerUp: PowerUp | any;
  onSuccess: (powerUp: PowerUp) => void;
  onCancel: () => void;
  isOpen: boolean;
}

// Placeholder PaymentCheckout component for build compatibility
const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({ 
  powerUp: _powerUp, 
  onSuccess: _onSuccess, 
  onCancel, 
  isOpen 
}) => {
  if (!isOpen) return null;

  return (
    <div className="payment-checkout-overlay">
      <div className="payment-checkout-content">
        <h3>Payment Not Available</h3>
        <p>Payment system is not configured.</p>
        <button onClick={onCancel}>Close</button>
      </div>
    </div>
  );
};

export default PaymentCheckout;