var path = require('path')
var webpack = require('webpack')
var ROOT_PATH = path.resolve(__dirname)
var APP_PATH = path.resolve(ROOT_PATH, 'src')
var BUILD_PATH = path.resolve(__dirname, 'dist')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		app: path.resolve(APP_PATH, 'main.js'),
		vendors: ['./src/js/fastclick.js', './src/js/exif.js']
	},
	output: {
		path: BUILD_PATH,
		publicPath: './dist/',
		filename: 'bundle.js'
	},
	devServer: {
		historyApiFallback: true,
		hot: true,
		inline: true,
	},
	module: {
		loaders: [{
			test: /\.scss$/,
			//loader:ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!sass-loader' }),
			loader: 'style-loader!css-loader!sass-loader',
			include: APP_PATH
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			include: APP_PATH,
			query: {
				presets: ['es2015']
			}
		}, {
			test: /\.(png|jpg)$/,
			loader: 'file-loader'
		}],
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js' }),
		//new ExtractTextPlugin('./styles.css'),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
	],
	resolve: {
		//自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
		extensions: ['.js', '.scss'],
		//模块别名定义，方便后续直接引用别名，无须多写长长的地址
		alias: {
			'opts': './../src/js/opts.js'
		}
	},

	devtool: '#eval-source-map',
}
if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map'
		// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([

		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}
