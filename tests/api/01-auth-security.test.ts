import { describe, it, expect } from 'bun:test';
import { getTestClient } from './setup';
import { GET_VIEWER } from '../../src/api/queries';

describe('API Security: Authentication & OAuth Authorization Gating', () => {
  const client = getTestClient();

  it('should reject unauthenticated queries with HTTP 401 Unauthorized', async () => {
    // Send query explicitly stripping the Authorization header
    const result = await client.execute(GET_VIEWER, {}, { Authorization: '' });

    expect(result.status).toBe(401);
    expect(result.data).toBeNull();
  });

  it('should return OAuth error envelope detailing missing token', async () => {
    const result = await client.execute(GET_VIEWER, {}, { Authorization: '' });

    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);

    const firstError = result.errors![0];
    expect(firstError.error).toBe('invalid_oauth_token');
    expect(firstError.error_description).toContain('valid access token');
  });

  it('should reject malformed or non-Bearer authorization schemes', async () => {
    const result = await client.execute(
      GET_VIEWER,
      {},
      { Authorization: 'Basic dXNlcjpwYXNz' }
    );

    expect(result.status).toBe(401);
    expect(result.errors![0].error).toBe('invalid_oauth_token');
  });

  it('should accept valid Bearer token and return authenticated viewer profile', async () => {
    const result = await client.execute(GET_VIEWER);

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();
    expect(result.data.viewer).toBeDefined();
    expect(result.data.viewer.user.id).toBeDefined();
  });
});
