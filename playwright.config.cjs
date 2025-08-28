const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
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
  // Reporter to use
  reporter: 'list',
  
  use: {
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    // Screenshot on failure
    screenshot: 'only-on-failure',
    // Slower actions for debugging
    actionTimeout: 10000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
