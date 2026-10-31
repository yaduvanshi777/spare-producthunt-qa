/**
 * Hermetic Product Hunt Web & GraphQL Application Server
 * Built with Bun.serve for instant, deterministic, zero-flakiness testing in CI
 * and offline environments. Mirrors Product Hunt DOM structure, semantic roles,
 * Next.js SSR routing, and GraphQL API contracts.
 */

const PORT = Number(process.env.PORT) || 3000;

export const mockPosts = [
  {
    id: 'post-101',
    name: 'Cursor AI',
    tagline: 'The AI-first Code Editor built for software engineers',
    slug: 'cursor-ai',
    votesCount: 1420,
    commentsCount: 98,
    createdAt: '2026-10-31T00:01:00.000Z',
    website: 'https://cursor.com',
    makers: [
      { id: 'u-1', name: 'Aman Sanger', username: 'amansanger', headline: 'Co-founder at Anysphere' },
      { id: 'u-2', name: 'Michael Truell', username: 'michaeltruell', headline: 'Co-founder at Anysphere' },
    ],
    topics: [
      { id: 't-1', name: 'Developer Tools', slug: 'developer-tools' },
      { id: 't-2', name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
    ],
  },
  {
    id: 'post-102',
    name: 'Claude Artifacts',
    tagline: 'Interactive code and UI previews directly in conversation',
    slug: 'claude-artifacts',
    votesCount: 980,
    commentsCount: 64,
    createdAt: '2026-10-31T01:15:00.000Z',
    website: 'https://anthropic.com',
    makers: [
      { id: 'u-3', name: 'Dario Amodei', username: 'dario', headline: 'CEO at Anthropic' },
    ],
    topics: [
      { id: 't-2', name: 'Artificial Intelligence', slug: 'artificial-intelligence' },
      { id: 't-3', name: 'Productivity', slug: 'productivity' },
    ],
  },
  {
    id: 'post-103',
    name: 'Supabase Branching',
    tagline: 'Git-like database preview branches for Postgres',
    slug: 'supabase-branching',
    votesCount: 755,
    commentsCount: 42,
    createdAt: '2026-10-31T02:30:00.000Z',
    website: 'https://supabase.com',
    makers: [
      { id: 'u-4', name: 'Paul Copplestone', username: 'kiwicopple', headline: 'CEO at Supabase' },
    ],
    topics: [
      { id: 't-1', name: 'Developer Tools', slug: 'developer-tools' },
      { id: 't-4', name: 'Databases', slug: 'databases' },
    ],
  },
];

export const mockTopics = [
  { id: 't-1', name: 'Developer Tools', slug: 'developer-tools', postsCount: 1450, followersCount: 89000, description: 'Tools and platforms for software engineers and QA teams.' },
  { id: 't-2', name: 'Artificial Intelligence', slug: 'artificial-intelligence', postsCount: 3200, followersCount: 210000, description: 'Cutting edge machine learning, LLMs, and intelligent automation.' },
  { id: 't-3', name: 'Productivity', slug: 'productivity', postsCount: 2890, followersCount: 175000, description: 'Software to streamline work, collaboration, and personal workflow.' },
  { id: 't-4', name: 'Databases', slug: 'databases', postsCount: 640, followersCount: 45000, description: 'Modern storage, vector databases, and high-scale backends.' },
];

function renderGlobalHeader() {
  return `
    <header data-test="global-header" class="site-header">
      <div class="header-container">
        <a href="/" class="brand-logo" aria-label="Product Hunt Home">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#DA552F"/>
            <path d="M22.6667 20H17V14H22.6667C24.3235 14 25.6667 15.3431 25.6667 17C25.6667 18.6569 24.3235 20 22.6667 20ZM22.6667 10H13V30H17V24H22.6667C26.5327 24 29.6667 20.866 29.6667 17C29.6667 13.134 26.5327 10 22.6667 10Z" fill="white"/>
          </svg>
          <span class="logo-text">Product Hunt</span>
        </a>
        <form action="/search" method="GET" class="search-box">
          <input type="search" name="q" data-test="search-input" placeholder="Search (e.g. AI, developer tools)..." aria-label="Search" />
          <button type="submit" data-test="search-button" aria-label="Search">Search</button>
        </form>
        <nav data-test="navigation-menu" class="nav-links">
          <a href="/topics/developer-tools" class="nav-link">Developer Tools</a>
          <a href="/topics/artificial-intelligence" class="nav-link">AI</a>
          <button data-test="sign-in-button" class="btn-signin" onclick="openAuthModal()">Sign in</button>
          <button data-test="mobile-menu-toggle" class="menu-toggle" aria-label="Toggle Menu" onclick="toggleMobileMenu()">☰</button>
        </nav>
      </div>
      <div id="mobile-menu" class="mobile-menu-drawer hidden">
        <a href="/">Home</a>
        <a href="/topics/developer-tools">Developer Tools</a>
        <a href="/topics/artificial-intelligence">Artificial Intelligence</a>
        <a href="/topics/productivity">Productivity</a>
      </div>
    </header>
  `;
}

function renderAuthModal() {
  return `
    <div id="auth-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" class="auth-modal hidden" data-test="auth-modal">
      <div class="modal-backdrop" onclick="closeAuthModal()"></div>
      <div class="modal-content">
        <button data-test="modal-close-button" class="modal-close" aria-label="Close" onclick="closeAuthModal()">✕</button>
        <h2 id="modal-title">Sign up to join the conversation</h2>
        <p>Join our community of makers, developers, and tech enthusiasts.</p>
        <div class="auth-buttons">
          <button class="btn-oauth google">Sign in with Google</button>
          <button class="btn-oauth twitter">Sign in with X / Twitter</button>
        </div>
      </div>
    </div>
  `;
}

function renderScripts() {
  return `
    <script>
      function openAuthModal() {
        document.getElementById('auth-modal').classList.remove('hidden');
        document.querySelector('[data-test="modal-close-button"]').focus();
      }
      function closeAuthModal() {
        document.getElementById('auth-modal').classList.add('hidden');
      }
      function toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
      }
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closeAuthModal();
        }
      });
    </script>
  `;
}

function renderBaseLayout(title: string, bodyContent: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Product Hunt</title>
  <style>
    :root {
      --primary: #DA552F;
      --bg: #FAFAF9;
      --text: #212936;
      --card-bg: #FFFFFF;
      --border: #E5E7EB;
      --muted: #6B7280;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }
    .site-header { background: #fff; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; padding: 0.75rem 1.5rem; }
    .header-container { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .brand-logo { display: flex; align-items: center; gap: 0.5rem; text-decoration: none; color: inherit; font-weight: 700; font-size: 1.25rem; }
    .search-box { display: flex; flex: 1; max-width: 450px; }
    .search-box input { width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--border); border-radius: 6px 0 0 6px; font-size: 0.95rem; }
    .search-box button { padding: 0.5rem 1rem; background: #eee; border: 1px solid var(--border); border-left: none; border-radius: 0 6px 6px 0; cursor: pointer; }
    .nav-links { display: flex; align-items: center; gap: 1rem; }
    .nav-link { text-decoration: none; color: var(--muted); font-size: 0.95rem; }
    .btn-signin { background: none; border: 1px solid var(--border); padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .menu-toggle { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; }
    .mobile-menu-drawer { background: #fff; border-bottom: 1px solid var(--border); padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
    .post-item { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; transition: transform 0.1s; }
    .post-item:hover { transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .post-info { flex: 1; }
    .post-rank { font-weight: bold; color: var(--primary); margin-right: 0.5rem; }
    .post-title a { text-decoration: none; color: var(--text); font-size: 1.15rem; font-weight: 600; }
    .post-tagline { color: var(--muted); font-size: 0.95rem; margin-top: 0.25rem; }
    .topic-pill { display: inline-block; background: #F3F4F6; color: var(--muted); font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 9999px; text-decoration: none; margin-top: 0.5rem; margin-right: 0.35rem; }
    .vote-button { display: flex; flex-direction: column; align-items: center; min-width: 65px; padding: 0.5rem; border: 1px solid var(--border); border-radius: 8px; background: #fff; cursor: pointer; font-weight: 600; }
    .vote-button:hover { border-color: var(--primary); color: var(--primary); }
    .auth-modal { position: fixed; inset: 0; z-index: 999; display: flex; align-items: center; justify-content: center; }
    .modal-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.4); }
    .modal-content { position: relative; background: #fff; padding: 2rem; border-radius: 12px; max-width: 400px; width: 90%; z-index: 10; text-align: center; }
    .modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.25rem; cursor: pointer; }
    .btn-oauth { width: 100%; padding: 0.75rem; margin-top: 0.75rem; border: 1px solid var(--border); border-radius: 6px; font-weight: 600; cursor: pointer; }
    .hidden { display: none !important; }
    @media (max-width: 768px) {
      .menu-toggle { display: block; }
      .search-box { display: flex; max-width: 160px; }
      .search-box input { font-size: 0.8rem; }
      .search-box button { font-size: 0.8rem; padding: 0.4rem 0.6rem; }
      .nav-links a.nav-link { display: none; }
    }
  </style>
</head>
<body>
  ${renderGlobalHeader()}
  <div class="container">
    ${bodyContent}
  </div>
  ${renderAuthModal()}
  ${renderScripts()}
</body>
</html>`;
}

function handleGraphQLRequest(body: any, authHeader: string | null) {
  // Enforce security auth check as verified on Product Hunt API
  if (!authHeader || !authHeader.trim() || !authHeader.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({
        data: null,
        errors: [
          {
            error: 'invalid_oauth_token',
            error_description:
              'Please supply a valid access token. Refer to our api documentation about how to authorize an api request.',
          },
        ],
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': '99',
          'X-RateLimit-Reset': '3600',
        },
      }
    );
  }

  const query = body?.query || '';
  const variables = body?.variables || {};

  // Check for syntax / validation errors test
  if (query.includes('first: "not-a-number"') || variables.first === 'invalid') {
    return new Response(
      JSON.stringify({
        data: null,
        errors: [
          {
            message: 'Argument "first" has invalid value "not-a-number". Expected type "Int".',
            locations: [{ line: 2, column: 17 }],
            extensions: { code: 'GRAPHQL_VALIDATION_FAILED' },
          },
        ],
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Check for viewer query
  if (query.includes('GetViewer') || (query.includes('viewer') && !query.includes('posts'))) {
    return Response.json({
      data: {
        viewer: {
          user: {
            id: 'usr-spare-001',
            name: 'Spare QA Engineer',
            username: 'spareqa',
            headline: 'Owning Quality at Spare',
          },
        },
      },
    });
  }

  // Check for post by ID query
  if (query.includes('GetPostById') || query.includes('post(id:')) {
    const id = variables.id || 'post-101';
    const found = mockPosts.find((p) => p.id === id) || mockPosts[0];
    return Response.json({
      data: {
        post: {
          ...found,
          description: found.tagline,
          url: `https://www.producthunt.com/posts/${found.slug}`,
          featuredAt: found.createdAt,
          media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe', videoUrl: null }],
          thumbnail: { type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe' },
          topics: {
            edges: found.topics.map((t) => ({ node: { ...t, description: 'Topic description' } })),
          },
        },
      },
    });
  }

  // Check for top-level topics catalog query
  if (query.includes('GetTopics') || query.includes('topics(first: $first, after: $after')) {
    return Response.json({
      data: {
        topics: {
          totalCount: mockTopics.length,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: 'cursor-topic-1',
            endCursor: 'cursor-topic-4',
          },
          edges: mockTopics.map((t) => ({
            cursor: `cursor-${t.id}`,
            node: t,
          })),
        },
      },
    });
  }

  // Default: Posts feed query (GetPosts / DeepNestedQuery)
  const limit = typeof variables.first === 'number' ? variables.first : mockPosts.length;
  const sliced = mockPosts.slice(0, limit);

  return Response.json({
    data: {
      posts: {
        totalCount: mockPosts.length,
        pageInfo: {
          hasNextPage: sliced.length < mockPosts.length,
          hasPreviousPage: false,
          startCursor: 'cursor-101',
          endCursor: 'cursor-103',
        },
        edges: sliced.map((p) => ({
          cursor: `cursor-${p.id}`,
          node: {
            ...p,
            description: p.tagline,
            url: `https://www.producthunt.com/posts/${p.slug}`,
            thumbnail: { type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe' },
            topics: {
              edges: p.topics.map((t) => ({ node: { ...t, description: 'Topic description' } })),
            },
          },
        })),
      },
    },
  });
}

export function startServer(port: number = PORT) {
  const server = Bun.serve({
    port,
    async fetch(req) {
      const url = new URL(req.url);

      // Handle GraphQL API
      if (url.pathname === '/v2/api/graphql' && req.method === 'POST') {
        const authHeader = req.headers.get('authorization');
        let body: any = {};
        try {
          body = await req.json();
        } catch {}
        return handleGraphQLRequest(body, authHeader);
      }

      // Handle Homepage
      if (url.pathname === '/') {
        const postsHtml = mockPosts
          .map(
            (p, idx) => `
          <article data-test="post-item" class="post-item">
            <div class="post-info">
              <span data-test="post-rank" class="post-rank">#${idx + 1}</span>
              <h3 data-test="post-name" class="post-title">
                <a href="/posts/${p.slug}">${p.name}</a>
              </h3>
              <p data-test="post-tagline" class="post-tagline">${p.tagline}</p>
              <div>
                ${p.topics.map((t) => `<a href="/topics/${t.slug}" data-test="topic-tag" class="topic-pill">${t.name}</a>`).join('')}
              </div>
            </div>
            <button data-test="vote-button" class="vote-button" onclick="openAuthModal()">
              <span>▲</span>
              <span>${p.votesCount}</span>
            </button>
          </article>
        `
          )
          .join('');

        const content = `
          <main data-test="feed-section" class="feed-section">
            <h2 data-test="daily-header" style="margin-bottom: 1.5rem;">Top Products Launching Today</h2>
            ${postsHtml}
          </main>
        `;
        return new Response(renderBaseLayout('Top Products Today', content), {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // Handle Post Detail
      if (url.pathname.startsWith('/posts/')) {
        const slug = url.pathname.replace('/posts/', '');
        const post = mockPosts.find((p) => p.slug === slug);

        if (!post) {
          const notFound = `
            <div style="text-align: center; padding: 4rem 1rem;">
              <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">404 - Page Not Found</h1>
              <p style="color: var(--muted); margin-bottom: 2rem;">The product you are looking for does not exist or has been removed.</p>
              <a href="/" style="background: var(--primary); color: #fff; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600;">Back to Home</a>
            </div>
          `;
          return new Response(renderBaseLayout('Page Not Found', notFound), {
            status: 404,
            headers: { 'Content-Type': 'text/html' },
          });
        }

        const detailHtml = `
          <header style="margin-bottom: 2rem;">
            <h1 data-test="post-title">${post.name}</h1>
            <p data-test="post-tagline" class="post-tagline" style="font-size: 1.25rem; margin: 0.5rem 0 1.5rem 0;">${post.tagline}</p>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <a href="${post.website}" data-test="visit-website" target="_blank" rel="noopener noreferrer" style="background: var(--primary); color: #fff; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: 600;">Visit Website</a>
              <button data-test="vote-button" class="vote-button" onclick="openAuthModal()" style="display: inline-flex; flex-direction: row; gap: 0.5rem; height: 44px; padding: 0 1.25rem;">
                <span>▲</span>
                <span>Upvote (${post.votesCount})</span>
              </button>
            </div>
          </header>
          <section data-test="makers-section" class="makers-list" style="margin-bottom: 2rem; padding: 1.5rem; background: #fff; border: 1px solid var(--border); border-radius: 8px;">
            <h3>Makers</h3>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              ${post.makers.map((m) => `<div data-test="maker-badge" class="maker-item"><strong>${m.name}</strong> <span style="color: var(--muted);">(@${m.username})</span></div>`).join('')}
            </div>
          </section>
          <section data-test="comments-section" class="comments-container" style="background: #fff; border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem;">
            <h3>Discussion (${post.commentsCount})</h3>
            <div style="margin-top: 1rem;">
              <textarea data-test="comment-input" placeholder="Leave a comment..." style="width: 100%; height: 80px; padding: 0.75rem; border: 1px solid var(--border); border-radius: 6px;" onfocus="openAuthModal()"></textarea>
            </div>
            <div style="margin-top: 1.5rem;">
              <div data-test="comment-item" class="comment-card" style="border-top: 1px solid var(--border); padding-top: 1rem;">
                <strong>Alex Rivera</strong> <span style="color: var(--muted); font-size: 0.85rem;">2 hours ago</span>
                <p style="margin-top: 0.25rem;">Incredible release! The developer velocity gain is noticeable right away.</p>
              </div>
            </div>
          </section>
        `;
        return new Response(renderBaseLayout(post.name, detailHtml), {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // Handle Search Page
      if (url.pathname === '/search') {
        const query = (url.searchParams.get('q') || '').trim();
        const lower = query.toLowerCase();
        const matches = lower ? mockPosts.filter((p) => p.name.toLowerCase().includes(lower) || p.tagline.toLowerCase().includes(lower)) : [];

        let resultsHtml = '';
        if (matches.length > 0) {
          resultsHtml = `
            <div data-test="search-results" class="search-results-list">
              ${matches.map((p) => `
                <article data-test="search-result-item" class="post-item">
                  <div class="post-info">
                    <h3 class="post-title"><a href="/posts/${p.slug}">${p.name}</a></h3>
                    <p class="post-tagline">${p.tagline}</p>
                  </div>
                </article>
              `).join('')}
            </div>
          `;
        } else if (query) {
          resultsHtml = `<div data-test="no-results" class="no-results-state" style="padding: 3rem; text-align: center; color: var(--muted);">No results found for "${query}"</div>`;
        } else {
          resultsHtml = `<div style="padding: 2rem; color: var(--muted);">Type a keyword above to search products...</div>`;
        }

        const searchHtml = `
          <h2>Search Results for "${query}"</h2>
          <div data-test="search-filters" style="margin: 1rem 0; display: flex; gap: 0.5rem;">
            <button class="filter-tab active" style="padding: 0.4rem 0.8rem; background: var(--primary); color: #fff; border: none; border-radius: 4px;">All</button>
            <button class="filter-tab" style="padding: 0.4rem 0.8rem; background: #eee; border: none; border-radius: 4px;">Products</button>
            <button class="filter-tab" style="padding: 0.4rem 0.8rem; background: #eee; border: none; border-radius: 4px;">Topics</button>
          </div>
          ${resultsHtml}
        `;
        return new Response(renderBaseLayout(`Search: ${query}`, searchHtml), {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // Handle Topic Page
      if (url.pathname.startsWith('/topics/')) {
        const slug = url.pathname.replace('/topics/', '');
        const topic = mockTopics.find((t) => t.slug === slug);

        if (!topic) {
          return new Response(renderBaseLayout('Topic Not Found', '<h1>Topic Not Found</h1>'), { status: 404 });
        }

        const topicPosts = mockPosts.filter((p) => p.topics.some((t) => t.slug === slug));
        const topicHtml = `
          <header style="margin-bottom: 2rem;">
            <h1 data-test="topic-title">${topic.name}</h1>
            <p data-test="topic-description" class="topic-description" style="color: var(--muted); font-size: 1.1rem; margin: 0.5rem 0 1rem 0;">${topic.description}</p>
            <div style="display: flex; gap: 1rem; align-items: center;">
              <button data-test="follow-topic" class="btn-signin" style="background: var(--primary); color: #fff; border: none;" onclick="openAuthModal()">Follow</button>
              <span data-test="followers-count" class="followers-badge" style="color: var(--muted); font-size: 0.9rem;">${topic.followersCount.toLocaleString()} followers</span>
            </div>
          </header>
          <div class="topic-posts">
            ${topicPosts.map((p) => `
              <article data-test="post-item" class="post-item">
                <div class="post-info">
                  <h3 class="post-title"><a href="/posts/${p.slug}">${p.name}</a></h3>
                  <p class="post-tagline">${p.tagline}</p>
                </div>
              </article>
            `).join('')}
          </div>
        `;
        return new Response(renderBaseLayout(topic.name, topicHtml), {
          headers: { 'Content-Type': 'text/html' },
        });
      }

      // Fallback 404
      return new Response(renderBaseLayout('Not Found', '<h1>404 Not Found</h1>'), { status: 404 });
    },
  });

  return server;
}

// Start immediately if executed directly
if (import.meta.main) {
  const server = startServer(PORT);
  console.log(`[Mock Server] Product Hunt Test Server running at http://localhost:${server.port}`);
}
