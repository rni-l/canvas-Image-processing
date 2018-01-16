import api from './../../model/user.js'
import sendMsg from './../../util/sendMsg.js'
import Common from './../common.js'
import Status from './../status.js'


class User extends Common {
  constructor() {
    super()
  }

  getLogin(req, res) {
    if (!super.checkRedict(res, '/', true)) {
      return false
    }
    res.render('login', {
      codeData: api.getCode(123)
    })
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
    const {
      data,
      status
    } = await api.login(req.body)
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
    res.cookie('token', data.token, {
      maxAge: 3600000 * 24 * 3,
      httpOnly: true
    })
    Status.setValues({
      ifCheckRedirect: true,
      userId: data._id
    })
    // 登录成功，重定向到首页
    res.redirect('/')
  }

  async postSuccess(req, res) {
    const {
      data,
      status
    } = await api.register(req.body)
    console.log('data:', data)
    if (status.errCode !== 200) {
      return res.render('register', {
        data
      })
    }
    // 注册成功，存储token
    req.session.uid = {
      token: data.token,
      id: data._id
    }
    res.cookie('token', data.token, {
      maxAge: 3600000 * 24 * 3,
      httpOnly: true
    })
    // 发送邮箱
    const emailData = await sendMsg(data, {
      subject: `canvas-Image-processing，感谢 ${data.email} 注册成功`,
      html: '感谢您的注册使用!'
    })
    console.log(emailData)
    if (emailData.status.errCode === 200) {
      res.render('registerSuccess', {
        data,
        status,
        userId: data._id
      })
    } else {
      res.render('register', {
        data: emailData
      })
    }
  }

  getLogout(req, res) {
    Status.set('userId', '')
    req.session.uid = ''
    req.session.token = ''
    res.redirect('/')
  }

  postForgetPwd(req, res) {
    let code = ''
    // 向邮箱发送验证码
    sendMsg(data, {
      subject: 'canvas-Image-processing, 修改密码验证码',
      html: `验证码：${code}`
    })
  }

}

export default new User()
