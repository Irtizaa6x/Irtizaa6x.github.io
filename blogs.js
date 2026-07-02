// ============================================================
//  BLOGS.JS — GitHub‑Powered Blog Loader
//  Fetches Markdown posts from a public GitHub repo,
//  parses frontmatter, and renders them as beautiful cards.
//  Uses cache‑busting to ensure fresh content every time.
// ============================================================

(function () {
    'use strict';

    // ============================================================
    //  1.  CONFIGURATION
    // ============================================================

    /** @type {string} – Your GitHub username */
    const GITHUB_USER = 'Irtizaa6x';

    /** @type {string} – The repository where posts are stored */
    const GITHUB_REPO = 'Irtizaa6x.github.io';

    /** @type {string} – The branch to pull from */
    const BRANCH = 'main';

    /** @type {string} – The folder containing your Markdown posts */
    const POSTS_PATH = 'src/posts';

    /** @type {string} – Relative link to the detail page (clean URL) */
    const DETAIL_PAGE = '/blog-detail';

    // ============================================================
    //  2.  HELPERS
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

    /**
     * Build a cache‑busted GitHub API URL for a given path.
     * @param {string} path – The API path (e.g., 'contents/src/posts').
     * @param {Record<string, string>} extraParams – Additional query parameters.
     * @returns {string} – The full API URL with a timestamp.
     */
    function buildApiUrl(path, extraParams = {}) {
        const base = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/${path}?ref=${BRANCH}`;
        const params = new URLSearchParams({
            ...extraParams,
            _t: Date.now(), // ← Cache‑buster: forces fresh data from GitHub
        });
        return `${base}&${params.toString()}`;
    }

    // ============================================================
    //  3.  FETCH POSTS (with parallel loading)
    // ============================================================

    /**
     * Fetch all blog posts from GitHub.
     * @returns {Promise<Array<Object>>} – An array of post objects (sorted newest first).
     */
    async function fetchPosts() {
        try {
            // 1. Get the list of Markdown files
            const listUrl = buildApiUrl(`contents/${POSTS_PATH}`);
            const listResponse = await fetch(listUrl);

            if (!listResponse.ok) {
                // 404 means the folder doesn't exist yet – that's fine, just return empty
                if (listResponse.status === 404) {
                    console.warn('📁 No posts folder found yet.');
                    return [];
                }
                throw new Error(`GitHub API responded with ${listResponse.status}`);
            }

            const files = await listResponse.json();
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
                    const contentRes = await fetch(file.download_url);
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
            return [];
        }
    }

    // ============================================================
    //  4.  RENDER POSTS (Card Grid)
    // ============================================================

    /**
     * Render blog cards into the container.
     * @param {Array<Object>} posts – The list of posts to display.
     */
    function renderPosts(posts) {
        const container = document.getElementById('blogContainer');
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
                'https://via.placeholder.com/600x400/216869/fff?text=Blog+Post';
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

            // Expand preview on hover (desktop)
            card.addEventListener('mouseenter', function () {
                preview.classList.add('open');
            });

            card.addEventListener('mouseleave', function () {
                preview.classList.remove('open');
            });

            // Navigate to detail page on click (clean URL)
            card.addEventListener('click', function () {
                const slug = this.dataset.slug;
                if (slug) {
                    // Use clean URL without hash: /blog-detail?slug=xyz
                    window.location.href = `${DETAIL_PAGE}?slug=${slug}`;
                }
            });
        });
    }

    // ============================================================
    //  5.  PUBLIC LOADER (Exposed globally)
    // ============================================================

    /**
     * Load and render blog posts.
     * Shows a loading state while fetching, then renders the cards.
     */
    async function loadBlogs() {
        const container = document.getElementById('blogContainer');
        if (!container) return;

        // Show loading state
        container.innerHTML = `
            <div class="blog-loading">
                <i class="fas fa-spinner"></i>
                <p>Loading blog posts...</p>
            </div>
        `;

        const posts = await fetchPosts();
        renderPosts(posts);
    }

    // Expose `loadBlogs` globally so `script.js` can call it
    // when navigating to the blog page via the clean router.
    window.loadBlogs = loadBlogs;

    // ============================================================
    //  6.  AUTO‑INIT
    // ============================================================

    // If the blog container exists on page load (e.g., direct access to /blog),
    // automatically load the posts.
    if (document.getElementById('blogContainer')) {
        // Use a small delay to ensure everything else is ready,
        // but also avoid blocking the main thread.
        setTimeout(loadBlogs, 100);
    }

    // ============================================================
    //  7.  CONSOLE BRANDING
    // ============================================================

    console.log('%c📚 Blog loader initialised', 'color:#49a078;font-weight:600;');
    console.log(`   ↳ Repo: ${GITHUB_USER}/${GITHUB_REPO}/${POSTS_PATH}`);
    console.log('   ↳ Cache‑busting enabled · Clean URLs active');

})();
