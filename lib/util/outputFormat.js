/**
 * 格式化输出内容  
 * @params data
 * @params msg
 * @params code
 * @returns data
 * @returns status
 * @returns status.message
 * @returns status.errCode
 */
function output(params) {
  let format = {
    status: {
      errCode: 200
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

export default output
