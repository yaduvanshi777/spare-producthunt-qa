import { describe, it, expect } from 'bun:test';
import { getTestClient } from './setup';
import { GET_POST_BY_ID } from '../../src/api/queries';
import { PostQueryResponseSchema } from '../../src/api/types';

describe('API Contract: Single Post Details by ID', () => {
  const client = getTestClient();

  it('should fetch single post by ID conforming to Zod schema', async () => {
    const result = await client.execute(GET_POST_BY_ID, { id: 'post-101' });

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();

    const validation = PostQueryResponseSchema.safeParse(result.data);
    expect(validation.success).toBe(true);
  });

  it('should return nested makers array with usernames and headlines', async () => {
    const result = await client.execute(GET_POST_BY_ID, { id: 'post-101' });
    const post = result.data.post;

    expect(post).toBeDefined();
    expect(Array.isArray(post.makers)).toBe(true);
    expect(post.makers.length).toBeGreaterThan(0);

    const firstMaker = post.makers[0];
    expect(firstMaker.id).toBeDefined();
    expect(firstMaker.name).toBeDefined();
    expect(firstMaker.username).toBeDefined();
  });

  it('should return valid thumbnail media and associated topics', async () => {
    const result = await client.execute(GET_POST_BY_ID, { id: 'post-101' });
    const post = result.data.post;

    expect(post.thumbnail).toBeDefined();
    expect(post.thumbnail.url).toContain('http');

    expect(post.topics).toBeDefined();
    expect(post.topics.edges.length).toBeGreaterThan(0);
    expect(post.topics.edges[0].node.slug).toBeDefined();
  });
});
