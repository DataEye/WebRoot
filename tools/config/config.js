var path = require('path')
var ROOT = __dirname + '/../..'
var includeHandler = {
  jsp: function (relativePath, filename) {
    return `<%@ include file="${relativePath}/${filename}"%>`
  },
  php: function (relativePath, filename) {
    return `<?php include "${relativePath}/${filename}" ?>`
  }
}

var config = {
  moduleName: 'tmpl',
  assetsDir: path.normalize(ROOT + '/assets'),
  buildDir: path.normalize(ROOT + '/assets-build'),
  root: path.normalize(ROOT),
  manifestJsonPath: path.normalize(ROOT + '/tools/manifest.json'),
  hashLength: 8,

  /**
   * 模板文件后缀名
   */
  suffix: '.jsp',

  /**
   * 前端模板路径
   * 一个是组件，一个是业务页面
   */
  templateDir: [
    path.normalize(ROOT + '/templates'),
    path.normalize(ROOT + '/includes/templates')
  ],

  /**
   * jsp需要include的模板文件地址
   */
  includeFilePath: path.normalize(ROOT + '/includes/templates.jsp'),

  includeHandler: includeHandler.jsp,

  /**
   * 嵌套include的模板路径，用于分离模板提高可维护性
   */
  subIncludeDir: 'includes/pages/',

  subIncludeReg: /(<%@ include file=".+(includes\/pages\/.+\.jsp)"%>)/g,

  /**
   * 国际化替换的正则
   */
  i18nReg: /(<\s*%=.+\(lang,\s*"(.+)"\)\s*%\s*>)/g,

  /**
   * 资源文件路径
   */
  i18nFilePath: [
    path.normalize(ROOT + '/../src/resources/zh.properties'),
    path.normalize(ROOT + '/../src/resources/ft.properties'),
    path.normalize(ROOT + '/../src/resources/en.properties')
  ],

  /**
   * 头部指令，php不需要
   */
  directive: '<%@ page language="java" contentType="text/html; charset=utf-8"%>',

  /**
   * 代码注释
   */
  comment: 'auto generated code, do not edit!'
}

if (config.suffix === '.php') {
  config.includeHandler = includeHandler.php
  config.directive = ''
  // 这里是用于模板字符串替换，不需要获取绝对地址
  config.subIncludeDir = 'application/views/partials'
  config.subIncludeReg = /(<\?php\s+include.+(application\/views\/partials.+.php).+\?>)/g
  // 这里用于生成文件需要绝对地址
  config.manifestPhpPath = path.normalize(ROOT + '/application/config/manifest.php')
  // 生成manifest.php的头部指令
  config.manifestPhpDirective = `<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');`
  config.i18nFilePath = []
}

var rjsConfig = {
  // 资源文件目录
  appDir: '../assets',
  // 打包输出目录
  dir: '../assets-build',
  // 脚本所处目录
  baseUrl: 'js',

  // 合并压缩css
  optimizeCss: "standard",
  // see http://requirejs.org/docs/optimization.html#sourcemaps
  generateSourceMaps: true,
  preserveLicenseComments: false,

  // 是否压缩，调试用
  optimize: 'uglify2',

  removeCombined: true,
  // modules配置没有生效
  findNestedDependencies: false,

  // build预处理
  onBuildRead: function (moduleName, path, contents) {
    // IE 8兼容脚本合并
    // if (moduleName === 'ie8/combined') {
    // 	 return '/*! empty code */'
    // }

    return contents
  },
  //A function that will be called for every write to an optimized bundle
  //of modules. This allows transforms of the content before serialization.
  onBuildWrite: function (moduleName, path, contents) {
    return contents
  },
  paths: {
    /**
     * 合并生成新文件都要在这里配置（modules里面对应的模块配置的create要设置为true）
     * 对于不符合amd规范的脚本参考ie8/combined配置（要在requirejs之前加载）
     * 配置解释：key为模块名，value为真实路径，相对于baseUrl
     */
    'app': './app',
    'app-base-zh': './app-base-zh',
    'app-base-ft': './app-base-ft',
    'app-base-en': './app-base-en',
    'base': './base',
    'components': './components'
  },
  // 开发环境要配置这个shim，生产环境不需要
  shim: {
    'highcharts': {
      exports: 'Highcharts'
    },
    'highcharts-3d': {
      deps: ['highcharts']
    }
  },

  /**
   * 注意事项：
   * 符合AMD规范的脚本，模块名和文件名要一致，不然生产环境和开发环境配置蛋疼
   * 不符合AMD规范的脚本，要么改造为AMD风格脚本，要么在requirejs之前加载
   * 文件合并时要么全部当做AMD脚本合并，要么全部暴露，不然也蛋疼
   * 具体参考build.js的ie8/combined.js 和 base.js合并
   */
  modules: [
    {
      name: 'base',
      create: true,
      include: [
        'ractive', // ractive-legacy
        'router',
        'jquery',
        'jquery.cookie',
        'jquery.amaran',
        'jquery-scrolltofixed',
        'query-string',
        'store',
        'lodash', // lodash compat
        'moment',
        'mustache',
        'raf',
        'tween',
        'md5'
      ]
    },
    // 业务库对应三种不同的语言版本
    {
      name: 'app-base-zh',
      create: true,
      include: [
        'tmpl-zh',
        'spa',
        'utils',
        'oss'
      ],
      exclude: [
        'base'
      ]
    },
    {
      name: 'app-base-ft',
      create: true,
      include: [
        'tmpl-ft',
        'spa',
        'utils',
        'oss'
      ],
      exclude: [
        'base'
      ]
    },
    {
      name: 'app-base-en',
      create: true,
      include: [
        'tmpl-en',
        'spa',
        'utils',
        'oss'
      ],
      exclude: [
        'base'
      ]
    },
    // ractive组件
    {
      name: 'components',
      create: true,
      include: [
        'bootstrap/*',
        'components/*'
      ],
      // 排除依赖脚本
      exclude: [
        'base',
        'app-base-zh',
        'app-base-ft',
        'app-base-en',
        // tmpl是开发环境专用，别引入进来
        'tmpl'
      ]
    },
    {
      // 业务图表utils
      name: 'charts',
      include: [
        'highcharts',
        'highcharts-3d'
      ],
      exclude: [
        'base'
      ]
    },
    {
      name: 'app',
      create: true,
      include: [
        'app/*'
      ],
      exclude: [
        'base',
        'charts',
        'components',
        'app-base-zh',
        'app-base-ft',
        'app-base-en',
      ]
    },
    {
      name: 'sh'
    }
  ]
}

config.rjsConfig = rjsConfig

module.exports = config
