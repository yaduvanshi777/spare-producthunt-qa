import { describe, it, expect } from 'bun:test';
import { getTestClient } from './setup';
import { SYNTAX_ERROR_QUERY } from '../../src/api/queries';

describe('API Contract: Input Validation & GraphQL Schema Error Handling', () => {
  const client = getTestClient();

  it('should return schema validation error when passing invalid argument types', async () => {
    const result = await client.execute(SYNTAX_ERROR_QUERY);

    // GraphQL engines return 400 Bad Request or 200 with errors array for schema validation errors
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);

    const firstError = result.errors![0];
    expect(firstError.message).toContain('invalid value');
  });

  it('should include error locations or code in GraphQL validation response', async () => {
    const result = await client.execute(SYNTAX_ERROR_QUERY);

    expect(result.errors).toBeDefined();
    const firstError = result.errors![0];

    const hasLocationsOrExtensions = Boolean(
      (firstError.locations && firstError.locations.length > 0) ||
      firstError.extensions ||
      firstError.error
    );

    expect(hasLocationsOrExtensions).toBe(true);
  });
});
