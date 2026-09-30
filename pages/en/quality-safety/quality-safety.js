/* =============================================================
   QUALITY & SAFETY — page script
   Scope : .page-quality-safety
   Owner : Mazen
   Shared by the EN and AR pages (the AR page loads this same
   file — media and behaviour are never duplicated, CLAUDE.md §3.1).
   Binds after "partials:loaded". Every motion path respects
   prefers-reduced-motion. No global side-effects.
   ============================================================= */

import { initAnimations } from "/assets/js/animations.js";

const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PAGE = ".page-quality-safety";

/* ── 1. Hero: load-in + poster→video cross-fade ───────────── */
function initHero() {
  const hero = document.querySelector(`${PAGE} .qs-hero`);
  if (!hero) return;

  /* H1 + sub-line fade/rise on load */
  requestAnimationFrame(() => hero.classList.add("is-loaded"));

  const video = hero.querySelector(".qs-hero__video");
  if (!video) return;

  if (REDUCED) {
    /* Keep the poster frame; never autoplay motion */
    video.pause();
    video.removeAttribute("autoplay");
    return;
  }

  if (video.readyState >= 4) {
    hero.classList.add("is-video-ready");
  } else {
    video.addEventListener(
      "canplaythrough",
      () => hero.classList.add("is-video-ready"),
      { once: true }
    );
  }
}

/* ── 2. Scroll cue: fade out once the user scrolls ────────── */
function initScrollCue() {
  const cue = document.querySelector(`${PAGE} .qs-hero__scroll-cue`);
  if (!cue) return;

  let hidden = false;
  window.addEventListener(
    "scroll",
    () => {
      if (hidden || window.scrollY <= 80) return;
      cue.classList.add("is-hidden");
      hidden = true;
    },
    { passive: true }
  );
}

/* ── 3. Count-up for the KPI band ──────────────────────────
   A stat animates when [data-az-count] carries a numeric target.
   Handles thousands separators ("4,850,000"), decimals ("0.42")
   and a trailing unit ("94%"), and finishes on the authored string
   so the rendered value always matches the markup exactly.
   The KPI figures themselves are placeholders pending client
   sign-off — see the PLACEHOLDER comments in the markup.
   ---------------------------------------------------------- */
const COUNT_DURATION = 1800;

function animateCount(el) {
  const raw = (el.dataset.azCount || "").trim();
  const target = parseFloat(raw.replace(/[^0-9.]/g, ""));

  /* No numeric target (empty or non-numeric): leave the authored
     text exactly as written. */
  if (!raw || Number.isNaN(target)) return;

  const suffix = raw.replace(/[0-9.,\s]/g, "");
  const decimals = (raw.split(".")[1] || "").replace(/\D/g, "").length;

  if (REDUCED) {
    el.textContent = raw;
    return;
  }

  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / COUNT_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3); /* ease-out-cubic */
    const value = (eased * target).toFixed(decimals);
    el.textContent = Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = raw;
  }

  requestAnimationFrame(tick);
}

function initCountUp() {
  const stats = document.querySelectorAll(`${PAGE} [data-az-count]`);
  if (!stats.length) return;

  if (REDUCED || !("IntersectionObserver" in window)) {
    stats.forEach(animateCount);
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        animateCount(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((el) => io.observe(el));
}

/* ── 4. Policy accordions (Sections 4 and 7) ───────────────
   Native <button> elements, so Enter/Space come for free.
   The panel height is a grid-template-rows 0fr → 1fr transition,
   so nothing below it jumps (CLS).
   ---------------------------------------------------------- */
function initAccordions() {
  const triggers = document.querySelectorAll(`${PAGE} .qs-accordion__trigger`);
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    const item = trigger.closest(".qs-accordion__item");
    if (!item) return;

    trigger.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
}

/* ── 5. QC-process connector line (Section 5) ──────────────
   Adds .is-drawn when the step row enters the viewport; the CSS
   animates stroke-dashoffset (and shows it fully drawn under
   reduced motion).
   ---------------------------------------------------------- */
function initDrawnLines() {
  const tracks = document.querySelectorAll(
    `${PAGE} [data-az-process], ${PAGE} [data-az-flow]`
  );
  if (!tracks.length) return;

  if (REDUCED || !("IntersectionObserver" in window)) {
    tracks.forEach((el) => el.classList.add("is-drawn"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        entry.target.classList.add("is-drawn");
      });
    },
    { threshold: 0.25 }
  );

  tracks.forEach((el) => io.observe(el));
}

/* ── Bootstrap ─────────────────────────────────────────────── */
function init() {
  initAnimations();
  initHero();
  initScrollCue();
  initCountUp();
  initAccordions();
  initDrawnLines();
}

/* The hero must not wait on the partials fetch, but the reveal
   observer is cheap to run twice — so bind the page bits now and
   re-run the reveal pass once navbar/footer are in the DOM. */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

document.addEventListener(
  "partials:loaded",
  () => initAnimations(),
  { once: true }
);
