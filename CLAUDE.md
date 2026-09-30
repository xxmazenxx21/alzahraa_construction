# CLAUDE.md — Al Zahraa Construction Website

> Project bible for Claude Code. Read this file **in full** before touching any file.
> If a rule here conflicts with anything in a chat prompt, **this file wins** unless the human explicitly says "override CLAUDE.md".

---

## 1. Project Overview

| Item                   | Value                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------- |
| **Client**             | Al Zahraa General Contracting, Import & Export Company                              |
| **Industry**           | General contracting — roads, bridges, and civil infrastructure                      |
| **Founded**            | 1995                                                                                |
| **Chairman & Founder** | Eng. Hesham Zidan                                                                   |
| **Old website**        | `https://alzahraa.construction` (WordPress + Elementor — being replaced)            |
| **New website**        | `https://alzahraa-construction.com`                                                 |
| **Languages**          | English (default) + Arabic (RTL)                                                    |
| **Stack**              | Plain HTML5 + CSS3 + Vanilla JavaScript + Tailwind CSS (standalone CLI, no npm). **No other frameworks.** |
| **Hosting**            | Hostinger (static upload / Git deploy)                                              |
| **Team**               | Ahmed + Mazen, working in parallel on different pages                               |

### 1.1 What we are building

A **complete rebuild** of the old site — same information architecture, but far richer:

- Every page must be **long, scroll-heavy, and content-dense** (think 8–14 full sections per page).
- Heavy use of real project photography, drone shots, and video.
- Corporate-developer polish inspired by: `emaarmisr.com`, `talaatmoustafa.com`, `palmhillsdevelopments.com`, `orascom.com`, `hassanallam.com`, `concord-eg.com`.
- Everything the old site had **must survive the migration** — nothing gets dropped.

### 1.2 ⚠️ Critical warning about the old site

The old WordPress site has been **compromised with SEO spam**. The "Our Latest Articles" section contains injected casino/betting posts in Greek, Portuguese, French, Spanish and Arabic, published by user `admin1`.

**Rules:**

- **NEVER** migrate, quote, translate, or reference any content from the old blog/articles section.
- The new News/Insights section starts from **zero** with original, client-approved content only.
- Do not copy the old `robots.txt`, `sitemap.xml`, or any meta tags from the old site.

---

## 2. Non-Negotiable Technical Rules

1. **No UI frameworks except Tailwind CSS.** No React, Vue, Bootstrap, jQuery, or any CDN UI library.
   - **Tailwind CSS** is allowed via the **standalone CLI only** (`tools/tailwindcss.exe`). No npm, no PostCSS, no node_modules.
   - Tailwind is the **primary styling approach** for page-specific CSS. Page CSS files (e.g. `home.css`, `our-services.css`) use `@apply` directives and are imported into `tailwind-input.css` so Tailwind processes them. The compiled `tailwind.css` replaces per-page CSS `<link>` tags in the HTML `<head>`.
   - The shared global files — `variables.css`, `reset.css`, `global.css`, `typography.css`, `utilities.css`, `components.css`, `navbar.css`, `footer.css` — remain separate and are still linked in every page's `<head>`. Only page-specific CSS is processed through `tailwind-input.css`.
   - Compile command: `tools\tailwindcss.exe -i assets/css/tailwind-input.css -o assets/css/tailwind.css --minify`
   - Watch mode (dev): `tools\tailwindcss.exe -i assets/css/tailwind-input.css -o assets/css/tailwind.css --watch`
   - The compiled `assets/css/tailwind.css` is the file you link in pages (`<link rel="stylesheet" href="/assets/css/tailwind.css">`).
   - Allowed external resources: Google Fonts, and **only if explicitly approved**: AOS (scroll animations), Swiper (sliders), Lucide/Feather SVG icons. Prefer writing these by hand.
2. **No build step beyond Tailwind CLI.** The folder you edit is the folder you upload. Running `tailwindcss.exe` is the only allowed compile step.
3. **Every page owns its assets.** Page-specific CSS/JS/images/videos live _inside that page's own folder_. Never dump page styles into a global file.
4. **Only the navbar and footer are shared.** They are written once and injected by JS on every page.
5. **All asset paths are root-absolute** (`/assets/css/reset.css`, `/pages/en/about-us/`). Never use `../../../`. This is what makes a page movable and what keeps the shared partials working from any depth.
6. **Local preview requires a local server** (because of `fetch()` for partials and root-absolute paths):

```bash
   python3 -m http.server 5500
   # then open http://localhost:5500
```

