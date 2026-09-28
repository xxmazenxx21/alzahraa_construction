/* =============================================================
   LANG-SWITCH — maps a page to its counterpart by swapping the
   /pages/en/ <-> /pages/ar/ path segment (special case:
   /  <->  /pages/ar/home/). Stores the choice in localStorage
   under "az_lang". Does NOT auto-redirect first-time visitors
   (English is the default — see CLAUDE.md §5.1).
   ============================================================= */

const STORAGE_KEY = "az_lang";

/** Map any page path to its equivalent in `target` language. */
export function counterpartUrl(path, target) {
  if (target === "en") {
    if (/^\/pages\/ar\/home\/?(index\.html)?$/.test(path)) return "/";
    if (path.includes("/pages/ar/")) return path.replace("/pages/ar/", "/pages/en/");
    return path; // already English
  }
  // target === "ar"
  if (path === "" || path === "/" || /^\/index\.html$/.test(path)) return "/pages/ar/home/";
  if (path.includes("/pages/en/")) return path.replace("/pages/en/", "/pages/ar/");
  return path; // already Arabic
}

function storeLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (_) {
    /* private mode / storage disabled — non-fatal */
  }
}

/* -------------------------------------------------------------
   Public init — called from main.js after "partials:loaded".
   ------------------------------------------------------------- */
export function initLangSwitch() {
  const currentLang = document.documentElement.lang === "ar" ? "ar" : "en";
  const path = window.location.pathname;

  document.querySelectorAll("[data-lang-switch]").forEach((widget) => {
    widget.querySelectorAll("a[data-lang]").forEach((link) => {
      const target = link.dataset.lang === "ar" ? "ar" : "en";
      link.setAttribute("href", counterpartUrl(path, target));

      if (target === currentLang) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }

      link.addEventListener("click", () => storeLang(target));
    });
  });
}
