// ============================================================
//  SCRIPT.JS — EXECUTIVE PORTFOLIO UTILITIES
//  Earthy Forest Edition · No Router (separate HTML pages)
//  Handles: Clock, Data Rendering, Interactions, Animations
// ============================================================

(function () {
    'use strict';

    // ============================================================
    //  1.  CONFIGURATION (centralised – can be overridden by config.js)
    // ============================================================

    const CONFIG = window.CONFIG || {
        GITHUB_USER: 'Irtizaa6x',
        GITHUB_REPO: 'Irtizaa6x.github.io',
        BRANCH: 'main',
        POSTS_PATH: 'src/posts',
        BLOG_DETAIL_PATH: '/blog-detail',
        BLOG_CONTAINER_ID: 'blogContainer',
        BLOG_LOAD_RETRIES: 3,
        BLOG_LOAD_DELAY: 1000,
    };

    // ============================================================
    //  2.  DOM HELPERS
    // ============================================================

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    // ============================================================
    //  3.  REAL‑TIME CLOCK (Dhaka) + SUN/MOON (SunCalc)
    // ============================================================

    const DHAKA_LAT = 23.8103;
    const DHAKA_LON = 90.4125;

    function updateTimeOfDay() {
        // Guard against missing SunCalc
        if (typeof SunCalc === 'undefined') {
            console.warn('SunCalc not loaded — skipping time-of-day update');
            return;
        }

        const wrapper = document.getElementById('localTimeWrapper');
        const astroDisplay = document.getElementById('astroDisplay');
        if (!wrapper || !astroDisplay) return;

        const now = new Date();
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

        wrapper.className = wrapper.className
            .split(' ')
            .filter(c => !['dawn', 'morning', 'noon', 'afternoon', 'dusk', 'night-light', 'night-deep'].includes(c))
            .concat(phase)
            .join(' ');

        // Astro display
        if (isDay) {
            astroDisplay.innerHTML = `<div class="sun"></div>`;
        } else {
            const moonIllum = SunCalc.getMoonIllumination(now);
            const phaseAngle = moonIllum.angle;
            const fraction = moonIllum.fraction;

            let sizeClass = 'size-medium';
            if (fraction < 0.3) sizeClass = 'size-small';
            else if (fraction > 0.7) sizeClass = 'size-large';

            const rotationDeg = ((phaseAngle * 180) / Math.PI) % 360;
            astroDisplay.innerHTML = `
                <div class="moon ${sizeClass}" style="--rotation: ${rotationDeg}deg;"></div>
            `;
        }
    }

    function updateDhakaTime() {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Dhaka',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
        document.querySelectorAll('.dhaka-time').forEach((el) => {
            el.textContent = timeStr;
        });
        updateTimeOfDay();
    }

    // ============================================================
    //  4.  DURATION CALCULATOR (from data.js)
    // ============================================================

    function calculateDuration(startDate, endDate) {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        if (isNaN(start.getTime())) return 'Invalid date';

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months--;
            const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        const parts = [];
        if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
        if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
        if (days > 0 && years === 0 && months === 0) {
            parts.push(`${days} day${days > 1 ? 's' : ''}`);
        }

        if (parts.length === 0) return 'Less than a day';
        return parts.join(' ') + (endDate ? '' : '+');
    }

    // ============================================================
    //  5.  RENDER EXPERIENCES + CERTIFICATIONS (from data.js)
    // ============================================================

    function renderExperiences() {
        const expContainer = document.getElementById('experienceContainer');
        const certContainer = document.getElementById('certificationsContainer');
        if (!expContainer || typeof experiences === 'undefined') return;

        const mainExperiences = experiences.filter((exp) => exp.id !== 'certifications');
        const certExperience = experiences.find((exp) => exp.id === 'certifications');

        // Timeline
        const sorted = [...mainExperiences].sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate)
        );

        let expHtml = '';
        sorted.forEach((exp) => {
            const duration = calculateDuration(exp.startDate, exp.endDate);
            const isOngoing = !exp.endDate;
            const dateLabel = isOngoing ?
                `${exp.startDate} – Present` :
                `${exp.startDate} – ${exp.endDate}`;

            expHtml += `
                <div class="timeline-entry">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${dateLabel}</div>
                        <h4><i class="${exp.icon || 'fas fa-briefcase'}"></i> ${exp.title}</h4>
                        <div class="meta-inline">
                            <span><i class="fas fa-user-check"></i> ${exp.role || 'Member'}</span>
                            <span><i class="fas fa-hourglass-half"></i> ${duration}</span>
                        </div>
                        <p class="key-points-single">${exp.description || ''}</p>
                        ${exp.parentClub ? `<div class="parent-club"><i class="fas fa-users"></i> Parent Club: <strong>${exp.parentClub}</strong></div>` : ''}
                        ${exp.certButtons ? `
                            <div class="cert-buttons">
                                ${exp.certButtons.map((btn) => `
                                    <a href="${btn.url}" target="_blank" class="btn-outline">
                                        ${btn.icon ? `<i class="${btn.icon}"></i>` : ''}
                                        ${btn.img ? `<img src="${btn.img}" class="official-icon" alt="${btn.label}" />` : ''}
                                        ${btn.label}
                                    </a>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        expContainer.innerHTML = expHtml || '<p class="text-muted">No experience entries found.</p>';

        // Certifications card
        if (certContainer) {
            if (certExperience) {
                const cert = certExperience;
                let buttonsHtml = '';
                if (cert.certButtons && cert.certButtons.length) {
                    buttonsHtml = `
                        <div class="cert-buttons">
                            ${cert.certButtons.map((btn) => `
                                <a href="${btn.url}" target="_blank" class="btn-outline">
                                    ${btn.icon ? `<i class="${btn.icon}"></i>` : ''}
                                    ${btn.img ? `<img src="${btn.img}" class="official-icon" alt="${btn.label}" />` : ''}
                                    ${btn.label}
                                </a>
                            `).join('')}
                        </div>
                    `;
                }

                certContainer.innerHTML = `
                    <div class="cert-card">
                        <div class="cert-header">
                            <h4><i class="fas fa-certificate"></i> ${cert.title}</h4>
                            <span class="ongoing-badge">Ongoing</span>
                        </div>
                        <div class="cert-body">
                            <p>${cert.description || ''}</p>
                            ${cert.parentClub ? `<div class="parent-club"><i class="fas fa-users"></i> ${cert.parentClub}</div>` : ''}
                            ${buttonsHtml}
                        </div>
                    </div>
                `;
            } else {
                certContainer.innerHTML = '<p class="text-muted">No certifications yet.</p>';
            }
        }
    }

    // ============================================================
    //  6.  RENDER SKILLS (from data.js)
    // ============================================================

    function renderSkills() {
        const container = document.getElementById('skillsContainer');
        if (!container || typeof skills === 'undefined') return;

        const categoryMap = {
            cyber: { icon: 'fa-user-secret', title: 'Cybersecurity' },
            web: { icon: 'fa-html5', title: 'Web Dev & Programming' },
            networking: { icon: 'fa-cloud-arrow-up', title: 'Networking & Web Tech' },
            professional: { icon: 'fa-briefcase', title: 'Professional Skills & Tools' },
        };

        let html = '';
        for (const [key, cat] of Object.entries(categoryMap)) {
            const skillList = skills[key] || [];
            if (skillList.length === 0) continue;

            html += `
                <div class="skill-category" data-collapsible>
                    <h3><i class="fas ${cat.icon}"></i> ${cat.title}</h3>
                    <div class="skills-list-wrapper">
                        <div class="skills-list fade-gradient">
                            ${skillList.map((skill) => `
                                <span class="skill-tag"><i class="${skill.icon || 'fas fa-circle'}"></i> ${skill.name}</span>
                            `).join('')}
                        </div>
                        <div class="fade-overlay"></div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    // ============================================================
    //  7.  COLLAPSIBLE SKILLS (Show All / Show Less)
    // ============================================================

    function initCollapsibleSkills() {
        document.querySelectorAll('.skill-category[data-collapsible]').forEach((category) => {
            const skillsList = category.querySelector('.skills-list');
            const overlay = category.querySelector('.fade-overlay');
            const wrapper = category.querySelector('.skills-list-wrapper');
            if (!skillsList || !overlay || !wrapper) return;

            // Remove old show-less button if any
            const oldBtn = wrapper.querySelector('.show-less-btn-inline');
            if (oldBtn) oldBtn.remove();

            const showLess = document.createElement('div');
            showLess.className = 'show-less-btn-inline';
            showLess.innerHTML = '<i class="fas fa-chevron-up"></i> Show less';
            Object.assign(showLess.style, {
                display: 'none',
                textAlign: 'center',
                marginTop: '0.7rem',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: '600',
                color: '#344e41',
                background: 'rgba(163,177,138,0.08)',
                width: 'fit-content',
                padding: '0.2rem 0.9rem',
                borderRadius: '20px',
                marginLeft: 'auto',
                marginRight: 'auto',
            });
            wrapper.appendChild(showLess);

            // Replace overlay with fresh clone to remove old listeners
            const newOverlay = overlay.cloneNode(true);
            overlay.parentNode.replaceChild(newOverlay, overlay);

            newOverlay.addEventListener('click', (e) => {
                e.stopPropagation();
                skillsList.classList.remove('fade-gradient');
                category.classList.add('expanded');
                showLess.style.display = 'block';
            });

            showLess.addEventListener('click', (e) => {
                e.stopPropagation();
                skillsList.classList.add('fade-gradient');
                category.classList.remove('expanded');
                showLess.style.display = 'none';
            });
        });
    }

    // ============================================================
    //  8.  ACADEMIC DETAILS TOGGLE
    // ============================================================

    function initAcademicDetails() {
        document.querySelectorAll('.btn-toggle-details').forEach((btn) => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                if (!targetId) return;
                const detailsContainer = document.getElementById(targetId);
                if (!detailsContainer) return;
                this.classList.toggle('open');
                detailsContainer.classList.toggle('open');
            });
        });
    }

    // ============================================================
    //  9.  SCROLL TO CERTIFICATIONS (clickable hint)
    // ============================================================

    function initScrollToCert() {
        const trigger = document.getElementById('scrollToCertTrigger');
        const target = document.getElementById('certificationsSection');
        if (!trigger || !target) return;

        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ============================================================
    //  10. DISCORD COPY TO CLIPBOARD (improved)
    // ============================================================

    function initDiscordCopy() {
        const discordBtn = document.querySelector('.discord-copy');
        if (!discordBtn) return;
        const originalHTML = discordBtn.innerHTML;
        discordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText('naz.irt.k6').catch(() => {
                // Fallback for non-secure contexts
                const textArea = document.createElement('textarea');
                textArea.value = 'naz.irt.k6';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            });
            discordBtn.innerHTML = '<i class="fas fa-check"></i> Username Copied!';
            setTimeout(() => {
                discordBtn.innerHTML = originalHTML;
            }, 1800);
        });
    }

    // ============================================================
    //  11. HAMBURGER MENU TOGGLE
    // ============================================================

    function initHamburger() {
        const toggleBtn = document.getElementById('hamburgerToggle');
        const sidebar = document.getElementById('sidebar');
        if (!toggleBtn || !sidebar) return;

        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            toggleBtn.classList.toggle('open');
        });

        document.addEventListener('click', (event) => {
            if (
                window.innerWidth <= 768 &&
                sidebar.classList.contains('open') &&
                !sidebar.contains(event.target) &&
                !toggleBtn.contains(event.target)
            ) {
                sidebar.classList.remove('open');
                toggleBtn.classList.remove('open');
            }
        });
    }

    // ============================================================
    //  12. MOBILE HEADER SCROLL HIDE/SHOW
    // ============================================================

    function initScrollHeader() {
        const header = document.getElementById('mobileHeader');
        if (!header) return;
        let lastScrollY = window.scrollY;
        let ticking = false;

        function handleScroll() {
            if (window.innerWidth > 768) {
                header.classList.remove('hidden');
                return;
            }
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener(
            'scroll',
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            },
            { passive: true }
        );
    }

    // ============================================================
    //  13. ACTIVE NAV ITEM (based on current page)
    // ============================================================

    function setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-item').forEach((item) => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // ============================================================
    //  14. LOGO LOGIC — show image on profile, placeholder on others
    // ============================================================

    function initLogo() {
        const navIconDisplay = document.getElementById('activeNavIcon');
        if (!navIconDisplay) return;

        const isProfilePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
        if (isProfilePage) {
            // Show actual logo image
            navIconDisplay.innerHTML = `<img src="logo.png" alt="Irtija Logo" class="sidebar-logo" />`;
        } else {
            // Show animated placeholder
            navIconDisplay.innerHTML = `<div class="sidebar-logo-placeholder">I</div>`;
        }
    }

    // ============================================================
    //  15. BLOG LOADER (single source of truth)
    // ============================================================

    /**
     * Load blogs only once, with retry logic.
     * Exposed globally via window.loadBlogs for external calls.
     */
    let blogLoadAttempted = false;

    async function loadBlogs() {
        // Prevent duplicate loads
        if (blogLoadAttempted) {
            console.log('Blogs already loaded or loading — skipping duplicate call.');
            return;
        }
        const container = document.getElementById(CONFIG.BLOG_CONTAINER_ID);
        if (!container) return;

        blogLoadAttempted = true;

        // Show loading state
        container.innerHTML = `
            <div class="blog-loading">
                <i class="fas fa-spinner"></i>
                <p>Loading blog posts...</p>
            </div>
        `;

        // Check if the blog loader function is available
        if (typeof window.loadBlogPosts === 'function') {
            // Use the dedicated blog loader from blogs.js
            try {
                await window.loadBlogPosts();
            } catch (err) {
                console.error('Blog loader failed:', err);
                container.innerHTML = `
                    <div class="blog-empty">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Could not load blog posts. Please refresh or try again later.</p>
                    </div>
                `;
            }
        } else {
            // Fallback: try to load the blogs.js script dynamically
            console.warn('Blog loader not found — attempting to load blogs.js');
            try {
                const script = document.createElement('script');
                script.src = 'blogs.js';
                script.async = false;
                document.head.appendChild(script);
                // Wait for it to load
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });
                // Now call again after a short delay
                setTimeout(() => {
                    if (typeof window.loadBlogPosts === 'function') {
                        window.loadBlogPosts().catch(console.error);
                    } else {
                        container.innerHTML = `
                            <div class="blog-empty">
                                <i class="fas fa-exclamation-triangle"></i>
                                <p>Blog loader not available. Please check your internet connection and refresh.</p>
                            </div>
                        `;
                    }
                }, 300);
            } catch (err) {
                container.innerHTML = `
                    <div class="blog-empty">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load blog module. Please try again later.</p>
                    </div>
                `;
            }
        }
    }

    // Expose loadBlogs globally so other scripts can call it
    window.loadBlogs = loadBlogs;

    // ============================================================
    //  16. BOOTSTRAP (DOM ready)
    // ============================================================

    function init() {
        // Render dynamic content from data.js
        if (typeof renderExperiences === 'function') renderExperiences();
        if (typeof renderSkills === 'function') renderSkills();

        // Initialise UI behaviours
        initCollapsibleSkills();
        initAcademicDetails();
        initScrollToCert();
        initDiscordCopy();
        initHamburger();
        initScrollHeader();
        setActiveNav();
        initLogo();

        // Start clock (if element exists)
        if (document.querySelector('.dhaka-time')) {
            updateDhakaTime();
            setInterval(updateDhakaTime, 1000);
        }

        // Load blogs only if on blog page and not already loaded
        if (document.getElementById(CONFIG.BLOG_CONTAINER_ID)) {
            // Use a small delay to ensure everything else is ready
            setTimeout(loadBlogs, 300);
        }

        console.log(
            '%c✦ Md. Irtija Azad Talha · Earthy Forest %cExecutive Portfolio',
            'background:#3a5a40;color:#dad7cd;padding:6px 14px;border-radius:4px 0 0 4px;font-weight:700;letter-spacing:0.5px;',
            'background:#dad7cd;color:#1e2b1e;padding:6px 14px;border-radius:0 4px 4px 0;font-weight:600;'
        );
        console.log('%c🌿 Separate HTML pages · Utility mode active', 'color:#588157;font-weight:500;');
    }

    // --- Run when DOM is ready ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
