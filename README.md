# Telegram Car Listing Bot

A Node.js bot that automatically posts car listings to a Telegram channel with interactive buttons.

## Features

- Posts car listings to a Telegram channel
- Interactive buttons that link to car details on your website
- Scheduled posting of new and featured cars
- Support for text and photo posts
- Customizable post format

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
4. Edit the `.env` file with your Telegram bot token and channel ID
5. Start the bot:
   ```
   npm start
   ```

## Getting a Telegram Bot Token

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Start a chat with BotFather and send `/newbot`
3. Follow the instructions to create your bot
4. Copy the token provided by BotFather into your `.env` file

## Finding Your Channel ID

For public channels:
- Simply use the channel username with @ (e.g., `@yourchannel`)

For private channels:
1. Add your bot to the channel as an administrator
2. Send a message to the channel
3. Visit `https://api.telegram.org/bot<YourBotToken>/getUpdates`
4. Look for the `chat` object and find the `id` field (it will be a negative number)

## Customizing Car Data

By default, the bot uses mock car data for testing. To connect it to your actual car database:

1. Set the `CAR_API_ENDPOINT` in your `.env` file
2. Ensure your API returns car objects in the expected format

## License

MIT