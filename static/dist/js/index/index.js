(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _opts = require('./opts');

var _opts2 = _interopRequireDefault(_opts);

var _lineData = require('./lineData');

var _lineData2 = _interopRequireDefault(_lineData);

var _filter = require('./filter');

var _filter2 = _interopRequireDefault(_filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 画布功能
var arrX = [],
    // 坐标x
arrY = [],
    // 坐标y
arrN = [],
    // 笔触点击，移动，放开总次数
arrColor = [],
    // 线条颜色
arrWidth = [],
    // 线条粗细
arrNumber = [],
    // 笔触点击次数
c_left = _opts2.default.oCan.offsetLeft,
    // canvas的Left,top
c_top = _opts2.default.oCan.offsetTop,
    oCan = _opts2.default.oCan,
    ctx = _opts2.default.ctx;
var lastX = -1,
    lastY = -1;

function addData(data) {
  arrX.push(data.x);
  arrY.push(data.y);
  arrN.push(data.n);
  arrColor.push(data.color);
  arrWidth.push(data.width);
}

// 绘制
function draw(len) {
  ctx.beginPath();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (var i = 1; i < len; i++) {
    // 线条颜色，粗细
    ctx.lineWidth = arrWidth[i];
    ctx.strokeStyle = arrColor[i];
    lastX = arrX[i];
    lastY = arrY[i];
    if (arrN[i] === 2) {
      // 开头，保存当前的桟
      ctx.beginPath();
      ctx.save();
      ctx.moveTo(lastX, lastY);
    } else {
      ctx.lineTo(lastX, lastY);
    }
    // 绘制线条，释放桟，关闭路线
    ctx.stroke();
    ctx.restore();
  }
  ctx.closePath();
}

// 重新绘制笔触
function cleanDraw() {
  draw(arrN.length);
}

// 移动
function move(e) {
  e.preventDefault();
  var t = e.touches[0];
  // 将计算后的xy位置，添加到数组里
  arrX.push(Math.floor(t.pageX - c_left));
  arrY.push(Math.floor(t.pageY - c_top));
  arrN.push(1);
  arrWidth.push(_lineData2.default.w);
  arrColor.push(_lineData2.default.color);
  // 绘制
  draw(arrX.length);
}
// 点击
function down(e) {
  ctx.clearRect(0, 0, _opts2.default.canvasW, _opts2.default.cavasH);
  if (!_opts2.default.isDraw) {
    return false;
  }
  // 重新上传图片，笔触清零
  if (_opts2.default.isNewPic) {
    _opts2.default.isNewPic = false;
    // 笔触记录清零
    arrX.length = 0;
    arrY.length = 0;
    arrN.length = 0;
    arrColor.length = 0;
    arrWidth.length = 0;
  }
  var t = e.touches[0];
  // 添加到数组，存储
  addData({
    x: t.pageX - c_left,
    y: t.pageY - c_top,
    n: 2,
    color: _lineData2.default.color,
    width: _lineData2.default.w
  });
  // 记录操作
  arrNumber.push(arrN.length);
  oCan.addEventListener('touchmove', move, false);
}
// 放开
function up(e) {
  if (!_opts2.default.isDraw) {
    return false;
  }
  var t = e.changedTouches[0];
  // 添加到数组，存储
  addData({
    x: t.pageX - c_left,
    y: t.pageY - c_top,
    n: 1,
    color: _lineData2.default.color,
    width: _lineData2.default.w
  });
  // 取消事件
  oCan.removeEventListener('touchmove', move, false);
}

// 撤销
function revoke() {
  // 如果路线少于0，不会绘制
  if (!arrNumber[arrNumber.length - 1]) {
    return false;
  }
  // 获取最后一次笔触的次数
  var len = arrNumber[arrNumber.length - 1];
  arrNumber.pop();
  // 清除对应数量的操作
  arrX.length = len;
  arrY.length = len;
  arrN.length = len;
  arrColor.length = len;
  arrWidth.length = len;
  ctx.clearRect(0, 0, _opts2.default.canvasW, _opts2.default.canvasH);
  var data = _opts2.default.data;
  /*
    重绘流程：
    重新绘制图片 => 渲染滤镜 => 渲染笔触
  */
  ctx.drawImage(data.img, data.imgPos.x, data.imgPos.y, data.imgPos.w, data.imgPos.h);
  (0, _filter2.default)();
  draw(len);
}

// 添加撤销事件撤销事件
_opts2.default.oRevoke.addEventListener('touchstart', revoke);

oCan.addEventListener('touchstart', down, false);
oCan.addEventListener('touchend', up, false);

// 清除笔画功能
exports.default = cleanDraw;

},{"./filter":2,"./lineData":3,"./opts":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _opts = require('./opts');

var _opts2 = _interopRequireDefault(_opts);

var _draw = require('./draw');

var _draw2 = _interopRequireDefault(_draw);

var _imagefilters = require('./../../plugins/imagefilters');

var _imagefilters2 = _interopRequireDefault(_imagefilters);

var _filterData = require('./../../utils/filterData');

var _filterData2 = _interopRequireDefault(_filterData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// 缓存滤镜信息数据
var filterData = {
  filter: []
};
var oFilterBox = document.getElementById('filterBox'),
    // 滤镜盒子
oFilterSelect = document.getElementById('filterSelect'),
    // 选择滤镜select
oContent = document.querySelector('#filterBox .content');
var typeName = '',
    // 当前滤镜效果的名字
dataList = []; // 当前滤镜效果，子选项值

/*
  滤镜流程：
  1. 选择好滤镜效果和滤镜的值
  2. 获取渲染滤镜效果的数据
  3. 再渲染到主屏
  4. 绘制笔触效果
*/

/*
 *设置滤镜
 *参数
 *type: 滤镜类型名字
 *imageData: 图片数据
*/
function setFilter() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : typeName;
  var imgData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _opts2.default.data.imageData;

  if (!type) {
    return false;
  }
  var ctx = _opts2.default.ctx;
  /*
   *生成滤镜效果
   *参数
   *type: 选择的滤镜效果名字
   *[0]: 图片数据
   *[1]: 滤镜效果的各个数值
  */
  var filtered = _imagefilters2.default[type].apply(_imagefilters2.default, [imgData].concat(_toConsumableArray(filterData.filter))),
      pos = _opts2.default.data.imgPos;
  ctx.clearRect(pos.x, pos.y, pos.w, pos.h);
  ctx.putImageData(filtered, pos.x, pos.y);
  filtered = null;
  pos = null;
}

// 更新滤镜选项
function updateFilter() {
  // 清空
  filterData.filter.length = 0;
  // 将当前input的value值存入filter里面
  dataList.forEach(function (v) {
    filterData.filter.push(v.value);
  });
  // 设置
  setFilter(typeName);
  // 绘制笔触
  (0, _draw2.default)();
}

// 将数组格式化成html
function format(data) {
  var str = '';
  typeName = data.name;
  data.chooseValue.forEach(function (v, i) {
    var _range = data.range;
    str += '<div class=\'list\'>\n      <span>' + v + '</span><input type=\'range\' max=\'' + _range[i].max + '\' min=\'' + _range[i].min + '\' value=\'' + _range[i].first + '\' id=\'' + v + '\' /><span>' + _range[i].first + '</span>\n    </div>';
  });
  return str;
}

// box change事件
oFilterBox.addEventListener('change', function (e) {
  var tar = e.target;
  // 事件委托，获取到当前对象
  if (tar.getAttribute('type') === 'range') {
    // 当range值更改后，渲染滤镜
    updateFilter();
  }
}, false);

// box input事件
oFilterBox.addEventListener('input', function (e) {
  var tar = e.target;
  // 事件委托，获取到当前对象
  if (tar.getAttribute('type') === 'range') {
    // 拖动滚动条时，显示当前的value值
    tar.nextSibling.innerHTML = tar.value;
  }
});

oFilterBox.addEventListener('touchstart', function () {
  _opts2.default.isStopPrevent = false;
}, false);

// 选择滤镜效果
oFilterSelect.addEventListener('change', function () {
  var _this = this;

  _opts2.default.isStopPrevent = true;
  // 获取选择的滤镜效果数据
  var arr = _filterData2.default.filterValue.filter(function (v) {
    return v.name === _this.value;
  });
  if (!arr) {
    return false;
  }
  // 格式化内容，生成range组件
  oContent.innerHTML = format(arr[0]);
  // 获取input对象数组
  var aInput = [].concat(_toConsumableArray(document.querySelectorAll('#filterBox .content input')));
  // 缓存input对象
  dataList = aInput.filter(function (v) {
    return v.nodeName === 'INPUT';
  });
  updateFilter();
}, false);

// 渲染当前选择好的滤镜效果
exports.default = setFilter;

},{"./../../plugins/imagefilters":11,"./../../utils/filterData":12,"./draw":1,"./opts":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _opts = require('./opts');

var _opts2 = _interopRequireDefault(_opts);

var _colorPicker = require('./../../plugins/colorPicker');

var _colorPicker2 = _interopRequireDefault(_colorPicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var output = { color: '#000000', w: 5
  // 画布的线的，数据（）
};document.addEventListener('DOMContentLoaded', function () {
  var oP = document.querySelector('.rangeWrap p');
  var oColorBtn = document.querySelector('.colorBtn'),
      oColorBox = document.querySelector('.colorPickerbox');
  var colorOnoff = true;

  // 模拟range
  var oRange = document.querySelector('.rangeBtn'),
      oRangePar = document.querySelector('.rangeLine'),
      r_opts = {
    h: oRangePar.offsetHeight,
    t: oRangePar.offsetTop,
    rH: oRange.offsetHeight,
    max: 10,
    min: 1,
    size: 1,
    num: 0
  };

  function rangeMove(e) {
    var t = e.touches[0];
    var my = t.clientY - r_opts.t;
    if (my <= 0) {
      my = 0;
    } else if (my >= r_opts.h) {
      my = r_opts.h;
    }

    _opts2.default.transform(oRange, 'translateY(' + my + 'px)');
    r_opts.my = my;
    // 判断当前位置，属于几
    var value = Math.floor(my / r_opts.num);
    output.w = value;
    oP.innerHTML = '宽度：' + value;
  }

  // 颜色选择器
  var colorPicker = new _colorPicker2.default({
    oBox: oColorBox,
    oBtnWrap: document.querySelector('.btnWrap'),
    oCan: document.querySelector('#colorPicker'),
    width: 200,
    height: 200,
    callback: function callback(color) {
      output.color = color;
      oColorBtn.style.background = color;
    }
  });

  colorPicker.init();

  oColorBtn.addEventListener('touchstart', function () {
    _opts2.default.transform(oColorBox, 'translateX(' + (colorOnoff ? 0 : -1000) + 'px)');
    colorOnoff = !colorOnoff;
  }, false);

  oRange.addEventListener('touchstart', function (e) {
    e.stopPropagation();
    var t = e.touches[0];
    r_opts.fx = t.clientX;
    r_opts.fy = t.clientY;

    r_opts.h = oRangePar.offsetHeight;
    r_opts.t = oRangePar.offsetTop;
    r_opts.rH = oRange.offsetHeight;
    // 修正高度
    r_opts.h -= r_opts.rH;
    // 份数
    r_opts.num = r_opts.h / r_opts.max;
    // 添加移动事件
    oRange.addEventListener('touchmove', rangeMove, false);
  }, false);

  oRange.addEventListener('touchend', function () {
    // 移除移动事件
    oRange.removeEventListener('touchmove', rangeMove, false);
  }, false);
}, false);

exports.default = output;

},{"./../../plugins/colorPicker":8,"./opts":5}],4:[function(require,module,exports){
'use strict';

var _fastclick = require('./../../plugins/fastclick');

var _fastclick2 = _interopRequireDefault(_fastclick);

var _opts2 = require('./opts');

var _opts3 = _interopRequireDefault(_opts2);

require('./photograph');

require('./draw');

require('./lineData');

require('./filter');

require('./selectImgSize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 添加fastclick
document.addEventListener('DOMContentLoaded', function () {
  _fastclick2.default.attach(document.body);
}, false); // 入口文件


document.querySelector('.main').addEventListener('touchmove', function (e) {
  if (_opts3.default.isStopPrevent) {
    e.preventDefault();
  }
}, false);

var oFilterBox = document.getElementById('filterBox');

// 滤镜框显示隐藏
document.getElementById('filterBtn').addEventListener('touchstart', function () {
  oFilterBox.style.display = 'block';
}, false);

document.querySelector('#filterBox .close').addEventListener('touchstart', function () {
  oFilterBox.style.display = 'none';
}, false);

var oTop = document.querySelector('.main_top');

_opts3.default.canvasW = oTop.offsetWidth;
_opts3.default.canvasH = oTop.offsetHeight;

// 初始化，定义画布宽高
var oCan = _opts3.default.oCan;
oCan.width = _opts3.default.canvasW;
oCan.height = _opts3.default.canvasH;

},{"./../../plugins/fastclick":10,"./draw":1,"./filter":2,"./lineData":3,"./opts":5,"./photograph":6,"./selectImgSize":7}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// 将对象存储在内存中
var oCan = document.getElementById('canvas'),
    // 获取画布
ctx = oCan.getContext('2d'),
    oShowImg = document.getElementById('lastImg'),
    // 最终生成的图片
oMsg = document.querySelector('.msg'),
    oZhezhao = document.querySelector('.zhezhao'),
    oRevoke = document.getElementById('revoke'); // 撤销按钮  

// 公共方法
function showLoading(type) {
  oZhezhao.style.display = type;
  oMsg.style.display = type;
}

exports.default = {
  // 对象
  oCan: oCan,
  ctx: ctx,
  oShowImg: oShowImg,
  oMsg: oMsg,
  oZhezhao: oZhezhao,
  oRevoke: oRevoke,
  // 方法
  showLoading: showLoading,
  isDraw: false, // 能否涂鸦
  isNewPic: true, // 是否新的图片
  isStopPrevent: true, // 是否阻止全局默认事件
  data: {},
  imgData: {},
  // 兼容写法
  transform: function transform(obj, data) {
    obj.style.WebkitTransform = data;
    obj.style.transform = data;
  }
};

},{}],6:[function(require,module,exports){
'use strict';

var _exif = require('./../../plugins/exif');

var _exif2 = _interopRequireDefault(_exif);

var _opts = require('./opts');

var _opts2 = _interopRequireDefault(_opts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oCan = _opts2.default.oCan,
    ctx = _opts2.default.ctx,
    oAsideBtn = document.querySelector('.asideBtn'),
    oAside = document.querySelector('#aside'),
    oFile = document.getElementById('file'),
    // 上传图片按钮
oCreateBtn = document.getElementById('create'),
    // 生成图片按钮
imgData = {};

var isCreatePic = false; // 是否生成了图片

/*
 *图片上传处理过程
 *图片上传成功后 => 获取元数据 => 转化为base64 => 修正图片的宽高，显示的方向和图片的内存大小
*/

// 生成图片
function createImg(e) {
  e.preventDefault();
  if (!isCreatePic) {
    return false;
  }
  // 删除上传图片按钮
  oFile.parentNode.removeChild(oFile);
  this.parentNode.removeChild(this);
  oCan.style.display = 'none';
  this.style.display = 'block';
  // 生成图片
  _opts2.default.oShowImg.src = oCan.toDataURL('image/png');
  _opts2.default.oShowImg.style.display = 'block';
  _opts2.default.oShowImg.style.position = 'static';
  $.post('/api/savePic', { id: document.querySelector('#user').getAttribute('userId'), url: _opts2.default.oShowImg.src }, function (data) {
    console.log(data);
  });
  document.querySelector('.successPage').style.display = 'flex';
  document.querySelector('.main_bottom').innerHTML = '<p class="success_txt">生成图片成功！长按可保存图片</p>';
}

// 图片load回调方法
function cacheImg(url, callback) {
  console.log('load');
  if (!url) {
    callback.call();
    return false;
  }
  var img = new Image();
  // img.crossOrigin = "Anonymous"
  img.onload = function () {
    // 图片加载完，执行回调
    callback.call(img);
  };
  img.src = url;
}

// 显示功能
function showFun() {
  _opts2.default.showLoading('none');
  // 选择size，笔触颜色显示
  oAsideBtn.style.display = 'block';
  oCreateBtn.style.display = 'block';
  document.getElementById('filterBtn').style.display = 'block';
  // 撤销按钮小时
  _opts2.default.oRevoke.style.display = 'block';
  isCreatePic = true;
  // 是否可以画笔触
  _opts2.default.isDraw = true;
  // 是新的图片
  _opts2.default.isNewPic = true;
}

// 使用离屏进行计算
// function offScreen() {
// }

// 计算图片的宽高
function computeWidthAndHeight(data) {
  var drawWidth = data.drawWidth,
      drawHeight = data.drawHeight,
      degree = 0,
      maxSide = Math.max(drawWidth, drawHeight);
  var params = data.params,
      size = 2048;

  // 如果当期size大于2M，按比例修正到2M以下
  if (maxSide > size) {
    var minSide = Math.min(drawWidth, drawHeight);
    minSide = minSide / maxSide * size;
    maxSide = size;
    if (drawWidth > drawHeight) {
      drawWidth = maxSide;
      drawHeight = minSide;
    } else {
      drawWidth = minSide;
      drawHeight = maxSide;
    }
  }
  // 使用离屏canvas修正图片的方向
  var canvas = document.createElement('canvas');
  var width = drawWidth,
      height = drawHeight;
  canvas.width = width;
  canvas.height = height;

  var context = canvas.getContext('2d');
  // 判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
  switch (params.data.Orientation) {
    // iphone横屏拍摄，此时home键在左侧
    case 3:
      degree = 180;
      drawWidth = -width;
      drawHeight = -height;
      break;
    // iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
    case 6:
      canvas.width = height;
      canvas.height = width;
      degree = 90;
      drawWidth = width;
      drawHeight = -height;
      break;
    // iphone竖屏拍摄，此时home键在上方
    case 8:
      canvas.width = height;
      canvas.height = width;
      degree = 270;
      drawWidth = -width;
      drawHeight = height;
      break;
  }
  /*
   *返回参数
   *degress: 渲染的方向
   *drawWidth: 修正后的宽度
   *.......
  */
  return {
    degree: degree,
    drawWidth: drawWidth,
    drawHeight: drawHeight,
    context: context,
    canvas: canvas
  };
}

// 获取处理好的图片数据
function getImgData(params) {
  cacheImg(params.img, function () {
    // 以下改变一下图片大小
    // 获取宽高中，最大的值
    var output = computeWidthAndHeight({
      drawWidth: params.data.PixelXDimension || this.naturalWidth,
      drawHeight: params.data.PixelYDimension || this.naturalHeight,
      params: params
    });
    // 使用canvas旋转校正
    output.context.rotate(output.degree * Math.PI / 180);
    // 渲染新的图片
    output.context.drawImage(this, 0, 0, output.drawWidth, output.drawHeight);
    // 生成校正后图片
    params.next(output.canvas.toDataURL('image/png'));
    output = null;
  });
}

// 处理修正后的图片，渲染到屏幕上
function uploadFileCallBack() {
  // 获取图片的宽高
  var w = this.width,
      h = this.height;
  // 缓存图片初始宽高
  imgData.w = w;
  imgData.h = h;
  _opts2.default.imgData.w = w;
  _opts2.default.imgData.h = h;
  var cW = _opts2.default.canvasW,
      cH = _opts2.default.canvasH;
  if (cW / cH > w / h) {
    // 宽大于高，高100%
    w = w * cH / h;
    h = cH;
  } else {
    // 高大于宽，宽100%
    h = h * cW / w;
    w = cW;
  }
  ctx.clearRect(0, 0, cW, cH);
  // 生成图片，居中显示
  ctx.drawImage(this, (cW - w) / 2, (cH - h) / 2, w, h);
  // 缓存当前图片的数据到内存里
  _opts2.default.data.imageData = ctx.getImageData((cW - w) / 2, (cH - h) / 2, w, h);
  _opts2.default.data.img = this;
  _opts2.default.data.imgPos = {
    x: (cW - w) / 2,
    y: (cH - h) / 2,
    w: w,
    h: h
  };
  showFun();
}

// 图片上传回调事件
function uploadFile() {
  var file = this.files[0];
  var exifData = null;
  // 判断图片是否过大
  if (file.size / 1024 > 5000) {
    // 大于2M
    alert('图片过大，请选择相对较小的图片');
    return false;
  }
  // 图片处理中，提示层出现
  _opts2.default.showLoading('block');
  var reader = new FileReader();
  new Promise(function (resolve) {
    // 获取图片的元数据
    _exif2.default.getData(file, function () {
      exifData = _exif2.default.getAllTags(this);
      resolve();
    });
  }).then(function () {
    reader.onload = function () {
      // 图片信息获取完毕
      // 修正图片方向
      getImgData({
        img: this.result,
        data: exifData,
        next: function next(img) {
          cacheImg(img, uploadFileCallBack);
        }
      });
    };
    reader.readAsDataURL(file);
  });
}

// 图片上传后，change事件
oFile.addEventListener('change', uploadFile, false);

// 生成图片
oCreateBtn.addEventListener('touchstart', createImg, false);

// 侧边栏显示
oAsideBtn.addEventListener('touchstart', function () {
  if (!isCreatePic) {
    alert('请先选择图片');
    return false;
  }
  _opts2.default.isDraw = false;
  oAside.style.display = 'block';
});
// 侧边栏隐藏
document.querySelector('.aside_hideBtn').addEventListener('touchstart', function () {
  _opts2.default.isDraw = true;
  oAside.style.display = 'none';
  _opts2.default.transform(document.querySelector('.colorPickerbox'), 'translateX(-1000px)');
});

},{"./../../plugins/exif":9,"./opts":5}],7:[function(require,module,exports){
'use strict';

var _draw = require('./draw');

var _draw2 = _interopRequireDefault(_draw);

var _filter = require('./filter');

var _filter2 = _interopRequireDefault(_filter);

var _opts = require('./opts');

var _opts2 = _interopRequireDefault(_opts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ctx = _opts2.default.ctx;

// 改变图片展示方式
function selectPicSize(value) {
  var set_x = void 0,
      set_y = void 0,
      set_w = void 0,
      set_h = void 0,
      w = _opts2.default.imgData.w,
      h = _opts2.default.imgData.h;
  var cw = _opts2.default.canvasW,
      ch = _opts2.default.canvasH;

  function check_type(type) {
    if (type) {
      if (cw / ch > w / h) {
        // 宽大于高，高100%
        w = w * ch / h;
        h = ch;
      } else {
        h = h * cw / w;
        w = cw;
      }
    } else {
      if (cw / ch <= w / h) {
        // 宽大于高，高100%
        w = w * ch / h;
        h = ch;
      } else {
        h = h * cw / w;
        w = cw;
      }
    }
  }
  // 改变图片展示方式
  switch (value) {
    case '1':
      // 居中
      check_type(true);
      set_x = (cw - w) / 2;
      set_y = (ch - h) / 2;
      set_w = w;
      set_h = h;
      break;
    case '2':
      // 填充
      check_type(false);
      set_x = (cw - w) / 2;
      set_y = (ch - h) / 2;
      set_w = w;
      set_h = h;
      break;
    case '3':
      // 适应
      check_type(true);
      set_x = 0;
      set_y = 0;
      set_w = w;
      set_h = h;
      break;
    case '4':
      // 拉伸
      set_x = 0;
      set_y = 0;
      set_w = cw;
      set_h = ch;
      break;
    default:
      // 居中
      check_type(true);
      set_x = (cw - w) / 2;
      set_y = (ch - h) / 2;
      set_w = w;
      set_h = h;
      break;
  }
  return {
    set_x: set_x,
    set_y: set_y,
    set_w: set_w,
    set_h: set_h
  };
}
// 选择图片的显示方式
document.getElementById('selectPicSize').addEventListener('change', function () {
  // 获取上传的图片
  var img = _opts2.default.data.img;
  // 获取修正后的宽高,xy
  var output = selectPicSize(this.value);
  var set_x = output.set_x,
      set_y = output.set_y,
      set_w = output.set_w,
      set_h = output.set_h;
  // 重绘
  ctx.clearRect(0, 0, _opts2.default.canvasW, _opts2.default.canvasH);
  ctx.drawImage(img, set_x, set_y, set_w, set_h);
  _opts2.default.data.imageData = ctx.getImageData(set_x, set_y, set_w, set_h);
  _opts2.default.data.imgPos = {
    x: set_x,
    y: set_y,
    w: set_w,
    h: set_h
  };
  img = null;
  (0, _filter2.default)();
  (0, _draw2.default)();
}, false);

},{"./draw":1,"./filter":2,"./opts":5}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function ColorPicker(params) {
  this.oBox = params.oBox; //最外层盒子
  this.oBtnWrap = params.oBtnWrap; //按钮外层盒子
  this.oCan = params.oCan; //画布
  this.ctx = params.oCan.getContext('2d');

  this.w = params.width; //画布的宽高
  this.h = params.width;
  this.lineW = 20; //外层颜色的厚度
  this.r = this.w / 2; //外圆半径
  this.r2 = this.r - this.lineW; //内圆半径
  //内层颜色宽高,坐标
  this.iW = (this.r2 - 5) / Math.cos(2 * Math.PI / 360 * 45);
  this.iX = (this.w - this.iW) / 2;
  //canvas的Left top值
  this.where = ''; //点击时的位置
  //属性
  this.opts = {
    insideX: 0,
    insideY: 0
  };
  this.callback = params.callback;
  this.bindMove = null;
}

ColorPicker.prototype = {
  init: function init() {
    //初始化
    this.oCan.width = this.w;
    this.oCan.height = this.h;
    //生成节点（内外层选择点）
    this.oBtnWrap.innerHTML = '<div class="insideBtn"></div><div class="outsideBtn"></div>';
    //两个颜色选择点
    this.oInsideBtn = document.querySelector(".insideBtn");
    this.oOutsideBtn = document.querySelector(".outsideBtn");
    //按钮宽度
    this.btnW = this.oInsideBtn.offsetWidth;

    var x = this.w / 2,
        y = this.h / 2,
        _this = this,
        r2 = this.r2;
    //按钮位置初始化
    this.transform(this.oInsideBtn, 'translate(' + (this.iW + this.iX - this.btnW) + 'px ,' + this.iX + 'px)');
    this.transform(this.oOutsideBtn, 'translate(' + x + 'px ,' + 0 + 'px)');
    this.opts.insideX = this.iW + this.iX - this.btnW;
    this.opts.insideY = this.iX;
    //生成外层颜色
    this.createColorBg(x, y);

    //生成内颜色
    this.createInsideColor('red');
    var move = _this.move.bind(this);
    this.bindMove = this.move.bind(this);
    //给予事件
    //pc端
    this.oBox.addEventListener('mousedown', this.addMove.bind(this), false);
    this.oBox.addEventListener('mouseup', this.removeMove.bind(this), false);

    //移动端
    this.oCan.addEventListener('touchstart', this.addMove.bind(this), false);
    this.oCan.addEventListener('touchend', this.removeMove.bind(this), false);
  },
  addMove: function addMove(e) {
    //获取canvas的left ,top 位置
    if (!this.oCan_left) {
      var canPos = this.getElemPos(this.oCan);
      this.oCan_left = canPos.x;
      this.oCan_top = canPos.y;
    }
    //颜色初始化
    this.move(e);
    document.addEventListener('mousemove', this.bindMove, false);
    document.addEventListener('touchmove', this.bindMove, false);
  },
  removeMove: function removeMove() {
    console.log('out');
    document.removeEventListener('mousemove', this.bindMove, false);
    document.removeEventListener('touchmove', this.bindMove, false);
  },
  createColorBg: function createColorBg(x, y) {
    //生成圆环颜色
    var ctx = this.ctx;
    for (var i = 0; i < 360; i += .1) {
      //获取度数
      var rad = i * (2 * Math.PI) / 360,
          c_x = Math.cos(rad),
          c_y = Math.sin(rad),
          lineW = this.lineW;
      ctx.strokeStyle = "hsl(" + i + ", 100%, 50%)";
      ctx.beginPath();
      ctx.moveTo(x + (x - lineW) * c_x, y + (y - lineW) * c_y);
      //求出另外两点坐标
      ctx.lineTo(x + x * c_x, y + y * c_y);
      ctx.stroke();
      ctx.closePath();
    }
  },
  createInsideColor: function createInsideColor(color) {
    //生成内颜色
    var ctx = this.ctx,
        w = this.w,
        h = this.h,
        iW = this.iW,
        iX = this.iX; //起点坐标
    //清除指定区域
    ctx.clearRect(iX, iX, iW, iW);
    ctx.fillStyle = color;
    ctx.fillRect(iX, iX, iW, iW);
    //白色
    var g = ctx.createLinearGradient(iX, (iX + iW) / 2, iX + iW, (iX + iW) / 2);
    g.addColorStop(0, "#FFFFFF");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(iX, iX, iW, iW);

    //黑色
    var g = ctx.createLinearGradient(iX, iX + iW, iX, iX);
    g.addColorStop(0, "#000000");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(iX, iX, iW, iW);
  },
  move: function move(e) {
    //移动事件
    var t = e.touches ? e.touches[0] : e,
        x = t.pageX - this.oCan_left,
        y = t.pageY - this.oCan_top;
    var pos = this.btnPosition(x, y);
    if (!pos) {
      return false;
    }

    var where = this.where,
        color = '';
    this.transform(where === 'outside' ? this.oOutsideBtn : this.oInsideBtn, 'translate(' + pos.x + 'px ,' + pos.y + 'px)');
    color = this.getColor(pos.x, pos.y);
    if (where === 'outside') {
      //如果是外层，改变内层颜色
      this.createInsideColor(color);
      color = this.getColor(this.opts.insideX, this.opts.insideY);
    }
    this.callback && this.callback(color);
  },
  btnPosition: function btnPosition(x, y) {
    //判断外按钮位置
    var w = this.w,
        h = this.h,
        iW = this.iW,
        iX = this.iX;

    //获取圆心到点的距离
    var d = Math.sqrt(Math.pow(x - w / 2, 2) + Math.pow(y - h / 2, 2));
    //判断在内层颜色内
    if (x > iX && x < iX + iW && y > iX && y < iX + iW) {
      this.where = 'inside';
    } else if (d >= this.r2 && d <= this.r) {
      //判断在外层颜色内
      this.where = 'outside';
    } else {
      console.log('no');
      return false;
    }
    var where = this.where,
        btnW = this.btnW,
        btnW2 = btnW / 2;
    //计算是否有超出
    if (where === 'outside') {
      if (x < btnW2) {
        x = 0;
      } else if (x > w - btnW2) {
        x = w - btnW;
      }
      if (y < btnW2) {
        y = 0;
      } else if (y > h - btnW2) {
        y = h - btnW;
      }
    } else {
      var x1 = iX - btnW2,
          y1 = iW + iX - btnW2,
          y2 = iW + iX - btnW;
      if (x < x1) {
        x = iX;
      } else if (x > y1) {
        x = y2;
      }
      if (y < x1) {
        y = iX;
      } else if (y > y1) {
        y = y2;
      }

      this.opts.insideX = x;
      this.opts.insideY = y;
    }
    return {
      x: x,
      y: y
    };
  },
  transform: function transform(obj, data) {
    obj.style.WebkitTransform = data;
    obj.style.transform = data;
  },
  getColor: function getColor(x, y) {
    var pixel = this.ctx.getImageData(x, y, 1, 1),
        data = pixel.data,
        rgb = 'rgb(' + data[0] + ',' + data[1] + ',' + data[2] + ')';
    return rgb;
  },
  getElemPos: function getElemPos(obj) {
    //获取目标，到最外层的offsetLeft和offsetTop
    var pos = {
      "top": 0,
      "left": 0
    };
    if (obj.offsetParent) {
      while (obj.offsetParent) {
        pos.top += obj.offsetTop;
        pos.left += obj.offsetLeft;
        obj = obj.offsetParent;
      }
    } else if (obj.x) {
      pos.left += obj.x;
    } else if (obj.x) {
      pos.top += obj.y;
    }
    return {
      x: pos.left,
      y: pos.top
    };
  }
};

exports.default = ColorPicker;

//声明模块
// if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
//   define(function() {
//     return ColorPicker;
//   });
// } else if (typeof module !== 'undefined' && module.exports) {
//   module.exports.ColorPicker = ColorPicker;
// } else {
//   window.ColorPicker = ColorPicker;
// }

},{}],9:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {

    var debug = false;

    var root = this;

    var EXIF = function EXIF(obj) {
        if (obj instanceof EXIF) return obj;
        if (!(this instanceof EXIF)) return new EXIF(obj);
        this.EXIFwrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = EXIF;
        }
        exports.EXIF = EXIF;
    } else {
        root.EXIF = EXIF;
    }

    var ExifTags = EXIF.Tags = {

        // version tags
        0x9000: "ExifVersion", // EXIF version
        0xA000: "FlashpixVersion", // Flashpix format version

        // colorspace tags
        0xA001: "ColorSpace", // Color space information tag

        // image configuration
        0xA002: "PixelXDimension", // Valid width of meaningful image
        0xA003: "PixelYDimension", // Valid height of meaningful image
        0x9101: "ComponentsConfiguration", // Information about channels
        0x9102: "CompressedBitsPerPixel", // Compressed bits per pixel

        // user information
        0x927C: "MakerNote", // Any desired information written by the manufacturer
        0x9286: "UserComment", // Comments by user

        // related file
        0xA004: "RelatedSoundFile", // Name of related sound file

        // date and time
        0x9003: "DateTimeOriginal", // Date and time when the original image was generated
        0x9004: "DateTimeDigitized", // Date and time when the image was stored digitally
        0x9290: "SubsecTime", // Fractions of seconds for DateTime
        0x9291: "SubsecTimeOriginal", // Fractions of seconds for DateTimeOriginal
        0x9292: "SubsecTimeDigitized", // Fractions of seconds for DateTimeDigitized

        // picture-taking conditions
        0x829A: "ExposureTime", // Exposure time (in seconds)
        0x829D: "FNumber", // F number
        0x8822: "ExposureProgram", // Exposure program
        0x8824: "SpectralSensitivity", // Spectral sensitivity
        0x8827: "ISOSpeedRatings", // ISO speed rating
        0x8828: "OECF", // Optoelectric conversion factor
        0x9201: "ShutterSpeedValue", // Shutter speed
        0x9202: "ApertureValue", // Lens aperture
        0x9203: "BrightnessValue", // Value of brightness
        0x9204: "ExposureBias", // Exposure bias
        0x9205: "MaxApertureValue", // Smallest F number of lens
        0x9206: "SubjectDistance", // Distance to subject in meters
        0x9207: "MeteringMode", // Metering mode
        0x9208: "LightSource", // Kind of light source
        0x9209: "Flash", // Flash status
        0x9214: "SubjectArea", // Location and area of main subject
        0x920A: "FocalLength", // Focal length of the lens in mm
        0xA20B: "FlashEnergy", // Strobe energy in BCPS
        0xA20C: "SpatialFrequencyResponse", //
        0xA20E: "FocalPlaneXResolution", // Number of pixels in width direction per FocalPlaneResolutionUnit
        0xA20F: "FocalPlaneYResolution", // Number of pixels in height direction per FocalPlaneResolutionUnit
        0xA210: "FocalPlaneResolutionUnit", // Unit for measuring FocalPlaneXResolution and FocalPlaneYResolution
        0xA214: "SubjectLocation", // Location of subject in image
        0xA215: "ExposureIndex", // Exposure index selected on camera
        0xA217: "SensingMethod", // Image sensor type
        0xA300: "FileSource", // Image source (3 == DSC)
        0xA301: "SceneType", // Scene type (1 == directly photographed)
        0xA302: "CFAPattern", // Color filter array geometric pattern
        0xA401: "CustomRendered", // Special processing
        0xA402: "ExposureMode", // Exposure mode
        0xA403: "WhiteBalance", // 1 = auto white balance, 2 = manual
        0xA404: "DigitalZoomRation", // Digital zoom ratio
        0xA405: "FocalLengthIn35mmFilm", // Equivalent foacl length assuming 35mm film camera (in mm)
        0xA406: "SceneCaptureType", // Type of scene
        0xA407: "GainControl", // Degree of overall image gain adjustment
        0xA408: "Contrast", // Direction of contrast processing applied by camera
        0xA409: "Saturation", // Direction of saturation processing applied by camera
        0xA40A: "Sharpness", // Direction of sharpness processing applied by camera
        0xA40B: "DeviceSettingDescription", //
        0xA40C: "SubjectDistanceRange", // Distance to subject

        // other tags
        0xA005: "InteroperabilityIFDPointer",
        0xA420: "ImageUniqueID" // Identifier assigned uniquely to each image
    };

    var TiffTags = EXIF.TiffTags = {
        0x0100: "ImageWidth",
        0x0101: "ImageHeight",
        0x8769: "ExifIFDPointer",
        0x8825: "GPSInfoIFDPointer",
        0xA005: "InteroperabilityIFDPointer",
        0x0102: "BitsPerSample",
        0x0103: "Compression",
        0x0106: "PhotometricInterpretation",
        0x0112: "Orientation",
        0x0115: "SamplesPerPixel",
        0x011C: "PlanarConfiguration",
        0x0212: "YCbCrSubSampling",
        0x0213: "YCbCrPositioning",
        0x011A: "XResolution",
        0x011B: "YResolution",
        0x0128: "ResolutionUnit",
        0x0111: "StripOffsets",
        0x0116: "RowsPerStrip",
        0x0117: "StripByteCounts",
        0x0201: "JPEGInterchangeFormat",
        0x0202: "JPEGInterchangeFormatLength",
        0x012D: "TransferFunction",
        0x013E: "WhitePoint",
        0x013F: "PrimaryChromaticities",
        0x0211: "YCbCrCoefficients",
        0x0214: "ReferenceBlackWhite",
        0x0132: "DateTime",
        0x010E: "ImageDescription",
        0x010F: "Make",
        0x0110: "Model",
        0x0131: "Software",
        0x013B: "Artist",
        0x8298: "Copyright"
    };

    var GPSTags = EXIF.GPSTags = {
        0x0000: "GPSVersionID",
        0x0001: "GPSLatitudeRef",
        0x0002: "GPSLatitude",
        0x0003: "GPSLongitudeRef",
        0x0004: "GPSLongitude",
        0x0005: "GPSAltitudeRef",
        0x0006: "GPSAltitude",
        0x0007: "GPSTimeStamp",
        0x0008: "GPSSatellites",
        0x0009: "GPSStatus",
        0x000A: "GPSMeasureMode",
        0x000B: "GPSDOP",
        0x000C: "GPSSpeedRef",
        0x000D: "GPSSpeed",
        0x000E: "GPSTrackRef",
        0x000F: "GPSTrack",
        0x0010: "GPSImgDirectionRef",
        0x0011: "GPSImgDirection",
        0x0012: "GPSMapDatum",
        0x0013: "GPSDestLatitudeRef",
        0x0014: "GPSDestLatitude",
        0x0015: "GPSDestLongitudeRef",
        0x0016: "GPSDestLongitude",
        0x0017: "GPSDestBearingRef",
        0x0018: "GPSDestBearing",
        0x0019: "GPSDestDistanceRef",
        0x001A: "GPSDestDistance",
        0x001B: "GPSProcessingMethod",
        0x001C: "GPSAreaInformation",
        0x001D: "GPSDateStamp",
        0x001E: "GPSDifferential"
    };

    var StringValues = EXIF.StringValues = {
        ExposureProgram: {
            0: "Not defined",
            1: "Manual",
            2: "Normal program",
            3: "Aperture priority",
            4: "Shutter priority",
            5: "Creative program",
            6: "Action program",
            7: "Portrait mode",
            8: "Landscape mode"
        },
        MeteringMode: {
            0: "Unknown",
            1: "Average",
            2: "CenterWeightedAverage",
            3: "Spot",
            4: "MultiSpot",
            5: "Pattern",
            6: "Partial",
            255: "Other"
        },
        LightSource: {
            0: "Unknown",
            1: "Daylight",
            2: "Fluorescent",
            3: "Tungsten (incandescent light)",
            4: "Flash",
            9: "Fine weather",
            10: "Cloudy weather",
            11: "Shade",
            12: "Daylight fluorescent (D 5700 - 7100K)",
            13: "Day white fluorescent (N 4600 - 5400K)",
            14: "Cool white fluorescent (W 3900 - 4500K)",
            15: "White fluorescent (WW 3200 - 3700K)",
            17: "Standard light A",
            18: "Standard light B",
            19: "Standard light C",
            20: "D55",
            21: "D65",
            22: "D75",
            23: "D50",
            24: "ISO studio tungsten",
            255: "Other"
        },
        Flash: {
            0x0000: "Flash did not fire",
            0x0001: "Flash fired",
            0x0005: "Strobe return light not detected",
            0x0007: "Strobe return light detected",
            0x0009: "Flash fired, compulsory flash mode",
            0x000D: "Flash fired, compulsory flash mode, return light not detected",
            0x000F: "Flash fired, compulsory flash mode, return light detected",
            0x0010: "Flash did not fire, compulsory flash mode",
            0x0018: "Flash did not fire, auto mode",
            0x0019: "Flash fired, auto mode",
            0x001D: "Flash fired, auto mode, return light not detected",
            0x001F: "Flash fired, auto mode, return light detected",
            0x0020: "No flash function",
            0x0041: "Flash fired, red-eye reduction mode",
            0x0045: "Flash fired, red-eye reduction mode, return light not detected",
            0x0047: "Flash fired, red-eye reduction mode, return light detected",
            0x0049: "Flash fired, compulsory flash mode, red-eye reduction mode",
            0x004D: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            0x004F: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            0x0059: "Flash fired, auto mode, red-eye reduction mode",
            0x005D: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            0x005F: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
            1: "Not defined",
            2: "One-chip color area sensor",
            3: "Two-chip color area sensor",
            4: "Three-chip color area sensor",
            5: "Color sequential area sensor",
            7: "Trilinear sensor",
            8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
            0: "Standard",
            1: "Landscape",
            2: "Portrait",
            3: "Night scene"
        },
        SceneType: {
            1: "Directly photographed"
        },
        CustomRendered: {
            0: "Normal process",
            1: "Custom process"
        },
        WhiteBalance: {
            0: "Auto white balance",
            1: "Manual white balance"
        },
        GainControl: {
            0: "None",
            1: "Low gain up",
            2: "High gain up",
            3: "Low gain down",
            4: "High gain down"
        },
        Contrast: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        Saturation: {
            0: "Normal",
            1: "Low saturation",
            2: "High saturation"
        },
        Sharpness: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        SubjectDistanceRange: {
            0: "Unknown",
            1: "Macro",
            2: "Close view",
            3: "Distant view"
        },
        FileSource: {
            3: "DSC"
        },

        Components: {
            0: "",
            1: "Y",
            2: "Cb",
            3: "Cr",
            4: "R",
            5: "G",
            6: "B"
        }
    };

    function addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }

    function imageHasData(img) {
        return !!img.exifdata;
    }

    function base64ToArrayBuffer(base64, contentType) {
        contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
        base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
        var binary = atob(base64);
        var len = binary.length;
        var buffer = new ArrayBuffer(len);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }

    function objectURLToBlob(url, callback) {
        var http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.responseType = "blob";
        http.onload = function (e) {
            if (this.status == 200 || this.status === 0) {
                callback(this.response);
            }
        };
        http.send();
    }

    function getImageData(img, callback) {
        function handleBinaryFile(binFile) {
            var data = findEXIFinJPEG(binFile);
            var iptcdata = findIPTCinJPEG(binFile);
            img.exifdata = data || {};
            img.iptcdata = iptcdata || {};
            if (callback) {
                callback.call(img);
            }
        }

        if (img.src) {
            if (/^data\:/i.test(img.src)) {
                // Data URI
                var arrayBuffer = base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);
            } else if (/^blob\:/i.test(img.src)) {
                // Object URL
                var fileReader = new FileReader();
                fileReader.onload = function (e) {
                    handleBinaryFile(e.target.result);
                };
                objectURLToBlob(img.src, function (blob) {
                    fileReader.readAsArrayBuffer(blob);
                });
            } else {
                var http = new XMLHttpRequest();
                http.onload = function () {
                    if (this.status == 200 || this.status === 0) {
                        handleBinaryFile(http.response);
                    } else {
                        throw "Could not load image";
                    }
                    http = null;
                };
                http.open("GET", img.src, true);
                http.responseType = "arraybuffer";
                http.send(null);
            }
        } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
            var fileReader = new FileReader();
            fileReader.onload = function (e) {
                if (debug) console.log("Got file of length " + e.target.result.byteLength);
                handleBinaryFile(e.target.result);
            };

            fileReader.readAsArrayBuffer(img);
        }
    }

    function findEXIFinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if (dataView.getUint8(0) != 0xFF || dataView.getUint8(1) != 0xD8) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength,
            marker;

        while (offset < length) {
            if (dataView.getUint8(offset) != 0xFF) {
                if (debug) console.log("Not a valid marker at offset " + offset + ", found: " + dataView.getUint8(offset));
                return false; // not a valid marker, something is wrong
            }

            marker = dataView.getUint8(offset + 1);
            if (debug) console.log(marker);

            // we could implement handling for other markers here,
            // but we're only looking for 0xFFE1 for EXIF data

            if (marker == 225) {
                if (debug) console.log("Found 0xFFE1 marker");

                return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2);

                // offset += 2 + file.getShortAt(offset+2, true);
            } else {
                offset += 2 + dataView.getUint16(offset + 2);
            }
        }
    }

    function findIPTCinJPEG(file) {
        var dataView = new DataView(file);

        if (debug) console.log("Got file of length " + file.byteLength);
        if (dataView.getUint8(0) != 0xFF || dataView.getUint8(1) != 0xD8) {
            if (debug) console.log("Not a valid JPEG");
            return false; // not a valid jpeg
        }

        var offset = 2,
            length = file.byteLength;

        var isFieldSegmentStart = function isFieldSegmentStart(dataView, offset) {
            return dataView.getUint8(offset) === 0x38 && dataView.getUint8(offset + 1) === 0x42 && dataView.getUint8(offset + 2) === 0x49 && dataView.getUint8(offset + 3) === 0x4D && dataView.getUint8(offset + 4) === 0x04 && dataView.getUint8(offset + 5) === 0x04;
        };

        while (offset < length) {

            if (isFieldSegmentStart(dataView, offset)) {

                // Get the length of the name header (which is padded to an even number of bytes)
                var nameHeaderLength = dataView.getUint8(offset + 7);
                if (nameHeaderLength % 2 !== 0) nameHeaderLength += 1;
                // Check for pre photoshop 6 format
                if (nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }

                var startOffset = offset + 8 + nameHeaderLength;
                var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);

                return readIPTCData(file, startOffset, sectionLength);

                break;
            }

            // Not the marker, continue searching
            offset++;
        }
    }
    var IptcFieldMap = {
        0x78: 'caption',
        0x6E: 'credit',
        0x19: 'keywords',
        0x37: 'dateCreated',
        0x50: 'byline',
        0x55: 'bylineTitle',
        0x7A: 'captionWriter',
        0x69: 'headline',
        0x74: 'copyright',
        0x0F: 'category'
    };
    function readIPTCData(file, startOffset, sectionLength) {
        var dataView = new DataView(file);
        var data = {};
        var fieldValue, fieldName, dataSize, segmentType, segmentSize;
        var segmentStartPos = startOffset;
        while (segmentStartPos < startOffset + sectionLength) {
            if (dataView.getUint8(segmentStartPos) === 0x1C && dataView.getUint8(segmentStartPos + 1) === 0x02) {
                segmentType = dataView.getUint8(segmentStartPos + 2);
                if (segmentType in IptcFieldMap) {
                    dataSize = dataView.getInt16(segmentStartPos + 3);
                    segmentSize = dataSize + 5;
                    fieldName = IptcFieldMap[segmentType];
                    fieldValue = getStringFromDB(dataView, segmentStartPos + 5, dataSize);
                    // Check if we already stored a value with this name
                    if (data.hasOwnProperty(fieldName)) {
                        // Value already stored with this name, create multivalue field
                        if (data[fieldName] instanceof Array) {
                            data[fieldName].push(fieldValue);
                        } else {
                            data[fieldName] = [data[fieldName], fieldValue];
                        }
                    } else {
                        data[fieldName] = fieldValue;
                    }
                }
            }
            segmentStartPos++;
        }
        return data;
    }

    function readTags(file, tiffStart, dirStart, strings, bigEnd) {
        var entries = file.getUint16(dirStart, !bigEnd),
            tags = {},
            entryOffset,
            tag,
            i;

        for (i = 0; i < entries; i++) {
            entryOffset = dirStart + i * 12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag && debug) console.log("Unknown tag: " + file.getUint16(entryOffset, !bigEnd));
            tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }

    function readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        var type = file.getUint16(entryOffset + 2, !bigEnd),
            numValues = file.getUint32(entryOffset + 4, !bigEnd),
            valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
            offset,
            vals,
            val,
            n,
            numerator,
            denominator;

        switch (type) {
            case 1: // byte, 8-bit unsigned int
            case 7:
                // undefined, 8-bit byte, value depending on field
                if (numValues == 1) {
                    return file.getUint8(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 4 ? valueOffset : entryOffset + 8;
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint8(offset + n);
                    }
                    return vals;
                }

            case 2:
                // ascii, 8-bit byte
                offset = numValues > 4 ? valueOffset : entryOffset + 8;
                return getStringFromDB(file, offset, numValues - 1);

            case 3:
                // short, 16 bit int
                if (numValues == 1) {
                    return file.getUint16(entryOffset + 8, !bigEnd);
                } else {
                    offset = numValues > 2 ? valueOffset : entryOffset + 8;
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
                    }
                    return vals;
                }

            case 4:
                // long, 32 bit int
                if (numValues == 1) {
                    return file.getUint32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }

            case 5:
                // rational = two long values, first is numerator, second is denominator
                if (numValues == 1) {
                    numerator = file.getUint32(valueOffset, !bigEnd);
                    denominator = file.getUint32(valueOffset + 4, !bigEnd);
                    val = new Number(numerator / denominator);
                    val.numerator = numerator;
                    val.denominator = denominator;
                    return val;
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
                        denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
                        vals[n] = new Number(numerator / denominator);
                        vals[n].numerator = numerator;
                        vals[n].denominator = denominator;
                    }
                    return vals;
                }

            case 9:
                // slong, 32 bit signed int
                if (numValues == 1) {
                    return file.getInt32(entryOffset + 8, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
                    }
                    return vals;
                }

            case 10:
                // signed rational, two slongs, first is numerator, second is denominator
                if (numValues == 1) {
                    return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd);
                } else {
                    vals = [];
                    for (n = 0; n < numValues; n++) {
                        vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
                    }
                    return vals;
                }
        }
    }

    function getStringFromDB(buffer, start, length) {
        var outstr = "";
        for (var n = start; n < start + length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }

    function readEXIFData(file, start) {
        if (getStringFromDB(file, start, 4) != "Exif") {
            if (debug) console.log("Not valid EXIF data! " + getStringFromDB(file, start, 4));
            return false;
        }

        var bigEnd,
            tags,
            tag,
            exifData,
            gpsData,
            tiffOffset = start + 6;

        // test for TIFF validity and endianness
        if (file.getUint16(tiffOffset) == 0x4949) {
            bigEnd = false;
        } else if (file.getUint16(tiffOffset) == 0x4D4D) {
            bigEnd = true;
        } else {
            if (debug) console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
            return false;
        }

        if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002A) {
            if (debug) console.log("Not valid TIFF data! (no 0x002A)");
            return false;
        }

        var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);

        if (firstIFDOffset < 0x00000008) {
            if (debug) console.log("Not valid TIFF data! (First offset less than 8)", file.getUint32(tiffOffset + 4, !bigEnd));
            return false;
        }

        tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd);

        if (tags.ExifIFDPointer) {
            exifData = readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, ExifTags, bigEnd);
            for (tag in exifData) {
                switch (tag) {
                    case "LightSource":
                    case "Flash":
                    case "MeteringMode":
                    case "ExposureProgram":
                    case "SensingMethod":
                    case "SceneCaptureType":
                    case "SceneType":
                    case "CustomRendered":
                    case "WhiteBalance":
                    case "GainControl":
                    case "Contrast":
                    case "Saturation":
                    case "Sharpness":
                    case "SubjectDistanceRange":
                    case "FileSource":
                        exifData[tag] = StringValues[tag][exifData[tag]];
                        break;

                    case "ExifVersion":
                    case "FlashpixVersion":
                        exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                        break;

                    case "ComponentsConfiguration":
                        exifData[tag] = StringValues.Components[exifData[tag][0]] + StringValues.Components[exifData[tag][1]] + StringValues.Components[exifData[tag][2]] + StringValues.Components[exifData[tag][3]];
                        break;
                }
                tags[tag] = exifData[tag];
            }
        }

        if (tags.GPSInfoIFDPointer) {
            gpsData = readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, GPSTags, bigEnd);
            for (tag in gpsData) {
                switch (tag) {
                    case "GPSVersionID":
                        gpsData[tag] = gpsData[tag][0] + "." + gpsData[tag][1] + "." + gpsData[tag][2] + "." + gpsData[tag][3];
                        break;
                }
                tags[tag] = gpsData[tag];
            }
        }

        return tags;
    }

    EXIF.getData = function (img, callback) {
        if ((img instanceof Image || img instanceof HTMLImageElement) && !img.complete) return false;

        if (!imageHasData(img)) {
            getImageData(img, callback);
        } else {
            if (callback) {
                callback.call(img);
            }
        }
        return true;
    };

    EXIF.getTag = function (img, tag) {
        if (!imageHasData(img)) return;
        return img.exifdata[tag];
    };

    EXIF.getIptcTag = function (img, tag) {
        if (!imageHasData(img)) return;
        return img.iptcdata[tag];
    };

    EXIF.getAllTags = function (img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.exifdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    };

    EXIF.getAllIptcTags = function (img) {
        if (!imageHasData(img)) return {};
        var a,
            data = img.iptcdata,
            tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    };

    EXIF.pretty = function (img) {
        if (!imageHasData(img)) return "";
        var a,
            data = img.exifdata,
            strPretty = "";
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (_typeof(data[a]) == "object") {
                    if (data[a] instanceof Number) {
                        strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                    } else {
                        strPretty += a + " : [" + data[a].length + " values]\r\n";
                    }
                } else {
                    strPretty += a + " : " + data[a] + "\r\n";
                }
            }
        }
        return strPretty;
    };

    EXIF.readFromBinaryFile = function (file) {
        return findEXIFinJPEG(file);
    };

    if (typeof define === 'function' && define.amd) {
        define('exif-js', [], function () {
            return EXIF;
        });
    }
}).call(undefined);

},{}],10:[function(require,module,exports){
'use strict';

/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/

/**
 * Instantiate fast-clicking listeners on the specified layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 * @param {Object} [options={}] The options to override the defaults
 */

Object.defineProperty(exports, "__esModule", {
	value: true
});
function FastClick(layer, options) {
	var oldOnClick;

	options = options || {};

	/**
  * Whether a click is currently being tracked.
  *
  * @type boolean
  */
	this.trackingClick = false;

	/**
  * Timestamp for when click tracking started.
  *
  * @type number
  */
	this.trackingClickStart = 0;

	/**
  * The element being tracked for a click.
  *
  * @type EventTarget
  */
	this.targetElement = null;

	/**
  * X-coordinate of touch start event.
  *
  * @type number
  */
	this.touchStartX = 0;

	/**
  * Y-coordinate of touch start event.
  *
  * @type number
  */
	this.touchStartY = 0;

	/**
  * ID of the last touch, retrieved from Touch.identifier.
  *
  * @type number
  */
	this.lastTouchIdentifier = 0;

	/**
  * Touchmove boundary, beyond which a click will be cancelled.
  *
  * @type number
  */
	this.touchBoundary = options.touchBoundary || 10;

	/**
  * The FastClick layer.
  *
  * @type Element
  */
	this.layer = layer;

	/**
  * The minimum time between tap(touchstart and touchend) events
  *
  * @type number
  */
	this.tapDelay = options.tapDelay || 200;

	/**
  * The maximum time for a tap
  *
  * @type number
  */
	this.tapTimeout = options.tapTimeout || 700;

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Some old versions of Android don't have Function.prototype.bind
	function bind(method, context) {
		return function () {
			return method.apply(context, arguments);
		};
	}

	var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
	var context = this;
	for (var i = 0, l = methods.length; i < l; i++) {
		context[methods[i]] = bind(context[methods[i]], context);
	}

	// Set up event handlers as required
	if (deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function (type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function (type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function (event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}

/**
* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
*
* @type boolean
*/
var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

/**
 * Android requires exceptions.
 *
 * @type boolean
 */
var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;

/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;

/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
var deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent);

/**
 * iOS 6.0-7.* requires the target element to be manually derived
 *
 * @type boolean
 */
var deviceIsIOSWithBadTarget = deviceIsIOS && /OS [6-7]_\d/.test(navigator.userAgent);

/**
 * BlackBerry requires exceptions.
 *
 * @type boolean
 */
var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function (target) {
	switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if (deviceIsIOS && target.type === 'file' || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
	}

	return (/\bneedsclick\b/.test(target.className)
	);
};

/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function (target) {
	switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
				case 'button':
				case 'checkbox':
				case 'file':
				case 'image':
				case 'radio':
				case 'submit':
					return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/.test(target.className)
			);
	}
};

/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function (targetElement, event) {
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function (targetElement) {

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};

/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function (targetElement) {
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};

/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function (targetElement) {
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};

/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};

/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function (event) {
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
			// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
			// random integers, it's safe to to continue if the identifier is 0 here.
			if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if (event.timeStamp - this.lastClickTime < this.tapDelay) {
		event.preventDefault();
	}

	return true;
};

/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function (event) {
	var touch = event.changedTouches[0],
	    boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};

/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function (event) {
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};

/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function (labelElement) {

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};

/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function (event) {
	var forElement,
	    trackingClickStart,
	    targetTagName,
	    scrollParent,
	    touch,
	    targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if (event.timeStamp - this.lastClickTime < this.tapDelay) {
		this.cancelNextClick = true;
		return true;
	}

	if (event.timeStamp - this.trackingClickStart > this.tapTimeout) {
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if (event.timeStamp - trackingClickStart > 100 || deviceIsIOS && window.top !== window && targetTagName === 'input') {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);
		this.sendClick(targetElement, event);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
		if (!deviceIsIOS || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (deviceIsIOS && !deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};

/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function () {
	this.trackingClick = false;
	this.targetElement = null;
};

/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function (event) {

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};

/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function (event) {
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};

/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function () {
	var layer = this.layer;

	if (deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};

/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function (layer) {
	var metaViewport;
	var chromeVersion;
	var blackberryVersion;
	var firefoxVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

	if (chromeVersion) {

		if (deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
					return true;
				}
			}

			// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	if (deviceIsBlackBerry10) {
		blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

		// BlackBerry 10.3+ does not require Fastclick library.
		// https://github.com/ftlabs/fastclick/issues/251
		if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
			metaViewport = document.querySelector('meta[name=viewport]');

			if (metaViewport) {
				// user-scalable=no eliminates click delay.
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// width=device-width (or less than device-width) eliminates click delay.
				if (document.documentElement.scrollWidth <= window.outerWidth) {
					return true;
				}
			}
		}
	}

	// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
		return true;
	}

	// Firefox version - zero for other browsers
	firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

	if (firefoxVersion >= 27) {
		// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

		metaViewport = document.querySelector('meta[name=viewport]');
		if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
			return true;
		}
	}

	// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
	// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
	if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
		return true;
	}

	return false;
};

/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 * @param {Object} [options={}] The options to override the defaults
 */
FastClick.attach = function (layer, options) {
	return new FastClick(layer, options);
};

exports.default = FastClick;

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ImageFilters = {};
ImageFilters.utils = {
    initSampleCanvas: function initSampleCanvas() {
        var _canvas = document.createElement('canvas'),
            _context = _canvas.getContext('2d');

        _canvas.width = 0;
        _canvas.height = 0;

        this.getSampleCanvas = function () {
            return _canvas;
        };
        this.getSampleContext = function () {
            return _context;
        };
        this.createImageData = _context.createImageData ? function (w, h) {
            return _context.createImageData(w, h);
        } : function (w, h) {
            return new ImageData(w, h);
        };
    },
    getSampleCanvas: function getSampleCanvas() {
        this.initSampleCanvas();
        return this.getSampleCanvas();
    },
    getSampleContext: function getSampleContext() {
        this.initSampleCanvas();
        return this.getSampleContext();
    },
    createImageData: function createImageData(w, h) {
        this.initSampleCanvas();
        return this.createImageData(w, h);
    },
    clamp: function clamp(value) {
        return value > 255 ? 255 : value < 0 ? 0 : value;
    },
    buildMap: function buildMap(f) {
        for (var m = [], k = 0, v; k < 256; k += 1) {
            m[k] = (v = f(k)) > 255 ? 255 : v < 0 ? 0 : v | 0;
        }
        return m;
    },
    applyMap: function applyMap(src, dst, map) {
        for (var i = 0, l = src.length; i < l; i += 4) {
            dst[i] = map[src[i]];
            dst[i + 1] = map[src[i + 1]];
            dst[i + 2] = map[src[i + 2]];
            dst[i + 3] = src[i + 3];
        }
    },
    mapRGB: function mapRGB(src, dst, func) {
        this.applyMap(src, dst, this.buildMap(func));
    },
    getPixelIndex: function getPixelIndex(x, y, width, height, edge) {
        if (x < 0 || x >= width || y < 0 || y >= height) {
            switch (edge) {
                case 1:
                    // clamp
                    x = x < 0 ? 0 : x >= width ? width - 1 : x;
                    y = y < 0 ? 0 : y >= height ? height - 1 : y;
                    break;
                case 2:
                    // wrap
                    x = (x %= width) < 0 ? x + width : x;
                    y = (y %= height) < 0 ? y + height : y;
                    break;
                default:
                    // transparent
                    return null;
            }
        }
        return y * width + x << 2;
    },
    getPixel: function getPixel(src, x, y, width, height, edge) {
        if (x < 0 || x >= width || y < 0 || y >= height) {
            switch (edge) {
                case 1:
                    // clamp
                    x = x < 0 ? 0 : x >= width ? width - 1 : x;
                    y = y < 0 ? 0 : y >= height ? height - 1 : y;
                    break;
                case 2:
                    // wrap
                    x = (x %= width) < 0 ? x + width : x;
                    y = (y %= height) < 0 ? y + height : y;
                    break;
                default:
                    // transparent
                    return 0;
            }
        }

        var i = y * width + x << 2;

        // ARGB
        return src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];
    },
    getPixelByIndex: function getPixelByIndex(src, i) {
        return src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];
    },
    /**
     * one of the most important functions in this library.
     * I want to make this as fast as possible.
     */
    copyBilinear: function copyBilinear(src, x, y, width, height, dst, dstIndex, edge) {
        var fx = x < 0 ? x - 1 | 0 : x | 0,
            // Math.floor(x)
        fy = y < 0 ? y - 1 | 0 : y | 0,
            // Math.floor(y)
        wx = x - fx,
            wy = y - fy,
            i,
            nw = 0,
            ne = 0,
            sw = 0,
            se = 0,
            cx,
            cy,
            r,
            g,
            b,
            a;

        if (fx >= 0 && fx < width - 1 && fy >= 0 && fy < height - 1) {
            // in bounds, no edge actions required
            i = fy * width + fx << 2;

            if (wx || wy) {
                nw = src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];

                i += 4;
                ne = src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];

                i = i - 8 + (width << 2);
                sw = src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];

                i += 4;
                se = src[i + 3] << 24 | src[i] << 16 | src[i + 1] << 8 | src[i + 2];
            } else {
                // no interpolation required
                dst[dstIndex] = src[i];
                dst[dstIndex + 1] = src[i + 1];
                dst[dstIndex + 2] = src[i + 2];
                dst[dstIndex + 3] = src[i + 3];
                return;
            }
        } else {
            // edge actions required
            nw = this.getPixel(src, fx, fy, width, height, edge);

            if (wx || wy) {
                ne = this.getPixel(src, fx + 1, fy, width, height, edge);
                sw = this.getPixel(src, fx, fy + 1, width, height, edge);
                se = this.getPixel(src, fx + 1, fy + 1, width, height, edge);
            } else {
                // no interpolation required
                dst[dstIndex] = nw >> 16 & 0xFF;
                dst[dstIndex + 1] = nw >> 8 & 0xFF;
                dst[dstIndex + 2] = nw & 0xFF;
                dst[dstIndex + 3] = nw >> 24 & 0xFF;
                return;
            }
        }

        cx = 1 - wx;
        cy = 1 - wy;
        r = ((nw >> 16 & 0xFF) * cx + (ne >> 16 & 0xFF) * wx) * cy + ((sw >> 16 & 0xFF) * cx + (se >> 16 & 0xFF) * wx) * wy;
        g = ((nw >> 8 & 0xFF) * cx + (ne >> 8 & 0xFF) * wx) * cy + ((sw >> 8 & 0xFF) * cx + (se >> 8 & 0xFF) * wx) * wy;
        b = ((nw & 0xFF) * cx + (ne & 0xFF) * wx) * cy + ((sw & 0xFF) * cx + (se & 0xFF) * wx) * wy;
        a = ((nw >> 24 & 0xFF) * cx + (ne >> 24 & 0xFF) * wx) * cy + ((sw >> 24 & 0xFF) * cx + (se >> 24 & 0xFF) * wx) * wy;

        dst[dstIndex] = r > 255 ? 255 : r < 0 ? 0 : r | 0;
        dst[dstIndex + 1] = g > 255 ? 255 : g < 0 ? 0 : g | 0;
        dst[dstIndex + 2] = b > 255 ? 255 : b < 0 ? 0 : b | 0;
        dst[dstIndex + 3] = a > 255 ? 255 : a < 0 ? 0 : a | 0;
    },
    /**
     * @param r 0 <= n <= 255
     * @param g 0 <= n <= 255
     * @param b 0 <= n <= 255
     * @return Array(h, s, l)
     */
    rgbToHsl: function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        //        var max = Math.max(r, g, b),
        //            min = Math.min(r, g, b),
        var max = r > g ? r > b ? r : b : g > b ? g : b,
            min = r < g ? r < b ? r : b : g < b ? g : b,
            chroma = max - min,
            h = 0,
            s = 0,

        // Lightness
        l = (min + max) / 2;

        if (chroma !== 0) {
            // Hue
            if (r === max) {
                h = (g - b) / chroma + (g < b ? 6 : 0);
            } else if (g === max) {
                h = (b - r) / chroma + 2;
            } else {
                h = (r - g) / chroma + 4;
            }
            h /= 6;

            // Saturation
            s = l > 0.5 ? chroma / (2 - max - min) : chroma / (max + min);
        }

        return [h, s, l];
    },
    /**
     * @param h 0.0 <= n <= 1.0
     * @param s 0.0 <= n <= 1.0
     * @param l 0.0 <= n <= 1.0
     * @return Array(r, g, b)
     */
    hslToRgb: function hslToRgb(h, s, l) {
        var m1,
            m2,
            hue,
            r,
            g,
            b,
            rgb = [];

        if (s === 0) {
            r = g = b = l * 255 + 0.5 | 0;
            rgb = [r, g, b];
        } else {
            if (l <= 0.5) {
                m2 = l * (s + 1);
            } else {
                m2 = l + s - l * s;
            }

            m1 = l * 2 - m2;
            hue = h + 1 / 3;

            var tmp;
            for (var i = 0; i < 3; i += 1) {
                if (hue < 0) {
                    hue += 1;
                } else if (hue > 1) {
                    hue -= 1;
                }

                if (6 * hue < 1) {
                    tmp = m1 + (m2 - m1) * hue * 6;
                } else if (2 * hue < 1) {
                    tmp = m2;
                } else if (3 * hue < 2) {
                    tmp = m1 + (m2 - m1) * (2 / 3 - hue) * 6;
                } else {
                    tmp = m1;
                }

                rgb[i] = tmp * 255 + 0.5 | 0;

                hue -= 1 / 3;
            }
        }

        return rgb;
    }
};

