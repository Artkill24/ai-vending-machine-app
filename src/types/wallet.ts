export interface WalletInfo {
  walletSetId: string;
  walletId: string;
  address: string;
  blockchain: string;
  balance?: string;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  currency: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}
