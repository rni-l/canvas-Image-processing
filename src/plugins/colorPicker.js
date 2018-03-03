function ColorPicker(params) {
  this.oBox = params.oBox//最外层盒子
  this.oBtnWrap = params.oBtnWrap//按钮外层盒子
  this.oCan = params.oCan//画布
  this.ctx = params.oCan.getContext('2d')

  this.w = params.width//画布的宽高
  this.h = params.width
  this.lineW = 20 //外层颜色的厚度
  this.r = this.w / 2 //外圆半径
  this.r2 = this.r - this.lineW //内圆半径
    //内层颜色宽高,坐标
  this.iW = (this.r2 - 5) / Math.cos(2 * Math.PI / 360 * 45)
  this.iX = (this.w - this.iW) / 2
    //canvas的Left top值
  this.where = '' //点击时的位置
    //属性
  this.opts = {
    insideX: 0,
    insideY: 0
  }
  this.callback = params.callback;
  this.bindMove = null;
}

ColorPicker.prototype = {
  init: function() {
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
      r2 = this.r2
    //按钮位置初始化
    this.transform(this.oInsideBtn, 'translate(' + (this.iW + this.iX - this.btnW) + 'px ,' + this.iX + 'px)');
    this.transform(this.oOutsideBtn, 'translate(' + x + 'px ,' + 0 + 'px)');
    this.opts.insideX = this.iW + this.iX - this.btnW;
    this.opts.insideY = this.iX;
    //生成外层颜色
    this.createColorBg(x,y);

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
  addMove:function(e){
    //获取canvas的left ,top 位置
    if (!this.oCan_left) {
      var canPos = this.getElemPos(this.oCan)
      this.oCan_left = canPos.x
      this.oCan_top = canPos.y
    }
    //颜色初始化
    this.move(e);
    document.addEventListener('mousemove', this.bindMove, false);
    document.addEventListener('touchmove', this.bindMove, false);
  },
  removeMove:function(){
    console.log('out')
    document.removeEventListener('mousemove', this.bindMove, false);
    document.removeEventListener('touchmove', this.bindMove, false);
  },
  createColorBg:function(x,y){
    //生成圆环颜色
    var ctx = this.ctx;
    for (var i = 0; i < 360; i += .1) {
      //获取度数
      var rad = i * (2 * Math.PI) / 360,
        c_x = Math.cos(rad),
        c_y = Math.sin(rad),
        lineW = this.lineW
      ctx.strokeStyle = "hsl(" + i + ", 100%, 50%)";
      ctx.beginPath();
      ctx.moveTo(x + (x - lineW) * c_x, y + (y - lineW) * c_y);
      //求出另外两点坐标
      ctx.lineTo(x + x * c_x, y + y * c_y);
      ctx.stroke();
      ctx.closePath();
    }
  },
  createInsideColor: function(color) {
    //生成内颜色
    var ctx = this.ctx,
      w = this.w,
      h = this.h,
      iW = this.iW,
      iX = this.iX //起点坐标
      //清除指定区域
    ctx.clearRect(iX, iX, iW, iW)
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
    ctx.fillStyle = g;
    ctx.fillRect(iX, iX, iW, iW);
  },
  move: function(e) {
    //移动事件
    var t = e.touches ? e.touches[0] : e,
      x = t.pageX - this.oCan_left,
      y = t.pageY - this.oCan_top
    var pos = this.btnPosition(x, y);
    if (!pos) {
      return false; }

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
  btnPosition: function(x, y) {
    //判断外按钮位置
    var w = this.w,
      h = this.h,
      iW = this.iW,
      iX = this.iX;

    //获取圆心到点的距离
    var d = Math.sqrt(Math.pow((x - w / 2), 2) + Math.pow((y - h / 2), 2))
      //判断在内层颜色内
    if ((x > iX && x < iX + iW) && (y > iX && y < iX + iW)) {
      this.where = 'inside'
    } else if (d >= this.r2 && d <= this.r) {
      //判断在外层颜色内
      this.where = 'outside'
    } else {
      console.log('no')
      return false;
    }
    var where = this.where,
      btnW = this.btnW,
      btnW2 = btnW / 2
      //计算是否有超出
    if (where === 'outside') {
      if (x < btnW2) {
        x = 0
      } else if (x > w - btnW2) {
        x = w - btnW
      }
      if (y < btnW2) {
        y = 0
      } else if (y > h - btnW2) {
        y = h - btnW
      }
    } else {
      var x1 = iX - btnW2,
        y1 = iW + iX - btnW2,
        y2 = iW + iX - btnW
      if (x < x1) {
        x = iX
      } else if (x > y1) {
        x = y2;
      }
      if (y < x1) {
        y = iX
      } else if (y > y1) {
        y = y2
      }

      this.opts.insideX = x;
      this.opts.insideY = y;
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
      rgb = 'rgb(' + data[0] + ',' + data[1] +
      ',' + data[2] + ')';
    return rgb
  },
  getElemPos: function(obj) {
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
}

export default ColorPicker

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



