const nodemailer = require('nodemailer')
const config = require(global.serverConfig.CONFIG)

function send(toEmail){
  // create reusable transporter object using the default SMTP transport
  const params = {
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    auth: {
      user: config.email.user,
      pass: config.email.emailPwd
    }
  }

  let transporter = nodemailer.createTransport(params);
  if (toEmail) {
    config.email.emailTo.push(toEmail)
  }
  // setup email data with unicode symbols
  let mailOptions = {
    from: config.email.user, // sender address
    to: config.email.emailTo, // list of receivers
    subject: 'canvas-Image-processing，注册成功',
    html: '感谢您的注册使用!'
  }
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
    // 执行回调
    // call && call()
  })
}

module.exports = send
