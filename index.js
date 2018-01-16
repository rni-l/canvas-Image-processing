require('babel-core/register')
require("babel-core").transform()

const serverConfig = require('./lib/server-config.js')
global.serverConfig = serverConfig

require('./lib/app.js')
