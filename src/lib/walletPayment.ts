import { parseUnits } from 'viem';
import { USDC_CONTRACT_ADDRESS, RECIPIENT_WALLET_ADDRESS } from '@/config/chains';

// USDC ABI (only the functions we need)
const USDC_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function'
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function'
  }
] as const;

export interface PaymentParams {
  amount: string; // in USDC (e.g., "0.08")
  walletClient: any; // wagmi wallet client
  account: `0x${string}`;
}

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

/**
 * Send USDC payment on Arc Network
 */
export async function sendUSDCPayment({
  amount,
  walletClient,
  account,
}: PaymentParams): Promise<PaymentResult> {
  try {
    // Convert amount to USDC units (6 decimals)
    const amountInUnits = parseUnits(amount, 6);

    // Send USDC transfer transaction
    const hash = await walletClient.writeContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [RECIPIENT_WALLET_ADDRESS, amountInUnits],
      account,
    });

    return {
      success: true,
      txHash: hash,
    };
  } catch (error: any) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
}

/**
 * Get USDC balance for an address
 */
export async function getUSDCBalance(
  publicClient: any,
  address: `0x${string}`
): Promise<string> {
  try {
    const balance = await publicClient.readContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: USDC_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    // Convert from units to USDC (6 decimals)
    return (Number(balance) / 1_000_000).toFixed(2);
  } catch (error) {
    console.error('Balance fetch error:', error);
    return '0.00';
  }
}
