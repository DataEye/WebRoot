var rjs = require('requirejs')
/*jshint -W079*/
var Promise = require('bluebird')
/*jshint +W079*/
var _ = require('lodash')
var fs = require('fs')
var config = require('../config/config')
var preBuild = require('./pre_build')
var template = require('./template')
var manifest = require('./manifest')
var syncTemplate = require('./dev_template')

Promise.promisifyAll(fs)

rjs.optimizeAsync = function(config) {
    return new Promise(function(resolve, reject) {
        console.log('optimize: 打包到目录' + config.dir)

        // r.js会把config.paths的路径全部转换为绝对路径
        rjs.optimize(_.extend({}, config), function (buildResponse) {
            resolve(buildResponse)
        }, function(err) {
            reject(err)
        })
    })
}

var main = Promise.coroutine(function*() {
    try {
        var start = Date.now()
        console.log('sync: 同步模板...')
        yield syncTemplate()

        console.log('prebuild: 替换requirejs配置中的通配符...')
        yield preBuild()

        console.log('template: 预编译模板为js文件...')
        yield template()

        console.log('optimize: r.js打包开始，预计需要30秒...')
        yield rjs.optimizeAsync(config.rjsConfig)

        console.log('manifest: 生成资源文件md5信息...')
        yield manifest()

        console.log('end: 构建完成，总共耗时' + (Date.now() - start) + 'ms')
    } catch(e) {
        console.log(e.stack)
    }
})

main()
