import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Page Object for Search & Discovery (/search)
 * Encapsulates search inputs, suggestions, results list, and empty states.
 */
export class SearchPage extends BasePage {
  readonly searchResultsList: Locator;
  readonly searchResultItems: Locator;
  readonly emptyStateNotice: Locator;
  readonly suggestionsDropdown: Locator;
  readonly suggestionItems: Locator;
  readonly filterTabs: Locator;

  constructor(page: Page) {
    super(page);
    this.searchResultsList = page.locator('[data-test="search-results"], .search-results-list');
    this.searchResultItems = page.locator('[data-test="search-result-item"], .search-item');
    this.emptyStateNotice = page.locator('[data-test="no-results"], .no-results-state');
    this.suggestionsDropdown = page.locator('[data-test="search-suggestions"], .search-suggestions');
    this.suggestionItems = page.locator('[data-test="suggestion-item"], .suggestion-row');
    this.filterTabs = page.locator('[data-test="search-filters"] button, .filter-tab');
  }

  /**
   * Open search page directly with optional query
   */
  async open(query?: string) {
    const url = query ? `/search?q=${encodeURIComponent(query)}` : '/search';
    await this.navigateTo(url);
    await this.waitForReady();
  }

  /**
   * Type in search bar to trigger real-time suggestions
   */
  async typeSearch(query: string) {
    await this.searchInput.first().fill(query);
  }

  /**
   * Submit search query via form submit or enter key
   */
  async submitSearch() {
    await this.searchInput.first().press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