// TODO
ImageFilters.Translate = function (srcImageData, x, y, interpolation) {};
ImageFilters.Scale = function (srcImageData, scaleX, scaleY, interpolation) {};
ImageFilters.Rotate = function (srcImageData, originX, originY, angle, resize, interpolation) {};
ImageFilters.Affine = function (srcImageData, matrix, resize, interpolation) {};
ImageFilters.UnsharpMask = function (srcImageData, level) {};

ImageFilters.ConvolutionFilter = function (srcImageData, matrixX, matrixY, matrix, divisor, bias, preserveAlpha, clamp, color, alpha) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    divisor = divisor || 1;
    bias = bias || 0;

    // default true
    preserveAlpha !== false && (preserveAlpha = true);
    clamp !== false && (clamp = true);

    color = color || 0;
    alpha = alpha || 0;

    var index = 0,
        rows = matrixX >> 1,
        cols = matrixY >> 1,
        clampR = color >> 16 & 0xFF,
        clampG = color >> 8 & 0xFF,
        clampB = color & 0xFF,
        clampA = alpha * 0xFF;

    for (var y = 0; y < srcHeight; y += 1) {
        for (var x = 0; x < srcWidth; x += 1, index += 4) {
            var r = 0,
                g = 0,
                b = 0,
                a = 0,
                replace = false,
                mIndex = 0,
                v;

            for (var row = -rows; row <= rows; row += 1) {
                var rowIndex = y + row,
                    offset;

                if (0 <= rowIndex && rowIndex < srcHeight) {
                    offset = rowIndex * srcWidth;
                } else if (clamp) {
                    offset = y * srcWidth;
                } else {
                    replace = true;
                }

                for (var col = -cols; col <= cols; col += 1) {
                    var m = matrix[mIndex++];

                    if (m !== 0) {
                        var colIndex = x + col;

                        if (!(0 <= colIndex && colIndex < srcWidth)) {
                            if (clamp) {
                                colIndex = x;
                            } else {
                                replace = true;
                            }
                        }

                        if (replace) {
                            r += m * clampR;
                            g += m * clampG;
                            b += m * clampB;
                            a += m * clampA;
                        } else {
                            var p = offset + colIndex << 2;
                            r += m * srcPixels[p];
                            g += m * srcPixels[p + 1];
                            b += m * srcPixels[p + 2];
                            a += m * srcPixels[p + 3];
                        }
                    }
                }
            }

            dstPixels[index] = (v = r / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
            dstPixels[index + 1] = (v = g / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
            dstPixels[index + 2] = (v = b / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
            dstPixels[index + 3] = preserveAlpha ? srcPixels[index + 3] : (v = a / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
        }
    }

    return dstImageData;
};

/**
 * @param threshold 0.0 <= n <= 1.0
 */
ImageFilters.Binarize = function (srcImageData, threshold) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    if (isNaN(threshold)) {
        threshold = 0.5;
    }

    threshold *= 255;

    for (var i = 0; i < srcLength; i += 4) {
        var avg = srcPixels[i] + srcPixels[i + 1] + srcPixels[i + 2] / 3;

        dstPixels[i] = dstPixels[i + 1] = dstPixels[i + 2] = avg <= threshold ? 0 : 255;
        dstPixels[i + 3] = 255;
    }

    return dstImageData;
};

ImageFilters.BlendAdd = function (srcImageData, blendImageData, dx, dy) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data,
        blendPixels = blendImageData.data;

    var v;

    for (var i = 0; i < srcLength; i += 4) {
        dstPixels[i] = (v = srcPixels[i] + blendPixels[i]) > 255 ? 255 : v;
        dstPixels[i + 1] = (v = srcPixels[i + 1] + blendPixels[i + 1]) > 255 ? 255 : v;
        dstPixels[i + 2] = (v = srcPixels[i + 2] + blendPixels[i + 2]) > 255 ? 255 : v;
        dstPixels[i + 3] = 255;
    }

    return dstImageData;
};

ImageFilters.BlendSubtract = function (srcImageData, blendImageData, dx, dy) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data,
        blendPixels = blendImageData.data;

    var v;

    for (var i = 0; i < srcLength; i += 4) {
        dstPixels[i] = (v = srcPixels[i] - blendPixels[i]) < 0 ? 0 : v;
        dstPixels[i + 1] = (v = srcPixels[i + 1] - blendPixels[i + 1]) < 0 ? 0 : v;
        dstPixels[i + 2] = (v = srcPixels[i + 2] - blendPixels[i + 2]) < 0 ? 0 : v;
        dstPixels[i + 3] = 255;
    }

    return dstImageData;
};

