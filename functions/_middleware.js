// functions/_middleware.js

export async function onRequest(context) {
    const { request, next, env } = context;

    // 跳过登录接口本身的验证
    if (new URL(request.url).pathname === '/login.html') {
        return next();
    }

    const JWT_SECRET = env.JWT_SECRET;
    if (!JWT_SECRET) {
        return new Response('JWT_SECRET is not set', { status: 500 });
    }

    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Unauthorized: No token provided', { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = await verifyJWT(token, JWT_SECRET);
        // 将解码后的用户信息附加到 context 中，供后续函数使用
        context.user = decoded;
        return next();
    } catch (error) {
        return new Response('Unauthorized: Invalid token - ' + error.message, { status: 401 });
    }
}

// 验证 JWT Token (使用 Web Crypto API)
async function verifyJWT(token, secret) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid token format');
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    // 验证签名
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await signHMAC(signatureInput, secret);

    if (signature !== expectedSignature) {
        throw new Error('Invalid signature');
    }

    // 解码 payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // 检查过期时间
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
        throw new Error('Token expired');
    }

    return payload;
}

// HMAC-SHA256 签名
async function signHMAC(data, secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(data)
    );

    return base64UrlEncode(signature);
}

// Base64URL 编码
function base64UrlEncode(input) {
    let str;
    if (typeof input === 'string') {
        str = btoa(unescape(encodeURIComponent(input)));
    } else {
        // ArrayBuffer
        str = btoa(String.fromCharCode(...new Uint8Array(input)));
    }
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Base64URL 解码
function base64UrlDecode(input) {
    // 替换 URL safe 字符
    input = input.replace(/-/g, '+').replace(/_/g, '/');
    
    // 添加填充
    while (input.length % 4) {
        input += '=';
    }
    
    return decodeURIComponent(escape(atob(input)));
}
