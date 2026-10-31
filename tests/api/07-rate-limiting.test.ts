import { describe, it, expect } from 'bun:test';
import { getTestClient } from './setup';
import { GET_POSTS } from '../../src/api/queries';

describe('API Reliability: Rate-Limiting Headers & Concurrency Stability', () => {
  const client = getTestClient();

  it('should parse rate-limit headers when returned by API Gateway', async () => {
    // We send an unauthenticated query where rate limit headers are attached
    const result = await client.execute(GET_POSTS, { first: 1 }, { Authorization: '' });

    const rateLimits = client.getRateLimitInfo(result.headers);

    // If API Gateway provides rate-limit headers, verify numeric extraction
    if (rateLimits.limit !== null) {
      expect(typeof rateLimits.limit).toBe('number');
      expect(rateLimits.limit).toBeGreaterThan(0);
    }
  });

  it('should handle burst of concurrent requests without dropping socket connections', async () => {
    const concurrentRequests = 5;

    const promises = Array.from({ length: concurrentRequests }, (_, i) =>
      client.execute(GET_POSTS, { first: 1 })
    );

    const results = await Promise.all(promises);

    expect(results.length).toBe(concurrentRequests);
    for (const res of results) {
      expect([200, 429]).toContain(res.status);
    }
  });
});
