define([
	'jquery', 'lodash', 'ractive', 'charts', 'moment', 'tmpl', 'utils', 
	'components/async-render', 'components/result', 'components/config', 
	'components/panel', 'components/filter', 'spa'
], function($, _, Ractive, Charts, moment, tmpl, utils, AsyncRender) {
	var app
	return {
		render: function() {
			app = new Ractive({
				template: tmpl.pay_arpu,
				data: {
					filterSettings: App.filterSettings,
					suffix: App.params.appID,
					getFormData: function(tabName, custom) {
						var ret = {}
						ret[tabName] = custom && custom.id							
						return $.extend({}, postData, ret)
					}
				}
			})
			
			// 筛选条件 + 基础参数
			var postData

			// 使用异步渲染组件
			AsyncRender.init(app, '#main>.content', 3)
												
			var filter = app.findComponent('filter')

			filter.on('save', function(e, params) {
				postData = $.extend({}, App.ajaxParams, params)
				
				app.findAllComponents('panel')[0].fire('viewTab', e, 'payDis')
				app.findAllComponents('panel')[1].fire('viewTab', e, 'day')
				app.findAllComponents('panel')[2].fire('viewTab', e, 'channel')
			})

			filter.fire('save', {}, filter.getParams())
		},
		destroy: function() {
			app.teardown()
		}
	}
})
