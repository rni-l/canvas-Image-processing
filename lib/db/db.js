const mongoose = require('mongoose')
const db = mongoose.connect('mongodb://localhost/canvas', { useMongoClient: true })
db.on('error',console.error.bind(console,'连接错误:'));
db.once('open',function(){
  //一次打开记录
})
// 设置默认值
const Schema = mongoose.Schema
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
// pics结构
const Pics = new Schema({
  images: {
    type: Array,
    default: []
  },
  uploadPicTime: {
    type: Array,
    default: []
  }
})

function test(){
  const Test = mongoose.model('user', User)
  // var thing = new Test({
  //   name: 'test1',
  //   pwd: 'sdfdf'
  // })
  // // console.log(thing)
  // // thing.insert()
  // // thing.save()
  // thing.save(function (err) {
  //   if (err) return handleError(err);
  //   Test.findById(thing, function (err, doc) {
  //     if (err) return handleError(err);
  //     console.log(doc); // { name: 'mongodb.org', _id: '50341373e894ad16347efe12' }
  //   })
  // })
  Test.find(function(error, v) {
    console.log(v)
  })
}


module.exports = test
