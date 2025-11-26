// public/login.js

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // 阻止表单默认提交行为

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessageEl = document.getElementById('errorMessage');

    errorMessageEl.textContent = ''; // 清空之前的错误信息

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // 显示后端返回的中文错误消息
            throw new Error(data.message || data.error || '登录失败');
        }

        // 登录成功，存储 JWT
        localStorage.setItem('userToken', data.token);
        
        // 显示成功消息(可选)
        if (data.message) {
            console.log(data.message);
        }
        
        // 跳转到受保护的页面
        window.location.href = 'indexNew.html';

    } catch (error) {
        errorMessageEl.textContent = error.message;
        console.error('Login error:', error);
    }
});