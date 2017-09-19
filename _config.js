module.exports = {
  name: 'canvas-Image-processing',
  port: '6363',
  mongodbName: 'canvas',
  sessionSecret: 'test',
  sessionExpire: 3600 * 24 * 7 * 1000,
  email: {
    user: '', // 发送邮箱
    emailPwd: '', // 发送邮箱的密码
    emailTo: ['15625979610@163.com'] // 接受邮箱，支持多个
  }
}
