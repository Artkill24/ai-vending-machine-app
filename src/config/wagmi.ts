'use client';

import { createConfig, http } from 'wagmi';
import { arcTestnet } from './chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// WalletConnect Project ID - Get from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const wagmiConfig = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected({
      target: 'metaMask',
    }),
    walletConnect({ 
      projectId,
      showQrModal: true,
      metadata: {
        name: 'AI Vending Machine',
        description: 'Pay-Per-Insight Oracle',
        url: 'https://ai-vending-machine.vercel.app',
        icons: ['https://avatars.githubusercontent.com/u/37784886']
      }
    }),
    coinbaseWallet({
      appName: 'AI Vending Machine',
    }),
  ],
  transports: {
    [arcTestnet.id]: http(),
  },
  ssr: false, // Important for proper detection
});
