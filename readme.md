# 这是一个H5拍照，编辑图片，生成图片的DEMO

> 这个demo，主要是记录我在移动端拍照，处理图片一些功能的总结。现在开始进行二次开发，添加个人用户和相册功能。

这里是[demo](https://www.rni-l.com/canvas-Image-processing/)链接，请用手机或者浏览器的手机模式观看。

## 如何进行开发

* `clone`项目
* `cnpm i`
* `gulp build` (先生成静态文件)
* 复制`config.js-explame`文件为`config.js`，并修改配置信息(修改端口号就好了)
* `npm run watch` (进行文件的监听)
* 另开一个窗口，`npm run start` (开启node服务)

## 主要功能

### 1.1版本（开发中）

* 增加es-lint，优化代码结构 -- 完成
* 修改和美化版面 -- 完成
* 使用gulp替换webpack(gulp进行多页面搭建相对容易点) -- 完成
* 增加用户登录注册功能，可以有自己的小相册
* 使用Lowdb进行数据存储
* 添加邮箱功能

### 1.0版本

* 上传图片  -- 完成
* 改变图片展示的方式（居中，填充，拉伸）  -- 完成
* 画布的涂鸦功能  -- 完成
* 撤销涂鸦功能  -- 完成
* 图片滤镜效果  -- 完成
* 生成图片功能  -- 完成
* 离线功能  -- 完成

## 解决的问题

1. 使用了webpack进行文件处理
2. exif.js解决ios图片旋转问题
3. 兼容图片处理问题，ios和android端
4. fastclick.js处理移动端点击延迟问题。
5. 使用gulp配置多页面开发


## 使用流程

1. 用户拍照或者上传图片
2. 在canvas显示出来，用户可以在canvas进行涂鸦，旋转笔触的粗细，颜色[（自己写了个颜色选择器）](https://github.com/yiiouo/canvas-colorPicker)等。
3. 可以选择滤镜效果，这里使用了[一个滤镜插件](https://github.com/arahaya/ImageFilters.js)。这个滤镜插件有十几种选择，每种会有不同的参数。
4. 最后就是生成图片，用户可以保存下来的。

如果要传给后台的话，只需要把图片转成blod，再用formData上传就行。
