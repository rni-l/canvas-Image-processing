import opts from './opts'
import lineData from './lineData'
import photograph from './photograph'
import filter from './filter'

//画布功能
var arrX = [],
	arrY = [],
	arrN = [], //笔触点击，移动，放开总次数
	arrColor = [], //线条颜色
	arrWidth = [], //线条粗细
	arrNumber = [], //笔触点击次数
	lastX = -1,
	lastY = -1,
	c_left = opts.oCan.offsetLeft, //canvas的Left,top
	c_top = opts.oCan.offsetTop,
	oCan = opts.oCan,
	j = 0,
	ctx = opts.ctx;

//移动
function move(e) {
	e.preventDefault();
	var t = e.touches[0];
	//将计算后的xy位置，添加到数组里
	arrX.push(Math.floor(t.pageX - c_left));
	arrY.push(Math.floor(t.pageY - c_top));
	arrN.push(1);
	arrWidth.push(lineData.w);
	arrColor.push(lineData.color);
	//绘制
	draw(arrX.length);
}
//点击
function down(e) {
	ctx.clearRect(0,0,opts.canvasW,opts.cavasH)
	if (!opts.isDraw) {
		return false; }
	//重新上传图片，笔触清零
	if (opts.isNewPic) {
		opts.isNewPic = false;
		//笔触记录清零
		arrX.length = 0;
		arrY.length = 0;
		arrN.length = 0;
		arrColor.length = 0;
		arrWidth.length = 0;
	}
	var t = e.touches[0]
	//添加到数组，存储
	addData({
		x:t.pageX - c_left,
		y:t.pageY - c_top,
		n:2,
		color:lineData.color,
		width:lineData.w
	})
	//记录操作
	arrNumber.push(arrN.length);
	oCan.addEventListener('touchmove', move, false);
}
//放开
function up(e) {
	if (!opts.isDraw) {
		return false; }
	var t = e.changedTouches[0]
	//添加到数组，存储
	addData({
		x:t.pageX - c_left,
		y:t.pageY - c_top,
		n:1,
		color:lineData.color,
		width:lineData.w
	});
	//取消事件
	oCan.removeEventListener('touchmove', move, false);
}
//绘制
function draw(len) {
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	for (var i = 1; i < len; i++) {
		//线条颜色，粗细
		ctx.lineWidth = arrWidth[i]
		ctx.strokeStyle = arrColor[i]
		lastX = arrX[i];
		lastY = arrY[i];
		if (arrN[i] === 2) {
			//开头，保存当前的桟
			ctx.beginPath();
			ctx.save();
			ctx.moveTo(lastX, lastY);
		} else {
			ctx.lineTo(lastX, lastY);
		}
		//绘制线条，释放桟，关闭路线
		ctx.stroke();
		ctx.restore();
	}
	
	ctx.closePath();
}
//撤销
function revoke() {
	//如果路线少于0，不会绘制
	if(!arrNumber[arrNumber.length - 1]){
		return false;
	}
	//长度减一
	var len = arrNumber[arrNumber.length - 1];
	arrNumber.pop();
	arrX.length = len;
	arrY.length = len;
	arrN.length = len;
	arrColor.length = len;
	arrWidth.length = len;
	ctx.clearRect(0,0,opts.canvasW,opts.canvasH)
	var data = opts.data
	//重绘
	ctx.drawImage(data.img , data.imgPos.x , data.imgPos.y , data.imgPos.w , data.imgPos.h);
	filter.setFilter();
	draw(len);
}
//重新绘制笔触
function cleanDraw(){
	var len = arrN.length;
	draw(len)
}

function addData(data){
	arrX.push(data.x);
	arrY.push(data.y);
	arrN.push(data.n);
	arrColor.push(data.color);
	arrWidth.push(data.width);
}

//添加撤销事件撤销事件
opts.oRevoke.addEventListener('touchstart',function(e){
	revoke();
})

oCan.addEventListener('touchstart', down, false);
oCan.addEventListener('touchend', up, false);

export default {
	cleanDraw:cleanDraw
}
