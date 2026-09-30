/* =============================================================
   MEDIA CENTER — page script
   Shared by /pages/en/media-center/ and /pages/ar/media-center/.
   Stats count-up, gallery filter, gallery lightbox, click-to-play
   videos, press email from site-data.js. Adapted from:
     - equipment.js  → initLightbox()
     - our-projects  → pill filter + result count + .filter-enter
     - home.js       → setupVideos(), animateCount()
   Reveal-on-scroll is handled globally by main.js → animations.js
   via [data-az-reveal] / [data-az-reveal-delay].
   All motion respects prefers-reduced-motion.
   ============================================================= */

import { SITE } from "/assets/js/site-data.js";

const root = document.querySelector(".page-media-center");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isRtl = document.documentElement.dir === "rtl";
const lang = document.documentElement.lang === "ar" ? "ar" : "en";

const TEXT = {
  en: {
    result: (shown, total) => `Showing ${shown} of ${total} photographs`,
  },
  ar: {
    // Phrased to avoid Arabic number–noun agreement (صورة / صور) changing with the count.
    result: (shown, total) => `الصور المعروضة: ${shown} من ${total}`,
  },
}[lang];

/** Read a duration token (e.g. --dur-base) from variables.css, in ms. */
function tokenMs(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  return prefersReduced ? 0 : parseFloat(raw) || 0;
}

/* ── Stats count-up (home.js convention: 1600ms, ease-out cubic) ── */
function finalCount(el) {
  return el.dataset.azCount + (el.dataset.azCountSuffix || "");
}

function animateCount(el) {
  const target = Number(el.dataset.azCount);
  const suffix = el.dataset.azCountSuffix || "";
  const duration = 1600;
  const start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    el.textContent = Math.round(target * ease(t)) + suffix;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = finalCount(el);
  }
  requestAnimationFrame(frame);
}

function initCountUp() {
  const counters = root.querySelectorAll("[data-az-count]");
  if (!counters.length) return;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    counters.forEach((el) => (el.textContent = finalCount(el)));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  counters.forEach((el) => observer.observe(el));
}

/* ── Gallery filter (our-projects pattern) ────────────────────
   Pills toggle aria-pressed, each pill shows its own count, the
   live region announces the result, and tiles that were hidden
   and are now shown get .filter-enter for the fade/scale-in. */
function initFilter() {
  const pills = [...root.querySelectorAll("[data-az-filter]")];
  const tiles = [...root.querySelectorAll(".media-gallery [data-category]")];
  const result = root.querySelector("[data-az-result-count]");
  if (!pills.length || !tiles.length) return;

  const matches = (tile, filter) => filter === "all" || tile.dataset.category === filter;

  pills.forEach((pill) => {
    const count = pill.querySelector("[data-az-filter-count]");
    if (count) count.textContent = String(tiles.filter((t) => matches(t, pill.dataset.azFilter)).length);
  });

  function apply(filter, animate) {
    let shown = 0;
    tiles.forEach((tile) => {
      const wasHidden = tile.hidden;
      const match = matches(tile, filter);
      tile.hidden = !match;
      tile.classList.remove("filter-enter");
      if (!match) return;
      shown += 1;
      if (animate && !prefersReduced && wasHidden) {
        void tile.offsetWidth; // restart the animation
        tile.classList.add("filter-enter");
      }
    });
    if (result) result.textContent = TEXT.result(shown, tiles.length);
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      if (pill.getAttribute("aria-pressed") === "true") return;
      pills.forEach((p) => p.setAttribute("aria-pressed", String(p === pill)));
      apply(pill.dataset.azFilter, true);
    });
  });

  apply("all", false);
}

/* ── Gallery lightbox (equipment.js initLightbox) ─────────────
   Native <dialog> (showModal) gives Esc handling and keeps focus
   inside while open; we add the fade/scale, arrow-key paging,
   backdrop click, and return focus to the opening tile.
   Difference from equipment: paging only walks the tiles the
   current filter leaves visible. */
