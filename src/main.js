// 入口文件
import Fastclick from './plugins/fastclick'
import _opts from './js/opts'
import './js/photograph'
import './js/draw'
import './js/lineData'
import './js/filter'
// 添加fastclick
document.addEventListener('DOMContentLoaded', () => {
  Fastclick.attach(document.body)
}, false)

document.querySelector('.main').addEventListener('touchmove', (e) => {
  if (_opts.isStopPrevent) {
    e.preventDefault()
  }
}, false)

_opts.canvasW = _opts.oTop.offsetWidth
_opts.canvasH = _opts.oTop.offsetHeight

// 初始化，定义画布宽高
const oCan = _opts.oCan
oCan.width = _opts.canvasW
oCan.height = _opts.canvasH
