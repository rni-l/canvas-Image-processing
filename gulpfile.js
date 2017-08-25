const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const sourcemaps = require('gulp-sourcemaps')
const plumber = require('gulp-plumber')
const browserSync = require('browser-sync').create()
const babel = require('gulp-babel')
const notify = require('gulp-notify')
const babelify = require('babelify')
const browserify = require("browserify")
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')

// eslint 检测
gulp.task('lint', function() {
  gulp.src(['./src/js/*.js', './src/js/*/*.js'])
    .pipe(eslint({useEslintrc: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

// js
gulp.task('browserify', ['lint'], ()=> {
  browserify({
    entries: ['./src/js/index/main.js'],
    debug: true, // 告知Browserify在运行同时生成内联sourcemap用于调试
  })
  .transform("babelify", {presets: ["es2015"]})
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true})) // 从 browserify 文件载入 map
  .pipe(sourcemaps.write('.')) // 写入 .map 文件
  .pipe(gulp.dest('./public/dist/js/'))
  .pipe(browserSync.reload({stream: true}))
  .pipe(notify({ message: 'browserify task complete' }))
})
// gulp.task('js', ['lint'], function() {
//   gulp.src(['./src/js/*.js', './src/js/*/*.js'])
//     .pipe(sourcemaps.init())
//     .pipe(babel({
//       presets: ["es2015"]
//     }))
//     .pipe(plumber())
//     .pipe(uglify())
//     .pipe(sourcemaps.write('.'))
//     .pipe(gulp.dest('./public/dist/js/'))
//     .pipe(browserSync.reload({stream: true}))
//     .pipe(notify('JS Task Complete!'))
// })

// 编辑 sass
gulp.task('sass', function() {
  gulp.src(['./src/css/*.scss', './src/css/*/*.scss'])
    .pipe(sass())
    .pipe(plumber())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'last 3 Explorer versions']
    }))
    .pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(gulp.dest('./public/dist/css'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify('CSS Task Complete!'))
})

// 压缩图片
gulp.task('images', function() {
  gulp.src(['./src/images/*', './src/images/*/*'])
    .pipe(imagemin())
    .pipe(gulp.dest('./public/images'))
})

// 监视文件变动
gulp.task('watch', function() {
  gulp.watch(['./src/js/*.js', './src/js/*/*.js'], ['browserify'])
  gulp.watch(['./src/css/*.scss', './src/css/*/*.scss'], ['sass'])
  gulp.watch(['./src/images/*', './src/images/*/*'], ['imagemin'])
})

gulp.task('default', ['browserify', 'sass', 'images'])

gulp.task('build', ['browserify', 'sass', 'images'])
