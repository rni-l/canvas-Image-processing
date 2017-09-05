import regexp from './../../utils/regexp.js'

$(function() {
  // 缓存对象
  const $email = $('.form-layout-input-email'),
    $pwd = $('.form-layout-input-pwd'),
    $form = $('.form-wrap')
  // 检验登录
  $('.form-submit').on('touchend', () => {
    let msg = ''
    const emailVal = $email.val(),
      pwdVal = $pwd.val()
    if (!emailVal) {
      msg = '请输入邮箱'
    }
    if (!emailVal & !regexp.email.test(emailVal)) {
      msg = '请输入正确的邮箱格式'
    }
    if (!msg && !pwdVal) {
      msg = '请输入密码'
    }
    if (!msg && !regexp.pwd.test(pwdVal)) {
      msg = '请输入正确的密码格式'
    }
    if (msg) {
      console.log('form msg', msg)
      return
    }
    console.log($form)
    // 提交表单
    $form.submit()
  })
})