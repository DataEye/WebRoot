/*jshint -W079*/
var Promise = require('bluebird')
/*jshint +W079*/
var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var config = require('../config/config')
var folders = config.templateDir

Promise.promisifyAll(fs)

// 为开发环境生成等价的include页面
module.exports = Promise.coroutine(function* () {
  console.log(`同步目录${folders.join(', ')}中的模板...`)

  // 返回结果为二维数组，每个目录下的全部文件
  var fileList = yield Promise.map(folders, function (dir) {
    return fs.readdirAsync(dir)
  })

  var content = ''
  // 遍历模板拼装include文件
  _.each(fileList, function (items, index) {
    var dir = folders[index]

    _.each(items, function (filename) {
      // 获取模板文件的相对路径
      var includeDir = path.dirname(config.includeFilePath)
      var relative = path.relative(includeDir, dir).replace(/\\/g, '/')

      content += `
        <script type="text" id="${filename.replace(config.suffix, '')}_tmpl">
            ${config.includeHandler(relative, filename)}
        </script>
      `
    })
  })

  var fileContent = `${config.directive}\n<!--${config.comment}-->${content}`

  yield fs.writeFileAsync(config.includeFilePath, fileContent)

  console.log('同步完成')
})

if (process.argv[2] === 'sync') {
  module.exports()
}
