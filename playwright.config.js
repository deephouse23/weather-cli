import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // Maximum time one test can run
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  // Run tests in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use
  reporter: 'html',
  
  use: {
    // Base URL to use
    baseURL: 'https://weather.com',
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    // Screenshot on failure
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
