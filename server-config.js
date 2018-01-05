// 配置公共路径等
const path = require('path')

const config = {
	ROUTES: path.join(__dirname, 'lib', 'routes'),
	UTILS: path.join(__dirname, 'lib', 'util'),
	DB: path.join(__dirname, 'lib', 'db'),
	CONFIG: path.join(__dirname, 'config.js'),
	STATIC: path.join(__dirname, 'static'),
	// 域名
	basePath: ''
}

module.exports = config
