import nodemailer from 'nodemailer'
import config from './../../config.js'

function send(data, opts) {
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

  const receivers = config.email.emailTo.map(v => v)

  let transporter = nodemailer.createTransport(params)
  if (data.email) {
    receivers.push(data.email)
  }
  // setup email data with unicode symbols
  let mailOptions = {
    from: config.email.user, // sender address
    to: receivers, // list of receivers
    subject: opts.subject,
    html: opts.html
  }
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
    // 执行回调
    // call && call()
  })
}

export default send
