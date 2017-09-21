const log4js = require('log4js')

// 日志记录
log4js.configure({
  appenders: [
    { type: 'console' }, // 控制台输出
    {
      type: 'dateFile', //文件输出
      filename: 'logs/app.log',
      pattern: "-yyyy-MM-dd",
      backups: 7,
      category: 'http'
    },
    {
      type: 'dateFile', //文件输出
      filename: 'logs/error.log',
      pattern: "-yyyy-MM-dd",
      backups: 7,
      category: 'error'
    },
    {
      type: 'dateFile', //文件输出
      filename: 'logs/404.log',
      pattern: "-yyyy-MM-dd",
      backups: 7,
      level: 'WARN',
      category: '404'
    }
  ]
})

module.exports = {
  init: function(app) {
    app.use(log4js.connectLogger(log4js.getLogger('http')))
  },
  getLogger: function(name) {
    return log4js.getLogger(name)
  }
}