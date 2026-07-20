# Frontend Development Guidelines

> Static HTML + jQuery pages under the repo root. Applies to `*.html`, `js/`, and `css/`.

This is **not** a React/Vue/TypeScript SPA. Do not introduce components, hooks, or a build step unless a future task explicitly migrates the stack.

---

## Guidelines Index

| Guide | Description |
|-------|-------------|
| [Directory Structure](./directory-structure.md) | Root HTML, `js/`, `css/`, assets |
| [Pages and Scripts](./pages-and-scripts.md) | Script load order, jQuery, inline scripts |
| [Forms](./forms.md) | Login `fetch` form vs business `button` + modal |
| [Client Auth](./client-auth.md) | `localStorage` token gate via `js/auth.js` |
| [Quality Guidelines](./quality-guidelines.md) | Logging, tests gap, verification |

API / Cloudflare Functions conventions live in [../functions/](../functions/index.md).

---

## Pre-Development Checklist

- [ ] Confirm the target page is an existing root `*.html` (or a deliberate new sibling page).
- [ ] If the page must require login, include `js/auth.js` (do not assume `_middleware.js` blocks HTML).
- [ ] Prefer matching the nearest sibling page's table/form/jQuery patterns over inventing a new UI stack.
- [ ] New HTTP calls must follow [../functions/api-routes.md](../functions/api-routes.md) and `API_RESPONSE_FORMAT.md`.

## Quality Check

- [ ] No React/Vue/TS patterns introduced without an explicit task.
- [ ] Protected pages that should gate access still load `js/auth.js`.
- [ ] Forms match either the login `fetch` pattern or the business `type="button"` + `alert` / `.tc` pattern.
- [ ] User-visible errors from APIs use the Chinese `message` field when present.
