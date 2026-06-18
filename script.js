// ==========================================
//  MD. IRTIJA AZAD TALHA – PORTFOLIO
//  All rights reserved.
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
  // Hide all pages
  Object.values(pages).forEach((p) => p && p.classList.remove('active-page'));

  // Show selected page
  if (pages[pageId]) pages[pageId].classList.add('active-page');

  // Update active class on nav buttons
  navItems.forEach((btn) => {
    const val = btn.getAttribute('data-page');
    if (val === pageId) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Scroll to top smoothly
  if (mainContent) {
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update mobile header title
  updateHeaderTitle(pageId);

  // Update large sidebar icon with animation
  updateActiveIcon(pageId);

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburgerToggle');
    if (sidebar) sidebar.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
  }
}

// ==========================================
//  MOBILE HEADER TITLE
// ==========================================
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
//  LARGE SIDEBAR ICON (with animation)
// ==========================================
function updateActiveIcon(pageId) {
  const activeNavBtn = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (!activeNavBtn) return;

  const iconHtml = activeNavBtn.querySelector('i').outerHTML;
  const displayContainer = document.getElementById('activeNavIcon');
  if (!displayContainer) return;

  // Remove animation class to reset
  displayContainer.classList.remove('animating');

  // Force reflow to restart the animation properly
  void displayContainer.offsetWidth;

  // Update the icon
  displayContainer.innerHTML = iconHtml;

  // Add animation class to trigger the pop effect
  displayContainer.classList.add('animating');
}

// ==========================================
//  NAVIGATION EVENT LISTENERS
// ==========================================
navItems.forEach((btn) => {
  btn.addEventListener('click', () => {
    const page = btn.getAttribute('data-page');
    if (page && pages[page]) switchPage(page);
  });
});

// Set initial active page
const activeNav = document.querySelector('.nav-item.active');
if (activeNav) switchPage(activeNav.getAttribute('data-page'));
else switchPage('home');

// ==========================================
//  LIVE DHAKA TIME
// ==========================================
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

  // Update ALL clocks on the page
  document.querySelectorAll('.dhaka-time').forEach((el) => {
    el.textContent = timeStr;
  });
}

// Start the clock immediately and update every second
updateDhakaTime();
setInterval(updateDhakaTime, 1000);

// ==========================================
//  COLLAPSIBLE SKILLS (fade overlay)
// ==========================================
function initCollapsibleSkills() {
  document.querySelectorAll('.skill-category[data-collapsible]').forEach((category) => {
    const skillsList = category.querySelector('.skills-list');
    const overlay = category.querySelector('.fade-overlay');
    const wrapper = category.querySelector('.skills-list-wrapper');

    if (!skillsList || !overlay || !wrapper) return;

    // Create "Show less" button (hidden initially)
    const showLess = document.createElement('div');
    showLess.className = 'show-less-btn-inline';
    showLess.innerHTML = '<i class="fas fa-chevron-up"></i> Show less';
    Object.assign(showLess.style, {
      display: 'none',
      textAlign: 'center',
      marginTop: '0.8rem',
      cursor: 'pointer',
      fontSize: '0.75rem',
      color: '#2c5a9e',
      background: '#eef2ff',
      width: 'fit-content',
      padding: '0.2rem 0.8rem',
      borderRadius: '20px',
      marginLeft: 'auto',
      marginRight: 'auto',
    });
    wrapper.appendChild(showLess);

    // Expand: remove fade, add expanded, show "Show less"
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      skillsList.classList.remove('fade-gradient');
      category.classList.add('expanded');
      showLess.style.display = 'block';
    });

    // Collapse: add fade, remove expanded, hide "Show less"
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
//  DISCORD COPY (clipboard)
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
//  HAMBURGER TOGGLE (mobile header)
// ==========================================
function initHamburger() {
  const toggleBtn = document.getElementById('hamburgerToggle');
  const sidebar = document.getElementById('sidebar');

  if (!toggleBtn || !sidebar) return;

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    toggleBtn.classList.toggle('open');
  });

  // Close sidebar when clicking outside
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
//  EXPANDABLE ACADEMIC DETAILS
// ==========================================
function initAcademicDetails() {
  const toggleButtons = document.querySelectorAll('.btn-toggle-details');

  toggleButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('data-target');
      if (!targetId) return;

      const detailsContainer = document.getElementById(targetId);
      if (!detailsContainer) return;

      // Toggle button state (rotates chevron)
      this.classList.toggle('open');

      // Toggle details visibility
      detailsContainer.classList.toggle('open');
    });
  });
}

initAcademicDetails();

// ==========================================
//  SCROLL – HIDE / SHOW MOBILE HEADER
// ==========================================
function initScrollHeader() {
  const header = document.getElementById('mobileHeader');
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function handleScroll() {
    // Only run on mobile
    if (window.innerWidth > 768) {
      header.classList.remove('hidden');
      return;
    }

    const currentScrollY = window.scrollY;

    // Only hide if scrolled past 60px to avoid hiding at the very top
    if (currentScrollY > lastScrollY && currentScrollY > 60) {
      // Scrolling down – hide header
      header.classList.add('hidden');
    } else {
      // Scrolling up – show header
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

initScrollHeader();

// ==========================================
//  CONSOLE SIGNATURE (professional touch)
// ==========================================
console.log(
  '%c🚀 Md. Irtija Azad Talha – Portfolio %cBuilt with ❤️ and precision.',
  'background:#2c5a9e;color:#fff;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:bold;',
  'background:#f1f5fe;color:#1a2b4a;padding:4px 8px;border-radius:0 4px 4px 0;'
);
