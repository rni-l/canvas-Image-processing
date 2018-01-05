import api from './../model/user.js'
import picApi from './../model/pics.js'
import sendMsg from './../util/sendMsg.js'
import Common from './Common.js'
import Status from './status.js'

console.log(Status)

class Index extends Common {
	constructor() {
		super()
	}

  middleIndex(req, res, next) {
  	const path = req.path
	  console.log('path:', path)
	  if (Status.get('ifCheckRedirect') || /api/.test(path)) {
	    Status.set('ifCheckRedirect', false)
	    console.log('不用检验login')
	    return next()
	  }
  
	  // 先判断是否有登录
	  const session = req.session.uid
	  const token = req.cookies.token
	  console.log('session:', session)
	  if (session && session.token === token) {
	    api.checkToken(token, res).then(userData => {
	      if (userData.status.errCode === 200) {
	        console.log('验证通过')
	        // return res.render('index', userData)
	        Status.set('ifRedict', false)
					Status.set('userId', userData.data._id)
	      } else {
	        console.log('重定向到login页面')
	        // 重新登录
	        Status.set('ifRedict', true)
	      }
	    })
	  } else {
	    // 没有登录信息
	    console.error('no token, to login page')
	    Status.set('ifRedict', true)
	  }
	  next()
  }

  getIndex(req, res) {
  	if (!super.checkRedict(res, 'login')) {
			return false
		}
		res.render('index', { userId: Status.get('userId') })
  }

  getHome(req, res) {
  	res.render('home')
  }

}

export default new Index()
