# Directory Structure

> How frontend assets are laid out in this Cloudflare Pages project.

## Layout

```text
.
├── *.html              # Feature pages at repo root (not under src/)
├── login.html          # Public login page
├── css/                # Shared stylesheets
├── images/             # Static images
├── js/                 # Shared client scripts (jQuery plugins + auth/login)
├── functions/          # Cloudflare Pages Functions (API) — see ../functions/
├── _redirects          # Pages redirects (e.g. / → /indexNew.html)
├── wrangler.toml       # Local Pages config
└── package.json        # Scripts: wrangler pages dev / deploy only
```

## Page ownership

| Path | Role |
|------|------|
| `login.html` | Public login UI; loads `/js/login.js` |
| `indexNew.html` | Scholarship / primary home after login; loads `js/auth.js` |
| `index-chaxun.html` | Continuing-education UI (auth script currently commented out) |
| `index-*.html`, `yuanxiao.html`, etc. | Sibling feature pages sharing the same table + jQuery style |

## Shared scripts (`js/`)

| File | Role |
|------|------|
| `js/jquery.min.js` | Required by most feature pages |
| `js/auth.js` | Client login gate + username display + logout |
| `js/login.js` | Login form submit → `POST /login` |
| `js/calendar.js`, `js/maydate.js`, `js/date.js`, `js/timexyf.js` | Date/calendar helpers used by forms |

## Rules

- Keep new feature pages at the **repo root** next to existing `index-*.html` files unless a task says otherwise.
- Put reusable client logic in `js/`; put page-specific UI glue in a `<script>` block on that page (current dominant pattern).
- Styles belong in `css/` or a page-local `<style>` block when matching nearby pages.

## Anti-patterns

- Do not create `src/`, `components/`, or a bundler pipeline for UI work.
- Do not move Pages Functions under `js/` — APIs live in `functions/`.
