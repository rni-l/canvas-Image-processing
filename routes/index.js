const express = require('express')
const router = express.Router()
const api = require('./../lib/db/user.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index')
})
router.post('/', function(req, res, next) {
  api.login(req.body, res)
})

router.get('/home', function(req, res, next) {
  res.render('home')
})
router.post('/home', function(req, res, next) {
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