/**
 * Algorithm based on BoxBlurFilter.java by Huxtable.com
 * @see http://www.jhlabs.com/ip/blurring.html
 * Copyright 2005 Huxtable.com. All rights reserved.
 */
ImageFilters.BoxBlur = function () {
    var blur = function blur(src, dst, width, height, radius) {
        var tableSize = radius * 2 + 1;
        var radiusPlus1 = radius + 1;
        var widthMinus1 = width - 1;

        var r, g, b, a;

        var srcIndex = 0;
        var dstIndex;
        var p, next, prev;
        var i, l, x, y, nextIndex, prevIndex;

        var sumTable = [];
        for (i = 0, l = 256 * tableSize; i < l; i += 1) {
            sumTable[i] = i / tableSize | 0;
        }

        for (y = 0; y < height; y += 1) {
            r = g = b = a = 0;
            dstIndex = y;

            p = srcIndex << 2;
            r += radiusPlus1 * src[p];
            g += radiusPlus1 * src[p + 1];
            b += radiusPlus1 * src[p + 2];
            a += radiusPlus1 * src[p + 3];

            for (i = 1; i <= radius; i += 1) {
                p = srcIndex + (i < width ? i : widthMinus1) << 2;
                r += src[p];
                g += src[p + 1];
                b += src[p + 2];
                a += src[p + 3];
            }

            for (x = 0; x < width; x += 1) {
                p = dstIndex << 2;
                dst[p] = sumTable[r];
                dst[p + 1] = sumTable[g];
                dst[p + 2] = sumTable[b];
                dst[p + 3] = sumTable[a];

                nextIndex = x + radiusPlus1;
                if (nextIndex > widthMinus1) {
                    nextIndex = widthMinus1;
                }

                prevIndex = x - radius;
                if (prevIndex < 0) {
                    prevIndex = 0;
                }

                next = srcIndex + nextIndex << 2;
                prev = srcIndex + prevIndex << 2;

                r += src[next] - src[prev];
                g += src[next + 1] - src[prev + 1];
                b += src[next + 2] - src[prev + 2];
                a += src[next + 3] - src[prev + 3];

                dstIndex += height;
            }
            srcIndex += width;
        }
    };

    return function (srcImageData, hRadius, vRadius, quality) {
        var srcPixels = srcImageData.data,
            srcWidth = srcImageData.width,
            srcHeight = srcImageData.height,
            srcLength = srcPixels.length,
            dstImageData = this.utils.createImageData(srcWidth, srcHeight),
            dstPixels = dstImageData.data,
            tmpImageData = this.utils.createImageData(srcWidth, srcHeight),
            tmpPixels = tmpImageData.data;

        for (var i = 0; i < quality; i += 1) {
            // only use the srcPixels on the first loop
            blur(i ? dstPixels : srcPixels, tmpPixels, srcWidth, srcHeight, hRadius);
            blur(tmpPixels, dstPixels, srcHeight, srcWidth, vRadius);
        }

        return dstImageData;
    };
}();

