// ============================================================
//  BLOGS.JS — GitHub‑Powered Blog Loader
//  Earthy Forest Edition · Production-Ready
//  Fetches Markdown posts from a public GitHub repo,
//  parses frontmatter, and renders them as beautiful cards.
//  Features: retry logic, error handling, cache-busting,
//  responsive hover/click interactions, and modular design.
// ============================================================

(function () {
    'use strict';

    // ============================================================
    //  1.  CONFIGURATION (from config.js or fallback)
    // ============================================================

    const CONFIG = window.CONFIG || {
        GITHUB_USER: 'Irtizaa6x',
        GITHUB_REPO: 'Irtizaa6x.github.io',
        BRANCH: 'main',
        POSTS_PATH: 'src/posts',
        BLOG_DETAIL_PATH: '/blog-detail',
    };

    const RETRY_ATTEMPTS = 3;
    const RETRY_DELAY_MS = 1000;

    // ============================================================
    //  2.  FETCH WITH RETRY (exponential backoff)
    // ============================================================

    /**
     * Fetch a URL with automatic retry on failure.
     * @param {string} url - The URL to fetch.
     * @param {number} retries - Number of retry attempts (default: RETRY_ATTEMPTS).
     * @param {number} delay - Initial delay in ms (default: RETRY_DELAY_MS).
     * @returns {Promise<Response>} - The fetch response.
     * @throws {Error} - If all retries fail.
     */
    async function fetchWithRetry(url, retries = RETRY_ATTEMPTS, delay = RETRY_DELAY_MS) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (error) {
            if (retries <= 0) {
                throw error;
            }
            console.warn(`Fetch failed (${retries} retries left):`, error.message);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchWithRetry(url, retries - 1, delay * 1.5);
        }
    }

    // ============================================================
    //  3.  BUILD GITHUB API URL (with cache-busting)
    // ============================================================

    /**
     * Build a cache‑busted GitHub API URL for a given path.
     * @param {string} path - The API path (e.g., 'contents/src/posts').
     * @param {Record<string, string>} extraParams - Additional query parameters.
     * @returns {string} - The full API URL with a timestamp.
     */
    function buildApiUrl(path, extraParams = {}) {
        const base = `https://api.github.com/repos/${CONFIG.GITHUB_USER}/${CONFIG.GITHUB_REPO}/${path}?ref=${CONFIG.BRANCH}`;
        const params = new URLSearchParams({
            ...extraParams,
            _t: Date.now(), // ← Cache‑buster
        });
        return `${base}&${params.toString()}`;
    }

    // ============================================================
    //  4.  PARSE FRONTMATTER (YAML or simple key-value)
    // ============================================================

    /**
     * Parse YAML frontmatter from a Markdown string.
     * Uses js‑yaml if available; falls back to a simple key‑value parser.
     * @param {string} markdown – The raw Markdown content.
     * @returns {{ data: Object, content: string }} – Parsed metadata and the rest of the content.
     */
    function parseFrontmatter(markdown) {
        const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
        if (!match) {
            return { data: {}, content: markdown };
        }

        const frontmatter = match[1];
        const content = markdown.replace(match[0], '').trim();
        let data = {};

        // Try parsing with js-yaml first
        try {
            if (typeof jsyaml !== 'undefined' && jsyaml.load) {
                data = jsyaml.load(frontmatter) || {};
            } else {
                // Fallback: simple key:value lines
                const lines = frontmatter.split('\n');
                const fallbackData = {};
                lines.forEach((line) => {
                    const colon = line.indexOf(':');
                    if (colon > 0) {
                        const key = line.slice(0, colon).trim();
                        let val = line.slice(colon + 1).trim();
                        // Remove surrounding quotes if present
                        if (
                            (val.startsWith('"') && val.endsWith('"')) ||
                            (val.startsWith("'") && val.endsWith("'"))
                        ) {
                            val = val.slice(1, -1);
                        }
                        fallbackData[key] = val;
                    }
                });
                data = fallbackData;
            }
        } catch (err) {
            console.warn('YAML parse error:', err.message);
            data = {};
        }

        return { data, content };
    }

    // ============================================================
    //  5.  FETCH POSTS (with parallel loading)
    // ============================================================

    /**
     * Fetch all blog posts from GitHub.
     * @returns {Promise<Array<Object>>} – An array of post objects (sorted newest first).
     */
    async function fetchPosts() {
        try {
            // 1. Get the list of Markdown files
            const listUrl = buildApiUrl(`contents/${CONFIG.POSTS_PATH}`);
            const listResponse = await fetchWithRetry(listUrl);

            const files = await listResponse.json();

            // Check if the response is an array (GitHub API returns array for folder contents)
            if (!Array.isArray(files)) {
                console.warn('GitHub API returned unexpected response:', files);
                return [];
            }

            const mdFiles = files.filter(
                (file) => file.name && file.name.endsWith('.md') && file.download_url
            );

            if (mdFiles.length === 0) {
                console.log('📭 No .md files found in the posts folder.');
                return [];
            }

            // 2. Fetch and parse all Markdown files in parallel
            const fetchPromises = mdFiles.map(async (file) => {
                try {
                    const contentRes = await fetchWithRetry(file.download_url);
                    const markdown = await contentRes.text();
                    const { data, content } = parseFrontmatter(markdown);

                    // Only include posts that have at least a title
                    if (!data.title) {
                        console.warn(`⏩ Skipping ${file.name} – missing "title" in frontmatter.`);
                        return null;
                    }

                    // Normalise the gallery field (handle both string[] and object[] formats)
                    let gallery = data.gallery || [];
                    if (Array.isArray(gallery) && gallery.length > 0) {
                        if (typeof gallery[0] === 'object' && gallery[0].image) {
                            gallery = gallery.map((item) => item.image);
                        }
                    }

                    return {
                        ...data,
                        gallery,
                        content,
                        slug: data.slug || file.name.replace('.md', ''),
                        download_url: file.download_url,
                        fileName: file.name,
                    };
                } catch (err) {
                    console.warn(`⚠️ Error parsing ${file.name}:`, err.message);
                    return null;
                }
            });

            const results = await Promise.all(fetchPromises);
            const posts = results.filter((post) => post !== null);

            // 3. Sort by date (newest first)
            posts.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (!isNaN(dateA) && !isNaN(dateB)) {
                    return dateB - dateA;
                }
                return a.fileName.localeCompare(b.fileName);
            });

            console.log(`✅ Loaded ${posts.length} blog post(s).`);
            return posts;
        } catch (error) {
            console.error('❌ Failed to fetch blog posts:', error);
            throw error; // Re-throw for the caller to handle
        }
    }

    // ============================================================
    //  6.  RENDER POSTS (Card Grid)
    // ============================================================

    /**
     * Render blog cards into the container.
     * @param {Array<Object>} posts – The list of posts to display.
     * @param {HTMLElement} container – The container element.
     */
    function renderPosts(posts, container) {
        if (!container) return;

        if (!posts || posts.length === 0) {
            container.innerHTML = `
                <div class="blog-empty">
                    <i class="fas fa-book-open"></i>
                    <p>No blog posts published yet.<br />Check back soon for updates on my journey!</p>
                </div>
            `;
            return;
        }

        let html = '<div class="blog-grid">';

        posts.forEach((post) => {
            const coverUrl =
                post.coverImage ||
                'https://via.placeholder.com/600x400/3a5a40/dad7cd?text=Blog+Post';
            const preview = post.previewText || 'Click to read the full story.';
            const title = post.title || 'Untitled';

            html += `
                <div class="blog-card" data-slug="${encodeURIComponent(post.slug)}">
                    <img src="${coverUrl}" alt="${title}" class="cover-image" loading="lazy" />
                    <div class="preview-area">
                        <p>${preview} <span class="read-more-hint">Click to read full story →</span></p>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        // --- Attach event listeners to each card ---
        document.querySelectorAll('.blog-card').forEach((card) => {
            const preview = card.querySelector('.preview-area');
            if (!preview) return;

            let isMobile = window.innerWidth <= 768;
            let isExpanded = false;

            // Check window resize to update isMobile
            window.addEventListener('resize', () => {
                isMobile = window.innerWidth <= 768;
            });

            // --- Desktop: hover to expand ---
            card.addEventListener('mouseenter', function () {
                if (!isMobile) {
                    preview.classList.add('open');
                }
            });

            card.addEventListener('mouseleave', function () {
                if (!isMobile) {
                    preview.classList.remove('open');
                    isExpanded = false;
                }
            });

            // --- Mobile: tap to expand, tap again to go to detail ---
            card.addEventListener('click', function (e) {
                const slug = this.dataset.slug;

                if (isMobile) {
                    // If not expanded yet, expand and prevent navigation
                    if (!isExpanded) {
                        e.preventDefault();
                        preview.classList.toggle('open');
                        isExpanded = true;
                    } else {
                        // Already expanded – now navigate to detail
                        if (slug) {
                            window.location.href = `${CONFIG.BLOG_DETAIL_PATH}?slug=${slug}`;
                        }
                    }
                } else {
                    // Desktop: click always goes to detail
                    if (slug) {
                        window.location.href = `${CONFIG.BLOG_DETAIL_PATH}?slug=${slug}`;
                    }
                }
            });

            // Also handle the read-more hint click separately
            const hint = card.querySelector('.read-more-hint');
            if (hint) {
                hint.addEventListener('click', function (e) {
                    e.stopPropagation(); // Prevent card click from firing
                    const slug = card.dataset.slug;
                    if (slug) {
                        window.location.href = `${CONFIG.BLOG_DETAIL_PATH}?slug=${slug}`;
                    }
                });
            }
        });
    }

    // ============================================================
    //  7.  MAIN LOADER FUNCTION (Exposed globally)
    // ============================================================

    /**
     * Load and render blog posts.
     * Shows a loading state while fetching, then renders the cards.
     * @returns {Promise<void>}
     */
    async function loadBlogPosts() {
        const container = document.getElementById('blogContainer');
        if (!container) {
            console.warn('Blog container not found.');
            return;
        }

        // Show loading state
        container.innerHTML = `
            <div class="blog-loading">
                <i class="fas fa-spinner"></i>
                <p>Loading blog posts...</p>
            </div>
        `;

        try {
            const posts = await fetchPosts();
            renderPosts(posts, container);
        } catch (error) {
            console.error('Blog loading failed:', error);
            container.innerHTML = `
                <div class="blog-empty">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Could not load blog posts. Please refresh or try again later.</p>
                    <p style="font-size:0.8rem;margin-top:0.5rem;opacity:0.6;">Error: ${error.message || 'Unknown error'}</p>
                </div>
            `;
        }
    }

    // ============================================================
    //  8.  EXPOSE PUBLIC API
    // ============================================================

    // Expose `loadBlogPosts` globally so `script.js` can call it
    window.loadBlogPosts = loadBlogPosts;

    // ============================================================
    //  9.  CONSOLE BRANDING
    // ============================================================

    console.log('%c📚 Blog loader initialised (Earthy Forest Edition)', 'color:#588157;font-weight:600;');
    console.log(`   ↳ Repo: ${CONFIG.GITHUB_USER}/${CONFIG.GITHUB_REPO}/${CONFIG.POSTS_PATH}`);
    console.log('   ↳ Retry enabled · Cache-busting enabled · Responsive interactions');

})();
