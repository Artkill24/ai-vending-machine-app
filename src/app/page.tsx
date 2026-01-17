'use client';

import ReferralSystem from '@/components/ReferralSystem';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import OracleInterface from '@/components/OracleInterface';
import WalletConnectButton from '@/components/WalletConnectButton';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              🔮 AI Oracle
            </h1>
            <p className="text-xl text-purple-300 mb-6">
              Pay-Per-Insight • Powered by Arc & Gemini
            </p>

            <div className="min-h-[32px] flex items-center justify-center">
              {isClient && isConnected && address ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 bg-green-500/10 backdrop-blur-xl px-4 py-2 rounded-full border border-green-500/30 text-green-300 text-sm"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Wallet Connected • Ready to Pay</span>
                </motion.div>
              ) : isClient && !isConnected ? (
                <div className="text-purple-400/50 text-sm">
                  👆 Connect wallet to start
                </div>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <WalletConnectButton />
          </motion.div>
        </div>

        <OracleInterface />
        <ReferralSystem />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center text-purple-400/60 text-sm"
        >
          <p className="mb-2">
            Powered by Circle Arc • Gemini AI • USDC
          </p>
          <p className="text-xs opacity-50">
            BUILT FOR AGENTIC COMMERCE HACKATHON 2026
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
