import { describe, it, expect } from 'bun:test';
import { getTestClient } from './setup';
import { GET_TOPICS } from '../../src/api/queries';
import { TopicsQueryResponseSchema } from '../../src/api/types';

describe('API Contract: Topics & Categories Catalog', () => {
  const client = getTestClient();

  it('should query topics and adhere to TopicsQueryResponseSchema', async () => {
    const result = await client.execute(GET_TOPICS, { first: 4 });

    expect(result.status).toBe(200);
    expect(result.data).toBeDefined();

    const validation = TopicsQueryResponseSchema.safeParse(result.data);
    expect(validation.success).toBe(true);
  });

  it('should validate kebab-case slug format for all returned topics', async () => {
    const result = await client.execute(GET_TOPICS, { first: 4 });
    const edges = result.data.topics.edges;

    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    for (const edge of edges) {
      const topic = edge.node;
      expect(topic.id).toBeDefined();
      expect(topic.slug).toMatch(slugPattern);
      expect(topic.name.length).toBeGreaterThan(0);
    }
  });

  it('should return non-negative follower and post metrics', async () => {
    const result = await client.execute(GET_TOPICS, { first: 4 });
    const edges = result.data.topics.edges;

    for (const edge of edges) {
      const topic = edge.node;
      if (topic.postsCount !== null && topic.postsCount !== undefined) {
        expect(topic.postsCount).toBeGreaterThanOrEqual(0);
      }
      if (topic.followersCount !== null && topic.followersCount !== undefined) {
        expect(topic.followersCount).toBeGreaterThanOrEqual(0);
      }
    }
  });
});
