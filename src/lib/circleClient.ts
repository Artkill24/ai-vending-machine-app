import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets';
import { CIRCLE_CONFIG } from '@/config/circle';

let circleClient: ReturnType<typeof initiateDeveloperControlledWalletsClient> | null = null;

export function getCircleClient() {
  if (!circleClient) {
    circleClient = initiateDeveloperControlledWalletsClient({
      apiKey: CIRCLE_CONFIG.apiKey,
      entitySecret: CIRCLE_CONFIG.entitySecret,
    });
  }
  return circleClient;
}

export async function getWalletBalance(walletId: string) {
  try {
    const client = getCircleClient();
    const response = await client.getWallet({ id: walletId });
    return response.data?.wallet;
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    throw error;
  }
}
