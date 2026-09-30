function openInquiryDraft(form) {
  const ar = document.documentElement.lang === "ar";
  const body = [...new FormData(form).entries()]
    .filter(([name]) => name !== "website")
    .map(([name, value]) => `${name}: ${value}`).join("\n");
  const subject = ar ? "استفسار من الموقع" : "Website inquiry";
  window.location.href = `mailto:${SITE.emails.info}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return ar
    ? "افتح تطبيق البريد وأرسل المسودة لإكمال الاستفسار. إذا لم يفتح التطبيق، استخدم رابط البريد أو الهاتف أعلاه."
    : "An email draft was requested in your email app. Send it there to complete your inquiry. If no app opens, use the email or phone link above.";
}

/* =============================================================
   CONTACT US — page script
   Shared by /pages/en/contact-us/ and /pages/ar/contact-us/.
   - Fills phones / emails / address from site-data.js (the single
     source of truth — CLAUDE.md §6.4) into [data-az-*] mounts.
   - Form validation and email draft.
   - FAQ accordion, map overlays, WhatsApp float button.
   Reveal-on-scroll is handled globally by animations.js via
   [data-az-reveal] / [data-az-reveal-delay].
   ============================================================= */

import { SITE } from "/assets/js/site-data.js";

const lang = document.documentElement.lang === "ar" ? "ar" : "en";
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TEXT = {
  en: {
    required: "Please fill in this field.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.",
    summary: (n) => `Please check the ${n === 1 ? "highlighted field" : `${n} highlighted fields`}.`,
  },
  ar: {
    required: "يُرجى تعبئة هذا الحقل.",
    email: "يُرجى إدخال بريد إلكتروني صحيح.",
    phone: "يُرجى إدخال رقم هاتف صحيح.",
    summary: (n) => (n === 1 ? "يُرجى مراجعة الحقل المُشار إليه." : `يُرجى مراجعة الحقول المُشار إليها (${n}).`),
  },
}[lang];

/* ── Contact data from site-data.js ───────────────────────── */
function fillSiteData() {
  // <a data-az-phone="0"> → tel: link for SITE.phones[0]
  document.querySelectorAll("[data-az-phone]").forEach((el) => {
    const phone = SITE.phones[Number(el.dataset.azPhone)];
    if (!phone) return;
    el.href = `tel:${phone.tel}`;
    el.textContent = phone.display;
  });

  // <a data-az-email="info"> → mailto: link for SITE.emails.info
  document.querySelectorAll("[data-az-email]").forEach((el) => {
    const mail = SITE.emails[el.dataset.azEmail];
    if (!mail) return;
    el.href = `mailto:${mail}`;
    el.textContent = mail;
  });

  // <a data-az-whatsapp> → wa.me link for the primary mobile
  const waNumber = SITE.phones[0].tel.replace(/\D/g, "");
  document.querySelectorAll("[data-az-whatsapp]").forEach((el) => {
    el.href = `https://wa.me/${waNumber}`;
    if (el.hasAttribute("data-az-whatsapp-text")) el.textContent = SITE.phones[0].display;
  });

  // <span data-az-address> → head-office address in the page language
  document.querySelectorAll("[data-az-address]").forEach((el) => {
    el.textContent = SITE.address[lang];
  });
}

/* ── Structured data: LocalBusiness from site-data.js ─────── */
function injectLocalBusiness() {
  const data = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": `${SITE.domain}/#organization`,
    name: SITE.name[lang],
    url: SITE.domain,
    foundingDate: String(SITE.founded),
    email: SITE.emails.info,
    telephone: SITE.phones.map((p) => p.tel),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address[lang],
      addressLocality: lang === "ar" ? "القاهرة" : "Cairo",
      addressCountry: "EG",
    },
    // TODO(seo): add the Sharqia branch as a second "department" /
    // LocalBusiness once site-data.js exposes SITE.branches.
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/* ── Form validation and email draft ─────────────────────────── */
function initForm() {
  const form = document.querySelector("[data-az-contact-form]");
  if (!form) return;
  const status = form.querySelector("[data-az-form-status]");

  function fieldError(field) {
    const value = field.value.trim();
    if (field.required && !value) return TEXT.required;
    if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return TEXT.email;
    if (field.type === "tel" && value && !/^\+?[\d\s()-]{7,20}$/.test(value)) return TEXT.phone;
    return "";
  }

  function show(field, message) {
    const hint = document.getElementById(`${field.id}-error`);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (hint) {
      hint.textContent = message;
      hint.hidden = !message;
    }
  }

  // Re-validate a field as soon as the user fixes it
  form.addEventListener("input", (e) => {
    if (e.target.getAttribute("aria-invalid") === "true") show(e.target, fieldError(e.target));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fields = [...form.querySelectorAll("input, select, textarea")];
    const invalid = fields.filter((f) => {
      const msg = fieldError(f);
      show(f, msg);
      return Boolean(msg);
    });

    if (invalid.length) {
      status.textContent = TEXT.summary(invalid.length);
      status.dataset.state = "error";
      invalid[0].focus();
      return;
    }

    status.textContent = openInquiryDraft(form);
    status.dataset.state = "draft";
  });
}

/* ── FAQ accordion ────────────────────────────────────────── */
function initFaq() {
  document.querySelectorAll("[data-az-faq-toggle]").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("grid-rows-[1fr]", open);
      panel.classList.toggle("grid-rows-[0fr]", !open);
      panel.inert = !open;
    });
  });
}

/* ── Maps: fade the loading overlay once the iframe loads ─── */
function initMaps() {
  document.querySelectorAll("[data-az-map]").forEach((wrap) => {
    const frame = wrap.querySelector("iframe");
    const overlay = wrap.querySelector("[data-az-map-overlay]");
    if (!frame || !overlay) return;
    const hide = () => overlay.classList.add("opacity-0");
    frame.addEventListener("load", hide, { once: true });
    // Fallback: the iframe may already have loaded before this ran (cache)
    setTimeout(hide, 6000);
  });
}

/* ── WhatsApp float button: delayed entrance ──────────────── */
function initWhatsApp() {
  const btn = document.querySelector("[data-az-whatsapp-float]");
  if (!btn) return;
  if (prefersReduced) {
    btn.classList.add("is-visible");
    return;
  }
  setTimeout(() => btn.classList.add("is-visible"), 600);
}

/* ── Bootstrap ────────────────────────────────────────────── */
function init() {
  fillSiteData();
  injectLocalBusiness();
  initForm();
  initFaq();
  initMaps();
  initWhatsApp();
}

// Run after the navbar/footer partials are in. include.js has no
// "already loaded" flag, so treat an injected footer as proof the
// event has fired before this module ran.
if (document.querySelector("#site-footer .footer")) {
  init();
} else {
  document.addEventListener("partials:loaded", init, { once: true });
}
