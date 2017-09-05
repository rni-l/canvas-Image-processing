import regexp from './../../utils/regexp.js'

$(function() {
  // 缓存对象
  const $user = $('.form-layout-input-user'),
    $email = $('.form-layout-input-email'),
    $pwd = $('.form-layout-input-pwd'),
    $checkPwd = $('.form-layout-input-checkPwd'),
    $form = $('.form-wrap')
  // 检验登录
  $('.form-submit').on('touchend', () => {
    let msg = ''
    const emailVal = $email.val(),
      pwdVal = $pwd.val()
    if (!$user.val()) {
      msg = '请输入用户名'
    }
    if (!msg && !emailVal) {
      msg = '请输入邮箱'
    }
    if (!msg & !regexp.email.test(emailVal)) {
      msg = '请输入正确的邮箱格式'
    }
    if (!msg && !pwdVal) {
      msg = '请输入密码'
    }
    if (!msg && !regexp.pwd.test(pwdVal)) {
      msg = '请输入正确的密码格式'
    }
    if (!msg && pwdVal !== $checkPwd.val()){
      msg = '密码和确认密码不同'
    }
    if (msg) {
      console.log('form msg', msg)
      return
    }
    // 提交表单
    $form.submit()
  })
})