/* =============================================================
   ANIMATIONS — IntersectionObserver reveal-on-scroll.
   Elements marked [data-az-reveal] fade/rise in when they enter
   the viewport. Respects prefers-reduced-motion (no-op / instant).
   Optional [data-az-reveal-delay="120"] adds a per-element delay.
   ============================================================= */

/**
 * Start observing reveal targets. Safe to call more than once and
 * after dynamic content is added.
 * @param {ParentNode} [root=document]
 */
export function initAnimations(root = document) {
  const targets = root.querySelectorAll("[data-az-reveal]:not(.is-revealed)");
  if (!targets.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = el.dataset.azRevealDelay;
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add("is-revealed");
        obs.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}
