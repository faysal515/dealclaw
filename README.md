# WhatsApp Deal Finder

A Node.js application that connects to WhatsApp and automatically replies to messages from a specific number.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Azure OpenAI:**
   - Open `.env` file
   - Set the following variables:
     - `AZURE_OPENAI_API_KEY` - Your Azure OpenAI API key
     - `AZURE_OPENAI_ENDPOINT` - Your Azure OpenAI endpoint URL
     - `AZURE_OPENAI_DEPLOYMENT` - Your deployment name (e.g., gpt-4)

3. **Configure target number (optional):**
   - In `.env` file, set `TARGET_PHONE_NUMBER` to the WhatsApp number you want to auto-reply to
   - Format: `1234567890@c.us` (replace with actual number, no + or spaces)
   - Leave empty to reply to ALL incoming messages

4. **Run the application:**
   ```bash
   npm run dev
   ```

4. **Scan QR Code:**
   - A QR code will appear in your terminal
   - Open WhatsApp on your phone
   - Go to: Settings → Linked Devices → Link a Device
   - Scan the QR code

5. **Test it:**
   - Send a message asking about credit card deals (e.g., "I want cashback on groceries")
   - The bot will analyze your message using AI
   - It will reply with the best credit card deal suggestion in 1-2 sentences

## Scripts

- `npm run dev` - Run in development mode with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

## How it works

1. Connects to WhatsApp Web using `whatsapp-web.js`
2. Saves session data in `.wwebjs_auth/` (no need to scan QR every time)
3. Listens for incoming messages
4. When a message is received:
   - Loads credit card deals from `dataset.txt`
   - Sends the user's message + dataset to Azure OpenAI
   - AI analyzes the query and suggests the best matching deal
   - Shows typing indicator for 1-2 seconds
   - Replies with AI-generated suggestion (1-2 sentences)

## Dataset

The bot uses `dataset.txt` which contains UAE credit card benefits and deals. You can:
- Add more deals to the file
- Update existing deals
- The AI will automatically use the updated data (no code changes needed)

## Notes

- Session data is saved locally, so you only need to scan QR once
- Press `Ctrl+C` to stop the application gracefully
- The application will show all incoming messages in the console
