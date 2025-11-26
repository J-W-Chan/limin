// functions/_middleware.js

export async function onRequest(context) {
    const { request, next } = context;
    
    // ===== 重要说明 =====
    // 在 Cloudflare Pages 中:
    // 1. 静态 HTML 文件由 CDN 直接提供,不经过这个中间件
    // 2. 这个中间件只处理 /functions 目录下的 API 端点
    // 3. HTML 页面的登录验证由前端 js/auth.js 完成
    // 4. 因此这里只需要放行所有请求即可
    
    // 直接放行所有请求
    // 前端 auth.js 会在客户端检查登录状态
    return next();
}
