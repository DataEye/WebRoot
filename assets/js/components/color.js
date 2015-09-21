define([
	"jquery",
	"bootstrap/colorpicker",
	"require",
	"ractive"
], function(
	__import0__,
	__import1__,
	require,
	Ractive
){

var __options__ = {
	template: {v:3,t:[{p:[1,1,0],t:7,e:"div",a:{"class":"input-group"},f:[{p:[2,3,28],t:7,e:"input",a:{type:"text",value:[{t:2,r:"value",p:[2,29,54]}],"class":"form-control color-picker"}}," ",{p:[3,3,104],t:7,e:"span",a:{"class":"input-group-addon"},v:{click:"expand"},f:[{p:[4,5,159],t:7,e:"i",a:{"class":"color-picker-preivew",style:["background-color: ",{t:2,r:"value",p:[4,62,216]},";"]}}]}]}]},
},
component={},
__prop__,
__export__;

  var $ = require('jquery')
  require('bootstrap/colorpicker')

  /**
   * 颜色选择器
   * <color value="{{color}}" />
   */
  component.exports = {
    onteardown: function() {
      $(this.find('input')).colorpicker('destroy')
    },
    onrender: function() {
      var app = this
      var data = app.get()

      var options = {}
      var optionList = 'format,color,container,component,input,horizontal,inline,sliders,slidersHorz,template,align,customClass'

      optionList.split(',').forEach(function(key) {
        if (data.hasOwnProperty(key)) {
          options[key] = data[key]
        }
      })

      if (!data.hasOwnProperty('customClass')) {
        options.customClass = 'colorpicker-2x'
      }

      if (!data.hasOwnProperty('sliders')) {
        options.sliders = {
          saturation: {
            maxLeft: 200,
            maxTop: 200
          },
          hue: {
            maxTop: 200
          },
          alpha: {
            maxTop: 200
          }
        }
      }

      $(app.find('input')).colorpicker(options).on('changeColor.colorpicker', function(e) {
        // 同步变化
        app.set('value', e.color.toString())
      })

      app.observe('value', function(val) {
        $(app.find('input')).colorpicker('setValue', val)
      }, {
        init: false
      })

      app.on('expand', function() {
        $(app.find('input')).focus()
      })
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