# Design: 添加用户页面写入 D1

## Boundaries

| Layer | Owns |
|-------|------|
| `add-user.html` | 表单 UI（Id / 用户名 / 密码），样式对齐 `login.html` |
| `js/add-user.js` | 前端 admin 门禁、`fetch('/add-user')`、成功/错误展示、清空表单 |
| `indexNew.html` | admin 可见入口链接（读 JWT `username`） |
| `functions/add-user.js` | `onRequestGet`（`maxId`）；`onRequestPost`：校验 → 查重 → `INSERT` → JSON 响应 |
| D1 `env.dbLiming` | 表 `LM_User` |

不改：`functions/login.js` 密码逻辑、`_middleware.js`、登录 JWT 载荷结构。

## Contracts

### `POST /add-user`

Request JSON:

```json
{ "id": 1, "username": "newuser", "password": "plain" }
```

- `id`：必填，写入列 `id`（前端表单标签为「Id」）
- `username` → `UserName`
- `password` → `Password`（明文）

Success 200:

```json
{ "success": true, "message": "用户创建成功" }
```

Errors (对齐 `API_RESPONSE_FORMAT.md` 风格):

| Status | error | message（示例） |
|--------|-------|----------------|
| 400 | Missing fields | 请填写 Id、用户名和密码 |
| 409 | Duplicate id | Id 已存在 |
| 409 | Duplicate username | 用户名已存在 |
| 500 | Internal server error | 服务器内部错误: … |

### Client auth gate

1. 无 `localStorage.userToken` → `login.html`
2. 解析 JWT；`username !== 'admin'` → `indexNew.html`
3. 通过后才绑定表单提交；并 `GET /add-user` 展示/预填最大 Id

`indexNew.html` 入口：解析 token 后若 `username === 'admin'` 显示指向 `add-user.html` 的链接。

## Data flow

```
admin 打开 add-user.html
  → 前端验 token + admin
  → GET /add-user → 显示 maxId，预填 maxId+1
  → 提交 JSON
  → functions/add-user.js
       → SELECT by id / UserName
       → INSERT INTO LM_User (id, UserName, Password)
  → 前端展示 message，清空表单，再拉 maxId
```

## Compatibility

- 新行可被现有 `login.js` 用 `UserName` + 明文 `Password` 登录。
- 列名与登录代码一致：`id`、`UserName`、`Password`（来自 `functions/login.js` 字段用法）。

## Rollout / rollback

- 部署新静态页 + Function；无迁移脚本（依赖表已存在且允许手工指定 `id`）。
- 回滚：删除/下线 `add-user.*` 与入口链接即可；已插入数据保留。
