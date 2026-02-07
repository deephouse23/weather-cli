import ora from 'ora';
import httpClient from './api/http.js';
import { getApiKey } from './api/auth.js';
import { WeatherError, ERROR_CODES } from './utils/errors.js';
import { validateLocation, validateCoordinates } from './utils/validators.js';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Regional temperature units mapping
const FAHRENHEIT_COUNTRIES = new Set([
  'US',
  'USA',
  'BS',
  'BZ',
  'KY',
  'PW' // US, Bahamas, Belize, Cayman Islands, Palau
]);

// Temperature conversion utilities
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

// Detect regional temperature unit preference
function getRegionalTempUnit(countryCode) {
  return FAHRENHEIT_COUNTRIES.has(countryCode?.toUpperCase()) ? 'fahrenheit' : 'celsius';
}

// Convert temperature between units
function convertTemperature(temp, fromUnit, toUnit) {
  if (fromUnit === toUnit) return temp;

  if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
    return celsiusToFahrenheit(temp);
  } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
    return fahrenheitToCelsius(temp);
  }

  return temp;
}

// Determine display unit system
function determineDisplayUnits(countryCode, userPreference = null) {
  // Manual override takes precedence
  if (userPreference === 'fahrenheit' || userPreference === 'imperial') {
    return { api: 'imperial', display: 'fahrenheit' };
  }
  if (userPreference === 'celsius' || userPreference === 'metric') {
    return { api: 'metric', display: 'celsius' };
  }

  // Auto-detect based on country
  const regionalUnit = getRegionalTempUnit(countryCode);
  return {
    api: regionalUnit === 'fahrenheit' ? 'imperial' : 'metric',
    display: regionalUnit
  };
}

// Shared weather data fetching logic
async function _fetchWeatherData(locationParams, userUnits, locationLabel) {
  const apiKey = await getApiKey();
  const spinner = ora('Fetching weather data...').start();

  try {
    // Get current weather in metric first to determine country
    const weatherResponse = await httpClient.get(`${BASE_URL}/weather`, {
      params: {
        ...locationParams,
        appid: apiKey,
        units: 'metric'
      }
    });

    const countryCode = weatherResponse.data.sys.country;
    const unitSystem = determineDisplayUnits(countryCode, userUnits);

    // If we need different units than metric, fetch again
    let finalWeatherData = weatherResponse.data;
    if (unitSystem.api !== 'metric') {
      const weatherResponseFinal = await httpClient.get(`${BASE_URL}/weather`, {
        params: {
          ...locationParams,
          appid: apiKey,
          units: unitSystem.api
        }
      });
      finalWeatherData = weatherResponseFinal.data;
    }

    // Get 5-day forecast
    const forecastResponse = await httpClient.get(`${BASE_URL}/forecast`, {
      params: {
        ...locationParams,
        appid: apiKey,
        units: unitSystem.api
      }
    });

    // Get air pollution data for alerts (always uses coords)
    const pollutionResponse = await httpClient.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat: finalWeatherData.coord.lat,
        lon: finalWeatherData.coord.lon,
        appid: apiKey
      }
    });

    spinner.succeed(
      `Weather data fetched! Using ${unitSystem.display === 'fahrenheit' ? 'Fahrenheit' : 'Celsius'} for ${countryCode}`
    );

    return {
      current: finalWeatherData,
      forecast: forecastResponse.data,
      pollution: pollutionResponse.data,
      displayUnit: unitSystem.display,
      countryCode: countryCode
    };
  } catch (error) {
    spinner.fail('Failed to fetch weather data');

    if (error instanceof WeatherError) {
      throw error;
    }

    if (error.response?.status === 404) {
      throw new WeatherError(
        `Location "${locationLabel}" not found. Please check the spelling or try: "City, Country Code" (e.g., "San Ramon, US")`,
        ERROR_CODES.LOCATION_NOT_FOUND,
        404
      );
    } else if (error.response?.status === 401) {
      throw new WeatherError('Invalid API key', ERROR_CODES.API_KEY_INVALID, 401);
    } else if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new WeatherError('Request timed out. Please try again.', ERROR_CODES.NETWORK_ERROR);
    } else if (error.response?.status === 429) {
      throw new WeatherError(error.message, ERROR_CODES.RATE_LIMIT, 429);
    }

    throw new WeatherError(`Network error: ${error.message}`, ERROR_CODES.NETWORK_ERROR);
  }
}

// Fetch weather data by location
async function getWeather(location, userUnits = null) {
  const validatedLocation = validateLocation(location);
  return _fetchWeatherData({ q: validatedLocation }, userUnits, location);
}

// Get weather by coordinates
async function getWeatherByCoords(lat, lon, userUnits = null) {
  const { latitude, longitude } = validateCoordinates(lat, lon);
  return _fetchWeatherData({ lat: latitude, lon: longitude }, userUnits, `${lat},${lon}`);
}

export {
  getWeather,
  getWeatherByCoords,
  determineDisplayUnits,
  convertTemperature,
  celsiusToFahrenheit,
  fahrenheitToCelsius
};
