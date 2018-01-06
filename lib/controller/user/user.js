import api from './../../model/user.js'
import sendMsg from './../../util/sendMsg.js'
import Common from './../Common.js'
import Status from './../status.js'

class User extends Common {
	constructor() {
    super()
  }

	getLogin(req, res) {
    if (!super.checkRedict(res, '/', true)) {
			return false
		}
	  res.render('login', { codeData: api.getCode(123) })
	}

	getRegister(req, res) {
    if (!super.checkRedict(res, '/', true)) {
			return false
		}
    res.render('register')
	}

	async postLogin(req, res) {
		if (!super.checkRedict(res, '/', true)) {
			return false
		}
		// 登录
    const { data, status } = await api.login(req.body)
    console.log('returnData:', data)
    if (status.errCode !== 200) {
      // 返回到login页面
      return res.render('login', {
        codeData: api.getCode(123),
        data: {
        	data,
        	status
        }
      })
    }
    // 存储session
    req.session.uid = {
      token: data.token,
      id: data._id
    }
    res.cookie('token', data.token, { maxAge: 3600000 * 24 * 3, httpOnly: true })
    Status.setValues({
    	ifCheckRedirect: true,
    	userId: data._id
    })
    // 登录成功，重定向到首页
    res.redirect('/')
	}

	async postSuccess(req, res) {
		const { data, status } = await api.register(req.body)
    console.log('data:', data)
    if (status.errCode !== 200) {
      return res.render('register', {
        data: data
      })
    }
    // 注册成功，存储token
    req.session.uid = {
      token: data.token,
      id: data._id
    }
    res.cookie('token', data.token, { maxAge: 3600000 * 24 * 3, httpOnly: true })
    // 发送邮箱
    sendMsg(data.email)
    res.render('registerSuccess', {
    	data,
      status,
      userId: Status.get('userId')
    })
	}
  
  getLogout(req, res) {
    Status.set('userId', '')
    req.session.uid = ''
    req.session.token = ''
    res.redirect('/')
  }
	
}

export default new User()
