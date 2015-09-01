/**
 * 展示筛选结果
 */
define([
	'jquery', 'ractive', 'moment', 'tmpl', 'lodash', 'components/filter'
], function($, Ractive, moment, tmpl, _) {
	
	var widget = Ractive.extend({
		template: tmpl.result,
		isolated: true,
		oninit: function() {
			var self = this;
			
		}
	})

	Ractive.components.result = widget

	return widget
})
