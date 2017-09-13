const db = require('./db.js')
const getCode = require('./../../util/getCode.js')
const crypto = require('crypto')

const api = {
  // 生成验证码
  createCode(params) {
    // 生成一个验证码，存储在lowdb中
    const data = getCode()
    const id = crypto.createHash('md5').update(('' + params.id + new Date().getTime())).digest('hex')
    // const imgData = new Buffer(data.img.replace(/^data:image\/\w+;base64,/, ""), 'base64')
    // const output = await fs.writeFileSync('./static/code/', imgData)
    // console.log(output)
    // 将此code值和标识符存在lowdb中
    db.set('user', {
      id: id,
      code: data.txt,
      time: new Date().getTime()
    }).write()
    // 返回图片
    return {
      img: data.img,
      id: id
    }
  }
}

module.exports = api
