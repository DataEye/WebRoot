;(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory)
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'))
	} else {
		root.OSS = factory(jQuery)
	}
}(this, function ($) {
	if (!$ || !$.fn.on) {
		throw new Error('include jQuery in your page and ensure that the version number is greater than 1.7')
	}

	var win = this
	var doc = document
	var LS = win.localStorage
	var encode = win.encodeURIComponent
	var decode = win.decodeURIComponent
	var domain = doc.domain
	var pathname = win.location.pathname
	// 返回对象
	var OSS = {}

	// 只支持一级简单类型的序列化
	var stringify = function(obj) {
		if (!$.isPlainObject(obj)) return String(obj)

		var pairs = []
		$.each(obj, function(key, val) {
			pairs.push('"' + key + '":"' + encode(String(val)) + '"')
		})
		return '{' + pairs.join(',') + '}'
	}

	var toString = Object.prototype.toString

	var isString = function isString(value) {
    return typeof value == 'string' ||
      value && typeof value == 'object' && toString.call(value) == '[object String]' || false
  }

	/**
	 * 封装的本地存储，用于存储页面跳转之前的最后一次点击统计数据
	 */
	var Storage = (function(LS){
		var Cookie = {
			get: function (name) {
				var c = doc.cookie.match(new RegExp('(^|;)\\s*' + name + '=([^;\\s]*)'));
				return ((c && c.length >= 3) ? decodeURIComponent(c[2]) : '');
			},
			set: function (name, value, days, domain, path, secure) {
				if (days) {
					var d = new Date();
					d.setTime(d.getTime() + (days * 8.64e7)); // now + days in milliseconds
				}
				doc.cookie = name + '=' + encodeURIComponent(value) +
					(days ? ('; expires=' + d.toGMTString()) : '') +
					'; path=' + (path || '/') +
					(domain ? ('; domain=' + domain) : '') +
					(secure ? '; secure' : '');
			},
			remove: function (name, domain, path) {
				this.set(name, '', -1, domain, path); // sets expiry to now - 1 day
			}
		}
		return {
			get: function(key) {
				return LS?LS.getItem(key):Cookie.get(key)
			},
			set: function(key, value) {
				LS?LS.setItem(key, value):Cookie.set(key, value, 365)
			},
			remove: function(key) {
				LS?LS.removeItem(key):Cookie.remove(key)
			}
		}
	})(LS)

	// 默认事件名称
	var CLICK = '_DESelf_CLICK'
	var PV = '_DESelf_PV'
	// 操作的属性名
	var ATTR_NAME = 'data-oss-name'
	var ATTR_EVENT_ID = 'data-oss-event'
	// 使用cookie存储
	var STORAGE_KEY = 'de_oss_storage_key'
	var API_URL =  'https://g.dataeye.com/cost.do'
	// 绑定点击统计节点的上次点击时间，防止匹配多个选择器时上报多次
	var LAST_CLICK_TIME = 'lastClickTime'
	// 两次点击最短间隔
	var MIN_CLICK_STEP = 480
	// cookie最大长度
	var MAX_COOKIE_LEN = 4093
	var uuid = 0

	// 获取导航链接内的文本
	function getElementText(el, len) {
		return $.trim($.trim($(el).text()).slice(0, len || 20))
	}

	/**
	 * 是否连续快速的点击
	 * 命中多个绑定规则只发一次请求
	 */
	function isDoubleClick(el) {
		var lastClickTime = $(el).data(LAST_CLICK_TIME)
		// 如果点击过快或者匹配了多个选择器或者触发了bug则根据上次点击时间判断是否本次上报
		return lastClickTime && (new Date().getTime() - lastClickTime < MIN_CLICK_STEP)
	}

	function request(formData) {
		if(!formData) return

		if(!formData.__id__){
			uuid += 1
			formData.__id__ = uuid
		}

		var allowed = (MAX_COOKIE_LEN - doc.cookie.length) * 0.8
		var data = stringify(formData)
		if(!LS && data.length > allowed.length){
			console.log('post content length is too big for this browser')
			return
		}

		/*
		* 为了防止页面跳转先把信息写到cookie里，下次加载时再上报
		* 总是记录最后一次点击信息防止被漏掉，当页面跳转之后上报这次的请求
		*/
		Storage.set(STORAGE_KEY, data)

		// OSS.defaults上可以填一些公共表单数据
		$.post(API_URL, $.extend({}, OSS.defaults, formData)).done(function(json) {
			var data = $.parseJSON(Storage.get(STORAGE_KEY))
			// 只删除自己的信息，如果已经被覆盖则忽略
			if(data.__id__ == formData.__id__){
				Storage.remove(STORAGE_KEY)
			}
		})
	}

	// 全局数据，每个请求都会带上
	var global = {
		domain: domain,
		path: pathname
	}

	/*
	* 配置项
	* @parameter opts.container {String} 选填。选择器，代理节点，默认为body
	* @parameter opts.global {Object} 选填。全局数据，每个请求都会带上
	* @parameter opts.rules {Array} 必填。匹配规则，每个rule包含selector和data属性
	* @parameter opts.rules.*.selector {String} 必填。选择器，匹配的子节点选择器
	* @parameter opts.rules.*.data {String} 选填。当前点击操作的名称
	* @parameter opts.rules.*.data {Fcuntion} 选填。如果函数返回字符串则表示当前操作的名称，
				如果需要返回自定义数据则可以返回一个对象，对象带有name属性即可
	*/
	function init(opts) {
		if ($.isArray(opts)) {
			opts = {
				rules: opts
			}
		}
		opts = $.extend({
			container: 'body',
			global: {},
			rules: []
		}, opts)
		var container = $(opts.container)
		// 全局数据，每个请求都会带上
		global = $.extend(opts.global, global)
		$.each(opts.rules, function(i, rule) {
			container.on('click', rule.selector, function(e) {
				var el = e.currentTarget
				if(isDoubleClick(el)){
					return
				}
				var formData = {
					eventid: CLICK,
					duration: 1
				}
				var labelmap = $.extend({}, global, {manual: 0})
					// 字符串则直接传入代表本次操作的名称
				if (isString(rule.data)) {
					labelmap.name = rule.data
				}
				// 如果不设置data则默认寻找innerText
				if (rule.data == null) {
					labelmap.name = getElementText(el)
				}
				// 自定义函数可以返回字符串和带有name属性的对象
				if ($.isFunction(rule.data)) {
					var customData = rule.data(el, e)
					if (isString(customData)) {
						customData = {
							name: customData
						}
					}
					if (!$.isPlainObject(customData) || !isString(customData.name)) {
						throw new Error("custom function must return an object with a name property")
					}
					// 支持自定义eventid和duration
					formData.eventid = customData.eventid || formData.eventid
					formData.duration = customData.duration || formData.duration
					delete customData.eventid
					delete customData.duration
					$.extend(labelmap, customData)
				}
				formData.labelmap = stringify(labelmap)
				$(el).data(LAST_CLICK_TIME, new Date().getTime())
				request(formData)
			})
		})
	}

	/*
	 * @parameter labelmap {String|Object} 必填。自定义数据，如果是对象则必有name属性
	 * @parameter eventid {String} 选填。不填则为_DESelf_CLICK
	 * @parameter duration {Int} 选填。耗时
	 */
	function send(labelmap, eventid, duration) {
		if (isString(labelmap)) {
			labelmap = {
				name: labelmap
			}
		}
		if (!$.isPlainObject(labelmap) || !isString(labelmap.name)) {
			throw new Error('labelmap should be an object with name property')
		}
		labelmap = $.extend({}, global, labelmap, {manual: 1})
		request({
			eventid: eventid || CLICK,
			labelmap: stringify(labelmap),
			duration: duration || 1,
			__id__: arguments[3]
		})
	}

	/**
	 * 发送本次PV以及上报上次点击事件
	 * AMD环境需要手动调用
	 */
	function flush() {
		// 发送本次pv
		var pvData = $.extend({name: $.trim(document.title)}, global)
		var postData = {eventid: PV, duration: 1, labelmap: stringify(pvData)}

		$.post(API_URL, $.extend(postData, OSS.defaults))

		// 自动上报最后一次点击信息
		var lastClickInfo = Storage.get(STORAGE_KEY)
		if(lastClickInfo) {
			lastClickInfo = $.parseJSON(lastClickInfo)
			send($.parseJSON(decode(lastClickInfo.labelmap)), lastClickInfo.eventid || CLICK,
				lastClickInfo.duration, lastClickInfo.__id__)
		}
	}

	// 自动绑定使用属性定义的上报事件
	$('body').on('click', '[' + ATTR_NAME + ']', function(e) {
		var el = e.currentTarget
		if(isDoubleClick(el)){
			return
		}
		var labelmap = $.extend({}, global, {
			manual: 2,
			name: $(el).attr(ATTR_NAME) || getElementText(el)
		})
		$(el).data(LAST_CLICK_TIME, new Date().getTime())
		request({
			eventid: $(el).attr(ATTR_EVENT_ID) || CLICK,
			labelmap: stringify(labelmap),
			duration: 1
		})
	})

	OSS.init = init
	OSS.send = send
	OSS.flush = flush

	// 非AMD和CommonJS环境下直接调用flush
	if (!$.isFunction(win.define) && typeof exports === 'undefined') {
		$(flush)
	}

	return OSS
}));
