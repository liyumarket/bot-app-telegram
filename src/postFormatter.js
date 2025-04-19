/**
 * Formats a car object into a structured Telegram post
 * @param {Object} car - The car object with details
 * @param {boolean} isPhotoPost - Whether this is for a photo post (shorter caption)
 * @returns {Object} Object containing text and inlineKeyboard
 */
function formatCarPost(car, isPhotoPost = false) {
  // Create buttons that link to the car detail page
  const detailUrl = `${process.env.WEBSITE_BASE_URL}/cars/${car.id}`;
  
  const inlineKeyboard = [
    [
      {
        text: '🔍 View Details',
        url: detailUrl
      }
    ],
    [
      {
        text: '💰 Check Price',
        url: `${detailUrl}#price`
      },
      {
        text: '📞 Contact Seller',
        url: `${detailUrl}#contact`
      }
    ]
  ];

  // For photo posts, we need a shorter caption
  if (isPhotoPost) {
    const text = `<b>${car.year} ${car.make} ${car.model}</b>\n` +
      `💰 <b>Price:</b> ${formatPrice(car.price)}\n` +
      `🛣️ <b>Mileage:</b> ${formatMileage(car.mileage)}\n` +
      `⚙️ <b>Transmission:</b> ${car.transmission || 'N/A'}\n` +
      `🌈 <b>Color:</b> ${car.color || 'N/A'}`;
    
    return { text, inlineKeyboard };
  }
  
  // Full text post with more details
  const text = `<b>🚗 NEW LISTING: ${car.year} ${car.make} ${car.model}</b>\n\n` +
    `💰 <b>Price:</b> ${formatPrice(car.price)}\n` +
    `🛣️ <b>Mileage:</b> ${formatMileage(car.mileage)}\n` +
    `🔧 <b>Engine:</b> ${car.engine || 'N/A'}\n` +
    `⚙️ <b>Transmission:</b> ${car.transmission || 'N/A'}\n` +
    `🌈 <b>Exterior Color:</b> ${car.color || 'N/A'}\n` +
    `🪑 <b>Interior:</b> ${car.interior || 'N/A'}\n` +
    `⛽ <b>Fuel Type:</b> ${car.fuelType || 'N/A'}\n\n` +
    (car.description ? `${car.description.substring(0, 200)}${car.description.length > 200 ? '...' : ''}\n\n` : '') +
    `<i>Click the button below to see more details!</i>`;

  return { text, inlineKeyboard };
}

/**
 * Format price with currency symbol
 * @param {number|string} price - The price to format
 * @returns {string} Formatted price
 */
function formatPrice(price) {
  if (!price) return 'Contact for Price';
  
  // Convert to number if it's a string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // Format with currency symbol and thousands separators
  return numPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
}

/**
 * Format mileage with commas and units
 * @param {number|string} mileage - The mileage to format
 * @returns {string} Formatted mileage
 */
function formatMileage(mileage) {
  if (!mileage) return 'N/A';
  
  // Convert to number if it's a string
  const numMileage = typeof mileage === 'string' ? parseFloat(mileage) : mileage;
  
  // Format with thousands separators and add 'mi' suffix
  return `${numMileage.toLocaleString('en-US')} mi`;
}

module.exports = {
  formatCarPost
};