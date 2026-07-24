// ============================================================
//   IRTIJA — MAIN APPLICATION
//   Version 2.0 · Complete Rewrite
//   Vanilla JavaScript · Modular Architecture
// ============================================================

(function () {
    'use strict';

    // ============================================================
    //   1.  CONSTANTS & CONFIGURATION
    // ============================================================

    const CONFIG = {
        // Dhaka, Bangladesh coordinates for SunCalc
        DHAKA_LAT: 23.8103,
        DHAKA_LON: 90.4125,

        // Animation thresholds
        REVEAL_THRESHOLD: 0.12,
        REVEAL_THRESHOLD_MOBILE: 0.08,

        // Count-up duration
        COUNT_DURATION: 2000,

        // Scroll header threshold
        SCROLL_HEADER_OFFSET: 60,

        // Debounce delay (ms)
        DEBOUNCE_DELAY: 100,

        // Throttle delay (ms)
        THROTTLE_DELAY: 16,

        // CSS class names
        CLASSES: {
            ACTIVE: 'active',
            OPEN: 'open',
            VISIBLE: 'visible',
            SCROLLED: 'scrolled',
            HIDDEN: 'hidden',
            FADE_UP: 'fade-up',
            STAGGER: 'stagger-children',
            NAV_MOBILE: 'nav-mobile',
            NAV_MOBILE_OVERLAY: 'nav-mobile-overlay',
            HAMBURGER: 'hamburger-toggle',
            HERO: 'hero',
            STAT_NUMBER: 'stat-number',
        },
    };

    // ============================================================
    //   2.  DOM CACHE (lazy initialization)
    // ============================================================

    const DOM = {};

    function cacheDom() {
        DOM.header = document.querySelector('.site-header');
        DOM.hamburger = document.getElementById('hamburgerToggle');
        DOM.navMobile = document.getElementById('mobileNav');
        DOM.navOverlay = document.querySelector('.nav-mobile-overlay');
        DOM.hero = document.getElementById('hero');
        DOM.stats = document.querySelectorAll('.stat-number');
        DOM.revealElements = document.querySelectorAll('.fade-up');
        DOM.staggerElements = document.querySelectorAll('.stagger-children');
        DOM.smoothLinks = document.querySelectorAll('a[href^="#"]');
        DOM.localTimeWrapper = document.getElementById('localTimeWrapper');
        DOM.astroDisplay = document.getElementById('astroDisplay');
        DOM.timeDigital = document.querySelector('.dhaka-time');
        DOM.navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
        DOM.body = document.body;
        DOM.document = document.documentElement;
    }

    // ============================================================
    //   3.  UTILITY FUNCTIONS
    // ============================================================

    /**
     * Debounce a function call
     */
    function debounce(fn, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Throttle a function call
     */
    function throttle(fn, limit) {
        let inThrottle = false;
        return function (...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(el, threshold) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const offset = threshold || CONFIG.REVEAL_THRESHOLD;
        return rect.top < vh * (1 - offset) && rect.bottom > vh * offset;
    }

    /**
     * Get the current page filename
     */
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }

    /**
     * Safely get an element by selector
     */
    function getElement(selector, context) {
        const ctx = context || document;
        return ctx.querySelector(selector);
    }

    /**
     * Safely get multiple elements by selector
     */
    function getElements(selector, context) {
        const ctx = context || document;
        return [...ctx.querySelectorAll(selector)];
    }

    /**
     * Check if running on mobile
     */
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // ============================================================
    //   4.  NAVIGATION MODULE
    // ============================================================

    const Navigation = {
        init() {
            this.setupHamburger();
            this.setupNavOverlay();
            this.setupNavLinks();
            this.setupActiveNav();
            this.setupStickyHeader();
        },

        setupHamburger() {
            if (!DOM.hamburger || !DOM.navMobile) return;

            DOM.hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileNav();
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && DOM.navMobile.classList.contains(CONFIG.CLASSES.OPEN)) {
                    this.closeMobileNav();
                }
            });
        },

        setupNavOverlay() {
            if (!DOM.navOverlay) {
                // Create overlay if it doesn't exist
                const overlay = document.createElement('div');
                overlay.className = 'nav-mobile-overlay';
                overlay.setAttribute('aria-hidden', 'true');
                DOM.body.appendChild(overlay);
                DOM.navOverlay = overlay;
            }

            DOM.navOverlay.addEventListener('click', () => {
                this.closeMobileNav();
            });

            // Also close when clicking on a mobile nav link
            const mobileLinks = getElements('.nav-mobile-link', DOM.navMobile);
            mobileLinks.forEach((link) => {
                link.addEventListener('click', () => {
                    this.closeMobileNav();
                });
            });
        },

        toggleMobileNav() {
            const isOpen = DOM.navMobile.classList.contains(CONFIG.CLASSES.OPEN);
            if (isOpen) {
                this.closeMobileNav();
            } else {
                this.openMobileNav();
            }
        },

        openMobileNav() {
            DOM.navMobile.classList.add(CONFIG.CLASSES.OPEN);
            if (DOM.hamburger) DOM.hamburger.classList.add(CONFIG.CLASSES.OPEN);
            if (DOM.navOverlay) DOM.navOverlay.classList.add(CONFIG.CLASSES.OPEN);
            DOM.body.style.overflow = 'hidden';
            DOM.hamburger?.setAttribute('aria-expanded', 'true');
        },

        closeMobileNav() {
            DOM.navMobile.classList.remove(CONFIG.CLASSES.OPEN);
            if (DOM.hamburger) DOM.hamburger.classList.remove(CONFIG.CLASSES.OPEN);
            if (DOM.navOverlay) DOM.navOverlay.classList.remove(CONFIG.CLASSES.OPEN);
            DOM.body.style.overflow = '';
            DOM.hamburger?.setAttribute('aria-expanded', 'false');
        },

        setupNavLinks() {
            // Close mobile nav on any nav link click
            DOM.navLinks.forEach((link) => {
                link.addEventListener('click', () => {
                    if (isMobile()) {
                        this.closeMobileNav();
                    }
                });
            });
        },

        setupActiveNav() {
            const currentPage = getCurrentPage();
            DOM.navLinks.forEach((link) => {
                const href = link.getAttribute('href');
                if (href === currentPage) {
                    link.classList.add(CONFIG.CLASSES.ACTIVE);
                } else {
                    link.classList.remove(CONFIG.CLASSES.ACTIVE);
                }
            });
        },

        setupStickyHeader() {
            if (!DOM.header) return;

            const handleScroll = throttle(() => {
                const scrollY = window.scrollY;
                if (scrollY > CONFIG.SCROLL_HEADER_OFFSET) {
                    DOM.header.classList.add(CONFIG.CLASSES.SCROLLED);
                } else {
                    DOM.header.classList.remove(CONFIG.CLASSES.SCROLLED);
                }
            }, CONFIG.THROTTLE_DELAY);

            window.addEventListener('scroll', handleScroll, { passive: true });
            // Initial check
            handleScroll();
        },

        // Public method to close nav from outside
        close() {
            this.closeMobileNav();
        },
    };

    // ============================================================
    //   5.  SCROLL REVEAL MODULE
    // ============================================================

    const ScrollReveal = {
        observer: null,

        init() {
            if (!('IntersectionObserver' in window)) {
                this.fallbackReveal();
                return;
            }

            const threshold = isMobile()
                ? CONFIG.REVEAL_THRESHOLD_MOBILE
                : CONFIG.REVEAL_THRESHOLD;

            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add(CONFIG.CLASSES.VISIBLE);
                            // Optionally unobserve after reveal
                            // this.observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: threshold,
                    rootMargin: '0px 0px -40px 0px',
                }
            );

            // Observe fade-up elements
            DOM.revealElements.forEach((el) => {
                this.observer.observe(el);
            });

            // Observe stagger elements
            DOM.staggerElements.forEach((el) => {
                this.observer.observe(el);
            });

            // Also observe any elements with data-reveal attribute
            const dataReveal = getElements('[data-reveal]');
            dataReveal.forEach((el) => {
                this.observer.observe(el);
            });
        },

        // Fallback for browsers without IntersectionObserver
        fallbackReveal() {
            const revealAll = () => {
                DOM.revealElements.forEach((el) => {
                    el.classList.add(CONFIG.CLASSES.VISIBLE);
                });
                DOM.staggerElements.forEach((el) => {
                    el.classList.add(CONFIG.CLASSES.VISIBLE);
                });
                const dataReveal = getElements('[data-reveal]');
                dataReveal.forEach((el) => {
                    el.classList.add(CONFIG.CLASSES.VISIBLE);
                });
            };
            revealAll();
        },

        // Re-observe new elements (for dynamic content)
        observe(el) {
            if (this.observer) {
                this.observer.observe(el);
            }
        },

        // Check and reveal elements immediately (for edge cases)
        checkNow() {
            DOM.revealElements.forEach((el) => {
                if (isInViewport(el, CONFIG.REVEAL_THRESHOLD)) {
                    el.classList.add(CONFIG.CLASSES.VISIBLE);
                }
            });
            DOM.staggerElements.forEach((el) => {
                if (isInViewport(el, CONFIG.REVEAL_THRESHOLD)) {
                    el.classList.add(CONFIG.CLASSES.VISIBLE);
                }
            });
        },
    };

    // ============================================================
    //   6.  COUNT-UP ANIMATION MODULE
    // ============================================================

    const CountUp = {
        observer: null,
        animated: new Set(),

        init() {
            if (!('IntersectionObserver' in window)) {
                this.animateAll();
                return;
            }

            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting && !this.animated.has(entry.target)) {
                            this.animate(entry.target);
                            this.animated.add(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.5,
                }
            );

            DOM.stats.forEach((el) => {
                this.observer.observe(el);
            });

            // Also check for any data-count elements
            const dataCount = getElements('[data-count]');
            dataCount.forEach((el) => {
                if (!el.classList.contains('stat-number')) {
                    this.observer.observe(el);
                }
            });
        },

        animate(el) {
            const target = parseFloat(el.getAttribute('data-count'));
            if (isNaN(target)) return;

            const isFloat = target % 1 !== 0;
            const duration = CONFIG.COUNT_DURATION;
            const start = performance.now();
            const startValue = parseFloat(el.textContent) || 0;

            // If it's a small number (like 3.14), animate it directly
            // If it's a larger number (like 5, 4, 2), animate from 0
            const from = target < 10 ? startValue : 0;

            const animateStep = (timestamp) => {
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const current = from + (target - from) * easeOut;

                if (isFloat) {
                    el.textContent = current.toFixed(2);
                } else {
                    el.textContent = Math.round(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(animateStep);
                } else {
                    el.textContent = isFloat ? target.toFixed(2) : Math.round(target);
                }
            };

            requestAnimationFrame(animateStep);
        },

        animateAll() {
            DOM.stats.forEach((el) => {
                if (!this.animated.has(el)) {
                    this.animate(el);
                    this.animated.add(el);
                }
            });
        },

        // Animate a specific element
        animateElement(el) {
            if (!this.animated.has(el)) {
                this.animate(el);
                this.animated.add(el);
            }
        },
    };

    // ============================================================
    //   7.  SMOOTH SCROLL MODULE
    // ============================================================

    const SmoothScroll = {
        init() {
            DOM.smoothLinks.forEach((link) => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        this.scrollTo(targetElement);
                    }
                });
            });
        },

        scrollTo(target) {
            const headerHeight = DOM.header ? DOM.header.offsetHeight : 72;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth',
            });
        },

        // Scroll to a specific element by selector
        scrollToSelector(selector) {
            const target = document.querySelector(selector);
            if (target) {
                this.scrollTo(target);
            }
        },
    };

    // ============================================================
    //   8.  LOCAL TIME & SUN CALC MODULE
    // ============================================================

    const ClockModule = {
        timer: null,

        init() {
            // Only initialize if the clock elements exist
            if (!DOM.localTimeWrapper && !DOM.timeDigital) return;

            // Check if SunCalc is loaded
            if (typeof SunCalc === 'undefined') {
                console.warn('SunCalc library not loaded. Time display will be limited.');
                this.updateClockOnly();
                this.timer = setInterval(() => this.updateClockOnly(), 1000);
                return;
            }

            this.update();
            this.timer = setInterval(() => this.update(), 1000);
        },

        update() {
            const now = new Date();
            this.updateTimeDisplay(now);
            this.updateTimeOfDay(now);
        },

        updateClockOnly() {
            const now = new Date();
            this.updateTimeDisplay(now);
        },

        updateTimeDisplay(now) {
            if (!DOM.timeDigital) return;

            const options = {
                timeZone: 'Asia/Dhaka',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            };

            try {
                const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
                DOM.timeDigital.textContent = timeStr;
            } catch (e) {
                // Fallback
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                DOM.timeDigital.textContent = `${hours}:${minutes}:${seconds}`;
            }
        },

        updateTimeOfDay(now) {
            if (!DOM.localTimeWrapper || !DOM.astroDisplay) return;
            if (typeof SunCalc === 'undefined') return;

            const { DHAKA_LAT, DHAKA_LON } = CONFIG;

            try {
                const sunTimes = SunCalc.getTimes(now, DHAKA_LAT, DHAKA_LON);
                const sunrise = sunTimes.sunrise;
                const sunset = sunTimes.sunset;
                const nowTime = now.getTime();

                const dawnStart = new Date(sunrise.getTime() - 30 * 60 * 1000);
                const morningEnd = new Date(sunrise.getTime() + 2 * 60 * 60 * 1000);
                const noonStart = new Date(sunrise.getTime() + 2 * 60 * 60 * 1000);
                const noonEnd = new Date(sunset.getTime() - 2 * 60 * 60 * 1000);
                const afternoonStart = new Date(sunset.getTime() - 2 * 60 * 60 * 1000);
                const duskEnd = new Date(sunset.getTime() + 30 * 60 * 1000);
                const lightNightEnd = new Date(sunset.getTime() + 3 * 60 * 60 * 1000);

                let phase = '';
                let isDay = false;

                if (nowTime >= dawnStart.getTime() && nowTime < sunrise.getTime()) {
                    phase = 'dawn';
                    isDay = true;
                } else if (nowTime >= sunrise.getTime() && nowTime < morningEnd.getTime()) {
                    phase = 'morning';
                    isDay = true;
                } else if (nowTime >= noonStart.getTime() && nowTime < noonEnd.getTime()) {
                    phase = 'noon';
                    isDay = true;
                } else if (nowTime >= afternoonStart.getTime() && nowTime < sunset.getTime()) {
                    phase = 'afternoon';
                    isDay = true;
                } else if (nowTime >= sunset.getTime() && nowTime < duskEnd.getTime()) {
                    phase = 'dusk';
                    isDay = true;
                } else if (nowTime >= duskEnd.getTime() && nowTime < lightNightEnd.getTime()) {
                    phase = 'night-light';
                    isDay = false;
                } else {
                    phase = 'night-deep';
                    isDay = false;
                }

                // Update wrapper classes
                const phaseClasses = ['dawn', 'morning', 'noon', 'afternoon', 'dusk', 'night-light', 'night-deep'];
                DOM.localTimeWrapper.className = DOM.localTimeWrapper.className
                    .split(' ')
                    .filter((c) => !phaseClasses.includes(c))
                    .concat(phase)
                    .join(' ');

                // Update astro display
                this.updateAstroDisplay(now, isDay);

            } catch (e) {
                console.warn('SunCalc error:', e);
                // Fallback: show a simple sun/moon based on hour
                const hour = now.getHours();
                const isDay = hour >= 6 && hour < 18;
                this.updateAstroDisplayFallback(isDay);
            }
        },

        updateAstroDisplay(now, isDay) {
            if (!DOM.astroDisplay) return;

            if (isDay) {
                DOM.astroDisplay.innerHTML = `<div class="sun"></div>`;
            } else {
                try {
                    const moonIllum = SunCalc.getMoonIllumination(now);
                    const phaseAngle = moonIllum.angle;
                    const fraction = moonIllum.fraction;

                    let sizeClass = 'size-medium';
                    if (fraction < 0.3) sizeClass = 'size-small';
                    else if (fraction > 0.7) sizeClass = 'size-large';

                    const rotationDeg = ((phaseAngle * 180) / Math.PI) % 360;

                    DOM.astroDisplay.innerHTML = `
                        <div class="moon ${sizeClass}" style="--rotation: ${rotationDeg}deg;"></div>
                    `;
                } catch (e) {
                    this.updateAstroDisplayFallback(false);
                }
            }
        },

        updateAstroDisplayFallback(isDay) {
            if (!DOM.astroDisplay) return;
            if (isDay) {
                DOM.astroDisplay.innerHTML = `<div class="sun"></div>`;
            } else {
                DOM.astroDisplay.innerHTML = `<div class="moon size-medium" style="--rotation: 180deg;"></div>`;
            }
        },

        // Clean up interval
        destroy() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
    };

    // ============================================================
    //   9.  DISCORD COPY MODULE
    // ============================================================

    const DiscordCopy = {
        init() {
            const discordBtn = document.querySelector('.discord-copy');
            if (!discordBtn) return;

            const originalHTML = discordBtn.innerHTML;

            discordBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const username = 'naz.irt.k6';

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(username)
                        .then(() => {
                            this.showFeedback(discordBtn, originalHTML);
                        })
                        .catch(() => {
                            this.fallbackCopy(discordBtn, originalHTML, username);
                        });
                } else {
                    this.fallbackCopy(discordBtn, originalHTML, username);
                }
            });
        },

        showFeedback(btn, originalHTML) {
            btn.innerHTML = '<i class="fas fa-check"></i> Username Copied!';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
            }, 1800);
        },

        fallbackCopy(btn, originalHTML, text) {
            // Fallback: select and copy using input
            const input = document.createElement('input');
            input.value = text;
            input.style.position = 'fixed';
            input.style.opacity = '0';
            document.body.appendChild(input);
            input.select();
            try {
                document.execCommand('copy');
                this.showFeedback(btn, originalHTML);
            } catch (e) {
                alert('Copy failed. Please copy manually: ' + text);
            }
            document.body.removeChild(input);
        },
    };

    // ============================================================
    //   10.  THEME UTILITIES (if needed for future dark mode)
    // ============================================================

    const ThemeUtils = {
        getPreferredTheme() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light';
        },

        watchTheme(callback) {
            if (!window.matchMedia) return;
            const media = window.matchMedia('(prefers-color-scheme: dark)');
            media.addEventListener('change', (e) => {
                callback(e.matches ? 'dark' : 'light');
            });
        },
    };

    // ============================================================
    //   11.  PERFORMANCE OPTIMIZATIONS
    // ============================================================

    const Performance = {
        init() {
            this.setupLazyLoading();
            this.setupPassiveListeners();
            this.setupResizeHandler();
        },

        setupLazyLoading() {
            if ('loading' in HTMLImageElement.prototype) {
                // Native lazy loading is supported
                const images = document.querySelectorAll('img[loading="lazy"]');
                // Already using native lazy-loading
            } else {
                // Fallback: use IntersectionObserver for lazy loading
                if ('IntersectionObserver' in window) {
                    const lazyImages = document.querySelectorAll('img[data-src]');
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                const src = img.getAttribute('data-src');
                                if (src) {
                                    img.src = src;
                                    img.removeAttribute('data-src');
                                }
                                observer.unobserve(img);
                            }
                        });
                    });
                    lazyImages.forEach((img) => observer.observe(img));
                }
            }
        },

        setupPassiveListeners() {
            // All scroll listeners should use { passive: true }
            // This is handled in individual modules
        },

        setupResizeHandler() {
            const handleResize = debounce(() => {
                // Re-check scroll reveal on resize
                ScrollReveal.checkNow();

                // Close mobile nav on resize to desktop
                if (!isMobile() && DOM.navMobile) {
                    if (DOM.navMobile.classList.contains(CONFIG.CLASSES.OPEN)) {
                        Navigation.close();
                    }
                }
            }, CONFIG.DEBOUNCE_DELAY);

            window.addEventListener('resize', handleResize, { passive: true });
        },
    };

    // ============================================================
    //   12.  ACCESSIBILITY UTILITIES
    // ============================================================

    const Accessibility = {
        init() {
            this.setupSkipLink();
            this.setupFocusTrap();
        },

        setupSkipLink() {
            // Skip link already in HTML
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                skipLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const mainContent = document.querySelector('main');
                    if (mainContent) {
                        mainContent.setAttribute('tabindex', '-1');
                        mainContent.focus();
                    }
                });
            }
        },

        setupFocusTrap() {
            // Trap focus in mobile nav when open
            document.addEventListener('keydown', (e) => {
                if (e.key !== 'Tab') return;
                if (!DOM.navMobile || !DOM.navMobile.classList.contains(CONFIG.CLASSES.OPEN)) return;

                const focusable = DOM.navMobile.querySelectorAll(
                    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            });
        },
    };

    // ============================================================
    //   13.  MAIN INITIALIZATION
    // ============================================================

    function init() {
        // Cache DOM elements
        cacheDom();

        // Initialize modules
        Navigation.init();
        ScrollReveal.init();
        CountUp.init();
        SmoothScroll.init();
        ClockModule.init();
        DiscordCopy.init();
        Performance.init();
        Accessibility.init();

        // Additional: handle dynamic content loading
        // If there's a blog or dynamic content container, observe new elements
        const observer = new MutationObserver(() => {
            // Re-check for new fade-up elements
            const newReveal = document.querySelectorAll('.fade-up:not(.visible)');
            newReveal.forEach((el) => {
                ScrollReveal.observe(el);
            });

            // Re-check for new stagger elements
            const newStagger = document.querySelectorAll('.stagger-children:not(.visible)');
            newStagger.forEach((el) => {
                ScrollReveal.observe(el);
            });

            // Re-check for new stat numbers
            const newStats = document.querySelectorAll('.stat-number:not([data-observed])');
            newStats.forEach((el) => {
                el.setAttribute('data-observed', 'true');
                CountUp.animateElement(el);
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Log success
        console.log(
            '%c✦ IrtiJa · Executive Portfolio %cv2.0',
            'background:#004643;color:#D4A853;padding:6px 14px;border-radius:4px 0 0 4px;font-weight:700;letter-spacing:0.5px;',
            'background:#D4A853;color:#004643;padding:6px 14px;border-radius:0 4px 4px 0;font-weight:600;'
        );
        console.log('%c🌿 Modular architecture · Vanilla JS · Production ready', 'color:#1A7A74;font-weight:500;');
    }

    // ============================================================
    //   14.  BOOTSTRAP
    // ============================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already ready
        init();
    }

    // ============================================================
    //   15.  EXPOSE PUBLIC API (for debugging / external use)
    // ============================================================

    window.IrtiJa = {
        // Modules
        Navigation,
        ScrollReveal,
        CountUp,
        SmoothScroll,
        ClockModule,
        DiscordCopy,
        ThemeUtils,
        Performance,
        Accessibility,

        // Utilities
        isMobile,
        getCurrentPage,
        debounce,
        throttle,
        isInViewport,

        // Re-init (for dynamic content)
        reinit() {
            cacheDom();
            ScrollReveal.init();
            CountUp.init();
            // Re-check for new elements
            const newStats = document.querySelectorAll('.stat-number:not([data-observed])');
            newStats.forEach((el) => {
                el.setAttribute('data-observed', 'true');
                CountUp.animateElement(el);
            });
        },
    };

})();
