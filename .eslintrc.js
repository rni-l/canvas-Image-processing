// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  // plugins: [
  //   'html'
  // ],
  "globals": {
    "addWheelListener": true
  },
  // check if imports actually resolve
  // 'settings': {
  //   'import/resolver': {
  //     'webpack': {
  //       'config': 'build/webpack.base.conf.js'
  //     }
  //   }
  // },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never'
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-console": "off", // 关闭：禁用 console
    "no-alert": "off", // 关闭：禁用 alert
    "semi": ["error", "never"], // 不使用分号结尾
    "func-names": "off", // 关闭：要求或禁止使用命名的 function 表达式
    "vars-on-top": "off", // 关闭：要求所有的 var 声明出现在它们所在的作用域顶部
    "indent": ["error", 2], // 统一两个空格缩进
    "wrap-iife": "off", // 关闭：要求 IIFE 使用括号括起来
    "max-len": "off", // 关闭强制一行的最大长度
    "camelcase": "off", // 关闭：强制使用骆驼拼写法命名约定
    "space-before-function-paren": ["error", "never"], // 禁止函数圆括号之前有一个空格
    "comma-dangle": ["error", "never"], // 禁用拖尾逗号
    "consistent-return": "off", // 禁用要求使用一致的 return 语句
    "prefer-template": "off", // 关闭使用模板而非字符串连接
    "arrow-parens": "off", // 关闭要求箭头函数的参数使用圆括号
    "arrow-body-style": "off", // 关闭要求箭头函数体使用大括号
    "default-case": "off", // 关闭要求 Switch 语句中有 Default 分支
    "no-case-declarations": "off", // 关闭禁止在 case 或 default 子句中出现词法声明
    "no-param-reassign": "off", // 关闭禁止对函数参数再赋值
    "linebreak-style": 0, // 解决windows出现CRLF错误
    "no-mixed-operators": "off", // 可以混合油同样优先级的操作符
    "sort-imports": "off", // 关闭import按字母顺序排列
    "allowAfterSuper": "off", // 关闭禁止使用_
    "no-underscore-dangle": "off", // 关闭禁止使用_
    "one-var": ["off", "always"], // 关闭function里面只能有一个var
    "no-plusplus": "off", //关闭禁止使用一元操作符
    "no-lonely-if": 0, //关闭 禁用多层if else
    "no-restricted-syntax": 0, //关闭 禁用js特殊语法（with, in)
    "init-declarations": "off",
    "object-shorthand": "off",
    "no-new": 0
  }
}
