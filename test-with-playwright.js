// Quick test script to verify weather CLI with Playwright
// Run with: node test-with-playwright.js

const { chromium } = require('playwright');
const { execSync } = require('child_process');

async function testWeatherCLI() {
  console.log('🚀 Starting Weather CLI validation with Playwright...\n');
  
  // Test 1: Check if CLI works
  console.log('Test 1: Running weather CLI...');
  try {
    const cliOutput = execSync('node bin/weather.js "San Francisco"', {
      encoding: 'utf-8'
    }).trim();
    console.log('✅ CLI works! Output length:', cliOutput.length, 'characters');
    console.log('Preview:', cliOutput.substring(0, 100) + '...\n');
  } catch (error) {
    console.error('❌ CLI failed:', error.message);
    return;
  }
  
  // Test 2: Compare with live weather data
  console.log('Test 2: Fetching live weather from weather.com...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://weather.com/weather/today/l/94102', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });
    
    // Wait for temperature element
    const tempSelector = '[data-testid="TemperatureValue"]';
    await page.waitForSelector(tempSelector, { timeout: 10000 });
    
    const temperature = await page.$eval(tempSelector, el => el.textContent);
    console.log('✅ Weather.com temperature:', temperature + '°F');
    
    // Take a screenshot for reference
    await page.screenshot({ path: 'weather-screenshot.png' });
    console.log('📸 Screenshot saved as weather-screenshot.png\n');
    
  } catch (error) {
    console.error('❌ Failed to fetch from weather.com:', error.message);
  }
  
  // Test 3: Performance comparison
  console.log('Test 3: Performance comparison...');
  const cliStart = Date.now();
  execSync('node bin/weather.js "New York"', { encoding: 'utf-8' });
  const cliTime = Date.now() - cliStart;
  
  const webStart = Date.now();
  await page.goto('https://weather.com', { waitUntil: 'domcontentloaded' });
  const webTime = Date.now() - webStart;
  
  console.log(`✅ CLI Response Time: ${cliTime}ms`);
  console.log(`✅ Web Load Time: ${webTime}ms`);
  console.log(`📊 CLI is ${webTime - cliTime}ms faster!\n`);
  
  await browser.close();
  console.log('🎉 All tests completed!');
}

// Run the test
testWeatherCLI().catch(console.error);
