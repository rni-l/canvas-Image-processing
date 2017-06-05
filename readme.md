# 这是一个H5拍照，编辑图片，生成图片的DEMO

> 这个demo，主要是记录我在移动端拍照，处理图片一些功能的总结。

这里是[demo](https://yiiouo.github.io/canvas-Image-processing/)链接，请用手机或者浏览器的手机模式观看。

## 主要功能

* 上传图片
* 改变图片展示的方式（居中，填充，拉伸）
* 画布的涂鸦功能
* 撤销涂鸦功能
* 图片滤镜效果
* 生成图片功能
* 离线功能

## 处理过程

使用了webpack进行文件处理，exif.js解决ios图片旋转问题，fastclick.js处理移动端点击延迟问题。

### 使用流程

1. 用户拍照或者上传图片
2. 在canvas显示出来，用户可以在canvas进行涂鸦，旋转笔触的粗细，颜色[（自己写了个颜色选择器）](https://github.com/yiiouo/canvas-colorPicker)等。
3. 可以选择滤镜效果，这里使用了[一个滤镜插件](https://github.com/arahaya/ImageFilters.js)。这个滤镜插件有十几种选择，每种会有不同的参数。
4. 最后就是生成图片，用户可以保存下来的。

如果要传给后台的话，只需要把图片转成blod，再用formData上传就行。

## 文件结构

    |--dist                                   //项目打包后的文件
    |--src                                    //项目开发的文件
       |--css                                 //css文件
       |--images                              //图片
       |--plugins                             //插件                     
          |--colorPicker.js                   //颜色选择器
          |--exif.js                          //读取图片元数据
          |--imagefilters.js                  //canvas滤镜效果
          |--fastClick.js                     //解决移动端点击延迟的插件
       |--js
          |--draw.js                          //画布涂鸦功能
          |--filter.js                        //滤镜效果
          |--lineData.js                      //选择笔触属性
          |--photograph.js                    //图片上传，修改，生成
          |--opts.js                          //参数文件
       |--main.js                             //入口文件
    |--.babelrc                               //babel配置文件
    |--.gitignore                             //github配置文件
    |--.postcssrc.js                          //css自动补写兼容性配置文件
    |--index.html                             //入口html文件
	|--test.mainfest                          //离线存储配置文件
    |--package.json                           //包管理文件
    |--README.md                              //开发文档
