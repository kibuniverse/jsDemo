
var nameTag = document.querySelectorAll(".nameTag");
var ischoiceArr = new Array(500);
var pName = document.getElementsByClassName('divid');
var divName = document.getElementsByClassName('divName');
//控制标签自动变化的定时机器
var time = null;

// 初始化数组

initischoiceArr(ischoiceArr);
function initischoiceArr(arr){
	for(var i = 0; i < arr.length; i++){
		arr[i] = 0;
	}
}

var rotatetime = 2;

changeTagPosition();
initBtnPosition();

// 盒子的对象
function Box() {
	this.boxdoc;
	this.begin;
	this.pic;
	this.isOpen = false;
	this.position = false;
	this.isrotate = false;
	this.haveTag = false;
}

// 初始化盒子的位置
Box.prototype.initBoxPosition = function(Box) {
	Box.style.top = Height - parseInt(Box.style.height) - 50 + 'px';
	Box.style.left = Width / 2  - 50 + 'px';
	setTimeout(()=>{
		box.position = true;
	}, 4000);
}

// 摆放标签的位置
function changeTagPosition(){
	for(let i = 0; i < nameTag.length; i ++){
		//得到一个随机位置
		// var randnum = Math.ceil(Math.random()*(positionArr.length - 1));
		// //如果没有被选择
		// while(positionArr[randnum].ischoice == true){
		// 	randnum = Math.ceil(Math.random()*(positionArr.length - 1));
		// }
		// positionArr[randnum].ischoice = true;
		nameTag[i].style.top = positionArr[i].top + 'px';
		nameTag[i].style.left = positionArr[i].left + 'px';
	}
}

//开始抽奖 总入口
Box.prototype.beginChange = function() {
	//打开盒子
	if(!box.isOpen){
		openBox();
		box.isrotate = true;

	}
	// 打开盒子的时间
	setTimeout(()=>{
		var time = setInterval(function() {
			for (var i = nameTag.length - 1; i >= 0; i--) {
				nameTag[i].style.opacity -= 0.1;
			}
		}, 3)
		for(let i = 0; i < nameTag.length; i ++){
			nameTag[i].style.top = Height - 200 + 'px';
			nameTag[i].style.left = Width / 2  - 50 + 'px';
		}
		// 标签进入和子
		setTimeout(()=>{
			clearInterval(time);
			closeBox();
			setTimeout(()=>{
				box.Rotate(document.getElementById('box'));
				setTimeout(()=>{
					console.log('ok');
					box.topOpen(document.getElementById('top'));
				}, 4500);
			}, 700);
		}, 1500);
	}, 300);
}

//盒子开始旋转 
Box.prototype.Rotate = function(Box) {
	Box.style.transform = 'rotateX(-20deg) rotateY('+((rotatetime * 1080) + 20) +'deg)';
	rotatetime += 2;
	setTimeout(function(){
		box.isrotate = false;
	}, 4000)
}

// 盒子顶打开选一个弹出
Box.prototype.topOpen = function(top) {
	top.style.top = -251 + 'px';
	top.style.webkitTransform = 'rotateY(-180deg) translate3d(0, 0, 125px)';
	var choicenum = Math.ceil(Math.random()*(positionArr.length - 1));
	// 等于1 说明已经被选过了
	while(ischoiceArr[choicenum]){
		choicenum = Math.ceil(Math.random()*(positionArr.length - 1));
	}
	ischoiceArr[choicenum] = 1;
	console.log(nameTag[choicenum]);
	nameTag[choicenum].classList.remove('nameTag');
	console.log(nameTag[choicenum].classList.length);
	divName[choicenum].classList.remove('divName');
	pName[choicenum].classList.remove('divid');
	nameTag[choicenum].classList.add('namechoice');
	divName[choicenum].classList.add('choicedivName');
	pName[choicenum].classList.add('choicedivid');
	nameTag[choicenum].style.top = 100 + 'px';
	nameTag[choicenum].style.left = Width / 2 - 100 + 'px';
	nameTag[choicenum].style.opacity  = 1;
	setTimeout(()=>{
		closeBox(document.getElementById('box'));
	}, 1000);
}
var box = new Box();
box.initBoxPosition(document.getElementById('box'));



