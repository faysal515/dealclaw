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
    const prompt = `You are a helpful credit card deals assistant for UAE banks.

USER DATASET (Credit Card Benefits):
${datasetContent}

USER MESSAGE: "${userMessage}"

TASK: Based on the user's message, analyze what they're looking for and suggest the BEST credit card deal from the dataset above. 

RULES:
- Respond in 1-2 sentences maximum
- Be specific about the card name and key benefit
- If the message is unclear or not related to credit cards, politely ask what they're looking for
- Focus on the most relevant benefit to their query

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
