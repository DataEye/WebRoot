define([
	"jquery",
	"require",
	"ractive"
], function(
	__import0__,
	require,
	Ractive
){

var __options__ = {
	template: {v:3,t:[{p:[3,1,21],t:7,e:"div",v:{click:{n:[{t:2,x:{r:["disabled"],s:"_0?\"\":\"focus\""},p:[3,16,36]}],d:[]}},a:{"class":["de-text-box ",{t:2,x:{r:["focus"],s:"_0?\" de-text-box-focus \":\"\""},p:[5,5,90]}," ",{t:4,f:[{t:2,x:{r:["valid"],s:"_0?\" de-text-box-valid \":\" de-text-box-invalid \""},p:[8,8,155]}],n:50,r:"value",p:[7,5,134]}]},f:[{t:4,f:[{p:[12,3,245],t:7,e:"span",a:{"class":"de-text-label"},f:[{t:2,r:"placeholder",p:[12,31,273]}]}],n:51,r:"value",p:[11,3,232]}," ",{p:[15,3,312],t:7,e:"input",a:{type:[{t:2,x:{r:["type"],s:"_0==\"password\"?\"password\":\"text\""},p:[15,16,325]}],"class":"de-text-input",value:[{t:2,r:"value",p:[16,34,404]}],disabled:[{t:2,r:"disabled",p:[17,15,429]}]},v:{focus:{n:[{t:2,x:{r:["disabled"],s:"!_0?\"inputStart\":\"\""},p:[18,15,457]}],d:[]},input:{n:[{t:2,x:{r:["disabled"],s:"!_0?\"inputChange\":\"\""},p:[19,15,506]}],d:[]},blur:{n:[{t:2,x:{r:["disabled"],s:"!_0?\"inputEnd\":\"\""},p:[20,14,555]}],d:[]}}}," ",{t:4,f:[" ",{t:4,f:[{p:[26,5,690],t:7,e:"span",a:{"class":["de-text-tips ",{t:2,r:"position",p:[26,31,716]}]},f:[{t:2,r:"errorDetail",p:[26,45,730]}]}],n:50,x:{r:["value","valid"],s:"!_0||!_1"},p:[25,5,661]}],n:50,x:{r:["disabled","required"],s:"!_0&&_1"},p:[23,3,596]}," ",{t:4,f:[" ",{t:4,f:[{t:4,f:[{p:[34,7,886],t:7,e:"span",a:{"class":["de-text-tips ",{t:2,r:"position",p:[34,33,912]}]},f:[{t:2,r:"errorDetail",p:[34,47,926]}]}],n:50,x:{r:["valid"],s:"!_0"},p:[33,7,864]}],n:50,r:"value",p:[32,5,844]}],n:50,x:{r:["disabled","required"],s:"!_0&&!_1"},p:[30,3,778]}]}]},
},
component={},
__prop__,
__export__;

  /**
   * <textinput required="true" disabled="true" type="url..." value="" />
   */
  var $ = require('jquery')

  /**
   *  borrowed from jquery-validation
   *  https://github.com/jzaefferer/jquery-validation/blob/master/src/core.js#L1107
   */
  // 类型验证
  var TypeRules = {
    email: function (str) {
      return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(str)
    },
    url: function (str) {
      return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(str)
    },
    ip: function (str) {
      return /^(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))\.(\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))$/.test(str)
    },
    // 是否是数字
    number: function (str) {
      return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(str)
    },
    // 是否是正整数
    digits: function (str) {
      return /^\d+$/.test(str)
    },
    //低于10000的正整数
    lessThenTenThousand: function (str) {
      return /(^[1-9]\d{0,3}$)|(10000)/.test(str)
    },
    // 是否是日期，不严重有效性，只验证格式
    date: function (str) {
      return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(str)
    },
    password: function (str) {
      return true
    },
    text: function (str) {
      return true
    },
    notChinese: function (str) {
      return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+$/.test(str)
    }
  }

  // 属性验证
  var AttributeRules = {
    max: function (str, std) {
      return str <= std
    },
    min: function (str, std) {
      return str >= std
    },
    maxlength: function (str, std) {
      return str.length <= std
    },
    minlength: function (str, std) {
      return str.length >= std
    },
    // 自定义正则匹配，也支持传入函数校验
    pattern: function (str, std) {
      return $.isFunction(std) ? std.call(this, str) : true
    },
    required: function (str, std) {
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

    $.each(AttributeRules, function (rule, fn) {
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

  component.exports = {
    isolated: true,
    computed: {
      errorDetail: function() {
        var error = this.get('error')
        return typeof error === 'string' ? error : this.get('placeholder')
      }
    },
    onrender: function () {
      var app = this
      var options = app.get()
      var type = options.type

      // null和undefined返回空字符串
      if (options.value && typeof options.value !== 'string') {
        throw new Error('value只能设置为字符串')
      }

      // type 不能依赖于双向绑定
      app.set('type', TypeRules.hasOwnProperty(type) ? type : 'text')

      // patter可以为正则表达式，也可以是自定义函数
      if (options.pattern) {
        var pattern = $.isFunction(options.pattern) ? options.pattern : function (str) {
          return str2RegExp(options.pattern.toString()).test(str)
        }
        app.set('pattern', pattern)
      }

      // 当输入框点击时，隐藏label，设置focus状态，验证输入有效性
      app.on('inputStart', function (e) {
        $(app.find('.de-text-label')).fadeOut()

        app.set('focus', true)
        app.set('clicked', true)

        app.fire('focus', e)
      })

      // 输入验证
      app.on('inputChange', function (e) {
        var data = app.get()
        var rules = getInvalidRules(data)

        app.set('valid', rules.length === 0)
        // TODO error 这里以后可以扩展为自定义的错误信息，目前还是布尔型
        app.set('error', rules.length !== 0)

        app.fire('input', e)
      })

      // 离开焦点
      app.on('inputEnd', function (e) {
        var val = app.get('value')
        if (!val) {
          $(app.find('.de-text-label')).fadeIn()
        }

        app.set('focus', false)

        app.fire('blur', e)
      })

      // 对已有的值进行验证
      if (options.value) {
        app.fire('inputChange', null)
      }
    }
  }

if ( typeof component.exports === "object" ) {
	for ( __prop__ in component.exports ) {
		if ( component.exports.hasOwnProperty(__prop__) ) {
			__options__[__prop__] = component.exports[__prop__];
		}
	}
}

__export__ = Ractive.extend( __options__ );


	return __export__;
});