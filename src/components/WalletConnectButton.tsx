'use client';

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { arcTestnet } from '@/config/chains';

export default function WalletConnectButton() {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const [showConnectors, setShowConnectors] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if on wrong network
  const isWrongNetwork = isConnected && chainId !== arcTestnet.id;

  // Show error toast if connection fails
  useEffect(() => {
    if (error) {
      toast.error(`Connection failed: ${error.message}`);
    }
  }, [error]);

  const handleConnect = async (connector: any) => {
    try {
      await connect({ connector });
      toast.success('Wallet connected! 🎉', {
        description: 'You can now make payments on Arc Network',
      });
      setShowConnectors(false);
    } catch (error: any) {
      console.error('Connection error:', error);
      toast.error(`Failed to connect: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: arcTestnet.id });
      toast.success('Switched to Arc Testnet! 🎉');
    } catch (error: any) {
      toast.error(`Failed to switch network: ${error.message}`);
    }
  };

  // Don't render until client-side
  if (!isClient) {
    return (
      <div className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
        <span className="text-white text-sm">Loading...</span>
      </div>
    );
  }

  // Connected state
  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2">
        {/* Wrong network warning */}
        {isWrongNetwork && (
          <motion.button
            onClick={handleSwitchNetwork}
            className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-full border border-yellow-500/30 transition-all duration-300 text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚠️ Switch to Arc
          </motion.button>
        )}

        {/* Connected address */}
        <motion.button
          onClick={handleDisconnect}
          className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-cyan-500/20 hover:from-green-500/30 hover:to-cyan-500/30 text-white rounded-full border border-green-500/30 transition-all duration-300 flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-mono text-sm">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="text-xs text-green-400">✓</span>
        </motion.button>
      </div>
    );
  }

  // Not connected state
  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowConnectors(!showConnectors)}
        disabled={isPending}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-full font-bold transition-all duration-300 flex items-center gap-2"
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' }}
        whileTap={{ scale: 0.95 }}
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <span>🔗</span>
            Connect Wallet
          </>
        )}
      </motion.button>

      {/* Connectors Dropdown */}
      <AnimatePresence>
        {showConnectors && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowConnectors(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 bg-purple-900/95 backdrop-blur-xl border-2 border-purple-500/50 rounded-2xl shadow-2xl p-4 min-w-[280px] z-50"
            >
              <p className="text-sm text-purple-300 mb-3 font-semibold">Choose Wallet:</p>
              
              {connectors.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-red-300 text-sm mb-2">No wallets detected</p>
                  <a 
                    href="https://metamask.io/download/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 text-xs underline"
                  >
                    Install MetaMask →
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  {connectors.map((connector) => {
                    const isReady = connector.type === 'injected' ? 
                      typeof window !== 'undefined' && window.ethereum : 
                      true;

                    return (
                      <motion.button
                        key={connector.uid}
                        onClick={() => handleConnect(connector)}
                        disabled={!isReady || isPending}
                        className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all duration-300 text-sm font-medium flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={isReady ? { scale: 1.02, x: 5 } : {}}
                        whileTap={isReady ? { scale: 0.98 } : {}}
                      >
                        <span className="text-xl">
                          {connector.name.includes('MetaMask') && '🦊'}
                          {connector.name.includes('WalletConnect') && '🔗'}
                          {connector.name.includes('Coinbase') && '💼'}
                          {connector.name.includes('Injected') && '💳'}
                        </span>
                        <div className="flex-1 text-left">
                          <div>{connector.name}</div>
                          {!isReady && (
                            <div className="text-xs text-red-400">Not installed</div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-purple-500/30">
                <p className="text-xs text-purple-400 text-center">
                  Secure connection via Arc Network
                </p>
                <a 
                  href="https://docs.arc.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 text-center block mt-1"
                >
                  Need help? →
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
