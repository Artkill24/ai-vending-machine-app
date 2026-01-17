'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ReferralData {
  code: string;
  totalReferrals: number;
  totalEarned: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
}

export default function ReferralSystem() {
  const { address, isConnected } = useAccount();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      loadReferralData();
    }
  }, [isConnected, address]);

  const loadReferralData = () => {
    // Generate unique referral code from address
    const code = address?.slice(2, 8).toUpperCase() || '';
    
    // Load from localStorage (later: API)
    const saved = localStorage.getItem(`referral_${address}`);
    if (saved) {
      setReferralData(JSON.parse(saved));
    } else {
      const newData: ReferralData = {
        code,
        totalReferrals: 0,
        totalEarned: '0.00',
        tier: 'bronze',
        points: 0,
      };
      setReferralData(newData);
      localStorage.setItem(`referral_${address}`, JSON.stringify(newData));
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralData?.code}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!', {
      description: 'Share it to earn 10% cashback',
    });
  };

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'from-orange-600 to-orange-400',
      silver: 'from-gray-400 to-gray-200',
      gold: 'from-yellow-600 to-yellow-400',
      platinum: 'from-purple-600 to-pink-400',
    };
    return colors[tier as keyof typeof colors] || colors.bronze;
  };

  const getTierEmoji = (tier: string) => {
    const emojis = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      platinum: '💎',
    };
    return emojis[tier as keyof typeof emojis] || '🥉';
  };

  if (!isConnected || !referralData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto mt-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          🎁 Rewards & Referrals
        </h2>
        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getTierColor(referralData.tier)} text-white font-bold`}>
          {getTierEmoji(referralData.tier)} {referralData.tier.toUpperCase()}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Referral Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 backdrop-blur-xl rounded-3xl p-6 border-2 border-purple-500/30"
        >
          <h3 className="text-xl font-bold text-cyan-300 mb-4">
            💰 Your Referral Code
          </h3>
          
          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2 tracking-widest">
                {referralData.code}
              </div>
              <div className="text-purple-400 text-sm">
                Share this code and earn 10% cashback!
              </div>
            </div>
          </div>

          <button
            onClick={copyReferralLink}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold transition-all"
          >
            📋 Copy Referral Link
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-cyan-400 text-2xl font-bold">
                {referralData.totalReferrals}
              </div>
              <div className="text-purple-400 text-xs">Referrals</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-green-400 text-2xl font-bold">
                ${referralData.totalEarned}
              </div>
              <div className="text-purple-400 text-xs">Earned</div>
            </div>
          </div>
        </motion.div>

        {/* Loyalty Points Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-pink-900/50 to-orange-900/50 backdrop-blur-xl rounded-3xl p-6 border-2 border-pink-500/30"
        >
          <h3 className="text-xl font-bold text-orange-300 mb-4">
            ⭐ Loyalty Points
          </h3>

          <div className="bg-black/30 rounded-xl p-4 mb-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">
                {referralData.points}
              </div>
              <div className="text-pink-400 text-sm">
                Total Points Earned
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
              <span className="text-purple-300 text-sm">100 points</span>
              <span className="text-cyan-400 text-sm font-bold">1 Free Flash Lite</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
              <span className="text-purple-300 text-sm">500 points</span>
              <span className="text-cyan-400 text-sm font-bold">1 Free Flash 2.5</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-3">
              <span className="text-purple-300 text-sm">1000 points</span>
              <span className="text-cyan-400 text-sm font-bold">VIP Tier Upgrade</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/20"
      >
        <h3 className="text-xl font-bold text-purple-300 mb-4">
          📚 How Rewards Work
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl p-4">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="text-white font-bold mb-2">Referral Rewards</h4>
            <p className="text-purple-300 text-sm">
              Earn 10% cashback in USDC for every payment made by your referrals. No limits!
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/30 to-orange-900/30 rounded-xl p-4">
            <div className="text-3xl mb-2">⭐</div>
            <h4 className="text-white font-bold mb-2">Loyalty Points</h4>
            <p className="text-purple-300 text-sm">
              Earn 1 point per $0.01 spent. Redeem points for free queries and tier upgrades.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4">
            <div className="text-3xl mb-2">🏅</div>
            <h4 className="text-white font-bold mb-2">VIP Tiers</h4>
            <p className="text-purple-300 text-sm">
              Unlock exclusive benefits: discounts, priority access, and premium models.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
