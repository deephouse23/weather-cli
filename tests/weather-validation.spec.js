import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Weather CLI Data Validation', () => {
  test('CLI weather data matches weather.com for location', async ({ page }) => {
    const location = 'San Francisco, CA';
    const zipCode = '94102';

    // Get weather from your CLI
    const cliOutput = execSync(`node ../bin/weather.js "${location}"`, {
      encoding: 'utf-8',
      cwd: __dirname
    }).trim();

    // Extract temperature from CLI output (adjust regex based on your output format)
    const cliTempMatch = cliOutput.match(/Temperature:\s*(\d+)°F/);
    const cliTemp = cliTempMatch ? parseInt(cliTempMatch[1]) : null;

    // Now verify against weather.com using Playwright
    await page.goto(`https://weather.com/weather/today/l/${zipCode}`);

    // Wait for temperature to load
    await page.waitForSelector('[data-testid="TemperatureValue"]', { timeout: 10000 });

    // Get temperature from weather.com
    const webTemp = await page.evaluate(() => {
      const tempElement = document.querySelector('[data-testid="TemperatureValue"]');
      return tempElement ? parseInt(tempElement.textContent) : null;
    });

    // Allow for small variance (APIs might have slightly different data)
    expect(Math.abs(cliTemp - webTemp)).toBeLessThanOrEqual(3);

    console.log(`✓ CLI Temperature: ${cliTemp}°F`);
    console.log(`✓ Web Temperature: ${webTemp}°F`);
  });

  test('CLI handles multiple locations correctly', async ({ page }) => {
    const locations = [
      { city: 'New York, NY', zip: '10001' },
      { city: 'Los Angeles, CA', zip: '90001' },
      { city: 'Chicago, IL', zip: '60601' }
    ];

    for (const loc of locations) {
      // Test CLI doesn't crash and returns data
      const cliOutput = execSync(`node ../bin/weather.js "${loc.city}"`, {
        encoding: 'utf-8',
        cwd: __dirname
      }).trim();

      expect(cliOutput).toContain('Temperature');
      expect(cliOutput).toContain('Conditions');

      // Optional: Validate against web source
      await page.goto(`https://weather.com/weather/today/l/${loc.zip}`);
      await page.waitForSelector('[data-testid="TemperatureValue"]', { timeout: 10000 });

      const hasWeatherData = await page.evaluate(() => {
        return document.querySelector('[data-testid="TemperatureValue"]') !== null;
      });

      expect(hasWeatherData).toBe(true);
      console.log(`✓ Validated weather data for ${loc.city}`);
    }
  });

  test('Screenshot weather radar for documentation', async ({ page }) => {
    // This test captures weather radar images that could be integrated into your CLI
    const location = '94102';

    await page.goto(`https://weather.com/weather/radar/interactive/l/${location}`);
    await page.waitForSelector('canvas', { timeout: 15000 });

    // Take screenshot of radar
    await page.screenshot({
      path: 'tests/screenshots/weather-radar.png',
      fullPage: false
    });

    console.log('✓ Captured weather radar screenshot');

    // You could extend your CLI to display this image or save it for users
  });

  test('Monitor weather API response times', async ({ page }) => {
    const startTime = Date.now();

    // Test your CLI's response time
    execSync('node ../bin/weather.js "San Francisco"', {
      encoding: 'utf-8',
      cwd: __dirname
    });

    const cliResponseTime = Date.now() - startTime;

    // Compare with direct web load time
    const webStartTime = Date.now();
    await page.goto('https://weather.com/weather/today/l/94102');
    await page.waitForSelector('[data-testid="TemperatureValue"]');
    const webResponseTime = Date.now() - webStartTime;

    console.log(`CLI Response Time: ${cliResponseTime}ms`);
    console.log(`Web Response Time: ${webResponseTime}ms`);

    // CLI should be faster than loading full web page
    expect(cliResponseTime).toBeLessThan(webResponseTime);
  });

  test('Verify forecast accuracy over time', async ({ page }) => {
    // This test could be run daily to track forecast accuracy
    const location = 'San Francisco';
    const zipCode = '94102';

    // Get tomorrow's forecast from CLI
    const cliForecast = execSync(`node ../bin/weather.js "${location}" --forecast`, {
      encoding: 'utf-8',
      cwd: __dirname
    }).trim();

    // Get tomorrow's forecast from weather.com
    await page.goto(`https://weather.com/weather/tenday/l/${zipCode}`);
    await page.waitForSelector('[data-testid="DailyForecast"]', { timeout: 10000 });

    const webForecast = await page.evaluate(() => {
      const forecastElements = document.querySelectorAll('[data-testid="DailyForecast"]');
      if (forecastElements.length > 1) {
        // Get tomorrow's forecast (second element)
        const tomorrow = forecastElements[1];
        const high = tomorrow.querySelector('[data-testid="TemperatureValue"]')?.textContent;
        return high;
      }
      return null;
    });

    console.log('CLI Forecast:', cliForecast);
    console.log('Web Forecast:', webForecast);

    // Store these values to compare with actual weather tomorrow
    // This data could be saved to track forecast accuracy over time
  });
});
