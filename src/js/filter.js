import opts from './opts'
import draw from './draw'
import ImageFilters from './../plugins/imagefilters'

// 缓存滤镜信息数据
const filterData = {
  filter: []
}
const oFilterBox = document.getElementById('filterBox'), // 滤镜盒子
  oFilterSelect = document.getElementById('filterSelect'), // 选择滤镜select
  oContent = document.querySelector('#filterBox .content')
let typeName = '', // 类型名字
  dataList = '' // 子节点

// 设置滤镜
function setFilter(type = typeName, imgColorData = opts.data.colorData) {
  if (!type) {
    return false
  }
  const ctx = opts.ctx
  // 使用滤镜
  let filtered = ImageFilters[type](imgColorData, ...filterData.filter),
    pos = opts.data.imgPos
  ctx.clearRect(pos.x, pos.y, pos.w, pos.h)
  ctx.putImageData(filtered, pos.x, pos.y)
  filtered = null
  pos = null
}

// 更新滤镜
function updateFilter() {
  filterData.filter.length = 0
  dataList.forEach((v) => {
    filterData.filter.push(v.value)
  })
  setFilter(typeName)
  draw.cleanDraw()
}

// 将数组格式化成html
function format(arr, arr2) {
  let str = ''
  typeName = arr[0]
  for (let i = 1, len = arr.length; i < len; i++) {
    const data = arr2[i - 1].split(',')
    str += `<div class='list'>
      <span>${arr[i]}</span><input type='range' max='${data[1]}' min='${data[0]}' value='${data[2]}' id='${arr[i]}' /><span>${data[2]}</span>
      </div>`
  }
  return str
}

// 滤镜框显示隐藏
document.getElementById('filterBtn').addEventListener('touchstart', () => {
  oFilterBox.style.display = 'block'
}, false)

document.querySelector('#filterBox .close').addEventListener('touchstart', () => {
  oFilterBox.style.display = 'none'
}, false)


// box change事件
oFilterBox.addEventListener('change', (e) => {
  const tar = e.target
  // 事件委托，获取到当前对象
  if (tar.getAttribute('type') === 'range') {
    updateFilter()
  }
}, false)

// box input事件
oFilterBox.addEventListener('input', (e) => {
  const tar = e.target
  // 事件委托，获取到当前对象
  if (tar.getAttribute('type') === 'range') {
    tar.nextSibling.innerHTML = tar.value
  }
})

oFilterBox.addEventListener('touchstart', () => {
  opts.isStopPrevent = false
}, false)

// 选择滤镜后
oFilterSelect.addEventListener('change', () => {
  opts.isStopPrevent = true
  // 拆解input属性值成数组
  const arr = this.value.split('&'),
    arr2 = this.options[this.selectedIndex].getAttribute('value2').split('&')
  if (!arr) {
    return false
  }
  // 格式化内容，生成range组件
  oContent.innerHTML = format(arr, arr2)
  // 获取input对象数组
  const aInput = Array.prototype.slice.call(document.querySelectorAll('#filterBox .content input'))
  dataList = aInput.filter((v) => {
    return v.nodeName === 'INPUT'
  })
  updateFilter()
}, false)

export default {
  setFilter: setFilter
}
