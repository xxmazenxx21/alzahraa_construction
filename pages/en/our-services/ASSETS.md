# Remote Asset Manifest — Our Services Overview

> **How to use this file:**
> Every image and video on this page currently points to a temporary external URL.
> When you download the file locally, drop it into `pages/en/our-services/images/` or `pages/en/our-services/videos/`, then do a global search-and-replace in **both** `index.html` (EN) and `../../../ar/our-services/index.html` (AR) to swap the remote URL for the local root-absolute path. The `data-az-asset` attribute on each element tells you the target filename.
>
> After the swap, also:
> 1. Wrap each `<img>` in a `<picture>` with a `.webp` source + `.jpg` fallback (per CLAUDE.md §9).
> 2. Compress to ≤ 250 KB for heroes, ≤ 120 KB for cards (per CLAUDE.md §9).
> 3. Set the correct `width` and `height` from the real file dimensions.

---

## Images

| # | Section | Element / Context | Remote URL (verified HTTP 200) | Local filename (`data-az-asset`) | Notes |
|---|---------|-------------------|-------------------------------|----------------------------------|-------|
| 1 | S1 Hero | `<img>` hero bg | `https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=1920` | `hero-highway-interchange-aerial.webp` | LCP — `loading="eager"` `fetchpriority="high"`. Pexels free licence. |
| 2 | S2 Intro | `<img>` clip-path panel | `https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1920` | `services-intro-infrastructure-overview.webp` | Pexels free licence. |
| 3 | S4 Card 1 | Road & Bridge card | `https://images.pexels.com/photos/19394246/pexels-photo-19394246.jpeg?auto=compress&cs=tinysrgb&w=1200` | `service-card-road-bridge-construction.webp` | Pexels free licence. |
| 4 | S4 Card 2 | Project Management card | `https://images.pexels.com/photos/37125635/pexels-photo-37125635.jpeg?auto=compress&cs=tinysrgb&w=1200` | `service-card-project-management.webp` | Pexels free licence. |
| 5 | S4 Card 3 | Strategic Planning card | `https://images.pexels.com/photos/34338597/pexels-photo-34338597.jpeg?auto=compress&cs=tinysrgb&w=1200` | `service-card-strategic-planning.webp` | Pexels free licence. |
| 6 | S4 Card 4 | Project Execution card | `https://images.pexels.com/photos/34053335/pexels-photo-34053335.jpeg?auto=compress&cs=tinysrgb&w=1200` | `service-card-project-execution.webp` | Pexels free licence. Also used as video poster. |
| 7 | S4 Card 5 | Quality Assurance card | `https://images.pexels.com/photos/37125646/pexels-photo-37125646.jpeg?auto=compress&cs=tinysrgb&w=1200` | `service-card-quality-assurance.webp` | Pexels free licence. |
| 8 | S4 Card 6 | Machinery & Equipment card | `https://images.pexels.com/photos/1145465/pexels-photo-1145465.jpeg?auto=compress&cs=tinysrgb&w=1200` | `service-card-machinery-equipment.webp` | Pexels free licence. |
| 9 | S5 Feature | Road & Bridge feature block | `https://images.pexels.com/photos/37820986/pexels-photo-37820986.jpeg?auto=compress&cs=tinysrgb&w=1920` | `road-bridge-construction-feature.webp` | Pexels free licence. |
| 10 | S6 Feature | Project Management feature block | `https://images.pexels.com/photos/37125635/pexels-photo-37125635.jpeg?auto=compress&cs=tinysrgb&w=1920` | `project-management-feature.webp` | Shares Pexels ID with card #4 — different `w=` param. |
| 11 | S7 Feature | Strategic Planning feature block | `https://images.pexels.com/photos/34338597/pexels-photo-34338597.jpeg?auto=compress&cs=tinysrgb&w=1920` | `strategic-planning-feature.webp` | Shares Pexels ID with card #5 — different `w=` param. |
| 12 | S8 Poster | Execution video poster | `https://images.pexels.com/photos/34053335/pexels-photo-34053335.jpeg?auto=compress&cs=tinysrgb&w=1920` | `project-execution-video-poster.webp` | Same original as card #6 — larger crop. |
| 13 | S9 Feature | Quality Assurance feature block | `https://images.pexels.com/photos/37125646/pexels-photo-37125646.jpeg?auto=compress&cs=tinysrgb&w=1920` | `quality-assurance-feature.webp` | Shares Pexels ID with card #7 — different `w=` param. |
| 14 | S10 Feature | Machinery & Equipment feature block | `https://images.pexels.com/photos/17605960/pexels-photo-17605960.jpeg?auto=compress&cs=tinysrgb&w=1920` | `machinery-equipment-feature.webp` | Pexels free licence. Unique ID — distinct from card #8. |

**Distinct Pexels photo IDs on this page (10 total):**
`1108572` · `2246476` · `19394246` · `37125635` · `34338597` · `34053335` · `37125646` · `1145465` · `37820986` · `17605960`

---

## Video

| # | Section | Element | Remote URL (verified HTTP 200, video/mp4) | Local filename | Notes |
|---|---------|---------|------------------------------------------|----------------|-------|
| 1 | S8 Execution | `<video>` click-to-play card | `https://videos.pexels.com/video-files/3858830/3858830-hd_1920_1080_24fps.mp4` | `project-execution-aerial-paving.mp4` | 1920×1080, 24fps. Pexels free licence. Add `.webm` source after download. Keep `muted playsinline preload="metadata"` — no autoplay with sound. |

---

## Client media to replace stock (priority)

The following slots should be replaced with real Al Zahraa photography once the client supplies high-resolution files:

| Slot | Current stock ID | Ideal real content |
|------|------------------|--------------------|
| S1 Hero | Pexels 1108572 | Drone/aerial shot of an Al Zahraa highway project (landscape, ≥ 4K) |
| S5 Road & Bridge feature | Pexels 37820986 | Paving-train or bridge-deck shot from a real Al Zahraa project |
| S10 Machinery feature | Pexels 17605960 | Al Zahraa fleet lined up at a project site or workshop |
| S8 Video | Pexels video 3858830 | Al Zahraa project construction footage (drone preferred) |

---

## Excluded URLs (already used on other pages — never reuse)

`681347` · `12230518` · `10000255` · `11685816` · `15495394` · `19820169` · `19820523` · `20226435` · `20840208` · `27937015` · `28442180` · `31086011` · `33475991` · `38462882` · `39453456` · `4390530` · `8809464`
Unsplash: `1477519242566-6ae87c31d212` · `1681395325751-c66979aa10cc`
