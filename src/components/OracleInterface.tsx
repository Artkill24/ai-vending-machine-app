'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { toast } from 'sonner';
import { USDC_CONTRACT, PAYMENT_RECEIVER, USDC_ABI } from '@/config/contracts';

const GEMINI_MODELS = {
  'flash-2.5': {
    id: 'gemini-2.5-flash',
    name: 'Flash 2.5',
    emoji: '⚡',
    description: 'Fast & Efficient',
    price: '0.05',
    badge: 'Recommended',
  },
  'flash-lite': {
    id: 'gemini-2.5-flash-lite',
    name: 'Flash Lite',
    emoji: '🚀',
    description: 'Ultra Fast',
    price: '0.03',
    badge: 'Cheapest',
  },
  'flash-3': {
    id: 'gemini-3-flash',
    name: 'Flash 3.0',
    emoji: '🔥',
    description: 'Next Gen',
    price: '0.08',
    badge: 'New',
  },
};

const CATEGORIES = [
  { id: 'crypto', label: '💰 Crypto Analysis', emoji: '💰' },
  { id: 'market', label: '📈 Market Sentiment', emoji: '📈' },
  { id: 'business', label: '💼 Business Advice', emoji: '💼' },
  { id: 'technical', label: '🔧 Technical Analysis', emoji: '🔧' },
  { id: 'general', label: '🤔 General Query', emoji: '🤔' },
];

interface Insight {
  id: string;
  query: string;
  category: string;
  model?: string;
  answer: string;
  cost: string;
  timestamp: string;
  txHash: string;
}

interface ReferralData {
  code: string;
  totalReferrals: number;
  totalEarned: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
}

