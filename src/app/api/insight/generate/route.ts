import { NextRequest, NextResponse } from 'next/server';
import { generateInsight, calculateInsightPrice } from '@/lib/geminiService';
import { InsightCategory } from '@/config/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, paymentId, txHash } = body;
    
    if (!query || !category || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In production, verify payment here with txHash
    // For MVP, we'll proceed with generation
    
    console.log(`Generating insight for payment: ${paymentId}`);
    
    // Generate insight with Gemini
    const insight = await generateInsight(query, category as InsightCategory);
    const cost = calculateInsightPrice(query, category as InsightCategory);
    
    return NextResponse.json({
      insight,
      query,
      category,
      cost,
      transactionId: txHash || paymentId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    );
  }
}
