function output(params) {
  let format = {
    status: {
      errCode: 200
      // message: '' // 如果非200，显示message
    },
    data: {}
  }
  if (params.data) {
    format.data = params.data
  }
  if (params.msg) {
    format.status.message = params.msg
    format.status.errCode = params.code
  }
  return format
}

module.exports = output
