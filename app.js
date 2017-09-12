const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const log4js = require('log4js')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const config = require('./config')
const app = express()

// 设置模板引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))
// 设置长度
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'static')))

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
app.use(function(req, res) {
  res.status(404).render('404')
})

// error handlers
if (process.env.NODE_ENV === 'development') {
  // development error handler - 打印错误
  app.use(function(err, req, res) {
    res.status(err.status || 500)
    console.log('message:', err.message)
    res.render('default/error', {
      message: err.message,
      error: err
    })
  })
} else {
  // production error handler - 提示用户出错
  app.use(function(err, req, res) {
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
  const port = Number(process.env.PORT || config.port)
  const server = app.listen(port, () => {
    console.log('-----------------------------------------------------')
    console.log(config.name)
    console.log('Express server listening on port %s:%d in %s mode', server.address().address, port, app.settings.env)
    console.log('-----------------------------------------------------')
  })
}

module.exports = app
