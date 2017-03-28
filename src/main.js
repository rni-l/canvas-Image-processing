require('./css/style');
import opts from 'opts'
import photo from './js/photograph'
import draw from './js/draw'
import lineData from './js/lineData'
import Fastclick from './js/fastclick'
document.addEventListener('DOMContentLoaded', function() {
		Fastclick.attach(document.body);
	}, false);

var oCan = opts.oCan,
	ctx = opts.ctx

document.querySelector('.main').addEventListener('touchmove',function(e){
	e.preventDefault();
},false)

opts.oRevoke.addEventListener('touchstart',function(e){
	draw.revoke();
})


opts.canvasW = opts.oTop.offsetWidth
opts.canvasH = opts.oTop.offsetHeight

//初始化，定义画布宽高
oCan.width = opts.canvasW
oCan.height = opts.canvasH


