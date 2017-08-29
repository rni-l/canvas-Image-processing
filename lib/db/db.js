const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
// 实例一个db对象
const db = low(adapter)
// 设置默认值
/*
  user: [{
    id: '',
    name: '',
    pwd: '',
    avatar: '',
    createdTime: '',
    email: '',
    token: ''
  }]
  pics: [{
    userId: '',
    images: [url, url],
    uploadPicTime: [xx, xx]
  }]
*/
db.defaults({
  pics: [],
  user: []
}).write()

module.exports = db
