// ============================================================
//  BLOGS.JS — GitHub-Powered Blog Loader (Production Ready)
//  Fetches Markdown posts from a public GitHub repo,
//  parses frontmatter, and renders them as beautiful cards.
//  Implements retry logic, error handling, and cache-busting.
//  Designed to be called by the main script (script.js) once.
// ============================================================

(function () {
    'use strict';

    // ============================================================
    //  1.  CONFIGURATION (with fallbacks)
    // ============================================================

    const CONFIG = window.CONFIG || {
        GITHUB_USER: 'Irtizaa6x',
        GITHUB_REPO: 'Irtizaa6x.github.io',
        BRANCH: 'main',
        POSTS_PATH: 'src/posts',
        DETAIL_PAGE: '/blog-detail',
    };

    // ============================================================
    //  2.  HELPERS
    // ============================================================

    /**
     * Parse YAML frontmatter from a Markdown string.
     * Uses js-yaml if available; falls back to a simple key-value parser.
     * @param {string} markdown – The raw Markdown content.
     * @returns {{ data: Object, content: string }}
     */
    function parseFrontmatter(markdown) {
        const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
        if (!match) {
            return { data: {}, content: markdown };
        }

        const frontmatter = match[1];
        const content = markdown.replace(match[0], '').trim();
        let data = {};

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

    /**
     * Build a cache-busted GitHub API URL for a given path.
     * @param {string} path – The API path (e.g., 'contents/src/posts').
     * @param {Record<string, string>} extraParams – Additional query parameters.
     * @returns {string} – The full API URL with a timestamp.
     */
    function buildApiUrl(path, extraParams = {}) {
        const base = `https://api.github.com/repos/${CONFIG.GITHUB_USER}/${CONFIG.GITHUB_REPO}/${path}?ref=${CONFIG.BRANCH}`;
        const params = new URLSearchParams({
            ...extraParams,
            _t: Date.now(), // Cache-buster
        });
        return `${base}&${params.toString()}`;
    }

    /**
     * Fetch with retry and exponential backoff.
     * @param {string} url – The URL to fetch.
     * @param {number} retries – Max retries.
     * @param {number} delay – Initial delay in ms.
     * @returns {Promise<Response>}
     */
    async function fetchWithRetry(url, retries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url);
                if (response.ok) return response;
                // If rate limit, wait longer
                if (response.status === 403 && response.headers.get('X-RateLimit-Remaining') === '0') {
                    const reset = response.headers.get('X-RateLimit-Reset');
                    if (reset) {
                        const waitTime = (parseInt(reset, 10) * 1000) - Date.now() + 5000;
                        if (waitTime > 0) {
                            console.warn(`GitHub rate limit hit. Waiting ${Math.ceil(waitTime / 1000)}s...`);
                            await new Promise(r => setTimeout(r, waitTime));
                            continue;
                        }
                    }
                }
                throw new Error(`HTTP ${response.status} – ${response.statusText}`);
            } catch (err) {
                if (attempt === retries) throw err;
                const backoff = delay * Math.pow(2, attempt - 1);
                console.warn(`Fetch attempt ${attempt} failed. Retrying in ${backoff}ms...`);
                await new Promise(r => setTimeout(r, backoff));
            }
        }
    }

    // ============================================================
    //  3.  FETCH POSTS
    // ============================================================

    /**
     * Fetch all blog posts from GitHub.
     * @returns {Promise<Array<Object>>} – Sorted posts (newest first).
     */
    async function fetchPosts() {
        try {
            // 1. Get the list of Markdown files
            const listUrl = buildApiUrl(`contents/${CONFIG.POSTS_PATH}`);
            const listResponse = await fetchWithRetry(listUrl);

            const files = await listResponse.json();
            if (!Array.isArray(files)) {
                console.warn('Unexpected response from GitHub API.');
                return [];
            }

            const mdFiles = files.filter((file) =>
                file.name.endsWith('.md') && file.download_url
            );

            if (mdFiles.length === 0) {
                console.log('📭 No .md files found in the posts folder.');
                return [];
            }

            // 2. Fetch and parse all Markdown files in parallel
            const fetchPromises = mdFiles.map(async (file) => {
                try {
                    const contentRes = await fetchWithRetry(file.download_url, 2);
                    const markdown = await contentRes.text();
                    const { data, content } = parseFrontmatter(markdown);

                    if (!data.title) {
                        console.warn(`⏩ Skipping ${file.name} – missing "title" in frontmatter.`);
                        return null;
                    }

                    // Normalise gallery (handle both string[] and object[] formats)
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
            throw error; // Re-throw to be handled by caller
        }
    }

    // ============================================================
    //  4.  RENDER POSTS
    // ============================================================

    /**
     * Render blog cards into the container.
     * @param {Array<Object>} posts – The list of posts to display.
     * @param {HTMLElement} container – The DOM container.
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
                'https://via.placeholder.com/600x400/1A7A74/fff?text=Blog+Post';
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
                    if (!isExpanded) {
                        e.preventDefault();
                        preview.classList.toggle('open');
                        isExpanded = true;
                    } else {
                        if (slug) {
                            window.location.href = `${CONFIG.DETAIL_PAGE}?slug=${slug}`;
                        }
                    }
                } else {
                    if (slug) {
                        window.location.href = `${CONFIG.DETAIL_PAGE}?slug=${slug}`;
                    }
                }
            });

            // Handle read-more hint click separately
            const hint = card.querySelector('.read-more-hint');
            if (hint) {
                hint.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const slug = card.dataset.slug;
                    if (slug) {
                        window.location.href = `${CONFIG.DETAIL_PAGE}?slug=${slug}`;
                    }
                });
            }
        });
    }

    /**
     * Show an error message in the container.
     * @param {string} message – User-friendly error message.
     * @param {HTMLElement} container – The DOM container.
     */
    function showError(message, container) {
        if (!container) return;
        container.innerHTML = `
            <div class="blog-empty" style="border-color: #e74c3c;">
                <i class="fas fa-exclamation-triangle" style="color: #e74c3c; opacity: 0.7;"></i>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1.5rem; background: var(--cyprus-light); color: white; border: none; border-radius: 2rem; cursor: pointer; font-weight: 600;">
                    <i class="fas fa-sync-alt"></i> Try Again
                </button>
            </div>
        `;
    }

    // ============================================================
    //  5.  PUBLIC LOADER
    // ============================================================

    /**
     * Load and render blog posts.
     * Shows a loading state while fetching, then renders the cards or error.
     */
    async function loadBlogs() {
        const container = document.getElementById('blogContainer');
        if (!container) {
            console.warn('⚠️ Blog container not found.');
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
            let userMessage = 'Unable to load blog posts. Please try again later.';
            if (error.message && error.message.includes('403')) {
                userMessage = 'GitHub API rate limit exceeded. Please wait a few minutes and refresh.';
            } else if (error.message && error.message.includes('404')) {
                userMessage = 'Blog posts folder not found. Please check the configuration.';
            }
            showError(userMessage, container);
            console.error('Blog loading error:', error);
        }
    }

    // Expose `loadBlogs` globally so `script.js` can call it
    window.loadBlogs = loadBlogs;

    // ============================================================
    //  6.  CONSOLE BRANDING
    // ============================================================

    console.log('%c📚 Blog loader (production ready)', 'color:#1A7A74;font-weight:600;');
    console.log(`   ↳ Repo: ${CONFIG.GITHUB_USER}/${CONFIG.GITHUB_REPO}/${CONFIG.POSTS_PATH}`);
    console.log('   ↳ Retry & error handling enabled');

})();