export default function OracleInterface() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('crypto');
  const [selectedModel, setSelectedModel] = useState('flash-2.5');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInsight, setCurrentInsight] = useState<Insight | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [pendingTxHash, setPendingTxHash] = useState<`0x${string}` | undefined>();
  const [currentQuery, setCurrentQuery] = useState('');
  const [hasReferralDiscount, setHasReferralDiscount] = useState(false);

  // Read USDC balance
  const { data: usdcBalance, refetch: refetchBalance } = useReadContract({
    address: USDC_CONTRACT.address,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Wait for transaction confirmation
  const { data: receipt, isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: pendingTxHash,
  });

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('oracle-insights');
    if (saved) {
      try {
        setInsights(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load insights:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient && insights.length > 0) {
      localStorage.setItem('oracle-insights', JSON.stringify(insights));
    }
  }, [insights, isClient]);

  useEffect(() => {
    if (isConnected && address) {
      refetchBalance();
    }
  }, [isConnected, address, refetchBalance]);

  // Check for referral code in URL
  useEffect(() => {
    if (!address || !isClient) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      const existingRef = localStorage.getItem(`referred_by_${address}`);
      
      if (!existingRef) {
        localStorage.setItem(`referred_by_${address}`, refCode);
        setHasReferralDiscount(true);
        toast.success('🎁 Referral code applied!', {
          description: 'You get 5% discount on all queries!',
        });
      } else {
        setHasReferralDiscount(true);
      }
    } else {
      const existingRef = localStorage.getItem(`referred_by_${address}`);
      if (existingRef) {
        setHasReferralDiscount(true);
      }
    }
  }, [address, isClient]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && receipt && pendingTxHash && currentQuery) {
      handleConfirmedTransaction(pendingTxHash, currentQuery);
    }
  }, [isConfirmed, receipt, pendingTxHash, currentQuery]);

  // Reward referrer with cashback
  const rewardReferrer = (referrerCode: string, amount: number) => {
    try {
      // Calculate 10% cashback
      const cashback = amount * 0.10;
      
      // Find referrer data
      const allKeys = Object.keys(localStorage);
      const referralKey = allKeys.find(key => {
        if (key.startsWith('referral_')) {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          return data.code === referrerCode;
        }
        return false;
      });

      if (referralKey) {
        const referrerData: ReferralData = JSON.parse(localStorage.getItem(referralKey) || '{}');
        referrerData.totalReferrals += 1;
        referrerData.totalEarned = (parseFloat(referrerData.totalEarned) + cashback).toFixed(2);
        localStorage.setItem(referralKey, JSON.stringify(referrerData));
        
        console.log('💰 Referrer rewarded:', {
          code: referrerCode,
          cashback: cashback.toFixed(2),
          newTotal: referrerData.totalEarned,
        });
      }
    } catch (error) {
      console.error('Failed to reward referrer:', error);
    }
  };

  // Update user loyalty points
  const updateUserPoints = (userAddress: string, pointsToAdd: number) => {
    try {
      const referralKey = `referral_${userAddress}`;
      const userData: ReferralData = JSON.parse(
        localStorage.getItem(referralKey) || 
        JSON.stringify({
          code: userAddress.slice(2, 8).toUpperCase(),
          totalReferrals: 0,
          totalEarned: '0.00',
          tier: 'bronze',
          points: 0,
        })
      );

      userData.points += pointsToAdd;

      // Update tier based on points
      if (userData.points >= 5000) {
        userData.tier = 'platinum';
      } else if (userData.points >= 2000) {
        userData.tier = 'gold';
      } else if (userData.points >= 500) {
        userData.tier = 'silver';
      }

      localStorage.setItem(referralKey, JSON.stringify(userData));
      
      console.log('⭐ Points updated:', {
        address: userAddress,
        pointsAdded: pointsToAdd,
        totalPoints: userData.points,
        tier: userData.tier,
      });
    } catch (error) {
      console.error('Failed to update points:', error);
    }
  };

  const handleConfirmedTransaction = async (txHash: `0x${string}`, queryText: string) => {
    const selectedModelData = GEMINI_MODELS[selectedModel as keyof typeof GEMINI_MODELS];
    
    try {
      if (receipt?.status !== 'success') {
        throw new Error('Transaction failed on blockchain');
      }

      console.log('✅ Transaction confirmed on blockchain:', receipt);
      toast.success('✅ Payment confirmed on blockchain!');
      
      // Refetch balance
      refetchBalance();

      toast.info(`🤖 ${selectedModelData.name} is thinking...`);
      
      console.log('Calling oracle API...', { 
        query: queryText, 
        category: selectedCategory,
        model: selectedModel,
        txHash,
      });
      
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          category: selectedCategory,
          model: selectedModel,
          address,
          txHash: txHash as string,
        }),
      });

      const data = await response.json();
      
      console.log('Oracle API response:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to get insight');
      }

      const newInsight: Insight = {
        id: Date.now().toString(),
        query: queryText,
        category: selectedCategory,
        model: data.model || selectedModelData.name,
        answer: data.insight || data.answer || 'No insight available',
        cost: data.price || selectedModelData.price,
        timestamp: new Date().toISOString(),
        txHash: txHash as string,
      };

      setInsights(prev => [newInsight, ...prev]);
      setCurrentInsight(newInsight);
      setQuery('');
      setCurrentQuery('');
      setPendingTxHash(undefined);
      
      // Update loyalty points (1 point per $0.01 spent)
      const pointsEarned = Math.floor(parseFloat(selectedModelData.price) * 100);
      if (address) {
        updateUserPoints(address, pointsEarned);
      }

      // Reward referrer if applicable
      if (address) {
        const referredBy = localStorage.getItem(`referred_by_${address}`);
        if (referredBy) {
          rewardReferrer(referredBy, parseFloat(selectedModelData.price));
        }
      }
      
      toast.success('✨ Insight received!', {
        description: `Generated by ${selectedModelData.name} • +${pointsEarned} points`,
      });

    } catch (error: any) {
      console.error('Oracle error after confirmation:', error);
      toast.error('Failed to get insight after payment', {
        description: error.message || 'Please contact support with TX hash',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetInsight = async () => {
    if (!query.trim()) {
      toast.error('Please enter a query');
      return;
    }

    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setCurrentQuery(query); // Save query for later use

    const selectedModelData = GEMINI_MODELS[selectedModel as keyof typeof GEMINI_MODELS];
    let finalPrice = parseFloat(selectedModelData.price);

    // Apply 5% discount if referred
    if (hasReferralDiscount) {
      finalPrice = finalPrice * 0.95;
    }

    const paymentAmount = parseUnits(finalPrice.toFixed(2), USDC_CONTRACT.decimals);

    try {
      // Check USDC balance
      if (usdcBalance !== undefined && usdcBalance < paymentAmount) {
        throw new Error(`Insufficient USDC balance. You need ${finalPrice.toFixed(2)} USDC. Get test USDC from Arc faucet.`);
      }

      const discountText = hasReferralDiscount ? ' (5% referral discount applied!)' : '';
      toast.info(`💎 Requesting ${finalPrice.toFixed(2)} USDC payment...${discountText}`, {
        description: 'Please confirm transaction in MetaMask',
      });

      console.log('Initiating USDC transfer:', {
        to: PAYMENT_RECEIVER,
        amount: paymentAmount.toString(),
        amountFormatted: finalPrice.toFixed(2),
        originalPrice: selectedModelData.price,
        discount: hasReferralDiscount ? '5%' : 'none',
      });

      // Execute USDC transfer
      const txHash = await writeContractAsync({
        address: USDC_CONTRACT.address,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [PAYMENT_RECEIVER, paymentAmount],
      });

      console.log('✅ Transaction sent:', txHash);
      
      // Set pending tx hash to trigger useWaitForTransactionReceipt
      setPendingTxHash(txHash);
      
      toast.info('⏳ Waiting for blockchain confirmation...', {
        description: 'This may take a few seconds',
      });

      // The rest is handled by useEffect when transaction confirms

    } catch (error: any) {
      console.error('Oracle error:', error);
      setIsLoading(false);
      setPendingTxHash(undefined);
      setCurrentQuery('');
      
      if (error.message?.includes('User rejected') || error.message?.includes('User denied')) {
        toast.error('Transaction cancelled', {
          description: 'You rejected the transaction',
        });
      } else if (error.message?.includes('Insufficient USDC')) {
        toast.error('Insufficient USDC balance', {
          description: 'Get test USDC from Arc faucet',
        });
      } else {
        toast.error('Failed to process payment', {
          description: error.message || error.shortMessage || 'Please try again',
        });
      }
    }
  };

  const handleClearHistory = () => {
    setInsights([]);
    setCurrentInsight(null);
    localStorage.removeItem('oracle-insights');
    toast.info('History cleared');
  };

  const selectedModelData = GEMINI_MODELS[selectedModel as keyof typeof GEMINI_MODELS];
  const finalPrice = hasReferralDiscount 
    ? (parseFloat(selectedModelData.price) * 0.95).toFixed(2)
    : selectedModelData.price;

  if (!isClient) {
    return <div className="text-center text-purple-300">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* USDC Balance Display */}
      {isClient && isConnected && address && usdcBalance !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 backdrop-blur-xl px-6 py-3 rounded-full border border-green-500/30">
            <span className="text-2xl">💵</span>
            <div className="text-left">
              <div className="text-xs text-green-400/70">Your Balance</div>
              <div className="text-green-400 font-bold text-lg">
                {formatUnits(usdcBalance, USDC_CONTRACT.decimals)} USDC
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Referral Discount Badge */}
      {hasReferralDiscount && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-pink-500/10 backdrop-blur-xl px-6 py-3 rounded-full border border-pink-500/30">
            <span className="text-2xl">🎁</span>
            <div className="text-left">
              <div className="text-xs text-pink-400/70">Active Discount</div>
              <div className="text-pink-400 font-bold">
                5% OFF on all queries!
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Transaction Confirming Status */}
      {isConfirming && pendingTxHash && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-yellow-500/10 backdrop-blur-xl px-6 py-3 rounded-full border border-yellow-500/30">
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-left">
              <div className="text-xs text-yellow-400/70">Transaction Pending</div>
              <div className="text-yellow-400 font-semibold text-sm">
                Confirming on blockchain...
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-purple-500/30 shadow-2xl"
      >
        {/* Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-purple-300 mb-3">
            🤖 Select Gemini Model:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(GEMINI_MODELS).map(([key, model]) => {
              const modelFinalPrice = hasReferralDiscount 
                ? (parseFloat(model.price) * 0.95).toFixed(2)
                : model.price;
              
              return (
                <motion.button
                  key={key}
                  onClick={() => setSelectedModel(key)}
                  disabled={isLoading}
                  className={`relative px-4 py-4 rounded-xl font-medium transition-all duration-300 ${
                    selectedModel === key
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white scale-105 shadow-lg shadow-cyan-500/50'
                      : 'bg-white/5 text-purple-300 hover:bg-white/10'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={!isLoading ? { scale: 1.05 } : {}}
                  whileTap={!isLoading ? { scale: 0.95 } : {}}
                >
                  {model.badge && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {model.badge}
                    </div>
                  )}
                  <div className="text-2xl mb-1">{model.emoji}</div>
                  <div className="text-xs font-bold mb-1">{model.name}</div>
                  <div className="text-[10px] opacity-70 mb-2">{model.description}</div>
                  <div className="text-xs font-bold text-green-400">
                    {hasReferralDiscount && modelFinalPrice !== model.price && (
                      <div className="line-through text-red-400 text-[10px]">
                        {model.price} USDC
                      </div>
                    )}
                    {modelFinalPrice} USDC
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-purple-300 mb-3">
            📂 Select Category:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                disabled={isLoading}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white scale-105'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
              >
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="text-xs">{cat.label.split(' ')[1]}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-purple-300 mb-3">
            ✍️ Your Question:
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask the AI Oracle anything..."
            className="w-full px-6 py-4 bg-white/5 border-2 border-purple-500/30 rounded-2xl text-white placeholder-purple-400/50 focus:outline-none focus:border-cyan-500/50 transition-all duration-300 resize-none"
            rows={4}
            disabled={isLoading}
          />
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleGetInsight}
          disabled={!isConnected || isLoading || !query.trim()}
          className="w-full py-5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>
                {isConfirming ? 'Confirming payment...' : 'Processing...'}
              </span>
            </>
          ) : (
            <>
              <span>💎</span>
              <span>
                Pay {finalPrice} USDC & Get Insight
                {hasReferralDiscount && ' 🎁'}
              </span>
              <span>{selectedModelData.emoji}</span>
            </>
          )}
        </motion.button>

        {!isConnected && (
          <p className="text-center text-purple-400/70 text-sm mt-4">
            👆 Connect wallet above to start
          </p>
        )}

        {/* Model Info */}
        {selectedModelData && (
          <div className="mt-4 p-4 bg-white/5 rounded-xl border border-cyan-500/30">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedModelData.emoji}</span>
                <div>
                  <div className="text-white font-semibold">
                    {selectedModelData.name}
                  </div>
                  <div className="text-purple-400 text-xs">
                    {selectedModelData.description}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {hasReferralDiscount && finalPrice !== selectedModelData.price && (
                  <div className="line-through text-red-400 text-xs">
                    {selectedModelData.price} USDC
                  </div>
                )}
                <div className="text-green-400 font-bold">
                  {finalPrice} USDC
                </div>
                {selectedModelData.badge && (
                  <div className="text-xs text-pink-400">
                    {selectedModelData.badge}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Current Insight Display */}
      <AnimatePresence>
        {currentInsight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 bg-gradient-to-br from-purple-900/50 to-cyan-900/50 backdrop-blur-xl rounded-3xl p-8 border-2 border-cyan-500/30 shadow-2xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-cyan-300 mb-2">
                  ✨ AI Insight
                </h3>
                <p className="text-purple-300 text-sm">
                  {CATEGORIES.find(c => c.id === currentInsight.category)?.label}
                </p>
                {currentInsight.model && (
                  <p className="text-cyan-400 text-xs mt-1 flex items-center gap-1">
                    <span>🤖</span>
                    Generated by <span className="font-bold">{currentInsight.model}</span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold text-lg">
                  💎 {currentInsight.cost} USDC
                </div>
                <div className="text-purple-400 text-xs">
                  {new Date(currentInsight.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded-2xl p-6 mb-4">
              <p className="text-purple-300 text-sm font-semibold mb-2">
                Your Question:
              </p>
              <p className="text-white text-lg mb-4">
                {currentInsight.query}
              </p>
              <hr className="border-purple-500/30 mb-4" />
              <p className="text-cyan-300 text-sm font-semibold mb-2">
                Oracle Answer:
              </p>
              <p className="text-white leading-relaxed whitespace-pre-wrap">
                {currentInsight.answer}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-purple-400/70">
              <span>TX: {currentInsight.txHash.slice(0, 10)}...{currentInsight.txHash.slice(-8)}</span>
              <span>🔒 Secured by Arc Network</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Insights History */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-purple-300">
              📜 Insights History
            </h2>
            <motion.button
              onClick={handleClearHistory}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-full text-sm font-medium transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🗑️ Clear History
            </motion.button>
          </div>

          <p className="text-purple-400/70 text-sm mb-4">
            {insights.length} insights generated
          </p>

          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer"
                onClick={() => setCurrentInsight(insight)}
                whileHover={{ scale: 1.02, x: 10 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {CATEGORIES.find(c => c.id === insight.category)?.emoji}
                      </span>
                      <span className="text-purple-300 text-sm font-medium">
                        {CATEGORIES.find(c => c.id === insight.category)?.label}
                      </span>
                      {insight.model && (
                        <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full">
                          {insight.model}
                        </span>
                      )}
                    </div>
                    <p className="text-white font-medium mb-2">
                      {insight.query}
                    </p>
                    <p className="text-purple-400/70 text-sm line-clamp-2">
                      {insight.answer}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-green-400 font-bold mb-1">
                      💎 {insight.cost}
                    </div>
                    <div className="text-purple-400/70 text-xs">
                      {new Date(insight.timestamp).toLocaleDateString()}
                    </div>
                    <motion.button
                      className="mt-2 text-cyan-400 text-xs hover:text-cyan-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      👁️ View
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