function initLightbox() {
  const dialog = root.querySelector(".media-lightbox");
  const tiles = [...root.querySelectorAll(".media-tile")];
  if (!dialog || !tiles.length || typeof dialog.showModal !== "function") return;

  const img = dialog.querySelector(".media-lightbox__img");
  const caption = dialog.querySelector(".media-lightbox__text");
  const count = dialog.querySelector(".media-lightbox__count");
  let set = tiles;
  let index = 0;
  let opener = null;

  const visibleTiles = () => tiles.filter((t) => !t.closest("[data-category]")?.hidden);

  function show(i) {
    index = (i + set.length) % set.length;
    const thumb = set[index].querySelector("img");
    img.src = set[index].dataset.azFull || thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    caption.textContent = thumb.alt;
    count.textContent = `${index + 1} / ${set.length}`;
  }

  function open(tile) {
    opener = tile;
    set = visibleTiles();
    show(set.indexOf(tile));
    dialog.showModal();
    document.body.classList.add("no-scroll");
    void dialog.offsetWidth; // commit the hidden state so the fade-in transitions
    dialog.classList.add("is-visible");
  }

  function close() {
    if (!dialog.open) return;
    dialog.classList.remove("is-visible");
    setTimeout(() => {
      dialog.close();
      document.body.classList.remove("no-scroll");
      if (opener) opener.focus();
    }, tokenMs("--dur-base"));
  }

  tiles.forEach((tile) => tile.addEventListener("click", () => open(tile)));

  dialog.querySelector(".media-lightbox__close").addEventListener("click", close);
  dialog.querySelector(".media-lightbox__prev").addEventListener("click", () => show(index - 1));
  dialog.querySelector(".media-lightbox__next").addEventListener("click", () => show(index + 1));

  // Esc → animated close instead of the native instant one
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    close();
  });

  // Clicks on the dialog surface itself (not the image/buttons) = backdrop
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) close();
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    // "Forward" follows reading direction: → in English, ← in Arabic
    const forward = (e.key === "ArrowRight") !== isRtl;
    show(index + (forward ? 1 : -1));
  });
}

/* ── Click-to-play videos (home.js setupVideos) ───────────────
   <source data-src> is only attached on first click, so nothing
   downloads until the visitor asks for it. */
function initVideos() {
  root.querySelectorAll(".media-video__play").forEach((btn) => {
    const frame = btn.closest(".media-video__frame");
    const video = frame && frame.querySelector(".media-video__el");
    const source = video && video.querySelector("source[data-src]");
    if (!video) return;
    btn.addEventListener("click", async () => {
      if (source && !source.src) { source.src = source.dataset.src; video.load(); }
      video.setAttribute("controls", "");
      try {
        await video.play();
        btn.classList.add("is-hidden");
        video.focus();
      } catch {
        let note = frame.parentElement.querySelector('[data-az-playback-status]');
        if (!note) {
          note = document.createElement('p');
          note.dataset.azPlaybackStatus = '';
          note.setAttribute('role', 'status');
          frame.after(note);
        }
        note.textContent = lang === 'ar' ? 'تعذر تشغيل الفيديو. حاول مرة أخرى لاحقاً.' : 'The video could not play. Please try again later.';
      }
    });
  });
}

/* ── Contact data from site-data.js (CLAUDE.md §6.4) ───────── */
function fillSiteData() {
  root.querySelectorAll("[data-az-email]").forEach((el) => {
    const mail = SITE.emails[el.dataset.azEmail];
    if (!mail) return;
    el.href = `mailto:${mail}`;
    el.textContent = mail;
  });
}

/* ── Bootstrap ────────────────────────────────────────────── */
let started = false;
function init() {
  if (started || !root) return;
  started = true;
  root.classList.add("has-js");
  fillSiteData();
  initCountUp();
  initFilter();
  initLightbox();
  initVideos();
}

// Page content is static, but wait for the partials so layout (and
// the navbar height) is settled before the counters observe. Guarded
// in case partials:loaded already fired before this module ran.
document.addEventListener("partials:loaded", init, { once: true });
if (document.getElementById("site-navbar")?.children.length) init();
window.addEventListener("load", () => setTimeout(init, 400));