Opening `index.html` with `file://` will break the navbar/footer — this is expected, not a bug. 7. **Semantic HTML only.** `<header> <nav> <main> <section> <article> <aside> <figure> <footer>`. One `<h1>` per page. 8. **Mobile-first CSS.** Base styles are mobile; `@media (min-width: …)` scales up. 9. **No inline styles** in HTML except dynamic values set by JS (e.g. a progress bar width). 10. **No `!important`** unless overriding a third-party style, and it must carry a comment explaining why.

---

## 3. Directory Structure

```
alzahraa-construction/
│
├── CLAUDE.md                       # this file
├── README.md                       # setup + deploy notes
├── .gitignore
├── index.html                      # ENGLISH HOME (site entry point)
├── 404.html                        # English 404
├── robots.txt
├── sitemap.xml
│
├── assets/                         # SHARED ONLY — never page-specific
│   ├── css/
│   │   ├── reset.css               # modern CSS reset
│   │   ├── variables.css           # design tokens (colors, spacing, type…)
│   │   ├── typography.css          # font faces + heading scale
│   │   ├── global.css              # base element styles, container, section rhythm
│   │   ├── utilities.css           # small helper classes
│   │   ├── components.css          # shared buttons, cards, badges, breadcrumbs
│   │   ├── navbar.css
│   │   ├── footer.css
│   │   └── rtl.css                 # ALL Arabic/RTL overrides live here
│   │
│   ├── js/
│   │   ├── site-data.js            # single source of truth: phones, emails, address, nav items, socials
│   │   ├── include.js              # fetch + inject HTML partials
│   │   ├── navbar.js               # mobile menu, sticky behaviour, active link
│   │   ├── footer.js               # year, newsletter stub
│   │   ├── lang-switch.js          # EN ⇄ AR mapping + localStorage
│   │   ├── animations.js           # IntersectionObserver reveal-on-scroll
│   │   └── main.js                 # bootstraps everything
│   │
│   ├── partials/
│   │   ├── navbar-en.html
│   │   ├── navbar-ar.html
│   │   ├── footer-en.html
│   │   └── footer-ar.html
│   │
│   ├── images/
│   │   ├── logo/                   # logo-full.svg, logo-white.svg, favicon set
│   │   ├── partners/               # government / authority logos
│   │   ├── icons/                  # inline-able SVG icons
│   │   └── shared/                 # patterns, textures, og-image
│   │
│   ├── videos/                     # shared hero/background video only
│   └── fonts/                      # self-hosted fallbacks (optional)
│
└── pages/
    ├── en/
    │   ├── home/                   # assets for the ROOT index.html live here
    │   │   ├── home.css
    │   │   ├── home.js
    │   │   ├── images/
    │   │   └── videos/
    │   │
    │   ├── about-us/
    │   │   ├── index.html
    │   │   ├── about-us.css
    │   │   ├── about-us.js
    │   │   ├── images/
    │   │   └── videos/
    │   │
    │   ├── our-services/
    │   │   ├── index.html  +  our-services.css / .js / images/ / videos/
    │   │   ├── road-and-bridge-construction/     ┐
    │   │   ├── project-management/               │
    │   │   ├── strategic-planning/               │ each = index.html + <slug>.css
    │   │   ├── project-execution/                │ + <slug>.js + images/ + videos/
    │   │   ├── quality-assurance/                │
    │   │   └── machinery-and-equipment/          ┘
    │   │
    │   ├── our-projects/
    │   │   ├── index.html  +  our-projects.css / .js / images/ / videos/
    │   │   ├── al-masoura-bridge/                ┐
    │   │   ├── al-mehwar/                        │
    │   │   ├── regional-ring-road/               │ 8 project detail pages
    │   │   ├── tanta/                            │ each = index.html + <slug>.css
    │   │   ├── al-hussania/                      │ + <slug>.js + images/ + videos/
    │   │   ├── abo-hammad/                       │
    │   │   ├── al-nofaa/                         │
    │   │   └── al-salhia/                        ┘
    │   │
    │   ├── equipment/              # fleet & machinery showcase
    │   ├── our-team/               # leadership, engineers, workforce
    │   ├── quality-safety/         # QHSE: quality, safety, environment, sustainability
    │   ├── clients-partners/       # government authorities & partners
    │   ├── media-center/           # photo + video gallery
    │   ├── news/                   # original articles (NOT migrated)
    │   ├── careers/                # jobs + application form
    │   └── contact-us/             # form + map + all branches
    │
    └── ar/                         # EXACT MIRROR of en/, plus:
        ├── home/
        │   └── index.html          # Arabic home page (EN home is at root)
        ├── about-us/
        ├── … (identical folder names — slugs stay in English)
        └── 404.html
```

### 3.1 Structural rules

