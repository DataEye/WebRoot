var gulp = require('gulp')
var trac = require('gulp-trac')
var rename = require('gulp-rename')
var rjs = require('gulp-requirejs')
var minifyCss = require('gulp-minify-css')
var concatCss = require('gulp-concat-css')
var uglify = require('gulp-uglify')
var hasher = require('gulp-hasher')
var fs = require('fs')
var _ = require('lodash')

// 基础配置，gulp-requirejs limitation
var baseConfig = {
  baseUrl: 'assets/js',
  stubModules: ['text'],
  paths: {
    // 这个是别名，上面几个对应modules里面的模块输出
    'tpl': '../../tpl'
  },
  shim: {
    'highcharts': {
      exports: 'Highcharts'
    },
    'highcharts-3d': {
      deps: ['highcharts']
    }
  }
}

var coreBase = {
  out: 'assets-build/js/core-base.js',
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
}

var appBase = {
  out: 'assets-build/js/app-base.js',
  include: [
    'spa',
    'utils',
    'oss',
    'components/ajax-button'
  ],
  exclude: coreBase.include
}

var charts = {
  out: 'assets-build/js/charts.js',
  include: [
    'highcharts',
    'highcharts-3d'
  ],
  exclude: coreBase.include.concat(appBase.include)
}

var app = {
  out: 'assets-build/js/app.js',
  include: [
    'app/main',
    'app/sample'
  ],
  exclude: coreBase.include.concat(appBase.include)
}

var scriptTask = {
  coreBase,
  appBase,
  charts,
  app
}

/**
 * AMD脚本优化
 */
var scriptTaskNames = _.keys(scriptTask).map(function(x) {
  return `script:${x}`
})
_.each(scriptTaskNames, function(task) {
  var name = task.split(':')[1]
  // app.js需要依赖于组件转换任务
  var deps = name === 'app-base' ? 'pre:transform' : []
  gulp.task(`script:${name}`, deps, function() {
    return rjs(_.extend({}, baseConfig, scriptTask[name]))
      .pipe(uglify())
      .pipe(hasher())
      .pipe(gulp.dest('.'))
  })
})

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
 * 打包压缩core.css
 */
gulp.task('css:core', function() {
  return gulp.src('assets/css/core.css')
    .pipe(concatCss("assets-build/css/core.css"))
    .pipe(minifyCss())
    .pipe(hasher())
    .pipe(gulp.dest('.'))
})

/**
 * 打包压缩combined.css
 */
gulp.task('css:combined', function() {
  return gulp.src('assets/css/combined.css')
    .pipe(concatCss("assets-build/css/combined.css"))
    .pipe(minifyCss())
    .pipe(hasher())
    .pipe(gulp.dest('.'))
})

gulp.task('fonts', function() {
  return gulp.src('assets/fonts/*.*')
    .pipe(gulp.dest('assets-build/fonts'))
})

gulp.task('image', function() {
  return gulp.src('assets/img/*.*')
    .pipe(gulp.dest('assets-build/img'))
})

gulp.task('default', ['css:combined', 'css:core', 'fonts', 'image'].concat(scriptTaskNames), function() {
  console.log(123)
  var hashes = hasher.hashes
  var manifest = {}
  _.each(hashes, function(key, filepath) {
    filepath = filepath.replace(/\\/g, '/').split('assets-build')[1]
    manifest[filepath] = key.slice(0, 4) + key.slice(-4)
  })

  console.log(manifest)
})
