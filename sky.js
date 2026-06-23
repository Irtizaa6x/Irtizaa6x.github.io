// ==========================================
//  COMPACT SKY · FULL WRAPPER BACKGROUND
//  Real-time Dhaka sky behind the time card
//  With ResizeObserver to handle hidden wrapper
// ==========================================

(function() {
  'use strict';

  console.log('🌤️ sky.js loaded – Dhaka sky active');

  const DHAKA_LAT = 23.8103;
  const DHAKA_LON = 90.4125;

  const canvas = document.getElementById('skyCanvas');
  if (!canvas) {
    console.error('❌ Canvas #skyCanvas not found!');
    return;
  }

  const ctx = canvas.getContext('2d');
  let width = 0, height = 0;

  // --- Resize function: sets canvas size from parent ---
  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (width === 0 || height === 0) {
      // Still hidden – we'll retry when ResizeObserver fires
      return;
    }
    canvas.width = width;
    canvas.height = height;
    // Force a redraw immediately after resize
    const now = new Date();
    drawSky(now);
  }

  // --- Use ResizeObserver to catch when wrapper gets size ---
  const observer = new ResizeObserver(() => {
    resize();
  });
  observer.observe(canvas.parentElement);

  // --- Also observe the contact page visibility (class change) ---
  // We can listen for when the contact page gets 'active-page' class
  const contactPage = document.getElementById('contact-page');
  if (contactPage) {
    const mutationObserver = new MutationObserver(() => {
      if (contactPage.classList.contains('active-page')) {
        // Page became visible – resize and redraw
        setTimeout(resize, 50); // small delay to let layout settle
      }
    });
    mutationObserver.observe(contactPage, { attributes: true, attributeFilter: ['class'] });
  }

  // --- Fallback: try to resize every second until we get size (for safety) ---
  let retryCount = 0;
  const retryInterval = setInterval(() => {
    if (width > 0 && height > 0) {
      clearInterval(retryInterval);
      return;
    }
    resize();
    retryCount++;
    if (retryCount > 10) clearInterval(retryInterval); // stop after 10 tries
  }, 1000);

  // --- Update digital clock ---
  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Dhaka',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
    document.querySelectorAll('.dhaka-time').forEach(el => el.textContent = timeStr);
  }

  // --- Draw the sky ---
  function drawSky(now) {
    if (width === 0 || height === 0) return;

    const w = width;
    const h = height;

    ctx.clearRect(0, 0, w, h);

    // Sun position
    const sunPos = SunCalc.getPosition(now, DHAKA_LAT, DHAKA_LON);
    const alt = sunPos.altitude;
    const az = sunPos.azimuth;

    // Sky gradient
    let topColor, bottomColor;
    if (alt < -0.2) {
      const moonIllum = SunCalc.getMoonIllumination(now);
      const bright = moonIllum.fraction * 0.2;
      topColor = `rgb(${6 + bright*20}, ${12 + bright*15}, ${30 + bright*25})`;
      bottomColor = `rgb(${10 + bright*15}, ${20 + bright*10}, ${40 + bright*20})`;
    } else if (alt < 0.1) {
      const t = (alt + 0.2) / 0.3;
      const r = 200 + t*55, g = 120 + t*70, b = 60 + t*60;
      topColor = `rgb(${r*0.6}, ${g*0.5}, ${b*0.4})`;
      bottomColor = `rgb(${r*1.2}, ${g*1.1}, ${b*0.8})`;
    } else {
      const t = Math.min(1, (alt - 0.1) / 1.4);
      const r = 50 + t*80, g = 130 + t*90, b = 200 + t*40;
      topColor = `rgb(${r*0.8}, ${g*0.7}, ${b*0.9})`;
      bottomColor = `rgb(${r*1.1}, ${g*1.0}, ${b*0.7})`;
    }

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, bottomColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Sun
    if (alt > -0.3) {
      let x = ((az / (2 * Math.PI)) * w) % w;
      if (x < 0) x += w;
      const y = h * (1 - Math.max(0, Math.min(1, (alt + 0.3) / 1.8)));
      const radius = Math.min(w, h) * 0.12;

      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5);
      glow.addColorStop(0, alt > 0.1 ? 'rgba(255,200,50,0.5)' : 'rgba(255,150,80,0.5)');
      glow.addColorStop(1, 'rgba(255,150,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = 'rgba(255,200,100,0.3)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = alt > 0.1 ? '#fdd835' : '#f9a825';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Moon
    if (alt < 0.2) {
      const moonPos = SunCalc.getMoonPosition(now, DHAKA_LAT, DHAKA_LON);
      const mAlt = moonPos.altitude;
      if (mAlt > -0.3) {
        let x = ((moonPos.azimuth / (2 * Math.PI)) * w) % w;
        if (x < 0) x += w;
        const y = h * (1 - Math.max(0, Math.min(1, (mAlt + 0.3) / 1.5)));
        const radius = Math.min(w, h) * 0.10;

        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        glow.addColorStop(0, 'rgba(220,235,255,0.2)');
        glow.addColorStop(1, 'rgba(220,235,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = 'rgba(200,220,255,0.2)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e0e8f0';
        ctx.fill();

        // Moon phase
        const ill = SunCalc.getMoonIllumination(now);
        const phase = ill.phase;
        const shadowOffset = (phase - 0.5) * 2 * radius;
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.beginPath();
        ctx.arc(shadowOffset, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1a2f3f';
        ctx.fill();
        ctx.restore();

        ctx.shadowBlur = 0;
      }
    }
  }

  // --- Animation loop ---
  function animate() {
    const now = new Date();
    drawSky(now);
    updateClock();
    requestAnimationFrame(animate);
  }

  // Initial resize (may be 0 if hidden)
  resize();

  // Start the loop
  animate();

  // Also resize on window resize (already had)
  window.addEventListener('resize', resize);

})();
