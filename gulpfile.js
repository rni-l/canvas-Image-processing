// 插件
const gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  eslint = require('gulp-eslint'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  sourcemaps = require('gulp-sourcemaps'),
  plumber = require('gulp-plumber'),
  babel = require('gulp-babel'),
  notify = require('gulp-notify'),
  babelify = require('babelify')

// browserify
const browserify = require("browserify"),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer')

// 配置文件
const Config = require('./config.js')

// 路径
const jsPath = './src/js'
  cssPath = './src/css',
  imagePath = './src/images'

// 自动刷新
const browserSync = require('browser-sync').create()
// 配置代理
gulp.task('server', function() {
  // 初始化
  browserSync.init({
    proxy: 'localhost:' + Config.port, // 开启代理
    browser: "chrome", // 打开浏览器
    logLevel: "debug"
  })
  // watch,当文件变化后，自动生成相应的文件
  gulp.watch([`${jsPath}/*.js`, `${jsPath}/*/*.js`], ['js'])
  gulp.watch([`${cssPath}/*.scss`, `${cssPath}/*/*.scss`], ['sass'])
  gulp.watch([`${imagePath}/*`, `${imagePath}/*/*`], ['imagemin'])
  // 重新加载
  gulp.watch("*.html").on('change', browserSync.reload);
})

// eslint 检测
gulp.task('lint', function() {
  gulp.src([`${jsPath}/*.js`, `${jsPath}/*/*.js`])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

// js
gulp.task('js', ['lint'], ()=> {
  browserify({
    entries: [`${jsPath}index/main.js`], // 入口文件
    debug: true, // 告知Browserify在运行同时生成内联sourcemap用于调试
  })
  .transform("babelify", {presets: ["es2015", "stage-0"]}) // 转换es6代码，es7
  .bundle() // 合并打包
  .pipe(source('bundle.js')) // 将常规流转换为包含Stream的vinyl对象，并且重命名
  .pipe(buffer()) // 将vinyl对象内容中的Stream转换为Buffer
  .pipe(sourcemaps.init({loadMaps: true})) // 从 browserify 文件载入 map
  .pipe(sourcemaps.write('.')) // 写入 .map 文件
  .pipe(gulp.dest('./public/dist/js/')) // 输出打包
  .pipe(browserSync.reload({stream: true})) // browser-sync自动刷新
  .pipe(notify({ message: 'browserify task complete' })) // 告知完成任务
})

// sass
gulp.task('sass', function() {
  gulp.src([`${cssPath}/*.scss`, `${cssPath}/*/*.scss`])
    .pipe(sass())
    .pipe(plumber()) // 报错不会终止进程
    .pipe(autoprefixer({ 
      browsers: ['last 2 versions', 'last 3 Explorer versions']
    })) // 自动补全前缀
    .pipe(cleanCSS({compatibility: 'ie9'})) // 压缩文件
    .pipe(gulp.dest('./public/dist/css'))
    .pipe(browserSync.stream())
    .pipe(notify('CSS Task Complete!'))
})

// 压缩图片
gulp.task('images', function() {
  gulp.src([`${imagePath}/*`, `${imagePath}/*/*`])
    // 压缩图片
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest('./public/images'))
})

// 监视文件变动
gulp.task('watch', ['server'])

gulp.task('build', ['js', 'sass', 'images'])
