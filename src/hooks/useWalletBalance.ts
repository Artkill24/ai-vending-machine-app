'use client';

import { useState, useEffect } from 'react';

const INITIAL_BALANCE = 20.0; // Starting testnet balance
const STORAGE_KEY = 'ai-vending-wallet-balance';

export function useWalletBalance() {
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [isLoading, setIsLoading] = useState(true);

  // Load balance from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setBalance(parseFloat(stored));
      }
    } catch (error) {
      console.error('Failed to load wallet balance:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Deduct payment from balance
  const deductPayment = (amount: number) => {
    try {
      const newBalance = Math.max(0, balance - amount);
      setBalance(newBalance);
      localStorage.setItem(STORAGE_KEY, newBalance.toString());
      return newBalance;
    } catch (error) {
      console.error('Failed to deduct payment:', error);
      return balance;
    }
  };

  // Reset balance to initial
  const resetBalance = () => {
    try {
      setBalance(INITIAL_BALANCE);
      localStorage.setItem(STORAGE_KEY, INITIAL_BALANCE.toString());
      return true;
    } catch (error) {
      console.error('Failed to reset balance:', error);
      return false;
    }
  };

  // Add funds (for demo purposes)
  const addFunds = (amount: number) => {
    try {
      const newBalance = balance + amount;
      setBalance(newBalance);
      localStorage.setItem(STORAGE_KEY, newBalance.toString());
      return newBalance;
    } catch (error) {
      console.error('Failed to add funds:', error);
      return balance;
    }
  };

  return {
    balance,
    isLoading,
    deductPayment,
    resetBalance,
    addFunds,
  };
}
