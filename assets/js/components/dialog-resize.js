/**
 * 弹窗高度自动管理
 */
define(['jquery', 'ractive'], function($, Ractive) {
  var resize = function(node, offset) {
    var el = $(node)
    var height = el.outerHeight() + (offset || 0)

    el.css({
      'height': (height + offset) + 'px',
      'margin-top': (-1 * height / 2) + 'px'
    })

    return {
      teardown: function() {
        el = null
      }
    }
  }

  Ractive.decorators.dialogresize = resize
  return resize
})
