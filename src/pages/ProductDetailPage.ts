import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Product Detail Page (/posts/[slug])
 * Encapsulates product metadata, maker attribution, external links,
 * and discussion / comments threads.
 */
export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly productTagline: Locator;
  readonly visitWebsiteButton: Locator;
  readonly voteButton: Locator;
  readonly makersSection: Locator;
  readonly makerBadges: Locator;
  readonly topicsList: Locator;
  readonly commentsSection: Locator;
  readonly commentItems: Locator;
  readonly commentInput: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('h1, [data-test="post-title"]');
    this.productTagline = page.locator('[data-test="post-tagline"], .post-tagline, header p');
    this.visitWebsiteButton = page.locator(
      'a[data-test="visit-website"], a:has-text("Visit Website"), a:has-text("Get it")'
    );
    this.voteButton = page.locator('button[data-test="vote-button"], .vote-button, button:has-text("Upvote")');
    this.makersSection = page.locator('[data-test="makers-section"], .makers-list');
    this.makerBadges = page.locator('[data-test="maker-badge"], .maker-item');
    this.topicsList = page.locator('[data-test="post-topics"], .topic-list a');
    this.commentsSection = page.locator('[data-test="comments-section"], .comments-container');
    this.commentItems = page.locator('[data-test="comment-item"], .comment-card');
    this.commentInput = page.locator('textarea[placeholder*="comment" i], [data-test="comment-input"]');
  }

  /**
   * Navigate directly to a specific product by slug
   */
  async open(slug: string) {
    await this.navigateTo(`/posts/${slug}`);
    await this.waitForReady();
  }

  /**
   * Get the external website URL linked on the product page
   */
  async getWebsiteHref(): Promise<string | null> {
    return await this.visitWebsiteButton.getAttribute('href');
  }

  /**
   * Check if external link has security attributes (rel="noopener" / "noreferrer")
   */
  async getWebsiteRel(): Promise<string | null> {
    return await this.visitWebsiteButton.getAttribute('rel');
  }
}
