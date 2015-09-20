/**
 * 弹出框，基于ractive, bootstrap tooltip, bootstrap popover
 *
 * http://v3.bootcss.com/javascript/#popovers
 * 实现“点击并让弹出框消失”的效果需要一些额外的代码
 * 为了更好的跨浏览器和跨平台效果，你必须使用 <a> 标签，不能使用 <button> 标签，并且，
 * 还必须包含 role="button" 和 tabindex 属性。
 */

define(['jquery', 'ractive', 'bootstrap/tooltip', 'bootstrap/popover'], function($, Ractive) {
  'use strict'

  /**
   * tooltip decorator
   * @param {[HTMLElement]} node    默认参数，node节点
   * @param {[Object|String]} options 配置参数，遵循bootstrap原生配置
   */
  function PopoverDecorator(node, options) {
    var defaults = {
      html: true,
      trigger: 'click',
      placement: 'bottom'
    }
    if ($.type(options) === 'string') {
      options = $.extend({
        content: options
      }, defaults)
    }

    options = $.isPlainObject(options) ? $.extend({}, defaults, options) : defaults

    $(node).popover(options)

    return {
      teardown: function() {
        $(node).popover('destroy')
      }
    }
  }

  Ractive.decorators.popover = PopoverDecorator

  return PopoverDecorator
})
