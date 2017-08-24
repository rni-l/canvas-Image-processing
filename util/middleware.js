var proxy = require('http-proxy-middleware')
var config = require('../config')

var options = {
  target: config.serverUrl,
  changeOrigin: true,
  ws: true,
  onProxyReq(proxyReq, req, res) {
    if (req.method == 'POST' && req.body && req.headers['content-type']) {
      if (!req.headers['content-type'].startsWith('multipart/form-data')) {
        var body = req.body
        body = Object.keys(body).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
        }).join('&')
        proxyReq.setHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        proxyReq.setHeader('content-length', body.length)
        proxyReq.setHeader('Accept', 'application/json')
        proxyReq.write(body)
        proxyReq.end()
      }
    }
  },
  onProxyRes(proxyRes, req, res) {
    if (proxyRes.headers['set-cookie'] instanceof Array && proxyRes.headers['set-cookie'].length > 0) {
      // 取出 JAVA SESSION 更改 PATH
      // 'set-cookie': [ 'SESSION=d5a2d288-61b6-453b-935d-8e1cd4b9ede0; Path=/newweekly/; HttpOnly' ]
      // 'set-cookie': [ 'SESSION=d5a2d288-61b6-453b-935d-8e1cd4b9ede0; Path=/; HttpOnly' ]
      const [ session, value ] = proxyRes.headers['set-cookie'][0].split(';')[0].split('=')
      proxyRes.headers['set-cookie'] = [`${session}=${value}; Path=/; HttpOnly`]
    }
  }
}

// 中间件 API 转发
var apiProxy = proxy(options)

module.exports = apiProxy
