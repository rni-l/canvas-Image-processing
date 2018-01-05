const express = require('express')
const router = express.Router()
const api = require(`${global.serverConfig.DB}/user.js`)
const picApi = require(`${global.serverConfig.DB}/pics.js`)
// 处理文件上传
const multer  = require('multer')
const multipartMiddleware = multer({ dest: `${global.serverConfig.STATIC}/upload/`}).single('url')

router.get('/api/getCode', function(req, res) {
  res.json(api.getCode())
})

router.post('/api/savePic', multipartMiddleware, (req, res) => {
  const params = req.body
  params.name = `${global.serverConfig.STATIC}/upload/${req.file.filename}`
  picApi.addPic(params).then(data => {
    res.json(data)
  })
})

module.exports = router
