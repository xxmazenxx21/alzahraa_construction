/* =============================================================
   INCLUDE — fetches /assets/partials/navbar-<lang>.html and
   footer-<lang>.html, injects them into [data-partial] mounts,
   then dispatches the "partials:loaded" event on document.
   ============================================================= */

const PARTIAL_BASE = "/assets/partials";

/**
 * Fetch a single partial's HTML. Returns "" on failure so one
 * missing partial never blocks the other.
 * @param {string} name  e.g. "navbar-en"
 * @returns {Promise<string>}
 */
async function fetchPartial(name) {
  try {
    const res = await fetch(`${PARTIAL_BASE}/${name}.html`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.text();
  } catch (err) {
    console.error(`[include] Could not load partial "${name}":`, err);
    return "";
  }
}

/**
 * Inject the navbar + footer partials for the current <html lang>,
 * then dispatch "partials:loaded" so navbar.js / footer.js can bind.
 * Uses root-absolute paths, so it requires a local server (see CLAUDE.md §2).
 */
export async function injectPartials() {
  const lang = document.documentElement.lang === "ar" ? "ar" : "en";

  const mounts = [
    { el: document.querySelector('[data-partial="navbar"]'), name: `navbar-${lang}` },
    { el: document.querySelector('[data-partial="footer"]'), name: `footer-${lang}` },
  ];

  await Promise.all(
    mounts.map(async ({ el, name }) => {
      if (!el) return;
      el.innerHTML = await fetchPartial(name);
    })
  );

  document.dispatchEvent(new CustomEvent("partials:loaded", { detail: { lang } }));
}
