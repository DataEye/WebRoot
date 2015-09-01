/*
 * 检查哪些模板和JS文件还使用了中文
 */

var P = require('bluebird')
var fs = require('fs')
var _ = require('lodash')
var path = require('path')
var config = require('../config/config')
var ROOT = __dirname + '/../..'

P.promisifyAll(fs)

/**
 * 获取中文字符的行信息
 */
function getChineseRowIndex(str) {
  var result = str.match(/[\u3400-\u9FBF]+/g)
  if (!result) return {
    rowIndex: -1
  }

  var char = result[0]
  return {
    char: char,
    items: _.uniq(result),
    rowIndex: str.slice(0, str.indexOf(char)).split('\n').length
  }
}

module.exports = P.coroutine(function*() {
  var folders = config.templateDir
  var jsFolders = [
    path.normalize(ROOT + '/assets/js/app')
  ]
  var jsIndex = folders.length
  folders = folders.concat(jsFolders)
  var fileList = yield P.map(folders, function(folder) {
    return fs.readdirAsync(folder)
  })

  var files = []
  _.each(fileList, function(filenames, i) {
    _.each(filenames, function(filename) {
      files.push(folders[i] + path.sep + filename)
    })
  })

  var fileContents = yield P.map(files, function(filename) {
    return fs.readFileAsync(filename, 'utf8')
  })

  var info = {}

  _.each(fileContents, function(content, i) {
    // 移除js注释
    if (i >= jsIndex) {
      content = content.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '')
    }
    var rowInfo = getChineseRowIndex(content)
    if (rowInfo.rowIndex > -1) {
      console.error(`第${rowInfo.rowIndex} 行 "${rowInfo.char}"\n${files[i]}`)
      info[path.basename(files[i])] = rowInfo.items
      return
    }
  })

  if (_.keys(info).length === 0) {
    console.info('全部文件已经国际化')
  } else {
    var content = ''
    _.each(info, function(value, key) {
      content += `\n# ${key}\n`
      _.each(value, function(char, i) {
        var prefix = key.toUpperCase().replace(/-/g, '_').split('.')[0]
        content += `${prefix}_${i} = ${char}\n`
      })
    })

    var samplePath = path.normalize(ROOT + '/../src/resources/sample.properties')
    yield fs.writeFileAsync(samplePath, content)

    console.log(`包含未国际化的相关信息已输出\n${samplePath}`)
  }
})

module.exports()
