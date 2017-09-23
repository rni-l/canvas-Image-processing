const Schema = require('./db.js')
const mongoose = require('mongoose')
const outputFormat = require('./../util/outputFormat.js')
const regexp = require('./../util/regexp.js')
const crypto = require('crypto')
const fs = require('fs')
const lowdbApi = require('./lowdb/lowdb_api.js')

const ObjectId = mongoose.Types.ObjectId

// user结构
const Pics = Schema.pics,
  User = Schema.user

const PicsModel = mongoose.model('pics', Pics),
  UserModel = mongoose.model('users', User)

async function addPic(params) {
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
    return outputFormat({
      msg: msg,
      code: code
    })
  }
  const objectid = ObjectId(params.id)
  let picName = ''
  // 缓存图片列表
  let picArrs = []
  // 验证id是否存在
  let getUserData = await UserModel.find({ _id: objectid}).exec()
  console.log(getUserData)
  // 没有此账号
  if (getUserData.length !== 1) {
    return outputFormat({
      msg: '没有此账号',
      code: 511
    })
  }
  // picArrs = getUserData[0].pics || []
  // 生成图片
  picName = `./static/upload/${new Date().getTime() + params.id}.png`
  const fileData = fs.renameSync(params.name, picName)

  if (fileData) {
    return outputFormat({
      msg: error,
      code: 500
    })
  }
  const _picName = picName.substr(8)
  const PicsObj = new PicsModel({
    time: new Date(),
    url: _picName
  })
  console.log(PicsObj)
  const addPicData = await PicsObj.save()
  await UserModel.findOneAndUpdate({ _id: objectid }, { $push: { pics: addPicData._id } })

  return outputFormat({
      msg: '成功',
      code: 200
    })
}

async function getPics(params) {
  if (!params.id) {
    return outputFormat({
      msg: '缺少id',
      code: 510
    })
  }
  // 获取相册id
  const picIds = await UserModel.find({_id: ObjectId(params.id)}, {pics: 1, _id: 0}).exec()
  const _search = []
  picIds[0].pics.forEach((v) => {
    _search.push(ObjectId(v))
  })
  const picData = await PicsModel.find({ _id: { $in: _search } }).exec()
  return outputFormat({
    data: picData
  })
}

const api = {
  addPic: addPic,
  getPics: getPics
}

module.exports = api