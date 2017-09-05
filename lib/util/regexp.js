const regexp = {
  userName: /^[a-zA-Z0-9]$/,
  phone: /^1[34578]\d{9}$/,
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
  pwd: /^[A-Z]([a-z0-9_-]){7,29}$/, // 首字母大写，至少8位，最多30位
  code: /^[\d\w]{4}$/, //验证码，任意数字加字母，4位
}

module.exports = regexp
