// ============================================================
//  CONFIG.JS — Central Configuration for Irtija Portfolio
//  Earthy Forest Edition · Production-Ready
//  Single source of truth for all environment-specific settings.
//  Edit this file to update GitHub paths, user details, or API settings.
// ============================================================

(function() {
    'use strict';

    // ============================================================
    //  1.  GITHUB CONFIGURATION (Blog System)
    // ============================================================

    const GITHUB_CONFIG = {
        /** Your GitHub username */
        USER: 'Irtizaa6x',

        /** The repository where posts are stored */
        REPO: 'Irtizaa6x.github.io',

        /** The branch to pull from */
        BRANCH: 'main',

        /** The folder containing your Markdown posts */
        POSTS_PATH: 'src/posts',

        /** Relative link to the detail page (clean URL) */
        BLOG_DETAIL_PATH: '/blog-detail',

        /** HTML element ID for the blog container */
        BLOG_CONTAINER_ID: 'blogContainer',

        /** Number of retry attempts for failed fetches */
        RETRY_ATTEMPTS: 3,

        /** Initial delay in ms between retries (exponential backoff) */
        RETRY_DELAY_MS: 1000,
    };

    // ============================================================
    //  2.  ENVIRONMENT DETECTION
    // ============================================================

    const ENV = {
        /** Is the app running on localhost? */
        isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',

        /** Is the app running on GitHub Pages? */
        isGitHubPages: window.location.hostname.includes('github.io'),

        /** The base URL of the application */
        baseUrl: window.location.origin,

        /** The current page path (without query string) */
        currentPath: window.location.pathname.split('?')[0],
    };

    // ============================================================
    //  3.  BLOG DETAIL PAGE URL (auto-detected)
    // ============================================================

    /**
     * Build the full URL to the blog detail page.
     * Handles both local development and production environments.
     */
    function getBlogDetailUrl() {
        const detailPath = GITHUB_CONFIG.BLOG_DETAIL_PATH;
        if (ENV.isLocal) {
            return `${ENV.baseUrl}${detailPath}.html`;
        }
        // For GitHub Pages, the path is relative to the root
        return `${detailPath}.html`;
    }

    // ============================================================
    //  4.  CONTACT INFORMATION
    // ============================================================

    const CONTACT = {
        /** Primary email address */
        email: 'irtija.x.k6@hotmail.com',

        /** Discord username (without discriminator) */
        discord: 'naz.irt.k6',

        /** Phone numbers (primary and secondary) */
        phone: {
            primary: '+8801518940566',
            secondary: '+8801886940566',
        },

        /** Social media profiles */
        social: {
            github: 'https://github.com/Irtizaa6x',
            linkedin: 'https://linkedin.com/in/irtija-talha',
            facebook: 'https://www.facebook.com/Irtija.Talha96',
            instagram: 'https://www.instagram.com/7d6_nev',
            twitter: 'https://www.x.com/irtijaXtalha',
            threads: 'https://www.threads.com/7d6_nev',
            whatsapp: 'https://wa.me/qr/H3R2HPTW66G3P1',
        },
    };

    // ============================================================
    //  5.  PERFORMANCE & DEBUGGING
    // ============================================================

    const PERFORMANCE = {
        /** Enable detailed console logging (set to false in production) */
        debug: false,

        /** Enable analytics (set to true to enable) */
        analytics: false,

        /** Google Analytics tracking ID (if analytics is enabled) */
        gaTrackingId: '',

        /** Enable service worker for offline caching */
        offlineSupport: false,
    };

    // ============================================================
    //  6.  BRANDING
    // ============================================================

    const BRANDING = {
        /** Full name */
        name: 'Md. Irtija Azad Talha',

        /** Short name / handle */
        handle: 'IrtiJa',

        /** Role / tagline */
        role: 'CSE Student · Cybersecurity Aspirant',

        /** Copyright year */
        year: new Date().getFullYear(),
    };

    // ============================================================
    //  7.  EXPOSE CONFIGURATION GLOBALLY
    // ============================================================

    // Prevent duplicate configuration (only define if not already set)
    if (typeof window.CONFIG === 'undefined') {
        window.CONFIG = {
            // GitHub settings
            GITHUB_USER: GITHUB_CONFIG.USER,
            GITHUB_REPO: GITHUB_CONFIG.REPO,
            BRANCH: GITHUB_CONFIG.BRANCH,
            POSTS_PATH: GITHUB_CONFIG.POSTS_PATH,
            BLOG_DETAIL_PATH: GITHUB_CONFIG.BLOG_DETAIL_PATH,
            BLOG_CONTAINER_ID: GITHUB_CONFIG.BLOG_CONTAINER_ID,
            RETRY_ATTEMPTS: GITHUB_CONFIG.RETRY_ATTEMPTS,
            RETRY_DELAY_MS: GITHUB_CONFIG.RETRY_DELAY_MS,

            // Environment
            ENV: ENV,

            // Computed values
            BLOG_DETAIL_URL: getBlogDetailUrl(),

            // Contact
            CONTACT: CONTACT,

            // Performance
            PERFORMANCE: PERFORMANCE,

            // Branding
            BRANDING: BRANDING,

            // Helper: check if running in production
            isProduction: function() {
                return !ENV.isLocal && !PERFORMANCE.debug;
            },
        };

        console.log('%c⚙️ Configuration loaded', 'color:#588157;font-weight:600;');
        if (PERFORMANCE.debug) {
            console.log('📋 CONFIG:', window.CONFIG);
        }
    } else {
        console.warn('⚠️ CONFIG already defined — skipping re-initialisation.');
    }

})();
