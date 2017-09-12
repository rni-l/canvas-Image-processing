const express = require('express')
const router = express.Router()
const api = require('./../lib/db/user.js')
const sendMsg = require('./../lib/util/sendMsg.js')

// 判断是否要重定向
let ifRedict = false,
  ifCheckRedirect = false,
  userId = 0

// 中间件，判断是否有登录状态
router.use('/', (req, res, next) => {
  const path = req.path
  console.log('path:', path)
  if (ifCheckRedirect || /api/.test(path)) {
    ifCheckRedirect = false
    console.log('不用检验login')
    return next()
  }
  
  // 先判断是否有登录
  const session = req.session.uid
  const token = req.cookies.token

  if (session && session.token === token) {
    api.checkToken(token, res).then(userData => {
      if (userData.status.errCode === 200) {
        console.log('验证通过')
        // return res.render('index', userData)
        ifRedict = false
        userId = userData.data._id
      } else {
        console.log('重定向到login页面')
        // 重新登录
        // return res.redirect('login')
        ifRedict = true
      }
    })
  } else {
    // 没有登录信息
    console.error('no token, to login page')
    ifRedict = true
  }
  next()
})

// play页面
router.get('/', function(req, res) {
  if (ifRedict) {
    ifRedict = false
    return res.redirect('login')
  }
  res.render('index', { userId: userId })
})

// 跳转到登录成功页面
router.post('/login', function(req, res) {
  if (!ifRedict) {
    return res.redirect('/')
  }
  ifRedict = false
  // 登录
  api.login(req.body).then(data => {
    console.log('returnData:', data)
    // 存储session
    req.session.uid = {
      token: data.data.token,
      id: data.data._id
    }
    userId = data.data._id
    res.cookie('token', data.data.token, { expires: new Date(Date.now() + 3600*24*3) })
    ifCheckRedirect = true
    // 登录成功，重定向到首页
    res.redirect('/')
  })
})

// 跳转注册成功页面
router.post('/success', function(req, res) {
  api.register(req.body).then(data => {
    console.log('data:', data)
    if (data.status.errCode === 200) {
      // 注册成功，存储token
      req.session.uid = {
        token: data.data.token,
        id: data.data._id
      }
      res.cookie('token', data.data.token, { expires: new Date(Date.now() + 3600*24*3) })
      // 发送邮箱
      sendMsg()
    }
    res.render('registerSuccess', data)
  })
})

// home页面
router.get('/home',(req, res) => {
  res.render('home', {userId: userId})
})

// 相册list
router.get('/list', function(req, res) {
  if (ifRedict) {
    ifRedict = false
    return res.redirect('login')
  }
  const queryId = req.query.d
  if (!queryId) {
    return res.redirect('home')
  }
  api.getList({
    id: queryId
  }).then(data => {
    console.log('list', data)
    res.render('list', { data: data })
  })
})


router.post('/home', function(req, res) {
  if (ifRedict) {
    ifRedict = false
    return res.redirect('login')
  }
  console.log('post home')
  // 注册
  api.register(req.body, res).then(data => {
    console.log(data)
  })
})

router.get('/login', function(req, res) {
  console.log('ifredict:', ifRedict)
  if (!ifRedict) {
    return res.redirect('/')
  }
  ifRedict = false
  res.render('login')
})

router.get('/register', function(req, res) {
  if (!ifRedict) {
    return res.redirect('/')
  }
  ifRedict = false
  res.render('register')
})

module.exports = router
