const mongoose = require('mongoose')
const config = require('./../../config.js')
// 拼接用户
const _mongodbUrl = config.mongodbUser ? `mongodb://`${config.mongodbUser}`:`${config.mongodbPwd}`@localhost/${config.mongodbName}` : `mongodb://localhost/${config.mongodbName}`
const db = mongoose.connect(_mongodbUrl, { useMongoClient: true })
mongoose.Promise = global.Promise
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  //一次打开记录
})
// 设置默认值
const Schema = mongoose.Schema

module.exports = Schema