/**
 * @ param strength 1 <= n <= 4
 */
ImageFilters.GaussianBlur = function (srcImageData, strength) {
    var size, matrix, divisor;

    switch (strength) {
        case 2:
            size = 5;
            matrix = [1, 1, 2, 1, 1, 1, 2, 4, 2, 1, 2, 4, 8, 4, 2, 1, 2, 4, 2, 1, 1, 1, 2, 1, 1];
            divisor = 52;
            break;
        case 3:
            size = 7;
            matrix = [1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 4, 2, 2, 1, 2, 2, 4, 8, 4, 2, 2, 2, 4, 8, 16, 8, 4, 2, 2, 2, 4, 8, 4, 2, 2, 1, 2, 2, 4, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1];
            divisor = 140;
            break;
        case 4:
            size = 15;
            matrix = [2, 2, 3, 4, 5, 5, 6, 6, 6, 5, 5, 4, 3, 2, 2, 2, 3, 4, 5, 7, 7, 8, 8, 8, 7, 7, 5, 4, 3, 2, 3, 4, 6, 7, 9, 10, 10, 11, 10, 10, 9, 7, 6, 4, 3, 4, 5, 7, 9, 10, 12, 13, 13, 13, 12, 10, 9, 7, 5, 4, 5, 7, 9, 11, 13, 14, 15, 16, 15, 14, 13, 11, 9, 7, 5, 5, 7, 10, 12, 14, 16, 17, 18, 17, 16, 14, 12, 10, 7, 5, 6, 8, 10, 13, 15, 17, 19, 19, 19, 17, 15, 13, 10, 8, 6, 6, 8, 11, 13, 16, 18, 19, 20, 19, 18, 16, 13, 11, 8, 6, 6, 8, 10, 13, 15, 17, 19, 19, 19, 17, 15, 13, 10, 8, 6, 5, 7, 10, 12, 14, 16, 17, 18, 17, 16, 14, 12, 10, 7, 5, 5, 7, 9, 11, 13, 14, 15, 16, 15, 14, 13, 11, 9, 7, 5, 4, 5, 7, 9, 10, 12, 13, 13, 13, 12, 10, 9, 7, 5, 4, 3, 4, 6, 7, 9, 10, 10, 11, 10, 10, 9, 7, 6, 4, 3, 2, 3, 4, 5, 7, 7, 8, 8, 8, 7, 7, 5, 4, 3, 2, 2, 2, 3, 4, 5, 5, 6, 6, 6, 5, 5, 4, 3, 2, 2];
            divisor = 2044;
            break;
        default:
            size = 3;
            matrix = [1, 2, 1, 2, 4, 2, 1, 2, 1];
            divisor = 16;
            break;
    }
    return this.ConvolutionFilter(srcImageData, size, size, matrix, divisor, 0, false);
};

