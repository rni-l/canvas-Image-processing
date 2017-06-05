import ColorPicker from './ColorPicker'
import opts from './opts'
var output = {color:'#000000',w:5}
//画布的线的，数据（）
document.addEventListener('DOMContentLoaded', function(e) {
	var oColorBtn = document.querySelector('.colorBtn'),
		oColorBox = document.querySelector('.colorPickerbox'),
		colorOnoff = true;

	//颜色选择器
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
		opts.transform(oColorBox,'translateX(' + (colorOnoff ? 0 : -1000) +'px)');
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
	
	
	oRange.addEventListener('touchstart',function(e){
		e.stopPropagation();
		var t = e.touches[0]
		r_opts.fx = t.clientX
		r_opts.fy = t.clientY

		r_opts.h = oRangePar.offsetHeight
		r_opts.t = oRangePar.offsetTop
		r_opts.rH = oRange.offsetHeight
		//修正高度
		r_opts.h = r_opts.h - r_opts.rH
		//份数
		r_opts.num = r_opts.h/r_opts.max
		//添加移动事件
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

		opts.transform(oRange,('translateY(' + my + 'px)'))
		r_opts.my = my;
		//判断当前位置，属于几
		var value = Math.floor(my/r_opts.num);
		output.w = value;
		oP.innerHTML = '宽度：'+ value;
	}

	oRange.addEventListener('touchend',function(e){
		//移除移动事件
		this.removeEventListener('touchmove', rangeMove, false);
	},false)

}, false)

export default output


