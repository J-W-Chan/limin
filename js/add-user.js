// js/add-user.js

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    var binary = atob(str);
    var bytes = '';
    for (var i = 0; i < binary.length; i++) {
        bytes += '%' + ('00' + binary.charCodeAt(i).toString(16)).slice(-2);
    }
    return decodeURIComponent(bytes);
}

function getTokenPayload(token) {
    var tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
        return null;
    }
    return JSON.parse(base64UrlDecode(tokenParts[1]));
}

function isAdminGatePassed() {
    var userToken = localStorage.getItem('userToken');
    if (!userToken) {
        window.location.href = 'login.html';
        return false;
    }

    try {
        var payload = getTokenPayload(userToken);
        if (!payload) {
            localStorage.removeItem('userToken');
            window.location.href = 'login.html';
            return false;
        }

        if (payload.exp && payload.exp < Date.now() / 1000) {
            localStorage.removeItem('userToken');
            window.location.href = 'login.html';
            return false;
        }

        var username = payload.username || payload.UserName || '';
        if (username !== 'admin') {
            window.location.href = 'indexNew.html';
            return false;
        }

        return true;
    } catch (e) {
        console.error('Token 解析失败:', e);
        localStorage.removeItem('userToken');
        window.location.href = 'login.html';
        return false;
    }
}

async function loadMaxUserId(prefillNext) {
    const hintEl = document.getElementById('maxIdHint');
    const userIdEl = document.getElementById('userId');

    try {
        const response = await fetch('/add-user');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || '获取最大 Id 失败');
        }

        const maxId = data.maxId != null ? data.maxId : 0;
        const nextId = Number(maxId) + 1;
        hintEl.textContent = '当前最大 Id：' + maxId + '（自行 +1 可填 ' + nextId + '）';

        if (prefillNext) {
            userIdEl.value = String(nextId);
        }
    } catch (error) {
        hintEl.textContent = '当前最大 Id：获取失败';
        console.error('Get max user id error:', error);
    }
}

if (isAdminGatePassed()) {
    loadMaxUserId(true);

    document.getElementById('addUserForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const idRaw = document.getElementById('userId').value.trim();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMessageEl = document.getElementById('errorMessage');
        const successMessageEl = document.getElementById('successMessage');

        errorMessageEl.textContent = '';
        successMessageEl.textContent = '';

        if (!idRaw || !username || !password) {
            errorMessageEl.textContent = '请填写 Id、用户名和密码';
            return;
        }

        const id = Number(idRaw);
        const payloadId = Number.isNaN(id) ? idRaw : id;

        try {
            const response = await fetch('/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: payloadId, username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || '添加用户失败');
            }

            successMessageEl.textContent = data.message || '用户创建成功';
            document.getElementById('addUserForm').reset();
            await loadMaxUserId(true);
        } catch (error) {
            errorMessageEl.textContent = error.message;
            console.error('Add user error:', error);
        }
    });
}
