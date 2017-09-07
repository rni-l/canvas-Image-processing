var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var log4js = require('log4js')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var config = require('./config')
var db = require('./lib/db/user.js')
var app = express()
// db.register({
//   user: 'test4',
//   pwd: '123',
//   avatar: '123',
//   email: 'erwer2@qq.com'
// })
// 设置模板引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// session配置
app.use(session({
  secret: config.sessionSecret,
  cookie: { maxAge: config.sessionExpire },
  resave: true,
  saveUninitialized: true
}))

// 日志记录
log4js.configure({
  appenders: [
    { type: 'console' },
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
    }
  ]
})
app.use(log4js.connectLogger(log4js.getLogger('http')))

// API 转发
// app.use('/api/*',require('./util/middleware')(config.serverUrl))

app.use(require('./routes/index'))
app.use(require('./routes/api'))

// 如果执行到这步，说明没有匹配到路由，404
app.use(function(req, res, next) {
  res.status(404).render('404')
})

// error handlers
if (process.env.NODE_ENV === 'development') {
  // development error handler - 打印错误
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    console.log('message:', err.message)
    res.render('default/error', {
      message: err.message,
      error: err
    })
  })
} else {
  // production error handler - 提示用户出错
  app.use(function(err, req, res, next) {
    log4js.getLogger('error').error(req.url, err)
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: {}
    })
  })
}

// start server
if (!module.parent) {
  var port = Number(process.env.PORT || config.port)
  var server = app.listen(port, function () {
    console.log('-----------------------------------------------------')
    console.log(config.name)
    console.log('Express server listening on port %s:%d in %s mode', server.address().address, port, app.settings.env)
    console.log('-----------------------------------------------------')
  })
}

module.exports = app
