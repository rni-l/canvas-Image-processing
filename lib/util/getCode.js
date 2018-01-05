import Canvas from 'canvas'
// canvas
const boxW = 200,
  boxH = 120

const canvas = new Canvas(boxW, boxH),
    ctx = canvas.getContext('2d')

// 线长度的范围
const maxL = 80,
  minL = 30,
  maxW = 5, // 线厚度
  minW = 1
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'i' ,'m' ,'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A','B','C','D','E','F','G','H','I','J','K','L','I','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
let txtArr = null

function getRandom(max, min) {
  return parseInt(Math.random()*(max-min+1)+min, 10)
}

// 生成线
function drawLine() {
  ctx.save()
  ctx.translate(canvas.width/2,canvas.height/2)
  // 生成一条线
  const lineL = getRandom(maxL, minL),
    lineW = getRandom(maxW, minW),
    // x位置
    x = getRandom(boxW - lineL / 2, lineL / 2),
    y = getRandom(boxH - lineL / 2, lineL / 2)
  // 修改中心点
  const rotate = (getRandom(360, 0)*Math.PI*2)/360
  // 旋转上下文
  ctx.rotate(rotate)
  // 中心点归零
  ctx.translate(-canvas.width/2,-canvas.height/2)
  const r = getRandom(255, 0),
    g = getRandom(255, 0),
    b = getRandom(255, 0)
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
  // 在已经旋转后的上下文，画线
  ctx.fillRect(x, y, lineL, lineW)
  ctx.restore()
  // console.log('x:', x, 'y:', y, 'lineL:', lineL, 'lineW:', lineW, 'rotate:', rotate)
}
// 获取要生成的文字
function getDrawTxt() {
  const len = arr.length - 1,
    output = []
  for(let i = 0; i <= 5; i++) {
    let d = getRandom(len, 0)
    output.push(arr[d])
  }
  return output
}
// 生成文字
function createTxt() {
  // 获取颜色
  txtArr = getDrawTxt()
  txtArr.forEach((v, i) => {
    ctx.save()
    ctx.translate(canvas.width/2,canvas.height/2)
    const rotate = (getRandom(-25, 25)*Math.PI*2)/360
    // 旋转上下文
    ctx.rotate(rotate)
    ctx.translate(-canvas.width/2,-canvas.height/2)
    const r = getRandom(255, 0),
      g = getRandom(255, 0),
      b = getRandom(255, 0)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`
    ctx.font = '40px serif'
    ctx.fillText(v, 10 + 32*i, 80)
    ctx.restore()
  })
}


function createCode() {
  ctx.clearRect(0, 0, boxW, boxH)
  createTxt()

  for(var i=0;i<15;i++){
    drawLine()
  }
  ctx.strokeRect(0, 0, 200, 120)
  return {
    img: canvas.toDataURL(),
    txt: txtArr
  }
}

export default createCode
