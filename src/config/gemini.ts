export const GEMINI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY!,
  model: 'gemini-2.5-flash', // Fast model for real-time insights
  maxTokens: 500,
  temperature: 0.7,
};

export const INSIGHT_CATEGORIES = {
  CRYPTO: 'crypto_analysis',
  MARKET: 'market_sentiment',
  BUSINESS: 'business_advice',
  TECHNICAL: 'technical_analysis',
  GENERAL: 'general_query',
} as const;

export type InsightCategory = typeof INSIGHT_CATEGORIES[keyof typeof INSIGHT_CATEGORIES];
