#!/usr/bin/env node

import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

console.log('🔑 API Key loaded:', API_KEY ? 'YES' : 'NO');
console.log('🔑 API Key value:', API_KEY);

if (!API_KEY) {
  console.error('❌ No API key found in .env file');
  process.exit(1);
}

// Test API call
async function testAPI() {
  try {
    console.log('\n🌐 Testing API call...');
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: 'New York',
        appid: API_KEY,
        units: 'metric'
      }
    });
    
    console.log('✅ API call successful!');
    console.log('📍 Location:', response.data.name);
    console.log('🌡️  Temperature:', response.data.main.temp + '°C');
    console.log('☁️  Weather:', response.data.weather[0].description);
    
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI();
