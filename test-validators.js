#!/usr/bin/env node

import { sanitizeLocation, validateLocation, validateCoordinates } from './src/utils/validators.js';
import chalk from 'chalk';

console.log('🧪 Testing validators...\n');

// Test location sanitization
console.log(chalk.blue('Testing location sanitization:'));
try {
  console.log('Input: "New York<script>"', '→', sanitizeLocation('New York<script>'));
  console.log('Input: "London\'s Park"', '→', sanitizeLocation("London's Park"));
  console.log('Input: "  Tokyo  "', '→', sanitizeLocation('  Tokyo  '));
  console.log(chalk.green('✅ Sanitization tests passed\n'));
} catch (error) {
  console.error(chalk.red('❌ Sanitization test failed:', error.message));
}

// Test location validation
console.log(chalk.blue('Testing location validation:'));
try {
  console.log('Valid: "New York, NY"', '→', validateLocation('New York, NY'));
  try {
    validateLocation('InvalidLocation');
  } catch (e) {
    console.log('Invalid: "InvalidLocation"', '→', chalk.red(e.message));
  }
  console.log(chalk.green('✅ Location validation tests passed\n'));
} catch (error) {
  console.error(chalk.red('❌ Location validation test failed:', error.message));
}

// Test coordinate validation
console.log(chalk.blue('Testing coordinate validation:'));
try {
  console.log('Valid: 40.7128, -74.0060', '→', validateCoordinates(40.7128, -74.0060));
  
  try {
    validateCoordinates(91, 0);
  } catch (e) {
    console.log('Invalid latitude: 91, 0', '→', chalk.red(e.message));
  }
  
  try {
    validateCoordinates(0, 181);
  } catch (e) {
    console.log('Invalid longitude: 0, 181', '→', chalk.red(e.message));
  }
  
  try {
    validateCoordinates('abc', 'def');
  } catch (e) {
    console.log('Invalid format: "abc", "def"', '→', chalk.red(e.message));
  }
  
  console.log(chalk.green('✅ Coordinate validation tests passed\n'));
} catch (error) {
  console.error(chalk.red('❌ Coordinate validation test failed:', error.message));
}