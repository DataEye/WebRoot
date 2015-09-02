define(['jquery', 'ractive', 'tmpl', 'lodash', 'components/menu-clean'], function($, Ractive, tmpl, _, clearMenus) {
	/**
	 * 调整下拉框的位置，在底部可能被遮挡
	 */
	function adjustPosition(node, margin) {
		var offset = node.offset()
		var height = node.outerHeight()
		var totalHeight = document.documentElement.offsetHeight

		if (offset.top + height > totalHeight - margin) {
			node.css('top', -1 * height + 'px')
		}
	}

  var Dropdown = Ractive.extend({
    template: tmpl.dropdown,
    isolated: true,
    data: {
      isOpen: false
    },
    onrender: function() {
      var self = this
      var value = this.get('value')
      var items = this.get('items')

      /**
       * 数据源改变时的回调函数
       */
      function dataSourceChanged(items) {
        if (!items || !items.length) {
          self.set('value', '')
          return
        }

        var val = self.get('value')
        var selectedIndex = 0
        if (val) {
          selectedIndex = _.findIndex(items, {
            value: val
          })
          selectedIndex = selectedIndex === -1 ? 0 : selectedIndex
        }

        self.set('items.*.selected', false)
        self.set('items.' + selectedIndex + '.selected', true)
        self.set('value', self.get('items.' + selectedIndex).value)
      }

      if (!items || !items.length) {
        console.warn('dropdown:没有设置下拉框数据源')
      } else {
        // 寻找默认选择项目，如果没有则使用第一项
        var index = _.findIndex(items, {
          value: value
        })
        index = index === -1 ? 0 : index
        self.set('items.' + index + '.selected', true)
      }

      self.on('toggleShow', function(e) {
        this.toggle('isOpen')
				var ul = $(this.find('ul'))
				ul.length && adjustPosition(ul, self.get('offset') || 100)
      })

      var listener = self.observe('items', dataSourceChanged, {
        init: false
      })

      // 选中的时候先清除监听器
      self.on('select', function(e, i) {
        listener.cancel()
        this.set('value', e.context.value)
        this.set('items.*.selected', false)
        this.set('items.' + i + '.selected', true)
        this.set('isOpen', false)

        listener = self.observe('items', dataSourceChanged, {
          init: false
        })

        this.fire('changed', e, e.context.value, e.context)
      })
    }
  })

  Ractive.components.dropdown = Dropdown
  return Dropdown
})
