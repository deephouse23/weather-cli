import { WeatherError, ERROR_CODES } from './errors.js';

const UNSAFE_CHARS_REGEX = /[<>'"{}|\\\^`]/g;
const MAX_LOCATION_LENGTH = 100;

// Major cities that can be searched without country/state
const MAJOR_CITIES = new Set([
  'london', 'paris', 'tokyo', 'beijing', 'moscow', 'berlin', 'madrid', 'rome',
  'amsterdam', 'brussels', 'vienna', 'stockholm', 'oslo', 'copenhagen', 'dublin',
  'lisbon', 'athens', 'prague', 'budapest', 'warsaw', 'bucharest', 'helsinki',
  'sydney', 'melbourne', 'auckland', 'singapore', 'bangkok', 'jakarta', 'manila',
  'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune',
  'cairo', 'lagos', 'johannesburg', 'nairobi', 'casablanca', 'tunis', 'accra',
  'dubai', 'istanbul', 'jerusalem', 'tehran', 'baghdad', 'riyadh', 'doha',
  'toronto', 'vancouver', 'montreal', 'ottawa', 'calgary', 'edmonton', 'quebec',
  'chicago', 'houston', 'phoenix', 'philadelphia', 'dallas', 'austin', 'seattle',
  'boston', 'atlanta', 'miami', 'denver', 'detroit', 'minneapolis', 'portland'
]);

export function sanitizeLocation(location) {
  if (typeof location !== 'string') {
    throw new WeatherError('Location must be a string', ERROR_CODES.INVALID_INPUT);
  }
  
  return location
    .replace(UNSAFE_CHARS_REGEX, '')
    .trim()
    .slice(0, MAX_LOCATION_LENGTH);
}

export function validateLocation(location) {
  const sanitized = sanitizeLocation(location);

  if (!sanitized) {
    throw new WeatherError('Location cannot be empty', ERROR_CODES.INVALID_INPUT);
  }

  // Allow major cities to be searched without country/state
  if (!sanitized.includes(',')) {
    const lowerLocation = sanitized.toLowerCase();
    if (MAJOR_CITIES.has(lowerLocation)) {
      return sanitized; // Allow single-word major cities
    }

    throw new WeatherError(
      `Location "${sanitized}" not recognized. For smaller cities, please use: "City, State" or "City, Country"`,
      ERROR_CODES.INVALID_INPUT
    );
  }

  return sanitized;
}

export function validateCoordinates(lat, lon) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new WeatherError(
      'Invalid coordinates. Both latitude and longitude must be numbers',
      ERROR_CODES.INVALID_INPUT
    );
  }
  
  if (latitude < -90 || latitude > 90) {
    throw new WeatherError(
      'Invalid latitude. Must be between -90 and 90',
      ERROR_CODES.INVALID_INPUT
    );
  }
  
  if (longitude < -180 || longitude > 180) {
    throw new WeatherError(
      'Invalid longitude. Must be between -180 and 180',
      ERROR_CODES.INVALID_INPUT
    );
  }
  
  return { latitude, longitude };
}