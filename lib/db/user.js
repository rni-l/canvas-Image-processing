const Schema = require('./db.js')
const mongoose = require('mongoose')
const outputFormat = require('./../util/outputFormat.js')
const regexp = require('./../util/regexp.js')
const crypto = require('crypto')
const fs = require('fs')
const lowdbApi = require('./lowdb/lowdb_api.js')

const ObjectId = mongoose.Types.ObjectId

// user结构
const User = new Schema({
  name: String,
  pwd: String,
  avatar: String,
  createdTime: {
    type: Date,
    default: Date.now
  },
  email: String,
  token: String,
  checkCodeNum: {
    type: Object,
    default: {
      num: 0,
      time: 0
    }
  },
  pics: []
})

function createToken(data) {
  const date = new Date()
  const str = data._id + date.getTime() + data.email + data.createdTime
  const _str = crypto.createHash('md5').update(str).digest('hex')
  return _str
}

const UserModel = mongoose.model('users', User)
const api = {
  async login(params) {
    console.log(params)
    let msg = '',
      code = 200
    if (!params.pwd) {
      code = 515
      msg = '请输入邮箱'
    } else if (!regexp.email.test(params.email)) {
      code = 516
      msg = '请输入正确的邮箱'
    } else if (!params.pwd) {
      code = 512
      msg = '请输入密码'
    } else if (!regexp.pwd.test(params.pwd)) {
      code = 513
      msg = '请输入正确密码格式'
    } else if (!params.code) {
      code = 516
      msg = '请输入验证码'
    } else if (!params.codeId) {
      code = 517
      msg = '请输入验证码标识符'
    }
    // 参数错误，跳出
    if (msg) {
      return outputFormat({
        msg: msg,
        code: code
      })
    }
    // 获取账号
    const findData = await UserModel.find({email: params.email}, (error, vs) => {
      if (error) {
        return outputFormat({
          msg: '服务器错误，' + error,
          code: 500
        })
      }
    })
    // 筛选账号
    if (findData.length <= 0) {
      return outputFormat({
        msg: '没有此账号',
        code: 503
      })
    }
    let _v = findData.filter((v) => {
      return v.pwd === params.pwd
    })
    if (_v.length <= 0) {
      return outputFormat({
        msg: '密码错误',
        code: 504
      })
    }
    let _findData = findData[0]
    // 获取账号数据，判断用户短时间内验证验证码次数
    const codeNumData = _findData.checkCodeNum
    let ifCanUpdateTime = false
    if (codeNumData.num >= 5) {
      // 超过5次，判断时间是否在10分钟内
      const _time = (new Date() - codeNumData.time - 60 * 10 * 1000) / 1000
      if (_time < 0) {
        return outputFormat({
          msg: `请${parseInt(Math.abs(_time))}秒后再尝试登录`,
          code: 505
        }) 
      }
      // 更新时间
      ifCanUpdateTime = true
    }
    // 检验验证码是否正确
    const checkCodeStatus = lowdbApi.checkCode(params.codeId, params.code)
    // 不正确
    if (checkCodeStatus) {
      // 更新次数
      let requestData = {
        checkCodeNum: {
          num: codeNumData.num >= 5 ? 1 : codeNumData.num + 1,
          time: codeNumData.num === 0 || ifCanUpdateTime ? new Date() : codeNumData.time
        }
      }
      const d = await UserModel.findOneAndUpdate({ _id: _findData._id }, { $set: requestData }, {
        new: true
      })
      return outputFormat({
        msg: checkCodeStatus,
        code: 518
      })
    }

    const requestData = {
      token: createToken(_findData)
    }
    // 如果验证码正确或者超过5次，但已过了10分钟，清零
    if (ifCanUpdateTime || !checkCodeStatus) {
      requestData.checkCodeNum = {
        num: 0,
        time: 0
      }
    }
    const updateFindData = await UserModel.findOneAndUpdate({ _id: _findData._id }, { $set: requestData }, {
      new: true
    })
    return outputFormat({
      data: updateFindData
    })
  },
  register(params) {
    let msg = '',
      code = 200
    if (!params.user) {
      code = 511
      msg = '请输入账号'
    }
    if (!msg && !params.pwd) {
      code = 512
      msg = '请输入密码'
    }
    if (!msg && !regexp.pwd.test(params.pwd)) {
      code = 513
      msg = '请输入正确密码格式'
    }
    if (!msg && params.pwd !== params.checkPwd) {
      code = 514
      msg = '密码和确认密码不相同'
    }
    if (!msg && !params.pwd) {
      code = 515
      msg = '请输入邮箱'
    }
    if (!msg && !regexp.email.test(params.email)) {
      code = 516
      msg = '请输入正确的邮箱'
    }

    // const checkCodeStatus = owdbApi.checkCode(params.id, params.code)

    // if (checkCodeStatus) {
    //   msg = checkCodeStatus
    //   code = 518
    // }

    if (msg) {
      return new Promise((resolve) => {
        resolve(outputFormat({
          msg: msg,
          code: code
        }))
      })
    }
    const Obj = new UserModel({
      user: params.user,
      pwd: params.pwd,
      avatar: params.avatar,
      email: params.email,
      token: createToken(params)
    })
    return UserModel.find({email: params.email}).exec().then(findData => {
      if (findData.length) {
        return outputFormat({
          msg: '有重复的邮箱，请重新注册',
          code: 515
        })
      }
      return Obj.save()
    }).then(v => {
      // 有重复的邮箱
      if (v.status && v.status.errCode !== 200) {
        return v
      }
      return outputFormat({
        data: v
      })
    }).catch(error => {
      return outputFormat({
        msg: '服务器错误，' + error,
        code: 500
      })
    })
  },
  checkToken(token) {
    const promise = UserModel.find({token: token}).exec().then(data => {
      if (data.length > 0) {
        return outputFormat({
          data: data[0]
        })
      } else {
        return outputFormat({
          msg: '请登录',
          code: 500
        })
      }
    })
    return promise
  },
  // 保存图片
  savePic(params) {
    let msg = '',
      code = 200
    if (!params.id) {
      msg = '缺少id'
      code = 510
    }
    if (!msg && !params.name) {
      msg = '缺少图片'
      code = 511
    }
    if (msg) {
      return new Promise((resolve) => {
        return resolve(outputFormat({
          msg: msg,
          code: code
        }))
      })
    }
    const objectid = ObjectId(params.id)
    let picName = ''
    // 缓存图片列表
    let picArrs = []
    // 验证id是否存在
    return UserModel.find({ _id: objectid}).exec().then(findData => {
      if (findData.length <= 0) {
        return outputFormat({
          msg: '没有此账号',
          code: 511
        })
      }
      return findData
    }).then(getUserData => {
      // 没有此账号
      if (getUserData.length !== 1) {
        return outputFormat
      }
      picArrs = getUserData[0].pics || []
      // 生成图片
      // const imgData = new Buffer(params.url.replace(/^data:image\/\w+;base64,/, ""), 'base64')
      picName = `./static/upload/${new Date().getTime() + params.id}.png`
      // 图片改名
      return fs.renameSync(params.name, picName)
    }).then((error) => {
      if (error) {
        return outputFormat({
          msg: error,
          code: 500
        })
      }
      picArrs.push({
        url: picName.substr(8),
        time: new Date()
      })
      // 地址存储
      return UserModel.findOneAndUpdate({ _id: objectid }, { $set: { pics: picArrs } })
    }).then(() => {
      return outputFormat({
        msg: '成功',
        code: 200
      })
    }).catch(error => {
      console.log('error:', error)
      return outputFormat({
        msg: error,
        code: 500
      })
    })
  },
  // 获取相册list
  getList(params) {
    if (!params.id) {
      return outputFormat({
        msg: '缺少id',
        code: 510
      })
    }
    // 获取相册
    return UserModel.find({_id: ObjectId(params.id)}, {pics: 1, _id: 0}).exec().then(data => {
      return outputFormat({
        data: data.length > 0 ? data[0].pics : []
      })
    })
  },
  // 获取验证码
  getCode(id) {
    return lowdbApi.createCode(id)
  }
}

module.exports = api
