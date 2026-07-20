# Env and D1

> Bindings and data access used by `functions/login.js`.

## Environment

| Binding | Usage |
|---------|--------|
| `env.JWT_SECRET` | HS256 signing secret. If missing → 500 `{ error: 'JWT_SECRET is not set', message: '服务器配置错误，请联系管理员' }` |
| `env.dbLiming` | D1 database binding used for user lookup |

Set `JWT_SECRET` in Cloudflare Pages project settings (see `README.md` / `DEPLOYMENT_GUIDE.md`). Local `wrangler.toml` in-repo does not declare the D1 binding; production/dashboard config is authoritative for bindings.

## User lookup

```javascript
const user = await env.dbLiming.prepare(
  'SELECT * FROM LM_User WHERE UserName = ?'
).bind(username).first();
```

- Table: `LM_User`
- Match column: `UserName`
- Password check in code today: plain equality `password === user.Password` (document as current behavior; do not “fix” hashing in an unrelated feature without a dedicated security task).

## JWT payload

Generated claims include `userId` (from `user.id`), `username` (from `user.UserName`), `iat`, and `exp` (24 hours). Signed with Web Crypto HMAC-SHA256 helpers defined in the same file.

## Rules

- Read secrets only from `env`.
- Use parameterized `.prepare(...).bind(...)` for SQL — do not concatenate user input into SQL strings.
- Keep Chinese user-facing `message` strings for configuration and auth failures consistent with login.

## Anti-patterns

- Do not hard-code JWT secrets in source.
- Do not assume a second D1 binding name; only `dbLiming` appears in code.
