const cron = require('node-cron');
const { getAllCars, getNewCars } = require('./carData');

/**
 * Schedule regular postings of cars to the Telegram channel
 * @param {Object} bot - The bot instance
 */
function schedulePostings(bot) {
  // Schedule posting of new cars daily at 10:00 AM
  // Cron format: minute hour day-of-month month day-of-week
  cron.schedule('0 10 * * *', async () => {
    try {
      console.log('Running scheduled posting of new cars...');
      
      // Get new cars from the last 24 hours
      const yesterday = new Date(Date.now() - 86400000); // 24 hours ago
      const newCars = await getNewCars(yesterday, 3); // Limit to 3 new cars per day
      
      if (newCars.length === 0) {
        console.log('No new cars found to post');
        return;
      }
      
      // Post each car with a delay to avoid spam detection
      for (let i = 0; i < newCars.length; i++) {
        const car = newCars[i];
        
        // Wait 2 seconds between posts
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Post with photo if available
        if (car.imageUrl) {
          await bot.postCarWithPhotoToChannel(car);
        } else {
          await bot.postCarToChannel(car);
        }
        
        console.log(`Posted car ID ${car.id} to channel`);
      }
      
      console.log(`Posted ${newCars.length} new cars to channel`);
    } catch (error) {
      console.error('Error in scheduled posting:', error.message);
    }
  });
  
  // Schedule a featured car post every Wednesday and Saturday at 3:00 PM
  cron.schedule('0 15 * * 3,6', async () => {
    try {
      console.log('Posting featured car...');
      
      // Get all cars and select a random one to feature
      const allCars = await getAllCars();
      const randomIndex = Math.floor(Math.random() * allCars.length);
      const featuredCar = allCars[randomIndex];
      
      // Add featured tag to the car
      featuredCar.description = `🌟 FEATURED CAR 🌟\n\n${featuredCar.description || ''}`;
      
      // Post with photo if available
      if (featuredCar.imageUrl) {
        await bot.postCarWithPhotoToChannel(featuredCar);
      } else {
        await bot.postCarToChannel(featuredCar);
      }
      
      console.log(`Posted featured car ID ${featuredCar.id} to channel`);
    } catch (error) {
      console.error('Error posting featured car:', error.message);
    }
  });
  
  console.log('Car posting schedule initialized');
}

/**
 * Post a single car manually (useful for testing or one-off posts)
 * @param {Object} bot - The bot instance
 * @param {number|string} carId - The ID of the car to post
 * @returns {Promise<Object>} The result of the posting operation
 */
async function postCarManually(bot, carId) {
  const { getCarById } = require('./carData');
  
  try {
    const car = await getCarById(carId);
    if (!car) {
      throw new Error(`Car with ID ${carId} not found`);
    }
    
    // Post with photo if available
    if (car.imageUrl) {
      return await bot.postCarWithPhotoToChannel(car);
    } else {
      return await bot.postCarToChannel(car);
    }
  } catch (error) {
    console.error(`Error posting car ${carId} manually:`, error.message);
    throw error;
  }
}

module.exports = {
  schedulePostings,
  postCarManually
};