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
	template: {v:3,t:[{p:[1,1,0],t:7,e:"button",v:{click:{n:[{t:2,x:{r:["loading"],s:"_0?\"\":\"request\""},p:[1,19,18]}],d:[]}},a:{type:[{t:2,x:{r:["type"],s:"_0||\"button\""},p:[1,55,54]}],"class":[{t:2,r:"className",p:[2,10,85]}],disabled:[{t:2,r:"loading",p:[2,35,110]}]},f:[{t:4,f:[{t:2,r:"loadingText",p:[4,3,142]}],n:50,r:"loading",p:[3,1,124]},{t:4,n:51,f:[{t:2,r:"text",p:[6,3,169]}],r:"loading"}]}]},
},
component={},
__prop__,
__export__;

  // test 测试
  var $ = require('jquery')
  component.exports = {
    onrender: function () {
      var self = this
      this.on('request', function (e) {
        this.set('loading', true)

        var data = this.get()
        var url = $.isFunction(data.url) ? data.url() : data.url
        var formData = $.isFunction(data.data) ? data.data() : data.data

        $.post(url, formData).then(function () {
          self.fire('success', e, arguments)
        }).fail(function () {
          self.fire('error', e, arguments)
        }).always(function () {
          self.set('loading', false)
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