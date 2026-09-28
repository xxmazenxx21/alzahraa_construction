/* =============================================================
   FOOTER — binds after "partials:loaded". Populates the footer
   from site-data.js (contact data lives ONLY there), injects the
   current year, and wires the newsletter stub.
   SHARED FILE — coordinate before editing (see CLAUDE.md §12).
   ============================================================= */

import { SITE } from "/assets/js/site-data.js";

/* Navigation-structure data (labels, not contact data). Quick links
   mirror the primary nav; services point at the 6 detail pages. */
const SERVICES = [
  { slug: "road-and-bridge-construction", en: "Road & Bridge Construction", ar: "إنشاء الطرق والكباري" },
  { slug: "project-management",           en: "Project Management",          ar: "إدارة المشاريع" },
  { slug: "strategic-planning",           en: "Strategic Planning",          ar: "التخطيط الاستراتيجي" },
  { slug: "project-execution",            en: "Project Execution",           ar: "تنفيذ المشاريع" },
  { slug: "quality-assurance",            en: "Quality Assurance",           ar: "ضمان الجودة" },
  { slug: "machinery-and-equipment",      en: "Machinery & Equipment",       ar: "الآليات والمعدات" },
];

function hrefFor(slug, lang) {
  if (slug === "") return lang === "ar" ? "/pages/ar/home/" : "/";
  return `/pages/${lang}/${slug}/`;
}

function fillLinks(el, items, lang, base) {
  if (!el) return;
  el.innerHTML = items
    .map((item) => {
      const href = base ? `${base}${item.slug}/` : hrefFor(item.slug, lang);
      return `<li><a href="${href}">${item[lang]}</a></li>`;
    })
    .join("");
}

function fillContact(root, lang) {
  const year = root.querySelector("[data-az-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  const address = root.querySelector("[data-az-address]");
  if (address) address.textContent = SITE.address[lang];

  const phones = root.querySelector("[data-az-phones]");
  if (phones) {
    phones.innerHTML = SITE.phones
      .map((p) => `<a href="tel:${p.tel}" class="ltr-inline">${p.display}</a>`)
      .join("");
  }

  const emails = root.querySelector("[data-az-emails]");
  if (emails) {
    // Footer shows the general-purpose mailboxes only.
    const primary = [SITE.emails.info, SITE.emails.service, SITE.emails.support];
    emails.innerHTML = primary
      .map((mail) => `<a href="mailto:${mail}" class="ltr-inline">${mail}</a>`)
      .join("");
  }
}

function wireNewsletter(root) {
  const form = root.querySelector("[data-az-newsletter]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stub — no backend yet (static site)
    const input = form.querySelector('input[type="email"]');
    const note = form.parentElement.querySelector("[data-az-newsletter-note]");
    if (note) {
      note.hidden = false;
      note.textContent = form.dataset.thanks || "Thank you — we'll be in touch.";
    }
    if (input) input.value = "";
  });
}

/* -------------------------------------------------------------
   Public init — called from main.js after "partials:loaded".
   ------------------------------------------------------------- */
export function initFooter() {
  const footer = document.querySelector(".footer");
  if (!footer) return;

  const lang = document.documentElement.lang === "ar" ? "ar" : "en";

  fillLinks(footer.querySelector("[data-az-quicklinks]"), SITE.nav, lang);
  fillLinks(
    footer.querySelector("[data-az-services]"),
    SERVICES,
    lang,
    `/pages/${lang}/our-services/`
  );
  fillContact(footer, lang);
  wireNewsletter(footer);
}
