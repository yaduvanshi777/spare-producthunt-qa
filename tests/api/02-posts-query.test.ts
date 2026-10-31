import { describe, it, expect } from 'bun:test';
import { getTestClient } from './setup';
import { GET_POSTS } from '../../src/api/queries';
import { PostsQueryResponseSchema } from '../../src/api/types';

describe('API Contract: Posts Query & Relay Cursor Pagination', () => {
  const client = getTestClient();

  it('should fetch posts list and adhere to Zod runtime contract schema', async () => {
    const result = await client.execute(GET_POSTS, { first: 3 });

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();

    // Enforce runtime schema validation with Zod
    const validation = PostsQueryResponseSchema.safeParse(result.data);
    expect(validation.success).toBe(true);

    if (!validation.success) {
      console.error('Schema validation errors:', validation.error.format());
    }
  });

  it('should return requested number of edges and valid Relay pageInfo', async () => {
    const limit = 2;
    const result = await client.execute(GET_POSTS, { first: limit });

    expect(result.status).toBe(200);
    const posts = result.data.posts;

    expect(posts.edges.length).toBeLessThanOrEqual(limit);
    expect(posts.pageInfo).toBeDefined();
    expect(typeof posts.pageInfo.hasNextPage).toBe('boolean');
    expect(posts.pageInfo.startCursor).toBeDefined();
    expect(posts.pageInfo.endCursor).toBeDefined();
  });

  it('should return valid non-null fields for each post node', async () => {
    const result = await client.execute(GET_POSTS, { first: 3 });
    const edges = result.data.posts.edges;

    expect(edges.length).toBeGreaterThan(0);

    for (const edge of edges) {
      const node = edge.node;
      expect(node.id).toBeDefined();
      expect(node.name.length).toBeGreaterThan(0);
      expect(node.tagline.length).toBeGreaterThan(0);
      expect(node.votesCount).toBeGreaterThanOrEqual(0);
      expect(node.url).toContain('producthunt.com');
    }
  });
});
