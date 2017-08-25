import updateDrawStrokes from './draw'
import setFilter from './filter'
import opts from './opts'

const ctx = opts.ctx

// 改变图片展示方式
function selectPicSize(value) {
  let set_x,
    set_y,
    set_w,
    set_h,
    w = opts.imgData.w,
    h = opts.imgData.h
  const cw = opts.canvasW,
    ch = opts.canvasH

  function check_type(type) {
    if (type) {
      if (cw / ch > w / h) {
        // 宽大于高，高100%
        w = w * ch / h
        h = ch
      } else {
        h = h * cw / w
        w = cw
      }
    } else {
      if (cw / ch <= w / h) {
        // 宽大于高，高100%
        w = w * ch / h
        h = ch
      } else {
        h = h * cw / w
        w = cw
      }
    }
  }
  // 改变图片展示方式
  switch (value) {
  case '1':
    // 居中
    check_type(true)
    set_x = (cw - w) / 2
    set_y = (ch - h) / 2
    set_w = w
    set_h = h
    break
  case '2':
    // 填充
    check_type(false)
    set_x = (cw - w) / 2
    set_y = (ch - h) / 2
    set_w = w
    set_h = h
    break
  case '3':
    // 适应
    check_type(true)
    set_x = 0
    set_y = 0
    set_w = w
    set_h = h
    break
  case '4':
    // 拉伸
    set_x = 0
    set_y = 0
    set_w = cw
    set_h = ch
    break
  default:
    // 居中
    check_type(true)
    set_x = (cw - w) / 2
    set_y = (ch - h) / 2
    set_w = w
    set_h = h
    break
  }
  return {
    set_x: set_x,
    set_y: set_y,
    set_w: set_w,
    set_h: set_h
  }
}
// 选择图片的显示方式
document.getElementById('selectPicSize').addEventListener('change', function() {
  // 获取上传的图片
  let img = opts.data.img
  // 获取修正后的宽高,xy
  const output = selectPicSize(this.value)
  const set_x = output.set_x,
    set_y = output.set_y,
    set_w = output.set_w,
    set_h = output.set_h
  // 重绘
  ctx.clearRect(0, 0, opts.canvasW, opts.canvasH)
  ctx.drawImage(img, set_x, set_y, set_w, set_h)
  opts.data.imageData = ctx.getImageData(set_x, set_y, set_w, set_h)
  opts.data.imgPos = {
    x: set_x,
    y: set_y,
    w: set_w,
    h: set_h
  }
  img = null
  setFilter()
  updateDrawStrokes()
}, false)
