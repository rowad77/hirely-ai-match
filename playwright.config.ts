
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for End-to-End testing
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: 'src/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    
    // Capture screenshot after each test failure
    screenshot: 'only-on-failure',
    
    // Record video only when retrying a test for the first time
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run local dev server before starting the tests
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
