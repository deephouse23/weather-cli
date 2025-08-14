#!/usr/bin/env node

import { getApiKey, testApiKey } from './src/api/auth.js';
import chalk from 'chalk';

console.log('🧪 Testing authentication...\n');

async function runTests() {
  try {
    // Test getting API key
    console.log(chalk.blue('Testing API key retrieval:'));
    const apiKey = await getApiKey();
    console.log(chalk.green('✅ API key retrieved (redacted):', apiKey.substring(0, 4) + '****'));
    
    // Test API key validation
    console.log(chalk.blue('\nTesting API key validation:'));
    const isValid = await testApiKey();
    if (isValid) {
      console.log(chalk.green('✅ API key is valid'));
    } else {
      console.log(chalk.red('❌ API key is invalid'));
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Auth test failed:', error.message));
    if (error.code === 'API_KEY_MISSING') {
      console.log(chalk.yellow('Run "weather auth set" to configure your API key'));
    }
  }
}

runTests();