// 配置公共路径等
const path = require('path')

const config = {
	ROUTES: path.join(__dirname, 'lib', 'routes'),
	UTILS: path.join(__dirname, 'lib', 'util'),
	MODEL: path.join(__dirname, 'lib', 'routerrouter'),
	CONFIG: path.join(__dirname, 'config.js'),
	STATIC: path.join(__dirname, 'static'),
	CTL: path.join(__dirname, 'controllers'),
	// 域名
	basePath: ''
}

export default config
