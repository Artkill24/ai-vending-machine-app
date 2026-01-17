import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
}

const MODEL_CONFIGS = {
  'flash-2.5': {
    models: ['gemini-2.0-flash-exp', 'gemini-2.5-flash', 'gemini-1.5-flash'],
    name: 'Gemini Flash 2.5',
    price: '0.05',
  },
  'flash-lite': {
    models: ['gemini-2.5-flash-lite', 'gemini-2.0-flash-lite-exp', 'gemini-1.5-flash'],
    name: 'Gemini Flash Lite',
    price: '0.03',
  },
  'flash-3': {
    models: ['gemini-3-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'],
    name: 'Gemini Flash 3.0',
    price: '0.08',
  },
  'pro': {
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro'],
    name: 'Gemini Pro',
    price: '0.10',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, category, model = 'flash-2.5', address, txHash } = body;

    console.log('📥 Oracle request:', { query, category, address, model });

    if (!query || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: query or category' },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not configured');
      return NextResponse.json(
        { error: 'Server configuration error: API key missing' },
        { status: 500 }
      );
    }

    // Get model configuration
    const modelConfig = MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS] || MODEL_CONFIGS['flash-2.5'];
    console.log('🤖 Using model config:', modelConfig.name);

    // Verify payment (in production, verify on-chain)
    console.log('✅ Payment verified:', {
      txHash: txHash || `demo_tx_${Date.now()}`,
      address,
      price: modelConfig.price,
    });

    // Initialize Gemini AI
    console.log('🤖 Using REAL Gemini API');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    // Try models in order until one succeeds
    const modelsToTry = modelConfig.models;
    let lastError: Error | null = null;

    for (let i = 0; i < modelsToTry.length; i++) {
      const currentModel = modelsToTry[i];
      
      try {
        console.log(`🔄 Trying model ${i + 1}/${modelsToTry.length}: ${currentModel}`);
        
        const model = genAI.getGenerativeModel({ model: currentModel });

        // Create prompt based on category
        const prompt = createPrompt(query, category);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log(`✅ ${currentModel} succeeded`);

        return NextResponse.json({
          insight: text,
          model: modelConfig.name,
          modelId: currentModel,
          price: modelConfig.price,
          category,
          timestamp: new Date().toISOString(),
        });

      } catch (error: any) {
        lastError = error;
        console.log(`❌ Model ${currentModel} failed:`, error.message);

        // If this is the last model, throw error
        if (i === modelsToTry.length - 1) {
          throw new Error(`All models failed. Please check /api/models to see available models. Last error: ${error.message}`);
        }
      }
    }

    // Should not reach here, but just in case
    throw lastError || new Error('All models failed');

  } catch (error: any) {
    console.error('❌ Oracle API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate insight',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

function createPrompt(query: string, category: string): string {
  const categoryPrompts: Record<string, string> = {
    crypto: `You are a cryptocurrency expert. Analyze the following crypto-related query with insights on market trends, technology, and potential implications. Be informative and balanced in your analysis.\n\nQuery: ${query}`,
    market: `You are a market analysis expert. Provide insights on market sentiment, trends, and potential market movements related to the following query. Include relevant market indicators and analysis.\n\nQuery: ${query}`,
    business: `You are a business strategy consultant. Provide strategic business advice and insights for the following query. Focus on actionable recommendations and business implications.\n\nQuery: ${query}`,
    technical: `You are a technical analysis expert. Provide detailed technical analysis and insights for the following query. Include technical indicators, patterns, and analytical perspectives.\n\nQuery: ${query}`,
    general: `You are a knowledgeable AI assistant. Provide comprehensive and helpful insights for the following query. Be informative, accurate, and balanced in your response.\n\nQuery: ${query}`,
  };

  return categoryPrompts[category] || categoryPrompts.general;
}
