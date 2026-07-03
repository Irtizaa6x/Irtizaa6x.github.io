// ============================================================
//  CONFIG.JS — Central Configuration for Portfolio
//  All environment-specific settings in one place.
//  Production-ready with fallbacks and environment detection.
// ============================================================

(function () {
    'use strict';

    /**
     * Get the base URL for the site (handles localhost vs production).
     * @returns {string} The base URL without trailing slash.
     */
    function getBaseUrl() {
        const origin = window.location.origin;
        // If running on GitHub Pages with a project site (e.g., username.github.io/repo),
        // you might need to include the repo name. But for a user page (username.github.io),
        // origin is enough.
        // This can be customised per deployment.
        return origin;
    }

    /**
     * Global configuration object.
     * All paths are relative to the site root.
     */
    const CONFIG = {
        // ---- GitHub Blog Settings ----
        GITHUB: {
            USER: 'Irtizaa6x',                      // Your GitHub username
            REPO: 'Irtizaa6x.github.io',            // Repository name
            BRANCH: 'main',                         // Branch containing posts
            POSTS_PATH: 'src/posts',                // Folder where .md blog posts live
        },

        // ---- Site Paths ----
        PATHS: {
            // Detail page URL (relative to site root)
            BLOG_DETAIL: '/blog-detail',
            // Home page
            HOME: '/',
            // Blog listing
            BLOG: '/blog.html',
        },

        // ---- Site Metadata ----
        SITE: {
            TITLE: 'IrtiJa · Portfolio',
            AUTHOR: 'Md. Irtija Azad Talha',
            DESCRIPTION: 'Portfolio of Md. Irtija Azad Talha — CSE student, cybersecurity aspirant.',
        },

        // ---- Time & Date ----
        TIME: {
            TIMEZONE: 'Asia/Dhaka',
            LOCALE: 'en-GB',
        },

        // ---- Feature Flags ----
        FEATURES: {
            ENABLE_BLOG: true,
            ENABLE_CLOCK: true,
        },

        // ---- Helper to get full GitHub API URL ----
        getApiUrl: function (path, extraParams = {}) {
            const base = `https://api.github.com/repos/${this.GITHUB.USER}/${this.GITHUB.REPO}/${path}?ref=${this.GITHUB.BRANCH}`;
            const params = new URLSearchParams(extraParams);
            params.set('_t', Date.now()); // Cache-busting
            return `${base}&${params.toString()}`;
        },

        // ---- Helper to get the base URL ----
        getBaseUrl: getBaseUrl,

        // ---- Helper to get full path for internal links ----
        getPath: function (relativePath) {
            const base = this.getBaseUrl();
            // Remove leading slash from relativePath if present, to avoid double slashes
            const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
            return `${base}/${cleanPath}`;
        },
    };

    // Freeze the config to prevent accidental mutations
    Object.freeze(CONFIG);

    // Expose globally (only if not already defined)
    if (typeof window.CONFIG === 'undefined') {
        window.CONFIG = CONFIG;
    } else {
        console.warn('CONFIG already defined — skipping override.');
    }

    // Console output for debugging (optional)
    console.log('%c⚙️  Config loaded', 'color:#1A7A74;font-weight:600;');
    console.log(`   ↳ GitHub: ${CONFIG.GITHUB.USER}/${CONFIG.GITHUB.REPO}`);
    console.log(`   ↳ Base URL: ${CONFIG.getBaseUrl()}`);

})();
