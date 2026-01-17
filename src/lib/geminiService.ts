import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, InsightCategory, INSIGHT_CATEGORIES } from '@/config/gemini';
import { PAYMENT_CONFIG } from '@/config/circle';

const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);

export async function generateInsight(query: string, category: InsightCategory) {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.model });
    
    const prompt = buildPrompt(query, category);
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: GEMINI_CONFIG.maxTokens,
        temperature: GEMINI_CONFIG.temperature,
      },
    });
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to generate insight');
  }
}

function buildPrompt(query: string, category: InsightCategory): string {
  const categoryPrompts: Record<InsightCategory, string> = {
    [INSIGHT_CATEGORIES.CRYPTO]: 
      `You are a crypto market analyst. Provide a concise, professional analysis for: ${query}. 
      Include key metrics, trends, and actionable insights. Keep it under 400 words.`,
    
    [INSIGHT_CATEGORIES.MARKET]: 
      `You are a market sentiment analyst. Analyze the following query: ${query}. 
      Provide sentiment indicators, market mood, and potential implications. Keep it under 400 words.`,
    
    [INSIGHT_CATEGORIES.BUSINESS]: 
      `You are a business strategy consultant. Answer this query: ${query}. 
      Provide practical, actionable business advice. Keep it under 400 words.`,
    
    [INSIGHT_CATEGORIES.TECHNICAL]: 
      `You are a technical analyst. Analyze: ${query}. 
      Provide technical insights with data-driven recommendations. Keep it under 400 words.`,
    
    [INSIGHT_CATEGORIES.GENERAL]: 
      `Provide a clear, informative answer to: ${query}. 
      Be concise and professional. Keep it under 400 words.`,
  };
  
  return categoryPrompts[category] || categoryPrompts[INSIGHT_CATEGORIES.GENERAL];
}

export function calculateInsightPrice(query: string, category: InsightCategory): number {
  // Base price
  let price = PAYMENT_CONFIG.baseFee;
  
  // Add complexity based on query length and category
  const wordCount = query.split(' ').length;
  
  if (wordCount > 20) {
    price += PAYMENT_CONFIG.complexityMultiplier * 2;
  } else if (wordCount > 10) {
    price += PAYMENT_CONFIG.complexityMultiplier;
  }
  
  // Category-based pricing
  const categoryPricing: Record<InsightCategory, number> = {
    [INSIGHT_CATEGORIES.CRYPTO]: 0.08,
    [INSIGHT_CATEGORIES.MARKET]: 0.07,
    [INSIGHT_CATEGORIES.BUSINESS]: 0.06,
    [INSIGHT_CATEGORIES.TECHNICAL]: 0.09,
    [INSIGHT_CATEGORIES.GENERAL]: 0.05,
  };
  
  price = categoryPricing[category] || PAYMENT_CONFIG.baseFee;
  
  // Ensure price is within bounds
  return Math.min(Math.max(price, PAYMENT_CONFIG.minAmount), PAYMENT_CONFIG.maxAmount);
}
