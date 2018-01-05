import express from 'express'
import api from './../model/user.js'
import picApi from './../model/pics.js'

const router = express.Router()

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

export default router
