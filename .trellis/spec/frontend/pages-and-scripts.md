# Pages and Scripts

> How pages load scripts and wire UI behavior.

## Typical feature page head

Feature pages (example: `indexNew.html`) load jQuery first, then shared helpers, then auth when required:

1. `js/jquery.min.js`
2. CSS (`css/style.css`, `css/cssxyf.css`, `css/cxcalendar.css`, …)
3. Optional `js/auth.js` for login gate
4. Date helpers (`js/maydate.js`, `js/calendar.js`, …)
5. Page-inline `<script>` for tabs, validation, mock tables

`login.html` is different: no jQuery; only `/js/login.js`.

## Behavior patterns present in code

- **Tabs**: jQuery click handlers toggle `.new_pageN` visibility and `.hot` on tab buttons (see `indexNew.html`, `index-chaxun.html`).
- **Modals**: `.tc` overlay; close via `$(".tc span").click(...)`.
- **Mock lists**: large in-page arrays (e.g. `allStudents`) rendered into table bodies with `$('#…').html(html)` — not loaded from an API today.
- **DOM updates**: direct jQuery `.val()`, `.text()`, `.html()`, `.show()` / `.hide()`.

## Rules

- Prefer jQuery + inline page scripts when extending existing feature pages.
- Keep login as the vanilla `fetch` page (`login.html` + `js/login.js`).
- When copying a page, copy its script include list; do not “modernize” to modules/bundlers mid-feature.

## Anti-patterns

- Do not add React/Vue components or custom hooks.
- Do not assume every page includes `auth.js` — check the page (e.g. `index-chaxun.html` has it commented out).
