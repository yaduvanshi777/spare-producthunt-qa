import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';

test.describe('Responsive Mobile Layout & Navigation', () => {
  test('should display mobile menu drawer when toggled on small viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const homePage = new HomePage(page);
    await homePage.open();

    // Verify hamburger button is visible on mobile
    await expect(homePage.mobileMenuButton).toBeVisible();

    const mobileDrawer = page.locator('#mobile-menu');
    await expect(mobileDrawer).toBeHidden();

    // Click mobile menu toggle
    await homePage.mobileMenuButton.click();

    // Verify mobile drawer expands with navigation links
    await expect(mobileDrawer).toBeVisible();
    await expect(mobileDrawer.locator('a[href="/"]')).toBeVisible();
  });
});
