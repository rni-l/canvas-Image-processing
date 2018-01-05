const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const log4js = require('log4js')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const printLog = require('./lib/util/printLog.js')
const config = require('./config')
const serverConfig = require('./server-config.js')
const app = express()

global.serverConfig = serverConfig

// 设置模板引擎
app.set('views', path.join(__dirname, 'app/views'))
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
printLog.init(app)

// 添加定时任务
require('./lib/util/cleanDbData.js')()

// API 转发
// app.use('/api/*',require('./util/middleware')(config.serverUrl))

app.use(require(`${serverConfig.ROUTES}/index`))
app.use(require(`${serverConfig.ROUTES}/api`))

// 如果执行到这步，说明没有匹配到路由，404
app.use(function(req, res) {
  printLog.getLogger('404').trace('path:', req.url)
  res.status(404).render('404')
})

// error handlers
if (process.env.NODE_ENV === 'development') {
  // development error handler - 打印错误
  app.use(function(err, req, res) {
    res.status(err.status || 500)
    printLog.getLogger('error').debug(req.url, err)
    res.render('default/error', {
      message: err.message,
      error: err
    })
  })
} else {
  // production error handler - 提示用户出错
  app.use(function(err, req, res) {
    printLog.getLogger('error').error(req.url, err)
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
