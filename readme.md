# 这是一个H5拍照，编辑图片，生成图片的DEMO

> 这个demo，主要是记录我在移动端拍照，处理图片一些功能的总结。现在开始进行二次开发，添加个人用户和相册功能。

这里是[demo](http://canvas-image-processing.rni-l.com)链接，移动端的，欢迎注册使用。 

## 如何进行开发

注意，如果要在本地运行的话，要配置好 `node-canvas` ，不然会运行不了。这里提供了一个没有使用 `node-canvas` 的旧版本， `clone` Tags v1.1版本运行就好

    1. clone git@github.com:yiiouo/canvas-Image-processing.git
    2. npm i // cnpm i
    3. gulp build
    4. cp _config.js config.js
    5. `npm run start` (开启node服务)
    6. 另开一个窗口，`npm run dev` (进行文件的监听)

## 主要功能

### 1.3版本（挖坑中）

* 修改页面样式，添加图标，美化页面
* 弃用验证码功能，改用发送邮件进行验证（node-canvas 配置太麻烦了）
* 使用 mocha、chai 编写单元测试
* ~~规范好后台的api，编写一个api文档~~

### 1.2版本

* `windows` 和 `centos` 环境下，配置 `node-canvas` -- 完成
* 验证码功能 -- 完成
* 配置到 `centos` -- 完成

### 1.1版本

* 增加 `es-lint` ，优化代码结构 -- 完成
* 修改和美化版面 -- 完成
* 使用 `gulp` 替换 `webpack` ( `gulp` 进行多页面搭建相对容易点) -- 完成
* 增加用户登录注册功能，可以有自己的小相册 -- 完成
* 使用 `mongodb` 数据库，使用 `mongoose` 进行数据操作 -- 完成
* 添加邮箱功能，注册成功会发送邮件给用户 -- 完成

### 1.0版本

* 上传图片 -- 完成
* 改变图片展示的方式（居中，填充，拉伸）-- 完成
* 画布的涂鸦功能 -- 完成
* 撤销涂鸦功能 -- 完成
* 图片滤镜效果 -- 完成
* 生成图片功能 -- 完成
* 离线功能 -- 完成

## 使用流程

1. 用户注册登录
2. 用户拍照或者上传图片
3. 用户可以在canvas进行涂鸦，选择笔触的粗细，颜色[（自己写了个颜色选择器）](https://github.com/yiiouo/canvas-colorPicker)等
4. 可以选择滤镜效果，这里使用了[一个滤镜插件](https://github.com/arahaya/ImageFilters.js)。这个滤镜插件有十几种选择，每种会有不同的参数
5. 最后就是生成图片，用户可以保存到本地
6. 点击相册，会显示用户生成过的图片

