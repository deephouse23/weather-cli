#!/usr/bin/env node

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Debugging environment variables...\n');

// Check if .env file exists
try {
  const envPath = join(__dirname, '.env');
  const envContent = await fs.readFile(envPath, 'utf8');
  console.log('📄 .env file content:');
  console.log(envContent);
} catch (error) {
  console.log('❌ .env file not found or not readable');
}

console.log('\n🔧 Loading dotenv...');
dotenv.config();

console.log('\n📋 Environment variables after dotenv:');
console.log('WEATHER_API_KEY:', process.env.WEATHER_API_KEY);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test the exact API key
const API_KEY = process.env.WEATHER_API_KEY;
if (API_KEY) {
  console.log('\n🔑 API Key length:', API_KEY.length);
  console.log('🔑 API Key first 10 chars:', API_KEY.substring(0, 10));
  console.log('🔑 API Key last 10 chars:', API_KEY.substring(API_KEY.length - 10));
}
