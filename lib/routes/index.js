import express from 'express'
import Index from './../controller/index.js'
import Pics from './../controller/pics/pics.js'
import User from './../controller/user/user.js'

const router = express.Router()
router.use('/', Index.middleIndex)

router.get('/', Index.getIndex)
router.get('/home', Index.getHome)
router.get('/list', Pics.getPics)
router.get('/login', User.getLogin)
router.get('/register', User.getRegister)

router.post('/login', User.postLogin)
router.post('/success', User.postSuccess)
router.post('/home', User.postHome)

export default router
