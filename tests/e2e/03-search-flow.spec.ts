import { test, expect } from '@playwright/test';
import { SearchPage } from '../../src/pages/SearchPage';

test.describe('Search & Discovery Flow', () => {
  let searchPage: SearchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
  });

  test('should return matched product results for valid query', async () => {
    await searchPage.open();
    await searchPage.typeSearch('Cursor');
    await searchPage.submitSearch();

    await expect(searchPage.searchResultsList).toBeVisible();
    const count = await searchPage.searchResultItems.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstResult = searchPage.searchResultItems.first();
    await expect(firstResult).toContainText('Cursor');
  });

  test('should display empty state notice for non-matching query', async () => {
    await searchPage.open();
    await searchPage.typeSearch('nonexistentqueryxyz999');
    await searchPage.submitSearch();

    await expect(searchPage.emptyStateNotice).toBeVisible();
    await expect(searchPage.searchResultItems).toHaveCount(0);
  });
});
