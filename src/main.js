// 入口文件
import './css/style'
import opts from 'opts'
import photo from './js/photograph'
import draw from './js/draw'
import lineData from './js/lineData'
import Fastclick from './plugins/fastclick'
import filter from './js/filter'

// 添加fastclick
document.addEventListener('DOMContentLoaded', function() {
    Fastclick.attach(document.body)
}, false)

document.querySelector('.main').addEventListener('touchmove', function(e) {
  if (opts.isStopPrevent) {
    e.preventDefault()
  }
}, false)

opts.canvasW = opts.oTop.offsetWidth
opts.canvasH = opts.oTop.offsetHeight

// 初始化，定义画布宽高
const oCan = opts.oCan
oCan.width = opts.canvasW
oCan.height = opts.canvasH