- **Folder slugs are always English**, in both `en/` and `ar/`. Only the _content_ is translated. This keeps the language switcher a trivial string swap.
- **English home is `/index.html` at the root**; its CSS/JS/media live in `/pages/en/home/`.
- **Arabic home is `/pages/ar/home/index.html`**.
- **Heavy media is never duplicated.** Photos and videos are stored once in the **English** page folder; the Arabic page references the same file via root-absolute path.

```html
<!-- inside /pages/ar/our-projects/tanta/index.html -->
<img
  src="/pages/en/our-projects/tanta/images/drone-01.webp"
  alt="طريق سندل – زفتى"
/>
```

- Each page folder must contain `images/` and `videos/` **even if currently empty** (add a `.gitkeep`).

---

## 4. Design System

All tokens live in `/assets/css/variables.css`. **Never hard-code a hex value, px spacing, or font stack anywhere else.**

### 4.1 Colour palette

```css
:root {
  /* ---- Brand: deep engineering navy ---- */
  --az-navy-900: #0a1a2f; /* darkest — hero overlays, footer */
  --az-navy-800: #0f2742; /* primary surfaces */
  --az-navy-700: #163457; /* hover on navy */
  --az-navy-600: #1e4d7b; /* secondary / links on light */

  /* ---- Accent: safety amber (roads & signage) ---- */
  --az-amber-600: #c98900;
  --az-amber-500: #f2a900; /* PRIMARY ACCENT — CTAs, underlines, stat numbers */
  --az-amber-400: #ffc33d;
  --az-amber-100: #fff3d6;

  /* ---- Neutrals: concrete & asphalt ---- */
  --az-ink-900: #11161c; /* body text */
  --az-gray-700: #3a424c;
  --az-gray-600: #6b7480; /* muted text */
  --az-gray-400: #a9b1bc; /* disabled, dividers on dark */
  --az-gray-200: #e3e6eb; /* borders */
  --az-gray-100: #f2f4f7;
  --az-gray-50: #f7f8fa; /* alternating section bg */
  --az-sand-100: #f5f1ea; /* warm alt section bg */
  --az-white: #ffffff;

  /* ---- Status ---- */
  --az-success: #2e7d5b;
  --az-warning: #e08700;
  --az-danger: #c0392b;

  /* ---- Semantic aliases: USE THESE IN COMPONENTS ---- */
  --color-bg: var(--az-white);
  --color-bg-alt: var(--az-gray-50);
  --color-bg-warm: var(--az-sand-100);
  --color-bg-dark: var(--az-navy-900);
  --color-surface: var(--az-white);
  --color-text: var(--az-ink-900);
  --color-text-muted: var(--az-gray-600);
  --color-text-invert: var(--az-white);
  --color-primary: var(--az-navy-800);
  --color-primary-hover: var(--az-navy-700);
  --color-on-primary: var(--az-white);
  --color-accent: var(--az-amber-500);
  --color-accent-hover: var(--az-amber-600);
  --color-on-accent: var(--az-navy-900);
  --color-border: var(--az-gray-200);
  --color-focus: var(--az-amber-500);

  /* ---- Overlays for hero video/images ---- */
  --overlay-hero: linear-gradient(
    180deg,
    rgba(10, 26, 47, 0.72) 0%,
    rgba(10, 26, 47, 0.45) 45%,
    rgba(10, 26, 47, 0.85) 100%
  );
  --overlay-card: linear-gradient(
    180deg,
    rgba(10, 26, 47, 0) 35%,
    rgba(10, 26, 47, 0.88) 100%
  );
}
```

> **Before first commit:** open the client logo and verify `--az-navy-*` / `--az-amber-*` match it. If not, change them **only here**.

### 4.2 Typography

```css
:root {
  --font-en-heading: "Barlow Condensed", "Archivo", system-ui, sans-serif;
  --font-en-body: "Inter", system-ui, -apple-system, sans-serif;
  --font-ar-heading: "Cairo", "Tajawal", system-ui, sans-serif;
  --font-ar-body: "Tajawal", "Cairo", system-ui, sans-serif;

  --font-heading: var(--font-en-heading);
  --font-body: var(--font-en-body);

  /* Fluid scale — clamp(min, preferred, max) */
  --fs-display: clamp(2.75rem, 1.6rem + 5.2vw, 5.5rem); /* hero H1 */
  --fs-h1: clamp(2.25rem, 1.5rem + 3.2vw, 3.75rem);
  --fs-h2: clamp(1.75rem, 1.25rem + 2.2vw, 2.75rem);
  --fs-h3: clamp(1.375rem, 1.1rem + 1.2vw, 1.875rem);
  --fs-h4: clamp(1.125rem, 1rem + 0.6vw, 1.375rem);
  --fs-lead: clamp(1.0625rem, 1rem + 0.4vw, 1.25rem);
  --fs-body: 1rem;
  --fs-sm: 0.9375rem;
  --fs-xs: 0.8125rem;
  --fs-eyebrow: 0.8125rem; /* uppercase label above H2 */

  --lh-tight: 1.1;
  --lh-snug: 1.3;
  --lh-base: 1.7; /* body copy — generous, this is a content-heavy site */
  --lh-loose: 1.85; /* Arabic body — Arabic needs more leading */

  --ls-tight: -0.02em;
  --ls-eyebrow: 0.16em;
}

html[lang="ar"] {
  --font-heading: var(--font-ar-heading);
  --font-body: var(--font-ar-body);
  --lh-base: var(--lh-loose);
  --ls-tight: 0; /* never negative-track Arabic */
  --ls-eyebrow: 0.04em; /* Arabic does not letter-space well */
}
```

