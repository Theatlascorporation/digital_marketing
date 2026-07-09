/* ============================================================
   NEXAGROWTH — script.js  (Enhanced Edition)
   Vanilla JavaScript — Zero dependencies
   ============================================================ */

'use strict';

/* ==========================================
   PAGE TRANSITION
========================================== */
const overlay = document.getElementById('page-overlay');

if (overlay) {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => { overlay.classList.add('page-exit'); });
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('http') ||
            href.startsWith('mailto') || href.startsWith('tel') || link.hasAttribute('download')) return;

        e.preventDefault();
        overlay.classList.remove('page-exit');
        setTimeout(() => { window.location.href = href; }, 680);
    });
}

/* ==========================================
   THEME
========================================== */
const html   = document.documentElement;
const toggle = document.getElementById('theme-toggle');

function getTheme() {
    return localStorage.getItem('ng-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('ng-theme', theme);
    redrawAllCharts();
}

applyTheme(getTheme());

if (toggle) {
    toggle.addEventListener('click', () => {
        const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
}

/* ==========================================
   ACTIVE NAV LINK
========================================== */
(function markActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        const aPage = (a.getAttribute('href') || '').split('/').pop();
        if (aPage === current || (current === '' || aPage === 'index.html')) {
            a.classList.add('active');
        }
    });
})();

/* ==========================================
   CUSTOM CURSOR
========================================== */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = -200, mouseY = -200, follX = -200, follY = -200;

if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top  = mouseY + 'px';
    });
    (function animFoll() {
        follX += (mouseX - follX) * 0.12;
        follY += (mouseY - follY) * 0.12;
        follower.style.left = follX + 'px';
        follower.style.top  = follY + 'px';
        requestAnimationFrame(animFoll);
    })();
    document.querySelectorAll('a, button, .sc, .bc, .metric-card, .t-card, .pc, .cs-card, .faq-q').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
    });
}

/* ==========================================
   PROGRESS BAR
========================================== */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ==========================================
   NAVBAR SCROLL
========================================== */
const navbar = document.getElementById('navbar');
function handleNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', handleNavbar, { passive: true });
handleNavbar();

/* ==========================================
   MOBILE MENU
========================================== */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open', !isOpen);
        hamburger.classList.toggle('active', !isOpen);
        hamburger.setAttribute('aria-expanded', String(!isOpen));
        mobileMenu.setAttribute('aria-hidden', String(isOpen));
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });
}
if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileMenu));

/* ==========================================
   SMOOTH SCROLL (anchor links)
========================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
        closeMobileMenu();
    });
});

/* ==========================================
   SPLIT TEXT ANIMATION
========================================== */
function initSplitText() {
    document.querySelectorAll('[data-split]').forEach(el => {
        const raw    = el.innerHTML;
        let wrapped  = '';
        let wIdx     = 0;
        const tokens = raw.match(/(<[^>]+>|[^<]+)/g) || [];

        tokens.forEach(tok => {
            if (tok.startsWith('<')) {
                wrapped += tok;
            } else {
                tok.split(/(\s+)/).forEach(part => {
                    if (/^\s+$/.test(part)) { wrapped += part; return; }
                    if (!part) return;
                    wrapped += `<span class="sw-wrap"><span class="sw" style="transition-delay:${wIdx * 90}ms">${part}</span></span>`;
                    wIdx++;
                });
            }
        });

        el.innerHTML = wrapped;
        el.classList.add('split-ready');
    });

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.sw').forEach(sw => sw.classList.add('visible'));
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-split]').forEach(el => obs.observe(el));
}

/* ==========================================
   INTERSECTION OBSERVER — REVEAL
========================================== */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ==========================================
   COUNTER ANIMATION
========================================== */
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
    if (el._animated) return;
    el._animated = true;
    const target = parseFloat(el.dataset.target) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur    = 2400;
    const start  = performance.now();
    (function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = prefix + Math.round(target * easeOutCubic(p)).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
}

const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.metric-num').forEach(el => counterObs.observe(el));

/* ==========================================
   FAQ ACCORDION
========================================== */
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item   = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-a');
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(other => {
            if (other !== btn) {
                other.setAttribute('aria-expanded', 'false');
                other.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
            }
        });
        btn.setAttribute('aria-expanded', String(!isOpen));
        answer.classList.toggle('open', !isOpen);
    });
});

/* ==========================================
   FAQ CATEGORY FILTER
========================================== */
document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        document.querySelectorAll('.faq-item').forEach(item => {
            item.style.display = (!cat || cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
        });
    });
});

