/**
 * 提示框，基于ractive, bootstrap tooltip
 *
 * Multiple-line links
 * Sometimes you want to add a tooltip to a hyperlink that wraps multiple lines.
 * The default behavior of the tooltip plugin is to center it horizontally and vertically.
 * Add white-space: nowrap; to your anchors to avoid this.
 */

define(['jquery', 'ractive', 'bootstrap/tooltip'], function($, Ractive) {
  'use strict'

  /**
   * tooltip decorator
   * @param {[HTMLElement]} node    默认参数，node节点
   * @param {[Object|String]} options 配置参数，遵循bootstrap原生配置
   */
  function TooltipDecorator(node, options) {
    var defaults = {
      html: true,
      placement: 'right',
      trigger: 'hover'
    }

    if ($.type(options) === 'string') options = {
      title: options
    }

    options = $.extend(defaults, options)

    $(node).tooltip(options)

    return {
      teardown: function() {
        // ref: http://stackoverflow.com/questions/2008592/can-i-find-events-bound-on-an-element-with-jquery
        $(node).tooltip('destroy')
      }
    }
  }

  Ractive.decorators.tooltip = TooltipDecorator

  return TooltipDecorator
})
