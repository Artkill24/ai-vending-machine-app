import { NextRequest, NextResponse } from 'next/server';
import { calculateInsightPrice } from '@/lib/geminiService';
import { INSIGHT_CATEGORIES, InsightCategory } from '@/config/gemini';
import { CIRCLE_CONFIG } from '@/config/circle';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category } = body;
    
    if (!query || !category) {
      return NextResponse.json(
        { error: 'Query and category are required' },
        { status: 400 }
      );
    }
    
    // Validate category
    if (!Object.values(INSIGHT_CATEGORIES).includes(category as InsightCategory)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }
    
    // Calculate price
    const amount = calculateInsightPrice(query, category as InsightCategory);
    
    // Generate payment ID
    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Return quote
    return NextResponse.json({
      amount,
      currency: 'USDC',
      recipient: CIRCLE_CONFIG.walletAddress,
      paymentId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
      query,
      category,
    });
  } catch (error) {
    console.error('Quote error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    );
  }
}
