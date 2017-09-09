const express = require('express')
const router = express.Router()
const api = require('./../lib/db/user.js')

router.get('/testapi', function(req, res) {
  res.json({ title: 'Express' })
})

router.post('/api/savePic', (req, res) => {
  const params = req.body
  api.savePic(params).then(data => {
    res.json(data)
  })
})

module.exports = router
