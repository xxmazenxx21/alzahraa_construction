# Contact Us — remote asset manifest

Every image below is currently loaded from Pexels (free, no attribution required,
commercial use allowed). Each `<img>` / `<source>` carries `data-az-asset` with the
final local filename, so swapping to a self-hosted file is a one-line change per
image. Save localised files in `/pages/en/contact-us/images/` — the Arabic page
references the same files (CLAUDE.md §3.1: never duplicate media between languages).

| Section | data-az-asset | Remote URL | Type | Notes |
|---|---|---|---|---|
| §01 Hero | `contact-hero-facade.webp` | `https://images.pexels.com/photos/2497641/pexels-photo-2497641.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop` | Image (LCP, eager) | Source is portrait; the 16:9 centre crop shows a band of façade. Also used for OG/Twitter image (1200×630 crop). |
| §03 Cairo HQ | `contact-cairo-hq.webp` | `https://images.pexels.com/photos/3862384/pexels-photo-3862384.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1200&fit=crop` | Image (lazy) | Engineers reviewing drawings. 4:3 crop. |
| §04 Sharqia | `contact-sharqia-branch.webp` | `https://images.pexels.com/photos/30379884/pexels-photo-30379884.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1200&fit=crop` | Image (lazy) | Surveyor with levelling instrument. 4:3 crop. |
| §10 CTA band | `contact-cta-bridge.webp` | `https://images.pexels.com/photos/12027074/pexels-photo-12027074.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop` | Image (lazy) | Aerial of a steel bridge over a river, under an 80% navy overlay. |
| (optional) Hero video | `contact-hero.mp4` | `https://www.pexels.com/download/video/9823686/` | Video | **Not implemented.** Same aerial bridge-construction clip as the home hero — an optional on-brand reuse if the hero should move. Transcode to < 8 MB (CLAUDE.md §9). |

The WebP `<source>` elements use the same URLs with `&fm=webp` appended.

## Maps (embeds, not assets)

| Section | Query | Resolves to (checked 2026-09-30) |
|---|---|---|
| §07 Cairo HQ | `127 Mohamed Farid St, Al-Bustan Building, Abdin, Cairo, Egypt` | Mohamed Farid St, Abdin (≈ 30.0597, 31.2444) — correct area. |
| §07 Sharqia | `Hesham Zidan Street off Zagazig Ismailia Road Al-Qurain Sharqia Egypt` | **Zagazig city centre** ("Zagazig 1, El-Hariry"), not Al-Qurain — about 25 km off. A plain `Al Qurein, Sharqia, Egypt` query lands on El Qurein town (≈ 30.615, 31.743). Confirm the exact pin with the client. |