/* ==========================================
   STICKY BAR
========================================== */
const stickyBar   = document.getElementById('sticky-bar');
const stickyClose = document.getElementById('sticky-close');
let   stickyClosed = false;

window.addEventListener('scroll', () => {
    if (!stickyBar || stickyClosed) return;
    const hero = document.getElementById('hero');
    const threshold = hero ? hero.getBoundingClientRect().bottom : 400;
    stickyBar.classList.toggle('visible', threshold < 0);
}, { passive: true });

if (stickyClose) {
    stickyClose.addEventListener('click', () => {
        stickyClosed = true;
        if (stickyBar) stickyBar.classList.remove('visible');
    });
}

/* ==========================================
   PRICING TOGGLE
========================================== */
const billingSwitch = document.getElementById('billing-switch');
const lblMonthly    = document.getElementById('lbl-monthly');
const lblAnnual     = document.getElementById('lbl-annual');
let isAnnual = false;

if (billingSwitch) {
    billingSwitch.addEventListener('click', () => {
        isAnnual = !isAnnual;
        billingSwitch.setAttribute('aria-checked', String(isAnnual));
        if (lblMonthly) lblMonthly.classList.toggle('active', !isAnnual);
        if (lblAnnual)  lblAnnual.classList.toggle('active',   isAnnual);

        document.querySelectorAll('.pc-amt').forEach(span => {
            const val = isAnnual ? span.dataset.annual : span.dataset.monthly;
            if (!val) return;
            span.style.opacity = '0';
            span.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                span.textContent = val;
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 220);
        });
    });
}

/* ==========================================
   3D TILT
========================================== */
function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
        const shine = card.querySelector('.tilt-shine');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width  / 2) / rect.width;
            const y = (e.clientY - rect.top  - rect.height / 2) / rect.height;
            card.style.transform  = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) translateZ(8px)`;
            card.style.transition = 'transform 0.08s ease';
            if (shine) {
                shine.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(255,255,255,0.14), transparent 60%)`;
                shine.style.opacity = '1';
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform  = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
            if (shine) shine.style.opacity = '0';
        });
    });
}

/* ==========================================
   MAGNETIC BUTTONS
========================================== */
function initMagnetic() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x    = (e.clientX - rect.left - rect.width  / 2) * 0.32;
            const y    = (e.clientY - rect.top  - rect.height / 2) * 0.32;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

/* ==========================================
   PARTICLE SYSTEM
========================================== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));

    const isDark  = () => html.getAttribute('data-theme') === 'dark';
    const COUNT   = 55;
    const CONNECT = 130;

    const particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * 1200, y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r:  Math.random() * 2 + 1,
    }));

    let mx = -999, my = -999;
    canvas.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    canvas.addEventListener('mouseleave', () => { mx = -999; my = -999; });

    (function draw() {
        ctx.clearRect(0, 0, W, H);
        const pc = isDark() ? '96,165,250' : '37,99,235';
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${pc}, 0.6)`; ctx.fill();

            const dm = Math.hypot(p.x - mx, p.y - my);
            if (dm < CONNECT * 1.5) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my);
                ctx.strokeStyle = `rgba(${pc}, ${0.25 * (1 - dm / (CONNECT * 1.5))})`; ctx.lineWidth = 1; ctx.stroke();
            }
            for (let j = i + 1; j < COUNT; j++) {
                const q = particles[j];
                const ed = Math.hypot(p.x - q.x, p.y - q.y);
                if (ed < CONNECT) {
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(${pc}, ${0.12 * (1 - ed / CONNECT)})`; ctx.lineWidth = 0.8; ctx.stroke();
                }
            }
        });
        requestAnimationFrame(draw);
    })();
}

/* ==========================================
   CANVAS CHARTS
========================================== */
function bezierPath(ctx, pts) {
    for (let i = 1; i < pts.length; i++) {
        const p = pts[i-1], c = pts[i];
        const cx = (c.x - p.x) * 0.4;
        ctx.bezierCurveTo(p.x + cx, p.y, c.x - cx, c.y, c.x, c.y);
    }
}

