define([
	"jquery",
	"bootstrap/timepicker",
	"require",
	"ractive"
], function(
	__import0__,
	__import1__,
	require,
	Ractive
){

var __options__ = {
	template: {v:3,t:[{p:[1,1,0],t:7,e:"div",a:{"class":"input-group bootstrap-timepicker"},f:[{p:[2,3,49],t:7,e:"input",a:{type:"text","class":"form-control",value:[{t:2,r:"value",p:[2,50,96]}]}}," ",{p:[3,3,112],t:7,e:"span",a:{"class":"input-group-addon add-on"},v:{click:"expand"},f:[{p:[4,5,174],t:7,e:"i",a:{"class":"fa fa-clock-o icon-time"}}]}]}]},
},
component={},
__prop__,
__export__;

  var $ = require('jquery')
  require('bootstrap/timepicker')

  /**
   * <time value="{{startTime}}" />
   */
  component.exports = {
    onrender: function() {
      var app = this
      var data = app.get()

      var options = {}
      var optionList = 'template,minuteStep,showSeconds,secondStep,defaultTime,showMeridian,showInputs,disableFocus,disableMousewheel,modalBackdrop'

      optionList.split(',').forEach(function(key) {
        if (data.hasOwnProperty(key)) {
          options[key] = data[key]
        }
      })

      // 默认24小时展示
      if (!data.hasOwnProperty('showMeridian')) {
        options.showMeridian = false
      }

      options.defaultTime = data.value || 'default'

      $(app.find('input')).timepicker(options).on('changeTime.timepicker', function(e) {
        // 同步变化
        app.set('value', e.time.value)
      })

      app.observe('value', function(val) {
        $(app.find('input')).timepicker('setTime', val)
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