/* ============================================================
   BLOGS.JS — Professional Blog Engine (YAML Ready)
   Fetches posts from GitHub API, parses frontmatter with js-yaml,
   renders cards with hover preview, and navigates to detail.
   ============================================================ */

(function() {
    'use strict';

    // ============================================================
    //  CONFIGURATION
    // ============================================================
    const GITHUB_USER = "Irtizaa6x";
    const GITHUB_REPO = "Irtizaa6x.github.io";
    const BRANCH = "main";

    // ============================================================
    //  PARSER: Uses js-yaml for robust frontmatter handling
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
            data = jsyaml.load(frontmatter) || {};
        } catch (err) {
            console.warn('YAML parse error:', err.message);
            // Fallback: try simple key:value parse (for safety)
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

        return { data, content };
    }

    // ============================================================
    //  API: Fetch all blog posts from GitHub
    // ============================================================
    async function fetchPosts() {
        try {
            const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/src/posts?ref=${BRANCH}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`GitHub API responded with ${response.status}`);
            }

            const files = await response.json();
            const posts = [];

            for (const file of files) {
                if (!file.name.endsWith('.md')) continue;

                try {
                    const contentRes = await fetch(file.download_url);
                    const markdown = await contentRes.text();
                    const { data, content } = parseFrontmatter(markdown);

                    // Only include posts that have a title
                    if (data.title) {
                        // Normalise gallery: handle both string[] and object[] formats
                        let gallery = data.gallery || [];
                        if (Array.isArray(gallery) && gallery.length > 0) {
                            // Check if it's an array of objects with 'image' key
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

            // Sort by date (newest first)
            posts.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                if (!isNaN(dateA) && !isNaN(dateB)) return dateB - dateA;
                return a.fileName.localeCompare(b.fileName);
            });

            return posts;

        } catch (error) {
            console.error('Failed to fetch blog posts:', error);
            return [];
        }
    }

    // ============================================================
    //  RENDER: Build the blog grid cards
    // ============================================================
    function renderPosts(posts) {
        const container = document.getElementById('blogContainer');
        if (!container) return;

        if (!posts || posts.length === 0) {
            container.innerHTML = `
                <div class="blog-empty">
                    <i class="fas fa-book-open"></i>
                    <p>No blog posts published yet.<br />Check back soon for updates!</p>
                </div>
            `;
            return;
        }

        let html = '<div class="blog-grid">';

        posts.forEach(post => {
            const coverUrl = post.coverImage || 'https://via.placeholder.com/600x400/216869/fff?text=Blog+Post';
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

            card.addEventListener('mouseenter', function() {
                preview.classList.add('open');
            });

            card.addEventListener('mouseleave', function() {
                preview.classList.remove('open');
            });

            card.addEventListener('click', function() {
                const slug = this.dataset.slug;
                if (slug) {
                    window.location.href = `blog-detail.html?slug=${slug}`;
                }
            });
        });
    }

    // ============================================================
    //  LOADER: Public function called from script.js
    // ============================================================
    async function loadBlogs() {
        const container = document.getElementById('blogContainer');
        if (!container) return;

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
    //  AUTO-INIT: If container exists, load blogs
    // ============================================================
    if (document.getElementById('blogContainer')) {
        loadBlogs();
    }

    // ============================================================
    //  EXPOSE: Make loadBlogs globally accessible
    // ============================================================
    window.loadBlogs = loadBlogs;

})();
