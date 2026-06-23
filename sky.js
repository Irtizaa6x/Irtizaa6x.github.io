// ==========================================
//  COMPACT SKY · for local-time wrapper
//  Real-time Dhaka sky on a small canvas
//  Uses SunCalc for sun/moon positions
// ==========================================

(function() {
  'use strict';

  // ----- Dhaka coordinates -----
  const DHAKA_LAT = 23.8103;
  const DHAKA_LON = 90.4125;

  // ----- Canvas setup -----
  const canvas = document.getElementById('skyCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  // ----- Update the digital clock (Dhaka time) -----
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

  // ----- Draw the sky on canvas -----
  function drawSky(now) {
    const w = width;
    const h = height;
    if (w === 0 || h === 0) return;

    ctx.clearRect(0, 0, w, h);

    // 1) Sun position (altitude, azimuth)
    const sunPos = SunCalc.getPosition(now, DHAKA_LAT, DHAKA_LON);
    const alt = sunPos.altitude;    // radians
    const az = sunPos.azimuth;      // radians

    // 2) Sky gradient – choose colours based on sun altitude
    let topColor, bottomColor;
    if (alt < -0.2) {
      // Night – deep blue with a hint of moonlight
      const moonIllum = SunCalc.getMoonIllumination(now);
      const bright = moonIllum.fraction * 0.2;
      topColor = `rgb(${6 + bright*20}, ${12 + bright*15}, ${30 + bright*25})`;
      bottomColor = `rgb(${10 + bright*15}, ${20 + bright*10}, ${40 + bright*20})`;
    } else if (alt < 0.1) {
      // Dawn / dusk – orange to purple
      const t = (alt + 0.2) / 0.3;
      const r = 200 + t*55, g = 120 + t*70, b = 60 + t*60;
      topColor = `rgb(${r*0.6}, ${g*0.5}, ${b*0.4})`;
      bottomColor = `rgb(${r*1.2}, ${g*1.1}, ${b*0.8})`;
    } else {
      // Day – bright blue sky
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

    // 3) Draw sun if above horizon (or slightly below)
    if (alt > -0.3) {
      // Map azimuth to x (0..w), altitude to y (horizon = bottom)
      let x = ((az / (2 * Math.PI)) * w) % w;
      // If x is negative (azimuth near 2π), wrap it
      if (x < 0) x += w;
      const y = h * (1 - Math.max(0, Math.min(1, (alt + 0.3) / 1.8)));

      const radius = Math.min(w, h) * 0.12;

      // Sun glow
      const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.5);
      glow.addColorStop(0, alt > 0.1 ? 'rgba(255,200,50,0.5)' : 'rgba(255,150,80,0.5)');
      glow.addColorStop(1, 'rgba(255,150,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Sun body
      ctx.shadowColor = 'rgba(255,200,100,0.3)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = alt > 0.1 ? '#fdd835' : '#f9a825';
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 4) Draw moon if the sun is below horizon (night)
    if (alt < 0) {
      const moonPos = SunCalc.getMoonPosition(now, DHAKA_LAT, DHAKA_LON);
      const mAlt = moonPos.altitude;
      if (mAlt > -0.5) {
        let x = ((moonPos.azimuth / (2 * Math.PI)) * w) % w;
        if (x < 0) x += w;
        const y = h * (1 - Math.max(0, Math.min(1, (mAlt + 0.5) / 1.5)));
        const radius = Math.min(w, h) * 0.1;

        // Moon glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        glow.addColorStop(0, 'rgba(220,235,255,0.15)');
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

        // Moon phase shadow (crescent / gibbous)
        const ill = SunCalc.getMoonIllumination(now);
        const phaseAngle = ill.angle;      // 0..2π
        const rotation = phaseAngle * 180 / Math.PI;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = '#1a2f3f';
        ctx.fillRect(0, -radius, radius * 2, radius * 2);
        ctx.restore();

        ctx.shadowBlur = 0;
      }
    }
  }

  // ----- Animation loop (60 fps) -----
  function animate() {
    const now = new Date();
    drawSky(now);
    updateClock();
    requestAnimationFrame(animate);
  }

  // Start
  animate();

  // Re-draw on resize (canvas size changes)
  window.addEventListener('resize', () => {
    resize();
  });

})();