/**
 * Stack Blur Algorithm by Mario Klingemann <mario@quasimondo.com>
 * @see http://incubator.quasimondo.com/processing/fast_blur_deluxe.php
 */
/*
Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/
ImageFilters.StackBlur = function () {
    var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];

    var shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];

    function BlurStack() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
        this.next = null;
    }

    return function (srcImageData, radius) {
        var srcPixels = srcImageData.data,
            srcWidth = srcImageData.width,
            srcHeight = srcImageData.height,
            srcLength = srcPixels.length,
            dstImageData = this.Clone(srcImageData),
            dstPixels = dstImageData.data;

        var x,
            y,
            i,
            p,
            yp,
            yi,
            yw,
            r_sum,
            g_sum,
            b_sum,
            a_sum,
            r_out_sum,
            g_out_sum,
            b_out_sum,
            a_out_sum,
            r_in_sum,
            g_in_sum,
            b_in_sum,
            a_in_sum,
            pr,
            pg,
            pb,
            pa,
            rbs,
            div = radius + radius + 1,
            w4 = srcWidth << 2,
            widthMinus1 = srcWidth - 1,
            heightMinus1 = srcHeight - 1,
            radiusPlus1 = radius + 1,
            sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2,
            stackStart = new BlurStack(),
            stack = stackStart,
            stackIn,
            stackOut,
            stackEnd,
            mul_sum = mul_table[radius],
            shg_sum = shg_table[radius];

        for (i = 1; i < div; i += 1) {
            stack = stack.next = new BlurStack();
            if (i == radiusPlus1) {
                stackEnd = stack;
            }
        }

        stack.next = stackStart;
        yw = yi = 0;

        for (y = 0; y < srcHeight; y += 1) {
            r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

            r_out_sum = radiusPlus1 * (pr = dstPixels[yi]);
            g_out_sum = radiusPlus1 * (pg = dstPixels[yi + 1]);
            b_out_sum = radiusPlus1 * (pb = dstPixels[yi + 2]);
            a_out_sum = radiusPlus1 * (pa = dstPixels[yi + 3]);

            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;

            stack = stackStart;

            for (i = 0; i < radiusPlus1; i += 1) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }

            for (i = 1; i < radiusPlus1; i += 1) {
                p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                r_sum += (stack.r = pr = dstPixels[p]) * (rbs = radiusPlus1 - i);
                g_sum += (stack.g = pg = dstPixels[p + 1]) * rbs;
                b_sum += (stack.b = pb = dstPixels[p + 2]) * rbs;
                a_sum += (stack.a = pa = dstPixels[p + 3]) * rbs;

                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;

                stack = stack.next;
            }

            stackIn = stackStart;
            stackOut = stackEnd;

            for (x = 0; x < srcWidth; x += 1) {
                dstPixels[yi] = r_sum * mul_sum >> shg_sum;
                dstPixels[yi + 1] = g_sum * mul_sum >> shg_sum;
                dstPixels[yi + 2] = b_sum * mul_sum >> shg_sum;
                dstPixels[yi + 3] = a_sum * mul_sum >> shg_sum;

                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;

                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;

                p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;

                r_in_sum += stackIn.r = dstPixels[p];
                g_in_sum += stackIn.g = dstPixels[p + 1];
                b_in_sum += stackIn.b = dstPixels[p + 2];
                a_in_sum += stackIn.a = dstPixels[p + 3];

                r_sum += r_in_sum;
                g_sum += g_in_sum;
                b_sum += b_in_sum;
                a_sum += a_in_sum;

                stackIn = stackIn.next;

                r_out_sum += pr = stackOut.r;
                g_out_sum += pg = stackOut.g;
                b_out_sum += pb = stackOut.b;
                a_out_sum += pa = stackOut.a;

                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;

                stackOut = stackOut.next;

                yi += 4;
            }

            yw += srcWidth;
        }

        for (x = 0; x < srcWidth; x += 1) {
            g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

            yi = x << 2;
            r_out_sum = radiusPlus1 * (pr = dstPixels[yi]);
            g_out_sum = radiusPlus1 * (pg = dstPixels[yi + 1]);
            b_out_sum = radiusPlus1 * (pb = dstPixels[yi + 2]);
            a_out_sum = radiusPlus1 * (pa = dstPixels[yi + 3]);

            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;

            stack = stackStart;

            for (i = 0; i < radiusPlus1; i += 1) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }

            yp = srcWidth;

            for (i = 1; i <= radius; i += 1) {
                yi = yp + x << 2;

                r_sum += (stack.r = pr = dstPixels[yi]) * (rbs = radiusPlus1 - i);
                g_sum += (stack.g = pg = dstPixels[yi + 1]) * rbs;
                b_sum += (stack.b = pb = dstPixels[yi + 2]) * rbs;
                a_sum += (stack.a = pa = dstPixels[yi + 3]) * rbs;

                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;

                stack = stack.next;

                if (i < heightMinus1) {
                    yp += srcWidth;
                }
            }

            yi = x;
            stackIn = stackStart;
            stackOut = stackEnd;

            for (y = 0; y < srcHeight; y += 1) {
                p = yi << 2;
                dstPixels[p] = r_sum * mul_sum >> shg_sum;
                dstPixels[p + 1] = g_sum * mul_sum >> shg_sum;
                dstPixels[p + 2] = b_sum * mul_sum >> shg_sum;
                dstPixels[p + 3] = a_sum * mul_sum >> shg_sum;

                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;

                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;

                p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * srcWidth << 2;

                r_sum += r_in_sum += stackIn.r = dstPixels[p];
                g_sum += g_in_sum += stackIn.g = dstPixels[p + 1];
                b_sum += b_in_sum += stackIn.b = dstPixels[p + 2];
                a_sum += a_in_sum += stackIn.a = dstPixels[p + 3];

                stackIn = stackIn.next;

                r_out_sum += pr = stackOut.r;
                g_out_sum += pg = stackOut.g;
                b_out_sum += pb = stackOut.b;
                a_out_sum += pa = stackOut.a;

                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;

                stackOut = stackOut.next;

                yi += srcWidth;
            }
        }

        return dstImageData;
    };
}();

/**
 * TV based algorithm
 */
