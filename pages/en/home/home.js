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
   HOME — page interactions & motion (§G motion pass)
   Scope: .page-home  ·  Owner: Mazen
   Depends on: /assets/js/site-data.js
   Everything is progressive enhancement: adds .has-js first, then
   wires reveals, word headlines, image curtains, counters, hero
   video + parallax, click-to-play videos, the equipment strip,
   scroll-progress, the contact form, contact data + JSON-LD.
   Honours prefers-reduced-motion and Save-Data.
   ============================================================= */

import { SITE } from "/assets/js/site-data.js";

const root = document.querySelector(".page-home");
const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SAVE_DATA = Boolean(navigator.connection && navigator.connection.saveData);
const DIR = document.documentElement.dir === "rtl" ? "rtl" : "ltr";

/* -------------------------------------------------------------
   Boot — run after partials:loaded (guarded so we never miss it)
   ------------------------------------------------------------- */
let started = false;
function boot() {
  if (started || !root) return;
  started = true;
  init();
}
document.addEventListener("partials:loaded", boot, { once: true });
// Fallback: run even if the partials never load (e.g. no server).
window.addEventListener("load", () => setTimeout(boot, 400));

function init() {
  root.classList.add("has-js");

  injectJsonLd();
  fillContact();
  setupForm();
  setupVideos();
  setupFleet();
  setupPageProgress();
  setupHero();

  if (REDUCE) {
    writeCountersFinal();   // instant final values
    return;                 // CSS resolves all hidden states instantly
  }

  splitHeadings();
  setupReveals();
  setupRules();
  setupFrames();
  setupHeadingReveal();
  setupCounters();
}

/* =============================================================
   Reveals (staggered) — one observer, unobserve after firing
   ============================================================= */
function makeObserver(cb) {
  return new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        cb(e.target);
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );
}

function setupReveals() {
  // Stagger reveal siblings that share a parent by 80ms each.
  const groups = new Map();
  document.querySelectorAll(".page-home .reveal").forEach((el) => {
    const arr = groups.get(el.parentElement) || [];
    arr.push(el);
    groups.set(el.parentElement, arr);
  });
  groups.forEach((arr) => {
    arr.forEach((el, i) => {
      if (arr.length > 1) el.style.setProperty("--reveal-delay", `${i * 80}ms`);
    });
  });

  const io = makeObserver((el) => el.classList.add("is-visible"));
  document.querySelectorAll(".page-home .reveal").forEach((el) => io.observe(el));
}

function setupRules() {
  const io = makeObserver((el) => el.classList.add("is-visible"));
  document.querySelectorAll(".page-home .section-rule").forEach((el) => io.observe(el));
}

function setupFrames() {
  const io = makeObserver((el) => el.classList.add("is-visible"));
  document.querySelectorAll(".page-home .home-frame").forEach((el) => io.observe(el));
}

/* =============================================================
   Headlines — reveal word by word (split by WORDS only)
   ============================================================= */
function splitHeadings() {
  document.querySelectorAll(".page-home h1, .page-home h2").forEach((h) => {
    if (h.dataset.split) return;
    const text = h.textContent.replace(/\s+/g, " ").trim();
    if (!text) return;
    h.setAttribute("aria-label", text);
    h.dataset.split = "1";
    const frag = document.createDocumentFragment();
    text.split(" ").forEach((word, i, arr) => {
      const outer = document.createElement("span");
      outer.className = "home-word";
      outer.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.className = "home-word__inner";
      inner.textContent = word;
      inner.style.setProperty("--word-delay", `${i * 70}ms`);
      outer.appendChild(inner);
      frag.appendChild(outer);
      if (i < arr.length - 1) frag.appendChild(document.createTextNode(" "));
    });
    h.textContent = "";
    h.appendChild(frag);
  });
}

function setupHeadingReveal() {
  const io = makeObserver((h) => {
    h.querySelectorAll(".home-word").forEach((w) => w.classList.add("is-visible"));
  });
  document.querySelectorAll(".page-home h1[data-split], .page-home h2[data-split]").forEach((h) => io.observe(h));
}