function drawLineChart(id, data, color) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 480, H = canvas.offsetHeight || 130;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);

    const pad = { t: 16, r: 16, b: 20, l: 16 };
    const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
    const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
    const pts = data.map((v, i) => ({ x: pad.l + (i / (data.length - 1)) * cW, y: pad.t + (1 - (v - min) / rng) * cH }));

    ctx.lineWidth = 1;
    ctx.strokeStyle = html.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    for (let i = 1; i <= 3; i++) { const y = pad.t + (cH / 4) * i; ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke(); }

    const labels = data.length === 6 ? ['Jan','Feb','Mar','Apr','May','Jun'] : data.length === 4 ? ['Month 1','Month 2','Month 3','Month 4'] : [];
    if (labels.length) {
        ctx.font = `500 10px Inter, sans-serif`; ctx.fillStyle = html.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'; ctx.textAlign = 'center';
        labels.forEach((lb, i) => ctx.fillText(lb, pts[i].x, H - 4));
    }

    const grad = ctx.createLinearGradient(0, pad.t, 0, H - pad.b);
    grad.addColorStop(0, color.replace('rgb', 'rgba').replace(')', ', 0.28)')); grad.addColorStop(1, color.replace('rgb', 'rgba').replace(')', ', 0)'));

    ctx.beginPath(); ctx.moveTo(pts[0].x, H - pad.b); ctx.lineTo(pts[0].x, pts[0].y); bezierPath(ctx, pts); ctx.lineTo(pts[pts.length-1].x, H - pad.b); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); bezierPath(ctx, pts); ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();

    pts.forEach((pt, i) => {
        const isLast = i === pts.length - 1;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, isLast ? 5 : 3.5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
        ctx.beginPath(); ctx.arc(pt.x, pt.y, isLast ? 2.5 : 1.5, 0, Math.PI * 2); ctx.fillStyle = html.getAttribute('data-theme') === 'dark' ? '#0F172A' : '#fff'; ctx.fill();
    });
}

function drawHeroChart() {
    const canvas = document.getElementById('hero-chart');
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth || 360, H = canvas.offsetHeight || 110;
    canvas.width = W * dpr; canvas.height = H * dpr;
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);

    const data = [42, 51, 59, 68, 80, 93, 110, 128];
    const color = '#2563EB';
    const pad = { t: 10, r: 10, b: 10, l: 10 };
    const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
    const min = Math.min(...data), max = Math.max(...data);
    const pts = data.map((v, i) => ({ x: pad.l + (i / (data.length - 1)) * cW, y: pad.t + (1 - (v - min) / (max - min)) * cH }));

    ctx.strokeStyle = html.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'; ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) { const y = pad.t + (cH / 4) * i; ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke(); }

    const grad = ctx.createLinearGradient(0, pad.t, 0, H); grad.addColorStop(0, 'rgba(37,99,235,0.28)'); grad.addColorStop(1, 'rgba(37,99,235,0)');
    ctx.beginPath(); ctx.moveTo(pts[0].x, H - pad.b); ctx.lineTo(pts[0].x, pts[0].y); bezierPath(ctx, pts); ctx.lineTo(pts[pts.length-1].x, H - pad.b); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); bezierPath(ctx, pts); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();

    const last = pts[pts.length-1];
    ctx.beginPath(); ctx.arc(last.x, last.y, 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    ctx.beginPath(); ctx.arc(last.x, last.y, 2, 0, Math.PI * 2); ctx.fillStyle = html.getAttribute('data-theme') === 'dark' ? '#0F172A' : '#fff'; ctx.fill();
}

function drawCaseCharts() {
    drawLineChart('chart-1', [24, 33, 46, 61, 78, 98], 'rgb(37,99,235)');
    drawLineChart('chart-2', [41, 72, 118, 167],         'rgb(124,58,237)');
}

function redrawAllCharts() { drawHeroChart(); drawCaseCharts(); }

/* ==========================================
   BLOB PARALLAX
========================================== */
const heroSection = document.getElementById('hero');
const blobs = document.querySelectorAll('.blob-1, .blob-2, .blob-3');

if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const cx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
        const cy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
        blobs.forEach((b, i) => { b.style.transform = `translate(${cx * (i+1) * 20}px, ${cy * (i+1) * 20}px)`; });
    }, { passive: true });
    heroSection.addEventListener('mouseleave', () => blobs.forEach(b => b.style.transform = ''));
}

/* ==========================================
   UTILITY
========================================== */
function debounce(fn, delay) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

/* ==========================================
   INIT
========================================== */
document.addEventListener('DOMContentLoaded', () => {
    handleNavbar();
    initSplitText();
    initTilt();
    initMagnetic();
    initParticles();

    const csSection = document.getElementById('case-studies');
    if (csSection) {
        const chartObs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { drawCaseCharts(); chartObs.disconnect(); } });
        }, { threshold: 0.1 });
        chartObs.observe(csSection);
    }

    // Animate hero on load
    const heroItems = document.querySelectorAll('.s-hero .reveal');
    heroItems.forEach((el, i) => setTimeout(() => el.classList.add('in-view'), 200 + i * 110));

    window.addEventListener('load', () => { drawHeroChart(); drawCaseCharts(); });
    window.addEventListener('resize', debounce(redrawAllCharts, 200));
});
