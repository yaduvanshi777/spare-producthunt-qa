import { test, expect } from '@playwright/test';

test.describe('Error State & 404 Routing', () => {
  test('should render custom 404 page with return-to-home CTA on invalid product route', async ({ page }) => {
    const response = await page.goto('/posts/non-existent-product-slug-xyz-404');

    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('404');

    const backHomeLink = page.locator('a:has-text("Back to Home")');
    await expect(backHomeLink).toBeVisible();

    await backHomeLink.click();
    await expect(page).toHaveURL('/');
  });
});
