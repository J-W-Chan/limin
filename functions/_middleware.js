// functions/_middleware.js

import jwt from 'jsonwebtoken';

const JWT_SECRET = env.JWT_SECRET;

export async function onRequest(context) {
    const { request, next } = context;

    // 跳过登录接口本身的验证
    if (new URL(request.url).pathname === '/login') {
        return next();
    }

    if (!JWT_SECRET) {
        return new Response('JWT_SECRET is not set', { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Unauthorized: No token provided', { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // 将解码后的用户信息附加到 context 中，供后续函数使用
        context.user = decoded;
        return next();
    } catch (error) {
        return new Response('Unauthorized: Invalid token', { status: 401 });
    }
}