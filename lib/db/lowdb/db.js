const low = require('lowdb')
// 同步操作
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
// 实例一个db对象
const db = low(adapter)
// 设置默认值
db.defaults({
  user: []
}).write()

module.exports = db
