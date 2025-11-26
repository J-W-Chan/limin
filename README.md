# 立名教育管理系统

## 项目说明

这是一个基于 Cloudflare Pages 的教育管理系统,包含助学金申请和继续教育报名等功能。

## 技术栈

- 前端: HTML, CSS, JavaScript, jQuery
- 后端: Cloudflare Functions (Serverless)
- 认证: JWT (JSON Web Token)
- 部署: Cloudflare Pages

## 本地开发

### 安装依赖

```bash
npm install
```

### 本地运行

```bash
npx wrangler pages dev .
```

访问 `http://localhost:8788`

## Cloudflare Pages 部署

### 1. 通过 Git 部署

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Pages** > **Create a project**
3. 连接你的 Git 仓库
4. 配置构建设置:
   - **Framework preset**: None
   - **Build command**: 留空
   - **Build output directory**: `/` (根目录)
   - **Root directory**: `/` (根目录)

### 2. 设置环境变量

在 Cloudflare Pages 项目设置中添加以下环境变量:

- `JWT_SECRET`: 你的 JWT 密钥(建议使用强随机字符串)

示例生成 JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. 部署

推送代码到 Git 仓库,Cloudflare Pages 会自动部署。

## 目录结构

```
.
├── css/              # 样式文件
├── images/           # 图片资源
├── js/               # JavaScript 文件
│   ├── auth.js       # 认证模块
│   ├── login.js      # 登录逻辑
│   └── ...
├── functions/        # Cloudflare Functions
│   ├── _middleware.js  # 中间件(JWT 验证)
│   └── login.js        # 登录接口
├── login.html        # 登录页面
├── indexNew.html     # 助学金申请系统
├── index-chaxun.html # 继续教育报名系统
├── _redirects        # 重定向规则
├── wrangler.toml     # Cloudflare 配置
└── package.json      # 依赖配置
```

## 功能模块

- **登录认证**: 基于 JWT 的用户认证
- **助学金申请系统** (主页): 学生助学金申请和管理
- **继续教育报名系统**: 成人继续教育报名查询

## 访问流程

1. 访问根路径 `/` 会自动重定向到 `indexNew.html` (助学金申请系统主页)
2. 如果用户未登录,会自动跳转到 `login.html` 登录页
3. 登录成功后,返回到 `indexNew.html` 主页
4. 可通过左侧导航切换到其他系统模块

## 注意事项

1. 首次部署前,确保在 Cloudflare Dashboard 中设置 `JWT_SECRET` 环境变量
2. `node_modules` 和 `package-lock.json` 已在 `.gitignore` 中排除
3. 所有 HTML 页面使用相对路径引用资源,支持任意目录部署

## 许可证

ISC

