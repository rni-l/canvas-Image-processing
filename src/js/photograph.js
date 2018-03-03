import EXIF from './../plugins/exif'
import opts from './opts'

const oCan = opts.oCan,
  ctx = opts.ctx,
  oAsideBtn = document.querySelector('.asideBtn'),
  oAside = document.querySelector('#aside'),
  oFile = document.getElementById('file'), // 上传图片按钮
  oCreateBtn = document.getElementById('create'), // 生成图片按钮
  imgData = {}

let isCreatePic = false // 是否生成了图片

/*
 *图片上传处理过程
 *图片上传成功后 => 获取元数据 => 转化为base64 => 修正图片的宽高，显示的方向和图片的内存大小
 */

function toBlob(dataURI) {
  let byteString,
    _split = dataURI.split(',')
  if (_split[0].indexOf('base64') >= 0) {
    // 转码base64
    byteString = atob(_split[1])
  } else {
    // 不是base64，直接转码
    byteString = unescape(_split[1])
  }

  // 获取图片类型
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to a typed array
  let ia = new Uint8Array(byteString.length)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  console.log(mimeString)

  return new Blob([ia], {
    type: mimeString
  })
}

// 生成图片
function createImg(e) {
  e.preventDefault()
  if (!isCreatePic) {
    return false
  }
  // 删除上传图片按钮
  oFile.parentNode.removeChild(oFile)
  this.parentNode.removeChild(this)
  oCan.style.display = 'none'
  this.style.display = 'block'
  // 生成图片
  opts.oShowImg.src = oCan.toDataURL('image/png')
  opts.oShowImg.style.display = 'block'
  opts.oShowImg.style.position = 'static'
  // document.querySelector('.successPage').style.display = 'flex'
  document.querySelector('.main_bottom').innerHTML = '<p class="success_txt">生成图片成功！长按可保存图片</p>'
}

// 图片load回调方法
function cacheImg(url, callback) {
  if (!url) {
    callback.call()
    return false
  }
  const img = new Image()
  img.onload = () => {
    // 图片加载完，执行回调
    callback.call(img)
  }
  img.src = url
}

// 显示功能
function showFun() {
  opts.showLoading('none')
  // 选择size，笔触颜色显示
  oAsideBtn.style.display = 'block'
  oCreateBtn.style.display = 'block'
  document.getElementById('filterBtn').style.display = 'block'
  // 撤销按钮小时
  opts.oRevoke.style.display = 'block'
  isCreatePic = true
  // 是否可以画笔触
  opts.isDraw = true
  // 是新的图片
  opts.isNewPic = true
}

// 计算图片的宽高
function computeWidthAndHeight({
  dw,
  dh,
  Orientation
}) {
  let drawWidth = dw,
    drawHeight = dh,
    degree = 0,
    maxSide = Math.max(drawWidth, drawHeight)
  const size = 2048

  // 如果当期size大于2M，按比例修正到2M以下
  if (maxSide > size) {
    let minSide = Math.min(drawWidth, drawHeight)
    minSide = minSide / maxSide * size
    maxSide = size
    if (drawWidth > drawHeight) {
      drawWidth = maxSide
      drawHeight = minSide
    } else {
      drawWidth = minSide
      drawHeight = maxSide
    }
  }
  // 使用离屏canvas修正图片的方向
  const canvas = document.createElement('canvas')
  const width = drawWidth,
    height = drawHeight
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  // 判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
  switch (Orientation) {
  // iphone横屏拍摄，此时home键在左侧
  case 3:
    degree = 180
    drawWidth = -width
    drawHeight = -height
    break
    // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
  case 6:
    canvas.width = height
    canvas.height = width
    degree = 90
    drawWidth = width
    drawHeight = -height
    break
    // iphone竖屏拍摄，此时home键在上方
  case 8:
    canvas.width = height
    canvas.height = width
    degree = 270
    drawWidth = -width
    drawHeight = height
    break
  }
  /*
   *返回参数
   *degress: 渲染的方向
   *drawWidth: 修正后的宽度
   *.......
   */
  return {
    degree,
    drawWidth,
    drawHeight,
    context,
    canvas
  }
}

// 获取处理好的图片数据
function getImgData({
  img,
  data,
  next
}) {
  cacheImg(img, function () {
    // 以下改变一下图片大小
    // 获取宽高中，最大的值
    let output = computeWidthAndHeight({
      dw: data.PixelXDimension || this.naturalWidth,
      dh: data.PixelYDimension || this.naturalHeight,
      Orientation: data.Orientation
    })
    // 使用canvas旋转校正
    output.context.rotate(output.degree * Math.PI / 180)
    // 渲染新的图片
    output.context.drawImage(this, 0, 0, output.drawWidth, output.drawHeight)
    // 生成校正后图片
    next(output.canvas.toDataURL('image/png'))
    output = null
  })
}

// 处理修正后的图片，渲染到屏幕上
function uploadFileCallBack() {
  // 获取图片的宽高
  let w = this.width,
    h = this.height
  // 缓存图片初始宽高
  imgData.w = w
  imgData.h = h
  opts.imgData.w = w
  opts.imgData.h = h
  const cW = opts.canvasW,
    cH = opts.canvasH
  if (cW / cH > w / h) {
    // 宽大于高，高100%
    w = w * cH / h
    h = cH
  } else {
    // 高大于宽，宽100%
    h = h * cW / w
    w = cW
  }
  ctx.clearRect(0, 0, cW, cH)
  // 生成图片，居中显示
  ctx.drawImage(this, (cW - w) / 2, (cH - h) / 2, w, h)
  // 缓存当前图片的数据到内存里
  opts.data.imageData = ctx.getImageData((cW - w) / 2, (cH - h) / 2, w, h)
  opts.data.img = this
  opts.data.imgPos = {
    x: (cW - w) / 2,
    y: (cH - h) / 2,
    w: w,
    h: h
  }
  showFun()
}

// 图片上传回调事件
function uploadFile() {
  const file = this.files[0]
  let exifData = null
  // 判断图片是否过大
  if (file.size / 1024 > 5000) {
    // 大于2M
    alert('图片过大，请选择相对较小的图片')
    return false
  }
  // 图片处理中，提示层出现
  opts.showLoading('block')
  const reader = new FileReader()
  new Promise((resolve) => {
    // 获取图片的元数据
    EXIF.getData(file, function () {
      exifData = EXIF.getAllTags(this)
      resolve()
    })
  }).then(() => {
    reader.onload = function () {
      // 图片信息获取完毕
      // 修正图片方向
      getImgData({
        img: this.result,
        data: exifData,
        next: (img) => {
          cacheImg(img, uploadFileCallBack)
        }
      })
    }
    reader.readAsDataURL(file)
  })
}

// 图片上传后，change事件
oFile.addEventListener('change', uploadFile, false)

// 生成图片
oCreateBtn.addEventListener('touchstart', createImg, false)

// 侧边栏显示
oAsideBtn.addEventListener('touchstart', () => {
  if (!isCreatePic) {
    alert('请先选择图片')
    return false
  }
  opts.isDraw = false
  oAside.style.display = 'block'
})
// 侧边栏隐藏
document.querySelector('.aside_hideBtn').addEventListener('touchstart', () => {
  opts.isDraw = true
  oAside.style.display = 'none'
  opts.transform(document.querySelector('.colorPickerbox'), 'translateX(-1000px)')
})
