#!/usr/bin/env node

import { getWeather } from './src/weather.js';
import { displayCurrentWeather } from './src/display.js';

async function testResponsiveDesign() {
  console.log('🧪 Testing responsive weather display...\n');
  
  try {
    console.log('📍 Fetching weather for New York...');
    const data = await getWeather('New York');
    
    console.log('✅ Weather data fetched successfully!');
    console.log(`🌡️  Temperature: ${data.current.main.temp}°${data.displayUnit === 'fahrenheit' ? 'F' : 'C'}`);
    console.log(`☁️  Weather: ${data.current.weather[0].description}`);
    console.log(`📍 Location: ${data.current.name}, ${data.current.sys.country}`);
    
    console.log('\n🎨 Testing responsive display...');
    console.log('📏 Current terminal width:', process.stdout.columns || 'Unknown');
    
    displayCurrentWeather(data, data.displayUnit);
    
    console.log('\n✅ Responsive design test completed!');
    console.log('💡 The display automatically adapts to your terminal width:');
    console.log('   - < 80 chars: Compact layout');
    console.log('   - 80-120 chars: Medium layout');
    console.log('   - > 120 chars: Full horizontal layout');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testResponsiveDesign();
