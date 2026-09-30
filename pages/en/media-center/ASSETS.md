# Media Center — remote asset manifest

Every image/video on `/pages/en/media-center/` and `/pages/ar/media-center/` is
currently loaded from a remote URL. Each element carries `data-az-asset="<name>"`
— the local filename it should become once downloaded, renamed, and re-compressed
per CLAUDE.md §9. The Arabic page references the **same** URLs; nothing is
duplicated between languages.

Client base URL: `https://alzahraa.construction/wp-content/uploads/` (abbreviated `…/uploads/` below).

| Section | data-az-asset | Remote URL | Type | Real (client) / Stock | Notes |
|---|---|---|---|---|---|
| 01 Hero | `media-hero-night-site.webp` | `https://images.pexels.com/photos/2458127/pexels-photo-2458127.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop` (+ `&fm=webp`) | Image | Stock (Pexels) | LCP image — `eager` + `fetchpriority="high"`. Also used as OG/Twitter image. |
| 03 Featured reel | `reel-company.mp4` | `…/uploads/2025/04/Untitled-video-Made-with-Clipchamp-2.mp4` | Video | Real | Click-to-play, `preload="none"`. |
| 03 Reel poster | *(reuses `gallery-tanta.webp`)* | `…/uploads/2025/02/DJI_0293-scaled.jpg` | Image | Real | TODO(media): replace with a frame grab from the reel itself. |
| 04 Gallery — Al-Masoura Bridge | `gallery-al-masoura-bridge.webp` | `…/uploads/2019/11/IMG-20240826-WA0012.jpg` | Image | Real | `bridges` |
| 04 Gallery — Al-Mehwar | `gallery-al-mehwar.webp` | `…/uploads/2025/02/WhatsApp-Image-2019-03-09-at-12.56.09-PM5.jpeg` | Image | Real | `roads` |
| 04 Gallery — Regional Ring Road | `gallery-regional-ring-road.webp` | `…/uploads/2025/02/Screenshot-2025-02-23-150658-e1741524693256.png` | Image | Real | `ring-roads`. Also the §10 CTA background. |
| 04 Gallery — Tanta | `gallery-tanta.webp` | `…/uploads/2025/02/DJI_0293-scaled.jpg` | Image | Real | `urban-works` (matches the Projects page, not the brief's `roads`). |
| 04 Gallery — Abo-Hammad | `gallery-abo-hammad.webp` | `…/uploads/2025/02/Add-a-heading-4-1536x864.jpg` | Image | Real | `other` (matches the Projects page). ⚠️ This is a title-card graphic, not a site photo — ask the client for a real Abo-Hammad photograph. |
| 04 Gallery — Al-Salhia | `gallery-al-salhia.webp` | `…/uploads/2025/02/WhatsApp-Image-2024-09-07-at-1.56.47-PM-1-e1745056290570.jpeg` | Image | Real | `roads`. Also the poster for video 1. |
| 04 Gallery — Site engineering | `gallery-team-engineering.webp` | `…/uploads/2025/02/IMG-20250223-WA0004-e1745056503451.jpg` | Image | Real | `team-site`. Also the poster for video 4. |
| 04 Gallery — Plant & operators | `gallery-team-plant.webp` | `…/uploads/2019/11/Screenshot-2025-04-07-172921.png` | Image | Real | `team-site` |
| 04 Gallery — Field crews | `gallery-team-crews.webp` | `…/uploads/2025/02/IMG-20250223-WA0008-e1744040717437.jpg` | Image | Real | `team-site`. Also the poster for video 3. |
| 05 Video library 1 | `video-development-works.mp4` | `…/uploads/2025/02/VID-20240907-WA0014.mp4` | Video | Real | Poster: `gallery-al-salhia`. TODO(media) poster frame; TODO(content) title. |
| 05 Video library 2 | `video-showcase-primary.mp4` | `…/uploads/2025/02/VID-20221130-WA0043.mp4` | Video | Real | Poster: `gallery-al-mehwar`. TODO(media) poster frame; TODO(content) title. |
| 05 Video library 3 | `video-showcase-b.mp4` | `…/uploads/2025/05/WhatsApp-Video-2025-05-31-at-12.23.21_0f94d615.mp4` | Video | Real | Poster: `gallery-team-crews`. TODO(media) poster frame; TODO(content) title. |
| 05 Video library 4 | `video-showcase-c.mp4` | `…/uploads/2025/05/WhatsApp-Video-2025-05-31-at-12.23.21_2ba451bd.mp4` | Video | Real | Poster: `gallery-team-engineering`. TODO(media) poster frame; TODO(content) title. |
| 06 Drone footage | `media-drone-progress.mp4` | `https://videos.pexels.com/video-files/28906015/12511956_1280_720_30fps.mp4` | Video | **Stock (Pexels 28906015)** | 720p rendition, ~44 MB (the 1440p original is ~198 MB). Re-encode to ≤ 8 MB before hosting locally. **Stand-in only.** Replace with the client's own drone footage and do not caption it as Al Zahraa's until then. Page: https://www.pexels.com/video/drone-aerial-view-of-construction-site-progress-28906015/ |
| 06 Drone poster | `media-drone-progress-poster.webp` | `https://images.pexels.com/videos/28906015/pexels-photo-28906015.jpeg?auto=compress&cs=tinysrgb&w=1920` | Image | Stock (Pexels) | Still frame from the same clip. |
| 07 Supporting visual | `media-engineers-review.webp` | `https://images.pexels.com/photos/8961146/pexels-photo-8961146.jpeg?auto=compress&cs=tinysrgb&w=1200` | Image | Stock (Pexels) | Decorative context for the documentation cards. |
| 07 Supporting visual | `media-team-onsite.webp` | `https://images.pexels.com/photos/4956918/pexels-photo-4956918.jpeg?auto=compress&cs=tinysrgb&w=1200` | Image | Stock (Pexels) | Decorative context for the documentation cards. |
| 08 Media kit | *(none yet)* | — | PDF | Real (pending) | Company profile PDF not supplied. The download button is disabled; enable it once the file lands in `/pages/en/media-center/downloads/`. |
| 10 CTA background | *(reuses `gallery-regional-ring-road.webp`)* | `…/uploads/2025/02/Screenshot-2025-02-23-150658-e1741524693256.png` | Image | Real | Decorative (`alt=""`) under a navy overlay. |

Pexels content is free to use with no attribution required.
