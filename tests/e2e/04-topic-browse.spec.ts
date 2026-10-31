import { test, expect } from '@playwright/test';
import { TopicPage } from '../../src/pages/TopicPage';

test.describe('Topic / Category Hub Browsing', () => {
  let topicPage: TopicPage;

  test.beforeEach(async ({ page }) => {
    topicPage = new TopicPage(page);
  });

  test('should render topic header, description, and follower count', async () => {
    await topicPage.open('developer-tools');

    await expect(topicPage.topicTitle).toHaveText('Developer Tools');
    await expect(topicPage.topicDescription).toBeVisible();
    await expect(topicPage.topicFollowersCount).toBeVisible();
    await expect(topicPage.followButton).toBeVisible();
  });

  test('should list curated products categorized under the topic', async () => {
    await topicPage.open('developer-tools');

    const count = await topicPage.topicPostItems.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstItem = topicPage.topicPostItems.first();
    await expect(firstItem).toBeVisible();
  });
});
