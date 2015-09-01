define(['jquery', 'ractive', 'tmpl'], function($, Ractive, tmpl) {
	// borrowed from jquery-validation
	// https://github.com/jzaefferer/jquery-validation/blob/master/src/core.js#L1107
	// 类型验证
	var TypeRules = {
		email: function(str) {
			return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(str)
		},
		url: function(str) {
			return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(str)
		},
		ip: function(str) {
			return /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/.test(str)
		},
		// 是否是数字
		number: function(str) {
			return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(str)
		},
		// 是否是正整数
		digits: function(str) {
			return /^\d+$/.test(str)
		},
		// 是否是日期，不严重有效性，只验证格式
		date: function(str) {
			return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(str)
		},
		password: function(str) {
			return true
		},
		text: function(str) {
			return true
		}
	}

	// 属性验证
	var AttributeRules = {
		max: function(str, std) {
			return str <= std
		},
		min: function(str, std) {
			return str >= std
		},
		maxlength: function(str, std) {
			return str.length <= std
		},
		minlength: function(str, std) {
			return str.length >= std
		},
		// 自定义正则匹配，也支持传入函数校验
		pattern: function(str, std) {
			return $.isFunction(std) ? std.call(this, str) : true
		},
		required: function(str, std) {
			return std ? !!str : true
		}
	}

	// 获取当前输入值违反的的规则名称
	// 返回名称方便后续扩展，不同的规则展示不同的提示
	function getInvalidRules(data) {
		var illegalRuleNames = []
		// 如果不是必填项目，且值为空
		if (!data.required && !data.value) {
			return illegalRuleNames
		}

		if (TypeRules.hasOwnProperty(data.type) && !TypeRules[data.type].call(this, data.value)) {
			illegalRuleNames.push(data.type)
		}

		$.each(AttributeRules, function(rule, fn) {
			// 如果属性的值为null或者undefined则不校验
			if (data[rule] == null) return
			if (data.hasOwnProperty(rule) && !fn.call(this, data.value, data[rule])) {
				illegalRuleNames.push(rule)
			}
		})

		return illegalRuleNames
	}

	// 正则字符串转换为正则表达式
	function str2RegExp(str) {
		var position = str.lastIndexOf('/')
		return new RegExp(str.slice(1, position), str.slice(position + 1))
	}

	var TextInput = Ractive.extend({
		isolated: true,
		template: tmpl.text_input,
		onrender: function() {
			var app = this
			var options = app.get()
			var type = options.type

			// null和undefined返回空字符串
      // value 和required可能是外部引用，不能reset，否则会断掉与外部变量的引用
			//app.set('value', options.value == null ? '' : options.value.toString())
			//app.set('required', !(options.required === false || options.required == null))
			app.set('type', TypeRules.hasOwnProperty(type)? type : 'text')

			/**
			 * 这里如果外部不是独立变量的话，不能随便设置！！！
			 */
			//app.set('disabled', !!options.disabled)

			// patter可以为正则表达式，也可以是自定义函数
			if (options.pattern) {
				var pattern = $.isFunction(options.pattern) ? options.pattern : function(str) {
					return str2RegExp(options.pattern.toString()).test(str)
				}
				app.set('pattern', pattern)
			}

			// 当输入框点击时，隐藏label，设置focus状态，验证输入有效性
			app.on('focus', function(e) {
				$(this.find('.de-text-label')).fadeOut()
				$(this.find('.de-text-input')).focus()
				this.set('focus', true)
				app.set('clicked', true)

				this.fire('onInput', e)
			})

			// 输入验证
			app.on('onInput', function(e) {
				var data = this.get()
				var rules = getInvalidRules(data)

				app.set('valid', rules.length === 0)
				app.set('errors', rules)

				// 如果格式不合法直接提示tip
				if (!app.get('valid')) {
					// error是自定义验证信息
					app.set('error', '')
					return
				}

				// 如果输入合法则校验自定义规则
				var oninput = app.get('oninput')
				if ($.isFunction(oninput)) {
					oninput.call(app, e)
				}
			})

			// 离开焦点
			app.on('onBlur', function(e) {
				var val = this.get('value')
				if (!val) {
					$(this.find('.de-text-label')).fadeIn()
				}

				this.set('focus', false)

				if (!app.get('valid')) {
					app.set('error', '')
					return
				}

				// 如果输入合法则校验自定义规则
				var blur = app.get('onblur')
				if ($.isFunction(blur)) {
					blur.call(app, e)
				}
			})

			// 对提前赋值进行相关验证
			app.get('value') && app.fire('onInput')
		}
	})

	Ractive.components.textinput = TextInput
	return TextInput
})
