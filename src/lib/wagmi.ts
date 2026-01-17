import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { type Chain } from 'viem'

export const arcTestnet = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 6,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
    public: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
  },
  testnet: true,
} as const satisfies Chain

export const config = getDefaultConfig({
  appName: 'AI Vending Machine Oracle',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [arcTestnet],
  ssr: true,
})
