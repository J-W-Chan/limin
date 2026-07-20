# Forms

> Two real form patterns exist. Match the one that fits the page.

## Pattern A — Login (network submit)

**Files:** `login.html`, `js/login.js`

- Form `#loginForm` with `#username`, `#password`, `#errorMessage`.
- `submit` listener calls `event.preventDefault()`.
- `fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })`.
- On `!response.ok`, show `data.message || data.error` in `#errorMessage`.
- On success, `localStorage.setItem('userToken', data.token)` then redirect to `indexNew.html`.

Use this pattern for any new form that must call a Cloudflare Function.

## Pattern B — Business pages (client-only submit UX)

**Files:** `indexNew.html`, `index-baoxian.html`, `index-fenqi.html`, and siblings

- Form `name="messageForm"` / `id="messageForm1"` wrapping a large HTML table of inputs.
- Primary action is often `type="button"` (e.g. `.shenqing-btn`), **not** a native form POST.
- Validation example: phone regex `/^1[3|4|5|6|7|8|9]\d{9}$/` then `alert('请输入正确手机号')`.
- Success UX: `$('.tc').show()` (or `alert(...)` on some pages) — **no `fetch` to a backend** for these business submits today.
- Quota / counter logic uses jQuery reads/writes and `alert("剩余名额不能小于0,请刷新页面")`.

Use this pattern when extending the same demo/UX pages without a new API.

## Rules

- Do not convert Pattern B pages to SPA forms without an explicit task.
- If a business form starts calling an API for the first time, follow Pattern A’s `fetch` + JSON body + Chinese `message` display, and document the new endpoint under `functions/`.
- Keep `required` / simple HTML constraints on login inputs as in `login.html`.

## Anti-patterns

- Do not add FormData multipart upload helpers unless a real endpoint and page example exist.
- Do not invent a shared form library; none exists in the repo.
