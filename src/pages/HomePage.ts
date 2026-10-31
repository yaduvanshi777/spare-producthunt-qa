import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Product Hunt Homepage
 * Encapsulates the daily product feed, rankings, voting buttons, and topic pills.
 */
export class HomePage extends BasePage {
  readonly feedSection: Locator;
  readonly postItems: Locator;
  readonly dailyRankingsHeader: Locator;
  readonly topicTags: Locator;

  constructor(page: Page) {
    super(page);
    this.feedSection = page.locator('main, [data-test="feed-section"], .feed-section');
    this.postItems = page.locator('[data-test="post-item"], article.post-item, .post-card');
    this.dailyRankingsHeader = page.locator('h2:has-text("Top Products Launching Today"), h2:has-text("Today"), [data-test="daily-header"]');
    this.topicTags = page.locator('[data-test="topic-tag"], a.topic-pill');
  }

  /**
   * Open the homepage
   */
  async open() {
    await this.navigateTo('/');
    await this.waitForReady();
  }

  /**
   * Returns locator for a specific post card by zero-based index
   */
  getPost(index: number): Locator {
    return this.postItems.nth(index);
  }

  /**
   * Returns product name heading locator within a specific post
   */
  getPostTitle(index: number): Locator {
    return this.getPost(index).locator('h3, [data-test="post-name"], .post-title');
  }

  /**
   * Returns product tagline locator within a specific post
   */
  getPostTagline(index: number): Locator {
    return this.getPost(index).locator('p, [data-test="post-tagline"], .post-tagline');
  }

  /**
   * Returns upvote button locator within a specific post
   */
  getVoteButton(index: number): Locator {
    return this.getPost(index).locator('button[data-test="vote-button"], button.vote-button, button:has-text("▲")');
  }

  /**
   * Returns the numeric upvote count text
   */
  async getVoteCount(index: number): Promise<number> {
    const text = await this.getVoteButton(index).innerText();
    const matches = text.match(/\d+/);
    return matches ? parseInt(matches[0], 10) : 0;
  }

  /**
   * Click on a post card's direct link to navigate to its details page
   */
  async clickPost(index: number) {
    const postLink = this.getPost(index).locator('a[href^="/posts/"]').first();
    await postLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click upvote on a post
   */
  async voteOnPost(index: number) {
    await this.getVoteButton(index).click();
  }
}
