// ==========================================
//  MD. IRTIJA AZAD TALHA – EXECUTIVE PORTFOLIO
//  Forest Green Edition · Solid Sidebar
//  WITH DYNAMIC DATA FROM data.js
//  & SUNCalc for realistic sun/moon
// ==========================================

// ==========================================
//  DOM REFS
// ==========================================
const navItems = document.querySelectorAll('.nav-item');
const mainContent = document.getElementById('mainContent');
const pages = {
    home: document.getElementById('home-page'),
    education: document.getElementById('education-page'),
    skills: document.getElementById('skills-page'),
    experience: document.getElementById('experience-page'),
    contact: document.getElementById('contact-page'),
};

// ==========================================
//  CORE NAVIGATION
// ==========================================
function switchPage(pageId) {
    Object.values(pages).forEach((p) => p && p.classList.remove('active-page'));
    if (pages[pageId]) pages[pageId].classList.add('active-page');

    navItems.forEach((btn) => {
        const val = btn.getAttribute('data-page');
        if (val === pageId) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    if (mainContent) {
        mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    updateHeaderTitle(pageId);
    updateActiveIcon(pageId);

    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.getElementById('hamburgerToggle');
        if (sidebar) sidebar.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
    }
}

function updateHeaderTitle(pageId) {
    const activeBtn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (!activeBtn) return;
    const iconHtml = activeBtn.querySelector('i').outerHTML;
    const label = activeBtn.querySelector('span')?.textContent || pageId.charAt(0).toUpperCase() + pageId.slice(1);
    const titleContainer = document.getElementById('headerTitle');
    if (titleContainer) {
        titleContainer.innerHTML = `${iconHtml} <span>${label}</span>`;
    }
}

// ==========================================
//  SUBTLE ICON TRANSITION
// ==========================================
function updateActiveIcon(pageId) {
    const displayContainer = document.getElementById('activeNavIcon');
    if (!displayContainer) return;

    // If we are on the home page, show the custom logo
    if (pageId === 'home') {
        // Only update if it's not already the image
        const currentImg = displayContainer.querySelector('.sidebar-logo');
        if (!currentImg) {
            // Animate out any existing icon
            const currentIcon = displayContainer.querySelector('i');
            if (currentIcon) {
                currentIcon.classList.remove('anim-in');
                currentIcon.classList.add('anim-out');
                setTimeout(() => {
                    displayContainer.innerHTML = `<img src="irtija.png" alt="Irtija Logo" class="sidebar-logo" />`;
                    const newImg = displayContainer.querySelector('.sidebar-logo');
                    if (newImg) {
                        newImg.classList.add('anim-in');
                    }
                }, 200);
            } else {
                // No icon, just set the image
                displayContainer.innerHTML = `<img src="irtija.png" alt="Irtija Logo" class="sidebar-logo" />`;
                const newImg = displayContainer.querySelector('.sidebar-logo');
                if (newImg) {
                    newImg.classList.add('anim-in');
                }
            }
        }
        return;
    }

    // For other pages, use the nav item's icon
    const activeNavBtn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (!activeNavBtn) return;
    const newIconHtml = activeNavBtn.querySelector('i').outerHTML;

    // If the container currently has an image, replace it with the icon
    const currentImg = displayContainer.querySelector('.sidebar-logo');
    if (currentImg) {
        // Remove the image with a quick fade
        currentImg.classList.remove('anim-in');
        currentImg.classList.add('anim-out');
        setTimeout(() => {
            displayContainer.innerHTML = newIconHtml;
            const newIcon = displayContainer.querySelector('i');
            if (newIcon) {
                newIcon.classList.remove('anim-out');
                requestAnimationFrame(() => {
                    newIcon.classList.add('anim-in');
                });
            }
        }, 200);
        return;
    }

    // If it's already an icon, use the existing animation logic
    const currentIcon = displayContainer.querySelector('i');
    if (!currentIcon) {
        displayContainer.innerHTML = newIconHtml;
        const newIcon = displayContainer.querySelector('i');
        if (newIcon) {
            newIcon.classList.add('anim-in');
        }
        return;
    }

    currentIcon.classList.remove('anim-in');
    currentIcon.classList.add('anim-out');

    setTimeout(() => {
        displayContainer.innerHTML = newIconHtml;
        const newIcon = displayContainer.querySelector('i');
        if (newIcon) {
            newIcon.classList.remove('anim-out');
            requestAnimationFrame(() => {
                newIcon.classList.add('anim-in');
            });
        }
    }, 200);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const displayContainer = document.getElementById('activeNavIcon');
    if (displayContainer) {
        const icon = displayContainer.querySelector('i');
        if (icon) {
            icon.classList.add('anim-in');
        }
    }
    updateTimeOfDay();

    // ===== RENDER DYNAMIC CONTENT =====
    renderExperiences();
    renderSkills();
    initCollapsibleSkills(); // Re-run after dynamic render
});

navItems.forEach((btn) => {
    btn.addEventListener('click', () => {
        const page = btn.getAttribute('data-page');
        if (page && pages[page]) switchPage(page);
    });
});

const activeNav = document.querySelector('.nav-item.active');
if (activeNav) switchPage(activeNav.getAttribute('data-page'));
else switchPage('home');

// ==========================================
//  LIVE DHAKA TIME + REAL SUN/MOON (SunCalc)
// ==========================================

// Dhaka coordinates
const DHAKA_LAT = 23.8103;
const DHAKA_LON = 90.4125;

function updateTimeOfDay() {
    const now = new Date();
    const wrapper = document.getElementById('localTimeWrapper');
    const astroDisplay = document.getElementById('astroDisplay');
    if (!wrapper || !astroDisplay) return;

    // Get sunrise/sunset for today
    const sunTimes = SunCalc.getTimes(now, DHAKA_LAT, DHAKA_LON);
    const sunrise = sunTimes.sunrise;
    const sunset = sunTimes.sunset;
    const nowTime = now.getTime();

    // Define phase boundaries (in milliseconds)
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
        isDay = true; // twilight – still show sun
    } else if (nowTime >= duskEnd.getTime() && nowTime < lightNightEnd.getTime()) {
        phase = 'night-light';
        isDay = false;
    } else {
        phase = 'night-deep';
        isDay = false;
    }

    // Remove all phase classes, add the new one
    wrapper.classList.remove('dawn', 'morning', 'noon', 'afternoon', 'dusk', 'night-light', 'night-deep');
    wrapper.classList.add(phase);

    // --- Update astro display ---
    if (isDay) {
        // Show sun
        astroDisplay.innerHTML = `<div class="sun"></div>`;
    } else {
        // Show moon with phase
        const moonIllum = SunCalc.getMoonIllumination(now);
        const phaseAngle = moonIllum.angle; // 0 to 2π
        const fraction = moonIllum.fraction; // 0 to 1

        // Determine size based on fraction (full moon larger)
        let sizeClass = 'size-medium';
        if (fraction < 0.3) sizeClass = 'size-small';
        else if (fraction > 0.7) sizeClass = 'size-large';

        // Rotation for shadow: phaseAngle maps to rotation (degrees)
        // The shadow clip-path uses rotation to simulate phase
        const rotationDeg = (phaseAngle * 180 / Math.PI) % 360;

        astroDisplay.innerHTML = `
            <div class="moon ${sizeClass}" id="moonShape" style="--rotation: ${rotationDeg}deg;"></div>
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

updateDhakaTime();
setInterval(updateDhakaTime, 1000);

// ==========================================
//  DURATION CALCULATOR (from data.js)
// ==========================================
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(); // today if ongoing

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

    let parts = [];
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
    if (days > 0 && years === 0 && months === 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

    if (parts.length === 0) return 'Less than a day';

    // If ongoing, add "+" sign
    if (!endDate) {
        return parts.join(' ') + '+';
    }
    return parts.join(' ');
}

// ==========================================
//  RENDER EXPERIENCES + CERTIFICATIONS
// ==========================================
function renderExperiences() {
    const expContainer = document.getElementById('experienceContainer');
    const certContainer = document.getElementById('certificationsContainer');
    if (!expContainer || typeof experiences === 'undefined') return;

    // Split data: exclude certifications from main timeline
    const mainExperiences = experiences.filter(exp => exp.id !== 'certifications');
    const certExperience = experiences.find(exp => exp.id === 'certifications');

    // --- Render main experiences (timeline) ---
    // Sort by start date (newest first)
    const sorted = [...mainExperiences].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    let expHtml = '';
    sorted.forEach(exp => {
        const duration = calculateDuration(exp.startDate, exp.endDate);
        const isOngoing = !exp.endDate;
        const dateLabel = isOngoing ? `${exp.startDate} – Present` : `${exp.startDate} – ${exp.endDate}`;

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
                            ${exp.certButtons.map(btn => `
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

    // --- Render certifications (card style) ---
    if (certContainer) {
        if (certExperience) {
            const cert = certExperience;
            // Build button HTML
            let buttonsHtml = '';
            if (cert.certButtons && cert.certButtons.length) {
                buttonsHtml = `
                    <div class="cert-buttons">
                        ${cert.certButtons.map(btn => `
                            <a href="${btn.url}" target="_blank" class="btn-outline">
                                ${btn.icon ? `<i class="${btn.icon}"></i>` : ''}
                                ${btn.img ? `<img src="${btn.img}" class="official-icon" alt="${btn.label}" />` : ''}
                                ${btn.label}
                            </a>
                        `).join('')}
                    </div>
                `;
            }

            const certHtml = `
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
            certContainer.innerHTML = certHtml;
        } else {
            certContainer.innerHTML = '<p class="text-muted">No certifications yet.</p>';
        }
    }
}

// ==========================================
//  RENDER SKILLS (from data.js)
// ==========================================
function renderSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container || typeof skills === 'undefined') return;

    const categoryMap = {
        cyber: { icon: 'fa-user-secret', title: 'Cybersecurity' },
        web: { icon: 'fa-html5', title: 'Web Dev & Programming' },
        networking: { icon: 'fa-cloud-arrow-up', title: 'Networking & Web Tech' },
        professional: { icon: 'fa-briefcase', title: 'Professional Skills & Tools' }
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
                        ${skillList.map(skill => `
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

// ==========================================
//  COLLAPSIBLE SKILLS (updated for dynamic)
// ==========================================
function initCollapsibleSkills() {
    document.querySelectorAll('.skill-category[data-collapsible]').forEach((category) => {
        const skillsList = category.querySelector('.skills-list');
        const overlay = category.querySelector('.fade-overlay');
        const wrapper = category.querySelector('.skills-list-wrapper');
        if (!skillsList || !overlay || !wrapper) return;

        // Remove existing show-less button if any
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

        // Remove old event listeners by cloning and replacing
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

// ==========================================
//  DISCORD COPY
// ==========================================
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
initDiscordCopy();

// ==========================================
//  HAMBURGER
// ==========================================
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
initHamburger();

// ==========================================
//  ACADEMIC DETAILS (unchanged)
// ==========================================
function initAcademicDetails() {
    document.querySelectorAll('.btn-toggle-details').forEach((btn) => {
        btn.addEventListener('click', function(e) {
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
initAcademicDetails();

// ==========================================
//  SCROLL TO CERTIFICATIONS (clickable text)
// ==========================================
function initScrollToCert() {
    const trigger = document.getElementById('scrollToCertTrigger');
    const target = document.getElementById('certificationsSection');
    if (!trigger || !target) return;

    trigger.addEventListener('click', function(e) {
        e.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    });
}
initScrollToCert();

// ==========================================
//  SCROLL HEADER
// ==========================================
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

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
initScrollHeader();

// ==========================================
//  CONSOLE
// ==========================================
console.log(
    '%c✦ Md. Irtija Azad Talha · Forest Green %cExecutive Portfolio',
    'background:#1f2421;color:#9cc5a1;padding:6px 14px;border-radius:4px 0 0 4px;font-weight:700;letter-spacing:0.5px;',
    'background:#9cc5a1;color:#1f2421;padding:6px 14px;border-radius:0 4px 4px 0;font-weight:600;'
);
console.log('%c🌿 Dynamic data from data.js loaded · SunCalc active', 'color:#216869;font-weight:500;');
