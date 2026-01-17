import { NextResponse } from 'next/server';
import { getWalletBalance } from '@/lib/circleClient';
import { CIRCLE_CONFIG } from '@/config/circle';

export async function GET() {
  try {
    const wallet = await getWalletBalance(CIRCLE_CONFIG.walletId);
    
    return NextResponse.json({
      walletId: wallet?.id,
      address: wallet?.address,
      blockchain: wallet?.blockchain,
      state: wallet?.state,
    });
  } catch (error) {
    console.error('Balance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet balance' },
      { status: 500 }
    );
  }
}