ImageFilters.Brightness = function (srcImageData, brightness) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    this.utils.mapRGB(srcPixels, dstPixels, function (value) {
        value += brightness;
        return value > 255 ? 255 : value;
    });

    return dstImageData;
};

/**
 * GIMP algorithm modified. pretty close to fireworks
 * @param brightness -100 <= n <= 100
 * @param contrast -100 <= n <= 100
 */
ImageFilters.BrightnessContrastGimp = function (srcImageData, brightness, contrast) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data,
        p4 = Math.PI / 4;

    // fix to -1 <= n <= 1
    brightness /= 100;

    // fix to -99 <= n <= 99
    contrast *= 0.99;
    // fix to -1 < n < 1
    contrast /= 100;
    // apply GIMP formula
    contrast = Math.tan((contrast + 1) * p4);

    // get the average color
    for (var avg = 0, i = 0; i < srcLength; i += 4) {
        avg += srcPixels[i] * 19595 + srcPixels[i + 1] * 38470 + srcPixels[i + 2] * 7471 >> 16;
    }
    avg = avg / (srcLength / 4);

    this.utils.mapRGB(srcPixels, dstPixels, function (value) {
        if (brightness < 0) {
            value = value * (1 + brightness);
        } else if (brightness > 0) {
            value = value + (255 - value) * brightness;
        }
        //value += brightness;

        if (contrast !== 0) {
            value = (value - avg) * contrast + avg;
        }
        return value + 0.5 | 0;
    });
    return dstImageData;
};

/**
 * more like the new photoshop algorithm
 * @param brightness -100 <= n <= 100
 * @param contrast -100 <= n <= 100
 */
ImageFilters.BrightnessContrastPhotoshop = function (srcImageData, brightness, contrast) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    // fix to 0 <= n <= 2;
    brightness = (brightness + 100) / 100;
    contrast = (contrast + 100) / 100;

    this.utils.mapRGB(srcPixels, dstPixels, function (value) {
        value *= brightness;
        value = (value - 127.5) * contrast + 127.5;
        return value + 0.5 | 0;
    });
    return dstImageData;
};

ImageFilters.Channels = function (srcImageData, channel) {
    var matrix;

    switch (channel) {
        case 2:
            // green
            matrix = [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0];
            break;
        case 3:
            // blue
            matrix = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
            break;
        default:
            // red
            matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
            break;

    }

    return this.ColorMatrixFilter(srcImageData, matrix);
};

ImageFilters.Clone = function (srcImageData) {
    return this.Copy(srcImageData, this.utils.createImageData(srcImageData.width, srcImageData.height));
};

