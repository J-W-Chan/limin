// 用户认证和登录管理公共模块

$(function () {
	//检查是否登录（可选，默认注释）
	if (!localStorage.getItem('userToken')) {
		window.location.href = 'login.html';
	}

	// 从 userToken 中提取并显示用户名
	var userToken = localStorage.getItem('userToken');
	if (userToken) {
		try {
			// 解析 JWT token (假设 token 是 JWT 格式)
			var tokenParts = userToken.split('.');
			if (tokenParts.length === 3) {
				var payload = JSON.parse(atob(tokenParts[1]));
				var username = payload.username;
				$('#userNameDisplay').text('欢迎您，' + username);
			} else {
				// 如果不是 JWT 格式，尝试直接解析为 JSON
				var userData = JSON.parse(userToken);
				var username = userData.username;
				$('#userNameDisplay').text('欢迎您，' + username);
			}
		} catch (e) {
			// 如果解析失败，显示默认文本
			$('#userNameDisplay').text('欢迎您');
		}
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