/* =============================================================
   Counters (stats + QHSE pillars)
   ============================================================= */
function formatCount(n, plain) {
  return plain ? String(n) : Number(n).toLocaleString("en-US");
}

function writeCountersFinal() {
  document.querySelectorAll(".page-home [data-az-count]").forEach((el) => {
    const target = Number(el.dataset.azCount);
    const suffix = el.dataset.azCountSuffix || "";
    const plain = el.dataset.azCountPlain === "true";
    const pad = el.classList.contains("home-pillar__num");
    el.textContent = pad ? String(target).padStart(2, "0") : formatCount(target, plain) + suffix;
  });
}

function animateCount(el) {
  const target = Number(el.dataset.azCount);
  const suffix = el.dataset.azCountSuffix || "";
  const plain = el.dataset.azCountPlain === "true";
  const pad = el.classList.contains("home-pillar__num");
  if (plain) { el.textContent = String(target) + suffix; return; }

  const dur = 1600;
  const start = performance.now();
  const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic
  function frame(now) {
    const t = Math.min(1, (now - start) / dur);
    const val = Math.round(target * ease(t));
    el.textContent = pad ? String(val).padStart(2, "0") : formatCount(val, false) + suffix;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = pad ? String(target).padStart(2, "0") : formatCount(target, false) + suffix;
  }
  requestAnimationFrame(frame);
}

function setupCounters() {
  const io = makeObserver((el) => animateCount(el));
  document.querySelectorAll(".page-home [data-az-count]").forEach((el) => io.observe(el));
}

/* =============================================================
   Hero — video fade-in, Ken Burns handoff, light parallax
   ============================================================= */
function setupHero() {
  const hero = document.querySelector(".home-hero");
  if (!hero) return;
  const video = hero.querySelector(".home-hero__video");
  const source = video && video.querySelector("source[data-src]");

  // Load the video only when motion + data allow it; otherwise poster stays.
  if (video && source && !REDUCE && !SAVE_DATA) {
    source.src = source.dataset.src;
    video.load();
    video.addEventListener("loadeddata", () => video.classList.add("is-loaded"), { once: true });
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } else if (video) {
    video.removeAttribute("autoplay");
    try { video.pause(); } catch (_) {}
  }

  if (REDUCE) return;

  // Light parallax on the media layer, only while the hero is in view.
  const media = hero.querySelector(".home-hero__media");
  if (!media) return;
  let ticking = false;
  let active = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const shift = Math.min(window.scrollY * 0.12, hero.offsetHeight);
      media.style.transform = `translate3d(0, ${shift}px, 0)`;
      ticking = false;
    });
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      active = e.isIntersecting;
      if (active) {
        media.style.willChange = "transform";
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        window.removeEventListener("scroll", onScroll);
        media.style.willChange = "auto";
      }
    });
  });
  io.observe(hero);
}

/* =============================================================
   Click-to-play videos (§10 development, §15 showcase)
   ============================================================= */
function setupVideos() {
  document.querySelectorAll(".page-home .home-video__play").forEach((btn) => {
    const frame = btn.closest(".home-video__frame");
    const video = frame && frame.querySelector(".home-video__el");
    const source = video && video.querySelector("source[data-src]");
    if (!video) return;
    btn.addEventListener("click", async () => {
      if (source && !source.src) { source.src = source.dataset.src; video.load(); }
      video.setAttribute("controls", "");
      try {
        await video.play();
        btn.classList.add("is-hidden");
      } catch {
        let note = frame.parentElement.querySelector('[data-az-playback-status]');
        if (!note) {
          note = document.createElement('p');
          note.dataset.azPlaybackStatus = '';
          note.setAttribute('role', 'status');
          frame.after(note);
        }
        note.textContent = document.documentElement.lang === 'ar'
          ? 'تعذر تشغيل الفيديو. حاول مرة أخرى لاحقاً.'
          : 'The video could not play. Please try again later.';
      }
    });
  });
}

/* =============================================================
   Equipment strip — keyboard scroll + progress bar
   ============================================================= */
