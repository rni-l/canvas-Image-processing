import opts from './opts'
import lineData from './color'

var arrX = [],
	arrY = [],
	arrN = [],
	arrColor = [],//线条颜色
	arrWidth = [],//线条粗细
	lastX = -1,
	lastY = -1,
	c_left = opts.oCan.offsetLeft,//canvas的Left,top
	c_top = opts.oCan.offsetTop,
	oCan = opts.oCan,
	j = 0,
	ctx = opts.ctx;

function move(e) {
		e.preventDefault()
		var t = e.touches[0];
		arrX.push(Math.floor(t.pageX - c_left));
		arrY.push(Math.floor(t.pageY - c_top));
		arrN.push(1);
		arrWidth.push(lineData.w);
		arrColor.push(lineData.color);
		var len = arrX.length
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
		}
		//绘制线条，释放桟，关闭路线
		ctx.stroke();
		ctx.restore();
		ctx.closePath();
		
}

function down(e) {
	if(!opts.isDraw){return false;}
	if(opts.isNewPic){
		opts.isNewPic = false;
		//重改
		arrX.length = 0;
		arrY.length = 0;
		arrN.length = 0;
		arrColor.length = 0;
		arrWidth.length = 0;
	}
	var t = e.touches[0]
	arrX.push(t.pageX - c_left);
	arrY.push(t.pageY - c_top);
	arrN.push(2);
	arrColor.push(lineData.color);
	arrWidth.push(lineData.w);
	oCan.addEventListener('touchmove', move, false);

}

function up(e) {
	if(!opts.isDraw){return false;}
	var t = e.changedTouches[0]
	arrX.push(t.pageX - c_left);
	arrY.push(t.pageY - c_top);
	arrN.push(1);
	arrColor.push(lineData.color);
	arrWidth.push(lineData.w);
	oCan.removeEventListener('touchmove', move, false);
}


oCan.addEventListener('touchstart', down, false);
oCan.addEventListener('touchend', up, false);


export default {

}