### 4.3 Spacing, radius, shadow, motion, layout

```css
:root {
  /* 4px base scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* vertical rhythm between page sections */
  --section-y: clamp(4rem, 2rem + 7vw, 8rem);
  --section-y-sm: clamp(2.5rem, 1.5rem + 4vw, 5rem);

  --container: 1280px;
  --container-wide: 1520px;
  --container-text: 760px; /* max width for long-form paragraphs */
  --gutter: clamp(1rem, 0.5rem + 2vw, 2.5rem);

  --radius-0: 0;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;

  --shadow-sm:
    0 1px 2px rgba(10, 26, 47, 0.06), 0 1px 3px rgba(10, 26, 47, 0.08);
  --shadow-md:
    0 4px 12px rgba(10, 26, 47, 0.08), 0 2px 4px rgba(10, 26, 47, 0.06);
  --shadow-lg:
    0 12px 32px rgba(10, 26, 47, 0.12), 0 4px 8px rgba(10, 26, 47, 0.06);
  --shadow-xl: 0 24px 60px rgba(10, 26, 47, 0.18);

  --ease-out: cubic-bezier(0.22, 0.61, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-fast: 160ms;
  --dur-base: 280ms;
  --dur-slow: 520ms;

  --z-base: 1;
  --z-sticky: 100;
  --z-navbar: 500;
  --z-dropdown: 600;
  --z-overlay: 800;
  --z-modal: 900;
  --z-toast: 1000;

  --navbar-h: 150px;
  --navbar-h-scrolled: 130px;
}
```

**Breakpoints** (mobile-first, `min-width`):

| Name  | Value  | Target        |
| ----- | ------ | ------------- |
| `sm`  | 480px  | large phones  |
| `md`  | 768px  | tablets       |
| `lg`  | 1024px | small laptops |
| `xl`  | 1280px | desktop       |
| `2xl` | 1536px | large desktop |

### 4.4 Visual language

- **Sharp, engineered feel**: mostly `--radius-sm`, generous whitespace, thin amber rules under headings, uppercase eyebrow labels.
- **Alternate section backgrounds** — `--color-bg` → `--color-bg-alt` → dark navy band → `--color-bg-warm` — so a long page never feels flat.
- **Big numbers**: every page should have at least one stats band (years of experience, km of roads, bridges delivered, workforce, equipment units).
- **Image treatment**: cover crops, subtle zoom-on-hover (`transform: scale(1.04)`), navy gradient overlay on any image carrying text.
- **Buttons**: `.btn-primary` (navy fill), `.btn-accent` (amber fill, navy text), `.btn-ghost` (bordered, transparent). All get a visible `:focus-visible` amber ring.

---

## 5. Bilingual & RTL Rules

### 5.1 Language behaviour

- The site **opens in English by default**. The root `/index.html` is the English home.
- The switcher maps a page to its counterpart by **swapping one path segment**:
  `/pages/en/our-projects/tanta/` ⇄ `/pages/ar/our-projects/tanta/`
  Special case: `/index.html` ⇄ `/pages/ar/home/index.html`.
- The chosen language is stored in `localStorage` under `az_lang`. **Do not auto-redirect on first visit** — the client explicitly wants English first; the stored preference only applies on _return_ visits, and only via the root page.

### 5.2 Required attributes

```html
<!-- English page -->
<html lang="en" dir="ltr">
  <!-- Arabic page -->
  <html lang="ar" dir="rtl"></html>
</html>
```

Every page carries hreflang pairs in `<head>`:

```html
<link
  rel="alternate"
  hreflang="en"
  href="https://alzahraa-construction.com/pages/en/about-us/"
/>
<link
  rel="alternate"
  hreflang="ar"
  href="https://alzahraa-construction.com/pages/ar/about-us/"
/>
<link
  rel="alternate"
  hreflang="x-default"
  href="https://alzahraa-construction.com/"
/>
```

