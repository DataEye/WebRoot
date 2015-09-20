define([
	"jquery",
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
	template: {v:3,t:[{p:[1,1,0],t:7,e:"div",a:{"class":["btn-group dropdown dropdown-select ",{t:2,x:{r:["isOpen"],s:"_0?\"open\":\"\""},p:[1,48,47]}],style:"display: inline-block;"},f:[{p:[3,3,112],t:7,e:"button",a:{"class":"btn btn-select dropdown-toggle",type:"button"},v:{click:{n:[{t:2,x:{r:["items.length"],s:"_0?\"toggleShow\":\"\""},p:[4,21,193]}],d:[]}},f:[{t:4,f:[{t:4,f:[{t:4,f:[{p:[8,11,309],t:7,e:"i",a:{"class":["fa ",{t:2,r:"icon",p:[8,24,322]}]}}],r:"icon",p:[7,9,289]}," ",{t:2,r:"label",p:[11,9,364]}],n:50,x:{r:[".value","selected"],s:"_0===_1"},p:[6,7,253]}],r:"items",p:[5,5,236]},{t:4,n:51,f:[{t:2,x:{r:["emptyText"],s:"_0||\"暂无数据\""},p:[14,7,407]}],r:"items"}," ",{p:[17,5,451],t:7,e:"span",a:{"class":"caret"}}]}," ",{t:4,f:[{p:[21,3,508],t:7,e:"ul",a:{"class":"dropdown-menu",style:"display: block;min-width: inherit;max-height: 200px; overflow: auto;"},f:[{t:4,f:[{p:[23,5,633],t:7,e:"li",a:{"class":[{t:2,x:{r:[".value","selected"],s:"_0===_1?\"selected-dropdown-menu\":\"\""},p:[23,16,644]}]},v:{click:{n:"select",d:[{t:2,r:"i",p:[23,90,718]}]}},f:[{p:[24,7,732],t:7,e:"a",a:{tabindex:"-1",href:"javascript:;"},f:[{t:4,f:[{p:[26,9,796],t:7,e:"i",a:{"class":["fa ",{t:2,r:"icon",p:[26,22,809]}]}}],r:"icon",p:[25,9,778]}," ",{t:2,r:"label",p:[28,9,850]}]}]}],i:"i",r:"items",p:[22,5,616]},{t:4,n:51,f:[{p:[32,5,898],t:7,e:"li",a:{"class":""},f:[{p:[33,7,918],t:7,e:"a",a:{href:"javascript:;"},f:[{t:2,x:{r:["emptyText"],s:"_0||\"暂无数据\""},p:[34,9,950]}]}]}],r:"items"}]}],r:"isOpen",p:[20,3,494]}]}]},
},
component={},
__prop__,
__export__;

  /**
   * 使用方式
   * <dropdown items="{{items}}" selected="{{value}}" on-itemchange="selectChange" />
   * list = [{label: 'X', value: '1'}]
   */
  var $ = require('jquery')
  var _ = require('lodash')
  var MSG = {
    SET_VALUE_MANUALLY: '变更数据源后请主动更新value',
    EMPTY_DATA: '数据源items为空',
    INVALID_VALUE: '当前设置value未找到'
  }

  /**
   * 调整下拉框的位置，避免在底部被遮挡
   * 使用fixed，有些scroll的容器不好处理
   */
  function adjustPosition(node, btn, margin) {
    var offset = btn[0].getBoundingClientRect()
    var height = node.outerHeight()
    var docHeight = document.documentElement.clientHeight
    var docWidth = document.documentElement.clientWidth
    var btnHeight = btn.outerHeight()
    var width = node.width()
    var goDown = docHeight - margin > offset.top + btnHeight + height
    var leftPadding = docWidth - offset.left - width
    var left = offset.left
    if (leftPadding < 0) {
      // magic number here
      left = left + leftPadding - 20
    }

    /**
     * 使用fixed最简单
     * 绝对定位在scroll的容器中问题很多，第一是定位问题，第二是展示问题
     * 比如容器高度只有100，下拉框高毒是200如何展示。
     */
    node.css({
      position: 'fixed',
      width: width + 'px',
      left: left + 'px',
      top: goDown ? (offset.top + btnHeight) + 'px' : (offset.top - height) + 'px'
    })
  }

  var dropdownItems = []
  // 鼠标滚动时将下拉框关闭否则位置不对
  $('body').on('mousewheel.dropdown', function() {
    dropdownItems.forEach(function(dropdown) {
      dropdown.set('isOpen', false)
    })
  })

  component.exports = {
    isolated: true,
    data: {
      isOpen: false
    },
    onrender: function () {
      var self = this

      dropdownItems.push(self)
      /**
       * 监听数据源改变，其实只是做了数据监测
       * 检测value是否设置正确即可（需要调研方主动设置）
       */
      function onDataSourceChange(items) {
        if (Array.isArray(items) && items.length) {
          var value = self.get('selected')
          var index = _.findIndex(items, {
            value: value
          })

          if (index === -1) {
            console.warn(MSG.SET_VALUE_MANUALLY)
          }
        } else {
          console.warn(MSG.EMPTY_DATA)
        }
      }

      function onSelectedChange(value) {
        var context = _.find(self.get('items'), {value: value})
        if (!context) {
          console.warn(MSG.INVALID_VALUE)
          return
        }

        // 兼容老事件
        self.fire('changed', null, context.value, context)
        // 新的事件
        self.fire('itemchange', null, context.value, context)
      }

      self.on('toggleShow', function() {
        self.toggle('isOpen')

        var ul = $(this.find('ul'))
        var btn = $(this.find('button'))
        if (ul.length) {
          adjustPosition(ul, btn, self.get('offset') || 100)
        }
      })

      self.on('select', function(e) {
        self.set('isOpen', false)

        // 不要随便变更selected，如果修改为一个不一致的值会切断外部组件的双向绑定关系
        self.set('selected', e.context.value)
      })

      self.observe('items', onDataSourceChange)

      self.observe('selected', onSelectedChange)
    },
    onteardown: function() {
      _.remove(dropdownItems, this)
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