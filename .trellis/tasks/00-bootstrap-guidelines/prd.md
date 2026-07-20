# Bootstrap Task: Fill Project Development Guidelines

**You (the AI) are running this task. The developer does not read this file.**

Populate `.trellis/spec/` from **this** Cloudflare Pages + jQuery codebase.
Document reality only — no React/hooks/TypeScript conventions.

---

## Status

- [x] Analyze repository patterns (API, auth, logging, tests, forms)
- [x] Replace React-shaped frontend template specs with source-backed guides
- [x] Add `functions/` spec layer for Pages Functions
- [x] Remove inapplicable template files (components / hooks / type-safety / React state)
- [x] Verify no `To be filled` / placeholder prose remains under `.trellis/spec/`

---

## Spec files (final)

### Frontend — `.trellis/spec/frontend/`

| File | Content |
|------|---------|
| `index.md` | Index + pre-dev / quality checklists |
| `directory-structure.md` | Root HTML, `js/`, `css/`, `functions/` |
| `pages-and-scripts.md` | jQuery load order, tabs, mock tables |
| `forms.md` | Login `fetch` vs business `button` + `alert` / `.tc` |
| `client-auth.md` | `localStorage.userToken`, `js/auth.js` gate |
| `quality-guidelines.md` | console logging, no automated tests, wrangler |

### Functions — `.trellis/spec/functions/`

| File | Content |
|------|---------|
| `index.md` | Index + checklists |
| `api-routes.md` | `onRequestPost`, `/login`, JSON `{error,message}` |
| `env-and-d1.md` | `JWT_SECRET`, `dbLiming`, `LM_User` |

### Guides — `.trellis/spec/guides/`

Kept as shared thinking guides (already populated). Apply to login/API boundaries when relevant.

---

## Architecture context (evidence)

- Single Cloudflare Pages app: static HTML + `js/` + `functions/`.
- Only API: `POST /login` via `functions/login.js`.
- Auth: client `js/auth.js`; `_middleware.js` is passthrough.
- Logging: `console.*` only.
- Tests: none; manual curl / browser checks in `API_RESPONSE_FORMAT.md`.
- Forms: login uses `fetch`; feature pages use jQuery + modal, no API submit.

---

## Acceptance Criteria

- [x] Specs contain concrete examples and file paths from the repository
- [x] No placeholder text remains under `.trellis/spec/`
- [x] Index files match the final spec file set
- [x] Claims are backed by source files or project docs (`API_RESPONSE_FORMAT.md`, `README.md`)

---

## Completion

When the developer confirms, archive:

```bash
python ./.trellis/scripts/task.py finish
python ./.trellis/scripts/task.py archive 00-bootstrap-guidelines
```
