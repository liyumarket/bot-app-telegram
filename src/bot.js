const TelegramBot = require('node-telegram-bot-api');
const { formatCarPost } = require('./postFormatter');

class Bot {
  constructor() {
    // Check if the token is provided
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is required in .env file');
    }
    
    if (!process.env.TELEGRAM_CHANNEL_ID) {
      throw new Error('TELEGRAM_CHANNEL_ID is required in .env file');
    }

    // Initialize the bot with token and additional error handling
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
      polling: true,
      request: {
        timeout: 30000, // 30 second timeout
        retry: 3 // Retry failed requests up to 3 times
      }
    });
    this.channelId = process.env.TELEGRAM_CHANNEL_ID;
    this.isConnected = false;
  }

  async start() {
    // Set up event handlers
    this.setupEventHandlers();
    
    // Test the connection with retries
    let retries = 3;
    while (retries > 0 && !this.isConnected) {
      try {
        const botInfo = await this.bot.getMe();
        console.log(`Connected as @${botInfo.username}`);
        this.isConnected = true;
        return botInfo;
      } catch (error) {
        retries--;
        if (retries === 0) {
          console.error('Failed to connect to Telegram after multiple attempts:', error.message);
          console.log('Please verify your TELEGRAM_BOT_TOKEN is correct and the bot is active in BotFather');
          throw error;
        }
        console.log(`Connection attempt failed, retrying... (${retries} attempts remaining)`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds between retries
      }
    }
  }

  setupEventHandlers() {
    // Handle errors
    this.bot.on('error', (error) => {
      console.error('Telegram bot error:', error.message);
      if (error.code === 'ETELEGRAM' && error.response.statusCode === 404) {
        console.error('Bot token may be invalid or revoked. Please check with BotFather.');
        this.isConnected = false;
      }
    });
    
    // Handle polling errors
    this.bot.on('polling_error', (error) => {
      console.error('Polling error:', error.message);
      if (error.code === 'ETELEGRAM' && error.response?.statusCode === 404) {
        console.error('Bot token may be invalid or revoked. Please check with BotFather.');
        this.isConnected = false;
        // Stop polling on critical errors
        this.bot.stopPolling();
      }
    });
    
    // You can add more event handlers as needed
  }

  /**
   * Post a car listing to the channel
   * @param {Object} car - The car object with details
   * @returns {Promise<Object>} - The sent message
   */
  async postCarToChannel(car) {
    if (!this.isConnected) {
      throw new Error('Bot is not connected to Telegram. Please check your token and connection.');
    }

    try {
      // Format the car post (text and inline keyboard)
      const { text, inlineKeyboard } = formatCarPost(car);
      
      // Send the message to the channel
      const sentMessage = await this.bot.sendMessage(
        this.channelId,
        text,
        {
          parse_mode: 'HTML',
          disable_web_page_preview: false, // Enable preview if car has image URL in text
          reply_markup: {
            inline_keyboard: inlineKeyboard
          }
        }
      );
      
      return sentMessage;
    } catch (error) {
      console.error(`Error posting car ${car.id} to channel:`, error.message);
      throw error;
    }
  }
  
  /**
   * Post a car listing with photo to the channel
   * @param {Object} car - The car object with details
   * @returns {Promise<Object>} - The sent message
   */
  async postCarWithPhotoToChannel(car) {
    if (!this.isConnected) {
      throw new Error('Bot is not connected to Telegram. Please check your token and connection.');
    }

    if (!car.imageUrl) {
      return this.postCarToChannel(car);
    }
    
    try {
      // Format the car post (text and inline keyboard)
      const { text, inlineKeyboard } = formatCarPost(car, true);
      
      // Send the photo with caption to the channel
      const sentMessage = await this.bot.sendPhoto(
        this.channelId,
        car.imageUrl,
        {
          caption: text,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: inlineKeyboard
          }
        }
      );
      
      return sentMessage;
    } catch (error) {
      console.error(`Error posting car photo ${car.id} to channel:`, error.message);
      // Fallback to text-only post if photo fails
      return this.postCarToChannel(car);
    }
  }
}

module.exports = Bot;