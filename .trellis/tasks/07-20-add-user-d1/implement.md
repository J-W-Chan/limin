# Implement: 添加用户页面写入 D1

## Checklist

1. [x] 新增 `functions/add-user.js`：`onRequestPost`，缺参 400、查重 409、INSERT、统一 JSON
2. [x] 新增 `add-user.html`：三字段表单 + 成功/错误提示区，样式参考 `login.html`
3. [x] 新增 `js/add-user.js`：admin 门禁 + `fetch('/add-user')` + 成功清空
4. [x] 改 `indexNew.html`：admin 可见「添加用户」链接
5. [ ] 本地 `npm run dev` 手工验收 PRD 验收项
6. [x] 若行为写入约定：更新 `.trellis/spec/frontend/forms.md` / `client-auth.md` 与 `functions/api-routes.md`（Phase 3.3）

## Validation

```bash
npm run dev
```

- 用非 admin 登录：主页无入口；直开 `add-user.html` 被踢回主页
- 未登录直开 `add-user.html` → 登录页
- admin：入口可见；创建用户成功；重复 Id/用户名有中文错误
- 用新用户走 `login.html` 可登录

```bash
curl -X POST http://localhost:8788/add-user -H "Content-Type: application/json" -d "{\"id\":999,\"username\":\"t1\",\"password\":\"p1\"}"
```

## Review gates

- 对照 PRD 验收项全勾
- 对照 `.trellis/spec/frontend` + `functions`（提交形态、明文密码现状、无服务端鉴权需与 PRD 一致）

## Rollback points

- 入口链接可单独回退；API/页面文件可整文件删除
