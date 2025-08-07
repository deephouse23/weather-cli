#!/usr/bin/env node

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Debugging main file...');
console.log('🔑 API Key:', process.env.WEATHER_API_KEY);
console.log('🔑 API Key length:', process.env.WEATHER_API_KEY?.length);

if (!process.env.WEATHER_API_KEY) {
  console.error('❌ No API key found. Please set WEATHER_API_KEY in your .env file');
  console.log('Get your free API key at: https://openweathermap.org/api');
  process.exit(1);
}

console.log('✅ API key found and ready to use!');