function setupFleet() {
  const strip = document.querySelector("[data-az-fleet]");
  const bar = document.querySelector("[data-az-fleet-bar]");
  if (!strip) return;

  const step = () => {
    const card = strip.querySelector(".home-fleet__card");
    return card ? card.getBoundingClientRect().width + 20 : 320;
  };

  strip.addEventListener("keydown", (e) => {
    const dirSign = DIR === "rtl" ? -1 : 1;
    if (e.key === "ArrowRight") { strip.scrollBy({ left: step() * dirSign, behavior: REDUCE ? "auto" : "smooth" }); e.preventDefault(); }
    else if (e.key === "ArrowLeft") { strip.scrollBy({ left: -step() * dirSign, behavior: REDUCE ? "auto" : "smooth" }); e.preventDefault(); }
  });

  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = strip.scrollWidth - strip.clientWidth;
    const ratio = max > 0 ? Math.min(1, Math.abs(strip.scrollLeft) / max) : 0;
    bar.style.transform = `scaleX(${Math.max(0.06, ratio)})`;
    ticking = false;
  };
  update();
  strip.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
}

/* =============================================================
   Page scroll-progress bar
   ============================================================= */
function setupPageProgress() {
  const bar = document.querySelector("[data-az-progress]");
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = `scaleX(${ratio})`;
    ticking = false;
  };
  update();
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
}

/* =============================================================
   Contact data from site-data.js (never hard-coded in HTML)
   ============================================================= */
function fillContact() {
  const set = (sel, value, href) => {
    const el = document.querySelector(`[data-az-site="${sel}"]`);
    if (!el || !value) return;
    el.innerHTML = `<span class="ltr-inline">${value}</span>`;
    if (href) el.setAttribute("href", href);
  };
  if (SITE.phones && SITE.phones[0]) set("phone-0", SITE.phones[0].display, `tel:${SITE.phones[0].tel}`);
  if (SITE.phones && SITE.phones[1]) set("phone-1", SITE.phones[1].display, `tel:${SITE.phones[1].tel}`);
  if (SITE.emails && SITE.emails.info) set("email-info", SITE.emails.info, `mailto:${SITE.emails.info}`);
}

/* =============================================================
   Contact form — validation + aria-live status (no backend)
   ============================================================= */
function setupForm() {
  const form = document.querySelector("[data-az-contact-form]");
  if (!form) return;
  const status = form.querySelector("[data-az-form-status]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;

    form.querySelectorAll("[required]").forEach((field) => {
      const wrap = field.closest(".home-field");
      const valid = field.type === "email"
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
        : field.value.trim() !== "";
      if (!valid) { ok = false; if (wrap) wrap.classList.add("has-error"); }
      else if (wrap) wrap.classList.remove("has-error");
    });

    if (!status) return;
    status.hidden = false;
    // Localised messages come from the form's data-* attributes (English fallback),
    // so the shared handler serves both the EN and AR pages.
    if (ok) {
      status.textContent = openInquiryDraft(form);
    } else {
      status.textContent = form.dataset.error ||
        "Please complete the required fields with a valid email address.";
    }
  });
}

/* =============================================================
   JSON-LD (Organization + LocalBusiness) from site-data.js
   ============================================================= */
function injectJsonLd() {
  if (!SITE || document.getElementById("home-jsonld")) return;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": SITE.name.en,
        "url": SITE.domain,
        "foundingDate": String(SITE.founded),
        "logo": SITE.domain + "/assets/images/logo/logo-full.svg",
        "telephone": SITE.phones.map((p) => p.tel),
        "email": Object.values(SITE.emails),
      },
      {
        "@type": "LocalBusiness",
        "name": SITE.name.en,
        "url": SITE.domain,
        "image": SITE.domain + "/assets/images/shared/og-image.jpg",
        "telephone": SITE.phones[0] ? SITE.phones[0].tel : undefined,
        "email": SITE.emails.info,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": SITE.address.en,
          "addressLocality": "Cairo",
          "addressCountry": "EG",
        },
        "areaServed": "EG",
      },
    ],
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.id = "home-jsonld";
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}
