import { createAzure } from '@ai-sdk/azure';
import { generateText } from 'ai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Azure OpenAI client (matching working implementation)
const azure = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY || '',
  resourceName: 'sms-analyze',
});

// Use the model directly (not .chat())
const model = azure('gpt-5-nano');

// Load dataset
let datasetContent = '';
try {
  const datasetPath = path.join(__dirname, '..', 'dataset.txt');
  datasetContent = fs.readFileSync(datasetPath, 'utf-8');
} catch (error) {
  console.error('❌ Error loading dataset:', error);
}

/**
 * Analyzes user message and suggests the best credit card deal
 * @param userMessage - The message from the user
 * @returns AI-generated deal suggestion (1-2 sentences)
 */
export async function suggestBestDeal(userMessage: string): Promise<string> {
  try {
    const prompt = `You are a helpful friend who knows all about UAE credit card deals. Someone just sent you a message about what they want to buy - give them a quick, casual recommendation.

CREDIT CARD DEALS:
${datasetContent}

USER MESSAGE: "${userMessage}"

YOUR TASK:
1. Figure out what they're buying or where they're shopping from their message (could be a link, merchant name, or product type)
2. Suggest the BEST credit card for that purchase
3. Reply like you're texting a friend - casual, short, helpful

RESPONSE STYLE:
- Keep it to 1-2 short sentences max
- Be conversational and friendly (use "you'll get" instead of "offers")
- Just mention the card name and the key benefit number
- Skip unnecessary details like welcome bonuses unless super relevant
- Don't explain why - just tell them the best option

GOOD EXAMPLES:
- "Use Emirates Islamic Amazon card - you'll get 6% back on Amazon purchases 🎯"
- "FAB ADNOC card gives you 15% back on fuel there!"
- "Lulu Platinum card - 8 points per AED spent at Lulu 💳"

BAD EXAMPLES (too verbose):
- "Emirates Islamic Amazon World Credit Card gives you up to 6% back on Amazon.ae purchases (unlimited) with free for life annual fee. It's the best fit since..."
- "I recommend the FAB ADNOC Rewards Credit Card which offers 15% back on ADNOC fuel/services with a welcome bonus..."

Your response:`;

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
    });

    return text.trim();
  } catch (error) {
    console.error('❌ Error generating AI response:', error);
    return 'Sorry, I encountered an error processing your request. Please try again.';
  }
}
