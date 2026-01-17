'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';

const STORAGE_KEY = 'ai-vending-machine-transactions';

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTransactions(parsed);
      }
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add new transaction
  const addTransaction = (tx: Transaction) => {
    try {
      const updated = [tx, ...transactions];
      setTransactions(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Failed to save transaction:', error);
      return false;
    }
  };

  // Clear all transactions
  const clearHistory = () => {
    try {
      setTransactions([]);
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear history:', error);
      return false;
    }
  };

  // Delete single transaction
  const deleteTransaction = (id: string) => {
    try {
      const updated = transactions.filter(tx => tx.id !== id);
      setTransactions(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      return false;
    }
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    clearHistory,
    deleteTransaction,
  };
}
