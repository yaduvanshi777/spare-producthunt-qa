import { describe, it, expect } from 'bun:test';
import { getTestClient } from './setup';
import { DEEP_NESTED_QUERY } from '../../src/api/queries';

describe('API Security: GraphQL Query Complexity & DoS Resilience', () => {
  const client = getTestClient();

  it('should execute deep nested queries within reasonable latency boundaries', async () => {
    const start = performance.now();
    const result = await client.execute(DEEP_NESTED_QUERY);
    const duration = performance.now() - start;

    // Verify response completed in under 1500ms
    expect(duration).toBeLessThan(1500);

    // Either successful data returned or server enforced query depth error
    if (result.status === 200) {
      expect(result.data).toBeDefined();
    } else {
      expect(result.status).toBe(400);
      expect(result.errors).toBeDefined();
    }
  });

  it('should not leak server internal stack traces in GraphQL errors', async () => {
    const result = await client.execute(DEEP_NESTED_QUERY);

    if (result.errors && result.errors.length > 0) {
      for (const err of result.errors) {
        const errorString = JSON.stringify(err);
        // Ensure stack trace / internal file paths are not exposed
        expect(errorString).not.toContain('/home/');
        expect(errorString).not.toContain('/app/');
        expect(errorString).not.toContain('node_modules');
      }
    }
  });
});
