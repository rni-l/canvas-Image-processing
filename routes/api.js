var express = require('express')
var router = express.Router()

router.get('/testapi', function(req, res, next) {
  res.json({ title: 'Express' })
})

module.exports = router
