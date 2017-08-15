import opts from './opts'
import updateDrawStrokes from './draw'
import ImageFilters from './../../plugins/imagefilters'
import filterChooseData from './../../utils/filterData'

// 缓存滤镜信息数据
const filterData = {
  filter: []
}
const oFilterBox = document.getElementById('filterBox'), // 滤镜盒子
  oFilterSelect = document.getElementById('filterSelect'), // 选择滤镜select
  oContent = document.querySelector('#filterBox .content')
let typeName = '', // 当前滤镜效果的名字
  dataList = [] // 当前滤镜效果，子选项值

/*
  滤镜流程：
  1. 选择好滤镜效果和滤镜的值
  2. 获取渲染滤镜效果的数据
  3. 再渲染到主屏
  4. 绘制笔触效果
*/

/*
 *设置滤镜
 *参数
 *type: 滤镜类型名字
 *imageData: 图片数据
*/
function setFilter(type = typeName, imgData = opts.data.imageData) {
  if (!type) {
    return false
  }
  const ctx = opts.ctx
  /*
   *生成滤镜效果
   *参数
   *type: 选择的滤镜效果名字
   *[0]: 图片数据
   *[1]: 滤镜效果的各个数值
  */
  let filtered = ImageFilters[type](imgData, ...filterData.filter),
    pos = opts.data.imgPos
  ctx.clearRect(pos.x, pos.y, pos.w, pos.h)
  ctx.putImageData(filtered, pos.x, pos.y)
  filtered = null
  pos = null
}

// 更新滤镜选项
function updateFilter() {
  // 清空
  filterData.filter.length = 0
  // 将当前input的value值存入filter里面
  dataList.forEach((v) => {
    filterData.filter.push(v.value)
  })
  // 设置
  setFilter(typeName)
  // 绘制笔触
  updateDrawStrokes()
}

// 将数组格式化成html
function format(data) {
  let str = ''
  typeName = data.name
  data.chooseValue.forEach((v, i) => {
    const _range = data.range
    str += `<div class='list'>
      <span>${v}</span><input type='range' max='${_range[i].max}' min='${_range[i].min}' value='${_range[i].first}' id='${v}' /><span>${_range[i].first}</span>
    </div>`
  })
  return str
}

// box change事件
oFilterBox.addEventListener('change', (e) => {
  const tar = e.target
  // 事件委托，获取到当前对象
  if (tar.getAttribute('type') === 'range') {
    // 当range值更改后，渲染滤镜
    updateFilter()
  }
}, false)

// box input事件
oFilterBox.addEventListener('input', (e) => {
  const tar = e.target
  // 事件委托，获取到当前对象
  if (tar.getAttribute('type') === 'range') {
    // 拖动滚动条时，显示当前的value值
    tar.nextSibling.innerHTML = tar.value
  }
})

oFilterBox.addEventListener('touchstart', () => {
  opts.isStopPrevent = false
}, false)

// 选择滤镜效果
oFilterSelect.addEventListener('change', function() {
  opts.isStopPrevent = true
  // 获取选择的滤镜效果数据
  const arr = filterChooseData.filterValue.filter((v) => {
    return v.name === this.value
  })
  if (!arr) {
    return false
  }
  // 格式化内容，生成range组件
  oContent.innerHTML = format(arr[0])
  // 获取input对象数组
  const aInput = [...document.querySelectorAll('#filterBox .content input')]
  // 缓存input对象
  dataList = aInput.filter((v) => {
    return v.nodeName === 'INPUT'
  })
  updateFilter()
}, false)

// 渲染当前选择好的滤镜效果
export default setFilter
