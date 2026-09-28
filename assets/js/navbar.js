/* =============================================================
   NAVBAR — binds after "partials:loaded". Builds the nav links
   from site-data.js, marks the current item .is-active, handles
   the mobile drawer (aria-expanded, focus trap, Esc, scroll-lock)
   and the sticky/shrink-on-scroll behaviour.
   SHARED FILE — coordinate before editing (see CLAUDE.md §12).
   ============================================================= */

import { SITE } from "/assets/js/site-data.js";

const SCROLL_THRESHOLD = 12;

/** Build the root-absolute href for a nav slug in a given language. */
function hrefFor(slug, lang) {
  if (slug === "") return lang === "ar" ? "/pages/ar/home/" : "/";
  return `/pages/${lang}/${slug}/`;
}

/** Normalise a pathname for comparison (drop index.html, trailing slash). */
function normalizePath(path) {
  return path.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
}

/** Is `itemHref` the active page for the current location? */
function isActive(itemHref, currentPath) {
  const item = normalizePath(itemHref);
  const here = normalizePath(currentPath);
  if (item === "/" || item === "/pages/ar/home") return here === item;
  return here === item || here.startsWith(item + "/");
}

/** Render the <li> nav items into the [data-az-nav] list. */
function buildMenu(navEl, lang) {
  const currentPath = window.location.pathname;
  navEl.innerHTML = SITE.nav
    .map((item) => {
      const href = hrefFor(item.slug, lang);
      const label = item[lang];
      const active = isActive(href, currentPath);
      return `
        <li class="navbar__item${active ? " is-active" : ""}">
          <a class="navbar__link" href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>
        </li>`;
    })
    .join("");
}

/** Point the "Get a Quote" CTA at the contact page for this language. */
function wireCta(root, lang) {
  const cta = root.querySelector("[data-az-cta]");
  if (cta) cta.setAttribute("href", `/pages/${lang}/contact-us/`);
}

/* -------------------------------------------------------------
   Mobile drawer: open/close + focus trap + Esc + scroll lock
   ------------------------------------------------------------- */
function setupDrawer(navbar) {
  const toggle = navbar.querySelector(".navbar__toggle");
  const nav = navbar.querySelector(".navbar__nav");
  const backdrop = navbar.querySelector(".navbar__backdrop");
  if (!toggle || !nav) return;

  const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const open = () => {
    lastFocused = document.activeElement;
    navbar.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
    const first = nav.querySelector(FOCUSABLE);
    if (first) first.focus();
  };

  const close = () => {
    navbar.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  };

  const toggleDrawer = () =>
    navbar.classList.contains("is-open") ? close() : open();

  toggle.addEventListener("click", toggleDrawer);
  if (backdrop) backdrop.addEventListener("click", close);

  // Close after tapping a link in the drawer (mobile only).
  nav.addEventListener("click", (e) => {
    if (e.target.closest(".navbar__link") && navbar.classList.contains("is-open")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!navbar.classList.contains("is-open")) return;

    if (e.key === "Escape") { close(); return; }

    if (e.key === "Tab") {
      const items = [...nav.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Reset drawer state when resizing up to desktop.
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", (e) => { if (e.matches) close(); });
}

/* -------------------------------------------------------------
   Sticky / shrink-on-scroll
   ------------------------------------------------------------- */
function setupScroll(navbar) {
  let ticking = false;
  const update = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
    ticking = false;
  };
  update();
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}

/* -------------------------------------------------------------
   Public init — called from main.js after "partials:loaded".
   ------------------------------------------------------------- */
export function initNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const lang = document.documentElement.lang === "ar" ? "ar" : "en";
  const navList = navbar.querySelector("[data-az-nav]");

  if (navList) buildMenu(navList, lang);
  wireCta(navbar, lang);
  setupDrawer(navbar);
  setupScroll(navbar);
}
