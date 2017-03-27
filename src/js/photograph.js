import EXIF from './exif'
import opts from './opts'
import fastclick from './fastclick'
import draw from './draw'
//图片上传后，change事件
opts.oFile.addEventListener('change', change, false);
var oCan = opts.oCan,
	ctx = opts.ctx,
	isCreatePic = false,
	isChoose = false,
	oSelect = document.getElementById('selectPicSize'),
	oAsideBtn = document.querySelector('.asideBtn'),
	oAside = document.querySelector('#aside')
	//生成图片按钮
opts.oCreateBtn.addEventListener('touchstart', createImg, false)

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
	alert('图片生成完毕,长按图片可以保存');
	opts.oShowImg.style.display = 'block';
	opts.oShowImg.style.position = 'static';
}

var imgData = {
	//输出的图片数据
	output:{

	}
}

//图片load回调方法
function cacheImg(url, callback) {
	if (!url) {
		callback.call()
		alert('false')
		return false;
	}
	var img = new Image()
		//img.crossOrigin = "Anonymous";
	img.onload = function() {
		//alert('load')
		//图片加载完，执行回调
		callback.call(img)
	}
	img.src = url;
}

function getImgData(params) {
	cacheImg(params.img, function() {
		var degree = 0,
			drawWidth, drawHeight, width, height
			//原始宽高
		drawWidth = width = params.data.PixelXDimension ? params.data.PixelXDimension : this.naturalWidth;
		drawHeight = height = params.data.PixelYDimension ? params.data.PixelYDimension : this.naturalHeight;

		//以下改变一下图片大小
		//获取宽高中，最大的值
		var maxSide = Math.max(drawWidth, drawHeight),
			size = 2048

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
		//使用canvas修正图片的方向
		var canvas = document.createElement('canvas');
		canvas.width = width = drawWidth;
		canvas.height = height = drawHeight;
		console.log('canvas width:' + canvas.width + 'canvas height:' + canvas.height)
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
		//使用canvas旋转校正
		context.rotate(degree * Math.PI / 180);
		context.drawImage(this, 0, 0, drawWidth, drawHeight);
		//返回校正图片
		params.next && params.next(canvas.toDataURL('image/png'));
	})
}

function change() {
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
				cacheImg(img, function() {
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
						h = h * cW / w
						w = cW;
					}
					ctx.clearRect(0, 0, cW, cH);
					ctx.drawImage(this, (cW - w) / 2, (cH - h) / 2, w, h);
					imgData.img = this;
					imgData.output = {
						x:(cW - w) / 2,
						y:(cH - h) / 2,
						w:w,
						h:h
					}
					opts.msg('none');
					//选择size，笔触颜色显示
					opts.oCreateBtn.style.display = 'block';
					isCreatePic = true;
					opts.isDraw = true;
					opts.isNewPic = true;
				})
			}
		});
	}
	reader.readAsDataURL(file);
}

oSelect.addEventListener('change', function(e) {
	var cW = opts.canvasW,
		cH = opts.canvasH,
		w = imgData.w,
		h = imgData.h,
		img = imgData.img,
		set_x,set_y,set_w,set_h

	ctx.clearRect(0, 0, opts.canvasW, opts.canvasH);
	//改变图片展示方式
	switch (this.value) {
		case '1':
			type(true);
			set_x = (cW - w) / 2
			set_y = (cH - h) / 2
			set_w = w
			set_h = h
			break;
		case '2':
			type(false);
			set_x = (cW - w) / 2
			set_y = (cH - h) / 2
			set_w = w
			set_h = h
			break;
		case '3':
			type(true);
			set_x = 0
			set_y = 0
			set_w = w
			set_h = h
			break;
		case '4':
			set_x = 0
			set_y = 0
			set_w = cW
			set_h = cH
			break;
		default:
			type(true);
			set_x = (cW - w) / 2
			set_y = (cH - h) / 2
			set_w = w
			set_h = h
			break;
	}
	ctx.drawImage(img, set_x,set_y,set_w,set_h);
	imgData.output = {
		x:set_x,
		y:set_y,
		w:set_w,
		h:set_h
	}
	img = null;
	draw.cleanDraw();
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
}, false);

oAsideBtn.addEventListener('touchstart', function(e) {
	if (!isCreatePic) {
		alert('请先选择图片')
		return false;
	}
	opts.isDraw = false;
	oAside.className = 'aside_show'
})
document.querySelector('.aside_hideBtn').addEventListener('touchstart', function(e) {
	opts.isDraw = true;
	oAside.className = 'aside_hide'
})

function getData(){
	return imgData
}

export default {
	data:getData
}
