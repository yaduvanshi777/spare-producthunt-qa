import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';

test.describe('Guest User Authentication Gating & Modal Accessibility', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('should trigger authentication modal when guest clicks upvote', async () => {
    await expect(homePage.authModal).toBeHidden();

    // Click upvote on the first product
    await homePage.voteOnPost(0);

    // Verify accessible dialog appears
    await expect(homePage.authModal).toBeVisible();
    await expect(homePage.authModal).toHaveAttribute('role', 'dialog');
  });

  test('should dismiss authentication modal when pressing Escape key', async ({ page }) => {
    await homePage.voteOnPost(0);
    await expect(homePage.authModal).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Verify modal is dismissed
    await expect(homePage.authModal).toBeHidden();
  });

  test('should dismiss modal when clicking close button', async () => {
    await homePage.voteOnPost(0);
    await expect(homePage.authModal).toBeVisible();

    await homePage.authModalCloseButton.click();
    await expect(homePage.authModal).toBeHidden();
  });
});
