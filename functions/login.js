// functions/login.js

export async function onRequestPost(context) {
    const { request, env } = context;

    // 从环境变量获取 JWT 密钥
    const JWT_SECRET = env.JWT_SECRET;
    if (!JWT_SECRET) {
        return new Response('JWT_SECRET is not set', { status: 500 });
    }

    try {
        const data = await request.json();
        const { username, password } = data;

        if (!username || !password) {
            return new Response('username and password are required', { status: 400 });
        }

        // 1. 从 D1 数据库查询用户
        const user = await env.dbLiming.prepare(
            'SELECT * FROM LM_User WHERE UserName = ?'
        ).bind(username).first();

        if (!user) {
            return new Response('Invalid username or password', { status: 401 });
        }

        // 2. 验证密码
        const isPasswordValid = password === user.Password;
        if (!isPasswordValid) {
            return new Response('Invalid username or password', { status: 401 });
        }

        // 3. 生成 JWT (使用 Web Crypto API)
        const token = await generateJWT(
            { userId: user.id, username: user.UserName },
            JWT_SECRET
        );

        // 4. 返回 token
        return new Response(JSON.stringify({ token }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return new Response('Internal Server Error: ' + error.message, { status: 500 });
    }
}

// 生成 JWT Token (使用 Web Crypto API)
async function generateJWT(payload, secret) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    // 添加标准声明
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
        ...payload,
        iat: now,
        exp: now + (24 * 60 * 60) // 24小时后过期
    };

    // Base64URL 编码
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload));

    // 生成签名
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signature = await signHMAC(signatureInput, secret);

    return `${signatureInput}.${signature}`;
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
