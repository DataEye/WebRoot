define([
	"jquery",
	"components/menu-clean",
	"require",
	"ractive"
], function(
	__import0__,
	__import1__,
	require,
	Ractive
){

var __options__ = {
	template: {v:3,t:[{t:4,f:[{p:[2,1,12],t:7,e:"a",a:{href:"javascript:;"},o:{n:"cleanmenu",d:[" ",{t:2,x:{r:["id"],s:"_0?\"download-\"+_0:\"download\""},p:[2,46,57]}]},v:{click:"generateReport"},f:[{p:[4,3,129],t:7,e:"i",a:{"class":"fa fa-download"}}]}," ",{t:4,f:[{p:[7,1,177],t:7,e:"div",a:{"class":"tooltip fade bottom in download-box"},f:[{p:[8,3,229],t:7,e:"div",a:{"class":"tooltip-arrow"}}," ",{p:[9,3,265],t:7,e:"div",a:{"class":"tooltip-inner"},f:[{t:4,f:[{p:[11,5,317],t:7,e:"i",a:{"class":"fa fa-spinner fa-pulse"}}," 正在提交下载任务，请稍候..."],n:50,r:"loading",p:[10,5,297]}," ",{t:4,f:["下载任务已提交,请前往",{p:[16,16,426],t:7,e:"a",a:{"class":"blue-light",target:"_blank",href:"#/settings/download"},f:["下载中心"]},"查看进度。"],n:50,r:"generated",p:[15,5,393]}," ",{t:4,f:["数据为空"],n:50,r:"empty",p:[19,5,522]}]}]}],r:"isOpen",p:[6,1,165]}],n:50,r:"url",p:[1,1,0]}]},
},
component={},
__prop__,
__export__;

  var $ = require('jquery')
  require('components/menu-clean')

  function wrapError(xhr) {
    if (xhr.responseJSON)
      return xhr.responseJSON

    return {
      statusCode: xhr.status,
      content: xhr.responseText + xhr.statusText ,
      id: Date.now()
    }
  }

  component.exports = {
    data: {
      loading: false,
      generated: false
    },
    onrender: function() {
      var app = this

      app.on('generateReport', function() {
        var url = app.get('url')
        var data = app.get('data') || {}

        if (!url) {
          console.log('没有配置url')
          return
        }

        app.set('loading', true)
        app.set('generated', false)
        app.set('empty', false)
        app.set('isOpen', true)
        $.post(url, data).then(function(json) {
          var status = json.statusCode
          app.set('generated', status == 200)
          app.set('empty', status == 201)
        }).fail(function(xhr) {
          app.set('ajaxError', wrapError(xhr))
        }).always(function() {
          app.set('loading', false)
        })
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