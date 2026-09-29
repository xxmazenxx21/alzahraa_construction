# PROMPT — Build the About Us page (EN + AR) for Al Zahraa Construction

---

## 0. READ THIS FIRST — NON-NEGOTIABLE

**BEFORE you touch a single file, open `CLAUDE.md` at the repo root and read it in full.** Every rule below is meant to sit *on top of* CLAUDE.md, never against it. If anything in this prompt appears to conflict with CLAUDE.md, **CLAUDE.md wins** — stop and ask me before improvising.

Specifically, re-check these sections of CLAUDE.md before you start:
- §2 Non-Negotiable Technical Rules (Tailwind CLI only, no frameworks, no build steps beyond `tailwindcss.exe`, root-absolute paths, semantic HTML, mobile-first CSS, no inline styles, no `!important`).
- §3 Directory Structure (every page owns its assets; only navbar + footer are shared; `.gitkeep` in empty `images/` and `videos/`).
- §4 Design System (all colors, spacing, radius, shadow, type, motion tokens live in `variables.css` — never hard-code hex, px, or font-family anywhere else).
- §5 Bilingual & RTL Rules (logical properties in the base CSS, RTL-only overrides in `/assets/css/rtl.css`, numbers/phones/emails stay LTR inside Arabic).
- §6 Shared Navbar & Footer (already exist — do NOT rewrite them, just include the mount points).
- §7.2 About Us page skeleton — the source of truth for which sections belong on this page.
- §8 Content & Copywriting Rules (institutional tone, no lorem ipsum, no invented numbers, use `[TBC]` when a figure isn't confirmed, wrap missing copy in `<!-- TODO(content): … -->`).
- §9 Media Rules (`.webp` with `.jpg` fallback via `<picture>`, `width`/`height`/`alt`/`loading` on every image, LCP hero is `eager` + `fetchpriority="high"`, background video is `muted autoplay loop playsinline preload="metadata"` with a poster).
- §10 SEO, Accessibility, Performance targets.
- §11 Naming conventions and BEM.
- §14 Definition of Done.
- §15 Hard "Do Not" list.

**Confirm in your first response that you've read CLAUDE.md and list the sections that apply to this page before writing any code.**

---

## 1. What you're building

The **About Us** page — full English version and full Arabic (RTL) mirror.

- Files you create:
  - `/pages/en/about-us/index.html`
  - `/pages/en/about-us/about-us.css` (page CSS — will be pulled into `tailwind-input.css` per §2 of CLAUDE.md; use `@apply` where helpful, plain CSS otherwise, all values from `variables.css`)
  - `/pages/en/about-us/about-us.js`
  - `/pages/en/about-us/images/.gitkeep`
  - `/pages/en/about-us/videos/.gitkeep`
  - `/pages/ar/about-us/index.html` (mirror — references the same media via root-absolute paths, per §3.1)
  - `/pages/ar/about-us/about-us.css` — only if Arabic needs extra overrides that don't fit in `/assets/css/rtl.css`. Prefer to put RTL-only tweaks in the shared `rtl.css`.

- The scoping class for this page is `.page-about` (per §11). Wrap **every** page-specific selector under it.
- After creating the files, remind me to append `@import "../../pages/en/about-us/about-us.css";` to `tailwind-input.css` and re-run `tools\tailwindcss.exe -i assets/css/tailwind-input.css -o assets/css/tailwind.css --minify`.

---

## 2. Visual direction — LUXURY / PREMIUM / CINEMATIC

I want the page to feel like an ultra-premium international engineering firm's site — think of the finish level on `emaarmisr.com`, `orascomdevelopment.com`, `hassanallam.com`, `sodic.com`, `palmhillsdevelopments.com`, `talaatmoustafa.com`, `mountainviewegypt.com`. Match that class, but keep the identity of an **infrastructure contractor** (roads, bridges, civil works), not a real-estate developer.

Aesthetic pillars:
- **Cinematic, photorealistic imagery.** Real construction, drone perspectives, cranes, structural steel, concrete pours, asphalt paving, architectural details of finished bridges — never generic corporate stock.
- **Sophisticated, modern, minimal.** Confident use of whitespace. Sharp corners (`--radius-sm`), thin amber rules under H2s, uppercase eyebrow labels, generous vertical rhythm using `--section-y`.
- **Alternating section backgrounds** — `--color-bg` → `--color-bg-alt` → a dark navy band → `--color-bg-warm` — so the page never feels flat across its full scroll length.
- **Dramatic architectural perspectives** — low angles on bridges, top-down drone frames on roadworks, tight crops on materials (steel rebar, poured concrete, asphalt texture).
- **Strong geometry, natural lighting, premium material details.**
- **Navy + Amber discipline.** Amber (`--az-amber-500`) is the accent for CTAs, stat numbers, underlines, timeline dots, and hover states. Navy dominates the surfaces and hero overlays. No stray colors.
- **Big numbers.** At least one full-bleed stats band with oversized amber figures. Ideally two.

Overall impression to communicate: **quality, trust, precision, scale, professionalism, innovation, long-term reliability.**

---

## 3. Animations (simple, tasteful, per CLAUDE.md motion tokens)

Use only `--ease-out`, `--ease-in-out`, `--dur-fast/base/slow` from `variables.css`. Nothing showy, nothing bouncy.

- **Reveal-on-scroll**: use the existing `/assets/js/animations.js` (IntersectionObserver-based). Add `data-az-reveal` (or whatever attribute that file expects — check it first) to each `<section>` and each stat, card, timeline item. Stagger children with an inline `style="--reveal-delay: 80ms"` incrementing per index (this counts as a "dynamic value set by JS" style per §2 rule 9, so it's fine).
- **Scroll behaviour**: the navbar shrink (`--navbar-h` → `--navbar-h-scrolled`) is already handled by the shared navbar — don't touch it.
- **Hero video**: fade-in overlay on load (opacity 0 → 1 over `--dur-slow`); the H1 fades and rises 24px on load, sub-line follows 120ms later.
- **Stats band**: count-up animation from 0 → target when the band enters the viewport (write a tiny helper in `about-us.js`, `requestAnimationFrame`, no library). Numbers stay LTR in Arabic — wrap with `<span dir="ltr">`.
- **Hover states**:
  - Cards: lift 4px, `--shadow-md` → `--shadow-lg`, image inside scales to 1.04 (per §4.4).
  - Buttons: primary → `--color-primary-hover`; accent → `--color-accent-hover`; ghost fills with `--color-primary` and inverts its text.
  - Timeline dots: grow from 12px to 16px and fill with amber.
- **Parallax**: **do not** implement scroll-parallax on the hero image — it fights `prefers-reduced-motion` and destroys LCP. Instead use a very slow CSS `transform` zoom on the hero image (from `scale(1)` to `scale(1.08)` over 20s, `ease-in-out`, infinite alternate). Gate the whole animation block in `@media (prefers-reduced-motion: no-preference)`.
- **Respect `prefers-reduced-motion`**: pause the hero video, disable reveal animations, disable the slow zoom, disable count-up (show the final number immediately). This is stated in §9 of CLAUDE.md — do not skip it.

---

## 4. Page structure — 12 sections (in this order)

Every section follows the pattern from §8: short **uppercase eyebrow label** → **H2** → **lead paragraph** → body. Alternate the section backgrounds as noted.

### Section 1 — HERO (background media, 65vh, dark navy overlay)
- **Height**: `min(70vh, 720px)`, at least `520px` on mobile.
- **Background**: full-bleed. Two layers:
  1. `<video>` (muted/autoplay/loop/playsinline/preload="metadata", with a poster) — **or** a `<picture>` element if we skip video. I'd like the video for maximum impact; use the poster image as the fallback.
  2. `--overlay-hero` gradient on top.
- **Breadcrumb** (top-left inside the container, small, semitransparent white): `Home → About Us`.
- **H1** (one per page — this is it): `Building Egypt's Infrastructure Since 1995`
- **Sub-line** (fs-lead, white 85%): `Roads, bridges, and civil works delivered for the ministries that shape the country.`
- **Dual CTA row**: primary `.btn-accent` → *Explore Our Projects* → `/pages/en/our-projects/`, ghost `.btn-ghost` → *Get in Touch* → `/pages/en/contact-us/`.
- **Scroll cue** at the bottom (subtle chevron + `scroll` label), bounces gently.

### Section 2 — INTRO / "Who we are" (`--color-bg`)
- Eyebrow: `WHO WE ARE`
- H2: `Three decades of building what Egypt runs on.`
- Lead paragraph:
  > Al Zahraa General Contracting, Import & Export Company has been part of Egypt's road and bridge programme since **1995**. Founded and chaired by **Eng. Hesham Zidan**, the firm has grown from a specialist contractor into a full-scope civil infrastructure partner — trusted by the Ministry of Housing, the Ministry of Transport, and the Engineering Authority of the Armed Forces to deliver projects that carry traffic, freight, and daily life across the country.
- Two-column body:
  - **Left (60%)**: 3 short paragraphs expanding on: (a) what we do — road and bridge construction, project management, strategic planning, execution, quality assurance, machinery and equipment operations; (b) where we work — infrastructure corridors across the Nile Delta, Greater Cairo, and beyond; (c) how we work — a self-owned fleet, in-house engineering, and long-standing relationships with public-sector clients.
  - **Right (40%)**: portrait-crop image of a construction site or an architectural detail, with a subtle navy tint on hover.
- Below the two columns: a strip of 4 small icon+label pills — *Roads & Bridges · Civil Infrastructure · Import & Export · Heavy Machinery*.

### Section 3 — STATS BAND (`--color-bg-dark`, full-bleed, amber numbers)
Six stats in a 3×2 (mobile) / 6×1 (desktop) grid. Numbers count up on enter, in `--font-en-heading` at ~4.5rem, amber, with a hairline amber underline. Label below in uppercase small-caps.

Use `[TBC]` for anything the client hasn't confirmed — do NOT fabricate.

| Number | Label |
|---|---|
| `30+` | Years of Continuous Operation |
| `[TBC]` | Kilometres of Roads Delivered |
| `[TBC]` | Bridges Constructed |
| `[TBC]` | Major Projects Completed |
| `[TBC]` | Engineers, Technicians & Workforce |
| `[TBC]` | Heavy Equipment Units in Fleet |

Add a footer line under the grid: `Figures updated annually — full project register available on request.` (small, muted).

### Section 4 — COMPANY STORY (`--color-bg-alt`)
- Eyebrow: `OUR STORY`
- H2: `From a first contract in 1995 to a national contractor today.`
- Lead paragraph:
  > Al Zahraa was founded in 1995 on a straightforward proposition: build well, deliver on time, and keep the client's word above everything else. Three decades on, the proposition has not changed — the scale of the work has.
- **Long-form body** (single column, max width `--container-text` for readability, ~4 paragraphs):
  1. **Foundation.** Established in the mid-1990s as Egypt began a sustained programme of road and bridge modernisation, Al Zahraa took on early contracts alongside the Ministry of Housing and the General Authority for Roads and Bridges. What set the firm apart from the start was a decision to invest in its own heavy machinery fleet rather than sub-contract — a decision that still defines how we work today.
  2. **Growth through the 2000s.** As demand for regional connectivity grew, so did our capability. New categories of work — dual-carriageway rehabilitation, bridge superstructures, drainage-integrated highway upgrades — became part of the standard scope, and the firm's headquarters at 127 Mohamed Farid Street in Abdin became the coordination hub for a workforce spread across active sites in the Delta and beyond.
  3. **The last decade.** The last ten years have seen Al Zahraa involved in flagship national infrastructure — including work on the **Regional Ring Road**, **Al-Mehwar**, the **Al-Masoura Bridge at km 10+160**, and multi-phase corridor programmes in **Tanta**, **Al-Hussania**, **Abo-Hammad**, **Al-Nofaa**, and **Al-Salhia**. Each project has added to a technical library the firm now brings to every new tender.
  4. **Today.** We remain independently chaired, family-anchored, and technically led. That combination — long-view ownership plus engineering-first management — is what our clients tell us they value most.

- On the right, a **vertical image collage** (3 stacked images with slight offsets) showing progression: an earlier project shot → mid-2010s bridge work → recent drone shot.

### Section 5 — CHAIRMAN'S MESSAGE (`--color-bg`, portrait feature)
- Two-column layout. On the left, portrait of **Eng. Hesham Zidan** in a tall aspect-ratio crop (`aspect-ratio: 4/5`), with a thin amber vertical accent line to the left of the image.
- On the right:
  - Eyebrow: `CHAIRMAN'S MESSAGE`
  - H2: `A word from our Chairman & Founder.`
  - The full message body (use this — DO NOT shorten or add):

  > "From the establishment of Al Zahraa Construction Company in 1995 until today, we have stood by the principles of discipline, technical excellence, and integrity. These values have guided our journey and shaped every project we've delivered. Our mission has always been to contribute meaningfully to Egypt's construction sector and to build lasting partnerships through quality, reliability, and trust.
  >
  > With over three decades of leadership in Egypt's construction industry, I take pride in seeing Al Zahraa grow into a trusted name known for its consistent performance and strong client relationships. We remain committed to delivering high-impact projects across roads, bridges, and civil works — while setting benchmarks in execution, safety, and sustainability.
  >
  > The work that lies ahead of Egypt — in transport corridors, in urban expansion, in cross-governorate connectivity — is significant. Al Zahraa intends to be part of it, with the same standards we started with in 1995."

  - Signature block: *Eng. Hesham Zidan* — small caps, followed by an amber hairline, followed by *Chairman & Founder, Al Zahraa General Contracting*.
  - Small CTA under signature: `.btn-ghost` → *Meet the Leadership Team* → anchor `#leadership`.

**IMPORTANT**: Do not put the name "Peter Johns" anywhere on the page. It was a placeholder on the old site — remove it entirely (§8 and §15 of CLAUDE.md).

### Section 6 — VISION, MISSION & PURPOSE (`--color-bg-alt`, 3-panel split)
Three equal columns on desktop, stacked on mobile. Each column: a large amber-tinted icon, an H3, and 2–3 sentences.

- **Vision** — H3: `Where we're going.`
  > To be recognised across the Middle East as a leading civil-infrastructure contractor — the partner ministries and authorities turn to when a project must be built to specification, on schedule, and to last. We aspire to expand Egypt's engineering export capacity through selective regional work, while continuing to invest in the people and equipment that make delivery possible at home.

- **Mission** — H3: `What we do every day.`
  > To design, manage, and execute high-quality road and bridge projects that improve mobility, safety, and economic connectivity — using advanced construction methods, a fully-owned heavy machinery fleet, and a workforce trained to international standards. We measure ourselves on three things: technical quality, delivery discipline, and the durability of the built asset over its full service life.

- **Purpose** — H3: `Why we exist.`
  > Because the roads and bridges we build carry other people's lives — commuters, freight, emergency response, national supply chains. That responsibility sits at the centre of every decision we make, from the tender room to the last kilometre of asphalt.

### Section 7 — CORE VALUES (6 cards, `--color-bg`)
- Eyebrow: `OUR CORE VALUES`
- H2: `The principles behind every project.`
- Lead: `Six values, chosen deliberately, held consistently — the ones that decide how we tender, staff, build, and hand over.`
- 6 value cards in a 3×2 grid. Each: amber icon (inline SVG — line style, 32px), H3, one short paragraph. On hover: lift + top-border becomes amber.

  1. **Integrity** — We commit only to what we can deliver, and we deliver what we commit to. Our word to a client is contractual before any signature is applied.
  2. **Engineering Excellence** — Every design decision is defensible on drawings, on site, and in the finished asset. We build to specification, not to shortcut.
  3. **Safety First** — No project schedule is more important than the person executing it. Our HSE culture is a hiring standard, not a training slide.
  4. **Precision & Discipline** — Programme control, cost control, quality control — the three disciplines that separate a contract completed from a contract closed properly.
  5. **Innovation in Practice** — We adopt new methods when they measurably improve safety, quality, or speed — not because they are new.
  6. **Enduring Partnership** — Our longest-standing client relationships have run through more than a decade of consecutive projects. That is not accidental — it is a strategy.

### Section 8 — MILESTONES TIMELINE (`--color-bg-dark`, alternating left/right cards)
- Eyebrow: `OUR JOURNEY`
- H2: `Three decades. One direction of travel.`
- Vertical timeline down the centre with a thin amber rail and circular dots at each milestone. Cards alternate left/right on desktop; stack full-width on mobile.

Milestone entries — use these, mark anything unconfirmed with `[TBC]`:

- **1995** — Al Zahraa General Contracting, Import & Export Company is founded by **Eng. Hesham Zidan** in Cairo. First contracts secured with public-sector clients in the road sector.
- **Late 1990s** — Strategic decision to build an in-house heavy machinery fleet, rather than rely on sub-contracted equipment — a defining move for the firm's later delivery capability. `[TBC year]`
- **2000s** — Expansion into bridge construction and dual-carriageway rehabilitation. Firm establishes recurring work with the General Authority for Roads and Bridges. `[TBC specific projects]`
- **2010s** — Involvement in flagship corridor and ring-road programmes. Regional Ring Road, Al-Mehwar, and multi-phase Delta corridor works enter the portfolio. `[TBC exact dates]`
- **Mid-2010s** — Delivery of the **Al-Masoura Bridge at km 10+160**. `[TBC year]`
- **Late 2010s** — Tanta corridor works — Sandal → Zefta, Phase 1: 10 km of dual-way road. `[TBC year]`
- **2020s** — Continued expansion of workforce and fleet; concurrent execution across Al-Hussania, Abo-Hammad, Al-Nofaa, and Al-Salhia corridors. `[TBC scope details]`
- **Today** — Over three decades of continuous operation, delivering for the ministries and authorities that shape the country's infrastructure.

Above the timeline, a small note: `Timeline reflects publicly disclosed milestones; full project register available to prospective clients on request.`

### Section 9 — ORGANISATIONAL CAPABILITY (`--color-bg-alt`, 4 pillars)
- Eyebrow: `WHAT WE BRING`
- H2: `An integrated delivery organisation.`
- Lead: `Al Zahraa is deliberately structured so a single contract can be delivered end-to-end without external hand-offs — engineering, project management, execution, machinery, and QA all sit under one roof.`

Four pillars in a 2×2 grid. Each pillar: a full-width image at the top of the card (16:9 crop), H3 below, then 3–4 lines of body, then a small `→ Learn more` link.

1. **In-house Engineering & Design Support** — Working alongside client-side designers and consultants, our engineering team validates constructability, sequences the programme, and closes the gap between drawing office and site.
   → `/pages/en/our-services/strategic-planning/`
2. **Project Management & Execution Discipline** — Programme control, cost control, and QA integrated from tender through handover — with a single accountable project manager on every job.
   → `/pages/en/our-services/project-management/`
3. **Self-Owned Heavy Machinery Fleet** — Asphalt pavers, rollers, excavators, loaders, graders, crushers, transport fleet, batching plants — owned, maintained in-house, and available on the schedule the project needs.
   → `/pages/en/equipment/`
4. **Quality, Safety & Environment (QHSE)** — Documented QA/QC at every construction stage, laboratory-tested materials, an active HSE programme, and environmental controls appropriate to the works.
   → `/pages/en/quality-safety/`

### Section 10 — WHY CHOOSE AL ZAHRAA (`--color-bg`, 6 differentiators)
- Eyebrow: `WHY CLIENTS CHOOSE US`
- H2: `The reasons repeat, project after project.`
- 6 items in a 3×2 grid. Each: an amber numeral (01 → 06) in `--font-en-heading` at ~2.5rem, H4, short paragraph.

  01. **Three decades of continuous operation** — no gaps, no restructurings, no rebrands. The company that signs the contract is the company that finishes it.
  02. **Public-sector track record** — recurring work with the Ministry of Housing (Central Agency for Reconstruction), the Ministry of Transport (General Authority for Roads and Bridges), and the Ministry of Defense (Engineering Authority).
  03. **A fully-owned fleet** — schedule certainty because we don't queue for equipment.
  04. **In-house engineering** — we don't outsource judgment on constructability, sequencing, or method.
  05. **Programme discipline** — earned-value tracking, weekly cost-loaded schedules, and monthly client reporting are standard on every job.
  06. **Long-view ownership** — independently chaired, technically led, and structured for continuity.

### Section 11 — CERTIFICATIONS & CLASSIFICATIONS (`--color-bg-alt`)
- Eyebrow: `ACCREDITATIONS`
- H2: `Classified, certified, and audited.`
- Lead: `Al Zahraa holds the contractor classifications and management-system certifications required by the public-sector authorities we work with. Detailed accreditation documents are available to prospective clients on request.`
- **Logo/badge grid** with 4–6 placeholder tiles. Each tile: a grayscale placeholder, hovering to full colour, with a caption underneath.
- Wrap this whole section in:
  ```html
  <!-- TODO(content): confirm each classification, class level, and certification body with client before launch. Do NOT publish invented certifications. -->
  ```
- Placeholder captions (all marked): `Egyptian Federation for Construction & Building Contractors – Class [TBC]`, `ISO 9001:2015 Quality Management – [TBC]`, `ISO 14001:2015 Environmental Management – [TBC]`, `ISO 45001:2018 Occupational Health & Safety – [TBC]`, `Ministry of Housing – Approved Contractor Register – [TBC]`, `Additional accreditations available on request`.

### Section 12 — LEADERSHIP TEAM (`--color-bg`, id=`leadership`)
- Eyebrow: `LEADERSHIP`
- H2: `The team behind three decades of delivery.`
- Lead: `Long-tenured, engineering-led, and directly involved in every major tender and delivery.`
- Card layout: 1 large card for the Chairman, then a 3-column row of department heads.
  - **Featured card**: Eng. Hesham Zidan — Chairman & Founder. Portrait (4:5), name, title, a two-line quote pulled from his message: *"Every project we deliver is a promise kept — to the client, to the ministry, and to the people who will use the road or cross the bridge."*
  - **Row of 3 placeholder cards** for department heads (Chief Engineer / Head of Operations / Head of QHSE). Portrait placeholder, name `[TBC]`, title, one-line bio `[TBC — awaiting client input]`. Wrap the row in a `<!-- TODO(content): confirm leadership names, titles, and portraits with client -->` comment.

### Section 13 — GOVERNMENT PARTNERS & CLIENTS (`--color-bg-alt`)
- Eyebrow: `PARTNERS & CLIENTS`
- H2: `Trusted by the authorities that build the country.`
- Lead: `We work with the ministries and public-sector authorities responsible for Egypt's road, bridge, and civil infrastructure programmes.`

- **Confirmed logo wall** (3 tiles — real, from CLAUDE.md §7.8):
  - Ministry of Housing — Central Agency for Reconstruction
  - Ministry of Transport — General Authority for Roads and Bridges
  - Ministry of Defense — Engineering Authority

- Below the wall: a small note: `Additional public-sector relationships available on request.` and wrap any "candidate" logos in a strict `<!-- TODO(content): DO NOT publish additional partners until client confirms in writing (§7.8, §15 of CLAUDE.md) -->` comment.

### Section 14 — CTA BAND (`--color-bg-dark`, amber accent line)
- Full-bleed. Two lines of copy centred, then two buttons.
- **H2**: `Have a project? Let's talk.`
- Sub-line: `Roads, bridges, civil works — from planning through handover. We'd welcome the conversation.`
- Buttons: `.btn-accent` → *Contact Us* → `/pages/en/contact-us/`, `.btn-ghost` (inverted for dark bg) → *Explore Our Projects* → `/pages/en/our-projects/`.

---

## 5. Media — real, working URLs to drop in NOW

**IMPORTANT — how to handle media assets in this build:**

- Place every image and the hero video with its **external URL directly in `src` / `srcset`** — exactly the URLs listed below. Do NOT download them. Do NOT try to fetch them into the container. I will download them by hand at the end and drop them into the correct `images/` and `videos/` folders.
- On top of every media element, add an **HTML comment stating the intended local path** it will move to, so the swap later is a straight find-and-replace. Example:
  ```html
  <!-- LOCAL: /pages/en/about-us/images/about-hero.webp -->
  <picture>
    <source srcset="https://images.unsplash.com/photo-…?w=1920&q=80&auto=format&fit=crop&fm=webp" type="image/webp">
    <img
      src="https://images.unsplash.com/photo-…?w=1920&q=80&auto=format&fit=crop"
      alt="Aerial view of a highway construction site at dusk"
      width="1920" height="1080"
      loading="eager" fetchpriority="high">
  </picture>
  ```
- Keep the `<picture>` + `.webp` / `.jpg` fallback structure from §9 — even though the current URL serves both formats via `?fm=webp` / `?fm=jpg`, so it works as-is. Once I download and convert locally the structure won't need to change.
- Every `<img>` needs `width`, `height`, `alt`, `loading` (per §9). The LCP hero image gets `loading="eager"` + `fetchpriority="high"`; everything else `loading="lazy"`.
- **Icons**: use inline SVG — line-style, 24–32px, `stroke="currentColor"` so the color inherits from the parent (`color: var(--color-accent)` for amber icons). Do NOT pull an icon font library. If you need a shape you're not sure how to draw, use a simple Lucide/Feather-style outline you can hand-write. Add `aria-hidden="true"` on decorative icons.

### 5.1 Video — hero background (drone footage over an active road construction site, landscape 16:9, ~2560×1440)

- Video URL: `https://videos.pexels.com/video-files/4430419/4430419-uhd_2560_1440_24fps.mp4`
- Poster (used until the video is decoded, and shown to `prefers-reduced-motion` users): `https://images.pexels.com/videos/4430419/pexels-photo-4430419.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop`
- Intended local paths: `/pages/en/about-us/videos/about-hero.mp4`, `/pages/en/about-us/images/about-hero-poster.jpg` (+ `.webp`).
- Attributes: `muted autoplay loop playsinline preload="metadata" poster="…"` — per §9.

### 5.2 Images — every URL below opens directly and can be right-clicked to save

All are from `images.unsplash.com` (public CDN, hotlinkable, free for commercial use). Append `?w=1920&q=80&auto=format&fit=crop` to any of these for a hero-grade render; use `?w=1200&q=80&auto=format&fit=crop` for cards.

**Section 2 — Intro right-side portrait crop:**
- `https://images.unsplash.com/photo-1517089596392-fb9a9033e05b` — top-down four heavy equipment on quarry (great as a portrait crop with `object-position: right center`).
  Alt: `Overhead view of heavy construction equipment operating on a project site`.
  LOCAL: `/pages/en/about-us/images/about-intro.webp`

**Section 4 — Company Story vertical collage (3 images):**
- `https://images.unsplash.com/photo-1503708928676-1cb796a0891e` — yellow Caterpillar excavator moving earth. Alt: `Excavator operating on a road preparation site`.
- `https://images.unsplash.com/photo-1670912461796-81819c1e525b` — crane over a body of water at a bridge site. Alt: `Bridge construction crane working over water`.
- `https://images.unsplash.com/photo-1507415710579-79b32edf8a78` — aerial view of a completed highway with traffic. Alt: `Aerial view of a completed dual-carriageway highway in operation`.
  LOCAL: `/pages/en/about-us/images/story-01.webp`, `story-02.webp`, `story-03.webp`

**Section 5 — Chairman's portrait:**
- Use the existing chairman photo already in the codebase if present. Otherwise fall back to: `https://images.unsplash.com/photo-1593436878048-92622a77d315` — a man in a hi-vis jacket beside heavy equipment (placeholder only — mark it clearly).
  Wrap it in `<!-- TODO(content): replace with the client's official portrait of Eng. Hesham Zidan (already used on the old site: /wp-content/uploads/2025/05/chairman-photo.png). Migrate, rename to /pages/en/about-us/images/chairman-hesham-zidan.webp, and re-compress. -->`
  LOCAL: `/pages/en/about-us/images/chairman-hesham-zidan.webp`

**Section 9 — Organisational Capability (4 card images):**
- Card 1 (Engineering): `https://images.unsplash.com/photo-1673978481178-b4d72cfd2fb9` — crane on top of a building under construction. Alt: `Tower crane on an active construction structure`.
- Card 2 (Project Management): `https://images.unsplash.com/photo-1529792083865-d23889753466` — construction worker on the street. Alt: `Site engineer supervising road works`.
- Card 3 (Heavy Machinery): `https://images.unsplash.com/photo-1534097575056-ddba81f714c8` — aerial of heavy equipment beside dump truck. Alt: `Aerial view of heavy machinery loading at a construction site`.
- Card 4 (QHSE): `https://images.unsplash.com/photo-1583024011792-b165975b52f5` — yellow excavator on brown sand. Alt: `Heavy equipment being operated under safety supervision`.
  LOCAL: `/pages/en/about-us/images/capability-01.webp` … `capability-04.webp`

**Section 8 — Milestones background (subtle, behind the timeline rail):**
- `https://images.unsplash.com/photo-1559843788-693858bf7338` — low-angle bridge photograph (dark, dramatic, works well behind navy overlay). Alt: `Low-angle architectural view of a completed bridge`. Give it a `--overlay-hero`-style dark navy gradient on top so the timeline dots and text stay readable.
  LOCAL: `/pages/en/about-us/images/milestones-bg.webp`

**Section 14 — CTA band background (subtle, dark treatment):**
- `https://images.unsplash.com/photo-1615117156039-6a27220d7382` — gray concrete bridge daytime shot. Alt: `Concrete bridge span in daylight`. Same navy gradient overlay treatment.
  LOCAL: `/pages/en/about-us/images/cta-bg.webp`

**Section 3 & 10 backgrounds:** use no image — pure `--color-bg-dark` / `--color-bg` respectively. The stats and the "why us" grid need to read cleanly.

**Section 13 — Partner logos:** these already exist in the old codebase — do NOT re-download. Reference them via `<!-- TODO(assets): copy across from old site into /assets/images/partners/ and rename in kebab-case: ministry-of-housing.png, ministry-of-transport.png, ministry-of-defense.png -->`.

---

## 6. Arabic (RTL) mirror — `/pages/ar/about-us/index.html`

- Same structure, section for section, in the same order.
- `<html lang="ar" dir="rtl">`.
- Include `/assets/css/rtl.css` after all other stylesheets.
- Media: **reference the same files from `/pages/en/about-us/…` via root-absolute paths** — do NOT duplicate the videos or images into the `ar/` folder (§3.1 explicitly forbids this).
- `alt` attributes translated per §9.
- Numbers, phone numbers, emails, dates, and English-only technical terms like "Ring Road" stay LTR — wrap them in `<span dir="ltr">…</span>`.
- Arabic headings: no letter-spacing, no `text-transform: uppercase` (§5.3).
- H1: `نحن نبني البنية التحتية لمصر منذ عام ١٩٩٥`
- Sub-line: `طرق وكباري وأعمال مدنية… نُنفّذها للوزارات والجهات التي تصنع مستقبل الدولة.`
- Chairman message: full Arabic translation of the English message, keeping the same three-paragraph structure. Do NOT transliterate — translate.
- Milestones: use Arabic-Indic digits inside prose (`١٩٩٥`), but keep the stats-band numerals Western LTR (they need to count up cleanly).
- Section headings (translated):
  1. من نحن
  2. ثلاثة عقود من بناء ما تسير عليه مصر
  3. أرقام تتحدث عنا
  4. قصتنا
  5. كلمة رئيس مجلس الإدارة
  6. رؤيتنا ورسالتنا وغايتنا
  7. قيمنا الجوهرية
  8. محطات على طريقنا
  9. قدراتنا المؤسسية
  10. لماذا الزهراء
  11. الاعتمادات والتصنيفات
  12. القيادة
  13. شركاؤنا وعملاؤنا
  14. لنبدأ مشروعك القادم

---

## 7. Head, SEO, and structured data (per §10)

- Unique `<title>` (≤ 60 chars):
  - EN: `About Us — Al Zahraa General Contracting | Roads & Bridges`
  - AR: `من نحن — شركة الزهراء للمقاولات العامة | طرق وكباري`
- Unique `<meta name="description">` (≤ 160 chars):
  - EN: `Al Zahraa General Contracting has delivered roads, bridges and civil infrastructure across Egypt since 1995. Founded and chaired by Eng. Hesham Zidan.`
  - AR: (translated equivalent, ≤ 160 chars).
- `<link rel="canonical">` pointing to the page itself.
- `<link rel="alternate" hreflang="en|ar|x-default">` per §5.2 — three tags.
- Open Graph + Twitter card tags using the hero poster image.
- JSON-LD:
  - `Organization` (name, url, logo, foundingDate `1995`, founder `Eng. Hesham Zidan`, address, contactPoint using the confirmed phones from `site-data.js`).
  - `BreadcrumbList` (Home → About Us).
- Preconnect to `fonts.gstatic.com`, `font-display: swap`, defer all JS (§10).

---

## 8. Accessibility & performance targets (per §10)

Confirm these before you hand it over:
- LCP < 2.5s (the hero image via `<picture>` + `loading="eager"` + `fetchpriority="high"` — video loads after).
- CLS < 0.1 (every image has explicit `width`/`height`).
- Total page weight < 3 MB — with these external URLs, images are streamed at the sizes we request, so this is comfortable.
- WCAG 2.1 AA: visible `:focus-visible` outline using `--color-focus`, skip-to-content link inside `<main>`, ≥ 4.5:1 contrast on body text, icon-only buttons carry `aria-label`, timeline is keyboard-navigable, no focus trap anywhere.
- Only one `<h1>` on the page. Headings descend correctly (H1 → H2 per section → H3 inside a section → H4 inside a card).
- Every `<section>` gets an `aria-labelledby` pointing to its H2's `id`.

---

## 9. Definition of Done — check every box before you tell me it's ready (§14)

- [ ] `CLAUDE.md` has been read in full and its rules are respected.
- [ ] Built in **both** EN and AR, with correct `lang` + `dir`, and hreflang tags on both.
- [ ] Navbar and footer inject correctly on both languages and the "About Us" nav link is marked `.is-active`.
- [ ] 12 substantial sections (plus hero and CTA band). No lorem ipsum. No "Peter Johns". No fabricated numbers or partners. Every unconfirmed figure is `[TBC]`. Every uncertain content block is wrapped in `<!-- TODO(content): … -->`.
- [ ] All images use `<picture>` with `.webp` first and `.jpg` fallback, have `alt` (translated per language), `width`, `height`, and `loading` set correctly.
- [ ] Hero video has poster, is muted/autoplay/loop/playsinline, is under 8 MB target once we localise, and is paused for `prefers-reduced-motion`.
- [ ] Every media element has a `<!-- LOCAL: /pages/…/… -->` comment above it stating the intended local path.
- [ ] Responsive at 375 / 768 / 1024 / 1440 px, in both EN and AR — no layout collapse, no horizontal scroll, no reversed icons in RTL.
- [ ] Uses design tokens only — no stray hex, no magic pixel values, no `!important`.
- [ ] Root-absolute paths only (`/pages/en/about-us/…`, `/assets/css/…`).
- [ ] Page CSS is scoped under `.page-about {}`, has the required header comment (`ABOUT US — page styles / Scope: .page-about / Owner: <name>`), and is imported into `tailwind-input.css`.
- [ ] Reveal-on-scroll animations wired via the existing `/assets/js/animations.js` — no new animation library added.
- [ ] Count-up on the stats band works, respects reduced motion, and keeps Arabic numerals LTR.
- [ ] `:focus-visible` outline is visible on every interactive element.
- [ ] Skip-to-content link is the first focusable element inside `<body>`.
- [ ] No `console.error` / no broken `fetch()` for partials when served through `python3 -m http.server 5500`.
- [ ] JSON-LD validates (paste into Google's Rich Results test in my browser after).

---

## 10. Deliverable — how to hand this back to me

When you're done, reply with:
1. A short summary of what you built and any decisions you made.
2. The list of files created / edited.
3. Any `[TBC]` / `TODO(content)` blocks I need to chase up with the client.
4. Any point where you had to interpret CLAUDE.md — I want to review those.
5. The exact `tailwindcss.exe` command to run so the new `about-us.css` gets picked up.

That's it. **Start by confirming you've read CLAUDE.md**, then proceed. If any section brief above is unclear, ask **before** writing code — do not guess.
