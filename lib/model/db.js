import mongoose from 'mongoose'
import config from './../../config.js'
// 根据配置，是否需要鉴权
const _mongodbUrl = config.mongodbUser ? `mongodb://${config.mongodbUser}:${config.mongodbPwd}@localhost/${config.mongodbName}` : `mongodb://localhost/${config.mongodbName}`
const db = mongoose.connect(_mongodbUrl, { useMongoClient: true })
const Schema = mongoose.Schema

// 设置 mongoose 使用的 promise
mongoose.Promise = global.Promise

db.on('error',console.error.bind(console,'连接错误:'))

db.once('open',function(){
  //一次打开记录
})

// 声明各个集合的字段
const moduleSchema = {
  user: new Schema({
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
  }),
  pics: new Schema({
    url: String,
    createdTime: {
      type: Date,
      default: Date.now
    }
  })
}

module.exports = moduleSchema
