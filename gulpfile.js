var gulp = require('gulp')
var trac = require('gulp-trac')
var rename = require('gulp-rename')
var rjs = require('gulp-requirejs')
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
    'oss'
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

gulp.task('core-base', function() {
  rjs(_.extend({}, baseConfig, coreBase)).pipe(gulp.dest('.'))
})

gulp.task('app-base', function() {
  rjs(_.extend({}, baseConfig, appBase)).pipe(gulp.dest('.'))
})

gulp.task('charts', function() {
  rjs(_.extend({}, baseConfig, charts)).pipe(gulp.dest('.'))
})

gulp.task('app', function() {
  rjs(_.extend({}, baseConfig, app)).pipe(gulp.dest('.'))
})

gulp.task('transformSingleFileComponent', function() {
  return gulp.src('assets/components/*.html')
    .pipe(trac({moduleFormat: 'amd'}))
    .pipe(rename(function(filename) {filename.extname = '.js'}))
    .pipe(gulp.dest('assets/js/components/'))
})

gulp.task('default', ['core-base', 'app-base', 'app', 'charts'], function() {

})
