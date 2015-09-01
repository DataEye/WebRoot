/*jshint -W079*/
var Promise = require('bluebird')
/*jshint +W079*/
var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var rjConfig = require('../config/config').rjsConfig

/**
 * 识别通配符下所有的文件
 */
var detectWildcards = Promise.coroutine(function* (basePath, keys) {
    // 读取通配符下所有的文件
    var fileList = yield Promise.map(keys, function(path) {
        return fs.readdirAsync(basePath + '/' + path.replace('*', ''))
    })

    var ret =  _.zipObject(keys, fileList)
    _.each(ret, function(val, key) {
        // 加上目录名
        ret[key] = val.map(function(file) {
            // 这里一定要去掉文件后缀名，坑爹
            return key.replace('*', '') + file.replace('.js', '')
        })
    })

    return ret
})

/**
 * 将配置对象中的通配符全部替换
 */
var replaceWildcards = Promise.coroutine(function* () {
    // 先找到所有的通配符项目
    var list = [
        [rjConfig, 'insertRequire']
    ]
    var wildcards = []

    _.each(rjConfig.modules, function(mod) {
        list.push([mod, 'include'])
        list.push([mod, 'insertRequire'])
    })


    _.each(list, function(item) {
        var mod = item[0]
        var field = item[1]
        if (!Array.isArray(mod[field])) return

        mod[field].forEach(function(path) {
            if (path.indexOf('/*') > -1) {
                wildcards.push(path)
            }
        })
    })

    var jsPath = path.resolve(rjConfig.appDir + '/' + rjConfig.baseUrl + '/')
    console.log('prebuild: 当前JS目录为' + jsPath)

    var pathMap = yield detectWildcards(jsPath, wildcards)
    console.log('prebuild: 通配符配置映射表')
    console.log(pathMap)

    // 遍历配置，将通配符替换为获取真实文件地址
    _.each(list, function(item) {
        var mod = item[0]
        var field = item[1]
        if (!Array.isArray(mod[field])) return

        _.each(wildcards, function(path) {
            var index = mod[field].indexOf(path)
            if (index > -1) {
                [].splice.apply(mod[field], _.flatten([index, 1, pathMap[path]]))
            }
        })
    })
})

module.exports = Promise.coroutine(function* () {
    yield replaceWildcards()
})

