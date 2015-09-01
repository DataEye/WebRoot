/**
 * 弹出框，基于ractive, bootstrap tooltip, bootstrap popover
 */

define([
	'jquery', 'ractive',
	'bootstrap/tooltip', 'bootstrap/popover'
], function($, Ractive) {
	'use strict'

	/**
	 * tooltip decorator
	 * @param {[HTMLElement]} node    默认参数，node节点
	 * @param {[Object|String]} options 配置参数，遵循bootstrap原生配置
	 */
	function PopoverDecorator(node, options) {
		var defaults = {html: true, trigger: 'click', placement: 'bottom'}
		if ($.type(options) === 'string')
			options = $.extend({content: options}, defaults)

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
