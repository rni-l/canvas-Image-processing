const Schema = require('./db.js')
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