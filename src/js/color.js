
var output = {color:'#000000',w:5}

document.addEventListener('DOMContentLoaded', function(e) {
	var oCan = document.getElementById('color'),
		oColorWrap = document.querySelector('.colorWrap'),
		ctx = oCan.getContext('2d'),
		oColor = document.querySelector('.color_show'),
		oZhezhao = document.querySelector('.color_zhezhao'),
		imgSrc = require('../images/wheel.png'),
		top = oCan.offsetTop,
		left = oCan.offsetLeft


	var img = new Image();
	img.onload = function() {
		ctx.drawImage(this, 0, 0, 200, 200)
	}
	img.src = /*'http://omj3gjq3r.bkt.clouddn.com/wheel.png'*/imgSrc;
	//width:20
	function pick(e) {
		var t = e.touches[0],
			x = t.pageX - left,
			y = t.pageY - top
		var d = Math.sqrt(Math.pow((x - 100), 2) + Math.pow((y - 100), 2))
		console.log(d)
		if (!(d >= 80 & d <= 100)) {
			return false;
		}

		var pixel = ctx.getImageData(x, y, 1, 1),
			data = pixel.data,
			rgba = 'rgb(' + data[0] + ',' + data[1] +
			',' + data[2] + ')';
		//console.log(x+' '+y)
		oColor.style.background = rgba;
		oColorWrap.style.background = rgba;
		output.color = rgba;
	}
	oCan.addEventListener('touchmove', pick);

	function type(type) {
		oCan.style.display = type
		oColor.style.display = type
		oZhezhao.style.display = type
	}

	oColorWrap.addEventListener('touchstart', function(e) {
		type('block');
		top = oCan.offsetTop
		left = oCan.offsetLeft
	}, false)
	oZhezhao.addEventListener('touchstart',function(e){
		e.stopPropagation();
		type('none');
	},false)

	var oP = document.querySelector('.rangeWrap p')

	//滑动条
	/*document.querySelector('#lineWidth').addEventListener('input',function(e){
		output.w = this.value;
		oP.innerHTML = '宽度：'+this.value;
	},false);*/
	//模拟range
	var oRange = document.querySelector('.rangeBtn'),
		oRangePar = document.querySelector('.rangeLine'),
		r_opts = {
			h:oRangePar.offsetHeight,
			t:oRangePar.offsetTop,
			rH : oRange.offsetHeight,
			max : 10,
			min : 1,
			size : 1,
			num : 0
		}
	//修正高度
	r_opts.h = r_opts.h - r_opts.rH
	//份数
	r_opts.num = r_opts.h/r_opts.max
	oRange.addEventListener('touchstart',function(e){
		e.stopPropagation();
		var t = e.touches[0]
		r_opts.fx = t.clientX
		r_opts.fy = t.clientY
		this.addEventListener('touchmove', rangeMove, false);
	},false);

	function rangeMove(e){
		var t = e.touches[0],
			my = t.clientY - r_opts.t
		if(my <= 0){
			my = 0;
		}else if(my >= r_opts.h){
			my = r_opts.h;
		}
		oRange.style.WebkitTransform = 'translateY(' + my + 'px)'
		oRange.style.transform = 'translateY(' + my + 'px)'
		r_opts.my = my;
		//判断当前位置，属于几
		var value = Math.floor(my/r_opts.num);
		output.w = value;
		oP.innerHTML = '宽度：'+ value;
	}

	oRange.addEventListener('touchend',function(e){
		this.removeEventListener('touchmove', rangeMove, false);
	},false)

}, false)

export default output


