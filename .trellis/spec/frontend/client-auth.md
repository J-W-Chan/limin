# Client Auth

> Page protection is client-side. Cloudflare `_middleware.js` does not enforce login on HTML.

## Token storage

- Key: `localStorage.userToken`
- Set after successful login in `js/login.js` from `data.token`
- Cleared on logout or invalid/expired token in `js/auth.js`

## Gate script (`js/auth.js`)

On pages that include this script:

1. If no `userToken` → redirect to `login.html`.
2. Parse JWT payload (Base64URL middle segment); if `exp` is past → remove token and redirect.
3. Show welcome text in `#userNameDisplay` from `payload.username` (fallback `UserName`).
4. `#logoutBtn` clears `userToken` and redirects to `login.html`.

Logging today: `console.log` / `console.warn` / `console.error` only.

## Which pages are protected

| Page | Gate |
|------|------|
| `indexNew.html` | `js/auth.js` (login required); admin-only「添加用户」link shown via inline token check |
| `add-user.html` | `js/add-user.js` admin gate (not `auth.js`): no token → `login.html`; non-admin → `indexNew.html`; bind submit only after pass |
| `index-chaxun.html` | `js/auth.js` commented out (treat as unprotected until uncommented) |
| `login.html` | Not included (public) |

`DEPLOYMENT_GUIDE.md` may claim more pages are protected; **trust the HTML script tags**.

## Rules

- To protect a page with login-only: add `<script type="text/javascript" src="js/auth.js"></script>` (after jQuery, as on `indexNew.html`).
- Admin-only pages may use a dedicated gate script (see `js/add-user.js`) instead of `auth.js`.
- Do not rely on `functions/_middleware.js` for HTML auth — it currently calls `next()` for all requests.
- API calls that need auth later must define a real server-side check; client `localStorage` alone is not server security. (`POST /add-user` intentionally has no server auth per PRD.)

## Anti-patterns

- Do not send `Authorization: Bearer` headers unless an endpoint is written to read them (current login flow does not).
- Do not implement a second token key name; keep `userToken`.
