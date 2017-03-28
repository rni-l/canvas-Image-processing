import ColorPicker from './ColorPicker'
var output = {color:'#000000',w:5}

document.addEventListener('DOMContentLoaded', function(e) {
	var oColorBtn = document.querySelector('.colorBtn'),
		oColorBox = document.querySelector('.colorPickerbox'),
		colorOnoff = true
	var colorPicker = new ColorPicker({
      oBox: oColorBox,
      oBtnWrap: document.querySelector('.btnWrap'),
      oCan: document.querySelector('#colorPicker'),
      width: 200,
      height: 200,
      callback:function(color){
      	output.color = color;
      	oColorBtn.style.background = color;
      }
    })
	colorPicker.init()

	oColorBtn.addEventListener('touchstart',function(e){
		console.log(colorOnoff)
		oColorBox.style.transform = 'translateX(' + (colorOnoff ? 0 : -1000) +'px)';
		colorOnoff = !colorOnoff;
	},false);

	//模拟range
	var oP = document.querySelector('.rangeWrap p')
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


