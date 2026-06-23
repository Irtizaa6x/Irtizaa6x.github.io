// ==========================================
//  COMPACT SKY · FULL WRAPPER BACKGROUND
//  Real-time Dhaka sky behind the time card
// ==========================================

(function() {
  'use strict';

  const DHAKA_LAT = 23.8103;
  const DHAKA_LON = 90.4125;

  const canvas = document.getElementById('skyCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width;
    canvas.height = height;
    // No DPR scaling – we want pixel-perfect on the element size
  }

  resize();
  window.addEventListener('resize', resize);

  // ---- Update digital clock (outside canvas) ----
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

  // ---- Draw sky ----
  function drawSky(now) {
    const w = width;
    const h = height;
    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);

    // 1) Sun position
    const sunPos = SunCalc.getPosition(now, DHAKA_LAT, DHAKA_LON);
    const alt = sunPos.altitude;
    const az = sunPos.azimuth;

    // 2) Sky gradient
    let topColor, bottomColor;
    if (alt < -0.2) {
      // Night
      const moonIllum = SunCalc.getMoonIllumination(now);
      const bright = moonIllum.fraction * 0.2;
      topColor = `rgb(${6 + bright*20}, ${12 + bright*15}, ${30 + bright*25})`;
      bottomColor = `rgb(${10 + bright*15}, ${20 + bright*10}, ${40 + bright*20})`;
    } else if (alt < 0.1) {
      // Dawn/dusk
      const t = (alt + 0.2) / 0.3;
      const r = 200 + t*55, g = 120 + t*70, b = 60 + t*60;
      topColor = `rgb(${r*0.6}, ${g*0.5}, ${b*0.4})`;
      bottomColor = `rgb(${r*1.2}, ${g*1.1}, ${b*0.8})`;
    } else {
      // Day
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

    // 3) Sun (if above -0.3 rad)
    if (alt > -0.3) {
      let x = ((az / (2 * Math.PI)) * w) % w;
      if (x < 0) x += w;
      const y = h * (1 - Math.max(0, Math.min(1, (alt + 0.3) / 1.8)));
      const radius = Math.min(w, h) * 0.12;

      // Glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5);
      glow.addColorStop(0, alt > 0.1 ? 'rgba(255,200,50,0.5)' : 'rgba(255,150,80,0.5)');
      glow.addColorStop(1, 'rgba(255,150,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.shadowColor = 'rgba(255,200,100,0.3)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = alt > 0.1 ? '#fdd835' : '#f9a825';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 4) Moon – draw if sun is below horizon or very low
    // We allow moon even when sun is slightly above horizon (twilight)
    if (alt < 0.2) {
      const moonPos = SunCalc.getMoonPosition(now, DHAKA_LAT, DHAKA_LON);
      const mAlt = moonPos.altitude;
      // Show moon if it's above -0.3 rad (i.e. visible)
      if (mAlt > -0.3) {
        let x = ((moonPos.azimuth / (2 * Math.PI)) * w) % w;
        if (x < 0) x += w;
        const y = h * (1 - Math.max(0, Math.min(1, (mAlt + 0.3) / 1.5)));
        const radius = Math.min(w, h) * 0.10;

        // Glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        glow.addColorStop(0, 'rgba(220,235,255,0.2)');
        glow.addColorStop(1, 'rgba(220,235,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Moon body
        ctx.shadowColor = 'rgba(200,220,255,0.2)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#e0e8f0';
        ctx.fill();

        // ---- Improved moon phase ----
        const ill = SunCalc.getMoonIllumination(now);
        const phase = ill.phase;  // 0..1

        // Phase angle in radians (0 = new moon, 0.5 = full)
        // We'll use a simple clip: darken the right half based on phase
        const phaseAngle = ill.angle; // 0..2π
        // Rotate so that the shadow is on the correct side
        const rotation = phaseAngle * 180 / Math.PI;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);

        // Clip to moon circle
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();

        // Draw the dark side as a rectangle covering the right half
        // For phase 0..1, we shift the rectangle position
        // At phase=0 (new moon), shadow covers entire right half (0..1)
        // At phase=0.5 (full moon), shadow is zero
        // At phase=1 (new moon again), shadow covers entire right half
        // We'll use a simpler approach: draw a dark rect with width = radius * (1 - phase*2) adjusted
        // But easiest: use a radial gradient to simulate shadow.
        // However, the classic way: use a clipping path with a moving half-circle.
        // Let's do a clean method: draw a dark circle that is offset horizontally based on phase.

        // Simplify: draw a dark overlay with a horizontal offset
        const shadowOffset = (phase - 0.5) * 2 * radius; // -radius .. +radius
        ctx.beginPath();
        ctx.arc(shadowOffset, 0, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#1a2f3f';
        ctx.fill();

        ctx.restore();

        ctx.shadowBlur = 0;
      }
    }
  }

  // ---- Animation loop ----
  function animate() {
    const now = new Date();
    drawSky(now);
    updateClock();
    requestAnimationFrame(animate);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', resize);

})();
