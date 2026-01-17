import { defineChain } from 'viem';

// Arc Testnet Configuration
export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'USDC',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.network'],
    },
    public: {
      http: ['https://rpc.testnet.arc.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arc Explorer',
      url: 'https://explorer.testnet.arc.network',
    },
  },
  testnet: true,
});

// USDC Contract Address on Arc Testnet
export const USDC_CONTRACT_ADDRESS = '0x5b8E6D0a3E5a76be2a2e9f6B5a70e6D5e4d6E4E4'; // Replace with actual address from Arc docs

// Your recipient wallet address
export const RECIPIENT_WALLET_ADDRESS = process.env.NEXT_PUBLIC_RECIPIENT_WALLET || '0x4204fb1135416d5d845e4473a817ce14acad1078';
