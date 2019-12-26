var user = document.getElementById('user');
var pass = document.getElementById('pass');
var reg_btn = document.getElementById('register');
var login_btn = document.getElementById('login');
var tip = document.getElementById('tip'); 

user.oninput = function() {
	if(!formatCheck(regname, user.value)) {
		// 格式错误
		user.style.borderBottom = '2px solid red';
	} else {
		user.style.borderBottom = '2px solid green';
	}
}

pass.oninput = function() {
	if(!formatCheck(regpass, pass.value)) {
		// 格式错误
		pass.style.borderBottom = '2px solid red';
	} else {
		pass.style.borderBottom = '2px solid green';
	}
}

//创建 XMLHttpRequest对象
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status <= 300) || xhr.status == 304) {
            var json = JSON.parse(xhr.responseText);
            // 判断
            if (json.way == 'register') {
                if (json.ok) {
                    alert('登出成功');
                    location.reload();
                } else {
                    alert('注册失败: ' + json.msg);
                }
            } else if(json.way == 'login'){ // µÇÂ½
                if (json.ok) {
                    window.location.href = 'skip_page.html';
                } else {
                    alert('登陆失败: ' + json.msg);
                }
            } else if(json.way == 'auto_login') {
                if(json.ok) {
                    window.location.href = 'skip_page.html';
                } else {
                    user.style.borderBottom = '2px solid #CBC5BF';
                }
            }
        }
    }
}

// 正则
var regname = /[a-zA-Z0-9]{10}/;
var regpass = /[a-zA-Z0-9]{6,16}/;

// 发送ajax请求
function sendAjax(type) {
    if (formatCheck(regname, user.value) && formatCheck(regpass, pass.value) || type == 'auto_login') {
        var url = 'http://localhost:1912/' + type + '?user=' + user.value + '&pass=' + pass.value;
        xhr.open('get', url, false);
        xhr.send(null);
    } else {
        if (!formatCheck(regname, user.value)) {
            user.style.borderBottom = '2px solid red';
            tip.style.opacity = 1;
        } else {
            pass.style.borderBottom = '2px solid red';
            tip.style.opacity = 1;
        }
    }
}

// 按钮添加事件
reg_btn.addEventListener('click', function() {
    sendAjax('register');
}, false);

login_btn.addEventListener('click', function() {
    sendAjax('login');
}, false);

function formatCheck(reg, str) {
    if (reg.test(str)) return true;
    return false;
}

user.addEventListener('click', () => {
	tip.style.opacity = 0;
}, false);

pass.addEventListener('click', () => {
	tip.style.opacity = 0;
}, false);

document.onkeydown = function(e) {
    if(e.which == 13){
        sendAjax('login');
    }
}
window.onload = function () {
    sendAjax('auto_login');
}
