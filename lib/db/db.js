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
  paw: String,
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


module.exports = {
  
}
