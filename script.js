// Navigation
const navItems = document.querySelectorAll('.nav-item');
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

// Expand/collapse with "Show less"
const expandTriggers = document.querySelectorAll('.expand-trigger');

expandTriggers.forEach(trigger => {
  const originalHTML = trigger.innerHTML;
  const baseText = trigger.getAttribute('data-base-text') || trigger.innerText.replace('⋯', '').trim();
  const iconHTML = trigger.querySelector('i') ? trigger.querySelector('i').outerHTML : '';

  trigger.addEventListener('click', function(e) {
    if (e.target.classList && e.target.classList.contains('show-less-btn')) return;

    const parentList = this.closest('.skills-list');
    const extraDiv = parentList.querySelector('.extra-skills');
    if (!extraDiv) return;

    const isExpanded = !extraDiv.classList.contains('hidden');

    if (!isExpanded) {
      extraDiv.classList.remove('hidden');

      const newSpan = document.createElement('span');
      newSpan.className = 'expand-trigger expanded-trigger skill-tag';
      newSpan.style.display = 'inline-flex';
      newSpan.style.alignItems = 'center';
      newSpan.style.gap = '0.3rem';
      newSpan.style.padding = '0.3rem 0.9rem';
      newSpan.style.margin = '0.35rem 0.5rem 0.35rem 0';
      newSpan.innerHTML = `${iconHTML} ${baseText} <button class="show-less-btn">Show less</button>`;

      this.replaceWith(newSpan);

      const showLessBtn = newSpan.querySelector('.show-less-btn');
      showLessBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        extraDiv.classList.add('hidden');
        newSpan.replaceWith(trigger);
        trigger.innerHTML = originalHTML;
      });
    }
  });
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

console.log("Portfolio ready — Irtija Talha Cybersecurity");