/* =============================================================
   FOOTER — binds after "partials:loaded". Populates the footer
   from site-data.js (contact data lives ONLY there), injects the
   current year, and renders working contact links.
   SHARED FILE — coordinate before editing (see CLAUDE.md §12).
   ============================================================= */

import { SITE } from "/assets/js/site-data.js";

/* Navigation-structure data (labels, not contact data). Quick links
   mirror the primary nav; services point at the 6 detail pages. */
const SERVICES = [
  { section: "services-road-bridge", slug: "road-and-bridge-construction", en: "Road & Bridge Construction", ar: "إنشاء الطرق والكباري" },
  { section: "services-management", slug: "project-management",           en: "Project Management",          ar: "إدارة المشاريع" },
  { section: "services-planning", slug: "strategic-planning",           en: "Strategic Planning",          ar: "التخطيط الاستراتيجي" },
  { section: "services-execution", slug: "project-execution",            en: "Project Execution",           ar: "تنفيذ المشاريع" },
  { section: "services-quality", slug: "quality-assurance",            en: "Quality Assurance",           ar: "ضمان الجودة" },
  { section: "services-machinery", slug: "machinery-and-equipment",      en: "Machinery & Equipment",       ar: "الآليات والمعدات" },
];

function hrefFor(slug, lang) {
  if (slug === "") return lang === "ar" ? "/pages/ar/home/" : "/";
  return `/pages/${lang}/${slug}/`;
}

function fillLinks(el, items, lang, base) {
  if (!el) return;
  el.innerHTML = items
    .map((item) => {
      const href = base ? `${base}#${item.section}` : hrefFor(item.slug, lang);
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
    // Footer shows all five mailboxes.
    const primary = [SITE.emails.info, SITE.emails.service, SITE.emails.support, SITE.emails.sarah, SITE.emails.morad];
    emails.innerHTML = primary
      .map((mail) => `<a href="mailto:${mail}" class="ltr-inline">${mail}</a>`)
      .join("");
  }

  // Office lines from SITE.branches. Fax numbers are plain text, never tel: links.
  const branch = (id) => (SITE.branches || []).find((b) => b.id === id);
  const setTel = (el, line) => {
    if (!el || !line) return;
    el.href = `tel:${line.tel}`;
    el.textContent = line.display;
    el.classList.add("ltr-inline");
  };
  const setText = (el, text) => { if (el && text) el.textContent = text; };

  const hq = branch("cairo-hq");
  if (hq) {
    setTel(root.querySelector("[data-az-hq-landline]"), hq.landline);
    setText(root.querySelector("[data-az-hq-fax]"), hq.fax && hq.fax.display);
  }

  const sharqia = branch("sharqia");
  if (sharqia) {
    setText(root.querySelector("[data-az-sharqia-name]"), sharqia[lang]);
    setTel(root.querySelector("[data-az-sharqia-landline]"), sharqia.landline);
    setText(root.querySelector("[data-az-sharqia-fax]"), sharqia.fax && sharqia.fax.display);
  }
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
}
