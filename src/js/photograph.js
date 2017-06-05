import EXIF from './../plugins/exif'
import opts from './opts'
import draw from './draw'
import filter from './filter'
//图片上传后，change事件
opts.oFile.addEventListener('change', uploadFile, false);
var oCan = opts.oCan,
	ctx = opts.ctx,
	isCreatePic = false,//是否生成了图片
	oSelect = document.getElementById('selectPicSize'),
	oAsideBtn = document.querySelector('.asideBtn'),
	oAside = document.querySelector('#aside'),
	imgData = {};

//生成图片
opts.oCreateBtn.addEventListener('touchstart', createImg, false);

//侧边栏显示
oAsideBtn.addEventListener('touchstart', function(e) {
	if (!isCreatePic) {
		alert('请先选择图片')
		return false;
	}
	opts.isDraw = false;
	oAside.style.display = 'block';
});
//侧边栏隐藏
document.querySelector('.aside_hideBtn').addEventListener('touchstart', function(e) {
	opts.isDraw = true;
	oAside.style.display = 'none';
	opts.transform(document.querySelector('.colorPickerbox') , 'translateX(-1000px)')
});

//选择图片的显示方式
oSelect.addEventListener('change', function(e) {
	var img = opts.data.img,
		output = selectPicSize(this.value);
	//获取修正后的宽高,xy
	var set_x = output.set_x ,
		set_y = output.set_y,
		set_w = output.set_w,
		set_h = output.set_h;
	//重绘
	ctx.clearRect(0, 0, opts.canvasW, opts.canvasH);
	ctx.drawImage(img, set_x,set_y,set_w,set_h);
	opts.data.colorData = ctx.getImageData(set_x,set_y,set_w,set_h)
	opts.data.imgPos = {
		x:set_x,
		y:set_y,
		w:set_w,
		h:set_h
	}
	img = null;
	filter.setFilter();
	draw.cleanDraw();
}, false);


//生成图片
function createImg(e) {
	e.preventDefault();
	if (!isCreatePic) {
		return false; }
	//删除上传图片按钮
	opts.oFile.parentNode.removeChild(opts.oFile)
	this.parentNode.removeChild(this)
	oCan.style.display = 'none';
	this.style.display = 'block';
	//生成图片
	opts.oShowImg.src = oCan.toDataURL('image/png');
	opts.oShowImg.style.display = 'block';
	opts.oShowImg.style.position = 'static';
	document.querySelector('.main_bottom').innerHTML = '生成成功！长按可保存图片';
}

//图片load回调方法
function cacheImg(url, callback) {
	if (!url) {
		callback.call()
		return false;
	}
	var img = new Image()
		//img.crossOrigin = "Anonymous";
	img.onload = function() {
		//图片加载完，执行回调
		callback.call(img)
	}
	img.src = url;
}

function getImgData(params) {
	cacheImg(params.img, function() {
		//以下改变一下图片大小
		//获取宽高中，最大的值
		var output = computeWidthAndHeight({
			drawWidth:params.data.PixelXDimension ? params.data.PixelXDimension : this.naturalWidth,
			drawHeight:params.data.PixelYDimension ? params.data.PixelYDimension : this.naturalHeight,
			params:params
		});
		//使用canvas旋转校正
		output.context.rotate(output.degree * Math.PI / 180);
		output.context.drawImage(this, 0, 0, output.drawWidth, output.drawHeight);
		//返回校正图片
		params.next && params.next(output.canvas.toDataURL('image/png'));
		output = null;
		params = null;
	})
}

function computeWidthAndHeight(data){
	var drawWidth = data.drawWidth,
		drawHeight = data.drawHeight,
		degree = 0,
		maxSide = Math.max(drawWidth, drawHeight),
		size = 2048,
		params = data.params,
		width,height;

	//修正比例，达到当前最大宽度
	if (maxSide > size) {
		var minSide = Math.min(drawWidth, drawHeight);
		minSide = minSide / maxSide * size;
		maxSide = size;
		if (drawWidth > drawHeight) {
			drawWidth = maxSide;
			drawHeight = minSide;
		} else {
			drawWidth = minSide;
			drawHeight = maxSide;
		}
	}
	//使用离屏canvas修正图片的方向
	var canvas = document.createElement('canvas');
	canvas.width = width = drawWidth;
	canvas.height = height = drawHeight;

	var context = canvas.getContext('2d');
	var orie = params.data.Orientation ? params.data.Orientation : false
	//判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
	switch (params.data.Orientation) {
		//iphone横屏拍摄，此时home键在左侧
		case 3:
			degree = 180;
			drawWidth = -width;
			drawHeight = -height;
			break;
			//iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
		case 6:
			canvas.width = height;
			canvas.height = width;
			degree = 90;
			drawWidth = width;
			drawHeight = -height;
			break;
			//iphone竖屏拍摄，此时home键在上方
		case 8:
			canvas.width = height;
			canvas.height = width;
			degree = 270;
			drawWidth = -width;
			drawHeight = height;
			break;
	}
	return {
		degree:degree,
		drawWidth:drawWidth,
		drawHeight:drawHeight,
		context:context,
		canvas:canvas
	}
}

