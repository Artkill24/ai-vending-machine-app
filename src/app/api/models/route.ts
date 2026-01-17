import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

export async function GET() {
  if (!apiKey) {
    return NextResponse.json({
      error: 'GEMINI_API_KEY not configured',
      suggestion: 'Add your API key to .env.local',
    }, { status: 500 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = await genAI.listModels();
    
    const generativeModels = models.filter(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    );

    return NextResponse.json({
      success: true,
      count: generativeModels.length,
      models: generativeModels.map(m => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description,
      })),
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      suggestion: 'Check your API key validity',
    }, { status: 500 });
  }
}
