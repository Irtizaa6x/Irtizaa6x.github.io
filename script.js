// Navigation
const navItems = document.querySelectorAll('.nav-item');
const mainContent = document.getElementById('mainContent');
const pages = {
  home: document.getElementById('home-page'),
  education: document.getElementById('education-page'),
  skills: document.getElementById('skills-page'),
  experience: document.getElementById('experience-page'),
  contact: document.getElementById('contact-page')
};

function switchPage(pageId) {
  Object.values(pages).forEach(p => p && p.classList.remove('active-page'));
  if (pages[pageId]) pages[pageId].classList.add('active-page');
  navItems.forEach(btn => {
    const val = btn.getAttribute('data-page');
    if (val === pageId) btn.classList.add('active');
    else btn.classList.remove('active');
  });
  
  if (mainContent) {
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

navItems.forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.getAttribute('data-page');
    if (page && pages[page]) switchPage(page);
  });
});

const activeNav = document.querySelector('.nav-item.active');
if (activeNav) switchPage(activeNav.getAttribute('data-page'));
else switchPage('home');

// Live Dhaka Time
function updateDhakaTime() {
  const now = new Date();
  const options = { timeZone: 'Asia/Dhaka', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
  const timeElem = document.getElementById('dhaka-time');
  if (timeElem) timeElem.textContent = timeStr;
}
updateDhakaTime();
setInterval(updateDhakaTime, 1000);

// Collapsible skills – click on the fade overlay to expand/collapse
document.querySelectorAll('.skill-category[data-collapsible]').forEach(category => {
  const wrapper = category.querySelector('.skills-list-wrapper');
  const skillsList = category.querySelector('.skills-list');
  const overlay = category.querySelector('.fade-overlay');
  
  if (!skillsList || !overlay) return;
  
  // Expand on overlay click
  overlay.addEventListener('click', (e) => {
    e.stopPropagation();
    // Expand: remove fade class and add expanded class
    skillsList.classList.remove('fade-gradient');
    category.classList.add('expanded');
  });
  
  // Collapse when clicking on the expanded area? We'll use a second click on a "show less" indicator.
  // To keep it clean, we add a "Show less" button inside the overlay when expanded.
  // But simpler: when expanded, clicking again on the whole category will collapse.
  // However, we need a clear "show less" signal. Let's add a small "⋯ less" text that appears after expansion.
  
  // After expansion, we'll insert a "show less" link inside the skill-category.
  // We'll use a mutation observer or simply add the element on expansion.
  // For simplicity, we'll listen for click on the expanded category and collapse if the click target is the "show less" area.
  
  // Create a "show less" element but hide it initially
  const showLess = document.createElement('div');
  showLess.className = 'show-less-btn-inline';
  showLess.innerHTML = '<i class="fas fa-chevron-up"></i> Show less';
  showLess.style.cssText = 'display: none; text-align: center; margin-top: 0.8rem; cursor: pointer; font-size: 0.75rem; color: #2c5a9e; background: #eef2ff; width: fit-content; padding: 0.2rem 0.8rem; border-radius: 20px; margin-left: auto; margin-right: auto;';
  wrapper.appendChild(showLess);
  
  showLess.addEventListener('click', (e) => {
    e.stopPropagation();
    skillsList.classList.add('fade-gradient');
    category.classList.remove('expanded');
    showLess.style.display = 'none';
  });
  
  // Override the expand to also show the "show less" button
  const originalExpand = overlay.click;
  overlay.addEventListener('click', () => {
    skillsList.classList.remove('fade-gradient');
    category.classList.add('expanded');
    showLess.style.display = 'block';
  });
  
  // Also, if the category is expanded and user clicks on the overlay again (which is hidden), we don't want conflict.
  // The 'show less' button handles collapsing.
});

// Discord copy
const discordBtn = document.querySelector('.discord-copy');
if (discordBtn) {
  const originalHTML = discordBtn.innerHTML;
  discordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('naz.irt.k6');
    discordBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
      discordBtn.innerHTML = originalHTML;
    }, 1800);
  });
}

// Hamburger toggle
const toggleBtn = document.getElementById('hamburgerToggle');
const sidebar = document.getElementById('sidebar');

if (toggleBtn && sidebar) {
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768 && sidebar.classList.contains('open') && 
        !sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
      sidebar.classList.remove('open');
    }
  });
}

console.log("Portfolio ready — Irtija Talha Cybersecurity (fade‑out expand on click)");