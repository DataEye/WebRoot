define([
	'moment', 'ractive', 'jquery', 'lodash', 'store', 'oss', 'numeral',
	'jquery.amaran'
], function(moment, Ractive, $, _, Store, OSS, numeral) {
	// 为低版本添加console对象，防止代码报错
	if (!window.console) {
		window.console = {
			log : function() {},
			warn: function() {},
			error: function() {}
		}
	}

	// 覆盖原生的alert方法
	var oAlert = window.alert
	var alertColors = {
		'ok': '#27ae60',
		'success': '#27ae60',
		'error': 'red',
		'fail': 'red',
		'warn': 'yellow',
		'warning': 'yellow'
	}

	// 指定ID则在元素中展示错误信息，否则弹出全局的错误提示
	// alert('请填写邮箱', 'warn')
	// alert('注册成功', 'ok')
	// alert('操作失败', 'error')
	window.alert = function(msg, type, containerID) {
		type = type || 'warn'
		containerID = containerID || {}

		if (!alertColors[type]) {
			type = 'warn'
		}

		if (typeof containerID === 'string') {
			$('#' + containerID).html(msg).removeClass(Object.keys(alertColors).join(' ')).addClass(type)
			return
		}

		if ($.isPlainObject(containerID)) {
			containerID = $.extend({
				content:{
					message: msg,
					color: alertColors[type]
				},
				position:'top right',
				delay: 3000,
				closeButton: false,
				sticky: false
			}, containerID)

			$.amaran(containerID)
			return
		}

		oAlert(msg)
	}

	// 操作成功提示后跳转页面
	window.redirectAlert = function(msg, url, time, type) {
		alert(msg, type || 'ok')
		url && setTimeout(function() {
			if (url === true) {
				location.reload()
			} else {
        if (url.indexOf('#') === 0) {
          var hash = url.split('?')[0]
          $('.side-menu').find('.current').removeClass('current').end()
            .find('.list-group>a[href="' + hash + '"]').addClass('current')
        }

				location.href = url
			}
		}, time || 800)
	}

	// debug模式alert错误方便发现问题
	if (App.debug) {
		window.onerror = function(msg) {
			alert(msg, 'error')
		}
	}

	// findRactiveComponent(app, 'textinput', {value: 1})
	window.findRactiveComponent = function(ractive, name, where) {
		if (!ractive) return

		where = where || {}
		var plugins = ractive.findAllComponents()
		var target = null
		_.each(plugins, function(app) {
			if (app.component && app.component.name === name) {
					var every = _.every(where, function(val, key) {
					return app.get(key) === val
				})
				if (every) {
					target = app
					return false
				}
			}
		})

		return target
	}

	window.findRactiveComponents = function(ractive, name, where) {
		if (!ractive) return

		where = where || {}
		var plugins = ractive.findAllComponents()
		var targets = []
		_.each(plugins, function(app) {
			if (app.component && app.component.name === name) {
				var every = _.every(where, function(val, key) {
					return app.get(key) === val
				})
				if (every) {
					targets.push(app)
				}
			}
		})

		return targets
	}

	// jQuery通用错误处理函数，如果页面添加了418无权限接口处理，则将418转交
	window.jqErrorHandler = function(xhr) {
		var resJSon = xhr.responseJSON
		// 如果服务器错误没有处理，不展示responseText（内容可能太多，包含html）
		var msg = resJSon ? resJSon.msg : (xhr.status + ':' + xhr.statusText)

		// 第一种是客户端网络连接断开，statusText = error
		// 第二种是程序主动断掉 statusText = abort
		if (xhr.statusText === 'abort') {
			return
		}

		alert(msg, 'error')
	}

	// 时间格式化
	window.formatTime = function(str, format) {
		return moment(str).format(format || 'YYYY-MM-DD')
	}

	window.formatHours = function(hour){
		if (hour < 10) hour = '0' + hour.toString()
		return hour + ":00"
	}

	window.formatSeconds = function(seconds, hourSymbol, minuteSymbol, secSymbol) {
		seconds = parseInt(seconds) || 0
		if(!seconds || seconds < 0) {
			seconds = 0
		}
		var hour = Math.floor(seconds/3600)
		var minute = Math.floor((seconds - hour * 3600)/60)
		var sec = seconds - hour * 3600 - minute * 60
		var str = ''
		if (hour) {
			str += hour + (hourSymbol || '小时')
		}
		if (minute) {
			str += minute + (minuteSymbol || '分')
		}
		if (!str || sec) {
			str += sec + (secSymbol || '秒')
		}
		return str
	}

	window.formatPercentage = function(num) {
		return numeral(num).format('00.00%')
	}

	//货币符号
	window.formatCurrency = function(num, symbol){
		var str = '￥' + num
		if(symbol){
			str = symbol + num
		}
		return str
	}

	// 格式化百分比
	window.formatForPercentage = function(num) {
		return numeral(num).format('00.00%')
	}

	// 格式化数字
	window.formatNumber = function(num) {
		return numeral(num).format('0,0')
	}

  // 格式化货币金额
	window.formatCurrency = function(num) {
		return numeral(num).format('0,0.00')
	}

	window.formatShortDate = function(str, format) {
		return moment(String(str), 'YYYYMMDD').format(format ? format : 'MM/DD')
	}

	window.formatShortTimePeriod  = function(num){
		var str = num < 1000 ? '201501010' + num : '20150101' + String(num)
		var ms = moment(str , 'YYYYMMDDhhmm').toDate().getTime()
		var start = moment(ms).format('HH:mm')
		var end = moment(ms + 5*60*1000).format('HH:mm')
		return start + '-' + end
	}

	// 默认时间设置
	window.defaultTimeSettings = (function() {
		var today = moment().format('YYYY-MM-DD')
		return {
			dToday: today,
			dEnd: today,
			dStart: moment().add(-7, 'month').format('YYYY-MM-DD'),
			dMax: today,
			dMin: moment().add(-3, 'month').format('YYYY-MM-DD')
		}
	})()

	// 获取指标说明的相关配置
	window.getIndexInfo = function(arr) {
		if (Array.isArray(arr)) {
			return window.getIndexInfo.apply(this, arr)
		}

		var len = arguments.length
		var info = '<table class="table-list">'
		for(var i = 0; i < len; i ++) {
			var key = arguments[i]
			var titles = App.i18n[key].split('|||')
			var className = titles[1] ? {'实时': 'time-true','小时': 'time-s','天': 'time-day'} : null
			var indexTitle = titles[1] ? '<em class="' + className[titles[0]] + '">' + titles[0] + '</em><b>' + titles[1] + '</b>' : '<b>' + titles[0] + '</b>'
			if (App.i18n[key]) {
				info += '<tr><td valign="top" nowrap="nowrap">' + indexTitle +
					'</td><td>' + App.i18n[key + 'Info'] + '</td></tr>'
			}
		}
		info += '</table>'

		return {
			content: info
		}
	}

	/**
	 * 获取对象属性, 支持深度获取
	 * getProperty(window, 'document.createElement')
	 */
	window.getProperty = function(obj, field) {
		if (!obj) return obj

		field = field || String(field)
		var fields = field.split('.')

		return fields.reduce(function(prev, current) {
			return prev[current]
		}, obj)
	}

	// 代码压缩之后自动禁用debug
	Ractive.DEBUG = /unminified/.test(function(){/*unminified*/})

	 //扩展默认数据
	Ractive.defaults.data = $.extend({
		formatTime: window.formatTime,
		formatHours: window.formatHours,
		formatSeconds: window.formatSeconds,
		formatPercentage: window.formatPercentage,
		formatNumber: window.formatNumber,
		formatShortDate: window.formatShortDate,
		formatShortTimePeriod: window.formatShortTimePeriod,
		formatCurrencySymbol: window.formatCurrencySymbol,
		jqErrorHandler: window.jqErrorHandler,
		outdatedBrowser: App.outdated,
		getIndexInfo: window.getIndexInfo,
		getProperty: window.getProperty
	}, window.defaultTimeSettings)

	window.wrapError = function wrapError(xhr, defaultMsg) {
    if (xhr.responseJSON)
      return xhr.responseJSON

    defaultMsg = defaultMsg || ''
    var text = xhr.responseText.length > 64 ? '<span>' + defaultMsg +
      '</span>' : xhr.responseText

    return {
      statusCode: xhr.status,
      content: text + xhr.statusText,
      id: Date.now()
    }
  }

	/* 行首为+-/[(时加分号 */

	/**
	 * SPA页面切换时abort所有的ajax
	 * abort之后会触发onerror事件，如果没有使用同一的error handler
	 * 调用方自己过滤掉statusText == 'abort'的情况
	 *
	 * 如果有请求不能被abort，请在url或者post中加入参数abortless=1
	 */
	;(function abortjQueryAjax() {
		// xhr连接池
		var xhrPool = []

		$.ajaxSetup({
			beforeSend: function(jqXHR, options) {
				// 在url或者参数中加入abortless中就不会加入pool
				var abortless = /(\?|&)abortless=/.test(options.url) || (options.data && /(^|&)abortless=/.test(options.data))
				if (!abortless) {
					xhrPool.push(jqXHR)
				}
			},
			complete: function(jqXHR) {
				var i = xhrPool.indexOf(jqXHR)
				if (i > -1)
					xhrPool.splice(i, 1)

				var responseJSON = jqXHR.responseJSON
				if (responseJSON) {
					// 401登录态过期，直接跳转
					if (responseJSON.statusCode === 401) {
						// 防止弹出多个弹出框
						$.abortAll()
						location.href = App.contextPath + '/'
						return
					}
				}
			}
		})

		$.abortAll = function() {
			xhrPool.forEach(function(jqXHR, i) {
				jqXHR.abort()
				xhrPool.splice(i, 1)
			})
		}
	})()

	return window
})
