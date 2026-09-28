/* =============================================================
   OUR SERVICES — page script
   Scope : .page-services
   Owner : Mazen
   Binds after partials:loaded. All motion respects
   prefers-reduced-motion. No global side-effects.
   ============================================================= */

(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── 1. Mark JS as available (gated reveal in CSS) ───────── */
  document.body.classList.add("has-js");

  /* ── 2. Guard: run after partials are injected ───────────── */
  function init() {
    initReveal();
    initCounters();
    initHeroVideo();
    initVideoCard();
    initScrollCue();
  }

  /* Handle both: partials already fired and partials yet to fire */
  if (document.body.dataset.partialsLoaded) {
    init();
  } else {
    document.addEventListener("partials:loaded", init, { once: true });
  }

  /* ── 3. Hero background video — pause on reduced motion ─── */
  function initHeroVideo() {
    const bg = document.querySelector(".page-services .services-hero__bg");
    if (!bg || bg.tagName !== "VIDEO") return;
    if (REDUCED) bg.pause();
  }

  /* ── 4. Scroll-reveal ────────────────────────────────────── */
  function initReveal() {
    if (REDUCED) {
      /* Resolve immediately — no animation */
      document.querySelectorAll(".page-services .reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
          entry.target.style.willChange = "auto"; /* remove after animation */
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    document.querySelectorAll(".page-services .reveal").forEach(function (el) {
      el.style.willChange = "opacity, transform";
      io.observe(el);
    });

    /* Stagger grid cards by 80 ms each */
    document.querySelectorAll(".page-services .services-grid__cards > li").forEach(
      function (li, i) {
        const card = li.querySelector(".reveal") || li;
        card.style.setProperty("--reveal-delay", i * 80 + "ms");
      }
    );
  }

  /* ── 5. Animated counters ────────────────────────────────── */
  function initCounters() {
    const DURATION = 1600;

    const targets = document.querySelectorAll(
      ".page-services [data-az-count]:not([data-az-count='0'])"
    );

    if (!targets.length) return;

    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);

          const el = entry.target;
          const end = parseInt(el.dataset.azCount, 10);

          if (REDUCED) {
            el.textContent = end.toLocaleString();
            return;
          }

          const start = performance.now();
          const easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

          function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / DURATION, 1);
            el.textContent = Math.floor(easeOut(progress) * end).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = end.toLocaleString();
          }

          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ── 6. Click-to-play video card ─────────────────────────── */
  function initVideoCard() {
    const card    = document.getElementById("execution-video-card");
    const video   = document.getElementById("execution-video");
    const overlay = document.getElementById("execution-video-overlay");
    const playBtn = document.getElementById("execution-video-play");

    if (!card || !video || !overlay || !playBtn) return;

    function play() {
      video.muted = false;
      video.play().then(function () {
        card.classList.add("is-playing");
        /* Re-enable muted loop so pause/replay works cleanly */
      }).catch(function () {
        /* Autoplay policy: fall back to muted play */
        video.muted = true;
        video.play();
        card.classList.add("is-playing");
      });
    }

    playBtn.addEventListener("click", play);

    /* Clicking the overlay (not just the button) also plays */
    overlay.addEventListener("click", function (e) {
      if (e.target !== playBtn && !playBtn.contains(e.target)) play();
    });

    /* Show overlay again when video ends */
    video.addEventListener("ended", function () {
      card.classList.remove("is-playing");
    });

    /* Pause background video on reduced-motion preference */
    if (REDUCED) {
      video.pause();
    }
  }

  /* ── 7. Scroll-cue: hide once user scrolls ──────────────── */
  function initScrollCue() {
    const cue = document.querySelector(".page-services .services-hero__scroll-cue");
    if (!cue) return;

    var hidden = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!hidden && window.scrollY > 80) {
          cue.style.opacity = "0";
          cue.style.pointerEvents = "none";
          hidden = true;
        }
      },
      { passive: true }
    );
  }
}());
