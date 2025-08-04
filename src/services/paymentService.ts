// Placeholder payment service for build compatibility
// This would contain actual Stripe integration in a real implementation

export const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const isPaymentConfigured = (): boolean => {
  return false; // Always return false for now
};

export const createPaymentIntent = async (_amount: number): Promise<any> => {
  throw new Error('Payment service not implemented');
};

export const processPayment = async (_paymentData: any): Promise<any> => {
  throw new Error('Payment service not implemented');
};