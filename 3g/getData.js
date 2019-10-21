// 得到屏幕的宽高
var Height = document.documentElement.clientHeight - 60;
var Width = document.documentElement.clientWidth - 200;

var positionArr = [{
		top : Height- 500,
		left : Width - 300,
		ischoice: false
	},
	{
		top: Height - 70,
		left : Width - 100,
		ischoice: false
	},
	{
		top: Height - 180,
		left: Width - 180,
		ischoice: false
	},
	{
		top: Height - 180,
		left : Width - 490,
		ischoice: false
	},
	{
		top: Height - 300,
		left : Width - 400,
		ischoice: false
	},
	{
		top : 200,
		left : 100,
		ischoice: false
	},
	{
		top: 400,
		left : 200,
		ischoice: false
	},
	{
		top: 300,
		left: 550,
		ischoice: false
	},
	{
		top: 550,
		left: 300,
		ischoice: false
	},
	{
		top: Height - 300,
		left: 400,
		ischoice: false
	},
	{
		top: Height - 100,
		left: 500,
		ischoice: false
	},
	{
		top: Height - 150,
		left: 100,
		ischoice: false
	},
	{
		top: 200,
		left: Width - 300,
		ischoice: false
	},
	{
		top: 100,
		left: Width / 2,
		ischoice: false
	},
	{
		top: 200,
		left: 600,
		ischoice: false
	},
	{
		top: 400,
		left: Width / 3 * 2,
		ischoice: false
	},
	{
		top: Height - 300,
		left: 30,
		ischoice: false
	},
	{
		top: 300,
		left: Width - 60,
		ischoice: false
	},
	{
		top: 20,
		left: Width - 30,
		ischoice: false
	},
	{
		top: 100,
		left: Width - 400,
		ischoice: false
	},
	{
		top: 50,
		left: 100,
		ischoice: false
	},
	{
		top: 80,
		left: 200,
		ischoice: false
	},
	{
		top: 150,
		left: 300,
		ischoice: false
	},
	{
		top: Height - 30,
		left: 50,
		ischoice: false
	},
	{
		top: Height / 2,
		left: Width - 40,
		ischoice: false
	},
	{
		top: Height -20,
		left: Width - 200,
		ischoice: false
	},
	{
		top: 150,
		left: Width - 50,
		ischoice: false
	},
	{
		top: 300,
		left: Width - 200,
		ischoice: false
	},
	{
		top: Height / 2,
		left: 20,
		ischoice: false
	},
	{
		top: 400,
		left: 300,
		ischoice: false
	},
	{
		top: 300,
		left: Width / 2 + 100,
		ischoice: false
	}
]

var dataArr = [];
// 生成对象
var dataObject = new XMLHttpRequest();
dataObject.onreadystatechange = function () {
	if(dataObject.readyState == 4){
		if((dataObject.status >= 200 && dataObject.status < 300) || dataObject.status == 304){
			addName();  // 回调函数
		} 	
	}
}

url = 'https://www.konghouy.cn/job/all';

dataObject.open('get', url, false);	


dataObject.send(null);

// 动态生成标签
function addName() {
	//得到所有人信息数组
	console.log('dataArr')
	dataArr = JSON.parse(dataObject.responseText).main;
	var	body = document.getElementsByTagName('body')[0];
	//前提 数据多于50个
	for(var i = 0; i < positionArr.length; i++){
		var namebox = document.createElement('div');
		namebox.classList.add('nameTag');
		var p = document.createElement('p');
		var div = document.createElement('div');
		p.classList.add('divid')
		div.classList.add('divName');
		namebox.appendChild(p);
		namebox.appendChild(div);
		body.appendChild(namebox);
	}	
}


