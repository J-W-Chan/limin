# PRD: 添加用户页面写入 D1

## Goal

为管理员提供一个参考 `login.html` 的「添加用户」页面，将手填的 Id、用户名、密码写入 Cloudflare D1 表 `LM_User`，便于维护登录账号。

## Background

- 现有登录：`POST /login` 查询 `LM_User`，明文比对 `Password`，签发 JWT（含 `username`）。
- 页面门禁靠前端 `js/auth.js`；`functions/_middleware.js` 对 API 放行。
- 本功能经 grilling 收敛，见下方决策。

## Decisions (locked)

| 决策 | 结论 |
|------|------|
| 权限 | 仅 JWT `username === 'admin'` 可进页；**仅前端校验**，API 不验 token |
| 入口 | `indexNew.html` 顶部链接，仅 admin 可见 |
| 页面/API | `add-user.html` + `js/add-user.js` + `POST /add-user` |
| 字段 | 手填 Id、用户名、密码 → `id` / `UserName` / `Password` |
| 密码 | 明文存储（与现有登录一致） |
| 冲突 | 插入前查 `id` / `UserName`，冲突 → 409 + 中文 `message` |
| 成功 | 留页、清空表单、成功提示，可继续添加 |
| 非权限访问 | 未登录 → `login.html`；已登录非 admin → `indexNew.html` |
| UI | 对齐 `login.html` 布局与 `fetch` + JSON 提交模式 |

## Out of scope

- 服务端 JWT / admin 鉴权
- 密码哈希或改造 `login.js`
- 用户列表、编辑、删除
- 角色体系（非字面用户名 `admin`）

## Acceptance criteria

- [ ] `admin` 登录后在 `indexNew.html` 看到「添加用户」入口；非 admin 看不到
- [ ] 未登录访问 `add-user.html` → 跳转 `login.html`
- [ ] 已登录非 admin 访问 `add-user.html` → 跳转 `indexNew.html`
- [ ] `admin` 可提交 Id / 用户名 / 密码，成功写入 D1 `LM_User`
- [ ] Id 或用户名已存在时返回可读中文错误，不插入
- [ ] 成功后表单清空并显示成功提示，可继续添加
- [ ] 新用户可用现有登录流程以明文密码登录
- [ ] API 响应形状对齐现有约定：`{ success, message }` / `{ error, message }`

## Risks (accepted)

- API 无服务端鉴权：知悉 URL 的客户端可直接调用 `POST /add-user`。
