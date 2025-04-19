const axios = require('axios');

// Mock car data for testing
const mockCars = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 28500,
    mileage: 12500,
    engine: '2.5L 4-Cylinder',
    transmission: 'Automatic',
    color: 'Silver',
    interior: 'Black Leather',
    fuelType: 'Gasoline',
    description: 'Well-maintained Toyota Camry with low mileage. Features include backup camera, Bluetooth connectivity, and power windows.',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    make: 'Honda',
    model: 'Accord',
    year: 2021,
    price: 27000,
    mileage: 18000,
    engine: '1.5L Turbo',
    transmission: 'CVT',
    color: 'Blue',
    interior: 'Gray Cloth',
    fuelType: 'Gasoline',
    description: 'Honda Accord in excellent condition. Includes Honda Sensing safety suite, Apple CarPlay, and Android Auto.',
    imageUrl: 'https://images.unsplash.com/photo-1606152421802-cef5264300a8?w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    make: 'Ford',
    model: 'Mustang',
    year: 2020,
    price: 35000,
    mileage: 25000,
    engine: '5.0L V8',
    transmission: 'Manual',
    color: 'Red',
    interior: 'Black Leather',
    fuelType: 'Gasoline',
    description: 'Ford Mustang GT with powerful V8 engine. Features include SYNC infotainment system, backup camera, and premium sound system.',
    imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&auto=format&fit=crop'
  }
];

/**
 * Get all available cars
 * @param {number} limit - Optional limit on number of cars to return
 * @returns {Promise<Array>} Array of car objects
 */
async function getAllCars(limit = 10) {
  // If API endpoint is configured, fetch from API
  if (process.env.CAR_API_ENDPOINT) {
    try {
      const response = await axios.get(process.env.CAR_API_ENDPOINT, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cars from API:', error.message);
      // Fallback to mock data if API fails
      return mockCars.slice(0, limit);
    }
  }
  
  // Otherwise use mock data
  return mockCars.slice(0, limit);
}

/**
 * Get a specific car by ID
 * @param {number|string} id - The car ID to fetch
 * @returns {Promise<Object|null>} Car object or null if not found
 */
async function getCarById(id) {
  // Convert id to number if it's a string
  const carId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  // If API endpoint is configured, fetch from API
  if (process.env.CAR_API_ENDPOINT) {
    try {
      const response = await axios.get(`${process.env.CAR_API_ENDPOINT}/${carId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching car ID ${carId} from API:`, error.message);
      // Fallback to mock data if API fails
      return mockCars.find(car => car.id === carId) || null;
    }
  }
  
  // Otherwise use mock data
  return mockCars.find(car => car.id === carId) || null;
}

/**
 * Get newly added cars since a specific date
 * @param {Date} since - Date to check for new cars
 * @param {number} limit - Optional limit on number of cars to return
 * @returns {Promise<Array>} Array of car objects
 */
async function getNewCars(since = new Date(Date.now() - 86400000), limit = 5) {
  // This is a mock implementation - in a real API, you'd use the date parameter
  // to filter results based on 'created_at' or similar timestamp
  
  // For now, just return all mock cars
  return getAllCars(limit);
}

module.exports = {
  getAllCars,
  getCarById,
  getNewCars
};