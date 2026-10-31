import { startServer } from '../../src/server/mock-app';
import { ProductHuntGraphQLClient } from '../../src/api/client';

let serverInstance: any = null;
let endpointUrl = '';

/**
 * Global test helper for API suite
 * If live PRODUCT_HUNT_API_TOKEN is provided and URL is set to production,
 * tests target live Product Hunt API.
 * Otherwise, launches hermetic test server on an ephemeral free OS port (port 0)
 * for isolated, collision-free, zero-flakiness execution.
 */
export function getTestClient(): ProductHuntGraphQLClient {
  const isLive = Boolean(
    process.env.PRODUCT_HUNT_API_TOKEN &&
    process.env.PRODUCT_HUNT_API_URL?.includes('api.producthunt.com')
  );

  if (isLive) {
    return new ProductHuntGraphQLClient({
      endpoint: process.env.PRODUCT_HUNT_API_URL,
      token: process.env.PRODUCT_HUNT_API_TOKEN,
    });
  }

  if (!serverInstance) {
    serverInstance = startServer(0);
    endpointUrl = `http://127.0.0.1:${serverInstance.port}/v2/api/graphql`;
  }

  return new ProductHuntGraphQLClient({
    endpoint: endpointUrl,
    token: 'test_bearer_token_spare_qa',
  });
}
