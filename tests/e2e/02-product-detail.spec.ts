import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { ProductDetailPage } from '../../src/pages/ProductDetailPage';

test.describe('Product Detail Page Navigation & Integrity', () => {
  test('should navigate from homepage feed to product detail page', async ({ page }) => {
    const homePage = new HomePage(page);
    const detailPage = new ProductDetailPage(page);

    await homePage.open();
    const expectedTitle = await homePage.getPostTitle(0).innerText();

    await homePage.clickPost(0);

    await expect(page).toHaveURL(/\/posts\//);
    await expect(detailPage.productName).toHaveText(expectedTitle);
    await expect(detailPage.productTagline).toBeVisible();
  });

  test('should display maker attribution and discussion section', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.open('cursor-ai');

    await expect(detailPage.productName).toBeVisible();
    await expect(detailPage.makersSection).toBeVisible();
    const makerCount = await detailPage.makerBadges.count();
    expect(makerCount).toBeGreaterThanOrEqual(1);

    await expect(detailPage.commentsSection).toBeVisible();
  });

  test('should enforce external website link security attributes', async ({ page }) => {
    const detailPage = new ProductDetailPage(page);
    await detailPage.open('cursor-ai');

    await expect(detailPage.visitWebsiteButton).toBeVisible();
    const rel = await detailPage.getWebsiteRel();
    // Verify reverse tabnabbing protection (rel="noopener" or "noreferrer")
    expect(rel).toMatch(/noopener|noreferrer/);
  });
});
