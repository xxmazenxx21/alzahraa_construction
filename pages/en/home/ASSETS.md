# Home page — remote asset manifest

> **Temporary preview only.** Every remote URL below must be **downloaded, re-compressed
> to `.webp`/`.jpg` (+ `.webm`/`.mp4`), renamed to the `data-az-asset` filename, and served
> locally** from `/pages/en/home/images/` or `/pages/en/home/videos/` before launch
> (CLAUDE.md §9). The Arabic page references the same local files by root-absolute path.
>
> ⚠️ **The old domain `alzahraa.construction` is compromised (SEO spam under `admin1`).**
> These URLs are used *only* to preview real company media. **The site must never ship
> pointing at `alzahraa.construction`.** Migrate the files, then swap the `src`/`data-src`.
>
> Verification method: `curl -sIL` / `fetch` on every URL; HTTP status + real pixel
> dimensions recorded below (run 2026-09-28).

Legend — **Authenticity**: `Client-real` = Al Zahraa's own file · `Stock` = decorative stock.
Attribution: Pexels & Unsplash licences do **not** require attribution (authors logged as courtesy).

---

## Images

| Section | data-az-asset (final filename) | Remote source URL | Source site | Type | Authenticity | Author | Licence | Attribution req. | Verified (HTTP · dims) | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 01 Hero | `hero-highway-interchange-aerial.webp` | images.pexels.com/photos/681347/…w=1920 | Pexels | Image (poster) | Stock | Pexels contributor | Pexels License | N | 200 · 1920×1079 | LCP poster; `loading=eager fetchpriority=high` |
| 02 Who we are | `aerial-corridor-overview.webp` | alzahraa.construction/…/2025/02/DJI_0345-1024x575.jpg | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · 1024×575 | Clip-path frame |
| 05 Service 01 | `service-road-bridge-construction.webp` | …/photos/15495394/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×930 | **Egyptian-context evidence:** Arabic text on the machine; arid industrial site. Note: machine bears a "JCB" maker marking (incidental). |
| 05 Service 02 | `service-project-management.webp` | …/photos/39453456/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×1800 | **Egyptian-context evidence:** source page states Cairo; Mosque of Muhammad Ali / the Citadel visible; active road works with grader + loader. Portrait — landscape crop centres on the road. |
| 05 Service 03 | `service-strategic-planning.webp` | …/photos/20840208/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×800 | **Egyptian-context evidence:** source page states Cairo; the Nile, Nile bridges and an elevated highway with traffic. |
| 05 Service 04 | `service-project-execution.webp` | …/photos/34053335→19820523/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×800 | **Egyptian-context evidence:** from the "egypt road construction" set; workers in traditional dress, dusty/arid earthworks. Faces obscured. (URL uses id 19820523.) |
| 05 Service 05 | `service-quality-assurance.webp` | …/photos/31086011/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×800 | **Egyptian-context evidence:** no location cues, arid ground + sparse acacia (criterion 3). Subject: surveyors with a survey pole inspecting a roller. Faces turned away. |
| 05 Service 06 | `service-machinery-equipment.webp` | …/photos/12230518/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×873 | **UNRESOLVED — kept.** No free Egypt/arid road-roller or heavy-plant image found without foreign cues/brand. Decorative (existing). |
| 06/07 Ring Road | `project-regional-ring-road.webp` | alzahraa.construction/…/2025/02/Screenshot-2025-02-23-150658-e1741524693256.png | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · **720×390** | ⚠️ **Low-res — request higher-res original.** Rendered in a *contained* frame (not full-bleed) to avoid upscaling. |
| 07 Al-Masoura | `project-al-masoura-bridge.webp` | alzahraa.construction/…/2019/11/IMG-20240826-WA0012.jpg | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · 1280×720 | Real project photo |
| 07 Al-Mehwar | `project-al-mehwar.webp` | alzahraa.construction/…/2025/02/WhatsApp-Image-2019-03-09-…5.jpeg | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · 1280×720 | Real project photo |
| 07 Tanta | `project-tanta.webp` | alzahraa.construction/…/2025/02/DJI_0293-scaled.jpg | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · 2560×1438 | Real project photo |
| 07 Abo-Hammad | `project-abo-hammad.webp` | alzahraa.construction/…/2025/02/Add-a-heading-4-1536x864.jpg | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · 1536×864 | ⚠️ **Branded title graphic, NOT site photography — request a real Abo-Hammad photo.** alt kept neutral. |
| 07 Al-Salhia | `project-al-salhia.webp` | alzahraa.construction/…/2025/02/WhatsApp-Image-2024-09-07-…e1745056290570.jpeg | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · 1280×745 | Real project photo |
| 10 Development (poster) | `development-paving-highway.webp` | …/photos/29181420/…w=1920 | Pexels | Image (poster) | Stock | Pexels contributor | Pexels License | N | 200 · 1920×1280 | Video poster |
| 11 Fleet 1 | `fleet-asphalt-paver.webp` | …/photos/10000255/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×1200 | **UNRESOLVED — kept.** No free Egypt/arid asphalt-paver image found (all candidates were Oregon/Idaho/Poland/Germany). Decorative (existing). |
| 11 Fleet 2 | `fleet-rollers-compactors.webp` | …/photos/38462882/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×904 | **Egyptian-context evidence:** arid/sandy road base, low arid buildings, no visible location cues (criterion 2). ⚠️ Source page caption states **Saudi Arabia** (no visible foreign cue in the image). |
| 11 Fleet 3 | `fleet-graders.webp` | …/photos/8809464/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×1659 | **Egyptian-context evidence:** no location cues, arid dusty dirt (criterion 3). ⚠️ Machine bears a legible **"CATERPILLAR"** maker marking. |
| 11 Fleet 4 | `fleet-excavators-loaders.webp` | …/photos/28442180/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×1800 | **Egyptian-context evidence:** arid barren earthworks, no location cues (criterion 3). ⚠️ Excavator bears a "LiuGong 942F" maker marking. |
| 11 Fleet 5 | `fleet-haulage.webp` | …/photos/19820169/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×800 | **Egyptian-context evidence:** source page states Egyptian desert; **Arabic road signage** and truck lettering, sandy desert. |
| 11 Fleet 6 | `fleet-workshop-maintenance.webp` | …/photos/11685816/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · ~1200×800 | **UNRESOLVED — kept.** No free Egypt/arid workshop-or-yard scene found without greenery/brand cues. Decorative (existing). |
| 12 Team — engineering | `team-site-engineering.webp` | alzahraa.construction/…/2025/02/IMG-20250223-WA0004-e1745056503451.jpg | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · 960×1037 | Real people — never replace with stock |
| 12 Team — plant | `team-plant-operators.webp` | alzahraa.construction/…/2019/11/Screenshot-2025-04-07-172921.png | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · **314×377** | ⚠️ **Low-res — request higher-res original.** Contained in a card to avoid upscaling. |
| 12 Team — crews | `team-field-crews.webp` | alzahraa.construction/…/2025/02/IMG-20250223-WA0008-e1744040717437.jpg | Client site | Image | Client-real | Al Zahraa | Client-owned | N | 200 · 581×641 | Real people — never replace with stock |
| 13 QHSE | `qhse-site-safety.webp` | …/photos/27937015/…w=1920 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1920×1446 | Full-bleed image, decorative |
| 14 Partner — Housing | `partner-ministry-of-housing.png` | alzahraa.construction/…/2025/01/…الجهاز_المركزي…-1-8.png (percent-encoded) | Client site | Image (logo) | Client-real | Ministry of Housing | Authority mark | — | 200 · 139×153 | 🔴 **HIGH PRIORITY: Arabic filename — download + rename to ASCII** |
| 14 Partner — Transport | `partner-ministry-of-transport.png` | alzahraa.construction/…/2025/01/الهيئة_العامة_للطرق_والكباري_مصر-1-7.png (percent-encoded) | Client site | Image (logo) | Client-real | Ministry of Transport | Authority mark | — | 200 · 141×152 | 🔴 **HIGH PRIORITY: Arabic filename — download + rename to ASCII** |
| 14 Partner — Defense | `partner-ministry-of-defense.png` | alzahraa.construction/…/2025/01/dfb900ed-45b2-4576-8e22-a5994731b5d5-removebg-preview-1-4.png | Client site | Image (logo) | Client-real | Ministry of Defense | Authority mark | — | 200 · 155×152 | ASCII filename OK |
| 15 Media band bg | `media-band-backdrop.webp` | images.unsplash.com/photo-1477519242566-6ae87c31d212?w=1920 | Unsplash | Image | Stock (decorative) | Denys Nevozhai | Unsplash License | N (appreciated) | 200 · 1920×1280 | Low-opacity dark-band backdrop only; empty `alt` |
| 15 Showcase primary (poster) | `showcase-primary-poster.webp` | …/photos/12027074/…w=1200 | Pexels | Image (poster) | Stock | Pexels contributor | Pexels License | N | 200 · 1200×850 | Poster for primary video |
| 15 Showcase B (poster) | `showcase-b-poster.webp` | …/photos/4394336/…w=1200 | Pexels | Image (poster) | Stock | Pexels contributor | Pexels License | N | 200 · 1200×674 | Poster for video B |
| 15 Showcase C (poster) | `showcase-c-poster.webp` | images.unsplash.com/photo-1760708626681-59a5373819a6?w=1200 | Unsplash | Image (poster) | Stock | Andrey Matveev | Unsplash License | N (appreciated) | 200 · 1200×900 | Poster for video C |
| 16 News 1 | `news-compaction-test.webp` | …/photos/4390530/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×800 | **UNRESOLVED — kept.** No free Egypt/arid "roller on fresh asphalt" image found without foreign cues. Decorative (existing). |
| 16 News 2 | `news-live-corridor.webp` | …/photos/20226435/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×1800 | **Egyptian-context evidence:** source page states Cairo/Giza; the **Pyramids of Giza** visible; live carriageway with traffic. (No active roadworks visible — traffic scene.) |
| 16 News 3 | `news-owned-fleet.webp` | …/photos/33475991/…w=1200 | Pexels | Image | Stock | Pexels contributor | Pexels License | N | 200 · 1200×990 | **UNRESOLVED — kept.** No free Egypt/arid "plant fleet in a line" image found without greenery/brand/foreign cues. Decorative (existing). |
| 17 Contact bg | `contact-band-background.webp` | images.unsplash.com/photo-1681395325751-c66979aa10cc?w=1920 | Unsplash | Image | Stock (decorative) | Brady Wilson | Unsplash License | N (appreciated) | 200 · 1920×1440 | Low-opacity dark-band backdrop; empty `alt`. Replaced portrait Pexels 36861831 (1920×2560). |

