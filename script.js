// ==========================================
//  MD. IRTIJA AZAD TALHA – EXECUTIVE PORTFOLIO
//  Forest Green Edition · Solid Sidebar
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
    const activeNavBtn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (!activeNavBtn) return;
    const newIconHtml = activeNavBtn.querySelector('i').outerHTML;
    const displayContainer = document.getElementById('activeNavIcon');
    if (!displayContainer) return;

    const currentIcon = displayContainer.querySelector('i');
    if (!currentIcon) {
        displayContainer.innerHTML = newIconHtml;
        return;
    }

    currentIcon.classList.remove('anim-in');
    currentIcon.classList.add('anim-out');

    setTimeout(() => {
        displayContainer.innerHTML = newIconHtml;
        const newIcon = displayContainer.querySelector('i');
        newIcon.classList.remove('anim-out');
        requestAnimationFrame(() => {
            newIcon.classList.add('anim-in');
        });
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
//  LIVE DHAKA TIME + SUN/MOON EFFECT
// ==========================================
function updateTimeOfDay() {
    const now = new Date();
    const hours = now.getHours();
    const wrapper = document.getElementById('localTimeWrapper');
    const iconWrapper = document.getElementById('timeIconWrapper');
    if (!wrapper || !iconWrapper) return;

    const isDay = hours >= 6 && hours < 18;

    iconWrapper.className = 'time-icon-wrapper';
    if (isDay) {
        iconWrapper.classList.add('day-icon');
        iconWrapper.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        iconWrapper.classList.add('night-icon');
        iconWrapper.innerHTML = '<i class="fas fa-moon"></i>';
    }

    wrapper.classList.remove('day', 'night');
    wrapper.classList.add(isDay ? 'day' : 'night');
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
//  COLLAPSIBLE SKILLS
// ==========================================
function initCollapsibleSkills() {
    document.querySelectorAll('.skill-category[data-collapsible]').forEach((category) => {
        const skillsList = category.querySelector('.skills-list');
        const overlay = category.querySelector('.fade-overlay');
        const wrapper = category.querySelector('.skills-list-wrapper');
        if (!skillsList || !overlay || !wrapper) return;

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

        overlay.addEventListener('click', (e) => {
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
initCollapsibleSkills();

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
//  ACADEMIC DETAILS
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
console.log('%c🌿 Icon clarity: Sidebar Big=Seaweed · Inside=Stormy · Small=Seaweed', 'color:#216869;font-weight:500;');
