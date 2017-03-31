require('./css/style');
import opts from 'opts'
import photo from './js/photograph'
import draw from './js/draw'
import lineData from './js/lineData'
import Fastclick from './js/fastclick'
import filter from './js/filter'
document.addEventListener('DOMContentLoaded', function() {
		Fastclick.attach(document.body);
}, false);

var oCan = opts.oCan,
	ctx = opts.ctx

document.querySelector('.main').addEventListener('touchmove',function(e){
	if(opts.isStopPrevent){
		e.preventDefault();
	}
	
},false)

//撤销事件
opts.oRevoke.addEventListener('touchstart',function(e){
	draw.revoke();
})


opts.canvasW = opts.oTop.offsetWidth
opts.canvasH = opts.oTop.offsetHeight

//初始化，定义画布宽高
oCan.width = opts.canvasW
oCan.height = opts.canvasH


