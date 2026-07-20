# Quality Guidelines

> Standards that match what the repo actually runs today.

## Stack constraints

- Runtime: static HTML/CSS/JS on Cloudflare Pages + `functions/` Workers handlers.
- Package scripts: `npm run dev` → `wrangler pages dev .`; `npm run deploy` → `wrangler pages deploy .`.
- No TypeScript, no ESLint/Prettier config, no component test runner in `package.json`.

## Logging

- Server: `console.error('Login error:', error)` in `functions/login.js`.
- Client: `console.log` / `console.warn` / `console.error` in `js/auth.js` and `js/login.js`.
- Do not introduce a logging framework unless a task adds one.

## Tests

- **No automated test files or test scripts exist** in this repository.
- Documented manual checks:
  - `API_RESPONSE_FORMAT.md` — curl / browser `fetch` for `POST /login`
  - `DEPLOYMENT_GUIDE.md` — login redirect checklist after deploy

When adding behavior, prefer extending those manual recipes until a test harness is intentionally introduced.

## Verification commands (local)

```bash
npm run dev
# then exercise login.html and protected pages in the browser
```

```bash
curl -X POST http://localhost:8788/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"...\",\"password\":\"...\"}"
```

## Anti-patterns

- Do not claim Jest/Vitest/Playwright coverage exists.
- Do not refactor pages for “clean architecture” during an unrelated feature task.
