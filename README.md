# Al Zahraa Construction — Website

Bilingual (English + Arabic / RTL) marketing website for **Al Zahraa General
Contracting, Import & Export Company** — roads, bridges, and civil
infrastructure since 1995.

## Stack

Plain **HTML5 + CSS3 + vanilla JavaScript**. No frameworks, no npm, no build
step. The folder you edit is the folder you upload.

- All asset paths are **root-absolute** (`/assets/…`, `/pages/…`), never `../`.
- Only the navbar and footer are shared; they are injected at runtime by JS.
- Mobile-first CSS; design tokens live in `/assets/css/variables.css`.

## Run locally

Partials are loaded with `fetch()` and every path is root-absolute, so the site
**must** be served over HTTP — opening `index.html` with `file://` will break
the navbar/footer injection (this is expected, not a bug).

```bash
python3 -m http.server 5500
# then open http://localhost:5500
```

## Folder structure (summary)

```
/                     English home (index.html) + robots, sitemap, 404
assets/               SHARED ONLY — css, js, partials, images, videos, fonts
  css/                reset, variables, typography, global, utilities,
                      components, navbar, footer, rtl
  js/                 site-data, include, navbar, footer, lang-switch,
                      animations, main
  partials/           navbar-en/ar, footer-en/ar (injected at runtime)
pages/
  en/                 home (assets for root index), about-us, our-services (+6),
                      our-projects (+8), equipment, our-team, quality-safety,
                      clients-partners, media-center, news, careers, contact-us
  ar/                 exact mirror of en/ (English slugs, translated content);
                      ar/home/ holds the Arabic home index.html
```

Each page owns its CSS/JS/images/videos inside its own folder. Folder slugs stay
English in both languages — only the content is translated.

## Source of truth

**`CLAUDE.md` in the repo root is the project bible.** Read it in full before
touching any file — it defines the design system, bilingual/RTL rules, page
requirements, and the team workflow. If anything here conflicts with `CLAUDE.md`,
`CLAUDE.md` wins.
