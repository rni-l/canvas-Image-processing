const express = require('express')
const router = express.Router()
const api = require('./../lib/db/user.js')
const sendMsg = require('./../lib/util/sendMsg.js')

// 中间件，判断是否有登录状态
router.use('/', (req, res, next) => {
  const path = req.path
  // 先判断是否有登录
  const session = req.session.uid
  const token = req.cookies.token
  console.log('path:', path)
  if (path === '/success') {
    return next()
  }
  if (session && session.token === token) {
    api.checkToken(token, res).then(userData => {
      console.log('userData:', userData)
      if (userData.status.errCode === 200) {
        res.render('index', userData)
      } else {
        // 重新登录s
        return res.redirect('login')
      }
    })
  } else {
    // 没有登录信息
    console.error('no token, to login page')
    if (path !== '/login' && path !== '/register') {
      return res.redirect('login')
    }
  }
  next()
})

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index')
})

// 跳转到登录成功页面
router.post('/', function(req, res) {
  // 登录
  api.login(req.body).then(data => {
    console.log('returnData:', data)
    // 存储session
    req.session.uid = {
      token: data.data.token,
      id: data.data._id
    }
    res.cookie('token', data.data.token, { expires: new Date(Date.now() + 3600*24*3) })
    res.render('index', data)
  })
})
// router.get('/success',(req, res) => {
//   res.render('registerSuccess')
// })
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
router.post('/home', function(req, res) {
  console.log('post home')
  // 注册
  api.register(req.body, res).then(data => {
    console.log(data)
  })
})

router.get('/login', function(req, res) {
  res.render('login')
})

router.get('/register', function(req, res) {
  res.render('register')
})

module.exports = router