### 5.3 RTL implementation

- **Write LTR CSS using logical properties** so RTL mostly works for free:
  `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-inline-start`, `text-align: start`.
- `/assets/css/rtl.css` is loaded on Arabic pages **only** and handles what logical properties can't:
  - icon/arrow flips: `[dir="rtl"] .icon-arrow { transform: scaleX(-1); }`
  - slider direction, background-position, `box-shadow` x-offsets
  - font-family and line-height overrides (already in `html[lang="ar"]`)
- **Numbers, phone numbers, emails and URLs stay Western/LTR** even inside Arabic text. Wrap them:

```html
<span dir="ltr" class="ltr-inline">01031764534</span>
```

- Arabic headings are **never** letter-spaced or `text-transform: uppercase`.
- Arabic copy is **translated, not transliterated**. Technical terms that Egyptians use in English (e.g. "Asphalt", "Ring Road") may stay English inside Arabic text — wrap them in `<span dir="ltr">` if they break the flow.

---

## 6. Shared Navbar & Footer

These are the **only** two shared UI blocks. They live in `/assets/partials/` and are injected at runtime.

### 6.1 Injection contract

Every page includes exactly these two mount points:

```html
<div id="site-navbar" data-partial="navbar"></div>
<main id="content">… page content …</main>
<div id="site-footer" data-partial="footer"></div>
```

`include.js` reads `document.documentElement.lang`, fetches `/assets/partials/navbar-<lang>.html` and `/assets/partials/footer-<lang>.html`, injects them, then dispatches a `partials:loaded` event. `navbar.js` and `footer.js` bind **after** that event — never on `DOMContentLoaded` alone.

### 6.2 Navbar contents

| EN               | AR               | Path segment     |
| ---------------- | ---------------- | ---------------- |
| Home             | الرئيسية         | `/`              |
| About Us         | من نحن           | `about-us`       |
| Services         | خدماتنا          | `our-services`   |
| Projects         | مشاريعنا         | `our-projects`   |
| Equipment        | المعدات والآليات | `equipment`      |
| Quality & Safety | الجودة والسلامة  | `quality-safety` |
| Media Center     | المركز الإعلامي  | `media-center`   |
| Careers          | الوظائف          | `careers`        |
| Contact Us       | اتصل بنا         | `contact-us`     |

Plus: logo (links home), language switcher (EN / ع), and a `Get a Quote` / `اطلب عرض سعر` accent button.
Behaviour: transparent over hero → solid navy on scroll; shrinks from `--navbar-h` to `--navbar-h-scrolled`; full-screen slide-in drawer below `lg`; current page gets `.is-active` (amber underline).

### 6.3 Footer contents — **exact data, do not alter**

Al Zahraa operates two offices. The footer's primary contact block is the Cairo Head Office; the Sharqia Branch gets a compact summary line linking to its full details on the Contact Us page (see §7.12).

**Cairo — Head Office**

**Mobiles**

```
01031764534
01080005220
```

**Landline / Fax**

```
Landline: 0223337276
Fax: 0223337277
```

**Address (EN)**

```
127 Mohamed Farid St. – Al-Bustan Building – Apartment 53, 5th Floor – Abdin – Cairo
```

**Address (AR)**

```
١٢٧ شارع محمد فريد – عمارة البستان – شقة ٥٣، الدور الخامس – عابدين – القاهرة
```

Render mobiles as `tel:+201031764534` and `tel:+201080005220`. Render the landline as `tel:+20223337276`. Never render the fax number as a `tel:` link — display it as plain LTR text labelled "Fax".

**Sharqia Branch**

**Landline / Fax**

```
Landline: 0554442522
Fax: 0553316266
```

**Address (EN)**

```
Hesham Zidan Street, off Zagazig–Ismailia Road (36 Military), next to the Psychiatric Hospital, Al-Qurain, Sharqia
```

**Address (AR)**

```
شارع هشام زيدان – متفرع من طريق الزقازق – الإسماعيلية (36 عسكري) – بجوار مستشفى الأمراض النفسية – القرين – الشرقية
```

Render the landline as `tel:+20554442522`. Never render the fax number as a `tel:` link.

**Emails**

```
info@alzahraa-construction.com
service@alzahraa-construction.com
support@alzahraa-construction.com
sarah.idris@alzahraa-construction.com
morad.talaat@alzahraa-construction.com
```

The footer shows all five mailboxes. The Contact Us page (§7.12) additionally groups them by purpose with a description for each.

Footer layout: 4 columns → (1) logo + short company blurb + social icons, (2) Quick Links, (3) Services links, (4) Contact block (address, both phones, primary emails) + newsletter stub. Bottom bar: `© <current year> Al Zahraa General Contracting. All rights reserved.` The year is injected by `footer.js`, never hard-coded.

