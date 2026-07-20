# API Routes

> Production handlers: login and add-user (Pages Functions file routing).

## File → route mapping

Cloudflare Pages maps `functions/<name>.js` to `/<name>`.

| File | Method | Route |
|------|--------|-------|
| `functions/login.js` | POST | `/login` |
| `functions/add-user.js` | GET, POST | `/add-user` |
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

### `GET /add-user` (`functions/add-user.js`)

Returns current max primary key for the Id form hint:

```json
{ "success": true, "maxId": 12 }
```

Empty table → `maxId: 0`. Used by `js/add-user.js` to show「当前最大 Id」and optionally prefill `maxId + 1`.

### `POST /add-user` (`functions/add-user.js`)

Request JSON: `{ id, username, password }` → columns `id` / `UserName` / `Password` (plaintext, same as login).

**Success (200)**

```json
{ "success": true, "message": "用户创建成功" }
```

**Errors**

| Status | error | message（示例） |
|--------|-------|----------------|
| 400 | Missing fields | 请填写 Id、用户名和密码 |
| 409 | Duplicate id | Id 已存在 |
| 409 | Duplicate username | 用户名已存在 |
| 500 | Internal server error | 服务器内部错误: … |

No server-side JWT/admin check (accepted risk; page gate is client-only).

## Middleware reality

`functions/_middleware.js` documents that static HTML is not gated here and currently `return next()` for all requests. Auth for pages is client-side (`js/auth.js` or page-specific gates like `js/add-user.js`).

## Rules for new endpoints

- Add `functions/<route>.js` exporting `onRequestGet` / `onRequestPost` / etc. as needed.
- Prefer the same dual-field error style (`error` + Chinese `message`) so existing UI patterns can show `data.message`.
- Keep JWT helpers local to the handler file until a shared extract is justified (login still owns its helpers; add-user does not mint tokens).

## Anti-patterns

- Do not invent Express/Koa routers or a `routes/` tree — Pages Functions file routing is the convention.
- Do not document Bearer-token middleware as existing; it is not implemented.