---

## Videos

| Section | data-az-asset (final filename) | Remote source URL | Source site | Type | Authenticity | Licence | Verified (HTTP · size) | Notes |
|---|---|---|---|---|---|---|---|---|
| 01 Hero bg | `hero-roadwork-aerial.mp4` | videos.pexels.com/video-files/9431639/9431639-hd_1920_1080_24fps.mp4 | Pexels | Video | Stock | Pexels License | 200 · 1920×1080 24fps · ~7.8 MB | `data-src` (deferred; skipped under reduced-motion / Save-Data). **Requested 32746770 rejected — portrait-only @ 60fps.** Fallbacks: 3858830 → client reel. |
| 10 Development | `development-works.mp4` | alzahraa.construction/…/2025/02/VID-20240907-WA0014.mp4 | Client site | Video | Client-real | Client-owned | 200 · ~4.5 MB | Click-to-play |
| 15 Showcase primary | `showcase-primary.mp4` | alzahraa.construction/…/2025/02/VID-20221130-WA0043.mp4 | Client site | Video | Client-real | Client-owned | 200 · ~14.9 MB | Click-to-play — **re-compress (>8 MB)** |
| 15 Showcase B | `showcase-b.mp4` | alzahraa.construction/…/2025/05/WhatsApp-Video-2025-05-31-…0f94d615.mp4 | Client site | Video | Client-real | Client-owned | 200 · ~8.9 MB | Click-to-play — **re-compress (>8 MB)** |
| 15 Showcase C | `showcase-c.mp4` | alzahraa.construction/…/2025/05/WhatsApp-Video-2025-05-31-…2ba451bd.mp4 | Client site | Video | Client-real | Client-owned | 200 · ~1.1 MB | Click-to-play |

