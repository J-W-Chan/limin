# API Routes

> Only one production API handler exists today: login.

## File → route mapping

Cloudflare Pages maps `functions/<name>.js` to `/<name>`.

| File | Method | Route |
|------|--------|-------|
| `functions/login.js` | POST | `/login` |
| `functions/_middleware.js` | all (passthrough) | middleware for Functions |

## Handler shape (`functions/login.js`)

```javascript
export async function onRequestPost(context) {
  const { request, env } = context;
  // validate → query → respond with Response + JSON
}
```

## Response contract (login)

Documented in `API_RESPONSE_FORMAT.md`. Observed shape:

**Success (200)**

```json
{ "success": true, "token": "<jwt>", "message": "登录成功" }
```

**Error (400 / 401 / 500)**

```json
{ "error": "<English code>", "message": "<中文提示>" }
```

Always set `headers: { 'Content-Type': 'application/json' }`.

## Request body

Login reads `await request.json()` and expects `{ username, password }`.

## Middleware reality

`functions/_middleware.js` documents that static HTML is not gated here and currently `return next()` for all requests. Auth for pages is client-side (`js/auth.js`).

## Rules for new endpoints

- Add `functions/<route>.js` exporting `onRequestGet` / `onRequestPost` / etc. as needed.
- Prefer the same dual-field error style (`error` + Chinese `message`) so existing UI patterns can show `data.message`.
- Keep JWT helpers local to the handler file until a second endpoint forces shared extraction (no shared `lib/` exists yet).

## Anti-patterns

- Do not invent Express/Koa routers or a `routes/` tree — Pages Functions file routing is the convention.
- Do not document Bearer-token middleware as existing; it is not implemented.
