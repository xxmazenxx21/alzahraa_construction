# Projects portfolio

The English and Arabic pages support any number of project cards, including the requested 40, with search, category counts and 12/24/all pagination. Eight confirmed project names are currently published. The import worksheet has 40 rows; the remaining 32 are blank and unpublished. It is a content handoff worksheet, not a runtime upload or automatic publishing mechanism.

## Add a confirmed project

1. Fill the worksheet with the English/Arabic name, slug, confirmed category and description. Category values: `bridges`, `roads`, `ring-roads`, `urban-works`, `other`. Abo-Hammad remains `other` until its category is confirmed.
2. Add a matching `<article class="project-card page-reveal" data-category="roads" data-az-search="English name Arabic name" aria-labelledby="project-9">` inside `#project-list` in both HTML pages. Use unique heading IDs, the page's own language for descriptions and `/pages/{lang}/our-projects/{slug}/` for an existing detail page. Use `#` only if no detail page exists.
3. Reuse the card markup from the existing projects. For photos, use a `<picture>` with English-folder local media paths and an adjacent original SOURCE comment. If no photo is supplied, use the gradient name panel rather than an unrelated project's photo. Omit unconfirmed client/status/year/location values.
4. Update the static portfolio counter, card denominators and initial result count in both HTML pages for the no-JavaScript fallback. JavaScript also derives these values from the card count automatically; filters and pagination need no changes.

No shared files, new libraries, network media downloads or Tailwind rebuilds are required. The four additional names are sourced from CLAUDE.md §7.4. Their photographs and detailed facts still need client confirmation.