Social links (carry over, verify with client before launch): Facebook, Instagram (`@alzahraagc`), LinkedIn, X/Twitter, YouTube.

### 6.4 All contact data lives in one place

`/assets/js/site-data.js` exports a frozen `SITE` object holding phones, emails, address (EN+AR), socials, and the nav item array. **Never hard-code a phone or email anywhere else** — a change must be a one-line edit in that file.

---

## 7. Page Content Requirements

Every page follows this skeleton, then adds its own sections:

```
[navbar]
[page hero — 60–70vh, background image/video, H1, breadcrumb]
[… 8–14 content sections, alternating backgrounds …]
[CTA band — navy or amber, one clear action]
[footer]
```

Home uses a **full-height (100vh)** hero with looping muted background video instead.

### §8.1 Placeholder Numbers (Temporary Data)

Do NOT use `[TBC]` as visible text on the page — it looks unfinished 
and unprofessional if a stakeholder previews the site before real 
data arrives.

Instead, use a realistic-looking placeholder number, and mark it 
with an HTML comment immediately after it so it stays traceable:

```html
<span class="stat-number">42</span>
<!-- PLACEHOLDER: confirm real fleet count with client -->
```

Rules for placeholder numbers:
- The number must look plausible for the context (a "Rollers & Compactors" 
  count should be a realistic small number, not 9999 or 1).
- Every placeholder number MUST have a `<!-- PLACEHOLDER: ... -->` comment 
  right after it, describing what needs confirming.
- Never place a placeholder number without its comment — the comment is 
  what makes it findable later.
- Before any page is marked "done" (§14 Definition of Done), run a 
  project-wide search for `PLACEHOLDER` and confirm zero results remain, 
  or list any remaining ones explicitly to the client/owner.
- This applies to fleet counts, spec-table values, percentages, hours, 
  capacities, model numbers — any figure not explicitly confirmed by 
  the client.

### 7.1 Home — `/index.html`

1. Full-screen video hero, headline, dual CTA, scroll cue, social rail
2. Intro / "Who we are" with the 1995 founding line + key figures
3. Stats band (years, km of roads, bridges, projects, employees, equipment)
4. Chairman's message — portrait of Eng. Hesham Zidan + full quote
5. Services grid (6 cards → link to service detail pages)
6. Featured projects (4–6 cards with image, location, scope, year)
7. Vision & Mission split panel
8. Why choose Al Zahraa (6 differentiators with icons)
9. Development works / capability narrative + video
10. Equipment & fleet teaser strip
11. Our team / workforce band
12. Quality, safety & sustainability teaser
13. Government partners & clients logo wall
14. Video showcase ("Watch Our Projects") — 2–3 embedded project videos
15. Latest news (3 cards — original content only)
16. Contact CTA band + short inquiry form

### 7.2 About Us — `/pages/{lang}/about-us/`

Company story & 1995 origin · Chairman's full message · Vision · Mission · Core values (6) · Milestones timeline (1995 → today) · Organisational capability · Certifications & classifications (client to supply) · Leadership team · Stats band · Partners · CTA

### 7.3 Our Services — `/pages/{lang}/our-services/`

Overview + 6 service cards linking to detail pages. Each detail page: hero · what it covers · our approach (numbered process) · capabilities list · equipment used · related projects · FAQ · CTA.

The 6 services (carried over from the old site, expanded):
`road-and-bridge-construction` · `project-management` · `strategic-planning` · `project-execution` · `quality-assurance` · `machinery-and-equipment`

### 7.4 Our Projects — `/pages/{lang}/our-projects/`

Filterable grid (All / Bridges / Roads / Infrastructure), each card → detail page.

**The 8 real projects — keep these names and slugs exactly:**

| Slug                 | EN name                        | Notes from old site                                  |
| -------------------- | ------------------------------ | ---------------------------------------------------- |
| `al-masoura-bridge`  | Al-Masoura Bridge at km 10+160 | bridge                                               |
| `al-mehwar`          | Al-Mehwar                      | axis road                                            |
| `regional-ring-road` | Regional Ring Road             | major national project                               |
| `tanta`              | Tanta                          | dual-way roads, Sandal → Zefta, Phase 1 length 10 km |
| `al-hussania`        | Al-Hussania                    | road works                                           |
| `abo-hammad`         | Abo-Hammad                     | described as a "new benchmark" project               |
| `al-nofaa`           | Al-Nofaa                       | road works                                           |
| `al-salhia`          | Al-Salhia                      | road works                                           |

Each project detail page: hero image · fact sheet table (client, location, scope, length, value, duration, status) · challenge → solution narrative · execution phases · photo gallery (8–20 images) · drone video · technical specs · related projects · CTA.

