import fs from 'fs'
import lowdbApi from './../model/lowdb/lowdb_api.js'
// 清除db.json的数据
async function clean() {
  // 每天清除一次
  setInterval(() => {
    lowdbApi.cleanData()
  }, 3600 * 24 * 1000)
}

export default clean
