(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _regexp = require('./../../utils/regexp.js');

var _regexp2 = _interopRequireDefault(_regexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {
  // 缓存对象
  var $email = $('.form-layout-input-email'),
      $pwd = $('.form-layout-input-pwd'),
      $form = $('.form-wrap');
  // 检验登录
  $('.form-submit').on('touchend', function () {
    var msg = '';
    var emailVal = $email.val(),
        pwdVal = $pwd.val();
    if (!emailVal) {
      msg = '请输入邮箱';
    }
    if (!emailVal & !_regexp2.default.email.test(emailVal)) {
      msg = '请输入正确的邮箱格式';
    }
    if (!msg && !pwdVal) {
      msg = '请输入密码';
    }
    if (!msg && !_regexp2.default.pwd.test(pwdVal)) {
      msg = '请输入正确的密码格式';
    }
    if (msg) {
      console.log('form msg', msg);
      return;
    }
    console.log($form);
    // 提交表单
    $form.submit();
  });
});

},{"./../../utils/regexp.js":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var regexp = {
  phone: /^1[34578]\d{9}$/,
  email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
  pwd: /^[A-Z]([a-z0-9_-]){7,29}$/, // 首字母大写，至少8位，最多30位
  code: /^[\d\w]{4}$/ //验证码，任意数字加字母，4位
};

exports.default = regexp;

},{}]},{},[1])

//# sourceMappingURL=login.js.map