/**
 * slower
 */
ImageFilters.CloneBuiltin = function (srcImageData) {
    var srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        canvas = this.utils.getSampleCanvas(),
        context = this.utils.getSampleContext(),
        dstImageData;

    canvas.width = srcWidth;
    canvas.height = srcHeight;

    context.putImageData(srcImageData, 0, 0);
    dstImageData = context.getImageData(0, 0, srcWidth, srcHeight);

    canvas.width = 0;
    canvas.height = 0;

    return dstImageData;
};

ImageFilters.ColorMatrixFilter = function (srcImageData, matrix) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    var m0 = matrix[0],
        m1 = matrix[1],
        m2 = matrix[2],
        m3 = matrix[3],
        m4 = matrix[4],
        m5 = matrix[5],
        m6 = matrix[6],
        m7 = matrix[7],
        m8 = matrix[8],
        m9 = matrix[9],
        m10 = matrix[10],
        m11 = matrix[11],
        m12 = matrix[12],
        m13 = matrix[13],
        m14 = matrix[14],
        m15 = matrix[15],
        m16 = matrix[16],
        m17 = matrix[17],
        m18 = matrix[18],
        m19 = matrix[19];

    var value, i, r, g, b, a;
    for (i = 0; i < srcLength; i += 4) {
        r = srcPixels[i];
        g = srcPixels[i + 1];
        b = srcPixels[i + 2];
        a = srcPixels[i + 3];

        dstPixels[i] = (value = r * m0 + g * m1 + b * m2 + a * m3 + m4) > 255 ? 255 : value < 0 ? 0 : value | 0;
        dstPixels[i + 1] = (value = r * m5 + g * m6 + b * m7 + a * m8 + m9) > 255 ? 255 : value < 0 ? 0 : value | 0;
        dstPixels[i + 2] = (value = r * m10 + g * m11 + b * m12 + a * m13 + m14) > 255 ? 255 : value < 0 ? 0 : value | 0;
        dstPixels[i + 3] = (value = r * m15 + g * m16 + b * m17 + a * m18 + m19) > 255 ? 255 : value < 0 ? 0 : value | 0;
    }

    return dstImageData;
};

ImageFilters.ColorTransformFilter = function (srcImageData, redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    var i, v;
    for (i = 0; i < srcLength; i += 4) {
        dstPixels[i] = (v = srcPixels[i] * redMultiplier + redOffset) > 255 ? 255 : v < 0 ? 0 : v;
        dstPixels[i + 1] = (v = srcPixels[i + 1] * greenMultiplier + greenOffset) > 255 ? 255 : v < 0 ? 0 : v;
        dstPixels[i + 2] = (v = srcPixels[i + 2] * blueMultiplier + blueOffset) > 255 ? 255 : v < 0 ? 0 : v;
        dstPixels[i + 3] = (v = srcPixels[i + 3] * alphaMultiplier + alphaOffset) > 255 ? 255 : v < 0 ? 0 : v;
    }

    return dstImageData;
};

ImageFilters.Copy = function (srcImageData, dstImageData) {
    var srcPixels = srcImageData.data,
        srcLength = srcPixels.length,
        dstPixels = dstImageData.data;

    while (srcLength--) {
        dstPixels[srcLength] = srcPixels[srcLength];
    }

    return dstImageData;
};

ImageFilters.Crop = function (srcImageData, x, y, width, height) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(width, height),
        dstPixels = dstImageData.data;

    var srcLeft = Math.max(x, 0),
        srcTop = Math.max(y, 0),
        srcRight = Math.min(x + width, srcWidth),
        srcBottom = Math.min(y + height, srcHeight),
        dstLeft = srcLeft - x,
        dstTop = srcTop - y,
        srcRow,
        srcCol,
        srcIndex,
        dstIndex;

    for (srcRow = srcTop, dstRow = dstTop; srcRow < srcBottom; srcRow += 1, dstRow += 1) {
        for (srcCol = srcLeft, dstCol = dstLeft; srcCol < srcRight; srcCol += 1, dstCol += 1) {
            srcIndex = srcRow * srcWidth + srcCol << 2;
            dstIndex = dstRow * width + dstCol << 2;
            dstPixels[dstIndex] = srcPixels[srcIndex];
            dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
            dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
            dstPixels[dstIndex + 3] = srcPixels[srcIndex + 3];
        }
    }

    return dstImageData;
};

ImageFilters.CropBuiltin = function (srcImageData, x, y, width, height) {
    var srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        canvas = this.utils.getSampleCanvas(),
        context = this.utils.getSampleContext();

    canvas.width = srcWidth;
    canvas.height = srcHeight;
    context.putImageData(srcImageData, 0, 0);
    var result = context.getImageData(x, y, width, height);

    canvas.width = 0;
    canvas.height = 0;

    return result;
};

/**
 * sets to the average of the highest and lowest contrast
 */
ImageFilters.Desaturate = function (srcImageData) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    for (var i = 0; i < srcLength; i += 4) {
        var r = srcPixels[i],
            g = srcPixels[i + 1],
            b = srcPixels[i + 2],
            max = r > g ? r > b ? r : b : g > b ? g : b,
            min = r < g ? r < b ? r : b : g < b ? g : b,
            avg = (max + min) / 2 + 0.5 | 0;

        dstPixels[i] = dstPixels[i + 1] = dstPixels[i + 2] = avg;
        dstPixels[i + 3] = srcPixels[i + 3];
    }

    return dstImageData;
};

/**
 * TODO: use bilinear
 */
ImageFilters.DisplacementMapFilter = function (srcImageData, mapImageData, mapX, mapY, componentX, componentY, scaleX, scaleY, mode) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,

    //        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
    dstImageData = ImageFilters.Clone(srcImageData),
        dstPixels = dstImageData.data;

    mapX || (mapX = 0);
    mapY || (mapY = 0);
    componentX || (componentX = 0); // red?
    componentY || (componentY = 0);
    scaleX || (scaleX = 0);
    scaleY || (scaleY = 0);
    mode || (mode = 2); // wrap

    var mapWidth = mapImageData.width,
        mapHeight = mapImageData.height,
        mapPixels = mapImageData.data,
        mapRight = mapWidth + mapX,
        mapBottom = mapHeight + mapY,
        dstIndex,
        srcIndex,
        mapIndex,
        cx,
        cy,
        tx,
        ty,
        x,
        y;

    for (x = 0; x < srcWidth; x += 1) {
        for (y = 0; y < srcHeight; y += 1) {

            dstIndex = y * srcWidth + x << 2;

            if (x < mapX || y < mapY || x >= mapRight || y >= mapBottom) {
                // out of the map bounds
                // copy src to dst
                srcIndex = dstIndex;
            } else {
                // apply map
                mapIndex = (y - mapY) * mapWidth + (x - mapX) << 2;

                // tx = x + ((componentX(x, y) - 128) * scaleX) / 256
                cx = mapPixels[mapIndex + componentX];
                tx = x + ((cx - 128) * scaleX >> 8);

                // tx = y + ((componentY(x, y) - 128) * scaleY) / 256
                cy = mapPixels[mapIndex + componentY];
                ty = y + ((cy - 128) * scaleY >> 8);

                srcIndex = ImageFilters.utils.getPixelIndex(tx + 0.5 | 0, ty + 0.5 | 0, srcWidth, srcHeight, mode);
                if (srcIndex === null) {
                    // if mode == ignore and (tx,ty) is out of src bounds
                    // then copy (x,y) to dst
                    srcIndex = dstIndex;
                }
            }

            dstPixels[dstIndex] = srcPixels[srcIndex];
            dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
            dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
            dstPixels[dstIndex + 3] = srcPixels[srcIndex + 3];
        }
    }

    return dstImageData;
};

/**
 * Floyd-Steinberg algorithm
 * @param levels 2 <= n <= 255
 */
ImageFilters.Dither = function (srcImageData, levels) {
    var srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        dstImageData = this.Clone(srcImageData),
        dstPixels = dstImageData.data;

    levels = levels < 2 ? 2 : levels > 255 ? 255 : levels;

    // Build a color map using the same algorithm as the posterize filter.
    var posterize,
        levelMap = [],
        levelsMinus1 = levels - 1,
        j = 0,
        k = 0,
        i;

    for (i = 0; i < levels; i += 1) {
        levelMap[i] = 255 * i / levelsMinus1;
    }

    posterize = this.utils.buildMap(function (value) {
        var ret = levelMap[j];

        k += levels;

        if (k > 255) {
            k -= 255;
            j += 1;
        }

        return ret;
    });

    // Apply the dithering algorithm to each pixel
    var x,
        y,
        index,
        old_r,
        old_g,
        old_b,
        new_r,
        new_g,
        new_b,
        err_r,
        err_g,
        err_b,
        nbr_r,
        nbr_g,
        nbr_b,
        srcWidthMinus1 = srcWidth - 1,
        srcHeightMinus1 = srcHeight - 1,
        A = 7 / 16,
        B = 3 / 16,
        C = 5 / 16,
        D = 1 / 16;

    for (y = 0; y < srcHeight; y += 1) {
        for (x = 0; x < srcWidth; x += 1) {
            // Get the current pixel.
            index = y * srcWidth + x << 2;

            old_r = dstPixels[index];
            old_g = dstPixels[index + 1];
            old_b = dstPixels[index + 2];

            // Quantize using the color map
            new_r = posterize[old_r];
            new_g = posterize[old_g];
            new_b = posterize[old_b];

            // Set the current pixel.
            dstPixels[index] = new_r;
            dstPixels[index + 1] = new_g;
            dstPixels[index + 2] = new_b;

            // Quantization errors
            err_r = old_r - new_r;
            err_g = old_g - new_g;
            err_b = old_b - new_b;

            // Apply the matrix.
            // x + 1, y
            index += 1 << 2;
            if (x < srcWidthMinus1) {
                nbr_r = dstPixels[index] + A * err_r;
                nbr_g = dstPixels[index + 1] + A * err_g;
                nbr_b = dstPixels[index + 2] + A * err_b;

                dstPixels[index] = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
                dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
                dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
            }

            // x - 1, y + 1
            index += srcWidth - 2 << 2;
            if (x > 0 && y < srcHeightMinus1) {
                nbr_r = dstPixels[index] + B * err_r;
                nbr_g = dstPixels[index + 1] + B * err_g;
                nbr_b = dstPixels[index + 2] + B * err_b;

                dstPixels[index] = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
                dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
                dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
            }

            // x, y + 1
            index += 1 << 2;
            if (y < srcHeightMinus1) {
                nbr_r = dstPixels[index] + C * err_r;
                nbr_g = dstPixels[index + 1] + C * err_g;
                nbr_b = dstPixels[index + 2] + C * err_b;

                dstPixels[index] = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
                dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
                dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
            }

            // x + 1, y + 1
            index += 1 << 2;
            if (x < srcWidthMinus1 && y < srcHeightMinus1) {
                nbr_r = dstPixels[index] + D * err_r;
                nbr_g = dstPixels[index + 1] + D * err_g;
                nbr_b = dstPixels[index + 2] + D * err_b;

                dstPixels[index] = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
                dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
                dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
            }
        }
    }

    return dstImageData;
};

ImageFilters.Edge = function (srcImageData) {
    //pretty close to Fireworks 'Find Edges' effect
    return this.ConvolutionFilter(srcImageData, 3, 3, [-1, -1, -1, -1, 8, -1, -1, -1, -1]);
};

ImageFilters.Emboss = function (srcImageData) {
    return this.ConvolutionFilter(srcImageData, 3, 3, [-2, -1, 0, -1, 1, 1, 0, 1, 2]);
};

ImageFilters.Enrich = function (srcImageData) {
    return this.ConvolutionFilter(srcImageData, 3, 3, [0, -2, 0, -2, 20, -2, 0, -2, 0], 10, -40);
};

ImageFilters.Flip = function (srcImageData, vertical) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    var x, y, srcIndex, dstIndex, i;

    for (y = 0; y < srcHeight; y += 1) {
        for (x = 0; x < srcWidth; x += 1) {
            srcIndex = y * srcWidth + x << 2;
            if (vertical) {
                dstIndex = (srcHeight - y - 1) * srcWidth + x << 2;
            } else {
                dstIndex = y * srcWidth + (srcWidth - x - 1) << 2;
            }

            dstPixels[dstIndex] = srcPixels[srcIndex];
            dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
            dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
            dstPixels[dstIndex + 3] = srcPixels[srcIndex + 3];
        }
    }

    return dstImageData;
};

ImageFilters.Gamma = function (srcImageData, gamma) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    this.utils.mapRGB(srcPixels, dstPixels, function (value) {
        value = 255 * Math.pow(value / 255, 1 / gamma) + 0.5;
        return value > 255 ? 255 : value + 0.5 | 0;
    });

    return dstImageData;
};

ImageFilters.GrayScale = function (srcImageData) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    for (var i = 0; i < srcLength; i += 4) {
        var intensity = srcPixels[i] * 19595 + srcPixels[i + 1] * 38470 + srcPixels[i + 2] * 7471 >> 16;
        //var intensity = (srcPixels[i] * 0.3086 + srcPixels[i + 1] * 0.6094 + srcPixels[i + 2] * 0.0820) | 0;
        dstPixels[i] = dstPixels[i + 1] = dstPixels[i + 2] = intensity;
        dstPixels[i + 3] = srcPixels[i + 3];
    }

    return dstImageData;
};

/**
 * @param hueDelta  -180 <= n <= 180
 * @param satDelta  -100 <= n <= 100
 * @param lightness -100 <= n <= 100
 */
ImageFilters.HSLAdjustment = function (srcImageData, hueDelta, satDelta, lightness) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    hueDelta /= 360;
    satDelta /= 100;
    lightness /= 100;

    var rgbToHsl = this.utils.rgbToHsl;
    var hslToRgb = this.utils.hslToRgb;
    var h, s, l, hsl, rgb, i;

    for (i = 0; i < srcLength; i += 4) {
        // convert to HSL
        hsl = rgbToHsl(srcPixels[i], srcPixels[i + 1], srcPixels[i + 2]);

        // hue
        h = hsl[0] + hueDelta;
        while (h < 0) {
            h += 1;
        }
        while (h > 1) {
            h -= 1;
        }

        // saturation
        s = hsl[1] + hsl[1] * satDelta;
        if (s < 0) {
            s = 0;
        } else if (s > 1) {
            s = 1;
        }

        // lightness
        l = hsl[2];
        if (lightness > 0) {
            l += (1 - l) * lightness;
        } else if (lightness < 0) {
            l += l * lightness;
        }

        // convert back to rgb
        rgb = hslToRgb(h, s, l);

        dstPixels[i] = rgb[0];
        dstPixels[i + 1] = rgb[1];
        dstPixels[i + 2] = rgb[2];
        dstPixels[i + 3] = srcPixels[i + 3];
    }

    return dstImageData;
};