### 7.5 Equipment — `/pages/{lang}/equipment/`

Fleet overview · categories (asphalt pavers, rollers, excavators, loaders, graders, crushers, transport, batching plants) · spec cards · maintenance & workshop capability · gallery · stats.

### 7.6 Our Team — `/pages/{lang}/our-team/`

Leadership · engineering department · site supervision · workforce · training & development · photo gallery. (Old site had three team cards: _Our team / Al Zahraa Machines_, _Equipment_, _Builders and Engineers_ — expand these properly.)

### 7.7 Quality & Safety — `/pages/{lang}/quality-safety/`

Quality policy · QC process at each stage · testing & laboratory · HSE policy · safety record & KPIs · training · environment & sustainability · certifications.

### 7.8 Clients & Partners — `/pages/{lang}/clients-partners/`

**Confirmed from the old site (real — keep):**

| Entity                              | Sub-entity                                                           |
| ----------------------------------- | -------------------------------------------------------------------- |
| Ministry of Housing · وزارة الإسكان | Central Agency for Reconstruction · الجهاز المركزي للتعمير           |
| Ministry of Transport · وزارة النقل | General Authority for Roads & Bridges · الهيئة العامة للطرق والكباري |
| Ministry of Defense · وزارة الدفاع  | Engineering Authority · الهيئة الهندسية للقوات المسلحة               |

**Candidates to add — MUST be confirmed by the client in writing before publishing:**
New Urban Communities Authority (NUCA) · National Authority for Tunnels · Ministry of Local Development · Sharqia / Gharbia / Dakahlia Governorates · Armed Forces Engineering Authority projects · Holding Company for Roads, Bridges & Land Transport.

> ⚠️ **Never invent a client or partner.** Falsely claiming a government relationship is a legal risk for the client. If unconfirmed, leave the logo slot out.

### 7.9 Media Center — `/pages/{lang}/media-center/`

Photo gallery with lightbox (filter by project) · video library · drone footage · downloads (company profile PDF, when supplied).

### 7.10 News — `/pages/{lang}/news/`

Listing + article template. **Starts empty / with client-approved content only.** Nothing from the old blog.

### 7.11 Careers — `/pages/{lang}/careers/`

Why work with us · culture · benefits · open positions (accordion) · application form (name, email, phone, position, CV upload, message) · life at Al Zahraa gallery.

### 7.12 Contact Us — `/pages/{lang}/contact-us/`

Hero · contact cards (both phones, all five emails grouped by purpose) · head office address · embedded Google Map for 127 Mohamed Farid St., Abdin, Cairo · full inquiry form · department directory · working hours (confirm with client) · WhatsApp float button.

---

## 8. Content & Copywriting Rules

- **Tone:** confident, technical, institutional. This company works with ministries — the copy must read like an infrastructure contractor, not a startup.
- **No lorem ipsum. Ever.** The old site had `"This is Photoshop's version of lorem ipsum"` visible in production. If real content is missing, write realistic domain-appropriate copy and mark it:

```html
<!-- TODO(content): draft copy — confirm figures with client -->
```

- **No invented numbers.** Project values, lengths, dates, and certifications must come from the client. If you need a placeholder, use `[TBC]`, never a fabricated figure.
- Carried-over facts that are **confirmed**: founded 1995 · specialises in roads and bridges · Chairman & Founder Eng. Hesham Zidan · "over three decades of leadership" · head office in Abdin, Cairo.
- Fix the old site's errors: the stray name **"Peter Johns"** on the About/Development sections is placeholder junk — remove it.
- Every section needs a **short eyebrow label + H2 + lead paragraph** before its body, so long pages stay scannable.

---

## 9. Media Rules

- **Images:** `.webp` primary with `.jpg` fallback via `<picture>`. Max 1920px wide for heroes, 1200px for cards. Compress to ≤ 250 KB for heroes, ≤ 120 KB for cards.
- **Naming:** `kebab-case-descriptive.webp` — e.g. `tanta-drone-overview-01.webp`. No `IMG-20240826-WA0012.jpg`.
- **Always** set `width`, `height`, `alt`, and `loading="lazy"` (except the LCP hero image, which is `loading="eager"` + `fetchpriority="high"`).
- `alt` text is translated per language.
- **Videos:** `.mp4` (H.264) + `.webm`. Background videos: `muted autoplay loop playsinline preload="metadata"` and a `poster` image. Keep background clips under 8 MB. Never autoplay with sound.
- Respect `prefers-reduced-motion`: pause background video and disable reveal animations.
- Migrate usable media from the old site, but **rename and re-compress** everything.

---

## 10. SEO, Accessibility & Performance

