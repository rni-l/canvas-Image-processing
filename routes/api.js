const express = require('express')
const router = express.Router()
const api = require('./../lib/db/pics.js')
// 处理文件上传
const multer  = require('multer')
const multipartMiddleware = multer({ dest: './static/upload/'}).single('url')

router.get('/api/getCode', function(req, res) {
  res.json(api.getCode())
})

router.post('/api/savePic', multipartMiddleware, (req, res) => {
  const params = req.body
  params.name = `./static/upload/${req.file.filename}`
  api.addPic(params).then(data => {
    res.json(data)
  })
})

module.exports = router
