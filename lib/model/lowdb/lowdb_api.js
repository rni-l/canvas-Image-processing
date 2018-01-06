import db from './db.js'
import getCode from './../../util/getCode.js'
import crypto from 'crypto'

const api = {
  // 生成验证码
  createCode(params) {
    // 生成一个验证码，存储在lowdb中
    const data = getCode()
    params = params || 'test'
    params += (Math.random() * 10 * Math.random() * 10 / Math.random() * 10).toFixed
    const id = crypto.createHash('md5').update(('' + params + new Date().getTime())).digest('hex')
    // 将此code值和标识符存在lowdb中
    db.get('user').push({
      id: id,
      code: data.txt.join(''),
      time: new Date().getTime(), // 创建时间
      ifChecked: false // 是否检验过
    }).write()
    // 返回图片
    return {
      img: data.img,
      id: id
    }
  },
  checkCode(id, code) {
    const data = db.get('user').find({id: id}).value()
    let msg = ''
    if (!data) {
      msg = '请关闭页面，重新打开'
    } else if (data.ifChecked) {// 先判断是否验证过
      msg = '已经检验过，请重新获取验证码'
    } else if ((new Date().getTime() - data.time) > 600000) {// 如果时间超过10分钟
      msg = '验证码时效已过，请重新获取验证码'
    } else if (data.code.toLocaleLowerCase() !== code.toLocaleLowerCase()) {// 判断是否正确
      // 不分大小写
      msg = '验证码不正确'
    }
    // 修改对应的验证码
    db.get('user').find({id: id}).assign({ ifChecked: true }).write()
    // 正确的话，返回空字符串
    return msg
  },
  cleanData() {
    const time = new Date().getTime()
    const data = db.get('user').remove((v) => time - v.time >=  60 * 10 * 1000).write()
    console.log(data)
    return true
  }
}

export default api