ImageFilters.Invert = function (srcImageData) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    this.utils.mapRGB(srcPixels, dstPixels, function (value) {
        return 255 - value;
    });

    return dstImageData;
};

ImageFilters.Mosaic = function (srcImageData, blockSize) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    var cols = Math.ceil(srcWidth / blockSize),
        rows = Math.ceil(srcHeight / blockSize),
        row,
        col,
        x_start,
        x_end,
        y_start,
        y_end,
        x,
        y,
        yIndex,
        index,
        size,
        r,
        g,
        b,
        a;

    for (row = 0; row < rows; row += 1) {
        y_start = row * blockSize;
        y_end = y_start + blockSize;

        if (y_end > srcHeight) {
            y_end = srcHeight;
        }

        for (col = 0; col < cols; col += 1) {
            x_start = col * blockSize;
            x_end = x_start + blockSize;

            if (x_end > srcWidth) {
                x_end = srcWidth;
            }

            // get the average color from the src
            r = g = b = a = 0;
            size = (x_end - x_start) * (y_end - y_start);

            for (y = y_start; y < y_end; y += 1) {
                yIndex = y * srcWidth;

                for (x = x_start; x < x_end; x += 1) {
                    index = yIndex + x << 2;
                    r += srcPixels[index];
                    g += srcPixels[index + 1];
                    b += srcPixels[index + 2];
                    a += srcPixels[index + 3];
                }
            }

            r = r / size + 0.5 | 0;
            g = g / size + 0.5 | 0;
            b = b / size + 0.5 | 0;
            a = a / size + 0.5 | 0;

            // fill the dst with that color
            for (y = y_start; y < y_end; y += 1) {
                yIndex = y * srcWidth;

                for (x = x_start; x < x_end; x += 1) {
                    index = yIndex + x << 2;
                    dstPixels[index] = r;
                    dstPixels[index + 1] = g;
                    dstPixels[index + 2] = b;
                    dstPixels[index + 3] = a;
                }
            }
        }
    }

    return dstImageData;
};

/**
 * @param range  1 <= n <= 5
 * @param levels 1 <= n <= 256
 */
ImageFilters.Oil = function (srcImageData, range, levels) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    var index = 0,
        rh = [],
        gh = [],
        bh = [],
        rt = [],
        gt = [],
        bt = [],
        x,
        y,
        i,
        row,
        col,
        rowIndex,
        colIndex,
        offset,
        srcIndex,
        sr,
        sg,
        sb,
        ri,
        gi,
        bi,
        r,
        g,
        b;

    for (y = 0; y < srcHeight; y += 1) {
        for (x = 0; x < srcWidth; x += 1) {
            for (i = 0; i < levels; i += 1) {
                rh[i] = gh[i] = bh[i] = rt[i] = gt[i] = bt[i] = 0;
            }

            for (row = -range; row <= range; row += 1) {
                rowIndex = y + row;

                if (rowIndex < 0 || rowIndex >= srcHeight) {
                    continue;
                }

                offset = rowIndex * srcWidth;

                for (col = -range; col <= range; col += 1) {
                    colIndex = x + col;
                    if (colIndex < 0 || colIndex >= srcWidth) {
                        continue;
                    }

                    srcIndex = offset + colIndex << 2;
                    sr = srcPixels[srcIndex];
                    sg = srcPixels[srcIndex + 1];
                    sb = srcPixels[srcIndex + 2];
                    ri = sr * levels >> 8;
                    gi = sg * levels >> 8;
                    bi = sb * levels >> 8;
                    rt[ri] += sr;
                    gt[gi] += sg;
                    bt[bi] += sb;
                    rh[ri] += 1;
                    gh[gi] += 1;
                    bh[bi] += 1;
                }
            }

            r = g = b = 0;
            for (i = 1; i < levels; i += 1) {
                if (rh[i] > rh[r]) {
                    r = i;
                }
                if (gh[i] > gh[g]) {
                    g = i;
                }
                if (bh[i] > bh[b]) {
                    b = i;
                }
            }

            dstPixels[index] = rt[r] / rh[r] | 0;
            dstPixels[index + 1] = gt[g] / gh[g] | 0;
            dstPixels[index + 2] = bt[b] / bh[b] | 0;
            dstPixels[index + 3] = srcPixels[index + 3];
            index += 4;
        }
    }

    return dstImageData;
};

ImageFilters.OpacityFilter = function (srcImageData, opacity) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    for (var i = 0; i < srcLength; i += 4) {
        dstPixels[i] = srcPixels[i];
        dstPixels[i + 1] = srcPixels[i + 1];
        dstPixels[i + 2] = srcPixels[i + 2];
        dstPixels[i + 3] = opacity;
    }

    return dstImageData;
};

/**
 * @param levels 2 <= n <= 255
 */
ImageFilters.Posterize = function (srcImageData, levels) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    levels = levels < 2 ? 2 : levels > 255 ? 255 : levels;

    var levelMap = [],
        levelsMinus1 = levels - 1,
        j = 0,
        k = 0,
        i;

    for (i = 0; i < levels; i += 1) {
        levelMap[i] = 255 * i / levelsMinus1;
    }

    this.utils.mapRGB(srcPixels, dstPixels, function (value) {
        var ret = levelMap[j];

        k += levels;

        if (k > 255) {
            k -= 255;
            j += 1;
        }

        return ret;
    });

    return dstImageData;
};

/**
 * @param scale 0.0 <= n <= 5.0
 */
ImageFilters.Rescale = function (srcImageData, scale) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    this.utils.mapRGB(srcPixels, dstPixels, function (value) {
        value *= scale;
        return value > 255 ? 255 : value + 0.5 | 0;
    });

    return dstImageData;
};

/**
 * Nearest neighbor
 */
ImageFilters.ResizeNearestNeighbor = function (srcImageData, width, height) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(width, height),
        dstPixels = dstImageData.data;

    var xFactor = srcWidth / width,
        yFactor = srcHeight / height,
        dstIndex = 0,
        srcIndex,
        x,
        y,
        offset;

    for (y = 0; y < height; y += 1) {
        offset = (y * yFactor | 0) * srcWidth;

        for (x = 0; x < width; x += 1) {
            srcIndex = offset + x * xFactor << 2;

            dstPixels[dstIndex] = srcPixels[srcIndex];
            dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
            dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
            dstPixels[dstIndex + 3] = srcPixels[srcIndex + 3];
            dstIndex += 4;
        }
    }

    return dstImageData;
};

/**
 * Bilinear
 */
ImageFilters.Resize = function (srcImageData, width, height) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(width, height),
        dstPixels = dstImageData.data;

    var xFactor = srcWidth / width,
        yFactor = srcHeight / height,
        dstIndex = 0,
        x,
        y;

    for (y = 0; y < height; y += 1) {
        for (x = 0; x < width; x += 1) {
            this.utils.copyBilinear(srcPixels, x * xFactor, y * yFactor, srcWidth, srcHeight, dstPixels, dstIndex, 0);
            dstIndex += 4;
        }
    }

    return dstImageData;
};

/**
 * faster resizing using the builtin context.scale()
 * the resizing algorithm may be different between browsers
 * this might not work if the image is transparent.
 * to fix that we probably need two contexts
 */
ImageFilters.ResizeBuiltin = function (srcImageData, width, height) {
    var srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        canvas = this.utils.getSampleCanvas(),
        context = this.utils.getSampleContext(),
        dstImageData;

    canvas.width = Math.max(srcWidth, width);
    canvas.height = Math.max(srcHeight, height);
    context.save();

    context.putImageData(srcImageData, 0, 0);
    context.scale(width / srcWidth, height / srcHeight);
    context.drawImage(canvas, 0, 0);

    dstImageData = context.getImageData(0, 0, width, height);

    context.restore();
    canvas.width = 0;
    canvas.height = 0;

    return dstImageData;
};

ImageFilters.Sepia = function (srcImageData) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    var r, g, b, i, value;

    for (i = 0; i < srcLength; i += 4) {
        r = srcPixels[i];
        g = srcPixels[i + 1];
        b = srcPixels[i + 2];

        dstPixels[i] = (value = r * 0.393 + g * 0.769 + b * 0.189) > 255 ? 255 : value < 0 ? 0 : value + 0.5 | 0;
        dstPixels[i + 1] = (value = r * 0.349 + g * 0.686 + b * 0.168) > 255 ? 255 : value < 0 ? 0 : value + 0.5 | 0;
        dstPixels[i + 2] = (value = r * 0.272 + g * 0.534 + b * 0.131) > 255 ? 255 : value < 0 ? 0 : value + 0.5 | 0;
        dstPixels[i + 3] = srcPixels[i + 3];
    }

    return dstImageData;
};

/**
 * @param factor 1 <= n
 */
ImageFilters.Sharpen = function (srcImageData, factor) {
    //Convolution formula from VIGRA
    return this.ConvolutionFilter(srcImageData, 3, 3, [-factor / 16, -factor / 8, -factor / 16, -factor / 8, factor * 0.75 + 1, -factor / 8, -factor / 16, -factor / 8, -factor / 16]);
};

ImageFilters.Solarize = function (srcImageData) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    this.utils.mapRGB(srcPixels, dstPixels, function (value) {
        return value > 127 ? (value - 127.5) * 2 : (127.5 - value) * 2;
    });

    return dstImageData;
};

ImageFilters.Transpose = function (srcImageData) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcHeight, srcWidth),
        dstPixels = dstImageData.data;

    var srcIndex, dstIndex;

    for (y = 0; y < srcHeight; y += 1) {
        for (x = 0; x < srcWidth; x += 1) {
            srcIndex = y * srcWidth + x << 2;
            dstIndex = x * srcHeight + y << 2;

            dstPixels[dstIndex] = srcPixels[srcIndex];
            dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
            dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
            dstPixels[dstIndex + 3] = srcPixels[srcIndex + 3];
        }
    }

    return dstImageData;
};

/**
 * @param centerX 0.0 <= n <= 1.0
 * @param centerY 0.0 <= n <= 1.0
 * @param radius
 * @param angle(degree)
 * @param smooth
 */
ImageFilters.Twril = function (srcImageData, centerX, centerY, radius, angle, edge, smooth) {
    var srcPixels = srcImageData.data,
        srcWidth = srcImageData.width,
        srcHeight = srcImageData.height,
        srcLength = srcPixels.length,
        dstImageData = this.utils.createImageData(srcWidth, srcHeight),
        dstPixels = dstImageData.data;

    //convert position to px
    centerX = srcWidth * centerX;
    centerY = srcHeight * centerY;

    // degree to radian
    angle *= Math.PI / 180;

    var radius2 = radius * radius,
        max_y = srcHeight - 1,
        max_x = srcWidth - 1,
        dstIndex = 0,
        x,
        y,
        dx,
        dy,
        distance,
        a,
        tx,
        ty,
        srcIndex,
        pixel,
        i;

    for (y = 0; y < srcHeight; y += 1) {
        for (x = 0; x < srcWidth; x += 1) {
            dx = x - centerX;
            dy = y - centerY;
            distance = dx * dx + dy * dy;

            if (distance > radius2) {
                // out of the effected area. just copy the pixel
                dstPixels[dstIndex] = srcPixels[dstIndex];
                dstPixels[dstIndex + 1] = srcPixels[dstIndex + 1];
                dstPixels[dstIndex + 2] = srcPixels[dstIndex + 2];
                dstPixels[dstIndex + 3] = srcPixels[dstIndex + 3];
            } else {
                // main formula
                distance = Math.sqrt(distance);
                a = Math.atan2(dy, dx) + angle * (radius - distance) / radius;
                tx = centerX + distance * Math.cos(a);
                ty = centerY + distance * Math.sin(a);

                // copy target pixel
                if (smooth) {
                    // bilinear
                    this.utils.copyBilinear(srcPixels, tx, ty, srcWidth, srcHeight, dstPixels, dstIndex, edge);
                } else {
                    // nearest neighbor
                    // round tx, ty
                    // TODO edge actions!!
                    srcIndex = (ty + 0.5 | 0) * srcWidth + (tx + 0.5 | 0) << 2;
                    dstPixels[dstIndex] = srcPixels[srcIndex];
                    dstPixels[dstIndex + 1] = srcPixels[srcIndex + 1];
                    dstPixels[dstIndex + 2] = srcPixels[srcIndex + 2];
                    dstPixels[dstIndex + 3] = srcPixels[srcIndex + 3];
                }
            }

            dstIndex += 4;
        }
    }

    return dstImageData;
};

exports.default = ImageFilters;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var filterValue = [{
  name: 'HSLAdjustment',
  chooseValue: ['h', 's', 'l'],
  range: [{
    min: -180,
    max: 180,
    first: 0
  }, {
    min: -100,
    max: 100,
    first: 0
  }, {
    min: -100,
    max: 100,
    first: 0
  }]
}, {
  name: 'GrayScale',
  chooseValue: [],
  range: []
}, {
  name: 'Gamma',
  chooseValue: ['g'],
  range: [{
    min: 0,
    max: 3,
    first: 1
  }]
}, {
  name: 'BrightnessContrastGimp',
  chooseValue: ['b', 'c'],
  range: [{
    min: -100,
    max: 100,
    first: 30
  }, {
    min: -100,
    max: 100,
    first: 30
  }]
}, {
  name: 'Edge',
  chooseValue: [],
  range: []
}, {
  name: 'Emboss',
  chooseValue: [],
  range: []
}, {
  name: 'Invert',
  chooseValue: [],
  range: []
}, {
  name: 'Oil',
  chooseValue: ['r', 'l'],
  range: [{
    min: 1,
    max: 5,
    first: 2
  }, {
    min: 1,
    max: 255,
    first: 50
  }]
}, {
  name: 'Solarize',
  chooseValue: [],
  range: []
}, {
  name: 'Twril',
  chooseValue: ['cx', 'cy', 'r', 'angle', 'edge', 'smooth'],
  range: [{
    min: 0.5,
    max: 0.5,
    first: 0.5
  }, {
    min: 0.5,
    max: 0.5,
    first: 0.5
  }, {
    min: 10,
    max: 200,
    first: 100
  }, {
    min: -720,
    max: 720,
    first: 100
  }, {
    min: 0,
    max: 0,
    first: 'Clamp'
  }, {
    min: 1,
    max: 1,
    first: 1
  }]
}];

exports.default = {
  filterValue: filterValue
};

},{}]},{},[4])

//# sourceMappingURL=index.js.map
