/**
 * Product Hunt GraphQL Query Documents
 * Used by the API test suite for functional, pagination, schema contract, and security testing.
 */

export const GET_VIEWER = /* GraphQL */ `
  query GetViewer {
    viewer {
      user {
        id
        name
        username
        headline
      }
    }
  }
`;

export const GET_POSTS = /* GraphQL */ `
  query GetPosts($first: Int, $after: String, $order: PostsOrder) {
    posts(first: $first, after: $after, order: $order) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          name
          tagline
          description
          url
          votesCount
          commentsCount
          createdAt
          website
          thumbnail {
            type
            url
          }
          topics(first: 3) {
            edges {
              node {
                id
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_ID = /* GraphQL */ `
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      name
      tagline
      description
      url
      votesCount
      commentsCount
      createdAt
      featuredAt
      website
      makers {
        id
        name
        username
        headline
      }
      media {
        type
        url
        videoUrl
      }
      thumbnail {
        type
        url
      }
      topics(first: 5) {
        edges {
          node {
            id
            name
            slug
            description
          }
        }
      }
    }
  }
`;

export const GET_TOPICS = /* GraphQL */ `
  query GetTopics($first: Int, $after: String, $order: TopicsOrder) {
    topics(first: $first, after: $after, order: $order) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          name
          slug
          description
          postsCount
          followersCount
        }
      }
    }
  }
`;

/**
 * Deep recursive query designed to evaluate GraphQL DoS vulnerability,
 * query depth limits, and query cost analysis.
 */
export const DEEP_NESTED_QUERY = /* GraphQL */ `
  query DeepNestedQuery {
    posts(first: 1) {
      edges {
        node {
          id
          name
          makers {
            id
            name
            # Simulating circular / deep expansion
          }
          topics(first: 1) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Intentionally malformed query to test API parser robust error messaging
 */
export const SYNTAX_ERROR_QUERY = /* GraphQL */ `
  query MalformedQuery {
    posts(first: "not-a-number") {
      edges { node { id } }
    }
  }
`;
