/* =============================================================
   MAIN — site bootstrap. Injects the navbar/footer partials, then
   wires navbar / footer / language switcher / scroll animations
   once "partials:loaded" fires. Loaded on every page via
   <script type="module" src="/assets/js/main.js" defer>.
   ============================================================= */

import { injectPartials } from "/assets/js/include.js";
import { initNavbar } from "/assets/js/navbar.js";
import { initFooter } from "/assets/js/footer.js";
import { initLangSwitch } from "/assets/js/lang-switch.js";
import { initAnimations } from "/assets/js/animations.js";

/* Bind the partial-dependent modules AFTER the navbar/footer HTML
   is in the DOM. include.js dispatches "partials:loaded". */
document.addEventListener(
  "partials:loaded",
  () => {
    initNavbar();
    initFooter();
    initLangSwitch();
  },
  { once: true }
);

function boot() {
  injectPartials();      // async — dispatches "partials:loaded" when done
  initAnimations();      // page content is already in the DOM
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
