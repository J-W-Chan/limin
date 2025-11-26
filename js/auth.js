// 用户认证和登录管理公共模块

$(function () {
	// Base64URL 解码辅助函数 (支持中文)
	function base64UrlDecode(str) {
		// 1. Base64URL → Base64
		str = str.replace(/-/g, '+').replace(/_/g, '/');
		while (str.length % 4) {
			str += '=';
		}
		
		// 2. Base64 解码
		var binary = atob(str);
		
		// 3. UTF-8 解码 (支持中文)
		var bytes = '';
		for (var i = 0; i < binary.length; i++) {
			bytes += '%' + ('00' + binary.charCodeAt(i).toString(16)).slice(-2);
		}
		return decodeURIComponent(bytes);
	}

	// 检查是否登录
	var userToken = localStorage.getItem('userToken');
	
	if (!userToken) {
		window.location.href = 'login.html';
		return;
	}

	// 从 userToken 中提取并显示用户名
	try {
		// 解析 JWT token (假设 token 是 JWT 格式)
		var tokenParts = userToken.split('.');
		
		if (tokenParts.length === 3) {
			// 使用 Base64URL 解码
			var payloadStr = base64UrlDecode(tokenParts[1]);
			var payload = JSON.parse(payloadStr);
			
			console.log('Token payload:', payload);
			
			// 检查 token 是否过期
			if (payload.exp && payload.exp < Date.now() / 1000) {
				console.warn('Token 已过期');
				localStorage.removeItem('userToken');
				window.location.href = 'login.html';
				return;
			}
			
			// 显示用户名
			var username = payload.username || payload.UserName || '用户';
			if (username && username !== '用户') {
				$('#userNameDisplay').text('欢迎您，' + username);
			} else {
				$('#userNameDisplay').text('欢迎您');
			}
		} else {
			// 不是标准 JWT 格式
			console.warn('Token 不是标准 JWT 格式');
			var userData = JSON.parse(userToken);
			var username = userData.username || userData.UserName || '用户';
			if (username) {
				$('#userNameDisplay').text('欢迎您，' + username);
			}
		}
	} catch (e) {
		// 如果解析失败,清除无效 token 并跳转登录
		console.error('Token 解析失败:', e);
		localStorage.removeItem('userToken');
		window.location.href = 'login.html';
	}

	// 退出登录按钮事件
	var logoutBtn = document.getElementById('logoutBtn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', function() {
			localStorage.removeItem('userToken');
			window.location.href = 'login.html';
		});
	}

	// 倒计时js开始
	var mydate = new Date();
	$(".month").html(mydate.getMonth() + 1);
	$(".day").html(mydate.getDate());
});

