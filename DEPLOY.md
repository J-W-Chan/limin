# Cloudflare Pages 部署指南

## 📦 部署方式

### 方式 1: 通过 Cloudflare Dashboard (推荐)

这是最简单的部署方式,适合大多数用户。

#### 步骤:

1. **登录 Cloudflare**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 登录你的账号

2. **创建 Pages 项目**
   - 点击左侧菜单 **Workers & Pages**
   - 点击 **Create application**
   - 选择 **Pages** 标签
   - 点击 **Connect to Git**

3. **连接 Git 仓库**
   - 选择你的 Git 提供商(GitHub/GitLab)
   - 授权 Cloudflare 访问
   - 选择这个项目的仓库

4. **配置构建设置**
   - **Project name**: `liming` (或你喜欢的名称)
   - **Production branch**: `main` (或你的主分支)
   - **Framework preset**: `None` (不使用框架)
   - **Build command**: 留空
   - **Build output directory**: `/` (根目录)
   - **Root directory (advanced)**: `/` (根目录)

5. **开始部署**
   - 点击 **Save and Deploy**
   - 等待部署完成(通常 1-2 分钟)

6. **设置环境变量**
   - 部署完成后,进入项目设置
   - 点击 **Settings** > **Environment variables**
   - 点击 **Add variable**
   - 添加以下变量:
     * **Variable name**: `JWT_SECRET`
     * **Type**: 选择 **Secret** (加密存储)
     * **Value**: 你的 JWT 密钥
     * **Environment**: 选择 `Production` 和 `Preview`
   - 点击 **Save**

7. **重新部署** (应用环境变量)
   - 进入 **Deployments** 页面
   - 点击最新部署右侧的 **···**
   - 选择 **Retry deployment**

### 方式 2: 通过命令行部署

适合开发者和自动化部署。

#### 前置要求:

```bash
# 安装 Node.js (如果还没安装)
# 下载: https://nodejs.org/

# 安装 Wrangler CLI
npm install -g wrangler

# 验证安装
wrangler --version
```

#### 部署步骤:

```bash
# 1. 登录 Cloudflare
wrangler login

# 2. 首次部署(会自动创建项目)
wrangler pages deploy . --project-name=liming

# 3. 后续部署(直接推送更新)
wrangler pages deploy .
```

#### 设置环境变量:

```bash
# 为生产环境设置 JWT_SECRET
wrangler pages secret put JWT_SECRET --env production

# 提示输入时,输入你的密钥值并回车
# 密钥将被加密存储
```

## 🔑 生成 JWT_SECRET

使用以下命令生成一个安全的随机密钥:

```bash
# Node.js 方式
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 或使用在线工具
# 访问: https://generate-secret.vercel.app/32
```

示例输出:
```
a7f3c9e8b2d4f6a1c8e0b5d7f9a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8
```

## 🚀 访问你的网站

部署成功后,你会获得一个 URL:

```
https://liming.pages.dev
```

你也可以:
- 添加自定义域名
- 查看部署历史
- 回滚到之前的版本
- 查看访问日志

## 📝 部署后检查清单

- ✅ 网站可以正常访问
- ✅ 登录功能正常工作
- ✅ JWT_SECRET 环境变量已设置
- ✅ Functions 正常运行(`/login` API)
- ✅ 页面间导航正常

## 🔧 常见问题

### 问题 1: 登录失败,显示 500 错误

**原因**: JWT_SECRET 环境变量未设置

**解决方案**:
1. 进入 Pages 项目设置
2. 添加 `JWT_SECRET` 环境变量
3. 重新部署

### 问题 2: 页面显示 404

**原因**: 路径配置错误

**解决方案**:
- 确保 `_redirects` 文件存在
- 检查所有链接使用相对路径

### 问题 3: Functions 不工作

**原因**: `functions` 目录结构错误

**解决方案**:
- 确保 `functions/` 目录在项目根目录
- 检查文件命名: `login.js`, `_middleware.js`

### 问题 4: 部署时显示 "Missing entry-point"

**原因**: Cloudflare 找不到入口文件

**解决方案**:
- 确保项目根目录有 HTML 文件
- 确保 `_redirects` 文件存在
- 使用 Pages 部署命令: `wrangler pages deploy .`

## 📞 需要帮助?

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare 社区](https://community.cloudflare.com/)

## 🎉 成功部署!

部署成功后,你的应用就可以在全球范围内访问了,享受 Cloudflare 的:
- ⚡ 全球 CDN 加速
- 🔒 免费 SSL 证书
- 🛡️ DDoS 防护
- 📊 实时分析

