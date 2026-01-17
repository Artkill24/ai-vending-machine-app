'use client';

import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { toast } from 'sonner';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onClearHistory: () => void;
  onDeleteTransaction: (id: string) => void;
  onViewInsight: (tx: Transaction) => void;
}

export default function TransactionHistory({
  transactions,
  onClearHistory,
  onDeleteTransaction,
  onViewInsight,
}: TransactionHistoryProps) {
  const [filter, setFilter] = useState<string>('all');

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.category === filter);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all transaction history? This cannot be undone.')) {
      onClearHistory();
      toast.success('Transaction history cleared! 🗑️');
    }
  };

  const handleDelete = (id: string) => {
    onDeleteTransaction(id);
    toast.success('Transaction deleted! 🗑️');
  };

  if (transactions.length === 0) {
    return (
      <div className="mt-16 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-10">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-white mb-2">No Insights Yet</h2>
          <p className="text-purple-300">Your transaction history will appear here once you start generating insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📊</span>
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Insights History
            </h2>
            <p className="text-purple-300 text-sm mt-1">
              {transactions.length} insight{transactions.length !== 1 ? 's' : ''} generated
            </p>
          </div>
        </div>
        
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-300 text-sm font-medium border border-red-500/30 hover:scale-105 transform"
        >
          🗑️ Clear History
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'crypto_analysis', 'market_sentiment', 'business_advice', 'technical_analysis', 'general_query'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              filter === cat
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white/5 text-purple-300 hover:bg-white/10'
            }`}
          >
            {cat === 'all' ? '🔍 All' : cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-purple-300">
            No transactions found for this category
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {tx.query}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                      {tx.category.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full">
                      💰 {tx.amount}
                    </span>
                    {tx.generationTime && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                        ⚡ {tx.generationTime}s
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      toast.loading('Loading insight...', { duration: 800 });
                      onViewInsight(tx);
                    }}
                    className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 transform"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 transform"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p className="text-purple-200 text-sm mb-3 line-clamp-2">
                {tx.insightPreview}...
              </p>

              <div className="flex justify-between items-center text-xs text-purple-400">
                <span>
                  📅 {new Date(tx.timestamp).toLocaleDateString()} at{' '}
                  {new Date(tx.timestamp).toLocaleTimeString()}
                </span>
                <span className="font-mono text-cyan-400">
                  {tx.txHash.slice(0, 16)}...
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