//图片上传，input-change事件
function uploadFile() {
	var file = this.files[0];
	var exifData;
	//判断图片是否过大
	if (file.size / 1024 > 5000) {
		//大于2M
		alert('图片过大，请选择相对较小的图片')
		return false;
	}
	//图片处理中，提示层出现
	opts.msg('block')

	//EXIF js 可以读取图片的元信息 https://github.com/exif-js/exif-js
	EXIF.getData(file, function() {
		exifData = EXIF.getAllTags(this)
	});
	var reader = new FileReader();
	reader.onload = function(e) {
		//图片信息获取完毕
		//修正图片方向
		getImgData({
			img: this.result,
			data: exifData,
			next: function(img) {
				cacheImg(img, uploadFileCallBack)
			}
		});
	}
	reader.readAsDataURL(file);
}
//上传图片回调函数
function uploadFileCallBack(){
	//处理图片
	var w = this.width,
		h = this.height;
	//缓存图片初始宽高
	imgData.w = w;
	imgData.h = h;
	
	var cW = opts.canvasW,
		cH = opts.canvasH;
	if (cW / cH > w / h) {
		//宽大于高，高100%
		w = w * cH / h
		h = cH;
	} else {
		//高大于宽，宽100%
		h = h * cW / w
		w = cW;
	}
	ctx.clearRect(0, 0, cW, cH);
	ctx.drawImage(this, (cW - w) / 2, (cH - h) / 2, w, h);
	opts.data.colorData = ctx.getImageData((cW - w) / 2, (cH - h) / 2, w, h)
	opts.data.img = this;
	opts.data.imgPos = {
		x:(cW - w) / 2,
		y:(cH - h) / 2,
		w:w,
		h:h
	}
	opts.msg('none');
	//选择size，笔触颜色显示
	oAsideBtn.style.display = 'block'
	opts.oCreateBtn.style.display = 'block';
	document.getElementById('filterBtn').style.display = 'block';
	//撤销按钮小时
	opts.oRevoke.style.display = 'block';
	isCreatePic = true;
	//是否可以画笔触
	opts.isDraw = true;
	//是新的图片
	opts.isNewPic = true;
}

//改变图片展示方式
function selectPicSize(value){
	var set_x,set_y,set_w,set_h,
		cW = opts.canvasW,
		cH = opts.canvasH,
		w = imgData.w,
		h = imgData.h;
	function type(type) {
		if (type) {
			if (cW / cH > w / h) {
				//宽大于高，高100%
				w = w * cH / h
				h = cH;
			} else {
				h = h * cW / w
				w = cW;
			}
		} else {
			if (cW / cH <= w / h) {
				//宽大于高，高100%
				w = w * cH / h
				h = cH;
			} else {
				h = h * cW / w
				w = cW;
			}
		}
	}
	//改变图片展示方式
	switch (value) {
		case '1':
			//居中
			type(true);
			set_x = (cW - w) / 2
			set_y = (cH - h) / 2
			set_w = w
			set_h = h
			break;
		case '2':
			//填充
			type(false);
			set_x = (cW - w) / 2
			set_y = (cH - h) / 2
			set_w = w
			set_h = h
			break;
		case '3':
			//适应
			type(true);
			set_x = 0
			set_y = 0
			set_w = w
			set_h = h
			break;
		case '4':
			//拉伸
			set_x = 0
			set_y = 0
			set_w = cW
			set_h = cH
			break;
		default:
			//居中
			type(true);
			set_x = (cW - w) / 2
			set_y = (cH - h) / 2
			set_w = w
			set_h = h
			break;
	}
	return{
		set_x:set_x,
		set_y:set_y,
		set_w:set_w,
		set_h:set_h
	}
}
