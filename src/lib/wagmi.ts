export const arcTestnet = {
  id: 5042002, // CORRETTO!
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 6, // USDC has 6 decimals
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
} as const satisfies Chain;
