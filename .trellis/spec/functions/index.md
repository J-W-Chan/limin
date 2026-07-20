# Cloudflare Functions Guidelines

> Serverless API handlers under `functions/` for Cloudflare Pages.

Applies to files in `functions/`. Static HTML does **not** go through these handlers except when the browser calls the matching route.

---

## Guidelines Index

| Guide | Description |
|-------|-------------|
| [API Routes](./api-routes.md) | `onRequestPost`, path mapping, JSON responses |
| [Env and D1](./env-and-d1.md) | `JWT_SECRET`, `dbLiming`, `LM_User` |

Client login/token behavior: [../frontend/client-auth.md](../frontend/client-auth.md).  
Canonical login payload examples: repo root `API_RESPONSE_FORMAT.md`.

---

## Pre-Development Checklist

- [ ] New endpoint file lives under `functions/` with the Pages file-based route name.
- [ ] Handler exports the correct `onRequest*` method for the HTTP verb.
- [ ] Success/error JSON matches the existing `{ success, … }` / `{ error, message }` shape where applicable.
- [ ] Secrets and DB bindings come from `env`, not hard-coded values.

## Quality Check

- [ ] Errors return JSON with `Content-Type: application/json` and an appropriate status (400/401/500 as in login).
- [ ] Unexpected failures are caught; log with `console.error` and return a Chinese `message` for the UI.
- [ ] Do not assume `_middleware.js` authenticates callers — it currently passthroughs.
