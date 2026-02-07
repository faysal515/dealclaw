import { suggestBestDeal } from './ai';

/**
 * Test function to demonstrate AI deal suggestion
 * Run with: npx ts-node src/test-ai.ts
 */
async function testDealSuggestion() {
  console.log('🧪 Testing AI Deal Suggestion\n');
  
  // Test message: "i want to do my fuel at adnoc"
  const testMessage = 'i want to do my fuel at adnoc';
  
  console.log(`📨 User Message: "${testMessage}"\n`);
  console.log('🤖 Analyzing with AI...\n');
  
  try {
    const suggestion = await suggestBestDeal(testMessage);
    
    console.log('✅ AI Response:');
    console.log('─'.repeat(60));
    console.log(suggestion);
    console.log('─'.repeat(60));
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testDealSuggestion();
