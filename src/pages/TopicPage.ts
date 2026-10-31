import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Topic/Category Hub (/topics/[slug])
 * Encapsulates topic title, follower counters, follow buttons, and curated feed.
 */
export class TopicPage extends BasePage {
  readonly topicTitle: Locator;
  readonly topicDescription: Locator;
  readonly followButton: Locator;
  readonly topicPostItems: Locator;
  readonly topicFollowersCount: Locator;

  constructor(page: Page) {
    super(page);
    this.topicTitle = page.locator('h1, [data-test="topic-title"]');
    this.topicDescription = page.locator('[data-test="topic-description"], .topic-description');
    this.followButton = page.locator('button[data-test="follow-topic"], button:has-text("Follow")');
    this.topicPostItems = page.locator('[data-test="post-item"], .topic-posts article');
    this.topicFollowersCount = page.locator('[data-test="followers-count"], .followers-badge');
  }

  /**
   * Open a specific topic page
   */
  async open(slug: string) {
    await this.navigateTo(`/topics/${slug}`);
    await this.waitForReady();
  }
}
