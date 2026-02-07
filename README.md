# WhatsApp Deal Finder

A Node.js application that connects to WhatsApp and automatically replies to messages from a specific number.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure target number:**
   - Open `.env` file
   - Set `TARGET_PHONE_NUMBER` to the WhatsApp number you want to auto-reply to
   - Format: `1234567890@c.us` (replace with actual number, no + or spaces)
   - Leave empty to reply to ALL incoming messages

3. **Run the application:**
   ```bash
   npm run dev
   ```

4. **Scan QR Code:**
   - A QR code will appear in your terminal
   - Open WhatsApp on your phone
   - Go to: Settings → Linked Devices → Link a Device
   - Scan the QR code

5. **Test it:**
   - Send a message from the configured number
   - The bot will reply with "hi"

## Scripts

- `npm run dev` - Run in development mode with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build

## How it works

1. Connects to WhatsApp Web using `whatsapp-web.js`
2. Saves session data in `.wwebjs_auth/` (no need to scan QR every time)
3. Listens for incoming messages
4. If message is from target number (or any number if not configured), replies with "hi"

## Notes

- Session data is saved locally, so you only need to scan QR once
- Press `Ctrl+C` to stop the application gracefully
- The application will show all incoming messages in the console
