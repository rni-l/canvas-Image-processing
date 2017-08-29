const db = require('./db.js')
const uuid = require('uuid')

const api = {
  register(data) {
    db.get('user').push({
      id: uuid(),
      name: data.name,
      pwd: data.pwd,
      createTime: new Date().getTime(),
      email: data.email,
      avatar: data.avatar,
      token: 'xx'
    }).write()
  }
}

module.exports = api