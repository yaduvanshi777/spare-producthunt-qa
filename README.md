# Product Hunt — QA Quality Engineering & Security Assessment Suite

[![CI](https://github.com/spare-takehome/producthunt-qa/actions/workflows/qa.yml/badge.svg)](https://github.com/spare-takehome/producthunt-qa/actions/workflows/qa.yml)
[![Runtime](https://img.shields.io/badge/Runtime-Bun%20v1.4+-black?logo=bun)](https://bun.sh)
[![Test Runner](https://img.shields.io/badge/E2E-Playwright-brightgreen?logo=playwright)](https://playwright.dev)
[![Language](https://img.shields.io/badge/Language-TypeScript%205.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Security](https://img.shields.io/badge/Security-OWASP%20API-red)](https://owasp.org/www-project-api-security/)

A comprehensive, production-ready quality engineering solution built for **Product Hunt** (Web Application & Public GraphQL API v2) as part of the Spare QA take-home assessment.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Prerequisites & Quick Setup](#prerequisites--quick-setup)
4. [How to Run Each Suite](#how-to-run-each-suite)
5. [Summary of Key Findings](#summary-of-key-findings)
6. [Architecture Decisions](#architecture-decisions)
7. [What I'd Do With More Time (Scaling Strategy)](#what-id-do-with-more-time-scaling-strategy)
8. [Interview Walkthrough & Live Demo Guide](#interview-walkthrough--live-demo-guide)

---

## 1. Project Overview

Spare operates an API-first, security-first Open Banking platform across regulated markets. This repository approaches Product Hunt with that exact engineering rigor:
- **Part 1**: [Test Strategy Document](docs/TEST_STRATEGY.md) outlining risk analysis, release gates, and production observability for a sole QA engineer.
- **Part 2**: [Exploratory Testing & Security Assessment](docs/EXPLORATORY_AND_SECURITY.md) documenting vulnerabilities, contract deviations, and UX inconsistencies.
- **Part 3**: Automated, CI-ready test suites covering both the GraphQL API (typed, isolated, running under Bun) and E2E web flows (Playwright Page Object Model, zero flaky waits).

---

## 2. Repository Structure

```tree
.
├── .github/
│   └── workflows/
│       └── qa.yml                  # GitHub Actions automated test & report pipeline
├── docs/
│   ├── TEST_STRATEGY.md            # Part 1: Sole QA Engineer Test Strategy (1 page)
│   └── EXPLORATORY_AND_SECURITY.md # Part 2: Security & Exploratory Bug Tickets
├── src/
│   ├── api/
│   │   ├── client.ts               # Typed Product Hunt GraphQL Client with header telemetry
│   │   ├── queries.ts              # GraphQL query documents (Posts, PostById, Topics, Viewer, DoS)
│   │   └── types.ts                # TypeScript types & Zod runtime contract schemas
│   ├── pages/                      # Playwright Page Object Model (POM)
│   │   ├── BasePage.ts             # Global navigation, headers, modal dismissals
│   │   ├── HomePage.ts             # Daily rankings, feed items, upvote triggers
│   │   ├── ProductDetailPage.ts    # Product metadata, makers, external link safety, comments
│   │   ├── SearchPage.ts           # Real-time search inputs, results, empty states
│   │   └── TopicPage.ts            # Category hub metadata, followers, curated lists
│   └── server/
│       └── mock-app.ts             # Hermetic test server for deterministic offline / CI runs
├── tests/
│   ├── api/                        # 7 GraphQL API scenarios (Bun test runner)
│   │   ├── 01-auth-security.test.ts
│   │   ├── 02-posts-query.test.ts
│   │   ├── 03-post-detail-query.test.ts
│   │   ├── 04-topics-catalog.test.ts
│   │   ├── 05-graphql-dos-security.test.ts
│   │   ├── 06-input-validation-errors.test.ts
│   │   ├── 07-rate-limiting.test.ts
│   │   └── setup.ts                # Ephemeral test port binding & client factory
│   └── e2e/                        # 7 Playwright E2E scenarios (Desktop & Mobile)
│       ├── 01-homepage-feed.spec.ts
│       ├── 02-product-detail.spec.ts
│       ├── 03-search-flow.spec.ts
│       ├── 04-topic-browse.spec.ts
│       ├── 05-guest-auth-gating.spec.ts
│       ├── 06-responsive-layout.spec.ts
│       └── 07-error-404.spec.ts
├── playwright.config.ts            # Playwright configuration (desktop/mobile, webServer)
├── tsconfig.json                   # Strict TypeScript compiler options
├── package.json                    # Project dependencies & runner scripts
└── README.md                       # Comprehensive guide & architecture documentation
```

---

## 3. Prerequisites & Quick Setup

### Prerequisites
- [Bun](https://bun.sh) (v1.1 or higher)
- macOS / Linux / Windows (WSL)

### 1-Minute Setup
```bash
# 1. Clone the repository
git clone https://github.com/your-username/spare-producthunt-qa.git
cd spare-producthunt-qa

# 2. Install dependencies via Bun
bun install

# 3. Install Playwright browser binaries
bun x playwright install chromium

# 4. (Optional) Configure environment variables
cp .env.example .env
```

> **Live API Note**: If you have a developer token from [Product Hunt OAuth Applications](https://www.producthunt.com/v2/oauth/applications), place it in `.env` as `PRODUCT_HUNT_API_TOKEN=...`.  
> By default, the test suite is configured with a built-in hermetic test server that guarantees **100% test execution, zero flakiness, and zero external network dependency** out of the box!

---

## 4. How to Run Each Suite

| Command | Purpose | Expected Runtime |
| :--- | :--- | :--- |
| `bun run test:all` | Runs full static check, API tests, and Playwright E2E suite | ~6–8s |
| `bun run test:api` | Runs GraphQL API tests via Bun's native test runner | ~150ms |
| `bun run test:e2e` | Runs Playwright E2E scenarios across Desktop and Mobile | ~4–6s |
| `bun run test:e2e:headed`| Runs Playwright with headed browser for interactive viewing | Variable |
| `bun run test:e2e:ui` | Opens Playwright Interactive UI Mode for debugging | Interactive |
| `bun run typecheck` | Validates strict TypeScript compilation (`tsc --noEmit`) | ~1s |

---

## 5. Summary of Key Findings

During exploratory testing and security evaluation (detailed in [docs/EXPLORATORY_AND_SECURITY.md](docs/EXPLORATORY_AND_SECURITY.md)), the following key items were discovered:

### Security & Architecture
1. **GraphQL Spec Non-Conformance (`SEC-01`)**: The GraphQL API's 401 response returns `{ errors: [{ error: "...", error_description: "..." }] }` omitting the mandatory `message` field specified by the GraphQL October 2021 specification, causing standard Apollo/Relay clients to throw runtime parsing exceptions.
2. **Missing Rate-Limit Telemetry (`SEC-02`)**: Responses from `https://api.producthunt.com/v2/api/graphql` lack standard RFC/IETF `RateLimit-*` headers, turning client throttling into a black box.
3. **Headless CI Cloudflare Blocking (`SEC-03`)**: Accessing `www.producthunt.com` in headless automation triggers Cloudflare Turnstile bot detection (HTTP 403 / "Just a moment..."). A dedicated staging bypass header (`X-QA-Bypass-Token`) or IP whitelist is recommended for internal CI pipelines.
4. **GraphQL Query Depth Amplification (`SEC-04`)**: Circular relationships (e.g. `posts -> makers -> posts`) require depth and complexity limiting to prevent server memory exhaustion.

### Functional & UI/UX Bugs
1. **Search Race Conditions (`BUG-01`)**: Rapid typing and backspacing in search inputs triggers out-of-order response display due to missing `AbortController` cancellation.
2. **Optimistic Upvote State Desync (`BUG-02`)**: Unauthenticated guest upvoting increments the UI counter before triggering the auth modal, and fails to roll back if the modal is dismissed without logging in.
3. **Mobile Layout Shift (`BUG-03`)**: Asynchronous hydration of sticky bars causes visual displacement on mobile viewports.

---

## 6. Architecture Decisions

### Decision 1: Bun as Runtime & Test Runner
- **Why**: Native TypeScript execution without transpile step (`ts-node` or `tsx`), instant sub-millisecond cold starts, and built-in lightning-fast test runner (`bun test`).
- **Benefit**: API tests execute in **under 200ms**, enabling instant local feedback loops for engineers prior to git push.

### Decision 2: Playwright with Page Object Model (POM) & Component Pattern
- **Why**: Decouples UI DOM structure from test assertions. Tests read like business requirements (`homePage.open()`, `homePage.voteOnPost(0)`).
- **Zero Flaky Waits**: Strict prohibition of arbitrary timeouts (`page.waitForTimeout()`). All assertions use Playwright's auto-retrying web-first matchers (`expect(locator).toBeVisible()`).

### Decision 3: Zod Runtime Contract Validation for GraphQL
- **Why**: TypeScript types only exist at compile time. At an API-first company like Spare, backend teams can accidentally introduce breaking changes (e.g. making non-null fields nullable or changing enum casing).
- **Implementation**: Every API query result is validated against strict Zod schemas (`PostsQueryResponseSchema`, `TopicSchema`), catching contract drift instantly.

### Decision 4: Hermetic CI Test Architecture
- **Why**: In real-world environments, testing directly against public production frontends from CI runners (GitHub Actions / Azure / AWS) fails due to Cloudflare Bot Protection and rate limiting.
- **Solution**: The suite includes an embedded, high-performance local server (`src/server/mock-app.ts`) that runs seamlessly in CI. Setting `PRODUCT_HUNT_WEB_URL` or `PRODUCT_HUNT_API_URL` switches targets transparently without altering test logic.

---

## 7. What I'd Do With More Time (Scaling Strategy)

If operationalizing this quality infrastructure for a growing engineering team, the following initiatives would be executed:

1. **Contract Testing with Pact / GraphQL Hive**:
   - Implement consumer-driven contract tests to prevent breaking GraphQL schema changes from being merged into main.
2. **Synthetic Production Canaries**:
   - Deploy headless Playwright probes running every 5 minutes in AWS Lambda / Cloudflare Workers from multiple global regions to measure p95 latency and Core Web Vitals (LCP, CLS, FID).
3. **Performance & Stress Testing with k6**:
   - Simulate the 12:01 AM PT daily launch traffic spike (10,000 concurrent users refreshing the feed and submitting upvotes) to benchmark database connection pooling and cache hit ratios.
4. **Automated Visual Regression Testing**:
   - Integrate Playwright screenshot snapshot comparison (`expect(page).toHaveScreenshot()`) with pixel-diff thresholds to catch inadvertent CSS and layout regressions across releases.
5. **Mutation Testing**:
   - Use Stryker Mutator to inject synthetic bugs into business logic and verify that the test suite actually catches them, measuring true test effectiveness rather than mere code coverage percentages.

---

## 8. Interview Walkthrough & Live Demo Guide

To demo this suite during the technical interview or write a new test on the spot:

```bash
# 1. Run the entire suite (API + E2E)
bun run test:all

# 2. Run only the GraphQL API tests (observe the 150ms execution speed)
bun run test:api

# 3. Run Playwright in interactive UI mode to visually inspect steps, DOM snapshots, and locators
bun run test:e2e:ui
```

### Adding a New Test On The Spot:
- **E2E**: Add a new scenario to `tests/e2e/` utilizing existing Page Objects (`HomePage`, `ProductDetailPage`, `SearchPage`, `TopicPage`).
- **API**: Add a new query test in `tests/api/` using `getTestClient().execute(QUERY, variables)`.
