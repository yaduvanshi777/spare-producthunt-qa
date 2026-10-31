import dotenv from 'dotenv';
import type { GraphQLResponseEnvelope, GraphQLErrorItem } from './types';

dotenv.config();

export interface GraphQLClientOptions {
  endpoint?: string;
  token?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export interface GraphQLResult<T = any> {
  status: number;
  data?: T | null;
  errors?: GraphQLErrorItem[];
  headers: Headers;
  responseTimeMs: number;
  rawText: string;
}

export interface RateLimitHeaders {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
}

/**
 * Product Hunt GraphQL API Client
 * Built on native fetch for zero overhead in Bun/Node.
 * Provides response time measurement, rate limit header extraction,
 * and support for custom headers & token injection.
 */
export class ProductHuntGraphQLClient {
  readonly endpoint: string;
  readonly token?: string;
  readonly timeoutMs: number;
  readonly defaultHeaders: Record<string, string>;

  constructor(options: GraphQLClientOptions = {}) {
    this.endpoint =
      options.endpoint ||
      process.env.PRODUCT_HUNT_API_URL ||
      'https://api.producthunt.com/v2/api/graphql';
    this.token = options.token !== undefined ? options.token : process.env.PRODUCT_HUNT_API_TOKEN;
    this.timeoutMs = options.timeoutMs ?? 15000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Spare-QA-Test-Runner/1.0',
      ...(options.headers || {}),
    };
  }

  /**
   * Executes a GraphQL query or mutation.
   */
  async execute<T = any>(
    query: string,
    variables?: Record<string, any>,
    overrideHeaders?: Record<string, string>
  ): Promise<GraphQLResult<T>> {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(overrideHeaders || {}),
    };

    // Inject Bearer token only if Authorization was not explicitly specified in overrideHeaders
    const hasExplicitAuth = overrideHeaders && ('Authorization' in overrideHeaders || 'authorization' in overrideHeaders);
    if (this.token && !hasExplicitAuth) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Clean up empty header values so they don't send empty headers
    if (headers['Authorization'] === '') {
      delete headers['Authorization'];
    }
    if (headers['authorization'] === '') {
      delete headers['authorization'];
    }

    const payload = JSON.stringify({
      query,
      variables: variables || {},
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const start = performance.now();

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: payload,
        signal: controller.signal,
      });

      const responseTimeMs = Math.round(performance.now() - start);
      const rawText = await response.text();

      let parsedJson: GraphQLResponseEnvelope<T> | null = null;
      try {
        parsedJson = JSON.parse(rawText);
      } catch {
        // Response was not JSON (e.g. Cloudflare HTML block or proxy error)
      }

      return {
        status: response.status,
        data: parsedJson?.data as T | null | undefined,
        errors: parsedJson?.errors,
        headers: response.headers,
        responseTimeMs,
        rawText,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Extracts standard rate limit headers from HTTP response.
   */
  getRateLimitInfo(headers: Headers): RateLimitHeaders {
    const parseNum = (val: string | null) => (val !== null ? parseInt(val, 10) : null);
    return {
      limit: parseNum(headers.get('x-ratelimit-limit')),
      remaining: parseNum(headers.get('x-ratelimit-remaining')),
      reset: parseNum(headers.get('x-ratelimit-reset')),
    };
  }

  /**
   * Returns true if client has an active token configured
   */
  hasToken(): boolean {
    return Boolean(this.token && this.token.trim().length > 0);
  }
}
