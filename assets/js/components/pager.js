define([
	"dropdown",
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
	template: {v:3,t:[{t:4,f:[{p:[4,1,73],t:7,e:"div",a:{"class":"pager"},f:[{p:[5,3,95],t:7,e:"div",a:{"class":"pager-switch pull-left"},f:[{p:[6,5,136],t:7,e:"span",f:["每页显示"]}," ",{t:4,f:[{p:[8,5,188],t:7,e:"dropdown",a:{items:[{t:2,r:"sizes",p:[8,22,205]}],selected:[{t:2,r:"pagesize",p:[8,43,226]}]}}],n:50,x:{r:["sizes","pagesize"],s:"_0&&_1"},p:[7,5,158]}," ",{p:[10,5,259],t:7,e:"span",f:["条记录"]},"(共",{t:2,r:"totalPage",p:[10,23,277]},"页，",{t:2,r:"total",p:[10,38,292]},"条记录)"]}," ",{p:[13,3,318],t:7,e:"div",a:{"class":["pager-pagination ",{t:2,x:{r:["size"],s:"_0?\"pager-pagination-\"+_0:\"\""},p:[13,32,347]}," pull-right"]},f:[{p:[14,5,407],t:7,e:"ul",a:{"class":"pagination"},f:[{p:[15,7,437],t:7,e:"li",a:{"class":["first ",{t:2,x:{r:["pageid"],s:"_0===1?\"disabled\":\"\""},p:[15,24,454]}]},m:[{t:4,f:["on-click=\"goto:1\""],n:50,x:{r:["pageid"],s:"_0!==1"},p:[16,9,498]}],f:[{p:[17,9,554],t:7,e:"a",a:{href:"javascript:;"},f:[{p:[18,11,588],t:7,e:"i",a:{"class":"fa fa-step-backward"}}]}]}," ",{p:[21,7,655],t:7,e:"li",a:{"class":["prev ",{t:2,x:{r:["pageid"],s:"_0===1?\"disabled\":\"\""},p:[21,23,671]}]},m:[{t:4,f:["on-click=\"goto:",{t:2,x:{r:["pageid"],s:"_0-1"},p:[22,47,753]},"\""],n:50,x:{r:["pageid"],s:"_0!==1"},p:[22,11,717]}],f:[{p:[23,9,786],t:7,e:"a",a:{href:"javascript:;"},f:[{p:[24,11,820],t:7,e:"i",a:{"class":"fa fa-backward"}}]}]}," ",{t:4,f:[{p:[29,7,900],t:7,e:"li",a:{"class":[{t:2,x:{r:["pageid","."],s:"_0===_1?\"active\":\"\""},p:[29,18,911]}]},f:[{p:[30,9,954],t:7,e:"a",a:{href:"javascript:;"},v:{click:{n:"goto",d:[{t:2,r:".",p:[30,48,993]}]}},f:[{t:2,r:".",p:[30,55,1000]}]}]}],r:"pages",p:[28,7,883]}," ",{p:[34,7,1046],t:7,e:"li",a:{"class":["next ",{t:2,x:{r:["pageid","totalPage"],s:"_0===_1?\"disabled\":\"\""},p:[34,23,1062]}]},m:[{t:4,f:["on-click=\"goto:",{t:2,x:{r:["pageid"],s:"_0+1"},p:[35,55,1160]},"\""],n:50,x:{r:["pageid","totalPage"],s:"_0!==_1"},p:[35,11,1116]}],f:[{p:[36,9,1193],t:7,e:"a",a:{href:"javascript:;"},f:[{p:[37,11,1227],t:7,e:"i",a:{"class":"fa fa-forward"}}]}]}," ",{p:[40,7,1288],t:7,e:"li",a:{"class":["last ",{t:2,x:{r:["pageid","totalPage"],s:"_0===_1?\"disabled\":\"\""},p:[40,23,1304]}]},m:[{t:4,f:["on-click=\"goto:",{t:2,r:"totalPage",p:[41,55,1402]},"\""],n:50,x:{r:["pageid","totalPage"],s:"_0!==_1"},p:[41,11,1358]}],f:[{p:[42,9,1434],t:7,e:"a",a:{href:"javascript:;"},f:[{p:[42,32,1457],t:7,e:"i",a:{"class":"fa fa-step-forward"}}]}]}]}]}," ",{p:[47,3,1530],t:7,e:"div",a:{style:"clear: both;"}}]}],n:51,r:"hidden",p:[3,1,61]}]},
	components:{	dropdown: __import0__}
},
component={},
__prop__,
__export__;

  var _ = require('lodash')

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