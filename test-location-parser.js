// Simple test file to verify location parser functionality
import { parseLocation } from './src/utils/locationParser.js';

const tests = [
  { input: ['CA'], expected: 'California, US' },
  { input: ['NY'], expected: 'New York, US' },
  { input: ['TX'], expected: 'Texas, US' },
  { input: ['BC'], expected: 'British Columbia, CA' },
  { input: ['ON'], expected: 'Ontario, CA' },
  { input: ['UK'], expected: 'United Kingdom' },
  { input: ['San', 'Ramon', 'CA'], expected: 'San Ramon, CA, US' },
  { input: ['New', 'York'], expected: 'New York, NY, US' },
  { input: ['Los', 'Angeles', 'CA'], expected: 'Los Angeles, CA, US' },
  { input: ['London'], expected: 'London, UK' },
  { input: ['Tokyo'], expected: 'Tokyo, JP' },
  { input: ['Paris'], expected: 'Paris, FR' },
  { input: ['Toronto'], expected: 'Toronto, CA' },
  { input: ['Vancouver'], expected: 'Vancouver, CA' },
  { input: ['San', 'Francisco'], expected: 'San Francisco, CA, US' },
  { input: ['Miami'], expected: 'Miami, FL, US' },
  { input: ['Seattle'], expected: 'Seattle, WA, US' },
  { input: ['Berlin'], expected: 'Berlin, DE' },
  { input: ['Sydney'], expected: 'Sydney, AU' },
  { input: ['Random', 'City', 'XY'], expected: 'Random City, XY' },
  { input: ['City,', 'State'], expected: 'City, State' },
  { input: ['San', 'Ramon'], expected: 'San Ramon, CA, US' },  // Detected as known city
  // Test with options mixed in
  { input: ['San', 'Ramon', 'CA', '--celsius'], expected: 'San Ramon, CA, US' },
  { input: ['-u', 'metric', 'London'], expected: 'London, UK' },
  { input: ['Paris', '--fahrenheit', '-f'], expected: 'Paris, FR' }
];

console.log('Running location parser tests...\n');

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const result = parseLocation(test.input);
  const testPassed = result === test.expected;
  
  if (testPassed) {
    passed++;
    console.log(`✅ Input: ${test.input.join(' ')}`);
  } else {
    failed++;
    console.log(`❌ Input: ${test.input.join(' ')}`);
    console.log(`   Expected: ${test.expected}`);
    console.log(`   Got: ${result}`);
  }
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${tests.length} total tests`);

if (failed === 0) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed.');
  process.exit(1);
}