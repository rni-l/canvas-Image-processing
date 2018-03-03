// 入口文件
import Fastclick from './../plugins/fastclick'
import _opts from './opts'
import './photograph'
import './draw'
import './lineData'
import './filter'
import './selectImgSize'
// 添加fastclick
document.addEventListener('DOMContentLoaded', () => {
  Fastclick.attach(document.body)
}, false)

document.querySelector('.main').addEventListener('touchmove', (e) => {
  if (_opts.isStopPrevent) {
    e.preventDefault()
  }
}, false)

const oFilterBox = document.getElementById('filterBox')

// 滤镜框显示隐藏
document.getElementById('filterBtn').addEventListener('touchstart', () => {
  oFilterBox.style.display = 'block'
}, false)

document.querySelector('#filterBox .close').addEventListener('touchstart', () => {
  oFilterBox.style.display = 'none'
}, false)

const oTop = document.querySelector('.main_top')

_opts.canvasW = oTop.offsetWidth
_opts.canvasH = oTop.offsetHeight

// 初始化，定义画布宽高
const oCan = _opts.oCan
oCan.width = _opts.canvasW
oCan.height = _opts.canvasH
