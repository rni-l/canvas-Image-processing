const express = require('express')
const router = express.Router()
const api = require('./../lib/db/user.js')
const Q = require('q')
const defer = Q.defer()
/* GET home page. */
router.get('/', function(req, res, next) {
  const data = req.session.uid
  const token = req.cookies.token
  if (data && data.token === token) {
    api.checkToken(token, res).then(userData => {
      res.render('index', userData)
    })
  } else {
    // 没有登录信息
    console.log('error: no token')
    res.render('login')
  }

})
router.post('/', function(req, res, next) {
  console.log(req.body)
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

router.get('/home', function(req, res, next) {
  res.render('home')
})
router.post('/home', function(req, res, next) {
  // 注册
  const data = req.body
  api.register(data, res)
})

router.get('/login', function(req, res, next) {
  res.render('login')
})

router.get('/register', function(req, res, next) {
  res.render('register')
})

module.exports = router
