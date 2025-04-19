require('dotenv').config();
const Bot = require('./src/bot');
const { schedulePostings } = require('./src/scheduler');

// Initialize the bot
const bot = new Bot();

// Start the bot
bot.start()
  .then(() => {
    console.log('Bot started successfully!');
    
    // Schedule regular postings (can be adjusted as needed)
    schedulePostings(bot);
    
    // Example of how to manually post a car (for testing)
    if (process.env.NODE_ENV === 'development') {
      const { getCarById } = require('./src/carData');
      setTimeout(async () => {
        try {
          const car = await getCarById(1); // Example with ID 1
          if (car) {
            await bot.postCarToChannel(car);
            console.log('Test car posted successfully');
          }
        } catch (error) {
          console.error('Error posting test car:', error.message);
        }
      }, 3000);
    }
  })
  .catch(error => {
    console.error('Failed to start bot:', error.message);
  });

// Handle application shutdown
process.on('SIGINT', () => {
  console.log('Bot is shutting down...');
  process.exit(0);
});