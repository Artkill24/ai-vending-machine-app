export interface Transaction {
  id: string;
  query: string;
  category: string;
  amount: string;
  txHash: string;
  insightPreview: string;
  insightFull: string; // <-- NUOVO: insight completo
  timestamp: string;
  generationTime?: number;
}

export interface TransactionHistoryProps {
  onSelectTransaction?: (tx: Transaction) => void;
}
