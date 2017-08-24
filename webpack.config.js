var path = require('path')
var webpack = require('webpack')
var ROOT_PATH = path.resolve(__dirname)
var APP_PATH = path.resolve(ROOT_PATH, 'src')
var BUILD_PATH = path.resolve(__dirname, 'dist')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

// 定义多页面配置
var pageConfig = [{
  name: 'index',
}] 
//配置入口文件，有几个写几个
var _entry = {}
pageConfig.forEach(function(v){
  _entry[v.name]= './src/js/page/' + v.name+ '.js'
})

module.exports = {
  entry: _entry,
  output: { 
    path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
    publicPath: './',                //模板、样式、脚本、图片等资源对应的server上的路径
    filename: 'js/[name].js',            //每个页面对应的主js的生成配置
    chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
  },
  module: {
    rules: [{
      test: /\.scss$/,
      include: APP_PATH,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader','sass-loader']
      })
    }, {
      test: /\.js$/,
      loader: 'eslint-loader',
      include: APP_PATH,
      enforce: 'pre',
      options: {
        formatter: require('eslint-friendly-formatter')
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: APP_PATH,
      query: {
        presets: ['es2015']
      }
    }, {
      test: /\.html$/,
      include: APP_PATH,
      use: [{
        loader : 'html-loader',
        options: {
          minimize: true,
          caseSensitive: true
        }
      }]
    }, {
      //文件加载器，处理文件静态资源
      test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader?name=./fonts/[name].[ext]'
    }, {
      //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
      //如下配置，将小于8192byte的图片转成base64码
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader?limit=8192&name=./img/[hash].[ext]'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({ //加载jq
      $: 'jquery'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: ['index'], //提取哪些模块共有的部分
      minChunks: 3 // 提取至少3个模块共有的部分
    }),
    new ExtractTextPlugin('css/[name].css'), //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    new webpack.HotModuleReplacementPlugin(), //热加载
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ],
  resolve: {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['.js', '.scss'],
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    alias: {
      'opts': './../src/js/opts.js',
      '@': path.join(__dirname, '..', 'src')
    }
  },
  devServer: {
    contentBase: './',
    host: 'localhost',
    port: 9090, //默认8080
    inline: true, //可以监控js变化
    hot: true, //热启动
  },
  devtool: '#eval-source-map'
}

//HtmlWebpackPlugin，模板生成相关的配置，每个对于一个页面的配置，有几个写几个
pageConfig.forEach(function(v){
  var _name = v.name
  var _tmp = new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      // favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
      filename: './view/'+ _name +'.html', //生成的html存放路径，相对于path
      template: './src/view/'+ _name +'.html', //html模板路径
      inject: true, //js插入的位置，true/'head'/'body'/false
      hash: true, //为静态资源生成hash值
      chunks: ['vendors', _name],//需要引入的chunk，不配置就会引入所有页面的资源
      minify: { //压缩HTML文件    
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    })
  module.exports.plugins.push(_tmp)
})


if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'

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
