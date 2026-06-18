// ==========================================
//  NAVIGATION
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
//  CORE SWITCH PAGE FUNCTION (FIXED)
// ==========================================
function switchPage(pageId) {
  // Hide all pages
  Object.values(pages).forEach((p) => p && p.classList.remove('active-page'));
  // Show the selected page
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

  // ✅ UPDATE THE LARGE NAV ICON WITH ANIMATION
  updateActiveIcon(pageId);

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

// ==========================================
//  UPDATE LARGE NAV ICON WITH ANIMATION
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
  
  // Update ALL clocks on the page (using class)
  document.querySelectorAll('.dhaka-time').forEach(el => {
    el.textContent = timeStr;
  });
}
updateDhakaTime();
setInterval(updateDhakaTime, 1000);

// ==========================================
//  COLLAPSIBLE SKILLS (fade overlay)
// ==========================================
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

// ==========================================
//  DISCORD COPY
// ==========================================
const discordBtn = document.querySelector('.discord-copy');
if (discordBtn) {
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

// ==========================================
//  HAMBURGER TOGGLE (mobile)
// ==========================================
const toggleBtn = document.getElementById('hamburgerToggle');
const sidebar = document.getElementById('sidebar');

if (toggleBtn && sidebar) {
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
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
    }
  });
}

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

      this.classList.toggle('open');
      detailsContainer.classList.toggle('open');
    });
  });
}

initAcademicDetails();

// ==========================================
//  CONSOLE SIGNATURE
// ==========================================
console.log('Portfolio ready — Irtija Talha Cybersecurity (fade‑out expand on click)');
