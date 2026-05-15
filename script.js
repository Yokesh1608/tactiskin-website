/* ===== TACTISKIN – script.js ===== */

/* ---------- THEME TOGGLE ---------- */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const toggleIcon = themeToggle.querySelector('.toggle-icon');

function setTheme(dark) {
  html.setAttribute('data-theme', dark ? 'dark' : 'light');
  toggleIcon.innerHTML = dark 
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' 
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
}

const saved = localStorage.getItem('ts-theme');
if (saved === 'dark') setTheme(true);

themeToggle.addEventListener('click', () => {
  setTheme(html.getAttribute('data-theme') !== 'dark');
});

/* ---------- HAMBURGER ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ---------- NAVBAR SCROLL ---------- */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ---------- TEAM AVATAR COLORS ---------- */
document.querySelectorAll('.team-avatar').forEach(av => {
  const color = av.dataset.color || '#0EA5E9';
  av.style.background = `linear-gradient(135deg, ${color}, ${color}99)`;
  if (!av.querySelector('img')) {
    av.textContent = av.dataset.initials || '?';
  }
});

/* ---------- MESH CANVAS ANIMATION ---------- */
(function initMesh() {
  const canvas = document.getElementById('meshCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], frame;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createNodes(n) {
    nodes = [];
    for (let i = 0; i < n; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = html.getAttribute('data-theme') === 'dark';
    const lineColor = isDark ? '14,165,233' : '14,165,233';

    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(nodes[i].x, nodes[i].y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${lineColor},0.5)`;
      ctx.fill();
    }
    frame = requestAnimationFrame(draw);
  }

  resize();
  createNodes(55);
  draw();

  const ro = new ResizeObserver(() => { resize(); createNodes(55); });
  ro.observe(canvas.parentElement);
})();

/* ---------- HEATMAP DEMO ---------- */
(function initHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  if (!grid) return;

  const ROWS = 8, COLS = 8;
  let cells = [];
  let values = Array.from({length: ROWS}, () => new Array(COLS).fill(0));
  let paintInterval = null;

  // Color mapping: 0→cool blue → mid→sky → high→purple → max→red
  function pressureToColor(v) {
    // v: 0–100
    const stops = [
      [0,   186, 230, 253],   // #BAE6FD (very light blue)
      [25,  14,  165, 233],   // #0EA5E9
      [50,  99,  102, 241],   // indigo
      [75,  124, 58,  237],   // #7C3AED purple
      [100, 220, 38,  38],    // #DC2626 red
    ];
    let lo, hi;
    for (let i = 0; i < stops.length - 1; i++) {
      if (v >= stops[i][0] && v <= stops[i+1][0]) { lo = stops[i]; hi = stops[i+1]; break; }
    }
    if (!lo) return `rgb(220,38,38)`;
    const t = (v - lo[0]) / (hi[0] - lo[0]);
    const r = Math.round(lo[1] + t*(hi[1]-lo[1]));
    const g = Math.round(lo[2] + t*(hi[2]-lo[2]));
    const b = Math.round(lo[3] + t*(hi[3]-lo[3]));
    return `rgb(${r},${g},${b})`;
  }

  function updateDisplay() {
    let active = 0, peak = 0;
    cells.forEach((cell, idx) => {
      const r = Math.floor(idx / COLS), c = idx % COLS;
      const v = values[r][c];
      cell.style.background = pressureToColor(v);
      cell.style.boxShadow = v > 30 ? `0 0 ${v/5}px rgba(14,165,233,0.4)` : 'none';
      if (v > 5) active++;
      if (v > peak) peak = v;
    });
    document.getElementById('activeNodes').textContent = active;
    document.getElementById('peakPressure').textContent = Math.round(peak) + ' kPa';
  }

  function spread(r, c, intensity) {
    const radius = 2;
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        const dist = Math.sqrt(dr*dr + dc*dc);
        const add = intensity * Math.max(0, 1 - dist / (radius + 1));
        values[nr][nc] = Math.min(100, values[nr][nc] + add);
      }
    }
  }

  function decay() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        values[r][c] = Math.max(0, values[r][c] - 1.5);
      }
    }
    updateDisplay();
  }

  // Build cells
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      
      // Hover interaction: spread pressure from touched cell
      cell.addEventListener('mouseenter', () => { 
        spread(r, c, 70); 
        updateDisplay(); 
      });
      
      // Click interaction: stronger pressure burst
      cell.addEventListener('click', () => { 
        spread(r, c, 100); 
        updateDisplay(); 
      });
      
      // Touch support for mobile
      cell.addEventListener('touchstart', (e) => {
        e.preventDefault();
        spread(r, c, 90);
        updateDisplay();
      });
      
      cell.addEventListener('touchmove', (e) => {
        e.preventDefault();
        spread(r, c, 60);
        updateDisplay();
      });
      
      grid.appendChild(cell);
      cells.push(cell);
    }
  }

  // Removed: Auto-demo random ripples
  // The grid now responds ONLY to user interaction (hover, click, touch)

  // Continuous decay
  setInterval(decay, 60);
  updateDisplay();

  // Reset
  document.getElementById('demoReset').addEventListener('click', () => {
    values = Array.from({length: ROWS}, () => new Array(COLS).fill(0));
    updateDisplay();
  });
})();

/* ---------- CONTACT FORM ---------- */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';
  setTimeout(() => {
    document.getElementById('formSuccess').style.display = 'block';
    btn.querySelector('span').textContent = 'Message Sent ✓';
    btn.style.background = '#059669';
    this.querySelectorAll('input, textarea').forEach(el => el.value = '');
  }, 1200);
});

/* ---------- SMOOTH ACTIVE NAV ---------- */
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a:not(.nav-cta)');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--primary)' : '';
  });
}, { passive: true });
