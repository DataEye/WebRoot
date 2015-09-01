define([
	'jquery', 'lodash', 'ractive', 'charts', 'moment', 'tmpl', 'utils', 
	'components/async-render', 'components/result', 'components/config', 
	'components/panel', 'components/filter', 'components/slider',
	'spa'
], function($, _, Ractive, Charts, moment, tmpl, utils, AsyncRender) {
	var app
	return {
		render: function() {		

			app = new Ractive({
				el: '#main>.content',
				template: tmpl.pay_cycle,
				data: {
					filterSettings: App.filterSettings,
					suffix: App.params.appID,
					getFormData: function(tabName, custom) {
						return $.extend({}, postData)
					}
				}
			})
			
			// 筛选条件 + 基础参数
			var postData

		
			// 点击其他地方隐藏站开的子面板
			$('body').on('click', function () {
				app.set('sourceDetail', null)
				app.set('ltvDetail', null)
			})
												
			var filter = app.findComponent('filter')

			filter.on('save', function(e, params) {
				postData = $.extend({}, App.ajaxParams, params)
				
			})

			filter.fire('save', {}, {})
		},
		destroy: function() {
			app.teardown()
		}
	}
})
