import { InsightCategory } from '@/config/gemini';

export interface PaymentRequest {
  query: string;
  category: InsightCategory;
  userWallet?: string;
}

export interface PaymentResponse {
  amount: number;
  currency: string;
  recipient: string;
  paymentId: string;
  expiresAt: string;
}

export interface InsightResponse {
  insight: string;
  query: string;
  category: InsightCategory;
  cost: number;
  transactionId: string;
  timestamp: string;
}
