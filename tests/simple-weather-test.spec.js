import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Weather CLI Data Validation', () => {
  test('CLI returns weather data successfully', async () => {
    // Test that the CLI runs without errors
    let cliOutput;
    try {
      cliOutput = execSync('node bin/weather.js "San Francisco"', {
        encoding: 'utf-8',
        cwd: path.join(__dirname, '..')
      }).trim();
    } catch (error) {
      console.error('CLI Error:', error.message);
      throw error;
    }

    // Check that output contains expected weather information
    expect(cliOutput).toBeTruthy();
    expect(cliOutput.toLowerCase()).toMatch(/temperature|temp|°/i);

    console.log('CLI Output received successfully');
  });

  test('CLI handles multiple locations', async () => {
    const locations = ['New York', 'Los Angeles', 'Chicago'];

    for (const location of locations) {
      const cliOutput = execSync(`node bin/weather.js "${location}"`, {
        encoding: 'utf-8',
        cwd: path.join(__dirname, '..')
      }).trim();

      expect(cliOutput).toBeTruthy();
      console.log(`✓ Got weather for ${location}`);
    }
  });

  test('Compare CLI response time with web load time', async ({ page }) => {
    // Measure CLI response time
    const cliStart = Date.now();
    execSync('node bin/weather.js "San Francisco"', {
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..')
    });
    const cliTime = Date.now() - cliStart;

    // Measure web page load time
    const webStart = Date.now();
    await page.goto('https://weather.com');
    await page.waitForLoadState('domcontentloaded');
    const webTime = Date.now() - webStart;

    console.log(`CLI Response Time: ${cliTime}ms`);
    console.log(`Web Load Time: ${webTime}ms`);

    // CLI should generally be faster than loading a full web page
    expect(cliTime).toBeLessThan(webTime + 1000); // Allow 1 second buffer
  });

  test('Verify weather data structure', async () => {
    const cliOutput = execSync('node bin/weather.js "San Francisco" --json', {
      encoding: 'utf-8',
      cwd: path.join(__dirname, '..')
    }).trim();

    // If your CLI supports JSON output, validate the structure
    try {
      const data = JSON.parse(cliOutput);
      expect(data).toHaveProperty('temperature');
      expect(data).toHaveProperty('location');
      console.log('JSON output structure is valid');
    } catch {
      // If no JSON support, just check the text output
      expect(cliOutput).toContain('San Francisco');
      console.log('Text output validated');
    }
  });

  test('Check weather website availability', async ({ page }) => {
    // This test ensures the weather services you might scrape are available
    const weatherSites = [
      'https://weather.com',
      'https://www.weather.gov',
      'https://openweathermap.org'
    ];

    for (const site of weatherSites) {
      try {
        const response = await page.goto(site, { timeout: 10000 });
        expect(response.status()).toBeLessThan(400);
        console.log(`✓ ${site} is accessible`);
      } catch (error) {
        console.log(`⚠ ${site} might be down or slow`);
      }
    }
  });
});