---

## Icons

All icons are **hand-authored inline `<svg>`** (`stroke="currentColor"`, `fill="none"`,
`stroke-width="1.5"`, `viewBox="0 0 24 24"`, `aria-hidden="true"`, `focusable="false"`).
**No icon library, no CDN, nothing to download.**

---

## Removed since Phase 1

- `chairman-hesham-zidan.webp` (was §04 portrait) — **removed** per instruction; the Chairman
  section is now text-only (offset two-column). No portrait image, no ASSETS row, no CSS remains.

## Pre-launch checklist (from this manifest)

1. 🔴 Download + **ASCII-rename** the two Arabic-filename partner logos (Housing, Transport).
2. ⚠️ Request **higher-res originals**: Regional Ring Road (720×390) and Team–plant (314×377).
3. ⚠️ Request a **real Abo-Hammad site photo** (current client file is a title graphic).
4. Download the hero video locally (or swap to fallback 3858830); re-compress the 3 client
   showcase videos + the hero clip to the §9 budget (background clips < 8 MB).
5. Convert every image to `<picture>` `.webp` + `.jpg`; strip the `data-az-asset` attributes.
6. Point all `src`/`data-src`/`poster` at local paths; **remove every `alzahraa.construction` URL.**
7. Create `/assets/images/shared/og-image.jpg` (referenced by OG tags + JSON-LD `image`).
