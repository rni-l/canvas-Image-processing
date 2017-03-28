function ColorPicker(params) {
  this.oBox = params.oBox
  this.oBtnWrap = params.oBtnWrap
  this.oCan = params.oCan
  this.ctx = params.oCan.getContext('2d')
  this.oCan.width = params.width
  this.oCan.height = params.height
  this.w = this.oCan.width
  this.h = this.oCan.height
  this.lineW = 20 //外层颜色的厚度
  this.r = this.w / 2 //外圆半径
  this.r2 = this.r - this.lineW //内圆半径
    //内层颜色宽高,坐标
  this.iW = (this.r2 - 5) / Math.cos(2 * Math.PI / 360 * 45)
  this.iX = (this.w - this.iW) / 2
    //canvas的Left top值
  function getElemPos(obj) {
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
  var canPos = getElemPos(this.oCan)
  this.oCan_left = canPos.x
  this.oCan_top = canPos.y
  this.where = '' //点击时的位置
    //属性
  this.opts = {}
  this.callback = params.callback;
}

ColorPicker.prototype = {
  init: function() {
    //初始化
    //生成节点（内外层选择点）
    this.oBtnWrap.innerHTML = '<div class="insideBtn"></div><div class="outsideBtn"></div>'
      //两个颜色选择点
    this.oInsideBtn = document.querySelector(".insideBtn")
    this.oOutsideBtn = document.querySelector(".outsideBtn")
    this.btnW = this.oInsideBtn.offsetWidth

    //生成外层颜色
    var x = this.w / 2,
      y = this.h / 2,
      _this = this,
      r2 = this.r2
    this.transform(this.oInsideBtn, 'translate(' + (this.iW + this.iX - this.btnW)+ 'px ,' + this.iX + 'px)')
    this.transform(this.oOutsideBtn, 'translate(' + x + 'px ,' + 0 + 'px)')
    for (var i = 0; i < 360; i += .1) {
      //获取度数
      var rad = i * (2 * Math.PI) / 360,
        c_x = Math.cos(rad),
        c_y = Math.sin(rad),
        lineW = this.lineW
      this.ctx.strokeStyle = "hsla(" + i + ", 100%, 50%, 1.0)";
      this.ctx.beginPath();
      this.ctx.moveTo(x  + (x - lineW) * c_x , y  + (y - lineW) * c_y);
      //求出另外两点坐标
      this.ctx.lineTo(x + x * c_x , y + y * c_y);
      this.ctx.stroke();
    }
    //生成内颜色
    this.createInsideColor('red');
    var move = _this.move.bind(_this);
    //给予事件
    this.oCan.addEventListener('touchstart', function(e) {
      _this.move(e);
      document.addEventListener('touchmove', move, false);
    }, false);
    this.oCan.addEventListener('touchend', function(e) {
      //移出事件
      document.removeEventListener('touchmove', move, false);
    }, false);

  },
  createInsideColor: function(color) {
    var ctx = this.ctx,
      w = this.w,
      h = this.h,
      iW = this.iW,
      iX = this.iX //起点坐标
      //清除指定区域
    this.ctx.clearRect(iX, iX, iW, iW)
    ctx.fillStyle = color
    ctx.fillRect(iX, iX, iW, iW)
      //白色
    var g = ctx.createLinearGradient(iX, (iX + iW) / 2, iX + iW, (iX + iW) / 2)
    g.addColorStop(0, "#FFFFFF")
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(iX, iX, iW, iW);

    //黑色
    var g = ctx.createLinearGradient(iX, iX + iW, iX, iX)
    g.addColorStop(0, "#000000")
    g.addColorStop(1, "rgba(0,0,0,0)");
    // Apply gradient to canvas
    ctx.fillStyle = g;
    ctx.fillRect(iX, iX, iW, iW);
  },
  move: function(e) {
    //移动事件
    var t = e.touches[0],
      x = t.pageX - this.oCan_left,
      y = t.pageY - this.oCan_top,
      color = this.isInColor({
        x: x,
        y: y
      })
    if (color) {
      var where = this.where,
        obj = null;
      //判断在哪个区域
      if (this.where === 'outside') {
        //外层
        obj = this.oOutsideBtn;
      } else if (this.where === 'inside') {
        //内层
        obj = this.oInsideBtn;
      } else {
        return false;
      }
      //点移动
      var pos = this.btnPosition(x, y)
      this.transform(obj, 'translate(' + pos.x + 'px ,' + pos.y + 'px)')
      if (where === 'outside') {
        this.createInsideColor(color);
        color = this.getColor(pos.x, pos.y);
      }
      this.callback && this.callback(color);
    }
  },
  isInColor: function(params) {
    //判断是否在外层颜色或内层颜色内
    var x = params.x,
      y = params.y,
      w = this.w / 2,
      h = this.h / 2,
      iW = this.iW,
      iX = this.iX
      //判断在内层颜色内
    if ((x > iX && x < iX + iW) && (y > iX && y < iX + iW)) {
      this.where = 'inside'
      return this.getColor(x, y);
    }
    //判断在外层颜色内
    //获取圆心到点的距离
    var d = Math.sqrt(Math.pow((x - w), 2) + Math.pow((y - h), 2))
      //判断是否在范围内
    if (d >= this.r2 && d <= this.r) {
      this.where = 'outside'
        //返回当前点的颜色
      return this.getColor(x, y);
    } else {
      this.where = ''
      return false;
    }
  },
  btnPosition: function(x, y) {
    //判断外按钮位置
    var btnW = this.btnW,
      w = this.w,
      h = this.h,
      iW = this.iW,
      iX = this.iX,
      where = this.where;

    var x1 = where === 'outside' ? btnW : iX - btnW,
      x2 = where === 'outside' ? w - btnW : w - iX - btnW,
      y2 = where === 'outside' ? h - btnW : h - iX - btnW
    if (x < x1) {
      x = x1
    } else if (x > x2) {
      x = x2
    }
    if (y < x1) {
      y = x1
    } else if (y > y2) {
      y = y2
    }
    return {
      x: x,
      y: y
    }
  },
  transform: function(obj, data) {
    obj.style.WebkitTransform = data;
    obj.style.transform = data;
  },
  getColor: function(x, y) {
    var pixel = this.ctx.getImageData(x, y, 1, 1),
      data = pixel.data,
      rgba = 'rgb(' + data[0] + ',' + data[1] +
      ',' + data[2] + ')';
    return rgba
  }
}
export default ColorPicker