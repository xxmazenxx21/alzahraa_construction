/* =============================================================
   ABOUT US — page script
   Runs after partials:loaded. Initialises animations, count-up,
   and hero load-in. All motion respects prefers-reduced-motion.
   ============================================================= */

import { initAnimations } from '/assets/js/animations.js';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Hero load-in ─────────────────────────────────────────── */
function initHeroLoad() {
  const hero = document.querySelector('.page-about .about-hero');
  if (!hero) return;
  setTimeout(() => hero.classList.add('hero-loaded'), 100);
}

/* ── Count-up animation ───────────────────────────────────── */
function animateCount(el) {
  const raw = el.dataset.azTarget;
  if (!raw) return;

  const hasPlus = raw.includes('+');
  const target = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (isNaN(target)) { el.textContent = raw; return; }

  if (prefersReduced) { el.textContent = raw; return; }

  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = Math.round(eased * target);
    el.textContent = current + (hasPlus ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = raw;
  }
  requestAnimationFrame(step);
}

function initCountUp() {
  const counters = document.querySelectorAll('[data-az-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ── Bootstrap ────────────────────────────────────────────── */
document.addEventListener('partials:loaded', () => {
  initAnimations();
  initHeroLoad();
  initCountUp();
});
