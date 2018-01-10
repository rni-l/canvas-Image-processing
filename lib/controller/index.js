import userApi from './../model/user.js'
import Common from './common.js'
import Status from './status.js'

console.log(Status)

class Index extends Common {
	constructor() {
		super()
	}
	
	/**
	 * 所有路由，先进 '/' 中间件，进行 checkLogin
	 * api 方法，直接 next
	 * checklogin，使用 ifRedict 判断路由是否需要重定向
	 */
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
		// 检验 session 是否有 token
	  if (session && session.token === token) {
			userApi.checkToken(token, res).then(({ status, data }) => {
	      if (status.errCode === 200) {
	        Status.setValues({
						ifRedict: false,
						userId: data._id
					})
	      } else {
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
		res.render('home', { userId: Status.get('userId') })
  }

}

export default new Index()
