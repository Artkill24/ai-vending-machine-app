'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface WalletBalanceProps {
  balance: number;
  isLoading: boolean;
  onReset: () => void;
  onAddFunds: (amount: number) => void;
}

export default function WalletBalance({
  balance,
  isLoading,
  onReset,
  onAddFunds,
}: WalletBalanceProps) {
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    }

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showActions]);

  const handleReset = () => {
    if (confirm('Reset balance to 20 USDC? (Demo only)')) {
      onReset();
      toast.success('Balance reset to 20 USDC! 💰');
      setShowActions(false);
    }
  };

  const handleAddFunds = () => {
    onAddFunds(10);
    toast.success('Added 10 USDC! 💰');
    setShowActions(false);
  };

  if (isLoading) {
    return (
      <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 shadow-2xl">
        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
        <span className="text-white font-semibold text-sm">Loading...</span>
      </div>
    );
  }

  const balanceColor = balance > 10 ? 'text-cyan-300' : balance > 1 ? 'text-yellow-300' : 'text-red-300';
  const statusColor = balance > 10 ? 'bg-green-500' : balance > 1 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div 
        className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
        onClick={() => setShowActions(!showActions)}
      >
        <div className="relative">
          <div className={`w-3 h-3 ${statusColor} rounded-full animate-ping absolute`}></div>
          <div className={`w-3 h-3 ${statusColor} rounded-full`}></div>
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">Arc Testnet</span>
        <span className="text-purple-300">•</span>
        <span className={`${balanceColor} font-bold`}>{balance.toFixed(2)} USDC</span>
        <span className="text-purple-300 text-xs ml-1">{showActions ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown Actions */}
      {showActions && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowActions(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute top-full mt-2 left-0 bg-purple-900/95 backdrop-blur-xl border-2 border-purple-500/50 rounded-2xl shadow-2xl p-4 min-w-[220px] z-50 animate-slideIn">
            <div className="space-y-2">
              <button
                onClick={handleAddFunds}
                className="w-full px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all duration-300 text-sm font-medium border border-green-500/30 hover:scale-105 transform flex items-center justify-center gap-2"
              >
                <span>💰</span>
                Add 10 USDC
              </button>
              <button
                onClick={handleReset}
                className="w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all duration-300 text-sm font-medium border border-purple-500/30 hover:scale-105 transform flex items-center justify-center gap-2"
              >
                <span>🔄</span>
                Reset to 20 USDC
              </button>
              <button
                onClick={() => setShowActions(false)}
                className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all duration-300 text-sm font-medium"
              >
                Close
              </button>
            </div>
            <p className="text-xs text-purple-400 mt-3 text-center">
              Demo mode - for testing only
            </p>
          </div>
        </>
      )}
    </div>
  );
}
