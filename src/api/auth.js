import keytar from 'keytar';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { WeatherError, ERROR_CODES } from '../utils/errors.js';
import httpClient from './http.js';

dotenv.config();

const SERVICE_NAME = 'weather-cli';
const ACCOUNT_NAME = 'openweathermap-api-key';

export async function getApiKey() {
  try {
    // Try keychain first
    const keychainKey = await keytar.getPassword(SERVICE_NAME, ACCOUNT_NAME);
    if (keychainKey) {
      return keychainKey;
    }
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Keychain access failed, falling back to environment variable'));
  }
  
  // Fall back to environment variable
  const envKey = process.env.WEATHER_API_KEY;
  if (!envKey || envKey === 'your_openweathermap_api_key_here') {
    throw new WeatherError(
      'No API key found. Run "weather auth set" to configure or set WEATHER_API_KEY environment variable',
      ERROR_CODES.API_KEY_MISSING
    );
  }
  
  return envKey;
}

export async function setApiKey(apiKey) {
  try {
    await keytar.setPassword(SERVICE_NAME, ACCOUNT_NAME, apiKey);
    return true;
  } catch (error) {
    console.warn(chalk.yellow('⚠️  Could not save to keychain, please use environment variable'));
    return false;
  }
}

export async function deleteApiKey() {
  try {
    return await keytar.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
  } catch (error) {
    return false;
  }
}

export async function testApiKey(apiKey = null) {
  const key = apiKey || await getApiKey();
  
  try {
    const response = await httpClient.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: 'London',
        appid: key,
        units: 'metric'
      }
    });
    
    return response.status === 200;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new WeatherError('Invalid API key', ERROR_CODES.API_KEY_INVALID, 401);
    }
    throw error;
  }
}