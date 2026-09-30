/* =============================================================
   EQUIPMENT — page script
   Shared by /pages/en/equipment/ and /pages/ar/equipment/.
   Hero video cross-fade + load-in, stats count-up, category filter,
   category detail accordions, and the gallery lightbox.
   Reveal-on-scroll is handled globally by main.js → animations.js.
   All motion respects prefers-reduced-motion.
   ============================================================= */

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isRtl = document.documentElement.dir === "rtl";

/** Read a duration token (e.g. --dur-base) from variables.css, in ms. */
function tokenMs(name) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
  return prefersReduced ? 0 : parseFloat(raw) || 0;
}

/* ── Hero: load-in + poster → video cross-fade ────────────── */
function initHero() {
  const hero = document.querySelector(".page-equipment .eq-hero");
  if (!hero) return;

  requestAnimationFrame(() => hero.classList.add("is-loaded"));

  const video = hero.querySelector(".eq-hero__video");
  if (!video) return;

  if (prefersReduced) {
    video.removeAttribute("autoplay");
    video.pause();
    return;
  }

  const reveal = () => hero.classList.add("is-video-ready");
  if (video.readyState >= 4) reveal();
  else video.addEventListener("canplaythrough", reveal, { once: true });
}

/* ── Stats count-up ───────────────────────────────────────── */
function animateCount(el) {
  const raw = el.dataset.azTarget || "";
  const target = parseFloat(raw.replace(/[^0-9.]/g, ""));

  // Non-numeric targets (e.g. "[TBC]") are shown as-is.
  if (Number.isNaN(target) || prefersReduced) {
    el.textContent = raw;
    return;
  }

  const suffix = raw.replace(/[0-9.,]/g, "");
  const duration = 1800;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = raw;
  }
  requestAnimationFrame(step);
}

function initCountUp() {
  const counters = document.querySelectorAll(".page-equipment [data-az-count]");
  if (!counters.length) return;

  if (!("IntersectionObserver" in window)) {
    counters.forEach((el) => (el.textContent = el.dataset.azTarget));
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
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
}

/* ── Category filter ──────────────────────────────────────────
   Fade the grid out → swap which cards are in flow → animate the
   grid height to its new size → fade back in. Nothing is ever
   visible while display changes, and the height eases rather
   than jumping. */
function initFilter() {
  const chips = document.querySelectorAll(".page-equipment [data-az-filter]");
  const grid = document.querySelector(".page-equipment .eq-cat-grid");
  const status = document.querySelector(".page-equipment [data-az-filter-status]");
  if (!chips.length || !grid) return;

  const items = [...grid.children];
  let busy = false;

  function apply(filter) {
    let shown = 0;
    items.forEach((item) => {
      const cats = (item.dataset.azCategory || "").split(" ");
      const match = filter === "all" || cats.includes(filter);
      item.classList.toggle("is-filtered-out", !match);
      if (match) shown += 1;
    });
    if (status) {
      status.textContent = status.dataset.azTemplate.replace("{n}", shown);
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      if (busy || chip.getAttribute("aria-pressed") === "true") return;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));

      const dur = tokenMs("--dur-base");
      if (!dur) {
        apply(chip.dataset.azFilter);
        return;
      }

      busy = true;
      grid.classList.add("is-fading");

      setTimeout(() => {
        const from = grid.offsetHeight;
        apply(chip.dataset.azFilter);
        const to = grid.offsetHeight;

        grid.style.height = `${from}px`;
        void grid.offsetHeight; // commit the start height before animating
        grid.style.height = `${to}px`;
        grid.classList.remove("is-fading");

        setTimeout(() => {
          grid.style.height = "";
          busy = false;
        }, dur);
      }, dur);
    });
  });
}

/* ── Category detail accordions ───────────────────────────── */
function initAccordions() {
  document.querySelectorAll(".page-equipment .eq-cat__toggle").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
      panel.inert = !open;
    });
  });
}

/* ── Gallery lightbox ─────────────────────────────────────────
   Native <dialog> (showModal) gives Esc handling and keeps focus
   inside while open; we add the fade/scale, arrow-key paging,
   backdrop click, and return focus to the opening tile. */
function initLightbox() {
  const dialog = document.querySelector(".page-equipment .eq-lightbox");
  const tiles = [...document.querySelectorAll(".page-equipment .eq-tile")];
  if (!dialog || !tiles.length || typeof dialog.showModal !== "function") return;

  const img = dialog.querySelector(".eq-lightbox__img");
  const caption = dialog.querySelector(".eq-lightbox__text");
  const count = dialog.querySelector(".eq-lightbox__count");
  let index = 0;
  let opener = null;

  function show(i) {
    index = (i + tiles.length) % tiles.length;
    const thumb = tiles[index].querySelector("img");
    img.src = tiles[index].dataset.azFull || thumb.currentSrc || thumb.src;
    img.alt = thumb.alt;
    caption.textContent = thumb.alt;
    count.textContent = `${index + 1} / ${tiles.length}`;
  }

  function open(i) {
    opener = tiles[i];
    show(i);
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

  tiles.forEach((tile, i) => tile.addEventListener("click", () => open(i)));

  dialog.querySelector(".eq-lightbox__close").addEventListener("click", close);
  dialog.querySelector(".eq-lightbox__prev").addEventListener("click", () => show(index - 1));
  dialog.querySelector(".eq-lightbox__next").addEventListener("click", () => show(index + 1));

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

/* ── Bootstrap ────────────────────────────────────────────── */
function init() {
  initHero();
  initCountUp();
  initFilter();
  initAccordions();
  initLightbox();
}

// Page content is static in the HTML, so there's no need to wait for
// the navbar/footer partials. Module scripts run after parsing.
init();
