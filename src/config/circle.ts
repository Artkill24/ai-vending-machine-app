export const CIRCLE_CONFIG = {
  apiKey: process.env.CIRCLE_API_KEY!,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET!,
  walletId: process.env.CIRCLE_WALLET_ID!,
  walletAddress: process.env.CIRCLE_WALLET_ADDRESS!,
  blockchain: 'ARC-TESTNET' as const,
};

export const PAYMENT_CONFIG = {
  minAmount: 0.01, // Minimum 0.01 USDC
  maxAmount: 1.0,  // Maximum 1.0 USDC per insight
  currency: 'USDC',
  baseFee: 0.05,   // Base fee for simple query
  complexityMultiplier: 0.02, // Additional cost per complexity level
};
