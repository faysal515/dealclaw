import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import * as dotenv from 'dotenv';
import { suggestBestDeal } from './ai';

// Load environment variables
dotenv.config();

const TARGET_PHONE_NUMBER = process.env.TARGET_PHONE_NUMBER || '';

console.log('🚀 Starting WhatsApp Deal Finder...');

// Track processed messages to avoid duplicates
const processedMessages = new Set<string>();

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize WhatsApp client with session persistence
const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: '.wwebjs_auth'
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// QR Code event - scan this with WhatsApp mobile app
client.on('qr', (qr) => {
  console.log('\n📱 Scan this QR code with WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\nOpen WhatsApp on your phone → Settings → Linked Devices → Link a Device');
});

// Ready event - client is authenticated and ready
client.on('ready', () => {
  console.log('✅ WhatsApp client is ready!');
  console.log(`📞 Listening for messages from: ${TARGET_PHONE_NUMBER || 'ALL NUMBERS (set TARGET_PHONE_NUMBER in .env)'}`);
});

// Authentication success
client.on('authenticated', () => {
  console.log('🔐 Authentication successful!');
});

// Authentication failure
client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed -', msg);
});

// Disconnected event
client.on('disconnected', (reason) => {
  console.log('⚠️  Client was disconnected:', reason);
});

// Message received event
client.on('message', async (message) => {
  try {
    // Check for duplicate messages
    if (processedMessages.has(message.id._serialized)) {
      console.log(`⏭️  Skipping duplicate message: ${message.id._serialized}`);
      return;
    }
    
    // Mark message as processed
    processedMessages.add(message.id._serialized);
    
    // Clean up old message IDs (keep only last 100)
    if (processedMessages.size > 100) {
      const firstItem = processedMessages.values().next().value;
      if (firstItem) {
        processedMessages.delete(firstItem);
      }
    }
    
    const chat = await message.getChat();
    const contact = await message.getContact();
    
    console.log(`\n📨 Message from: ${contact.pushname || contact.number}`);
    console.log(`   Number: ${message.from}`);
    console.log(`   Message: ${message.body}`);

    // Check if message is from the target number (or reply to all if not set)
    if (!TARGET_PHONE_NUMBER || message.from === TARGET_PHONE_NUMBER) {
      console.log('   ✉️  Preparing reply...');
      
      // Show typing indicator
      await chat.sendStateTyping();
      
      // Get AI suggestion based on user message
      console.log('   🤖 Analyzing message with AI...');
      const aiResponse = await suggestBestDeal(message.body);
      console.log(`   💡 AI Suggestion: ${aiResponse}`);
      
      // Wait 1-2 seconds (random)
      // const waitTime = 1000 + Math.random() * 1000; // 1000-2000ms
      // console.log(`   ⏳ Typing... (${Math.round(waitTime)}ms)`);
      // await delay(waitTime);
      
      // Reply with AI suggestion
      await message.reply(aiResponse);
      
      console.log('   ✅ Reply sent!');
    } else {
      console.log('   ⏭️  Skipping (not from target number)');
    }
  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
});

// Initialize the client
console.log('🔄 Initializing WhatsApp client...');
client.initialize();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await client.destroy();
  process.exit(0);
});
