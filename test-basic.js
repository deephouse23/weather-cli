#!/usr/bin/env node

import { getWeather } from './src/weather.js';
import { displayCurrentWeather } from './src/display.js';

async function testBasicFunctionality() {
  console.log('🧪 Testing basic weather functionality...\n');
  
  try {
    console.log('📍 Fetching weather for New York...');
    const data = await getWeather('New York');
    
    console.log('✅ Weather data fetched successfully!');
    console.log(`🌡️  Temperature: ${data.current.main.temp}°${data.displayUnit === 'fahrenheit' ? 'F' : 'C'}`);
    console.log(`☁️  Weather: ${data.current.weather[0].description}`);
    console.log(`📍 Location: ${data.current.name}, ${data.current.sys.country}`);
    
    console.log('\n🎨 Testing display...');
    displayCurrentWeather(data, data.displayUnit);
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testBasicFunctionality();
