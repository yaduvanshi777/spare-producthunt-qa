import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const BASE_URL = process.env.PRODUCT_HUNT_WEB_URL || 'http://localhost:3000';
const isLocal = BASE_URL.includes('localhost') || BASE_URL.includes('127.0.0.1');
const bunBinary = process.env.HOME ? path.join(process.env.HOME, '.bun/bin/bun') : 'bun';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 8 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    actionTimeout: 10 * 1000,
    navigationTimeout: 20 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
  ],
  // Automatically spin up the hermetic web server if running against local environment
  webServer: isLocal
    ? {
        command: `"${bunBinary}" run src/server/mock-app.ts`,
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        timeout: 20 * 1000,
      }
    : undefined,
});
