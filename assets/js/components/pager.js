define([
	"./dropdown",
	"lodash",
	"require",
	"ractive"
], function(
	__import0__,
	__import1__,
	require,
	Ractive
){

var __options__ = {
	template: {v:3,t:[{t:4,f:[{p:[5,1,91],t:7,e:"div",a:{"class":"pager"},f:[{p:[6,3,113],t:7,e:"div",a:{"class":"pager-switch pull-left"},f:[{p:[7,5,154],t:7,e:"span",f:["每页显示"]}," ",{t:4,f:[{p:[9,5,206],t:7,e:"dropdown",a:{items:[{t:2,r:"sizes",p:[9,22,223]}],selected:[{t:2,r:"pagesize",p:[9,43,244]}]}}],n:50,x:{r:["sizes","pagesize"],s:"_0&&_1"},p:[8,5,176]}," ",{p:[11,5,277],t:7,e:"span",f:["条记录"]},"(共",{t:2,r:"totalPage",p:[11,23,295]},"页，",{t:2,r:"total",p:[11,38,310]},"条记录)"]}," ",{p:[14,3,336],t:7,e:"div",a:{"class":["pager-pagination ",{t:2,x:{r:["size"],s:"_0?\"pager-pagination-\"+_0:\"\""},p:[14,32,365]}," pull-right"]},f:[{p:[15,5,425],t:7,e:"ul",a:{"class":"pagination"},f:[{p:[16,7,455],t:7,e:"li",a:{"class":["first ",{t:2,x:{r:["pageid"],s:"_0===1?\"disabled\":\"\""},p:[16,24,472]}]},m:[{t:4,f:["on-click=\"goto:1\""],n:50,x:{r:["pageid"],s:"_0!==1"},p:[17,9,516]}],f:[{p:[18,9,572],t:7,e:"a",a:{href:"javascript:;"},f:[{p:[19,11,606],t:7,e:"i",a:{"class":"fa fa-step-backward"}}]}]}," ",{p:[22,7,673],t:7,e:"li",a:{"class":["prev ",{t:2,x:{r:["pageid"],s:"_0===1?\"disabled\":\"\""},p:[22,23,689]}]},m:[{t:4,f:["on-click=\"goto:",{t:2,x:{r:["pageid"],s:"_0-1"},p:[23,47,771]},"\""],n:50,x:{r:["pageid"],s:"_0!==1"},p:[23,11,735]}],f:[{p:[24,9,804],t:7,e:"a",a:{href:"javascript:;"},f:[{p:[25,11,838],t:7,e:"i",a:{"class":"fa fa-backward"}}]}]}," ",{t:4,f:[{p:[30,7,918],t:7,e:"li",a:{"class":[{t:2,x:{r:["pageid","."],s:"_0===_1?\"active\":\"\""},p:[30,18,929]}]},f:[{p:[31,9,972],t:7,e:"a",a:{href:"javascript:;"},v:{click:{n:"goto",d:[{t:2,r:".",p:[31,48,1011]}]}},f:[{t:2,r:".",p:[31,55,1018]}]}]}],r:"pages",p:[29,7,901]}," ",{p:[35,7,1064],t:7,e:"li",a:{"class":["next ",{t:2,x:{r:["pageid","totalPage"],s:"_0===_1?\"disabled\":\"\""},p:[35,23,1080]}]},m:[{t:4,f:["on-click=\"goto:",{t:2,x:{r:["pageid"],s:"_0+1"},p:[36,55,1178]},"\""],n:50,x:{r:["pageid","totalPage"],s:"_0!==_1"},p:[36,11,1134]}],f:[{p:[37,9,1211],t:7,e:"a",a:{href:"javascript:;"},f:[{p:[38,11,1245],t:7,e:"i",a:{"class":"fa fa-forward"}}]}]}," ",{p:[41,7,1306],t:7,e:"li",a:{"class":["last ",{t:2,x:{r:["pageid","totalPage"],s:"_0===_1?\"disabled\":\"\""},p:[41,23,1322]}]},m:[{t:4,f:["on-click=\"goto:",{t:2,r:"totalPage",p:[42,55,1420]},"\""],n:50,x:{r:["pageid","totalPage"],s:"_0!==_1"},p:[42,11,1376]}],f:[{p:[43,9,1452],t:7,e:"a",a:{href:"javascript:;"},f:[{p:[43,32,1475],t:7,e:"i",a:{"class":"fa fa-step-forward"}}]}]}]}]}," ",{p:[48,3,1548],t:7,e:"div",a:{style:"clear: both;"}}]}],n:51,r:"hidden",p:[4,1,79]}]},
	components:{	dropdown: __import0__}
},
component={},
__prop__,
__export__;

  var _ = require('lodash')
  //xxx
  component.exports = {
    isolated: true,
    data: {
      // 条数小于最小值不展示分页组件
      hideOnMin: true
    },
    computed: {
      hidden: function() {
        // 小于最小的页大小时隐藏
        var min = Math.min.apply(Math, _.values(this.get('sizes')))
        return this.get('hideOnMin') && this.get('total') < min
      },
      totalPage: function() {
        var total = this.get('total')
        var size = this.get('pagesize')

        return size > 0 && total > 0 && Math.ceil(total / size)
      }
    },
    onrender: function() {
      var app = this
      /**
       * 这几个配置需要建立双向绑定，需要外部设置
       * pageid 页码
       * pagesize 当前页大小
       * total 总条数
       */
      var props = ['pageid', 'pagesize', 'total']
      _.each(props, function(prop) {
        if (typeof app.get(prop) !== 'number') {
          throw new Error('请手动配置属性' + prop)
        }
      })

      /**
       * sizes 可选页大小
       */
       if (!app.get('sizes')) {
        app.set('pagesize', 10)
        app.set('sizes', [
          {label: '10', value: 10},
          {label: '20', value: 20},
          {label: '50', value: 50}
        ])
      }

      /**
       * width 右侧页面宽度 |< < 8 9 10 11 12 > >|
       */
      if (!app.get('width')) {
        app.set('width', 2)
      }

      /**
       * 跳转到指定页码
       */
      function onPageChange(pageid) {
        var total = app.get('total')
        var width = app.get('width')
        var totalPage = app.get('totalPage')
        var start = Math.max(1, pageid - width)
        var end = Math.min(pageid + width, totalPage)

        var items = []
        for (var i = start; i <= end; i++) {
          items.push(i)
        }

        var paddingLen = width * 2 + 1 - items.length
        // 边界处理
        if (paddingLen > 0) {
          for (var i = 1; i <= paddingLen; i++) {
            // 尾部
            if (start === 1 && i + end <= totalPage) {
              items.push(i + end)
            }
            // 头部
            if (end === totalPage && start - i >= 1) {
              items.unshift(start - i)
            }
          }
        }

        app.set('pages', items)
        // 触发页码转换事件
        app.fire('pagechange', null, app.get())
      }

      /**
       * pagesize和total发生改变
       * 只需要更新总页数，然后选中第一页就可以了
       */
      function onTotalPageChange() {
        var current = app.get('pageid')
        if (current === 1) {
          onPageChange(1)
        } else {
          app.set('pageid', 1)
        }
      }

      app.on('goto', function(e, pageid) {
        app.set('pageid', pageid)
      })

      app.observe('pageid', onPageChange)
      app.observe('pagesize total', onTotalPageChange, {
        init: false
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