// ============================================================
//  MD. IRTIJA AZAD TALHA – EXECUTIVE PORTFOLIO
//  Forest Green Edition · Solid Sidebar
//  WITH DYNAMIC DATA FROM data.js
//  & SUNCalc FOR REALISTIC SUN/MOON
//  & HISTORY API FOR CLEAN URLS (NO #)
// ============================================================

(function () {
    'use strict';

    // ============================================================
    //  1.  DOM REFS & GLOBALS
    // ============================================================

    const navItems = document.querySelectorAll('.nav-item');
    const mainContent = document.getElementById('mainContent');

    const pages = {
        home: document.getElementById('home-page'),
        education: document.getElementById('education-page'),
        skills: document.getElementById('skills-page'),
        experience: document.getElementById('experience-page'),
        blog: document.getElementById('blog-page'),
        contact: document.getElementById('contact-page'),
    };

    /** @type {string} – Tracks the currently active page to avoid duplicate renders */
    let currentPage = 'home';

    /** @type {boolean} – Prevents multiple initialisation calls */
    let isInitialised = false;

    // ============================================================
    //  2.  CORE NAVIGATION (History API Router)
    // ============================================================

    /**
     * Navigate to a specific page without reloading the browser.
     * @param {string} pageId – One of: 'home', 'education', 'skills', 'experience', 'blog', 'contact'
     * @param {boolean} pushState – Whether to push a new history entry (true) or replace (false)
     */
    function navigateTo(pageId, pushState = true) {
        // Guard: page must exist and be different from the current page
        if (!pages[pageId] || pageId === currentPage) return;

        // --- 1. Update active page (show/hide) ---
        Object.values(pages).forEach((p) => p && p.classList.remove('active-page'));
        pages[pageId].classList.add('active-page');

        // --- 2. Update nav item active states ---
        navItems.forEach((btn) => {
            const val = btn.getAttribute('data-page');
            btn.classList.toggle('active', val === pageId);
        });

        // --- 3. Update UI (header title & sidebar big icon) ---
        updateHeaderTitle(pageId);
        updateActiveIcon(pageId);

        // --- 4. Update browser URL (clean, no #) ---
        const path = pageId === 'home' ? '/' : `/${pageId}`;
        if (pushState) {
            window.history.pushState({ page: pageId }, '', path);
        } else {
            window.history.replaceState({ page: pageId }, '', path);
        }

        // --- 5. Update document title for SEO ---
        const pageNames = {
            home: 'Profile · IrtiJa',
            education: 'Qualifications · IrtiJa',
            skills: 'Capabilities · IrtiJa',
            experience: 'Activities · IrtiJa',
            blog: 'Blog · IrtiJa',
            contact: 'Connect · IrtiJa',
        };
        document.title = pageNames[pageId] || 'IrtiJa · Portfolio';

        // --- 6. Scroll to top smoothly ---
        if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // --- 7. Close mobile sidebar (if open) ---
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const hamburger = document.getElementById('hamburgerToggle');
            if (sidebar) sidebar.classList.remove('open');
            if (hamburger) hamburger.classList.remove('open');
        }

        // --- 8. Load blogs dynamically if we're on the blog page ---
        if (pageId === 'blog' && typeof window.loadBlogs === 'function') {
            window.loadBlogs();
        }

        // --- 9. Update current page tracker ---
        currentPage = pageId;
    }

    /**
     * Derive the page ID from the current URL pathname.
     * @returns {string} – Page ID ('home' if root or unknown)
     */
    function getPageFromPath() {
        const path = window.location.pathname.replace(/^\/|\/$/g, '') || 'home';
        return pages[path] ? path : 'home';
    }

    // --- Expose navigateTo globally for inline click handlers if needed ---
    window.navigateTo = navigateTo;

    // ============================================================
    //  3.  UI UPDATE HELPERS
    // ============================================================

    /**
     * Update the mobile header title to match the active page.
     * @param {string} pageId
     */
    function updateHeaderTitle(pageId) {
        const activeBtn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (!activeBtn) return;
        const iconHtml = activeBtn.querySelector('i').outerHTML;
        const label = activeBtn.querySelector('span')?.textContent ||
            pageId.charAt(0).toUpperCase() + pageId.slice(1);
        const titleContainer = document.getElementById('headerTitle');
        if (titleContainer) {
            titleContainer.innerHTML = `${iconHtml} <span>${label}</span>`;
        }
    }

    /**
     * Update the large icon in the sidebar (Home = image, others = icon).
     * Includes a subtle cross‑fade animation.
     * @param {string} pageId
     */
    function updateActiveIcon(pageId) {
        const displayContainer = document.getElementById('activeNavIcon');
        if (!displayContainer) return;

        // HOME → show the custom logo image
        if (pageId === 'home') {
            const currentImg = displayContainer.querySelector('.sidebar-logo');
            if (!currentImg) {
                const currentIcon = displayContainer.querySelector('i');
                if (currentIcon) {
                    currentIcon.classList.remove('anim-in');
                    currentIcon.classList.add('anim-out');
                    setTimeout(() => {
                        displayContainer.innerHTML =
                            `<img src="logo.png" alt="Irtija Logo" class="sidebar-logo" />`;
                        const newImg = displayContainer.querySelector('.sidebar-logo');
                        if (newImg) newImg.classList.add('anim-in');
                    }, 200);
                } else {
                    displayContainer.innerHTML =
                        `<img src="logo.png" alt="Irtija Logo" class="sidebar-logo" />`;
                    const newImg = displayContainer.querySelector('.sidebar-logo');
                    if (newImg) newImg.classList.add('anim-in');
                }
            }
            return;
        }

        // OTHER PAGES → use the corresponding nav icon
        const activeNavBtn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (!activeNavBtn) return;
        const newIconHtml = activeNavBtn.querySelector('i').outerHTML;

        const currentImg = displayContainer.querySelector('.sidebar-logo');
        if (currentImg) {
            currentImg.classList.remove('anim-in');
            currentImg.classList.add('anim-out');
            setTimeout(() => {
                displayContainer.innerHTML = newIconHtml;
                const newIcon = displayContainer.querySelector('i');
                if (newIcon) {
                    newIcon.classList.remove('anim-out');
                    requestAnimationFrame(() => newIcon.classList.add('anim-in'));
                }
            }, 200);
            return;
        }

        const currentIcon = displayContainer.querySelector('i');
        if (!currentIcon) {
            displayContainer.innerHTML = newIconHtml;
            const newIcon = displayContainer.querySelector('i');
            if (newIcon) newIcon.classList.add('anim-in');
            return;
        }

        // Animate out → replace → animate in
        currentIcon.classList.remove('anim-in');
        currentIcon.classList.add('anim-out');
        setTimeout(() => {
            displayContainer.innerHTML = newIconHtml;
            const newIcon = displayContainer.querySelector('i');
            if (newIcon) {
                newIcon.classList.remove('anim-out');
                requestAnimationFrame(() => newIcon.classList.add('anim-in'));
            }
        }, 200);
    }

    // ============================================================
    //  4.  REAL‑TIME CLOCK (Dhaka) + SUN/MOON (SunCalc)
    // ============================================================

    const DHAKA_LAT = 23.8103;
    const DHAKA_LON = 90.4125;

    /** Update the time‑of‑day phase and astro display (sun/moon) */
    function updateTimeOfDay() {
        const now = new Date();
        const wrapper = document.getElementById('localTimeWrapper');
        const astroDisplay = document.getElementById('astroDisplay');
        if (!wrapper || !astroDisplay) return;

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

        wrapper.classList.remove(
            'dawn', 'morning', 'noon', 'afternoon',
            'dusk', 'night-light', 'night-deep'
        );
        wrapper.classList.add(phase);

        // --- Astro display ---
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

    /** Update the digital clock (Dhaka time) every second */
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
    //  5.  DURATION CALCULATOR (from data.js)
    // ============================================================

    /**
     * Calculate human‑readable duration between two dates.
     * @param {string} startDate – YYYY-MM-DD
     * @param {string|null} endDate – YYYY-MM-DD or null (ongoing)
     * @returns {string} – e.g., "2 years 3 months+"
     */
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
    //  6.  RENDER EXPERIENCES + CERTIFICATIONS
    // ============================================================

    /** Render the main timeline and the certifications card */
    function renderExperiences() {
        const expContainer = document.getElementById('experienceContainer');
        const certContainer = document.getElementById('certificationsContainer');
        if (!expContainer || typeof experiences === 'undefined') return;

        const mainExperiences = experiences.filter((exp) => exp.id !== 'certifications');
        const certExperience = experiences.find((exp) => exp.id === 'certifications');

        // --- Main timeline (sorted newest first) ---
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

        // --- Certifications card ---
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
    //  7.  RENDER SKILLS (from data.js)
    // ============================================================

    /** Render the four skill categories with collapsible lists */
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
    //  8.  COLLAPSIBLE SKILLS (dynamic “Show all / Show less”)
    // ============================================================

    /** Initialise the collapsible behaviour for skill categories */
    function initCollapsibleSkills() {
        document.querySelectorAll('.skill-category[data-collapsible]').forEach((category) => {
            const skillsList = category.querySelector('.skills-list');
            const overlay = category.querySelector('.fade-overlay');
            const wrapper = category.querySelector('.skills-list-wrapper');
            if (!skillsList || !overlay || !wrapper) return;

            // Remove old show-less button if it exists
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
                color: '#216869',
                background: 'rgba(156,197,161,0.06)',
                width: 'fit-content',
                padding: '0.2rem 0.9rem',
                borderRadius: '20px',
                marginLeft: 'auto',
                marginRight: 'auto',
            });
            wrapper.appendChild(showLess);

            // Replace overlay with a fresh clone to remove old listeners
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
    //  9.  VARIOUS INITIALISERS (Discord, Hamburger, Academics, etc.)
    // ============================================================

    /** Copy Discord username to clipboard */
    function initDiscordCopy() {
        const discordBtn = document.querySelector('.discord-copy');
        if (!discordBtn) return;
        const originalHTML = discordBtn.innerHTML;
        discordBtn.addEventListener('click', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText('naz.irt.k6');
            discordBtn.innerHTML = '<i class="fas fa-check"></i> Username Copied!';
            setTimeout(() => {
                discordBtn.innerHTML = originalHTML;
            }, 1800);
        });
    }

    /** Mobile hamburger toggle + click‑outside close */
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

    /** Academic transcript toggle buttons */
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

    /** Scroll to certifications section (clickable hint) */
    function initScrollToCert() {
        const trigger = document.getElementById('scrollToCertTrigger');
        const target = document.getElementById('certificationsSection');
        if (!trigger || !target) return;

        trigger.addEventListener('click', function (e) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    /** Hide mobile header on scroll down, show on scroll up */
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
    //  10. BOOTSTRAP
    // ============================================================

    /** Initialise everything once the DOM is ready */
    function init() {
        if (isInitialised) return;
        isInitialised = true;

        // --- Render dynamic content ---
        renderExperiences();
        renderSkills();

        // --- Initialise UI behaviours ---
        initCollapsibleSkills();
        initDiscordCopy();
        initHamburger();
        initAcademicDetails();
        initScrollToCert();
        initScrollHeader();

        // --- Setup navigation click listeners ---
        navItems.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.getAttribute('data-page');
                if (page && pages[page]) {
                    navigateTo(page, true);
                }
            });
        });

        // --- Handle browser back/forward buttons ---
        window.addEventListener('popstate', (event) => {
            const page = event.state?.page || getPageFromPath();
            if (pages[page]) {
                navigateTo(page, false);
            }
        });

        // --- Start the real‑time clock ---
        updateDhakaTime();
        setInterval(updateDhakaTime, 1000);

        // --- Initial page load based on current URL path ---
        const initialPage = getPageFromPath();
        navigateTo(initialPage, false);

        // --- Log startup (so you know it's ready) ---
        console.log(
            '%c✦ Md. Irtija Azad Talha · Forest Green %cExecutive Portfolio',
            'background:#1f2421;color:#9cc5a1;padding:6px 14px;border-radius:4px 0 0 4px;font-weight:700;letter-spacing:0.5px;',
            'background:#9cc5a1;color:#1f2421;padding:6px 14px;border-radius:0 4px 4px 0;font-weight:600;'
        );
        console.log('%c🌿 Dynamic data from data.js loaded · SunCalc active · Clean URLs active', 'color:#216869;font-weight:500;');
    }

    // --- Wait for DOM, then bootstrap ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
