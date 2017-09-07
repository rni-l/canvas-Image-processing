const Schema = require('./db.js')
const mongoose = require('mongoose')
const outputFormat = require('./../util/outputFormat.js')
const regexp = require('./../util/regexp.js')
const crypto = require('crypto')
const md5 = crypto.createHash('md5')
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
  token: String
})

function createToken(data) {
  const date = new Date()
  const str = data._id + date.getTime() + data.email + data.user + data.createTime
  const _str = md5.update(str).digest('hex')
  return _str
}

const UserModel = mongoose.model('users', User)
const api = {
  login(params) {
    let msg = '',
      code = 200
    if (!msg && !params.pwd) {
      code = 515
      msg = '请输入邮箱'
    }
    if (!msg && !regexp.email.test(params.email)) {
      code = 516
      msg = '请输入正确的邮箱'
    }
    if (!msg && !params.pwd) {
      code = 512
      msg = '请输入密码'
    }
    if (!msg && !regexp.pwd.test(params.pwd)) {
      code = 513
      msg = '请输入正确密码格式'
    }
    // if (!params.token) {
    //   code = 503
    //   msg = 'token不正确'
    // }
    if (msg) {
      return outputFormat({
        msg: msg,
        code: code
      })
    }
    const promise = UserModel.find({email: params.email}, (error, vs) => {
      if (error) {
        return outputFormat({
          msg: '服务器错误，' + error,
          code: 500
        })
        return
      }
      if (vs.length <= 0) {
        return outputFormat({
          msg: '没有此账号',
          code: 503
        })
      }
      let _v = vs.filter((v) => {
        return v.pwd === params.pwd
      })
      if (_v.length <= 0) {
        return outputFormat({
          msg: '密码错误',
          code: 504
        })
      }
      return JSON.stringify(_v[0])
    }).exec().then(findData => {
      findData = findData[0]
      return UserModel.findOneAndUpdate({ _id: findData._id }, { $set: { token: createToken(findData) } }, {
        new: true
      })
    }).then(data => {
      return outputFormat({
        data: data
      })
    })
    return promise
  },
  register(params, res) {
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
    // if (!params.token) {
    //   code = 503
    //   msg = 'token不正确'
    // }
    if (msg) {
      return outputFormat({
        msg: msg,
        code: code
      })
    }
    const Obj = new UserModel({
      user: params.user,
      pwd: params.pwd,
      avatar: params.avatar,
      email: params.email,
      token: createToken(params)
    })
    return Obj.save().then(v => {
      return outputFormat({
        data: v
      })
    }).catch(error => {
      if (error) {
        return outputFormat({
          msg: '服务器错误，' + error,
          code: 500
        })
      }
      res.render('home', outputFormat({
        data: v
      }))
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
  }
}

module.exports = api