**SEO per page:** unique `<title>` (≤ 60 chars) and `<meta name="description">` (≤ 160 chars) in both languages · canonical · Open Graph + Twitter card · `hreflang` pair · JSON-LD (`Organization` + `LocalBusiness` sitewide, `BreadcrumbList` on inner pages, `Project`/`Article` where relevant) · descriptive `<h1>`–`<h6>` hierarchy.

**Accessibility (target WCAG 2.1 AA):** visible `:focus-visible` outline using `--color-focus` · skip-to-content link · ≥ 4.5:1 contrast for body text · all icon-only buttons get `aria-label` · mobile menu handles `aria-expanded` + focus trap + `Esc` · forms use real `<label>` elements · no keyboard trap in the lightbox.

**Performance targets:** LCP < 2.5s · CLS < 0.1 · total page weight < 3 MB · preconnect to `fonts.gstatic.com` · `font-display: swap` · page CSS/JS only loaded on its own page · no render-blocking JS (`defer` everything).

---

## 11. Naming & Code Conventions

| Thing           | Convention                | Example                                                            |
| --------------- | ------------------------- | ------------------------------------------------------------------ |
| Folders & files | `kebab-case`              | `our-projects/`, `about-us.css`                                    |
| CSS classes     | BEM-ish                   | `.project-card`, `.project-card__title`, `.project-card--featured` |
| State classes   | `is-` / `has-`            | `.is-active`, `.is-open`, `.has-video`                             |
| JS variables    | `camelCase`               | `const navToggle`                                                  |
| JS constants    | `UPPER_SNAKE`             | `const NAV_ITEMS`                                                  |
| Data attributes | `data-az-*`               | `data-az-filter="bridges"`                                         |
| Page CSS scope  | wrap in a page root class | `.page-about { … }`                                                |

Each page's CSS file starts with a header comment:

```css
/* =============================================================
   ABOUT US — page styles
   Scope : .page-about
   Owner : <Ahmed | Mazen>
   Depends on: variables.css, global.css, components.css
   ============================================================= */
```

---

## 12. Team Workflow (Ahmed & Mazen)

- **One page = one owner = one branch.** `feat/page-about-us`, `feat/page-projects-tanta`.
- Because each page owns its files, two people **never touch the same file** — except these shared files, which require a heads-up in chat before editing:
  `variables.css` · `global.css` · `components.css` · `navbar.*` · `footer.*` · `site-data.js` · `CLAUDE.md`
- Commit style: `feat(about): add milestones timeline` · `fix(navbar): rtl drawer direction` · `chore(assets): compress tanta gallery`.
- Before opening a PR: run the local server, check the page at 375 / 768 / 1024 / 1440 px, in **both** EN and AR, and confirm no console errors.

---

## 13. Deployment

- Target: **Hostinger**, domain `alzahraa-construction.com`, site served from the web root.
- Upload the whole repo except `CLAUDE.md`, `README.md`, `.git/`, and any `/design/` scratch folder.
- Because paths are root-absolute, the site **must** sit at the domain root, not in a subfolder.
- Force HTTPS and `www` → non-`www` (or the reverse — pick one and set the canonical to match).
- Before launch: create the 5 mailboxes, submit `sitemap.xml` to Google Search Console for both language versions, and verify the old domain either redirects cleanly or is decommissioned **after** its spam is removed.

---

## 14. Definition of Done (per page)

- [ ] Built in **both** EN and AR, with correct `lang` + `dir`
- [ ] Navbar + footer inject correctly and the active link is right
- [ ] 8+ substantial sections, no lorem ipsum, no placeholder names
- [ ] All images have `alt` (translated), dimensions, and lazy loading
- [ ] Responsive at 375 / 768 / 1024 / 1440
- [ ] RTL verified — no reversed layouts, no broken icons, numbers stay LTR
- [ ] Unique title + description + canonical + hreflang + OG tags
- [ ] Keyboard navigable, visible focus, no console errors
- [ ] Uses design tokens only — no stray hex values or magic numbers
- [ ] Internal links work from both languages

---

## 15. Hard "Do Not" List

1. Do not add a framework, build tool, or package manager.
2. Do not migrate anything from the old site's blog/articles section.
3. Do not invent client names, partners, certifications, project values, or dates.
4. Do not hard-code colours, spacing, phone numbers, emails, or the current year.
5. Do not use relative `../../` paths for assets.
6. Do not put page-specific styles in global CSS files.
7. Do not duplicate a video or large image in both the `en` and `ar` folders.
8. Do not translate folder slugs into Arabic.
9. Do not leave `lorem ipsum`, `Peter Johns`, or `bdthemes` demo links anywhere.
10. Do not auto-redirect a first-time visitor away from English.
