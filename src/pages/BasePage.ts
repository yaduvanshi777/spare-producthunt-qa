import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Base Page Object
 * Encapsulates common navigation, global header, search input,
 * authentication triggers, and resilient locator helpers.
 */
export class BasePage {
  readonly page: Page;
  readonly header: Locator;
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly signInButton: Locator;
  readonly authModal: Locator;
  readonly authModalCloseButton: Locator;
  readonly navigationMenu: Locator;
  readonly mobileMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header, [data-test="global-header"]');
    this.logo = page.locator('a[href="/"]').filter({ has: page.locator('svg, img') }).first();
    this.searchInput = page.locator('input[type="search"], input[placeholder*="Search" i], [data-test="search-input"]');
    this.searchButton = page.locator('button[aria-label*="Search" i], [data-test="search-button"]');
    this.signInButton = page.locator('button:has-text("Sign in"), a:has-text("Sign in"), [data-test="sign-in-button"]');
    this.authModal = page.locator('[role="dialog"], [data-test="auth-modal"], .auth-modal');
    this.authModalCloseButton = page.locator('[role="dialog"] button[aria-label*="Close" i], [data-test="modal-close-button"], [role="dialog"] button:has-text("✕")');
    this.navigationMenu = page.locator('nav, [data-test="navigation-menu"]');
    this.mobileMenuButton = page.locator('button[aria-label*="Menu" i], [data-test="mobile-menu-toggle"], button.menu-toggle');
  }

  /**
   * Navigate to a relative or absolute URL path
   */
  async navigateTo(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Wait for DOM content to settle without using arbitrary timeouts
   */
  async waitForReady() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Search for a query using the global search input
   */
  async search(query: string) {
    if (await this.searchButton.isVisible()) {
      await this.searchButton.click();
    }
    await this.searchInput.fill(query);
  }

  /**
   * Dismiss any open modals via Escape key
   */
  async dismissModals() {
    if (await this.authModal.isVisible()) {
      await this.page.keyboard.press('Escape');
      await expect(this.authModal).toBeHidden({ timeout: 5000 });
    }
  }
}
