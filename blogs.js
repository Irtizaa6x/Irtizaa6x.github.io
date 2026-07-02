/* ============================================================
   BLOGS.JS — Professional Blog Engine (YAML Ready)
   Fetches posts from GitHub API, parses frontmatter with js-yaml,
   renders premium cards with hover preview, and navigates to detail.
   Fully integrated with the Forest Green portfolio design.
   ============================================================ */

(function() {
    'use strict';

    // ============================================================
    //  CONFIGURATION — Edit these to match your GitHub repo
    // ============================================================
    const GITHUB_USER = "Irtizaa6x";
    const GITHUB_REPO = "Irtizaa6x.github.io";
    const BRANCH = "main";

    // ============================================================
    //  PARSER: Uses js-yaml for robust frontmatter handling
    //  Supports both simple key:value and complex structures.
    // ============================================================
    function parseFrontmatter(markdown) {
        const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
        if (!match) {
            return { data: {}, content: markdown };
        }

        const frontmatter = match[1];
        const content = markdown.replace(match[0], '').trim();
        let data = {};

        try {
            // Use js-yaml (loaded globally via CDN) for reliable parsing
            if (typeof jsyaml !== 'undefined' && jsyaml.load) {
                data = jsyaml.load(frontmatter) || {};
            } else {
                // Fallback: simple key:value parse if js-yaml isn't loaded
                console.warn('js-yaml not found, using fallback parser.');
                const lines = frontmatter.split('\n');
                const fallbackData = {};
                lines.forEach(line => {
                    const colon = line.indexOf(':');
                    if (colon > 0) {
                        const key = line.slice(0, colon).trim();
                        let val = line.slice(colon + 1).trim();
                        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
                        fallbackData[key] = val;
                    }
                });
                data = fallbackData;
            }
        } catch (err) {
            console.warn('YAML parse error:', err.message);
            // Last‑resort fallback: just return empty data
            data = {};
        }

        return { data, content };
    }

    // ============================================================
    //  API: Fetch all blog posts from GitHub
    //  Returns a sorted array of post objects.
    // ============================================================
    async function fetchPosts() {
        try {
            const url =
                `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/src/posts?ref=${BRANCH}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`GitHub API responded with ${response.status}`);
            }

            const files = await response.json();
            const posts = [];

            for (const file of files) {
                // Only process Markdown files
                if (!file.name.endsWith('.md')) continue;

                try {
                    const contentRes = await fetch(file.download_url);
                    const markdown = await contentRes.text();
                    const { data, content } = parseFrontmatter(markdown);

                    // Only include posts that have a title (i.e., valid published posts)
                    if (data.title) {
                        // Normalise gallery: handle both string[] and object[] formats
                        let gallery = data.gallery || [];
                        if (Array.isArray(gallery) && gallery.length > 0) {
                            // Check if it's an array of objects with an 'image' key
                            if (typeof gallery[0] === 'object' && gallery[0].image) {
                                gallery = gallery.map(item => item.image);
                            }
                        }

                        posts.push({
                            ...data,
                            gallery: gallery,
                            content: content,
                            slug: data.slug || file.name.replace('.md', ''),
                            download_url: file.download_url,
                            fileName: file.name,
                        });
                    }
                } catch (err) {
                    console.warn(`Skipping ${file.name}:`, err.message);
                }
            }

            // Sort by date (newest first), fallback to filename if no valid date
            posts.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (!isNaN(dateA) && !isNaN(dateB)) {
                    return dateB - dateA;
                }
                return a.fileName.localeCompare(b.fileName);
            });

            return posts;

        } catch (error) {
            console.error('Failed to fetch blog posts:', error);
            return [];
        }
    }

    // ============================================================
    //  RENDER: Build the blog grid with premium cards
    // ============================================================
    function renderPosts(posts) {
        const container = document.getElementById('blogContainer');
        if (!container) return;

        // --- Empty state ---
        if (!posts || posts.length === 0) {
            container.innerHTML = `
                <div class="blog-empty">
                    <i class="fas fa-book-open"></i>
                    <p>No blog posts published yet.<br />Check back soon for updates on my journey!</p>
                </div>
            `;
            return;
        }

        // --- Build the grid ---
        let html = '<div class="blog-grid">';

        posts.forEach(post => {
            const coverUrl = post.coverImage ||
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

        // ============================================================
        //  INTERACTIONS: Hover expansion + Click navigation
        // ============================================================
        document.querySelectorAll('.blog-card').forEach(card => {
            const preview = card.querySelector('.preview-area');
            if (!preview) return;

            // --- On hover: expand the preview area ---
            card.addEventListener('mouseenter', function() {
                preview.classList.add('open');
            });

            card.addEventListener('mouseleave', function() {
                preview.classList.remove('open');
            });

            // --- On click: navigate to detail page ---
            card.addEventListener('click', function() {
                const slug = this.dataset.slug;
                if (slug) {
                    window.location.href = `blog-detail.html?slug=${slug}`;
                }
            });

            // --- Touch support: tap to expand on mobile (optional) ---
            // We keep it simple: tap triggers the click event (navigation).
            // Mobile users can still see the preview if they long‑press, but
            // the primary action is navigation.
        });
    }

    // ============================================================
    //  LOADER: Public function called from script.js
    //  Shows a loading spinner, fetches posts, and renders them.
    // ============================================================
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

    // ============================================================
    //  AUTO‑INIT: If the container exists on page load,
    //  load blogs automatically (e.g., when visiting index.html#blog-page).
    // ============================================================
    if (document.getElementById('blogContainer')) {
        // Use a small delay to ensure everything else is ready
        setTimeout(loadBlogs, 100);
    }

    // ============================================================
    //  EXPOSE: Make loadBlogs globally accessible for script.js
    //  This allows navigation to trigger a refresh if needed.
    // ============================================================
    window.loadBlogs = loadBlogs;

})();
