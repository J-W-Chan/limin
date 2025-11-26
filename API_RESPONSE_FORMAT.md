# API 响应格式文档

## 登录 API: POST /login

### 请求格式

```json
{
  "username": "用户名",
  "password": "密码"
}
```

### 响应格式

#### 成功响应 (200 OK)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "登录成功"
}
```

#### 错误响应

##### 1. 缺少用户名或密码 (400 Bad Request)

```json
{
  "error": "Missing credentials",
  "message": "请输入用户名和密码"
}
```

##### 2. 用户名或密码错误 (401 Unauthorized)

```json
{
  "error": "Invalid credentials",
  "message": "用户名或密码错误"
}
```

##### 3. 服务器配置错误 (500 Internal Server Error)

```json
{
  "error": "JWT_SECRET is not set",
  "message": "服务器配置错误，请联系管理员"
}
```

##### 4. 服务器内部错误 (500 Internal Server Error)

```json
{
  "error": "Internal server error",
  "message": "服务器内部错误: [错误详情]"
}
```

## 前端处理示例

### 登录成功

```javascript
const response = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});

const data = await response.json();

if (response.ok) {
    // 成功: data.success === true
    localStorage.setItem('userToken', data.token);
    console.log(data.message); // "登录成功"
    window.location.href = 'indexNew.html';
}
```

### 登录失败

```javascript
if (!response.ok) {
    // 失败: 显示 data.message
    // 例如: "用户名或密码错误"
    errorMessageEl.textContent = data.message;
}
```

## 错误消息映射

| HTTP 状态码 | error 字段 | message 字段 | 说明 |
|------------|-----------|-------------|------|
| 400 | Missing credentials | 请输入用户名和密码 | 请求参数缺失 |
| 401 | Invalid credentials | 用户名或密码错误 | 认证失败 |
| 500 | JWT_SECRET is not set | 服务器配置错误，请联系管理员 | 环境变量未设置 |
| 500 | Internal server error | 服务器内部错误: ... | 未预期的错误 |

## 特点

### 1. 统一的 JSON 格式
- ✅ 所有响应都是 JSON 格式
- ✅ 包含 `Content-Type: application/json` header
- ✅ 便于前端统一处理

### 2. 双语言支持
- `error`: 英文错误标识(用于开发调试)
- `message`: 中文错误消息(用于用户显示)

### 3. 友好的错误提示
- ✅ 所有错误消息都是中文
- ✅ 清晰明了,用户友好
- ✅ 不泄露敏感信息

## 示例场景

### 场景 1: 忘记输入密码

**请求:**
```json
{
  "username": "test",
  "password": ""
}
```

**响应:** (400)
```json
{
  "error": "Missing credentials",
  "message": "请输入用户名和密码"
}
```

**前端显示:** "请输入用户名和密码"

---

### 场景 2: 密码错误

**请求:**
```json
{
  "username": "test",
  "password": "wrongpassword"
}
```

**响应:** (401)
```json
{
  "error": "Invalid credentials",
  "message": "用户名或密码错误"
}
```

**前端显示:** "用户名或密码错误"

---

### 场景 3: 登录成功

**请求:**
```json
{
  "username": "test",
  "password": "correctpassword"
}
```

**响应:** (200)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.signature",
  "message": "登录成功"
}
```

**前端显示:** 自动跳转到主页

---

## 测试命令

### 使用 curl 测试

```bash
# 测试登录成功
curl -X POST https://liming-aty.pages.dev/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# 测试密码错误
curl -X POST https://liming-aty.pages.dev/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"wrong"}'

# 测试缺少参数
curl -X POST https://liming-aty.pages.dev/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test"}'
```

### 使用浏览器控制台测试

```javascript
// 测试登录
fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'test',
        password: 'test123'
    })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## 优势

1. **✅ 统一格式**: 所有响应都是 JSON,便于处理
2. **✅ 中文友好**: 错误消息直接用中文,无需前端翻译
3. **✅ 易于调试**: `error` 字段提供英文标识
4. **✅ 用户友好**: `message` 字段提供清晰的提示
5. **✅ 安全性**: 不泄露敏感的服务器信息

---

**更新日期**: 2024-11-26
**版本**: 1.0

