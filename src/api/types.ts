import { z } from 'zod';

/**
 * GraphQL Core Schemas and Types for Product Hunt API v2
 * Provides compile-time TypeScript types and runtime Zod contract validation.
 */

// User / Maker Schema
export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  username: z.string().optional().nullable(),
  headline: z.string().optional().nullable(),
  websiteUrl: z.string().url().optional().nullable(),
});

export type User = z.infer<typeof UserSchema>;

// Media / Thumbnail Schema
export const MediaSchema = z.object({
  type: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  videoUrl: z.string().url().optional().nullable(),
});

export type Media = z.infer<typeof MediaSchema>;

// Topic Schema
export const TopicSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  postsCount: z.number().int().nonnegative().optional().nullable(),
  followersCount: z.number().int().nonnegative().optional().nullable(),
});

export type Topic = z.infer<typeof TopicSchema>;

// Post Schema
export const PostSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  votesCount: z.number().int().nonnegative().optional().nullable(),
  commentsCount: z.number().int().nonnegative().optional().nullable(),
  createdAt: z.string().datetime({ offset: true }).or(z.string()).optional(),
  featuredAt: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  makers: z.array(UserSchema).optional(),
  media: z.array(MediaSchema).optional(),
  thumbnail: MediaSchema.optional().nullable(),
  topics: z
    .object({
      edges: z.array(
        z.object({
          node: TopicSchema,
        })
      ),
    })
    .optional(),
});

export type Post = z.infer<typeof PostSchema>;

// Relay Pagination Schemas
export const PageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  startCursor: z.string().nullable().optional(),
  endCursor: z.string().nullable().optional(),
});

export type PageInfo = z.infer<typeof PageInfoSchema>;

export const PostEdgeSchema = z.object({
  cursor: z.string().min(1),
  node: PostSchema,
});

export const PostsPayloadSchema = z.object({
  totalCount: z.number().int().nonnegative().optional(),
  pageInfo: PageInfoSchema,
  edges: z.array(PostEdgeSchema),
});

export type PostsPayload = z.infer<typeof PostsPayloadSchema>;

// Top-level GraphQL Query Response Wrappers
export const PostsQueryResponseSchema = z.object({
  posts: PostsPayloadSchema,
});

export type PostsQueryResponse = z.infer<typeof PostsQueryResponseSchema>;

export const PostQueryResponseSchema = z.object({
  post: PostSchema.nullable(),
});

export type PostQueryResponse = z.infer<typeof PostQueryResponseSchema>;

export const TopicsPayloadSchema = z.object({
  totalCount: z.number().int().nonnegative().optional(),
  pageInfo: PageInfoSchema.optional(),
  edges: z.array(
    z.object({
      cursor: z.string().optional(),
      node: TopicSchema,
    })
  ),
});

export const TopicsQueryResponseSchema = z.object({
  topics: TopicsPayloadSchema,
});

export type TopicsQueryResponse = z.infer<typeof TopicsQueryResponseSchema>;

// Standard GraphQL Error Schema
export const GraphQLErrorLocationSchema = z.object({
  line: z.number().int(),
  column: z.number().int(),
});

export const GraphQLErrorItemSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
  locations: z.array(GraphQLErrorLocationSchema).optional(),
  path: z.array(z.union([z.string(), z.number()])).optional(),
  extensions: z.record(z.any()).optional(),
});

export type GraphQLErrorItem = z.infer<typeof GraphQLErrorItemSchema>;

export const GraphQLResponseEnvelopeSchema = z.object({
  data: z.record(z.any()).nullable().optional(),
  errors: z.array(GraphQLErrorItemSchema).optional(),
});

export type GraphQLResponseEnvelope<T = any> = {
  data?: T | null;
  errors?: GraphQLErrorItem[];
};
