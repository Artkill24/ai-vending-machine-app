kimport { NextResponse } from 'next/server';

export async function GET() {
  // Hardcoded list of available models
  const models = [
    {
      name: 'models/gemini-2.0-flash-lite',
      displayName: 'Flash Lite',
      description: 'Fast and efficient',
      supportedGenerationMethods: ['generateContent']
    },
    {
      name: 'models/gemini-2.0-flash-exp',
      displayName: 'Flash 2.5',
      description: 'Balanced performance',
      supportedGenerationMethods: ['generateContent']
    },
    {
      name: 'models/gemini-exp-1206',
      displayName: 'Flash 3.0',
      description: 'Most capable',
      supportedGenerationMethods: ['generateContent']
    }
  ];

  return NextResponse.json({ models });
}
