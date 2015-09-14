var gulp = require('gulp')
var trac = require('gulp-trac')
var rename = require('gulp-rename')
var hasher = require('gulp-hasher')
var i18n = require('gulp-lazy-i18n')
var requirejs = require('requirejs')
var fs = require('fs')
var _ = require('lodash')
var properties = require ("properties")

var jsAppModules = fs.readdirSync('assets/js/app')
var jsComponentsModules = fs.readdirSync('assets/js/components')

jsAppModules = _.map(jsAppModules, function(item) {
  return 'app/' + item.replace('.js', '')
})

jsComponentsModules = _.map(jsComponentsModules, function(item) {
  return 'components/' + item.replace('.js', '')
})

/**
 * r.js资源优化配置文件
 * 参考 https://github.com/simongfxu/requirejs-example-gulpfile/blob/master/gulpfile.js
 */
var config = {
  // 资源文件开发目录
  appDir: 'assets',

  // 资源文件打包输出目录
  dir: 'assets-build',

  // 开发脚本目录
  baseUrl: 'js',

  // 是否优化css，standard/none
  optimizeCss: "standard",

  // 是否生成source map
  // see http://requirejs.org/docs/optimization.html#sourcemaps
  generateSourceMaps: false,

  // 是否保留开源协议声明
  preserveLicenseComments: false,

  // 是否优化JS，uglify2/none
  optimize: 'none',

  // 合并后是否移除单个子文件
  removeCombined: true,

  // TODO modules配置没有生效
  findNestedDependencies: false,

  // build预处理，暂未使用
  onBuildRead: function (moduleName, path, contents) {
    return contents
  },

  // build预处理，暂未使用
  onBuildWrite: function (moduleName, path, contents) {
    console.log(`正处理:${path}`)
    return contents
  },

  // 两种常用情况：
  // 1) 和requirejs一样的路径别名功能
  // 2) 指定modules配置里面新生成文件({create: true})的输出路径
  paths: {
    'app': './app',
    'app-base': './app-base',
    'core-base': './core-base',
    // 这个是别名，上面几个对应modules里面的模块输出
    'tpl': '../../tpl'
  },

  // 兼容非AMD规范的模块定义
  shim: {
    'highcharts': {
      exports: 'Highcharts'
    },
    'highcharts-3d': {
      deps: ['highcharts']
    }
  },

  // build阶段需要忽略的插件，常用于统一开发和生产阶段的开发模式
  // 比如require(['text!a.html'])，开发阶段直接使用请求加载a.html
  // 生产环境r.js会定义a.html这个模块，输出为a.html文件内容的字符串
  stubModules: ['text'],

  // 模块合并打包配置
  modules: [
    {
      // 基础库
      name: 'core-base',
      create: true,
      include: [
        'raf',
        'ractive',
        'rvc',
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
        'numeral',
        'tween',
        'md5'
      ]
    },
    {
      // 业务辅助类
      // TODO 国际化
      name: 'app-base',
      create: true,
      include: [
        'spa',
        'utils',
        'oss'
      ].concat(jsComponentsModules),
      exclude: [
        'core-base'
      ]
    },
    {
      // 业务图表库
      name: 'charts',
      include: [
        'highcharts',
        'highcharts-3d'
      ],
      exclude: [
        'core-base',
        'app-base'
      ]
    },
    {
      // 业务类
      // TODO 需要国际化
      name: 'app',
      create: true,
      include: jsAppModules,
      exclude: [
        'core-base',
        'app-base'
      ]
    }
  ]
}

/**
 * 转换single file components为js文件
 */
gulp.task('pre:transform', function() {
  return gulp.src('assets/components/*.html')
    .pipe(trac({moduleFormat: 'amd'}))
    .pipe(rename(function(filename) {filename.extname = '.js'}))
    .pipe(gulp.dest('assets/js/components/'))
})

/**
 * 使用r.js完成build任务，其它gulp插件不靠谱
 */
gulp.task('optimize:r.js', ['pre:transform'], function(callback) {
  requirejs.optimize(config, function(res) {
    callback(null, res)
  })
})

/**
 * 读取manifest文件信息
 */
gulp.task('hasher', ['optimize:r.js'], function() {
  return gulp.src(['assets-build/js/*.js', 'assets-build/css/*.css'])
    .pipe(hasher())
})

/**
 * 国际化直接替换中文资源
 */
gulp.task('i18n', ['optimize:r.js'], function() {
  var dict = {
    cn: _.invert(properties.parse(fs.readFileSync('src/resource/cn.properties', 'utf8'))),
    en: properties.parse(fs.readFileSync('src/resource/en.properties', 'utf8')),
    tw: properties.parse(fs.readFileSync('src/resource/tw.properties', 'utf8'))
  }

  var i18nConfig = {
    locales: ['en', 'tw'],
    translate: function(content, lang) {
      var file = this
      return content.replace(/([\u3400-\u9FBF]+)/g, function(str, match) {
        var result = dict[lang][dict.cn[match]]
        if (!result) {
          console.log(`需要国际化：${file.path}\n语言：${lang}`)
          return match
        }

        return result
      })
    }
  }

  return gulp.src('assets-build/js/app*.js')
    .pipe(i18n(i18nConfig))
    .pipe(gulp.dest('assets-build/js/'))
})

gulp.task('manifest', ['hasher'], function(next) {
  var hashes = hasher.hashes
  var manifest = {}
  _.each(hashes, function(key, filepath) {
    filepath = filepath.replace(/\\/g, '/').split('assets-build')[1]
    manifest[filepath] = key.slice(0, 4) + key.slice(-4)
  })

  fs.writeFile('assets-build/manifest.json', JSON.stringify(manifest, null, '  '), next)
})

gulp.task('default', ['manifest', 'i18n'])
