/*jshint -W079*/
var Promise = require('bluebird')
/*jshint +W079*/
var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var config = require('../config/config')
var properties = require ("properties")
var folders = config.templateDir
var parseProperties = Promise.promisify(properties.parse, properties)

Promise.promisifyAll(fs)

function toAmdModule(obj, moduleName, lang) {
  // 移除多余的\t，\n最好不移除，保持换行的格式
  var tmpl = JSON.stringify(obj, null, '  ').replace(/(\\t)+/g, '\\t').replace(/(\\n)+/g, '\\n').trim()
  var fileContent = `
      /**
       * 自动生成代码不要编辑
       * 共js使用的模板文件，语言：${lang}
       * 会自动把页面上type=text的标签转换为模板内容
       */
      define('${moduleName}', ['jquery'], function($) {
          var tmpl = ${tmpl}

          $('script[type=text]').each(function() {
              // 文件名中的 - 转换为 _，键值去掉jsp后缀
              var id = $(this).attr('id').replace('_tmpl', '').replace(/-/g, '_')

              if (tmpl[id]) throw new Error('模板ID已经存在:' + id)

              tmpl[id] = $(this).html()
          })
          return tmpl
      })
  `
  return fileContent
}

// 删除 <%@ page language="java" contentType="text/html; charset=utf-8" %>
function removeJspDirective(str) {
  return str ? str.replace(/<%@\s*page.*?%>/g, '') : String(str)
}

/**
 * 将前端模板html文件(WebRoot/template/*.jsp)
 * 转换为js文件(WebRoot/assets/js/tmpl.js)
 */
module.exports = Promise.coroutine(function* () {
  var fileList = yield Promise.map(folders, function (dir) {
    return fs.readdirAsync(dir)
  })

  var files = [], filenames = []
  fileList.forEach(function (items, i) {
    items.forEach(function (item) {
      files.push(folders[i] + '/' + item)
      filenames.push(item)
    })
  })

  var contents = yield Promise.map(files, function (path) {
    return fs.readFileAsync(path, 'utf8')
  })

  // 模板对象
  var obj = {}
  // 记录有二级嵌套的模板（包含对应的模板名称和要替换的include指令）
  var subIncludeInfo = {}
  _.each(filenames, function (filename, i) {
    // 文件名中的 - 转换为 _，键值去掉jsp后缀
    var key = filename.replace(config.suffix, '').replace(/-/g, '_')
    // 去掉jsp头部指令
    var content = removeJspDirective(contents[i].trim())
    obj[key] = content
    // 模板文件允许嵌套一级
    content.replace(config.subIncludeReg, function (str, match, path) {
      if (!subIncludeInfo[path]) {
        subIncludeInfo[path] = []
      }

      subIncludeInfo[path].push({
        templateName: key,
        replacement: match
      })
    })
  })

  var subIncludePathList = _.keys(subIncludeInfo)
  // 读取子模板，只允许嵌套一级
  var subIncludeFiles = yield Promise.map(subIncludePathList, function (path) {
    return fs.readFileAsync(config.root + '/' + path, 'utf8')
  })

  var i18nList
  if (config.i18nFilePath.length) {
    i18nList = yield Promise.map(config.i18nFilePath, function(path) {
      return parseProperties(path, {path: true})
    })
  }

  // 替换有二级模板的对象
  _.each(subIncludeFiles, function (content, i) {
    _.each(subIncludeInfo[subIncludePathList[i]], function (item) {
      obj[item.templateName] = obj[item.templateName]
        .replace(item.replacement, removeJspDirective(content))
    })
  })

  // 这里兼容php的写法
  var langList = config.i18nFilePath.length ? config.i18nFilePath : ['zh.json', 'ft.json', 'en.json']
  var templateContents = _.map(langList, function (filename, index) {
    var lang = path.basename(filename, path.extname(filename))
    // 不能直接操作obj，不然模板就被替换了
    var json = _.clone(obj, true)

    if (i18nList) {
      var i18n = i18nList[index]
      _.each(json, function(val, key) {
        json[key] = val.replace(config.i18nReg, function(str, match, key) {
          return i18n[key]
        })
      })
    }

    return {
      filename: config.assetsDir + '/js/' + config.moduleName + '-' + lang + '.js',
      amdScriptContent: toAmdModule(json, config.moduleName, lang)
    }
  })

  // 写入模板文件
  yield Promise.map(templateContents, function (arg) {
    return fs.writeFileAsync(arg.filename, arg.amdScriptContent)
  })
})

module.exports()
