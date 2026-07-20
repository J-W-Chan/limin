// functions/add-user.js

export async function onRequestGet(context) {
    const { env } = context;

    try {
        const row = await env.dbLiming.prepare(
            'SELECT MAX(id) AS maxId FROM LM_User'
        ).first();

        const maxId = row && row.maxId != null ? row.maxId : 0;

        return new Response(JSON.stringify({
            success: true,
            maxId
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Get max user id error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            message: '服务器内部错误: ' + error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const data = await request.json();
        const { id, username, password } = data;

        if (id === undefined || id === null || id === '' || !username || !password) {
            return new Response(JSON.stringify({
                error: 'Missing fields',
                message: '请填写 Id、用户名和密码'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const existingById = await env.dbLiming.prepare(
            'SELECT id FROM LM_User WHERE id = ?'
        ).bind(id).first();

        if (existingById) {
            return new Response(JSON.stringify({
                error: 'Duplicate id',
                message: 'Id 已存在'
            }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const existingByName = await env.dbLiming.prepare(
            'SELECT UserName FROM LM_User WHERE UserName = ?'
        ).bind(username).first();

        if (existingByName) {
            return new Response(JSON.stringify({
                error: 'Duplicate username',
                message: '用户名已存在'
            }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await env.dbLiming.prepare(
            'INSERT INTO LM_User (id, UserName, Password) VALUES (?, ?, ?)'
        ).bind(id, username, password).run();

        return new Response(JSON.stringify({
            success: true,
            message: '用户创建成功'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Add user error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            message: '服务器内部错误: ' + error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
