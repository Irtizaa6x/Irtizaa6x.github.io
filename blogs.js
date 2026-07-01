/* ============================================================
   BLOGS.JS — Professional Blog Engine
   Fetches posts from GitHub API, renders cards,
   handles hover expansion, and navigates to detail pages.
   Works seamlessly with Decap CMS and your GitHub repo.
   ============================================================ */

(function() {
    'use strict';

    // ============================================================
    //  CONFIGURATION — Edit these 3 values
    // ============================================================
    const GITHUB_USER = "Irtizaa6x";        // e.g., "irtija-talha"
    const GITHUB_REPO = "Irtizaa6x.github.io";       // e.g., "my-portfolio"
    const BRANCH = "main";

    // ============================================================
    //  CORE: Parse Frontmatter from Markdown
    // ============================================================
    function parseFrontmatter(markdown) {
        const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
        if (!match) {
            return { data: {}, content: markdown };
        }

        const frontmatter = match[1];
        const content = markdown.replace(match[0], '').trim();
        const data = {};

        // Simple YAML-like parser (handles strings, arrays, and quoted values)
        const lines = frontmatter.split('\n');
        let currentKey = null;
        let currentArray = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Check if line contains a key:value pair
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                // If we were building an array, save it
                if (currentKey && currentArray.length > 0) {
                    data[currentKey] = currentArray;
                    currentArray = [];
                    currentKey = null;
                }

                const key = line.slice(0, colonIndex).trim();
                let value = line.slice(colonIndex + 1).trim();

                // Remove quotes
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                // Parse array: [item1, item2, item3]
                if (value.startsWith('[') && value.endsWith(']')) {
                    const inner = value.slice(1, -1).trim();
                    if (inner) {
                        data[key] = inner.split(',').map(v => v.trim());
                    } else {
                        data[key] = [];
                    }
                } else {
                    data[key] = value;
                }

                // If the value was a multi-line array indicator, prepare for next lines
                if (value === '[' || value === '[' || value === '[') {
                    currentKey = key;
                    currentArray = [];
                }
            } else if (currentKey) {
                // This is a continuation of a multi-line array (if supported)
                // For simplicity, we skip multi-line array parsing; user should use inline arrays.
            }
        }

        // Save any remaining array
        if (currentKey && currentArray.length > 0) {
            data[currentKey] = currentArray;
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
                // Only process .md files
                if (!file.name.endsWith('.md')) continue;

                try {
                    const contentRes = await fetch(file.download_url);
                    const markdown = await contentRes.text();
                    const { data, content } = parseFrontmatter(markdown);

                    // Only include posts that have a title (i.e., valid published posts)
                    if (data.title) {
                        posts.push({
                            ...data,
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

            // Sort by date (newest first), fallback to filename if no date
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
    //  RENDER: Build the blog grid cards
    // ============================================================
    function renderPosts(posts) {
        const container = document.getElementById('blogContainer');
        if (!container) return;

        // Show empty state
        if (!posts || posts.length === 0) {
            container.innerHTML = `
                <div class="blog-empty">
                    <i class="fas fa-book-open"></i>
                    <p>No blog posts published yet.<br />Check back soon for updates on my journey!</p>
                </div>
            `;
            return;
        }

        // Build grid
        let html = '<div class="blog-grid">';

        posts.forEach(post => {
            // Use coverImage from frontmatter, or a fallback placeholder
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

            // On hover: expand preview
            card.addEventListener('mouseenter', function() {
                preview.classList.add('open');
            });

            card.addEventListener('mouseleave', function() {
                preview.classList.remove('open');
            });

            // On click: navigate to detail page
            card.addEventListener('click', function() {
                const slug = this.dataset.slug;
                if (slug) {
                    window.location.href = `blog-detail.html?slug=${slug}`;
                }
            });

            // Touch support for mobile: tap to toggle expansion (optional)
            // We keep it simple: tap acts as click, so they navigate directly.
            // Mobile users will see the preview only if they long-press or on hover (not common).
            // We'll keep the click navigation as the primary action.
        });
    }

    // ============================================================
    //  LOADER: Public function called from script.js
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
    //  AUTO-INIT: If the page directly contains #blogContainer,
    //  load blogs automatically (e.g., when navigating to index.html#blog)
    // ============================================================
    if (document.getElementById('blogContainer')) {
        // Check if we should auto-load (if the page is not the main portfolio,
        // or if the container is present, it's safe to load)
        loadBlogs();
    }

    // ============================================================
    //  EXPOSE: Make loadBlogs globally accessible for script.js
    // ============================================================
    window.loadBlogs = loadBlogs;

})();
