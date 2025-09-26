// Jest setup file for weather-cli tests
import { jest } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.WEATHER_API_KEY = 'test_api_key';

// Mock console methods during tests to reduce noise
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeEach(() => {
  // Restore original console methods before each test
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});

// Global test timeout
jest.setTimeout(30000);

// Handle unhandled promise rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the test process for unhandled rejections
});

// Clean up environment after tests
afterAll(() => {
  // Clean up any test artifacts
  delete process.env.WEATHER_API_KEY;
});