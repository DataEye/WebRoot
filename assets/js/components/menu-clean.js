/**
 * ractive decorators for menu display management
 * 管理ractive插件弹出层的展示与隐藏
 */
define(['jquery', 'ractive'], function($, Ractive) {
  function hidePanel(self, field) {
    return function() {
      // 插件弹出层以 true和false控制显隐
      self.set(field, false)
    }
  }

  var clean = function(node, componentsName, field) {
    var eventName = 'click.components.' + componentsName

    var hide = hidePanel(node._ractive.root, field || 'isOpen')

    // 禁止插件点击事件冒泡，先移除插件对应的文档事件
    // 再触发其它其它对应的文档事件（隐藏自身）
    // 最后再给自己绑定对应的文档隐藏事件
    $(node).on('click', function(e) {
      e.stopPropagation()

      $(document).off(eventName)
      $(document).trigger('click.components')
      $(document).on(eventName, hide)
    })

    return {
      teardown: function() {
        $(document).off(eventName)
        $(node).off('click')
      }
    }
  }

  Ractive.decorators.cleanmenu = clean
  return clean
})