//盒子翻开
function openBox() {
	if(box.isOpen == false){
		box.isOpen = true;
		document.getElementById('leftside').style.left = -250 + 'px';
		document.getElementById('top').style.top = -250 + 'px';
		document.getElementById('rightside').style.left = 250 + 'px';
		document.getElementById('back').style.webkitTransform = "rotateX(-90deg) translate3d(0, 0, 125px)";
		document.getElementById('leftside').style.webkitTransform = "rotateX(0deg) translate3d(0, 0, 125px)";
		document.getElementById('top').style.webkitTransform = "rotate(0deg) translate3d(0, 0, 125px)";
		document.getElementById('rightside').style.webkitTransform = "rotate(0deg) translate3d(0, 0, 125px)";    		
	}
}

//盒子关闭
function closeBox(Box) {
	document.getElementById('leftside').style.left = 0 + 'px';
	document.getElementById('top').style.top = 0 + 'px';
	document.getElementById('rightside').style.left = 0 + 'px';
	document.getElementById('back').style.webkitTransform = "rotateY(180deg) translate3d(0, 0, 125px)";
	document.getElementById('leftside').style.webkitTransform = "rotateY(-90deg) translate3d(0, 0, 125px)";
	document.getElementById('top').style.webkitTransform = "rotateX(90deg) translate3d(0, 0, 125px)";
	document.getElementById('rightside').style.webkitTransform = "rotateY(90deg) translate3d(0, 0, 125px)";
	box.isOpen = false;
}

//初始化按钮位置
function initBtnPosition() {
	document.getElementById('btnbegin').style.top = Height + 'px';
	document.getElementById('btnbegin').style.left = Width / 2 - 70 + 'px';
	document.getElementById('btndisorganize').style.top = Height+ 'px';
	document.getElementById('btndisorganize').style.left = Width / 2 + 100 + 'px';
}

// 给按钮上绑定事件
document.getElementById('btnbegin').addEventListener('click', function(){
	//盒子位置确定, 未旋转, 数据已经得到
	if(box.position && !box.isrotate && !box.haveTag) {
		clearInterval(time);
		box.haveTag = true;
		box.beginChange();
	}
}, false);
document.getElementById('btndisorganize').addEventListener('click', function(){
	if(!box.isrotate && box.haveTag){
		box.haveTag = false;
		for (var i = nameTag.length - 1; i >= 0; i--) {
			nameTag[i].style.opacity = 1;
		}
		openBox();
		changeTagPosition();
		nameTagDynamic();
		setTimeout(()=>{
			closeBox(document.getElementById('box'));
		}, 500)
	}
}, false);

nameTagDynamic();

//标签上绑定事件
function nameTagDynamic() {
	for(var i = 0; i < nameTag.length; i++) {
		nameTag[i].style.opacity = 0;
	}
	time = setInterval(function(){
		var arrName = [];
		var arrPosition = [];
		//随机生成标签和名字
		for(var i = 0; i < 15; i++){
			var arrNameNum = Math.floor(Math.random()*(nameTag.length - 1));
			var arrPositionNum = Math.floor(Math.random()*(dataArr.length - 1));
			arrName.push(arrNameNum);
			arrPosition.push(arrPositionNum);
			pName[arrNameNum].innerHTML = dataArr[arrPositionNum].name;
			divName[arrNameNum].innerHTML = dataArr[arrPositionNum].id;
		}


		for(var i = 0; i < 15; i++){
			nameTag[arrName[i]].style.opacity = 0.8 + Math.random()*0.2;
			nameTag[arrName[i]].style.transform = 'scale('+(0.8 + Math.random()*0.4)+')';
		}
		setTimeout(function(){
			for(var i = 0; i < 15; i++){
				nameTag[arrName[i]].style.opacity = 0;
				
			}
		}, 3000);
	}, 4000);
}

