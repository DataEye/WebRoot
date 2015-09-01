/*jshint -W079*/
var Promise = require('bluebird')
/*jshint +W079*/
var glob = require('glob')
var globAysnc = Promise.promisify(glob, glob)
var fs = require('fs')
var config = require('../config/config')
var path = require('path')
var _ = require('lodash')
var crypto = require('crypto')

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex')
}

Promise.promisifyAll(fs)

var getManifestJson = Promise.coroutine(function* (pattern, options) {
    var filenames = yield globAysnc(pattern, options)

    var files = yield Promise.map(filenames, function(file) {
        return fs.readFileAsync(file, 'utf8')
    })

    var json = {}
    var assetsPath = config.buildDir

    _.each(files, function(file, i) {
        // 只去相对于assets的路径
        var filename = path.resolve(filenames[i]).replace(assetsPath, '').replace(/\\/g, '/')
        json[filename] = md5(file).slice(0, config.hashLength)
    })

    return json
})

var getJSON = Promise.coroutine(function* () {
    var js = yield getManifestJson(config.buildDir + '/**/*.js')
    var css = yield getManifestJson(config.buildDir + '/**/*.css')

    return _.extend(js, css)
})

/**
 * 生成manifest.php
 */
var getPHP = function(json) {
    var items = []
    _.each(json, function(value, key) {
        items.push(`'${key}' => '${value}'`)
    })

    var str =
`
${config.manifestPhpDirective}

$config['manifest'] = array(
  ${items.join(',\n\t')}
);
`
    return str
}

module.exports = Promise.coroutine(function* () {
    var json = yield getJSON()
    if (config.suffix === '.php' && config.manifestPhpPath) {
        var phpContent = getPHP(json)

        yield fs.writeFileAsync(config.manifestPhpPath, phpContent)
    }

    yield fs.writeFileAsync(config.manifestJsonPath, JSON.stringify(json, null, '\t'))
})
