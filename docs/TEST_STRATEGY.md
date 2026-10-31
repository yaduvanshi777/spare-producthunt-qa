# Product Hunt — QA Test Strategy Document

> **Author**: Sole QA Engineer  
> **Target System**: Product Hunt (Web & GraphQL API v2)  
> **Philosophy**: Security-First, API-First, Risk-Driven Quality Engineering  
> **Scope**: Maximum 1 Page Reference Strategy

---

## 1. Executive Summary & Quality Mission

As the sole QA engineer brought in for Product Hunt's release, the mission is **not to test everything superficially, but to defend business value, platform integrity, and customer trust systematically**. 

Product Hunt's core business value hinges on three pillars:
1. **Credibility & Trust**: Fair, un-manipulated launch rankings and voting integrity.
2. **High Availability During Launch Peaks**: Uncompromising stability at 12:01 AM PT when daily launches reset.
3. **API & Ecosystem Reliability**: Robust, secure developer API powering integrations, widgets, and third-party ecosystems.

Quality must be built into the deployment pipeline through automated gates, rigorous contract validation, deterministic E2E workflows, and proactive production monitoring.

---

## 2. Risk Matrix & What Matters Most

| Risk Area | Threat & Impact | Priority | Mitigation Strategy |
| :--- | :--- | :---: | :--- |
| **Vote Manipulation & Sybil Attacks** | Automated bots or sock-puppet accounts game rankings, destroying platform credibility. | **P0 (Critical)** | Verify auth barriers, rate limits on voting mutations, bot mitigation (Cloudflare Turnstile/WAF), and anomaly detection. |
| **Launch Day Spike Resilience** | Cache invalidation or database connection exhaustion during the 12:01 AM PT launch window. | **P0 (Critical)** | Edge caching validation, GraphQL query depth/complexity limits, load & stress testing using distributed workers. |
| **API Contract & Schema Breaking Changes** | Undocumented schema mutations breaking mobile apps and developer integrations. | **P1 (High)** | Automated schema drift detection, typed Zod runtime contract tests in CI, semantic versioning gates. |
| **Search & Discovery Regression** | Broken search suggestions or topic filters degrading organic product discovery. | **P1 (High)** | Headless Playwright journeys covering debounced search, auto-complete dropdowns, and topic feeds. |
| **Guest-to-User Conversion Gating** | Inability for unregistered visitors to view posts or broken auth modal flows reducing signup conversion. | **P1 (High)** | Automated E2E verification of guest gating, OAuth login redirects, and modal focus traps. |

---

## 3. The Quality Pyramid & Automation Matrix

```
       /  E2E (Playwright)  \       -> 10%: Critical user flows (Homepage, Search, Product Detail, Auth Gating)
      /----------------------\
     /   API & Contract (Bun) \     -> 30%: Typed GraphQL queries, Zod schema validation, Security/DoS checks
    /--------------------------\
   / Unit & Integration Tests   \   -> 60%: React component tests, business logic, ranking algorithm, auth helpers
```

### A. API Layer (Bun + TypeScript + Zod)
- **Typed GraphQL Execution**: All queries executed through a lightweight typed client with zero runtime overhead.
- **Contract Enforcement**: Zod schemas validate field non-nullability, Relay cursor pagination (`pageInfo`), and enum validity.
- **Security Assertions**: Explicit tests for missing/expired OAuth tokens (HTTP 401), query depth abuse prevention, and rate-limiting headers.

### B. E2E Web Layer (Playwright)
- **Page Object Model (POM)**: Decoupled UI selectors from test scenarios for low maintenance overhead.
- **Zero Flaky Waits**: Strict prohibition of arbitrary timeouts (`waitForTimeout`); reliance on Playwright auto-waiting and web-first assertions (`toBeVisible()`).
- **Resilient Locators**: Semantic roles, accessibility labels, and data attributes resilient to layout shifts.

---

## 4. CI/CD Release Gates

Every Pull Request must pass the following pipeline stages prior to merge:
1. **Static Analysis**: TypeScript strict compilation (`tsc --noEmit`) and linting.
2. **API Contract Suite (`bun run test:api`)**: Sub-second execution validating GraphQL schema stability.
3. **E2E Smoke Suite (`bun run test:e2e`)**: Headless browser verification of core revenue and discovery paths.
4. **Security Vulnerability Scan**: Dependency audit (`bun audit`) and SAST analysis.
5. **Preview Environment Verification**: Ephemeral preview environments validate database migrations before production deployment.

---

## 5. Production Observability & Synthetic Monitoring

Testing does not end at deployment:
- **Synthetic Monitoring**: Headless Playwright synthetic probes running every 5 minutes against global endpoints to track uptime and Core Web Vitals (LCP < 2.5s, CLS < 0.1).
- **GraphQL Telemetry**: APM tracing (OpenTelemetry) tracking p95/p99 query latencies, resolver cost metrics, and error spikes.
- **Real-Time Anomaly Detection**: Alerting on sudden spikes in vote velocity or abnormal down-voting patterns.
