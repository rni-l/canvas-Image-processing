const mongoose = require('mongoose')
const config = require('./../../config.js')
const db = mongoose.connect(`mongodb://localhost/${config.mongodbName}`, { useMongoClient: true })
mongoose.Promise = global.Promise
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  //一次打开记录
})
// 设置默认值
const Schema = mongoose.Schema

module.exports = Schema
