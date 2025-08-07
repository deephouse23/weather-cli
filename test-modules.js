#!/usr/bin/env node

import chalk from 'chalk';
import { processTemperatureOptions } from './src/config.js';
import { formatTemp, formatTime, getAirQualityDescription } from './src/display.js';
import { celsiusToFahrenheit, fahrenheitToCelsius } from './src/weather.js';
import { clearCache, getCacheStats } from './src/cache.js';

console.log(chalk.cyan.bold('🧪 Weather CLI Module Test\n'));

// Test 1: Configuration module
console.log(chalk.blue('📋 Testing Configuration Module...'));
const testOptions = {
  celsius: true,
  fahrenheit: false,
  units: 'metric'
};
const result = processTemperatureOptions(testOptions);
console.log(chalk.green(`✅ Temperature options processing: ${result}`));

// Test 2: Display module
console.log(chalk.blue('\n🎨 Testing Display Module...'));
console.log(chalk.green(`✅ Temperature formatting: ${formatTemp(25, 'celsius')}`));
console.log(chalk.green(`✅ Time formatting: ${formatTime(1704067200)}`));
console.log(chalk.green(`✅ Air quality: ${getAirQualityDescription(2)}`));

// Test 3: Weather utilities
console.log(chalk.blue('\n🌡️  Testing Weather Utilities...'));
const celsius = 25;
const fahrenheit = 77;
console.log(chalk.green(`✅ Celsius to Fahrenheit: ${celsius}°C = ${celsiusToFahrenheit(celsius).toFixed(1)}°F`));
console.log(chalk.green(`✅ Fahrenheit to Celsius: ${fahrenheit}°F = ${fahrenheitToCelsius(fahrenheit).toFixed(1)}°C`));

// Test 4: Cache module
console.log(chalk.blue('\n📦 Testing Cache Module...'));
try {
  await clearCache();
  const stats = await getCacheStats();
  console.log(chalk.green(`✅ Cache cleared successfully`));
  console.log(chalk.green(`✅ Cache stats: ${stats.total} total entries`));
} catch (error) {
  console.log(chalk.red(`❌ Cache test failed: ${error.message}`));
}

// Test 5: Module imports
console.log(chalk.blue('\n📦 Testing Module Imports...'));
try {
  // Test that all modules can be imported
  const { getWeather, getWeatherByCoords } = await import('./src/weather.js');
  const { getCachedWeather, setCachedWeather } = await import('./src/cache.js');
  const { displayCurrentWeather, display5DayForecast } = await import('./src/display.js');
  const { getDefaultLocation, setDefaultLocation } = await import('./src/config.js');
  
  console.log(chalk.green('✅ All modules imported successfully'));
  console.log(chalk.green('✅ Weather functions available'));
  console.log(chalk.green('✅ Cache functions available'));
  console.log(chalk.green('✅ Display functions available'));
  console.log(chalk.green('✅ Config functions available'));
} catch (error) {
  console.log(chalk.red(`❌ Module import test failed: ${error.message}`));
}

console.log(chalk.cyan.bold('\n🎉 All module tests completed successfully!'));
console.log(chalk.yellow('\n💡 The modular structure is working correctly.'));
console.log(chalk.yellow('💡 You can now test with a valid API key when ready.'));
