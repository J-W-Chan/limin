// functions/login.js
import jwt from 'jsonwebtoken';

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
            // 安全考虑，不区分邮箱不存在和密码错误
            return new Response('Invalid username or password', { status: 401 });
        }

        // 2. 验证密码
        const isPasswordValid = password === user.Password;
        if (!isPasswordValid) {
            return new Response('Invalid username or password', { status: 401 });
        }

        // 3. 生成 JWT
        const token = jwt.sign(
            { userId: user.id, sub: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // 4. 返回 token
        return new Response(JSON.stringify({ token }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}