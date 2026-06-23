// ==========================================
//  SKY DASHBOARD · Real-time Dhaka Sky
//  Pure HTML/CSS/JS · Canvas + SunCalc
//  Apple Weather + Nothing OS + Linear vibe
// ==========================================

(function () {
  'use strict';

  // ----- DHaka Coordinates (for SunCalc) -----
  const DHAKA_LAT = 23.8103;
  const DHAKA_LON = 90.4125;

  // ----- DOM refs (set after init) -----
  let canvas, ctx;
  let wrapper, liveBadgeTime, conditionLabel, infoCards;

  // ----- State -----
  const state = {
    now: new Date(),
    weather: 'clear',      // 'clear' | 'cloudy' | 'rain' | 'storm' | 'fog'
    rainDrops: [],
    clouds: [],
    stars: [],
    shootingStars: [],
    lightningFlash: 0,
    fogOpacity: 0,
    // We'll fill data values
    data: {
      temperature: 28,
      feelsLike: 30,
      humidity: 65,
      windSpeed: 12,
      uvIndex: 5,
      visibility: 10,
      pressure: 1012,
      aqi: 45,
      sunrise: '--:--',
      sunset: '--:--',
      solarNoon: '--:--',
      dayLength: '--h --m',
      moonPhase: '--',
      moonrise: '--:--',
      moonset: '--:--',
      moonIllumination: 0,
    },
    // For smooth transitions
    targetWeather: 'clear',
    weatherTransition: 0, // 0..1
  };

  // ----- Canvas dimensions (updated on resize) -----
  let canvasWidth = 0;
  let canvasHeight = 0;

  // ==========================================
  //  INITIALIZATION
  // ==========================================
  function init() {
    // Find the dashboard container (inserted in HTML)
    const dashboard = document.querySelector('.sky-dashboard');
    if (!dashboard) {
      console.warn('SkyDashboard: .sky-dashboard not found.');
      return;
    }

    // Get canvas and wrapper
    canvas = dashboard.querySelector('canvas');
    if (!canvas) {
      console.warn('SkyDashboard: canvas not found inside .sky-dashboard');
      return;
    }
    ctx = canvas.getContext('2d');

    wrapper = canvas.parentElement; // .sky-canvas-wrapper
    liveBadgeTime = dashboard.querySelector('.badge-time');
    conditionLabel = dashboard.querySelector('.sky-condition-label i'); // we'll update its icon

    // Collect all data cards
    infoCards = dashboard.querySelectorAll('.sky-info-card');

    // Generate stars (fixed positions)
    generateStars();

    // Generate initial clouds
    generateClouds();

    // Generate rain drops (reused)
    generateRainDrops(200);

    // Set initial weather
    setWeather('clear');

    // Resize canvas
    resizeCanvas();

    // Start animation loop
    requestAnimationFrame(update);

    // Resize listener
    window.addEventListener('resize', resizeCanvas);

    // Optional: toggle weather with click on sky (for demo)
    canvas.addEventListener('click', cycleWeather);

    console.log('🌿 SkyDashboard initialized for Dhaka');
  }

  // ==========================================
  //  RESIZE
  // ==========================================
  function resizeCanvas() {
    if (!canvas || !wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvasWidth = rect.width;
    canvasHeight = rect.height;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = canvasWidth + 'px';
    canvas.style.height = canvasHeight + 'px';
    ctx.scale(dpr, dpr);
  }

  // ==========================================
  //  GENERATE STARS (fixed)
  // ==========================================
  function generateStars() {
    const count = 300;
    state.stars = [];
    for (let i = 0; i < count; i++) {
      state.stars.push({
        x: Math.random(),
        y: Math.random() * 0.8, // avoid bottom horizon
        radius: 0.5 + Math.random() * 1.5,
        twinkleSpeed: 0.5 + Math.random() * 2,
        twinkleOffset: Math.random() * 100,
      });
    }
  }

  // ==========================================
  //  GENERATE CLOUDS
  // ==========================================
  function generateClouds() {
    const count = 6;
    state.clouds = [];
    for (let i = 0; i < count; i++) {
      state.clouds.push({
        x: Math.random(),
        y: 0.1 + Math.random() * 0.6,
        w: 0.08 + Math.random() * 0.2,
        h: 0.03 + Math.random() * 0.06,
        speed: 0.0002 + Math.random() * 0.0006,
        opacity: 0.4 + Math.random() * 0.4,
      });
    }
  }

  // ==========================================
  //  GENERATE RAIN DROPS
  // ==========================================
  function generateRainDrops(count) {
    state.rainDrops = [];
    for (let i = 0; i < count; i++) {
      state.rainDrops.push({
        x: Math.random(),
        y: Math.random(),
        length: 0.01 + Math.random() * 0.03,
        speed: 0.01 + Math.random() * 0.02,
        opacity: 0.2 + Math.random() * 0.3,
      });
    }
  }

  // ==========================================
  //  WEATHER CONTROL
  // ==========================================
  function setWeather(type) {
    state.weather = type;
    // Update condition label icon
    const icons = {
      clear: 'fa-sun',
      cloudy: 'fa-cloud',
      rain: 'fa-cloud-rain',
      storm: 'fa-bolt',
      fog: 'fa-smog',
    };
    const iconElem = document.querySelector('.sky-condition-label i');
    if (iconElem) {
      iconElem.className = 'fas ' + (icons[type] || 'fa-sun');
    }
    // Update label text (optional)
    const labelText = document.querySelector('.sky-condition-label .label-text');
    if (labelText) {
      const names = {
        clear: 'Clear',
        cloudy: 'Cloudy',
        rain: 'Rain',
        storm: 'Storm',
        fog: 'Fog',
      };
      labelText.textContent = names[type] || 'Clear';
    }

    // Toggle CSS overlays for fog/rain (we use canvas for most, but we can also use overlays)
    const rainOverlay = document.querySelector('.sky-rain-overlay');
    const fogOverlay = document.querySelector('.sky-fog-overlay');
    if (rainOverlay) {
      rainOverlay.classList.toggle('active', type === 'rain' || type === 'storm');
    }
    if (fogOverlay) {
      fogOverlay.classList.toggle('active', type === 'fog');
    }
  }

  function cycleWeather() {
    const types = ['clear', 'cloudy', 'rain', 'storm', 'fog'];
    const idx = types.indexOf(state.weather);
    const next = (idx + 1) % types.length;
    setWeather(types[next]);
  }

  // ==========================================
  //  UPDATE LOOP
  // ==========================================
  let lastTime = 0;
  let frameCount = 0;

  function update(timestamp) {
    const now = new Date();
    state.now = now;

    // Update live badge time
    if (liveBadgeTime) {
      const timeStr = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      liveBadgeTime.textContent = timeStr;
    }

    // Update data grid every second (or so)
    if (frameCount % 60 === 0) {
      updateData(now);
    }

    // Draw the sky
    drawSky(now);

    // Update weather effects (rain, lightning)
    updateWeatherEffects(now);

    // Draw weather effects on canvas (rain, lightning, fog handled via overlays)
    drawWeatherEffects(ctx, now);

    // Update shooting stars (rare)
    if (frameCount % 300 === 0 && state.weather !== 'storm') {
      if (Math.random() < 0.3) {
        spawnShootingStar();
      }
    }

    // Move clouds
    moveClouds();

    frameCount++;
    requestAnimationFrame(update);
  }

  // ==========================================
  //  UPDATE DATA GRID
  // ==========================================
  function updateData(now) {
    // Use SunCalc for sun/moon times
    const sunTimes = SunCalc.getTimes(now, DHAKA_LAT, DHAKA_LON);
    const moonTimes = SunCalc.getMoonTimes(now, DHAKA_LAT, DHAKA_LON);
    const moonIllum = SunCalc.getMoonIllumination(now);

    const sunrise = sunTimes.sunrise;
    const sunset = sunTimes.sunset;
    const solarNoon = sunTimes.solarNoon;

    // Format times
    const fmtTime = (d) => d ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--';
    const fmtDuration = (ms) => {
      const h = Math.floor(ms / (3600 * 1000));
      const m = Math.floor((ms % (3600 * 1000)) / (60 * 1000));
      return h + 'h ' + m + 'm';
    };

    // Day length
    const dayLen = sunset && sunrise ? sunset - sunrise : 0;

    // Temperature varies with time and weather
    let tempBase = 28;
    const hour = now.getHours();
    if (hour < 6) tempBase = 22;
    else if (hour < 10) tempBase = 25 + (hour - 6) * 0.8;
    else if (hour < 14) tempBase = 32;
    else if (hour < 18) tempBase = 30 - (hour - 14) * 0.6;
    else tempBase = 26 - (hour - 18) * 0.5;

    // Weather offsets
    const weatherOffset = { clear: 0, cloudy: -2, rain: -4, storm: -6, fog: -1 };
    const offset = weatherOffset[state.weather] || 0;
    const temperature = Math.round(tempBase + offset);
    const feelsLike = Math.round(temperature + (state.weather === 'clear' ? 2 : 0));

    // Humidity
    let humidity = 65;
    if (state.weather === 'rain' || state.weather === 'storm') humidity = 88;
    else if (state.weather === 'fog') humidity = 92;
    else if (state.weather === 'cloudy') humidity = 75;
    else humidity = 60 + Math.random() * 10;

    // Wind speed (km/h)
    let wind = 12;
    if (state.weather === 'storm') wind = 45 + Math.random() * 20;
    else if (state.weather === 'rain') wind = 25 + Math.random() * 10;
    else wind = 8 + Math.random() * 12;

    // UV index (daytime only)
    let uv = 0;
    if (sunrise && sunset && now > sunrise && now < sunset) {
      const frac = (now - sunrise) / (sunset - sunrise);
      uv = Math.round(5 * Math.sin(frac * Math.PI) * (state.weather === 'clear' ? 1 : 0.3));
    }

    // Visibility (km)
    let vis = 10;
    if (state.weather === 'fog') vis = 1 + Math.random() * 2;
    else if (state.weather === 'rain') vis = 4 + Math.random() * 3;
    else vis = 10 + Math.random() * 5;

    // Pressure (hPa)
    const pressure = 1010 + Math.round(Math.sin(now.getHours() / 24 * 2 * Math.PI) * 5);

    // AQI (0-500)
    let aqi = 45;
    if (state.weather === 'fog') aqi = 120 + Math.random() * 30;
    else if (state.weather === 'clear') aqi = 40 + Math.random() * 20;
    else aqi = 60 + Math.random() * 40;

    // Moon phase
    const phase = moonIllum.phase; // 0..1
    let phaseName = 'New Moon';
    if (phase < 0.0625) phaseName = 'New Moon';
    else if (phase < 0.1875) phaseName = 'Waxing Crescent';
    else if (phase < 0.3125) phaseName = 'First Quarter';
    else if (phase < 0.4375) phaseName = 'Waxing Gibbous';
    else if (phase < 0.5625) phaseName = 'Full Moon';
    else if (phase < 0.6875) phaseName = 'Waning Gibbous';
    else if (phase < 0.8125) phaseName = 'Last Quarter';
    else if (phase < 0.9375) phaseName = 'Waning Crescent';
    else phaseName = 'New Moon';

    // Moonrise / Moonset
    const moonrise = moonTimes.rise;
    const moonset = moonTimes.set;

    // Update state.data
    const data = state.data;
    data.temperature = temperature;
    data.feelsLike = feelsLike;
    data.humidity = Math.round(humidity);
    data.windSpeed = Math.round(wind);
    data.uvIndex = uv;
    data.visibility = vis;
    data.pressure = pressure;
    data.aqi = aqi;
    data.sunrise = fmtTime(sunrise);
    data.sunset = fmtTime(sunset);
    data.solarNoon = fmtTime(solarNoon);
    data.dayLength = dayLen ? fmtDuration(dayLen) : '--h --m';
    data.moonPhase = phaseName;
    data.moonrise = fmtTime(moonrise);
    data.moonset = fmtTime(moonset);
    data.moonIllumination = Math.round(moonIllum.fraction * 100);

    // Update DOM cards
    updateInfoCards(data);
  }

  // ==========================================
  //  UPDATE INFO CARDS
  // ==========================================
  function updateInfoCards(data) {
    // Map each card by its data attribute or order
    // We'll use data-key on each card
    const cardMap = {};
    infoCards.forEach(card => {
      const key = card.getAttribute('data-key');
      if (key) cardMap[key] = card;
    });

    // Define keys and display format
    const fields = [
      { key: 'temperature', label: 'Temperature', value: data.temperature + '°C', sub: 'Feels ' + data.feelsLike + '°C' },
      { key: 'humidity', label: 'Humidity', value: data.humidity + '%', sub: '' },
      { key: 'wind', label: 'Wind Speed', value: data.windSpeed + ' km/h', sub: '' },
      { key: 'uv', label: 'UV Index', value: data.uvIndex, sub: '' },
      { key: 'visibility', label: 'Visibility', value: data.visibility + ' km', sub: '' },
      { key: 'pressure', label: 'Pressure', value: data.pressure + ' hPa', sub: '' },
      { key: 'aqi', label: 'Air Quality', value: data.aqi, sub: '' },
      { key: 'sunrise', label: 'Sunrise', value: data.sunrise, sub: '' },
      { key: 'sunset', label: 'Sunset', value: data.sunset, sub: '' },
      { key: 'solarNoon', label: 'Solar Noon', value: data.solarNoon, sub: '' },
      { key: 'dayLength', label: 'Day Length', value: data.dayLength, sub: '' },
      { key: 'moonPhase', label: 'Moon Phase', value: data.moonPhase, sub: data.moonIllumination + '%' },
      { key: 'moonrise', label: 'Moonrise', value: data.moonrise, sub: '' },
      { key: 'moonset', label: 'Moonset', value: data.moonset, sub: '' },
    ];

    fields.forEach(f => {
      const card = cardMap[f.key];
      if (!card) return;
      const labelEl = card.querySelector('.label');
      const valueEl = card.querySelector('.value');
      const subEl = card.querySelector('.sub');
      if (labelEl) labelEl.textContent = f.label;
      if (valueEl) {
        valueEl.textContent = f.value;
        // Add accent for AQI/UV if needed
        if (f.key === 'aqi') {
          const aqi = data.aqi;
          valueEl.className = 'value';
          if (aqi < 50) valueEl.classList.add('accent-good');
          else if (aqi < 100) valueEl.classList.add('accent-moderate');
          else valueEl.classList.add('accent-poor');
        } else if (f.key === 'uv') {
          const uv = data.uvIndex;
          valueEl.className = 'value';
          if (uv < 3) valueEl.classList.add('accent-good');
          else if (uv < 6) valueEl.classList.add('accent-moderate');
          else valueEl.classList.add('accent-poor');
        } else {
          valueEl.className = 'value';
        }
      }
      if (subEl) subEl.textContent = f.sub;
    });
  }

  // ==========================================
  //  DRAW SKY (canvas)
  // ==========================================
  function drawSky(now) {
    const w = canvasWidth;
    const h = canvasHeight;
    if (w === 0 || h === 0) return;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // ----- 1. Sky gradient based on sun altitude -----
    const sunPos = SunCalc.getPosition(now, DHAKA_LAT, DHAKA_LON);
    const altitude = sunPos.altitude; // radians, -∞ to +∞, but usually -1.5 to 1.5
    const azimuth = sunPos.azimuth; // radians 0..2π

    // Normalize altitude to 0..1 (0 = horizon, 1 = zenith)
    const altNorm = Math.max(0, Math.min(1, (altitude + 0.1) / 1.5));

    // Determine time of day based on altitude and hour
    const hours = now.getHours();
    let skyColors;

    if (altitude < -0.2) {
      // Night
      const moonIllum = SunCalc.getMoonIllumination(now);
      const moonBright = moonIllum.fraction * 0.3;
      skyColors = {
        top: `rgb(${6 + moonBright * 20}, ${12 + moonBright * 15}, ${30 + moonBright * 25})`,
        bottom: `rgb(${10 + moonBright * 15}, ${20 + moonBright * 10}, ${40 + moonBright * 20})`,
      };
    } else if (altitude < 0.1) {
      // Dawn/dusk (sun near horizon)
      const t = (altitude + 0.2) / 0.3; // 0..1
      const r = 200 + t * 55;
      const g = 120 + t * 70;
      const b = 60 + t * 60;
      skyColors = {
        top: `rgb(${r * 0.6}, ${g * 0.5}, ${b * 0.4})`,
        bottom: `rgb(${r * 1.2}, ${g * 1.1}, ${b * 0.8})`,
      };
    } else {
      // Day
      const t = Math.min(1, (altitude - 0.1) / 1.4);
      const r = 50 + t * 80;
      const g = 130 + t * 90;
      const b = 200 + t * 40;
      skyColors = {
        top: `rgb(${r * 0.8}, ${g * 0.7}, ${b * 0.9})`,
        bottom: `rgb(${r * 1.1}, ${g * 1.0}, ${b * 0.7})`,
      };
    }

    // Draw gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, skyColors.top);
    grad.addColorStop(1, skyColors.bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // ----- 2. Stars (night only) -----
    if (altitude < -0.1) {
      const starOpacity = Math.min(1, (-altitude - 0.1) * 2);
      state.stars.forEach(star => {
        const twinkle = 0.5 + 0.5 * Math.sin(now.getTime() / 1000 * star.twinkleSpeed + star.twinkleOffset);
        const alpha = starOpacity * twinkle * 0.8;
        ctx.beginPath();
        ctx.arc(star.x * w, star.y * h, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
        // Glow for bright stars
        if (star.radius > 1.2) {
          ctx.shadowColor = 'rgba(255,255,255,0.2)';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    }

    // ----- 3. Sun (if above horizon or near) -----
    if (altitude > -0.3) {
      // Map altitude to y (0=horizon, 1=top)
      const yPos = h * (1 - Math.max(0, Math.min(1, (altitude + 0.3) / 1.8)));
      // Map azimuth to x (0..2π to 0..w)
      let xPos = (azimuth / (2 * Math.PI)) * w;
      // Keep within canvas
      xPos = Math.max(0, Math.min(w, xPos));

      // Sun glow
      const radius = 30 + 20 * (1 - altNorm);
      const gradient = ctx.createRadialGradient(xPos, yPos, 0, xPos, yPos, radius * 2.5);
      if (altitude > 0.1) {
        gradient.addColorStop(0, 'rgba(255,200,50,0.8)');
        gradient.addColorStop(0.4, 'rgba(255,180,30,0.3)');
        gradient.addColorStop(1, 'rgba(255,150,0,0)');
      } else {
        // Dawn/dusk - more orange/red
        gradient.addColorStop(0, 'rgba(255,150,80,0.8)');
        gradient.addColorStop(0.4, 'rgba(255,100,40,0.3)');
        gradient.addColorStop(1, 'rgba(200,50,0,0)');
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(xPos, yPos, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Sun body
      ctx.shadowColor = 'rgba(255,200,100,0.3)';
      ctx.shadowBlur = 40;
      ctx.beginPath();
      ctx.arc(xPos, yPos, radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = altitude > 0.1 ? '#fdd835' : '#f9a825';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Light rays (optional) - simple radial lines
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + now.getTime() / 5000;
        const dx = Math.cos(angle) * radius * 1.2;
        const dy = Math.sin(angle) * radius * 1.2;
        ctx.beginPath();
        ctx.moveTo(xPos + dx * 0.8, yPos + dy * 0.8);
        ctx.lineTo(xPos + dx * 1.8, yPos + dy * 1.8);
        ctx.strokeStyle = 'rgba(255,200,100,0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // ----- 4. Moon (night only) -----
    if (altitude < 0) {
      const moonPos = SunCalc.getMoonPosition(now, DHAKA_LAT, DHAKA_LON);
      const moonAlt = moonPos.altitude;
      const moonAz = moonPos.azimuth;
      if (moonAlt > -0.5) {
        const yPos = h * (1 - Math.max(0, Math.min(1, (moonAlt + 0.5) / 1.5)));
        let xPos = (moonAz / (2 * Math.PI)) * w;
        xPos = Math.max(0, Math.min(w, xPos));

        const moonIllum = SunCalc.getMoonIllumination(now);
        const phase = moonIllum.phase; // 0..1

        // Moon glow
        const gradient = ctx.createRadialGradient(xPos, yPos, 0, xPos, yPos, 80);
        gradient.addColorStop(0, 'rgba(220,235,255,0.2)');
        gradient.addColorStop(1, 'rgba(220,235,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(xPos, yPos, 80, 0, Math.PI * 2);
        ctx.fill();

        // Moon body
        const moonRadius = 25;
        ctx.shadowColor = 'rgba(200,220,255,0.2)';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(xPos, yPos, moonRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#e0e8f0';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Phase shadow (crescent)
        // Rotate based on phase angle
        const phaseAngle = moonIllum.angle; // 0..2π
        const rotation = phaseAngle * 180 / Math.PI;
        ctx.save();
        ctx.translate(xPos, yPos);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.beginPath();
        // Clip to moon
        ctx.arc(0, 0, moonRadius, 0, Math.PI * 2);
        ctx.clip();
        // Draw dark half
        ctx.beginPath();
        ctx.rect(0, -moonRadius, moonRadius * 2, moonRadius * 2);
        ctx.fillStyle = '#1a2f3f';
        ctx.fill();
        ctx.restore();

        // Moon phase label (optional)
        // We'll skip text on canvas for clarity
      }
    }

    // ----- 5. Clouds (if not storm or fog, but we can always draw) -----
    if (state.weather !== 'storm' && state.weather !== 'fog') {
      state.clouds.forEach(cloud => {
        const cx = cloud.x * w;
        const cy = cloud.y * h;
        const cw = cloud.w * w;
        const ch = cloud.h * h;
        // Draw cloud as a series of overlapping ellipses
        ctx.shadowColor = 'rgba(0,0,0,0.02)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = `rgba(255,255,255,${cloud.opacity * (state.weather === 'cloudy' ? 1.2 : 0.6)})`;
        ctx.beginPath();
        ctx.ellipse(cx, cy, cw * 0.5, ch * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx - cw * 0.3, cy - ch * 0.2, cw * 0.4, ch * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + cw * 0.3, cy - ch * 0.1, cw * 0.4, ch * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // ----- 6. Rain (if rain or storm) -----
    if (state.weather === 'rain' || state.weather === 'storm') {
      const isStorm = state.weather === 'storm';
      state.rainDrops.forEach(drop => {
        const x = drop.x * w;
        const y = drop.y * h;
        const len = drop.length * h;
        const speed = drop.speed * (isStorm ? 1.8 : 1);
        // Update position (handled in updateWeatherEffects)
        // Draw drop as a line
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - len * 0.3, y + len);
        ctx.strokeStyle = `rgba(180,210,240,${drop.opacity * (isStorm ? 1.2 : 1)})`;
        ctx.lineWidth = isStorm ? 2 : 1;
        ctx.stroke();
      });
    }

    // ----- 7. Lightning flash (overlay) -----
    if (state.lightningFlash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${state.lightningFlash})`;
      ctx.fillRect(0, 0, w, h);
    }

    // ----- 8. Fog (overlay) -----
    if (state.weather === 'fog') {
      const fogGrad = ctx.createRadialGradient(w/2, h*0.8, 0, w/2, h*0.8, w);
      fogGrad.addColorStop(0, `rgba(200,210,215,${0.15 * state.fogOpacity})`);
      fogGrad.addColorStop(1, `rgba(200,210,215,${0.3 * state.fogOpacity})`);
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // ==========================================
  //  UPDATE WEATHER EFFECTS (rain, lightning)
  // ==========================================
  function updateWeatherEffects(now) {
    // Rain drops
    if (state.weather === 'rain' || state.weather === 'storm') {
      const speedMul = state.weather === 'storm' ? 2.0 : 1.0;
      state.rainDrops.forEach(drop => {
        drop.y += drop.speed * speedMul;
        if (drop.y > 1) {
          drop.y = -0.05;
          drop.x = Math.random();
        }
      });
    }

    // Lightning (storm only)
    if (state.weather === 'storm') {
      if (state.lightningFlash > 0) {
        state.lightningFlash *= 0.95;
        if (state.lightningFlash < 0.01) state.lightningFlash = 0;
      } else if (Math.random() < 0.001) {
        state.lightningFlash = 0.6 + Math.random() * 0.3;
        // Also trigger a flash on overlay
        const flashOverlay = document.querySelector('.sky-lightning-flash');
        if (flashOverlay) {
          flashOverlay.classList.remove('active');
          void flashOverlay.offsetWidth; // reflow
          flashOverlay.classList.add('active');
        }
      }
    }

    // Fog opacity
    if (state.weather === 'fog') {
      state.fogOpacity = Math.min(1, state.fogOpacity + 0.01);
    } else {
      state.fogOpacity = Math.max(0, state.fogOpacity - 0.01);
    }
  }

  // ==========================================
  //  MOVE CLOUDS
  // ==========================================
  function moveClouds() {
    state.clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > 1.2) cloud.x = -0.2;
    });
  }

  // ==========================================
  //  SHOOTING STAR
  // ==========================================
  function spawnShootingStar() {
    // Create a shooting star element (we'll add a div with CSS animation)
    const wrapperEl = document.querySelector('.sky-canvas-wrapper');
    if (!wrapperEl) return;
    const star = document.createElement('div');
    star.className = 'sky-shooting-star';
    // Random position (top half)
    const x = 10 + Math.random() * 60; // %
    const y = 5 + Math.random() * 30; // %
    star.style.left = x + '%';
    star.style.top = y + '%';
    // Random angle
    const angle = 30 + Math.random() * 30; // degrees
    star.style.setProperty('--angle', angle + 'deg');
    // Random duration
    const dur = 0.8 + Math.random() * 0.6;
    star.style.animationDuration = dur + 's';
    wrapperEl.appendChild(star);
    // Remove after animation ends
    setTimeout(() => {
      if (star.parentNode) star.parentNode.removeChild(star);
    }, dur * 1000 + 100);
  }

  // ==========================================
  //  START
  // ==========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
