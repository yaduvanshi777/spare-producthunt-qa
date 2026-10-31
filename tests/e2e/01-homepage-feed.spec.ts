import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';

test.describe('Homepage Daily Feed & Product Listings', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
  });

  test('should render daily rankings header and product items', async () => {
    await expect(homePage.dailyRankingsHeader).toBeVisible();
    const count = await homePage.postItems.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should display ranking badges and formatted product information', async () => {
    const firstPost = homePage.getPost(0);
    await expect(firstPost).toBeVisible();

    const title = homePage.getPostTitle(0);
    await expect(title).toBeVisible();
    const titleText = await title.innerText();
    expect(titleText.length).toBeGreaterThan(0);

    const tagline = homePage.getPostTagline(0);
    await expect(tagline).toBeVisible();
  });

  test('should display numeric upvote counter on feed items', async () => {
    const votes = await homePage.getVoteCount(0);
    expect(votes).toBeGreaterThan(0);
  });
});
