import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.WEATHER_API_KEY;

// Regional temperature units mapping
const FAHRENHEIT_COUNTRIES = new Set([
  'US', 'USA', 'BS', 'BZ', 'KY', 'PW'  // US, Bahamas, Belize, Cayman Islands, Palau
]);

// Temperature conversion utilities
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
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

// Get weather by coordinates
async function getWeatherByCoords(lat, lon, userUnits = null) {
  if (!API_KEY) {
    console.error(chalk.red('❌ No API key found. Please set WEATHER_API_KEY in your .env file'));
    console.log(chalk.yellow('Get your free API key at: https://openweathermap.org/api'));
    process.exit(1);
  }

  const spinner = ora('Fetching weather data...').start();
  
  try {
    // Get current weather (metric first to determine country)
    const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const countryCode = weatherResponse.data.sys.country;
    const unitSystem = determineDisplayUnits(countryCode, userUnits);
    
    // Get final weather data in correct units
    let finalWeatherData = weatherResponse.data;
    if (unitSystem.api !== 'metric') {
      const weatherResponseFinal = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: unitSystem.api
        }
      });
      finalWeatherData = weatherResponseFinal.data;
    }

    // Get 5-day forecast
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: unitSystem.api
      }
    });

    // Get air pollution data for alerts
    const pollutionResponse = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_KEY
      }
    });

    spinner.succeed(`Weather data fetched! Using ${unitSystem.display === 'fahrenheit' ? 'Fahrenheit' : 'Celsius'} for ${countryCode}`);
    return {
      current: finalWeatherData,
      forecast: forecastResponse.data,
      pollution: pollutionResponse.data,
      displayUnit: unitSystem.display,
      countryCode: countryCode
    };
  } catch (error) {
    spinner.fail('Failed to fetch weather data');
    console.error(chalk.red('❌ Error:', error.message));
    process.exit(1);
  }
}

// Fetch weather data by location
async function getWeather(location, userUnits = null) {
  if (!API_KEY) {
    console.error(chalk.red('❌ No API key found. Please set WEATHER_API_KEY in your .env file'));
    console.log(chalk.yellow('Get your free API key at: https://openweathermap.org/api'));
    process.exit(1);
  }

  // Validate location format (require city, state/country)
  if (!location || !location.includes(',')) {
    console.error(chalk.red('❌ Invalid location format. Please use: "City, State" or "City, Country"'));
    console.log(chalk.yellow('Examples: "San Ramon, CA" or "London, UK" or "Tokyo, JP"'));
    process.exit(1);
  }

  const spinner = ora('Fetching weather data...').start();
  
  try {
    // First, get location info to determine regional preferences
    const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric' // Always fetch in metric first to get country code
      }
    });

    const countryCode = weatherResponse.data.sys.country;
    const unitSystem = determineDisplayUnits(countryCode, userUnits);
    
    // If we need different units than metric, fetch again
    let finalWeatherData = weatherResponse.data;
    let forecastData, pollutionData;
    
    if (unitSystem.api !== 'metric') {
      const weatherResponseFinal = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: location,
          appid: API_KEY,
          units: unitSystem.api
        }
      });
      finalWeatherData = weatherResponseFinal.data;
    }

    // Get 5-day forecast
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: API_KEY,
        units: unitSystem.api
      }
    });

    // Get air pollution data for alerts
    const pollutionResponse = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat: finalWeatherData.coord.lat,
        lon: finalWeatherData.coord.lon,
        appid: API_KEY
      }
    });

    spinner.succeed(`Weather data fetched! Using ${unitSystem.display === 'fahrenheit' ? 'Fahrenheit' : 'Celsius'} for ${countryCode}`);
    
    const data = {
      current: finalWeatherData,
      forecast: forecastResponse.data,
      pollution: pollutionResponse.data,
      displayUnit: unitSystem.display,
      countryCode: countryCode
    };
    
    return data;
  } catch (error) {
    spinner.fail('Failed to fetch weather data');
    if (error.response?.status === 404) {
      console.error(chalk.red(`❌ Location "${location}" not found`));
      console.log(chalk.yellow('Please check the spelling and use format: "City, State" or "City, Country"'));
    } else if (error.response?.status === 401) {
      console.error(chalk.red('❌ Invalid API key'));
    } else {
      console.error(chalk.red('❌ Error:', error.message));
    }
    process.exit(1);
  }
}

export {
  getWeather,
  getWeatherByCoords,
  determineDisplayUnits,
  convertTemperature,
  celsiusToFahrenheit,
  fahrenheitToCelsius
};
